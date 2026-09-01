-- ============================================================
-- ส่งหลักฐานซ้ำ: ให้มีได้แค่ 1 ไฟล์ที่ "รอตรวจ" ต่อบัตร ณ เวลาใดเวลาหนึ่ง
-- ส่งใหม่ทับของเดิมได้ (ของเดิมที่ยังไม่ตรวจจะถูกแทนที่ ไม่ใช่ค้างซ้อนกัน)
-- ============================================================

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
  update claims set evidence_requested_at = null where id = p_claim_id;

  return jsonb_build_object('ok', true, 'evidence_id', v_evidence_id, 'replaced_file_key', v_old_file_key);
end;
$$;

revoke execute on function submit_evidence(uuid, uuid, evidence_type, text) from public, anon, authenticated;
grant execute on function submit_evidence(uuid, uuid, evidence_type, text) to service_role;

-- ------------------------------------------------------------
-- list_claim_evidence: ประวัติหลักฐานที่เคยส่งของบัตรตัวเอง (ไม่มี file_key —
-- ไฟล์จริงถูกลบทันทีหลังตรวจแล้ว เหลือแค่ผลลัพธ์ไว้ดูย้อนหลัง)
-- ------------------------------------------------------------
create or replace function list_claim_evidence(p_claim_id uuid, p_owner_id uuid)
returns table (
  id uuid, type evidence_type, review_result evidence_review_result,
  submitted_at timestamptz, reviewed_at timestamptz, is_current boolean
)
language sql
security definer
set search_path = public
as $$
  select e.id, e.type, e.review_result, e.submitted_at, e.reviewed_at,
    (e.review_result = 'PENDING' and e.deleted_at is null) as is_current
  from evidences e
  join claims c on c.id = e.claim_id
  where e.claim_id = p_claim_id and c.owner_id = p_owner_id
  order by e.submitted_at desc;
$$;

revoke execute on function list_claim_evidence(uuid, uuid) from public, anon, authenticated;
grant execute on function list_claim_evidence(uuid, uuid) to service_role;
