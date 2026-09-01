-- บั๊กที่เจอระหว่างทดสอบจริง (Arc H manual testing): admin_list_disputes() ไม่มี
-- where filter กรอง review ที่ resolved_at ไม่ใช่ null เลย ทำให้ "คิวข้อพิพาท"
-- สะสมเคสที่ตัดสินไปแล้วปนกับเคสที่ยังไม่ตัดสินตลอดไป และเพราะ sort เป็น
-- opened_at asc (FIFO) เคสเก่าที่ตัดสินไปแล้วจะขึ้นก่อนเคสใหม่ที่ยังรอตัดสินเสมอ
-- เสี่ยง admin กดตัดสินซ้ำเคสที่ปิดไปแล้วโดยไม่ตั้งใจ (เจอจริงระหว่างทดสอบ)
create or replace function admin_list_disputes()
returns table(
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
  where r.resolved_at is null
  order by r.opened_at asc, c.claimed_at asc;
$$;

revoke all on function admin_list_disputes() from public, anon, authenticated;
grant execute on function admin_list_disputes() to service_role;
