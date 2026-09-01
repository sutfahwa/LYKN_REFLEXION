-- ============================================================
-- ผู้ใช้ขอปรับไทม์ไลน์ "เคสของฉัน" เพิ่มเติม: ขั้น "ทีมงานตรวจสอบ" เดิมไฮไลต์
-- เฉพาะตอนเคสถูกตัดสินแล้วเท่านั้น (resolved_at ไม่เป็น null) — แต่ในมุมของ
-- ผู้ใช้แต่ละคน ถ้า "ตัวเอง" ส่งหลักฐานของตัวเองเรียบร้อยแล้ว ก็ถือว่าตัวเอง
-- เข้าสู่ช่วง "รอทีมงานตรวจสอบ" แล้ว ไม่ต้องรอให้อีกฝ่ายส่งหลักฐานก่อน —
-- ส่วนอีกฝ่ายที่ยังไม่ส่ง จะยังเห็นแค่ขั้น "ช่วงส่งหลักฐาน" ในมุมของตัวเอง
-- (เหมือนเดิม ไม่รู้ว่าอีกฝ่ายส่งหรือยัง — คงหลักการไม่เปิดเผยข้อมูลอีกฝ่าย)
--
-- เพิ่ม column my_evidence_submitted (เฉพาะ claim ของ auth.uid() เอง) ควบคู่
-- กับ has_evidence (ของฝ่ายใดฝ่ายหนึ่ง) เดิม — เปลี่ยนจำนวนคอลัมน์ output
-- เลยต้อง DROP FUNCTION ก่อน CREATE ใหม่
-- ============================================================

drop function if exists my_cases_evidence_flags(uuid[]);

create function my_cases_evidence_flags(p_review_ids uuid[])
returns table (review_id uuid, has_evidence boolean, my_evidence_submitted boolean)
language sql
security definer
set search_path = public
as $$
  select
    rc.review_id,
    bool_or(e.id is not null) as has_evidence,
    bool_or(e.id is not null and c.owner_id = auth.uid()) as my_evidence_submitted
  from review_claims rc
  join claims c on c.id = rc.claim_id
  left join evidences e on e.claim_id = c.id
  where rc.review_id = any(p_review_ids)
    and exists (
      select 1 from review_claims rc2
      join claims c2 on c2.id = rc2.claim_id
      where rc2.review_id = rc.review_id and c2.owner_id = auth.uid()
    )
  group by rc.review_id;
$$;

revoke execute on function my_cases_evidence_flags(uuid[]) from public, anon;
grant execute on function my_cases_evidence_flags(uuid[]) to authenticated;
