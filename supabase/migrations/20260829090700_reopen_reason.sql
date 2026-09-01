-- ============================================================
-- ตอนแอดมินส่งบัตร "ยืนยันแล้ว" กลับไป "รอตรวจสอบหลักฐาน" ใหม่ (ผ่านปุ่ม
-- เปลี่ยนสถานะ) ต้องบังคับใส่เหตุผล และผู้ใช้ต้องเห็นเหตุผลนั้นได้ (ผ่าน
-- tooltip ที่หน้าบัตรของฉัน) — เก็บไว้แยกจาก evidence_reject_reason เพราะ
-- คนละกรณีกัน (นี่คือแอดมินสั่งพิจารณาใหม่ ไม่ใช่ตรวจหลักฐานแล้วไม่ผ่าน)
-- ============================================================

alter table claims add column reopen_reason text;

-- ------------------------------------------------------------
-- admin_set_claim_status: บังคับใส่เหตุผลเสมอ (ปุ่มนี้ตอนนี้เหลือ flow เดียว
-- คือส่งบัตรยืนยันแล้วกลับไปพิจารณาใหม่) และเก็บเหตุผลไว้ให้ user เห็น
-- ------------------------------------------------------------
create or replace function admin_set_claim_status(
  p_claim_id uuid,
  p_status claim_status,
  p_admin_note text,
  p_admin_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim claims%rowtype;
begin
  select * into v_claim from claims where id = p_claim_id;
  if v_claim.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  if v_claim.status = 'UNDER_REVIEW' then
    return jsonb_build_object('ok', false, 'error', 'DISPUTE_IN_PROGRESS');
  end if;

  if p_admin_note is null or trim(p_admin_note) = '' then
    return jsonb_build_object('ok', false, 'error', 'REASON_REQUIRED');
  end if;

  update claims
  set status = p_status,
    verified_at = case when p_status = 'VERIFIED' then now() else verified_at end,
    verified_by = case when p_status = 'VERIFIED' then p_admin_id else verified_by end,
    reopen_reason = case when p_status = 'REGISTERED' then p_admin_note else reopen_reason end
  where id = p_claim_id;

  perform invalidate_seat_check_cache(v_claim.seat_key);

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'SET_CLAIM_STATUS', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status),
    jsonb_build_object('status', p_status, 'admin_note', p_admin_note));

  -- หมายเหตุ: ไม่ insert เข้า notifications เพราะฟีเจอร์แจ้งเตือน (กระดิ่ง) ถูก
  -- พักไว้ทั้งเว็บแล้ว (เอาออกจากทุกหน้าตามที่ตกลงกันไว้ก่อนหน้านี้) — เหตุผลที่
  -- ผู้ใช้เห็นตอนนี้มาจาก claims.reopen_reason ที่แสดงผ่าน tooltip ในหน้าโปรไฟล์แทน

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function admin_set_claim_status(uuid, claim_status, text, uuid) from public, anon, authenticated;
grant execute on function admin_set_claim_status(uuid, claim_status, text, uuid) to service_role;

-- ------------------------------------------------------------
-- submit_evidence: ส่งหลักฐานใหม่มาแล้ว ล้าง reopen_reason ทิ้งด้วย (ไม่งั้น
-- ถ้าโดนปฏิเสธแล้ววนกลับมา REGISTERED อีกรอบ จะโชว์เหตุผลเก่าที่ไม่เกี่ยวแล้ว)
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
  v_old_pending_id uuid;
  v_old_file_key text;
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

  if v_claim.status = 'VERIFIED' then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_VERIFIED');
  end if;

  if v_claim.status = 'REJECTED' then
    return jsonb_build_object('ok', false, 'error', 'CLAIM_REJECTED_FINAL');
  end if;

  select id, file_key into v_old_pending_id, v_old_file_key
  from evidences
  where claim_id = p_claim_id and review_result = 'PENDING' and deleted_at is null
  order by submitted_at desc
  limit 1;

  if v_old_pending_id is not null then
    update evidences set deleted_at = now() where id = v_old_pending_id;
  end if;

  insert into evidences (claim_id, type, file_key)
  values (p_claim_id, p_type, p_file_key)
  returning id into v_evidence_id;

  update claims set
    evidence_requested_at = null,
    reopen_reason = null,
    status = case when status = 'EVIDENCE_REJECTED' then 'REGISTERED' else status end,
    evidence_reject_reason = case when status = 'EVIDENCE_REJECTED' then null else evidence_reject_reason end
  where id = p_claim_id;

  return jsonb_build_object('ok', true, 'evidence_id', v_evidence_id, 'replaced_file_key', v_old_file_key);
end;
$$;

revoke execute on function submit_evidence(uuid, uuid, evidence_type, text) from public, anon, authenticated;
grant execute on function submit_evidence(uuid, uuid, evidence_type, text) to service_role;
