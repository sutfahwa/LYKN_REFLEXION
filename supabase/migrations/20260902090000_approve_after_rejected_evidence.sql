-- ============================================================
-- อนุญาตให้แอดมิน "อนุมัติ" บัตรที่เคยส่งหลักฐานแล้วถูกตรวจว่า "ไม่ผ่าน" ได้
-- โดยตรง (เผื่อกรณีคุยนอกรอบ/ตรวจหลักฐานนอกรอบแล้วมั่นใจว่าถูกต้องจริง) —
-- เดิม UI ซ่อนปุ่ม "อนุมัติ" ไว้เฉพาะตอนมีหลักฐาน PENDING เท่านั้น (ดู
-- admin/index.html canApprove) ทั้งที่ backend (quickApprove -> ไม่เจอหลักฐาน
-- PENDING -> admin-set-claim-status VERIFIED ตรงๆ) รองรับ flow นี้อยู่แล้ว
--
-- เพิ่ม latest_evidence_review_note ให้ admin_list_claims() เพื่อโชว์เหตุผลที่
-- ไม่ผ่านครั้งก่อนในกล่องยืนยันอนุมัติ ให้แอดมินเห็นก่อนตัดสินใจทับผลตรวจเดิม
-- (ต้อง drop ก่อนเพราะเปลี่ยนจำนวนคอลัมน์ output)
-- ============================================================

drop function if exists admin_list_claims();

create or replace function admin_list_claims()
returns table (
  id uuid, show_id text, zone text, "row" text, seat text, seat_key text,
  x_handle text, owner_name_optional text, status claim_status,
  claimed_at timestamptz, check_count int, profile_name text,
  evidence_count bigint, latest_evidence_result evidence_review_result,
  latest_evidence_submitted_at timestamptz, latest_evidence_review_note text,
  evidence_reject_reason text,
  deleted_at timestamptz, delete_reason text, deleted_by_name text,
  case_number bigint
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
    (select e.review_note from evidences e where e.claim_id = c.id order by e.submitted_at desc limit 1) as latest_evidence_review_note,
    c.evidence_reject_reason,
    c.deleted_at, c.delete_reason,
    du.raw_user_meta_data ->> 'profile_name' as deleted_by_name,
    c.case_number
  from claims c
  join auth.users u on u.id = c.owner_id
  left join auth.users du on du.id = c.deleted_by
  order by (c.deleted_at is not null) asc, c.claimed_at desc;
$$;

revoke execute on function admin_list_claims() from public, anon, authenticated;
grant execute on function admin_list_claims() to service_role;
