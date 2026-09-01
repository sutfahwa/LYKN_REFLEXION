-- ============================================================
-- Phase 5 — หลักฐาน (evidence) + admin review flow + กระดิ่งแจ้งเตือน
-- ============================================================

-- notifications ต้องมี created_at เพื่อเรียงลำดับกระดิ่งแจ้งเตือนได้
-- (sent_at เป็น null จนกว่าจะส่งอีเมลจริงใน Phase 6, ใช้เรียงลำดับไม่ได้)
alter table notifications add column created_at timestamptz not null default now();
create index notifications_user_created_idx on notifications (user_id, created_at desc);

-- ------------------------------------------------------------
-- Storage: อนุญาตให้เจ้าของ claim อัปโหลดหลักฐานลงโฟลเดอร์ของตัวเองได้
-- โดยชื่อไฟล์ต้องขึ้นต้นด้วย {claim_id}/... และ claim_id นั้นต้องเป็นของ
-- ผู้ใช้ที่ login อยู่เท่านั้น — ไม่มี policy select ให้เลย (อ่านได้ผ่าน
-- signed URL ที่ Edge Function สร้างให้เท่านั้น ตามกติกาความปลอดภัย)
-- ------------------------------------------------------------
create policy evidence_insert_own on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'evidence'
    and exists (
      select 1 from claims c
      where c.id::text = (storage.foldername(name))[1]
        and c.owner_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- submit_evidence: บันทึกหลักฐานที่อัปโหลดแล้ว ผูกกับ claim ของตัวเอง
-- ------------------------------------------------------------
create or replace function submit_evidence(
  p_claim_id uuid,
  p_owner_id uuid,
  p_type evidence_type,
  p_file_key text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim claims%rowtype;
  v_evidence_id uuid;
begin
  select * into v_claim from claims where id = p_claim_id;

  if v_claim.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  if v_claim.owner_id != p_owner_id then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;

  if v_claim.deleted_at is not null then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_DELETED');
  end if;

  insert into evidences (claim_id, type, file_key)
  values (p_claim_id, p_type, p_file_key)
  returning id into v_evidence_id;

  return jsonb_build_object('ok', true, 'evidence_id', v_evidence_id);
end;
$$;

revoke execute on function submit_evidence(uuid, uuid, evidence_type, text) from public, anon, authenticated;
grant execute on function submit_evidence(uuid, uuid, evidence_type, text) to service_role;

-- ------------------------------------------------------------
-- admin_review_evidence: แอดมินตัดสินหลักฐาน 1 ชิ้น (ผ่าน/ไม่ผ่าน)
-- ผ่าน -> claim กลายเป็น VERIFIED (ถ้ายังไม่ได้อยู่ระหว่างตรวจสอบข้อพิพาท)
-- ไฟล์จริงถูกลบทันทีหลังตรวจ — ฝั่ง Edge Function เป็นคนเรียก storage
-- .remove() ต่อจาก RPC นี้สำเร็จ (SQL เข้าไม่ถึง object storage โดยตรง)
-- ------------------------------------------------------------
create or replace function admin_review_evidence(
  p_evidence_id uuid,
  p_result evidence_review_result,
  p_reviewed_by uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_evidence evidences%rowtype;
  v_claim claims%rowtype;
begin
  select * into v_evidence from evidences where id = p_evidence_id;
  if v_evidence.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  update evidences
  set review_result = p_result, reviewed_by = p_reviewed_by, reviewed_at = now(), deleted_at = now()
  where id = p_evidence_id;

  select * into v_claim from claims where id = v_evidence.claim_id;

  if p_result = 'APPROVED' and v_claim.status = 'REGISTERED' then
    update claims set status = 'VERIFIED', verified_at = now(), verified_by = p_reviewed_by
    where id = v_claim.id;
    perform invalidate_seat_check_cache(v_claim.seat_key);
  end if;

  insert into notifications (user_id, event_type, payload)
  values (v_claim.owner_id, 'EVIDENCE_RESULT', jsonb_build_object(
    'evidence_id', p_evidence_id, 'result', p_result, 'seat_key', v_claim.seat_key
  ));

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_reviewed_by, 'REVIEW_EVIDENCE', 'evidence', p_evidence_id,
    jsonb_build_object('review_result', v_evidence.review_result),
    jsonb_build_object('review_result', p_result));

  return jsonb_build_object('ok', true, 'file_key', v_evidence.file_key);
end;
$$;

revoke execute on function admin_review_evidence(uuid, evidence_review_result, uuid) from public, anon, authenticated;
grant execute on function admin_review_evidence(uuid, evidence_review_result, uuid) to service_role;

-- ------------------------------------------------------------
-- admin_resolve_review: แอดมินตัดสินเคสข้อพิพาท
-- OWNER_CONFIRMED -> เลือกผู้ชนะ (p_winning_claim_id) เป็น VERIFIED,
--   claim อื่นในเคสเดียวกัน soft delete + tombstone
-- FALSE_CLAIM_REMOVED -> ลบ claim ที่ระบุว่าเป็นเท็จ (p_false_claim_id)
--   claim ที่เหลือกลับไปเป็น REGISTERED (ให้ผู้ใช้ส่งหลักฐานยืนยันต่อได้)
-- อื่นๆ (PENDING/AWAITING_EVIDENCE/INCONCLUSIVE) -> แค่บันทึกสถานะ+โน้ต
-- ------------------------------------------------------------
create or replace function admin_resolve_review(
  p_review_id uuid,
  p_outcome review_outcome_type,
  p_admin_note text,
  p_resolved_by uuid,
  p_winning_claim_id uuid,
  p_false_claim_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_review reviews%rowtype;
  v_claim_id uuid;
  v_other_claim claims%rowtype;
  v_is_resolved boolean;
begin
  select * into v_review from reviews where id = p_review_id;
  if v_review.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  v_is_resolved := p_outcome in ('OWNER_CONFIRMED', 'FALSE_CLAIM_REMOVED', 'INCONCLUSIVE');

  update reviews
  set review_outcome = p_outcome, admin_note = p_admin_note,
    resolved_by = p_resolved_by, resolved_at = case when v_is_resolved then now() else null end
  where id = p_review_id;

  if p_outcome = 'OWNER_CONFIRMED' and p_winning_claim_id is not null then
    update claims set status = 'VERIFIED', verified_at = now(), verified_by = p_resolved_by
    where id = p_winning_claim_id;

    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id and rc.claim_id != p_winning_claim_id
    loop
      select * into v_other_claim from claims where id = v_claim_id;
      update claims set deleted_at = now(), deleted_by = p_resolved_by, delete_reason = 'review_lost'
      where id = v_claim_id;
      insert into seat_tombstones (show_id, seat_key) values (v_other_claim.show_id, v_other_claim.seat_key);
      insert into notifications (user_id, event_type, payload)
      values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));
    end loop;

    select * into v_other_claim from claims where id = p_winning_claim_id;
    perform invalidate_seat_check_cache(v_other_claim.seat_key);
    insert into notifications (user_id, event_type, payload)
    values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));

  elsif p_outcome = 'FALSE_CLAIM_REMOVED' and p_false_claim_id is not null then
    select * into v_other_claim from claims where id = p_false_claim_id;
    update claims set deleted_at = now(), deleted_by = p_resolved_by, delete_reason = 'false_claim'
    where id = p_false_claim_id;
    insert into seat_tombstones (show_id, seat_key) values (v_other_claim.show_id, v_other_claim.seat_key);
    insert into notifications (user_id, event_type, payload)
    values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));

    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id and rc.claim_id != p_false_claim_id
    loop
      update claims set status = 'REGISTERED' where id = v_claim_id;
      select * into v_other_claim from claims where id = v_claim_id;
      perform invalidate_seat_check_cache(v_other_claim.seat_key);
      insert into notifications (user_id, event_type, payload)
      values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));
    end loop;
  end if;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_resolved_by, 'RESOLVE_REVIEW', 'review', p_review_id,
    jsonb_build_object('review_outcome', v_review.review_outcome),
    jsonb_build_object('review_outcome', p_outcome, 'admin_note', p_admin_note));

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function admin_resolve_review(uuid, review_outcome_type, text, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function admin_resolve_review(uuid, review_outcome_type, text, uuid, uuid, uuid) to service_role;
