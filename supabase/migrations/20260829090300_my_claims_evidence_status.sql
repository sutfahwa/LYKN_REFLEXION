-- ============================================================
-- my_claims_evidence_status: ให้ผู้ใช้เช็คได้ว่าบัตรของตัวเอง (แต่ละใบ) มี
-- หลักฐานที่ "ส่งไปแล้วรอตรวจ" อยู่หรือไม่ — ใช้แยกป้ายสถานะในหน้า "บัตรของฉัน"
-- ระหว่าง "รอยืนยันหลักฐาน" (ยังไม่ส่งอะไรเลย) กับ "รอตรวจสอบเอกสาร" (ส่งแล้ว
-- กำลังรอทีมงานตรวจ) โดยที่ claims.status ทั้งสองกรณียังเป็น REGISTERED เหมือนกัน
-- ============================================================

create or replace function my_claims_evidence_status(p_claim_ids uuid[])
returns table (claim_id uuid, has_pending_evidence boolean)
language sql
security definer
set search_path = public
as $$
  select c.id as claim_id,
    exists (
      select 1 from evidences e
      where e.claim_id = c.id and e.review_result = 'PENDING' and e.deleted_at is null
    ) as has_pending_evidence
  from claims c
  where c.id = any(p_claim_ids) and c.owner_id = auth.uid();
$$;

revoke execute on function my_claims_evidence_status(uuid[]) from public, anon;
grant execute on function my_claims_evidence_status(uuid[]) to authenticated;
