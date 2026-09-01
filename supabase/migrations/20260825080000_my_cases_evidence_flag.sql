-- ============================================================
-- ผู้ใช้ขอปรับพฤติกรรม: ไทม์ไลน์ "เคสของฉัน" ขั้น "ช่วงส่งหลักฐาน (48 ชม.)"
-- เดิมไฮไลต์ทันทีตอนเปิดเคสเสมอ (ไม่ว่าจะมีคนส่งหลักฐานจริงหรือยัง) —
-- เปลี่ยนให้ไฮไลต์เฉพาะตอนมีฝ่ายใดฝ่ายหนึ่งส่งหลักฐานเข้ามาจริงแล้วเท่านั้น
-- โดยไม่เปิดเผยว่าเป็นฝ่ายไหนที่ส่ง (คงหลักการเดิมของฟีเจอร์นี้)
-- ============================================================

create or replace function my_cases_evidence_flags(p_review_ids uuid[])
returns table (review_id uuid, has_evidence boolean)
language sql
security definer
set search_path = public
as $$
  select rc.review_id, bool_or(e.id is not null) as has_evidence
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
