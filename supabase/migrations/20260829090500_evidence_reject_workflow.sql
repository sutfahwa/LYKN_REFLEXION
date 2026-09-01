-- ============================================================
-- Flow "ไม่ผ่านการตรวจสอบเอกสาร" (EVIDENCE_REJECTED) — แอดมินตรวจหลักฐานที่
-- ส่งมาแล้วตัดสินใจไม่อนุมัติได้เลย (แยกจากการเปิดข้อพิพาท) พร้อมเหตุผล
-- ผู้ใช้ยังแก้ไข/ส่งหลักฐานใหม่เพื่อลองอีกครั้งได้ (ไม่ใช่สถานะปิดตายแบบ REJECTED)
--
-- และ: กรณี "ที่นั่งเคยถูกตัดสิน REJECTED มาก่อน ห้ามลงทะเบียนซ้ำด้วยคนเดิม"
-- ที่เคยเพิ่มไว้ ถูกยกเลิกไปแล้ว (แก้ตรง register_claim/edit_claim ใน
-- 20260829090100 โดยตรง เพราะยังไม่เคย deploy) — ลงทะเบียนที่นั่งเดิมซ้ำได้
-- ปกติ ถ้าชนกับที่นั่งที่คนอื่นถืออยู่ก็เข้า flow ยืนยันก่อนเปิดข้อพิพาทตามปกติ
-- ============================================================

-- ------------------------------------------------------------
-- 1) เก็บเหตุผลตอนแอดมินปฏิเสธหลักฐาน (แยกจาก reviews.admin_note ของข้อพิพาท)
-- ------------------------------------------------------------
alter table claims add column evidence_reject_reason text;

-- ------------------------------------------------------------
-- 2) admin_reject_claim_evidence: ปฏิเสธบัตรตรงๆ ตอนตรวจหลักฐาน (ไม่ใช่ข้อพิพาท)
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

  perform invalidate_seat_check_cache(v_claim.seat_key);

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'REJECT_CLAIM_EVIDENCE', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status),
    jsonb_build_object('status', 'EVIDENCE_REJECTED', 'admin_note', p_admin_note));

  insert into notifications (user_id, event_type, payload)
  values (v_claim.owner_id, 'EVIDENCE_RESULT', jsonb_build_object(
    'result', 'REJECTED', 'seat_key', v_claim.seat_key, 'show_id', v_claim.show_id
  ));

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function admin_reject_claim_evidence(uuid, text, uuid) from public, anon, authenticated;
grant execute on function admin_reject_claim_evidence(uuid, text, uuid) to service_role;

-- ------------------------------------------------------------
-- 3) submit_evidence: ให้ส่งใหม่ได้ตอนสถานะ EVIDENCE_REJECTED ด้วย (ลองใหม่ได้)
--    พอส่งใหม่มา ให้กลับไปเป็น REGISTERED เพื่อเข้าคิวตรวจใหม่ตามปกติ และล้าง
--    เหตุผลเดิมทิ้ง — และกันไม่ให้ส่งหลักฐานกับบัตรที่ REJECTED ถาวรจากข้อพิพาท
--    (ส่งไปก็ไม่มีประโยชน์ เพราะที่นั่งนั้นจะไม่มีวันกลับมาเป็นชื่อนี้ได้อีก)
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

  -- มีไฟล์ที่ยังไม่ผ่านการตรวจอยู่ก่อนแล้วหรือไม่ -> แทนที่ (mark ว่าถูกแทนที่ ไม่ใช่ตัดสินผล)
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

  -- ล้าง flag "ขอหลักฐานเพิ่ม" ทิ้ง เพราะส่งมาแล้ว
  -- ถ้าเพิ่งถูกปฏิเสธเอกสารมา (EVIDENCE_REJECTED) -> กลับเข้าคิว "รอตรวจสอบหลักฐาน" ใหม่
  update claims set
    evidence_requested_at = null,
    status = case when status = 'EVIDENCE_REJECTED' then 'REGISTERED' else status end,
    evidence_reject_reason = case when status = 'EVIDENCE_REJECTED' then null else evidence_reject_reason end
  where id = p_claim_id;

  return jsonb_build_object('ok', true, 'evidence_id', v_evidence_id, 'replaced_file_key', v_old_file_key);
end;
$$;

revoke execute on function submit_evidence(uuid, uuid, evidence_type, text) from public, anon, authenticated;
grant execute on function submit_evidence(uuid, uuid, evidence_type, text) to service_role;

-- ------------------------------------------------------------
-- 4) admin_list_claims: เพิ่ม evidence_reject_reason + latest_evidence_submitted_at
--    (ไว้คำนวณ deadline 48 ชม. จากเวลาที่ "ส่งหลักฐาน" ไม่ใช่เวลาลงทะเบียน)
--    ต้อง drop ก่อนเพราะเปลี่ยนจำนวนคอลัมน์ output
-- ------------------------------------------------------------
drop function if exists admin_list_claims();

create or replace function admin_list_claims()
returns table (
  id uuid, show_id text, zone text, "row" text, seat text, seat_key text,
  x_handle text, owner_name_optional text, status claim_status,
  claimed_at timestamptz, check_count int, profile_name text,
  evidence_count bigint, latest_evidence_result evidence_review_result,
  latest_evidence_submitted_at timestamptz, evidence_reject_reason text,
  deleted_at timestamptz, delete_reason text, deleted_by_name text
)
language sql
security definer
set search_path = public
as $$
  select
    c.id, c.show_id, c.zone, c."row", c.seat, c.seat_key,
    c.x_handle, c.owner_name_optional, c.status,
    c.claimed_at, c.check_count,
    u.raw_user_meta_data ->> 'profile_name' as profile_name,
    (select count(*) from evidences e where e.claim_id = c.id) as evidence_count,
    (select e.review_result from evidences e where e.claim_id = c.id order by e.submitted_at desc limit 1) as latest_evidence_result,
    (select e.submitted_at from evidences e where e.claim_id = c.id order by e.submitted_at desc limit 1) as latest_evidence_submitted_at,
    c.evidence_reject_reason,
    c.deleted_at, c.delete_reason,
    du.raw_user_meta_data ->> 'profile_name' as deleted_by_name
  from claims c
  join auth.users u on u.id = c.owner_id
  left join auth.users du on du.id = c.deleted_by
  order by (c.deleted_at is not null) asc, c.claimed_at desc;
$$;

revoke execute on function admin_list_claims() from public, anon, authenticated;
grant execute on function admin_list_claims() to service_role;

-- ------------------------------------------------------------
-- 5) reviews.case_number: เลขเคสอ่านง่าย ให้แอดมินอ้างอิง/ค้นหาได้ (แทน uuid ดิบ)
-- ------------------------------------------------------------
alter table reviews add column case_number bigint generated always as identity;

-- ต้อง drop ก่อนเพราะเพิ่มคอลัมน์ case_number แทรกกลางลิสต์ output (เปลี่ยนทั้ง
-- จำนวนและลำดับคอลัมน์ จาก create or replace function อย่างเดียวไม่พอ)
drop function if exists admin_list_disputes();

create or replace function admin_list_disputes()
returns table (
  review_id uuid, case_number bigint, show_id text, seat_key text, review_outcome review_outcome_type,
  opened_at timestamptz, resolved_at timestamptz, admin_note text,
  claim_id uuid, x_handle text, profile_name text, claim_status claim_status, claimed_at timestamptz,
  evidence_count bigint, evidence_requested_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    r.id as review_id, r.case_number, r.show_id, r.seat_key, r.review_outcome,
    r.opened_at, r.resolved_at, r.admin_note,
    c.id as claim_id, c.x_handle,
    u.raw_user_meta_data ->> 'profile_name' as profile_name,
    c.status as claim_status, c.claimed_at,
    (select count(*) from evidences e where e.claim_id = c.id) as evidence_count,
    c.evidence_requested_at
  from reviews r
  join review_claims rc on rc.review_id = r.id
  join claims c on c.id = rc.claim_id
  join auth.users u on u.id = c.owner_id
  order by r.opened_at asc, c.claimed_at asc;
$$;

revoke execute on function admin_list_disputes() from public, anon, authenticated;
grant execute on function admin_list_disputes() to service_role;

-- ------------------------------------------------------------
-- 6) delete_claim: log ไว้ด้วย (ผู้ใช้ลบบัตรของตัวเอง)
-- ------------------------------------------------------------
create or replace function delete_claim(
  p_claim_id uuid,
  p_owner_id uuid,
  p_delete_reason text
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

  if v_claim.owner_id != p_owner_id then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;

  if v_claim.deleted_at is not null then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_DELETED');
  end if;

  if v_claim.status = 'UNDER_REVIEW' then
    return jsonb_build_object('ok', false, 'error', 'UNDER_REVIEW_LOCKED');
  end if;

  update claims
  set deleted_at = now(), deleted_by = p_owner_id, delete_reason = p_delete_reason
  where id = p_claim_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'DELETE_CLAIM', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status),
    jsonb_build_object('delete_reason', p_delete_reason));

  insert into seat_tombstones (show_id, seat_key) values (v_claim.show_id, v_claim.seat_key);

  perform invalidate_seat_check_cache(v_claim.seat_key);

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function delete_claim(uuid, uuid, text) from public, anon, authenticated;
grant execute on function delete_claim(uuid, uuid, text) to service_role;
