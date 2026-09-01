-- ============================================================
-- ย้าย case id มาติดที่ "claim" แทนที่จะติดที่ "ข้อพิพาท (review)" — ตามที่คุย
-- กันใหม่: ทุกการลงทะเบียนต้องมี case id ของตัวเองไม่ซ้ำกันเลย (เหมือนเลข
-- transaction) ไม่ใช่แค่รายการที่มีข้อพิพาทถึงจะมี ส่วนเคสข้อพิพาทที่มีคน
-- อ้างสิทธิ์หลายคน ให้แต่ละคนโชว์ case id ของตัวเองเป็น reference ซึ่งกันแทน
-- ที่จะมี case id ของ "เคสข้อพิพาท" แยกต่างหากอีกชุด (เลิกใช้ reviews.case_number)
-- ============================================================

-- 1) case_number ติดที่ claims แทน — auto-increment เหมือนเดิม รันแยกจาก
--    reviews.case_number คนละ sequence กัน (แถวเก่าที่มีอยู่แล้วจะได้เลขไล่ตาม
--    ลำดับ claimed_at ให้อัตโนมัติจาก Postgres ตอน add identity column)
alter table claims add column case_number bigint generated always as identity;

-- 2) เลิกใช้ reviews.case_number (case id ย้ายไปอยู่ที่ claims แล้ว)
alter table reviews drop column case_number;

-- 3) admin_list_claims: เพิ่ม case_number ของตัว claim เอง (ต้อง drop ก่อน
--    เพราะเปลี่ยนจำนวนคอลัมน์ output)
drop function if exists admin_list_claims();

create or replace function admin_list_claims()
returns table (
  id uuid, show_id text, zone text, "row" text, seat text, seat_key text,
  x_handle text, owner_name_optional text, status claim_status,
  claimed_at timestamptz, check_count int, profile_name text,
  evidence_count bigint, latest_evidence_result evidence_review_result,
  latest_evidence_submitted_at timestamptz, evidence_reject_reason text,
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

-- 4) admin_list_disputes: เอา r.case_number (เลิกใช้แล้ว) ออก ใช้ c.case_number
--    (ของ claim แต่ละใบ) แทน — return signature (ชนิด/ตำแหน่งคอลัมน์) เหมือนเดิม
--    เปลี่ยนแค่ที่มาของข้อมูล เลย create or replace เฉยๆ ได้ ไม่ต้อง drop
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
    r.id as review_id, c.case_number, r.show_id, r.seat_key, r.review_outcome,
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
