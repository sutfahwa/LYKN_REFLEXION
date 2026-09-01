-- ============================================================
-- ต้องระบุเหตุผลทุกครั้งที่ปฏิเสธหลักฐาน (test case กำหนดว่า reject
-- ต้องมีเหตุผลบังคับ) — เก็บไว้ใน evidences.review_note เพื่อ audit
-- (ไฟล์จริงถูกลบทันทีหลังตรวจอยู่แล้ว เหตุผลนี้คือสิ่งเดียวที่เหลืออยู่)
-- ============================================================

alter table evidences add column review_note text;

-- ต้อง drop ของเดิม (3 params) ก่อน เพราะเพิ่ม param ใหม่ทำให้กลายเป็นคนละ
-- overload กัน ถ้าปล่อยทั้งคู่ไว้ PostgREST จะ resolve ฟังก์ชันไม่ได้ (ambiguous)
drop function if exists admin_review_evidence(uuid, evidence_review_result, uuid);

create or replace function admin_review_evidence(
  p_evidence_id uuid,
  p_result evidence_review_result,
  p_reviewed_by uuid,
  p_review_note text default null
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

  if p_result = 'REJECTED' and (p_review_note is null or trim(p_review_note) = '') then
    return jsonb_build_object('ok', false, 'error', 'REASON_REQUIRED');
  end if;

  update evidences
  set review_result = p_result, review_note = p_review_note,
    reviewed_by = p_reviewed_by, reviewed_at = now(), deleted_at = now()
  where id = p_evidence_id;

  select * into v_claim from claims where id = v_evidence.claim_id;

  if p_result = 'APPROVED' and v_claim.status = 'REGISTERED' then
    update claims set status = 'VERIFIED', verified_at = now(), verified_by = p_reviewed_by
    where id = v_claim.id;
    perform invalidate_seat_check_cache(v_claim.seat_key);
  end if;

  insert into notifications (user_id, event_type, payload)
  values (v_claim.owner_id, 'EVIDENCE_RESULT', jsonb_build_object(
    'evidence_id', p_evidence_id, 'result', p_result, 'seat_key', v_claim.seat_key, 'note', p_review_note
  ));

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_reviewed_by, 'REVIEW_EVIDENCE', 'evidence', p_evidence_id,
    jsonb_build_object('review_result', v_evidence.review_result),
    jsonb_build_object('review_result', p_result, 'review_note', p_review_note));

  return jsonb_build_object('ok', true, 'file_key', v_evidence.file_key);
end;
$$;

revoke execute on function admin_review_evidence(uuid, evidence_review_result, uuid, text) from public, anon, authenticated;
grant execute on function admin_review_evidence(uuid, evidence_review_result, uuid, text) to service_role;
