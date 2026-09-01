-- ============================================================
-- email_exists: เช็คว่ามีบัญชี auth.users ที่ใช้อีเมลนี้อยู่จริงหรือไม่
-- ใช้โดย forgot-password Edge Function (service_role เท่านั้น) เพื่อแจ้ง
-- ผู้ใช้ตรงๆ ว่าไม่พบอีเมลนี้ในระบบ ตามที่ผู้ใช้ต้องการ (แลกกับ anti-enumeration
-- ปกติ — มี rate limit ที่ Edge Function กันการสุ่มเช็คจำนวนมากอยู่แล้ว)
-- ============================================================

create or replace function email_exists(p_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from auth.users where lower(email) = lower(p_email)
  );
$$;

revoke execute on function email_exists(text) from public, anon, authenticated;
grant execute on function email_exists(text) to service_role;
