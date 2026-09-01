-- ============================================================
-- เปลี่ยนพฤติกรรมปุ่ม "ลบข้อมูลของฉันทั้งหมด" (self-service) จากเดิมที่แค่
-- ล้างบัตร/หลักฐาน/แจ้งเตือน แล้วปั๊ม flag data_deleted_at ไว้ให้แอดมินเห็น
-- (บัญชียัง login ได้ตามเดิม) ไปเป็น "ลบบัญชีถาวรจริงๆ" เหมือนปุ่มฝั่งแอดมิน
-- (admin-delete-user) ทุกอย่าง — ตามที่พี่ตัดสินใจ: "เอาเป็นทางสมัครใหม่
-- ทุกอย่าง" หลังพบว่า user ที่สมัครด้วยอีเมลแล้วลบข้อมูลตัวเอง กลับสมัคร
-- ใหม่ด้วยอีเมลเดิมไม่ได้ (เพราะบัญชียังอยู่จริงใน auth.users) ในขณะที่ user
-- ที่มาจาก X login ได้ตามปกติเพราะ OAuth ไม่มีขั้นตอน "สมัคร" แยก เกิด
-- ความไม่สม่ำเสมอระหว่าง provider — แก้ให้ทั้งสองแบบพฤติกรรมเดียวกัน คือ
-- ลบบัญชีจริง สมัครใหม่ด้วยอีเมล/ตัวตนเดิมได้เสมอ
--
-- แก้โดย:
-- 1) delete_all_user_data: ตัดพารามิเตอร์ p_self_initiated กับ block ปั๊ม
--    data_deleted_at ออกทั้งหมด (ไม่มีประโยชน์แล้ว เพราะบัญชีจะถูกลบทิ้งไป
--    พร้อมกันเลยไม่ว่าจะเป็น self-service หรือ admin-initiated ก็ตาม)
--    ต้อง DROP FUNCTION ก่อน เพราะเปลี่ยนจำนวน parameter (create or replace
--    จะสร้าง overload ใหม่ซ้อนแทนที่จะแทนที่ของเดิม)
-- 2) admin_user_action_log: เพิ่ม action ใหม่ SELF_DELETE_ACCOUNT (ไม่ลบ
--    SELF_DELETE_DATA ของเดิมออก เผื่อมี log แถวเก่าที่ยังอ้างอิงค่านั้นอยู่)
--    ฝั่ง edge function (delete-all-data) จะเป็นคน insert log นี้เอง
--    หลังจากลบ auth.users สำเร็จ เหมือนที่ admin-delete-user ทำอยู่แล้ว
-- ============================================================

drop function if exists delete_all_user_data(uuid, boolean);

create function delete_all_user_data(
  p_owner_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_has_dispute boolean;
  v_file_keys text[];
  v_claim record;
begin
  select exists(
    select 1 from claims
    where owner_id = p_owner_id and deleted_at is null and status = 'UNDER_REVIEW'
  ) into v_has_dispute;

  if v_has_dispute then
    return jsonb_build_object('ok', false, 'error', 'HAS_ACTIVE_DISPUTE');
  end if;

  select coalesce(array_agg(e.file_key), '{}') into v_file_keys
  from evidences e
  join claims c on c.id = e.claim_id
  where c.owner_id = p_owner_id and c.deleted_at is null and e.deleted_at is null;

  for v_claim in
    select id, show_id, seat_key from claims
    where owner_id = p_owner_id and deleted_at is null
  loop
    insert into seat_tombstones (show_id, seat_key) values (v_claim.show_id, v_claim.seat_key);
    perform invalidate_seat_check_cache(v_claim.seat_key);
    delete from claims where id = v_claim.id;
  end loop;

  delete from notifications where user_id = p_owner_id;

  return jsonb_build_object('ok', true, 'file_keys', to_jsonb(v_file_keys));
end;
$$;

revoke execute on function delete_all_user_data(uuid) from public, anon, authenticated;
grant execute on function delete_all_user_data(uuid) to service_role;

alter table admin_user_action_log drop constraint admin_user_action_log_action_check;
alter table admin_user_action_log add constraint admin_user_action_log_action_check
  check (action in ('DELETE_USER', 'DEACTIVATE_USER', 'REACTIVATE_USER', 'PASSWORD_RESET_SENT', 'SELF_DELETE_DATA', 'SELF_DELETE_ACCOUNT'));
