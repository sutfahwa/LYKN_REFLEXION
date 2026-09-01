-- ============================================================
-- Phase 6 (บางส่วน) — cron ลบข้อมูลทั้งหมดหลังคอนเสิร์ต 7 วัน
-- คอนวันสุดท้ายคือ 25 ต.ค. 2569 (2026-10-25) ดังนั้น cutoff คือ
-- 2026-11-01 (เผื่อ margin ให้ครบ 7 วันเต็มหลังรอบสุดท้าย)
--
-- หมายเหตุ: "ลบไฟล์หลักฐานทันทีหลังตรวจ" ทำไปแล้วใน Phase 5
-- (admin-review-evidence Edge Function เรียก storage.remove() ทันที
-- หลัง RPC สำเร็จ) — cron นี้เป็นตาข่ายรองรับกรณีไฟล์ตกค้าง (เช่น
-- หลักฐานที่ไม่เคยถูกตรวจเลยก่อนครบ 7 วัน) เท่านั้น
--
-- ส่วน "ประกาศแจ้งล่วงหน้า 7 วัน" ทำไม่ได้ในรอบนี้ เพราะต้องพึ่งระบบ
-- ส่งอีเมลซึ่งเลื่อนไปทำ phase ถัดไปตามที่ตกลงกันไว้
-- ============================================================

create extension if not exists pg_cron with schema extensions;

create or replace function cron_delete_expired_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff timestamptz := '2026-11-01 00:00:00+07'::timestamptz;
  v_deleted_claims int;
  v_deleted_storage int;
begin
  if now() < v_cutoff then
    return jsonb_build_object('ran', false, 'reason', 'before cutoff');
  end if;

  -- ไฟล์หลักฐานที่ตกค้าง (ปกติควรถูกลบไปแล้วตอนแอดมินตรวจใน Phase 5)
  with deleted as (delete from storage.objects where bucket_id = 'evidence' returning 1)
  select count(*) into v_deleted_storage from deleted;

  delete from review_claims;
  delete from evidences;
  delete from reviews;
  delete from seat_check_logs;
  delete from notifications;
  delete from seat_tombstones;

  with deleted as (delete from claims returning 1)
  select count(*) into v_deleted_claims from deleted;

  delete from audit_logs;
  delete from rate_limit_hits;
  delete from seat_check_cache;

  return jsonb_build_object(
    'ran', true, 'deleted_claims', v_deleted_claims, 'deleted_storage_objects', v_deleted_storage
  );
end;
$$;

revoke execute on function cron_delete_expired_data() from public, anon, authenticated;
grant execute on function cron_delete_expired_data() to service_role, postgres;

-- รันทุกวันตอนตี 3 (เวลาเซิร์ฟเวอร์ UTC เป็นค่าเริ่มต้นของ pg_cron)
-- ฟังก์ชันเองจะเช็ค cutoff และไม่ทำอะไรถ้ายังไม่ถึงเวลา
select cron.schedule(
  'lykn-delete-expired-data',
  '0 20 * * *', -- 20:00 UTC = 03:00 เวลาไทย (+07)
  $$select cron_delete_expired_data();$$
);
