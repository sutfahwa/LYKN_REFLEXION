-- ============================================================
-- ปิดช่องโหว่: ตอนตัดสินข้อพิพาท (admin_resolve_review) หรือปฏิเสธบัตรตรงๆ
-- (admin_reject_claim_evidence) หลักฐานที่ยัง PENDING อยู่ของบัตรที่เกี่ยวข้อง
-- ไม่เคยถูกตัดสิน/ลบไฟล์ออกจาก storage เลย (ค้างอยู่ในระบบตลอดไปโดยไม่ตั้งใจ)
-- แก้ให้ทั้งสองจุดนี้ mark ผลตรวจ + คืนรายชื่อไฟล์ที่ต้องลบออกมาด้วย เพื่อให้
-- edge function เรียก storage.remove() ต่อได้ทันที เหมือน admin_review_evidence เดิม
-- ============================================================

-- ------------------------------------------------------------
-- 1) admin_resolve_review: เพิ่มการเก็บกวาดหลักฐาน PENDING ของทุกบัตรที่
--    เปลี่ยนสถานะเป็นผลสุดท้าย (VERIFIED/REJECTED) ตอนตัดสินเคส
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
  v_missing_evidence_count int;
  v_file_key text;
  v_deleted_file_keys text[] := '{}';
begin
  select * into v_review from reviews where id = p_review_id;
  if v_review.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  if p_outcome = 'OWNER_CONFIRMED' then
    select count(*) into v_missing_evidence_count
    from review_claims rc
    where rc.review_id = p_review_id
      and not exists (select 1 from evidences e where e.claim_id = rc.claim_id);

    if v_missing_evidence_count > 0 then
      return jsonb_build_object('ok', false, 'error', 'BOTH_MUST_SUBMIT_EVIDENCE');
    end if;
  end if;

  v_is_resolved := p_outcome in ('OWNER_CONFIRMED', 'FALSE_CLAIM_REMOVED', 'INCONCLUSIVE');

  update reviews
  set review_outcome = p_outcome, admin_note = p_admin_note,
    resolved_by = p_resolved_by, resolved_at = case when v_is_resolved then now() else null end
  where id = p_review_id;

  if p_outcome = 'OWNER_CONFIRMED' and p_winning_claim_id is not null then
    update claims set status = 'VERIFIED', verified_at = now(), verified_by = p_resolved_by
    where id = p_winning_claim_id;

    -- หลักฐาน PENDING ของผู้ชนะ -> ถือว่าผ่านไปด้วย (ลบไฟล์ทิ้ง เก็บแค่ผลตรวจ)
    update evidences set review_result = 'APPROVED', reviewed_at = now(), deleted_at = now()
    where claim_id = p_winning_claim_id and review_result = 'PENDING' and deleted_at is null
    returning file_key into v_file_key;
    if v_file_key is not null then v_deleted_file_keys := array_append(v_deleted_file_keys, v_file_key); end if;

    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id and rc.claim_id != p_winning_claim_id
    loop
      update claims set status = 'REJECTED' where id = v_claim_id;

      -- หลักฐาน PENDING ของฝ่ายที่แพ้ -> ไม่ผ่านไปด้วย (ลบไฟล์ทิ้งเช่นกัน)
      v_file_key := null;
      update evidences set review_result = 'REJECTED', reviewed_at = now(), deleted_at = now(), review_note = p_admin_note
      where claim_id = v_claim_id and review_result = 'PENDING' and deleted_at is null
      returning file_key into v_file_key;
      if v_file_key is not null then v_deleted_file_keys := array_append(v_deleted_file_keys, v_file_key); end if;

      select * into v_other_claim from claims where id = v_claim_id;
      insert into notifications (user_id, event_type, payload)
      values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));
    end loop;

    select * into v_other_claim from claims where id = p_winning_claim_id;
    perform invalidate_seat_check_cache(v_other_claim.seat_key);
    insert into notifications (user_id, event_type, payload)
    values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));

  elsif p_outcome = 'FALSE_CLAIM_REMOVED' and p_false_claim_id is not null then
    update claims set status = 'REJECTED' where id = p_false_claim_id;

    v_file_key := null;
    update evidences set review_result = 'REJECTED', reviewed_at = now(), deleted_at = now(), review_note = p_admin_note
    where claim_id = p_false_claim_id and review_result = 'PENDING' and deleted_at is null
    returning file_key into v_file_key;
    if v_file_key is not null then v_deleted_file_keys := array_append(v_deleted_file_keys, v_file_key); end if;

    select * into v_other_claim from claims where id = p_false_claim_id;
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

  elsif p_outcome = 'INCONCLUSIVE' then
    -- หาข้อสรุปไม่ได้ -> ปิดเคสนี้ไว้ก่อน แต่คืนบัตรทุกใบกลับไปเป็น REGISTERED
    -- แทนที่จะค้างเป็น UNDER_REVIEW ตลอดไป (ให้ผู้ใช้ยื่นหลักฐานเพิ่มหรือแก้ไขได้)
    -- หลักฐาน PENDING ยังไม่ตัดสิน ปล่อยรอผู้ใช้แก้ไข/ส่งใหม่ได้ตามปกติ ไม่ลบไฟล์
    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id
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

  return jsonb_build_object('ok', true, 'deleted_file_keys', to_jsonb(v_deleted_file_keys));
end;
$$;

revoke execute on function admin_resolve_review(uuid, review_outcome_type, text, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function admin_resolve_review(uuid, review_outcome_type, text, uuid, uuid, uuid) to service_role;

-- ------------------------------------------------------------
-- 2) admin_reject_claim_evidence: ตัดสินหลักฐาน PENDING ของบัตรนั้นไปด้วยว่า
--    "ไม่ผ่าน" (ใช้เหตุผลเดียวกับที่แอดมินกรอก) แล้วคืน file_key ให้ลบไฟล์ทิ้ง
-- ------------------------------------------------------------
create or replace function admin_reject_claim_evidence(
  p_claim_id uuid,
  p_admin_note text,
  p_admin_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim claims%rowtype;
  v_file_key text;
begin
  select * into v_claim from claims where id = p_claim_id;
  if v_claim.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  if v_claim.deleted_at is not null then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_DELETED');
  end if;
  if v_claim.status = 'UNDER_REVIEW' then
    return jsonb_build_object('ok', false, 'error', 'DISPUTE_IN_PROGRESS');
  end if;
  if p_admin_note is null or trim(p_admin_note) = '' then
    return jsonb_build_object('ok', false, 'error', 'REASON_REQUIRED');
  end if;

  update claims
  set status = 'EVIDENCE_REJECTED', verified_at = null, verified_by = null,
    evidence_reject_reason = p_admin_note
  where id = p_claim_id;

  update evidences set review_result = 'REJECTED', reviewed_at = now(), deleted_at = now(), review_note = p_admin_note
  where claim_id = p_claim_id and review_result = 'PENDING' and deleted_at is null
  returning file_key into v_file_key;

  perform invalidate_seat_check_cache(v_claim.seat_key);

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'REJECT_CLAIM_EVIDENCE', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status),
    jsonb_build_object('status', 'EVIDENCE_REJECTED', 'admin_note', p_admin_note));

  insert into notifications (user_id, event_type, payload)
  values (v_claim.owner_id, 'EVIDENCE_RESULT', jsonb_build_object(
    'result', 'REJECTED', 'seat_key', v_claim.seat_key, 'show_id', v_claim.show_id
  ));

  return jsonb_build_object('ok', true, 'deleted_file_key', v_file_key);
end;
$$;

revoke execute on function admin_reject_claim_evidence(uuid, text, uuid) from public, anon, authenticated;
grant execute on function admin_reject_claim_evidence(uuid, text, uuid) to service_role;
