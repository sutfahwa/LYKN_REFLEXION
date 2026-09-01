-- ============================================================
-- บั๊กที่พี่แจ้ง: user กดปุ่ม "ลบข้อมูลของฉันทั้งหมด" เอง (ลบบัตร/หลักฐาน/
-- แจ้งเตือนของตัวเอง) แต่หน้าแอดมิน > จัดการผู้ใช้ ไม่เห็นร่องรอยอะไรเลย ยัง
-- ขึ้น "ใช้งานปกติ" เหมือนเดิมทุกอย่าง ทั้งที่ควรมีสถานะบอกว่า "ลบโดย user"
-- ให้แอดมินเห็น เพราะ delete_all_user_data ไม่ได้แตะ auth.users เลย (ตั้งใจ
-- ให้บัญชียัง login ได้ปกติ แค่ล้างบัตร/หลักฐาน ไม่ใช่ลบบัญชี)
--
-- แก้โดย: เพิ่มพารามิเตอร์ p_self_initiated (default true) ให้ RPC เดิม เมื่อ
-- true จะ (1) ปั๊ม timestamp ไว้ใน auth.users.raw_user_meta_data ให้แอดมิน
-- เช็คสถานะได้ (2) insert log ไว้ใน admin_user_action_log ด้วย (ตามที่ขอ
-- "เพราะเราจะเก็บ log ไว้") — action ใหม่ SELF_DELETE_DATA, performed_by
-- เป็นตัว user เอง (ไม่มีแอดมินเข้ามาเกี่ยวข้อง)
--
-- ฝั่ง admin-delete-user (แอดมินลบบัญชีถาวร) เรียกฟังก์ชันเดียวกันนี้อยู่แล้ว
-- แต่ต้องส่ง p_self_initiated := false เพราะแอดมินจะลบทั้งบัญชีต่อทันที (ไม่
-- ต้องปั๊ม flag ที่จะหายไปพร้อม auth.users อยู่แล้ว) และมี log ของตัวเอง
-- (DELETE_USER) อยู่แล้ว ไม่ต้องการ log ซ้ำซ้อน
-- ============================================================

alter table admin_user_action_log drop constraint admin_user_action_log_action_check;
alter table admin_user_action_log add constraint admin_user_action_log_action_check
  check (action in ('DELETE_USER', 'DEACTIVATE_USER', 'REACTIVATE_USER', 'PASSWORD_RESET_SENT', 'SELF_DELETE_DATA'));

drop function if exists delete_all_user_data(uuid);

create or replace function delete_all_user_data(
  p_owner_id uuid,
  p_self_initiated boolean default true
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

  if p_self_initiated then
    update auth.users
      set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('data_deleted_at', to_jsonb(now()::text))
      where id = p_owner_id;

    insert into admin_user_action_log (action, target_user_id, target_email, target_profile_name, performed_by_admin_id, performed_by_admin_email, note)
    select 'SELF_DELETE_DATA', u.id, u.email, u.raw_user_meta_data->>'profile_name', u.id, u.email, null
    from auth.users u where u.id = p_owner_id;
  end if;

  return jsonb_build_object('ok', true, 'file_keys', to_jsonb(v_file_keys));
end;
$$;

revoke execute on function delete_all_user_data(uuid, boolean) from public, anon, authenticated;
grant execute on function delete_all_user_data(uuid, boolean) to service_role;
