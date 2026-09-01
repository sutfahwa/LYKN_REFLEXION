-- ============================================================
-- บั๊ก/ช่องโหว่ที่พบ: ผู้ใช้ที่ login ด้วยอีเมล (ไม่ใช่ x.com OAuth) ตั้งค่า
-- @x.com ของตัวเอง ผ่านการเรียก supabase.auth.updateUser() ตรงจากฝั่ง client
-- โดยไม่มีการตรวจสอบใดๆ ทั้งสิ้น — ใครก็ตั้ง @handle เป็นชื่อของคนอื่นที่มีอยู่
-- แล้วในระบบนี้ (ไม่ว่าจะเป็นบัญชี x.com OAuth จริงที่เคย login ไว้ หรือบัญชี
-- อีเมลอีกคนที่ตั้งค่าไว้ก่อนแล้ว) ก็ได้ ทั้งที่หน้าเว็บสัญญาไว้ชัดเจนว่า "ผู้ซื้อจะเช็ค
-- ความถูกต้องกับค่านี้" — เปิดช่องให้ปลอมตัวเป็นผู้ขายคนอื่นได้ในหน้าตรวจสอบที่นั่ง
--
-- แก้โดยเพิ่มฟังก์ชันตรวจสอบว่า handle นี้ถูกใช้โดยบัญชีอื่นไปแล้วหรือยัง (เทียบแบบ
-- ไม่สนตัวพิมพ์เล็ก-ใหญ่ ตรงกับกฎจริงของ x.com ที่ username case-insensitive)
-- ให้ Edge Function ใหม่ (set-x-handle) เรียกใช้ก่อนจะยอมบันทึกค่าให้
-- ============================================================

create or replace function is_x_handle_taken(p_handle text, p_exclude_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from auth.users
    where id != p_exclude_user_id
      and lower(coalesce(raw_user_meta_data->>'user_name', '')) = lower(p_handle)
      and raw_user_meta_data->>'user_name' is not null
      and raw_user_meta_data->>'user_name' != ''
  );
$$;

revoke execute on function is_x_handle_taken(text, uuid) from public, anon, authenticated;
grant execute on function is_x_handle_taken(text, uuid) to service_role;
