-- ============================================================
-- Phase 4 — เปิดให้ user อ่านข้อมูล "ของตัวเอง" ตรงผ่าน Supabase client
-- ได้เลย (ไม่ต้องผ่าน Edge Function) เพราะไม่มีความเสี่ยงรั่วข้อมูลคนอื่น:
-- claims กรองด้วย owner_id = auth.uid() เท่านั้น, reviews/review_claims
-- มองเห็นได้เฉพาะเคสที่ตัวเองมี claim ผูกอยู่ (เห็นแค่ว่ามีเคส/สถานะ
-- อะไร ไม่เห็นตัวตนอีกฝ่ายเลย เพราะ claims ของอีกฝ่ายยังถูก RLS บล็อก
-- อยู่เหมือนเดิม)
-- ============================================================

create policy claims_select_own on claims
  for select
  to authenticated
  using (auth.uid() = owner_id);

create policy review_claims_select_own on review_claims
  for select
  to authenticated
  using (
    exists (
      select 1 from claims c
      where c.id = review_claims.claim_id and c.owner_id = auth.uid()
    )
  );

create policy reviews_select_own on reviews
  for select
  to authenticated
  using (
    exists (
      select 1 from review_claims rc
      join claims c on c.id = rc.claim_id
      where rc.review_id = reviews.id and c.owner_id = auth.uid()
    )
  );
