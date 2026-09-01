-- ============================================================
-- บั๊กที่เจอตอนทดสอบเคส "แก้ไขบัตรข้ามรอบการแสดง": edit_claim ไม่เคยรับ/
-- อัปเดตคอลัมน์ show_id เลย ถ้าผู้ใช้แก้ไขที่นั่งโดยเปลี่ยน "รอบการแสดง"
-- ด้วย (ไม่ใช่แค่โซน/แถว/เลขที่นั่ง) จะได้ show_id เดิม (รอบเก่า) กับ
-- seat_key ใหม่ (รอบใหม่) ค้างอยู่คนละอันกันในแถวเดียวกัน — ทำให้
-- check_seat ของรอบใหม่หาไม่เจอ (เพราะ show_id ไม่ตรง) และ partial unique
-- index ก็ไม่ชนกับคนอื่นที่ลงทะเบียนที่นั่งเดียวกันในรอบใหม่จริงๆ ด้วย
-- (เพราะ index อ้างอิงคู่ show_id+seat_key ทั้งคู่ ไม่ใช่แค่ seat_key)
--
-- แก้โดยเพิ่มพารามิเตอร์ p_show_id เข้าไปให้ edit_claim รับและอัปเดตด้วย
-- ทุกจุดที่เดิมอ้างอิง v_claim.show_id (ของแถวเก่า) สำหรับตรวจสอบ "ตำแหน่ง
-- ใหม่" เปลี่ยนไปใช้ p_show_id (รอบใหม่ที่ผู้ใช้เลือก) แทน — ส่วน cache
-- invalidation ของตำแหน่งเก่ายังอ้างอิง v_claim.seat_key เหมือนเดิม
-- (seat_key มีรอบเดิมฝังอยู่ในตัวมันเองอยู่แล้ว)
-- ============================================================

drop function if exists edit_claim(uuid, uuid, text, text, text, text, text);

create or replace function edit_claim(
  p_claim_id uuid,
  p_owner_id uuid,
  p_show_id text,
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
  v_existing_review_id uuid;
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

  v_seat_key_changed := (v_claim.seat_key != p_seat_key or v_claim.show_id != p_show_id);

  if v_seat_key_changed then
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

    if v_existing_review_id is not null then
      update claims set
        show_id = p_show_id, zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
        owner_name_optional = p_owner_name_optional,
        status = 'UNDER_REVIEW', verified_at = null, verified_by = null, claimed_at = now()
      where id = p_claim_id;

      insert into review_claims (review_id, claim_id) values (v_existing_review_id, p_claim_id);
      insert into notifications (user_id, event_type, payload)
      values (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id));

      perform invalidate_seat_check_cache(p_seat_key);
      perform invalidate_seat_check_cache(v_claim.seat_key);
      return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', p_claim_id);
    end if;

    select * into v_existing
    from claims
    where show_id = p_show_id and seat_key = p_seat_key
      and deleted_at is null and status not in ('UNDER_REVIEW', 'REJECTED') and id != p_claim_id
    limit 1;

    if v_existing.id is not null and v_existing.owner_id = p_owner_id then
      return jsonb_build_object('ok', false, 'error', 'SELF_DUPLICATE');
    end if;
  end if;

  update claims set
    show_id = p_show_id, zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
    owner_name_optional = p_owner_name_optional,
    status = 'REGISTERED', verified_at = null, verified_by = null,
    claimed_at = now()
  where id = p_claim_id;

  if v_seat_key_changed and v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;
    update claims set status = 'UNDER_REVIEW' where id = p_claim_id;

    insert into reviews (show_id, seat_key, review_outcome)
    values (p_show_id, p_seat_key, 'PENDING')
    returning id into v_review_id;

    insert into review_claims (review_id, claim_id) values (v_review_id, v_existing.id);
    insert into review_claims (review_id, claim_id) values (v_review_id, p_claim_id);

    insert into notifications (user_id, event_type, payload) values
      (v_existing.owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id)),
      (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id));

    perform invalidate_seat_check_cache(p_seat_key);
    if v_seat_key_changed then perform invalidate_seat_check_cache(v_claim.seat_key); end if;

    return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', p_claim_id);
  end if;

  perform invalidate_seat_check_cache(p_seat_key);
  if v_seat_key_changed then perform invalidate_seat_check_cache(v_claim.seat_key); end if;

  return jsonb_build_object('ok', true, 'status', 'REGISTERED', 'claim_id', p_claim_id);
end;
$$;

revoke execute on function edit_claim(uuid, uuid, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function edit_claim(uuid, uuid, text, text, text, text, text, text) to service_role;
