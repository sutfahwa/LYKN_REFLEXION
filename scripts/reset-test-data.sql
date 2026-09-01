-- ============================================================
-- reset-test-data.sql
--
-- ล้างข้อมูลทดสอบทั้งหมดในระบบ เหลือไว้แค่บัญชีแอดมิน สำหรับทดสอบใหม่ตั้งแต่ต้น
-- รันใน Supabase Dashboard > SQL Editor เท่านั้น (ต้องมีสิทธิ์แก้ auth.users)
--
-- ⚠️  ลบถาวร ย้อนกลับไม่ได้ (ไม่มี soft-delete/backup อัตโนมัติ)
-- ⚠️  เช็คให้ชัวร์ก่อนกด Run ว่ากำลังต่ออยู่กับ project ที่ถูกต้อง (ไม่ใช่ project อื่น)
--
-- ก่อนรัน: แก้ v_keep_admin_emails ด้านล่างเป็นอีเมลแอดมินจริงที่ต้องการเก็บไว้
-- (ใส่ได้หลายอีเมลถ้ามีแอดมินมากกว่า 1 คน คั่นด้วยจุลภาค)
-- ============================================================

do $$
declare
  v_keep_admin_emails text[] := array['REPLACE_ME@example.com'];  -- <<< แก้ตรงนี้ก่อนรัน
  v_deleted_users int;
begin
  if 'REPLACE_ME@example.com' = any (v_keep_admin_emails) then
    raise exception 'ยังไม่ได้แก้อีเมลแอดมินที่จะเก็บไว้ในตัวแปร v_keep_admin_emails — แก้ก่อนแล้วรันสคริปต์นี้ใหม่';
  end if;

  -- 1) ล้างข้อมูล transactional ทั้งหมด
  --    (evidences / review_claims จะถูกลบตามไปอัตโนมัติอยู่แล้วเพราะ FK เป็น
  --    on delete cascade จาก claims/reviews แต่ใส่ชื่อไว้ตรงๆ ให้ RESTART IDENTITY
  --    ทำงานกับทุกตารางที่มี id แบบ serial/identity ด้วย)
  truncate table
    evidences,
    review_claims,
    reviews,
    claims,
    seat_tombstones,
    seat_check_logs,
    seat_check_cache,
    notifications,
    audit_logs,
    admin_user_action_log,
    rate_limit_hits
  restart identity cascade;

  -- 2) ลบบัญชีผู้ใช้ทั้งหมด ยกเว้นแอดมิน (เช็คแบบเดียวกับที่ isAdminUser() ฝั่ง
  --    edge function ใช้จริง: role = 'admin' ใน app_metadata หรืออีเมลอยู่ใน
  --    รายการที่เก็บไว้ข้างบน) — auth.identities/sessions/refresh_tokens ของ
  --    user ที่ถูกลบจะถูกลบตามไปเองด้วย on delete cascade ในสคีมา auth ของ Supabase
  delete from auth.users u
  where coalesce(u.raw_app_meta_data->>'role', '') != 'admin'
    and not exists (
      select 1 from unnest(v_keep_admin_emails) as e(email)
      where lower(u.email) = lower(e.email)
    );

  get diagnostics v_deleted_users = row_count;
  raise notice 'ลบผู้ใช้ไปทั้งหมด % คน (เหลือแค่แอดมิน)', v_deleted_users;
end $$;

-- ============================================================
-- ขั้นตอนที่ต้องทำเพิ่มเอง หลังรันสคริปต์นี้เสร็จ (ทำนอก SQL Editor):
--
-- 1) ลบไฟล์หลักฐานใน Storage bucket "evidence" ให้หมด:
--    Dashboard > Storage > bucket "evidence" > เลือกไฟล์ทั้งหมด > Delete
--    (Supabase บล็อกไม่ให้ลบ storage.objects ตรงๆ ผ่าน SQL ต้องลบผ่าน
--    Dashboard/Storage API เท่านั้น — ลบตรงนี้ทีเดียวจบทั้ง metadata และไฟล์จริง)
--
-- 2) เช็คว่าเหลือแค่บัญชีแอดมินจริงๆ:
--    Dashboard > Authentication > Users
-- ============================================================
