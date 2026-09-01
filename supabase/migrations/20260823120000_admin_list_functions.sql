-- ============================================================
-- admin_list_claims / admin_list_disputes — ให้ข้อมูลตารางอนุมัติบัตร
-- และคิวข้อพิพาทของแอดมิน (join กับ auth.users เพื่อดึงชื่อโปรไฟล์)
-- filter/search/sort ทำฝั่ง client เพราะข้อมูลสเกลเล็ก (คอนเดียว)
-- ============================================================

create or replace function admin_list_claims()
returns table (
  id uuid, show_id text, zone text, "row" text, seat text, seat_key text,
  x_handle text, owner_name_optional text, status claim_status,
  claimed_at timestamptz, check_count int, profile_name text,
  evidence_count bigint, latest_evidence_result evidence_review_result
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
    (select e.review_result from evidences e where e.claim_id = c.id order by e.submitted_at desc limit 1) as latest_evidence_result
  from claims c
  join auth.users u on u.id = c.owner_id
  where c.deleted_at is null
  order by c.claimed_at desc;
$$;

revoke execute on function admin_list_claims() from public, anon, authenticated;
grant execute on function admin_list_claims() to service_role;

create or replace function admin_list_disputes()
returns table (
  review_id uuid, show_id text, seat_key text, review_outcome review_outcome_type,
  opened_at timestamptz, resolved_at timestamptz, admin_note text,
  claim_id uuid, x_handle text, profile_name text, claim_status claim_status, claimed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    r.id as review_id, r.show_id, r.seat_key, r.review_outcome,
    r.opened_at, r.resolved_at, r.admin_note,
    c.id as claim_id, c.x_handle,
    u.raw_user_meta_data ->> 'profile_name' as profile_name,
    c.status as claim_status, c.claimed_at
  from reviews r
  join review_claims rc on rc.review_id = r.id
  join claims c on c.id = rc.claim_id
  join auth.users u on u.id = c.owner_id
  order by r.opened_at desc, c.claimed_at asc;
$$;

revoke execute on function admin_list_disputes() from public, anon, authenticated;
grant execute on function admin_list_disputes() to service_role;

-- ดึงไฟล์หลักฐานทั้งหมดของ claim หนึ่งใบ (สำหรับ evidence-docs modal ของแอดมิน)
create or replace function admin_list_evidence_for_claim(p_claim_id uuid)
returns table (
  id uuid, type evidence_type, file_key text, review_result evidence_review_result,
  submitted_at timestamptz, reviewed_at timestamptz, deleted_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select id, type, file_key, review_result, submitted_at, reviewed_at, deleted_at
  from evidences
  where claim_id = p_claim_id
  order by submitted_at desc;
$$;

revoke execute on function admin_list_evidence_for_claim(uuid) from public, anon, authenticated;
grant execute on function admin_list_evidence_for_claim(uuid) to service_role;
