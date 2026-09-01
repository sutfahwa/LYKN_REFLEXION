-- ============================================================
-- admin_list_claims: เดิม filter c.deleted_at is null ทิ้งไปเลย
-- ทำให้บัตรที่ถูกลบหายไปจากหน้าแอดมินทั้งหมด แอดมินเช็คย้อนหลังไม่ได้
-- ว่าใครเพิ่ม-ใครลบบัตรไปบ้าง เปลี่ยนเป็นคืนบัตรที่ถูกลบมาด้วย
-- พร้อมข้อมูล deleted_at / delete_reason / deleted_by_name ให้ฝั่ง client
-- แสดงเป็นสถานะ "ถูกลบ" (log) แทนการซ่อนแถวไปเฉยๆ
-- ============================================================

drop function if exists admin_list_claims();

create or replace function admin_list_claims()
returns table (
  id uuid, show_id text, zone text, "row" text, seat text, seat_key text,
  x_handle text, owner_name_optional text, status claim_status,
  claimed_at timestamptz, check_count int, profile_name text,
  evidence_count bigint, latest_evidence_result evidence_review_result,
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
    c.deleted_at, c.delete_reason,
    du.raw_user_meta_data ->> 'profile_name' as deleted_by_name
  from claims c
  join auth.users u on u.id = c.owner_id
  left join auth.users du on du.id = c.deleted_by
  order by (c.deleted_at is not null) asc, c.claimed_at desc;
$$;

revoke execute on function admin_list_claims() from public, anon, authenticated;
grant execute on function admin_list_claims() to service_role;
