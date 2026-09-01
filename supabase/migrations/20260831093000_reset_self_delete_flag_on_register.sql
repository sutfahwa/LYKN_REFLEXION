-- ============================================================
-- บั๊กที่พี่แจ้ง: user ที่เคยกด "ลบข้อมูลของฉันทั้งหมด" เอง (ตั้ง
-- data_deleted_at ไว้ใน auth.users.raw_user_meta_data ตาม migration
-- 20260828130000_self_delete_data_status.sql) แล้วกลับมาลงทะเบียนที่นั่งใหม่
-- ใช้งานจริง — หน้าแอดมิน > จัดการผู้ใช้ ยังค้างขึ้นสถานะ "ลบข้อมูลโดยผู้ใช้เอง"
-- ตลอดไป ทั้งที่กลับมาใช้งานปกติแล้ว (flag ไม่เคยถูกล้างที่ไหนเลย)
--
-- แก้โดย: พอ register_claim สร้างบัตรใหม่สำเร็จ (ทุกกิ่งที่ insert into claims
-- จริง ไม่ใช่แค่กิ่งที่ error) ให้ล้าง data_deleted_at ออกจาก
-- raw_user_meta_data ของเจ้าของบัตรทันที ถือว่า "ลงทะเบียนมาใหม่แล้ว = กลับมา
-- ใช้งานปกติ" ตามที่พี่ระบุ — ไม่แตะ auth.users จุดอื่นเพิ่ม (ไม่ผูกกับแค่ login
-- เฉยๆ เพราะ login ไม่ได้แปลว่าเริ่มใช้งานจริง)
-- ============================================================

create or replace function register_claim(
  p_owner_id uuid,
  p_x_handle text,
  p_show_id text,
  p_zone text,
  p_row text,
  p_seat text,
  p_seat_key text,
  p_owner_name_optional text,
  p_terms_accepted boolean,
  p_ownership_confirmed boolean,
  p_confirm_duplicate boolean default false
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tombstone_recent timestamptz;
  v_existing claims%rowtype;
  v_existing_review_id uuid;
  v_new_claim_id uuid;
  v_review_id uuid;
begin
  if not p_terms_accepted or not p_ownership_confirmed then
    return jsonb_build_object('ok', false, 'error', 'TERMS_NOT_ACCEPTED');
  end if;

  select deleted_at into v_tombstone_recent
  from seat_tombstones
  where show_id = p_show_id and seat_key = p_seat_key
  order by deleted_at desc
  limit 1;

  if v_tombstone_recent is not null and v_tombstone_recent > now() - interval '15 minutes' then
    return jsonb_build_object(
      'ok', false, 'error', 'SEAT_COOLDOWN',
      'cooldown_until', v_tombstone_recent + interval '15 minutes'
    );
  end if;

  select id into v_existing_review_id
  from reviews
  where show_id = p_show_id and seat_key = p_seat_key and resolved_at is null
  order by opened_at desc
  limit 1;

  if v_existing_review_id is not null and not p_confirm_duplicate then
    return jsonb_build_object('ok', false, 'error', 'SEAT_ALREADY_CLAIMED', 'requires_confirmation', true);
  end if;

  if v_existing_review_id is not null then
    insert into claims (
      show_id, zone, row, seat, seat_key, owner_id, x_handle,
      owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
    ) values (
      p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
      p_owner_name_optional, 'UNDER_REVIEW', now(), now()
    ) returning id into v_new_claim_id;

    update auth.users
      set raw_user_meta_data = raw_user_meta_data - 'data_deleted_at'
      where id = p_owner_id and raw_user_meta_data ? 'data_deleted_at';

    insert into audit_logs (actor_id, action, target_type, target_id, before, after)
    values (p_owner_id, 'REGISTER_CLAIM', 'claim', v_new_claim_id, null,
      jsonb_build_object('status', 'UNDER_REVIEW', 'seat_key', p_seat_key));

    insert into review_claims (review_id, claim_id) values (v_existing_review_id, v_new_claim_id);

    insert into notifications (user_id, event_type, payload)
    values (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id));

    perform invalidate_seat_check_cache(p_seat_key);
    return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', v_new_claim_id);
  end if;

  select * into v_existing
  from claims
  where show_id = p_show_id and seat_key = p_seat_key
    and deleted_at is null and status not in ('UNDER_REVIEW', 'REJECTED')
  limit 1;

  if v_existing.id is not null and v_existing.owner_id = p_owner_id then
    return jsonb_build_object('ok', false, 'error', 'SELF_DUPLICATE');
  end if;

  if v_existing.id is not null and not p_confirm_duplicate then
    return jsonb_build_object('ok', false, 'error', 'SEAT_ALREADY_CLAIMED', 'requires_confirmation', true);
  end if;

  insert into claims (
    show_id, zone, row, seat, seat_key, owner_id, x_handle,
    owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
  ) values (
    p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
    p_owner_name_optional,
    case when v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end::claim_status,
    now(), now()
  ) returning id into v_new_claim_id;

  update auth.users
    set raw_user_meta_data = raw_user_meta_data - 'data_deleted_at'
    where id = p_owner_id and raw_user_meta_data ? 'data_deleted_at';

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'REGISTER_CLAIM', 'claim', v_new_claim_id, null,
    jsonb_build_object(
      'status', case when v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end,
      'seat_key', p_seat_key));

  if v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;

    -- log ให้บัตรเจ้าของเดิมด้วย ไม่งั้นประวัติของเขาจะไม่เห็นว่าทำไมจู่ๆ
    -- สถานะถึงเปลี่ยนเป็น "มีข้อพิพาท"
    insert into audit_logs (actor_id, action, target_type, target_id, before, after)
    values (p_owner_id, 'DISPUTE_OPENED', 'claim', v_existing.id,
      jsonb_build_object('status', v_existing.status),
      jsonb_build_object('status', 'UNDER_REVIEW', 'triggered_by_x_handle', p_x_handle));

    insert into reviews (show_id, seat_key, review_outcome)
    values (p_show_id, p_seat_key, 'PENDING')
    returning id into v_review_id;

    insert into review_claims (review_id, claim_id) values (v_review_id, v_existing.id);
    insert into review_claims (review_id, claim_id) values (v_review_id, v_new_claim_id);

    insert into notifications (user_id, event_type, payload) values
      (v_existing.owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id)),
      (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id));

    perform invalidate_seat_check_cache(p_seat_key);
    return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', v_new_claim_id);
  end if;

  perform invalidate_seat_check_cache(p_seat_key);
  return jsonb_build_object('ok', true, 'status', 'REGISTERED', 'claim_id', v_new_claim_id);
end;
$$;

revoke execute on function register_claim(uuid, text, text, text, text, text, text, text, boolean, boolean, boolean) from public, anon, authenticated;
grant execute on function register_claim(uuid, text, text, text, text, text, text, text, boolean, boolean, boolean) to service_role;
