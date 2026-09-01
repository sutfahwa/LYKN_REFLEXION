-- ============================================================
-- แก้บั๊กจริงที่เจอจากการทดสอบสด: กดยืนยัน "นี่คือที่นั่งของฉัน" (confirm_duplicate)
-- แล้วลงทะเบียนไม่ผ่าน เพราะชน unique constraint claims_active_seat_key_uniq
--
-- สาเหตุ: register_claim/edit_claim เวอร์ชันใน 20260829090100_dispute_workflow.sql
-- insert/update แถวใหม่เป็นสถานะ 'REGISTERED' ก่อน แล้วค่อย update เป็น
-- 'UNDER_REVIEW' ทีหลัง — ระหว่างนั้นมี 2 แถวสถานะ REGISTERED ที่ seat_key
-- เดียวกันพร้อมกันชั่วขณะ ชน partial unique index ทันที (index ยกเว้นแค่แถวที่
-- เป็น UNDER_REVIEW เท่านั้น) ซึ่งเรื่องนี้เคยแก้ไปแล้วครั้งหนึ่งใน
-- 20260823162000_dispute_insert_order_bugfix.sql แต่ตอนเขียน dispute_workflow.sql
-- ใหม่ทับ ลืมพกกติกาการ insert ที่แก้ไว้แล้วมาด้วย เลยกลับมาเป็นซ้ำ
--
-- แก้โดยกำหนดสถานะแบบมีเงื่อนไขตอน insert/update ครั้งเดียว (เป็น UNDER_REVIEW
-- ตั้งแต่แรกถ้าชนกับที่นั่งคนอื่น) ไม่ต้อง insert เป็น REGISTERED ก่อนแล้วมา
-- update ซ้ำทีหลัง
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

  -- ที่นั่งนี้มีข้อพิพาทเปิดอยู่แล้วหรือไม่ (ยังไม่ resolve) -> ต้อง confirm ก่อนเข้าร่วม
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

    insert into audit_logs (actor_id, action, target_type, target_id, before, after)
    values (p_owner_id, 'REGISTER_CLAIM', 'claim', v_new_claim_id, null,
      jsonb_build_object('status', 'UNDER_REVIEW', 'seat_key', p_seat_key));

    insert into review_claims (review_id, claim_id) values (v_existing_review_id, v_new_claim_id);

    insert into notifications (user_id, event_type, payload)
    values (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id));

    perform invalidate_seat_check_cache(p_seat_key);
    return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', v_new_claim_id);
  end if;

  -- ไม่มีข้อพิพาทเปิดอยู่ -> เช็ค active claim ปกติ (ไม่รวม UNDER_REVIEW/REJECTED)
  select * into v_existing
  from claims
  where show_id = p_show_id and seat_key = p_seat_key
    and deleted_at is null and status not in ('UNDER_REVIEW', 'REJECTED')
  limit 1;

  -- ที่นั่งนี้เป็นของตัวเองอยู่แล้ว (REGISTERED/VERIFIED) -> กันลงทะเบียนซ้ำกับตัวเอง
  if v_existing.id is not null and v_existing.owner_id = p_owner_id then
    return jsonb_build_object('ok', false, 'error', 'SELF_DUPLICATE');
  end if;

  -- มีคนอื่นถือที่นั่งนี้อยู่ (REGISTERED/VERIFIED) -> ต้อง confirm ก่อนจะเปิดข้อพิพาท
  if v_existing.id is not null and not p_confirm_duplicate then
    return jsonb_build_object('ok', false, 'error', 'SEAT_ALREADY_CLAIMED', 'requires_confirmation', true);
  end if;

  -- ห้าม insert เป็น REGISTERED ก่อนแล้วค่อย update เป็น UNDER_REVIEW ทีหลัง
  -- เพราะ partial unique index จะ error ทันทีตอน insert ซ้ำกับแถวเดิมที่ยังเป็น
  -- REGISTERED อยู่ (index ยกเว้นแค่ UNDER_REVIEW เท่านั้น) —ต้องกำหนดสถานะที่
  -- ถูกต้องตั้งแต่ insert ครั้งเดียว
  insert into claims (
    show_id, zone, row, seat, seat_key, owner_id, x_handle,
    owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
  ) values (
    p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
    p_owner_name_optional,
    case when v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end::claim_status,
    now(), now()
  ) returning id into v_new_claim_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'REGISTER_CLAIM', 'claim', v_new_claim_id, null,
    jsonb_build_object(
      'status', case when v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end,
      'seat_key', p_seat_key));

  if v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;

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

-- ------------------------------------------------------------
-- edit_claim: บั๊กเดียวกัน เกิดในกิ่ง "ชนกับที่นั่งคนอื่น (ไม่ใช่ที่นั่งที่มี
-- ข้อพิพาทเปิดอยู่แล้ว)" — update ตัวเองเป็น REGISTERED ก่อนแล้วค่อยเปลี่ยนเป็น
-- UNDER_REVIEW ทีหลัง ต้องกำหนดสถานะที่ถูกต้องตั้งแต่ update ครั้งแรกเหมือนกัน
-- ------------------------------------------------------------
create or replace function edit_claim(
  p_claim_id uuid,
  p_owner_id uuid,
  p_zone text,
  p_row text,
  p_seat text,
  p_seat_key text,
  p_owner_name_optional text,
  p_confirm_duplicate boolean default false
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

    select id into v_existing_review_id
    from reviews
    where show_id = v_claim.show_id and seat_key = p_seat_key and resolved_at is null
    order by opened_at desc
    limit 1;

    if v_existing_review_id is not null and not p_confirm_duplicate then
      return jsonb_build_object('ok', false, 'error', 'SEAT_ALREADY_CLAIMED', 'requires_confirmation', true);
    end if;

    if v_existing_review_id is not null then
      update claims set
        zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
        owner_name_optional = p_owner_name_optional,
        status = 'UNDER_REVIEW', verified_at = null, verified_by = null, claimed_at = now()
      where id = p_claim_id;

      insert into audit_logs (actor_id, action, target_type, target_id, before, after)
      values (p_owner_id, 'EDIT_CLAIM', 'claim', p_claim_id,
        jsonb_build_object('status', v_claim.status, 'seat_key', v_claim.seat_key),
        jsonb_build_object('status', 'UNDER_REVIEW', 'seat_key', p_seat_key));

      insert into review_claims (review_id, claim_id) values (v_existing_review_id, p_claim_id);
      insert into notifications (user_id, event_type, payload)
      values (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', v_claim.show_id));

      perform invalidate_seat_check_cache(p_seat_key);
      perform invalidate_seat_check_cache(v_claim.seat_key);
      return jsonb_build_object('ok', true, 'status', 'UNDER_REVIEW', 'claim_id', p_claim_id);
    end if;

    select * into v_existing
    from claims
    where show_id = v_claim.show_id and seat_key = p_seat_key
      and deleted_at is null and status not in ('UNDER_REVIEW', 'REJECTED') and id != p_claim_id
    limit 1;

    if v_existing.id is not null and v_existing.owner_id = p_owner_id then
      return jsonb_build_object('ok', false, 'error', 'SELF_DUPLICATE');
    end if;

    if v_existing.id is not null and not p_confirm_duplicate then
      return jsonb_build_object('ok', false, 'error', 'SEAT_ALREADY_CLAIMED', 'requires_confirmation', true);
    end if;
  end if;

  -- ห้าม update ตัวเองเป็น REGISTERED ก่อนแล้วค่อยเปลี่ยนเป็น UNDER_REVIEW ทีหลัง
  -- (เหตุผลเดียวกับ register_claim — ชน partial unique index ชั่วขณะ)
  update claims set
    zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
    owner_name_optional = p_owner_name_optional,
    status = case when v_seat_key_changed and v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end::claim_status,
    verified_at = null, verified_by = null,
    claimed_at = now()
  where id = p_claim_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'EDIT_CLAIM', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status, 'seat_key', v_claim.seat_key),
    jsonb_build_object(
      'status', case when v_seat_key_changed and v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end,
      'seat_key', p_seat_key));

  if v_seat_key_changed and v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;

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

revoke execute on function edit_claim(uuid, uuid, text, text, text, text, text, boolean) from public, anon, authenticated;
grant execute on function edit_claim(uuid, uuid, text, text, text, text, text, boolean) to service_role;
