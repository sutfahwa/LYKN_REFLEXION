-- ============================================================
-- ตัด requirement เดิมที่บังคับว่าทั้งสองฝ่ายต้องส่งหลักฐานเข้าระบบก่อน
-- ถึงจะตัดสินเคส OWNER_CONFIRMED ได้ (BOTH_MUST_SUBMIT_EVIDENCE) —
-- ในทางปฏิบัติ บางเคสเจ้าของตัวจริงติดต่อทีมงานโดยตรงนอกระบบ (เช่น
-- ฝั่งที่ยื่นข้อพิพาทมาแกล้ง/สวมสิทธิ์) แอดมินควรตัดสินได้ทันทีโดยไม่ต้อง
-- รอให้อีกฝ่ายอัปโหลดหลักฐานเข้าระบบก่อน — เอาเฉพาะ block เช็คนี้ออก
-- ส่วนอื่นของ admin_resolve_review เหมือนเดิมทุกจุด (คัดลอกมาจาก
-- 20260829090600_cleanup_evidence_on_resolve.sql แล้วตัดแค่ 8 บรรทัดนี้ออก)
-- ============================================================

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
  v_file_key text;
  v_deleted_file_keys text[] := '{}';
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
