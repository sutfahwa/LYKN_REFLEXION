-- ============================================================
-- edit_claim — แก้ไขที่นั่งที่ลงทะเบียนไว้ (ตาม design zip Update 1)
-- - แก้ไม่ได้ถ้าอยู่ใน UNDER_REVIEW (เหมือน delete_claim)
-- - แก้แล้วสถานะรีเซ็ตเป็น REGISTERED เสมอ (แม้เดิมจะ VERIFIED แล้วก็ตาม)
--   และ re-stamp claimed_at ใหม่ทุกครั้งที่แก้ ไม่ใช่แค่ตอนเปลี่ยนที่นั่ง
-- - ถ้าเปลี่ยนที่นั่งไปชนกับ claim ที่ active อยู่ของคนอื่น จะเข้า
--   UNDER_REVIEW เหมือน register_claim ทุกประการ (สร้าง review + แจ้งเตือน
--   ทั้งสองฝ่ายโดยไม่มี @ อีกฝ่าย)
-- - ถ้าเปลี่ยนที่นั่งไปที่มี tombstone ภายใน 15 นาที ก็ติด cooldown เหมือนกัน
-- ============================================================

create or replace function edit_claim(
  p_claim_id uuid,
  p_owner_id uuid,
  p_zone text,
  p_row text,
  p_seat text,
  p_seat_key text,
  p_owner_name_optional text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim claims%rowtype;
  v_tombstone_recent timestamptz;
  v_existing claims%rowtype;
  v_review_id uuid;
  v_seat_key_changed boolean;
begin
  select * into v_claim from claims where id = p_claim_id;

  if v_claim.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  if v_claim.owner_id != p_owner_id then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;

  if v_claim.deleted_at is not null then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_DELETED');
  end if;

  if v_claim.status = 'UNDER_REVIEW' then
    return jsonb_build_object('ok', false, 'error', 'UNDER_REVIEW_LOCKED');
  end if;

  v_seat_key_changed := (v_claim.seat_key != p_seat_key);

  if v_seat_key_changed then
    select deleted_at into v_tombstone_recent
    from seat_tombstones
    where show_id = v_claim.show_id and seat_key = p_seat_key
    order by deleted_at desc
    limit 1;

    if v_tombstone_recent is not null and v_tombstone_recent > now() - interval '15 minutes' then
      return jsonb_build_object(
        'ok', false, 'error', 'SEAT_COOLDOWN',
        'cooldown_until', v_tombstone_recent + interval '15 minutes'
      );
    end if;

    select * into v_existing
    from claims
    where show_id = v_claim.show_id and seat_key = p_seat_key
      and deleted_at is null and status != 'UNDER_REVIEW' and id != p_claim_id
    limit 1;
  end if;

  -- แก้ไข: อัปเดตรายละเอียดที่นั่ง + รีเซ็ตสถานะกลับเป็น REGISTERED เสมอ
  update claims set
    zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
    owner_name_optional = p_owner_name_optional,
    status = 'REGISTERED', verified_at = null, verified_by = null,
    claimed_at = now()
  where id = p_claim_id;

  if v_seat_key_changed and v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;
    update claims set status = 'UNDER_REVIEW' where id = p_claim_id;

    insert into reviews (show_id, seat_key, review_outcome)
    values (v_claim.show_id, p_seat_key, 'PENDING')
    returning id into v_review_id;

    insert into review_claims (review_id, claim_id) values (v_review_id, v_existing.id);
    insert into review_claims (review_id, claim_id) values (v_review_id, p_claim_id);

    insert into notifications (user_id, event_type, payload) values
      (v_existing.owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', v_claim.show_id)),
      (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', v_claim.show_id));

    perform invalidate_seat_check_cache(p_seat_key);
    if v_seat_key_changed then perform invalidate_seat_check_cache(v_claim.seat_key); end if;

    return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', p_claim_id);
  end if;

  perform invalidate_seat_check_cache(p_seat_key);
  if v_seat_key_changed then perform invalidate_seat_check_cache(v_claim.seat_key); end if;

  return jsonb_build_object('ok', true, 'status', 'REGISTERED', 'claim_id', p_claim_id);
end;
$$;

revoke execute on function edit_claim(uuid, uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function edit_claim(uuid, uuid, text, text, text, text, text) to service_role;
