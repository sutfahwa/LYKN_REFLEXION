-- ============================================================
-- ล็อกสิทธิ์ EXECUTE ของ function ที่มี logic ความปลอดภัย (rate limit,
-- ตรวจสอบ, ลงทะเบียน, ลบ) ไม่ให้ anon/authenticated เรียกตรงผ่าน
-- supabase.rpc(...) ได้เด็ดขาด — ถ้าไม่ทำข้อนี้ client จะข้าม Edge
-- Function (ที่ทำ rate limit + hash IP) ไปเรียก logic ตรงๆ ได้เลย
-- ซึ่งขัดกับกติกาความปลอดภัยทั้งหมดที่ตั้งไว้
--
-- Postgres ให้สิทธิ์ EXECUTE กับ PUBLIC เป็นค่าเริ่มต้นเมื่อสร้าง
-- function ใหม่ ต้อง revoke ออกอย่างชัดเจน แล้ว grant ให้เฉพาะ
-- service_role (ที่ Edge Function ใช้เชื่อมต่อ) เท่านั้น
-- ============================================================

revoke execute on function check_rate_limit(text, text, int, int) from public, anon, authenticated;
revoke execute on function invalidate_seat_check_cache(text) from public, anon, authenticated;
revoke execute on function register_claim(uuid, text, text, text, text, text, text, text, boolean, boolean) from public, anon, authenticated;
revoke execute on function check_seat(text, text, text, text) from public, anon, authenticated;
revoke execute on function delete_claim(uuid, uuid, text) from public, anon, authenticated;

grant execute on function check_rate_limit(text, text, int, int) to service_role;
grant execute on function invalidate_seat_check_cache(text) to service_role;
grant execute on function register_claim(uuid, text, text, text, text, text, text, text, boolean, boolean) to service_role;
grant execute on function check_seat(text, text, text, text) to service_role;
grant execute on function delete_claim(uuid, uuid, text) to service_role;

-- mark_notification_read ตั้งใจให้เรียกตรงจาก client ที่ login แล้วได้
-- (ปลอดภัยเพราะ function เช็ค auth.uid() = user_id เองข้างในอยู่แล้ว)
-- ไม่ต้อง revoke ตัวนี้
