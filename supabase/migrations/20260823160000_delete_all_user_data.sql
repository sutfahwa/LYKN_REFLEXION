-- ============================================================
-- บั๊กที่เจอตอนเขียน+ทดสอบ test case: ปุ่ม "ลบข้อมูลของฉันทั้งหมด" สัญญาไว้ว่า
-- จะลบ "โปรไฟล์ การลงทะเบียนที่นั่ง และหลักฐานทั้งหมด" อย่างถาวร แต่ของจริง
-- ฝั่ง client แค่วนเรียก seat-delete (soft delete) ทีละใบเท่านั้น — ไม่ได้ลบ
-- แถวหลักฐาน (evidences), ไม่ได้ลบการแจ้งเตือน (notifications), และไม่ได้
-- ล้างชื่อ/อวาตาร์โปรไฟล์เลย ไม่ตรงกับที่สัญญาไว้ในข้อความยืนยัน
--
-- แก้เป็น RPC เดียวที่ hard-delete บัตรทั้งหมด (cascade ลบ evidences ตาม
-- schema อยู่แล้ว) + ลบ notifications ทั้งหมด ในทรานแซกชันเดียว ปลอดภัยกว่า
-- การวน loop เรียกทีละใบจาก client — ถ้ามีบัตรใบไหนกำลังอยู่ระหว่างข้อพิพาท
-- (UNDER_REVIEW) จะบล็อกทั้งหมดไว้ก่อน (เหมือน delete_claim เดี่ยวๆ) เพื่อ
-- ป้องกันไม่ให้หนีข้อพิพาทด้วยการลบบัญชีทิ้ง
-- ============================================================

create or replace function delete_all_user_data(
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
