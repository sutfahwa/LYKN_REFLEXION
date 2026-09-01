-- ============================================================
-- บั๊กร้ายแรงที่เจอตอนทดสอบจริง (ยิง register_claim ตรงด้วย SQL จำลอง
-- 2 บัญชีแย่งที่นั่งเดียวกัน): ฟีเจอร์ "เปิดข้อพิพาทเมื่อมีคนลงทะเบียนซ้ำ"
-- พังมาตั้งแต่ Phase 2 (บั๊กเดิม ไม่ใช่บั๊กจาก migration รอบนี้) เพราะ
-- ทั้ง register_claim และ edit_claim insert/update แถวใหม่เป็นสถานะ
-- 'REGISTERED' ก่อน แล้วค่อยเปลี่ยนเป็น 'UNDER_REVIEW' ทีหลังอีกที — แต่
-- partial unique index (show_id, seat_key) where status not in
-- ('UNDER_REVIEW','REJECTED') จะ error "duplicate key" ทันทีตอน insert/
-- update แถวที่สองเป็น REGISTERED ซ้ำกับแถวเดิมที่ยังเป็น REGISTERED อยู่
-- ก่อนจะมีโอกาสไปเปลี่ยนสถานะแถวเดิมเป็น UNDER_REVIEW เลยด้วยซ้ำ ทำให้
-- ทั้ง endpoint พัง (500) แทนที่จะเปิดข้อพิพาทให้สำเร็จ — เท่ากับว่า
-- "มีคนอ้างสิทธิ์ที่นั่งซ้ำ" ซึ่งเป็นฟีเจอร์หลักของระบบทั้งหมด ไม่เคยทำงาน
-- ได้จริงเลยตั้งแต่สร้างมา
--
-- แก้โดย insert/update แถวใหม่ให้เป็น UNDER_REVIEW ตั้งแต่คำสั่งแรกเลย
-- เมื่อมี v_existing ชนอยู่ (ไม่ใช่ REGISTERED ก่อนแล้วค่อยเปลี่ยนทีหลัง)
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
  p_ownership_confirmed boolean
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

  if v_existing_review_id is not null then
    insert into claims (
      show_id, zone, row, seat, seat_key, owner_id, x_handle,
      owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
    ) values (
      p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
      p_owner_name_optional, 'UNDER_REVIEW', now(), now()
    ) returning id into v_new_claim_id;

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

  -- ถ้าชนกับคนอื่น ต้อง insert เป็น UNDER_REVIEW ตั้งแต่แรกเลย (ห้าม insert
  -- เป็น REGISTERED ก่อนแล้วค่อยเปลี่ยนทีหลัง เพราะ partial unique index
  -- จะ error ทันทีตอน insert ซ้ำกับแถวเดิมที่ยังเป็น REGISTERED อยู่)
  insert into claims (
    show_id, zone, row, seat, seat_key, owner_id, x_handle,
    owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
  ) values (
    p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
    p_owner_name_optional,
    case when v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end::claim_status,
    now(), now()
  ) returning id into v_new_claim_id;

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

  -- เช่นเดียวกับ register_claim: ถ้าชนกับคนอื่น ต้อง update แถวตัวเองเป็น
  -- UNDER_REVIEW ตั้งแต่คำสั่งเดียวนี้เลย ห้าม update เป็น REGISTERED ก่อน
  update claims set
    show_id = p_show_id, zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
    owner_name_optional = p_owner_name_optional,
    status = case when v_existing.id is not null then 'UNDER_REVIEW' else 'REGISTERED' end::claim_status,
    verified_at = null, verified_by = null,
    claimed_at = now()
  where id = p_claim_id;

  if v_seat_key_changed and v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;

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
