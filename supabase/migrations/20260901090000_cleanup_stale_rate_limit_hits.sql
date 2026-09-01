-- ============================================================
-- rate_limit_hits ไม่เคยถูกล้างเลยตลอดแคมเปญ (cron_delete_expired_data เดิม
-- รันจริงแค่ครั้งเดียวหลังคอนจบ 1 พ.ย. 2569 เท่านั้น) ทั้งที่ตารางนี้ insert
-- แถวใหม่ทุกครั้งที่มีคนเช็คที่นั่ง/ลงทะเบียน/แก้ไข/ส่งหลักฐาน/ขอรีเซ็ตรหัสผ่าน
-- (8 จุดเรียกทั่วระบบ) แล้วไม่เคยลบทิ้งเลยจนกว่าจะครบ 7 วันหลังคอนจบ —
-- สะสมยาวไปโดยไม่จำเป็น เพราะ check_rate_limit เองก็ query แค่ช่วงเวลาสั้นๆ
-- (นานสุดที่ใช้จริงคือ 86400 วิ = 24 ชม. สำหรับ /day limit ต่างๆ)
--
-- แก้เฉพาะตารางนี้ตารางเดียว — ไม่แตะ seat_check_cache/seat_check_logs/
-- audit_logs เพราะยังมีประโยชน์ใช้งานจริงระหว่างแคมเปญ (audit_logs คือ
-- ประวัติที่แอดมินดูได้จริงในหน้า "ดูรายละเอียด", seat_check_logs ใช้นับ
-- removal_warning/check_count) ส่วน rate_limit_hits ไม่เคยถูกอ่านโดยใครเลย
-- นอกจาก check_rate_limit เอง เป็น internal bookkeeping ล้วนๆ ไม่มีผลกับ
-- ข้อมูลผู้ใช้จริงแม้แต่แถวเดียว (ไม่ใช่ claims/reviews/evidences/notifications)
--
-- เก็บไว้ 48 ชม. (เผื่อ margin 2 เท่าของ window ที่ยาวที่สุดที่ใช้จริง 24 ชม.)
-- ============================================================

create or replace function cleanup_stale_rate_limit_hits()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted int;
begin
  delete from rate_limit_hits where created_at < now() - interval '48 hours';
  get diagnostics v_deleted = row_count;
  return jsonb_build_object('deleted_rows', v_deleted);
end;
$$;

revoke execute on function cleanup_stale_rate_limit_hits() from public, anon, authenticated;
grant execute on function cleanup_stale_rate_limit_hits() to service_role, postgres;

select cron.schedule(
  'lykn-cleanup-rate-limit-hits',
  '30 20 * * *', -- ทุกวัน 20:30 UTC = 03:30 เวลาไทย (+07) เยื้องจาก cron เดิม 30 นาที
  $$select cleanup_stale_rate_limit_hits();$$
);
