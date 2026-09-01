-- ============================================================
-- ต่อจาก migration ก่อนหน้า (ต้องแยกเพราะ enum value ใหม่ใช้ในทรานแซกชัน
-- เดียวกับที่เพิ่มไม่ได้) — อัปเดต index/RPC ให้รองรับ REJECTED +
-- แก้บั๊ก self-duplicate และ join-existing-dispute
-- ============================================================

-- 1) partial unique index ต้องยกเว้น REJECTED ด้วย (เหมือน UNDER_REVIEW)
--    เพราะที่นั่งเดียวกันตอนนี้มีทั้ง claim ที่ REJECTED (แสดงไว้เฉยๆ)
--    กับ claim ที่ VERIFIED/REGISTERED ของเจ้าของจริงพร้อมกันได้
drop index if exists claims_active_seat_key_uniq;
create unique index claims_active_seat_key_uniq
  on claims (show_id, seat_key)
  where deleted_at is null and status not in ('UNDER_REVIEW', 'REJECTED');

-- 2) register_claim: แก้บั๊ก self-duplicate + เข้าร่วมข้อพิพาทเดิมถ้ามีอยู่แล้ว
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

  -- ที่นั่งนี้มีข้อพิพาทเปิดอยู่แล้วหรือไม่ (ยังไม่ resolve) -> เข้าร่วมทันที
  -- แทนที่จะเปิดข้อพิพาทใหม่ซ้อน (กันบั๊กคนที่ 3 หลุดไปเป็น REGISTERED เฉยๆ)
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

  insert into claims (
    show_id, zone, row, seat, seat_key, owner_id, x_handle,
    owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
  ) values (
    p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
    p_owner_name_optional, 'REGISTERED', now(), now()
  ) returning id into v_new_claim_id;

  if v_existing.id is not null then
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;
    update claims set status = 'UNDER_REVIEW' where id = v_new_claim_id;

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

-- 3) edit_claim: แก้บั๊กเดียวกัน (self-duplicate + เข้าร่วมข้อพิพาทเดิม)
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

    if v_existing_review_id is not null then
      update claims set
        zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
        owner_name_optional = p_owner_name_optional,
        status = 'UNDER_REVIEW', verified_at = null, verified_by = null, claimed_at = now()
      where id = p_claim_id;

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
  end if;

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

-- 4) admin_resolve_review: คนแพ้กลายเป็น REJECTED (ไม่ลบ ไม่ tombstone) แทน
create or replace function admin_resolve_review(
  p_review_id uuid,
  p_outcome review_outcome_type,
  p_admin_note text,
  p_resolved_by uuid,
  p_winning_claim_id uuid,
  p_false_claim_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_review reviews%rowtype;
  v_claim_id uuid;
  v_other_claim claims%rowtype;
  v_is_resolved boolean;
begin
  select * into v_review from reviews where id = p_review_id;
  if v_review.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  v_is_resolved := p_outcome in ('OWNER_CONFIRMED', 'FALSE_CLAIM_REMOVED', 'INCONCLUSIVE');

  update reviews
  set review_outcome = p_outcome, admin_note = p_admin_note,
    resolved_by = p_resolved_by, resolved_at = case when v_is_resolved then now() else null end
  where id = p_review_id;

  if p_outcome = 'OWNER_CONFIRMED' and p_winning_claim_id is not null then
    update claims set status = 'VERIFIED', verified_at = now(), verified_by = p_resolved_by
    where id = p_winning_claim_id;

    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id and rc.claim_id != p_winning_claim_id
    loop
      update claims set status = 'REJECTED' where id = v_claim_id;
      select * into v_other_claim from claims where id = v_claim_id;
      insert into notifications (user_id, event_type, payload)
      values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));
    end loop;

    select * into v_other_claim from claims where id = p_winning_claim_id;
    perform invalidate_seat_check_cache(v_other_claim.seat_key);
    insert into notifications (user_id, event_type, payload)
    values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));

  elsif p_outcome = 'FALSE_CLAIM_REMOVED' and p_false_claim_id is not null then
    update claims set status = 'REJECTED' where id = p_false_claim_id;
    select * into v_other_claim from claims where id = p_false_claim_id;
    insert into notifications (user_id, event_type, payload)
    values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));

    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id and rc.claim_id != p_false_claim_id
    loop
      update claims set status = 'REGISTERED' where id = v_claim_id;
      select * into v_other_claim from claims where id = v_claim_id;
      perform invalidate_seat_check_cache(v_other_claim.seat_key);
      insert into notifications (user_id, event_type, payload)
      values (v_other_claim.owner_id, 'REVIEW_RESULT', jsonb_build_object('review_id', p_review_id, 'outcome', p_outcome));
    end loop;
  end if;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_resolved_by, 'RESOLVE_REVIEW', 'review', p_review_id,
    jsonb_build_object('review_outcome', v_review.review_outcome),
    jsonb_build_object('review_outcome', p_outcome, 'admin_note', p_admin_note));

  return jsonb_build_object('ok', true);
end;
$$;

-- 5) เรียงคิวข้อพิพาทให้เคสที่เปิดก่อนขึ้นก่อน (FIFO)
create or replace function admin_list_disputes()
returns table (
  review_id uuid, show_id text, seat_key text, review_outcome review_outcome_type,
  opened_at timestamptz, resolved_at timestamptz, admin_note text,
  claim_id uuid, x_handle text, profile_name text, claim_status claim_status, claimed_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    r.id as review_id, r.show_id, r.seat_key, r.review_outcome,
    r.opened_at, r.resolved_at, r.admin_note,
    c.id as claim_id, c.x_handle,
    u.raw_user_meta_data ->> 'profile_name' as profile_name,
    c.status as claim_status, c.claimed_at
  from reviews r
  join review_claims rc on rc.review_id = r.id
  join claims c on c.id = rc.claim_id
  join auth.users u on u.id = c.owner_id
  order by r.opened_at asc, c.claimed_at asc;
$$;
