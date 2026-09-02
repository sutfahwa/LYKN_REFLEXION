-- ============================================================
-- อุด 2 จุดที่ Supabase Security Advisor แจ้งเตือน (warning level) — ทั้งคู่
-- ความเสี่ยงจริงต่ำมาก แต่แก้ให้ตรงตามมาตรฐานที่ใช้กับฟังก์ชันอื่นทุกตัวใน
-- ระบบนี้ (set search_path ชัดเจน + revoke จาก public/anon เสมอ)
--
-- 1) normalize_handle: ไม่มี set search_path — ฟังก์ชันนี้ใช้แค่ built-in
--    string function (lower/trim/regexp_replace) ไม่แตะตาราง ไม่มีทาง
--    hijack ได้จริง แต่เติมให้ครบตามมาตรฐาน
-- 2) mark_notification_read: ไม่เคย revoke จาก public/anon เลยตั้งแต่สร้าง
--    (ตอนนี้ callable โดย anon ได้ตรงๆ) — ตัวฟังก์ชันเองมี
--    "where user_id = auth.uid()" กำกับอยู่แล้วเลยไม่มีทางแก้ไข/อ่านข้อมูล
--    คนอื่นได้จริง (auth.uid() เป็น null ตอนไม่ login ไม่ match ใครเลย)
--    แต่ revoke ให้ชัดเจนไว้ดีกว่า ตรงตามที่ทุกฟังก์ชันอื่นทำอยู่แล้ว
-- ============================================================

create or replace function normalize_handle(p_handle text)
returns text
language sql
immutable
set search_path = public
as $$
  select lower(regexp_replace(trim(coalesce(p_handle, '')), '^@', ''));
$$;

revoke execute on function mark_notification_read(uuid) from public, anon;
grant execute on function mark_notification_read(uuid) to authenticated;
