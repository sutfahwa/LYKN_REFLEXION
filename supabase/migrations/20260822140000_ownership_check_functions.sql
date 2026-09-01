-- ============================================================
-- Phase 2 — rate limit, cache, และ business-logic function หลัก
-- (register / check / delete) ทำเป็น SECURITY DEFINER function
-- เรียกผ่าน RPC จาก Edge Function เท่านั้น ไม่ grant ให้ anon/authenticated
-- เรียกตรงได้ — กัน client ข้าม Edge Function มาเรียก logic ตรงๆ
-- (ซึ่งจะข้าม rate limit / visitor hash ที่ทำในชั้น Edge Function ไป)
-- ============================================================

-- ------------------------------------------------------------
-- rate_limit_hits: sliding-window rate limit แบบ generic
-- ------------------------------------------------------------
create table rate_limit_hits (
  id bigserial primary key,
  bucket text not null,
  key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_lookup_idx on rate_limit_hits (bucket, key, created_at);

alter table rate_limit_hits enable row level security;

-- นับจำนวน hit ของ bucket+key ภายในหน้าต่างเวลาที่กำหนด ถ้ายังไม่เกิน limit
-- จะบันทึก hit ใหม่แล้วคืน true (อนุญาต) ถ้าเกินแล้วคืน false (บล็อก) โดยไม่บันทึกเพิ่ม
create or replace function check_rate_limit(
  p_bucket text,
  p_key text,
  p_limit int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from rate_limit_hits
  where bucket = p_bucket
    and key = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);

  if v_count >= p_limit then
    return false;
  end if;

  insert into rate_limit_hits (bucket, key) values (p_bucket, p_key);
  return true;
end;
$$;

-- ------------------------------------------------------------
-- seat_check_cache: cache ผล seat-check 30-60 วิ ต่อ (seat_key, seller_handle)
-- invalidate ทันทีเมื่อสถานะของ seat_key เปลี่ยน (register/delete/review เรียก
-- invalidate_seat_check_cache ให้เอง)
-- ------------------------------------------------------------
create table seat_check_cache (
  cache_key text primary key,
  seat_key text not null,
  response jsonb not null,
  expires_at timestamptz not null
);

create index seat_check_cache_seat_key_idx on seat_check_cache (seat_key);

alter table seat_check_cache enable row level security;

create or replace function invalidate_seat_check_cache(p_seat_key text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from seat_check_cache where seat_key = p_seat_key;
$$;

-- ------------------------------------------------------------
-- helper: normalize x_handle เพื่อเทียบแบบ case-insensitive และตัด @ นำหน้า
-- ------------------------------------------------------------
create or replace function normalize_handle(p_handle text)
returns text
language sql
immutable
as $$
  select lower(regexp_replace(trim(coalesce(p_handle, '')), '^@', ''));
$$;

-- ------------------------------------------------------------
-- register_claim: ลงทะเบียนที่นั่ง — จัดการ cooldown, ตรวจจับการอ้างสิทธิ์ซ้ำ,
-- สร้าง review เมื่อชนกัน, บันทึก notification (ไม่รั่ว @ อีกฝ่าย) ทั้งหมดใน
-- transaction เดียว
-- ------------------------------------------------------------
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
  v_new_claim_id uuid;
  v_review_id uuid;
begin
  if not p_terms_accepted or not p_ownership_confirmed then
    return jsonb_build_object(
      'ok', false,
      'error', 'TERMS_NOT_ACCEPTED'
    );
  end if;

  -- cooldown 15 นาทีหลังถูกลบ
  select deleted_at into v_tombstone_recent
  from seat_tombstones
  where show_id = p_show_id and seat_key = p_seat_key
  order by deleted_at desc
  limit 1;

  if v_tombstone_recent is not null and v_tombstone_recent > now() - interval '15 minutes' then
    return jsonb_build_object(
      'ok', false,
      'error', 'SEAT_COOLDOWN',
      'cooldown_until', v_tombstone_recent + interval '15 minutes'
    );
  end if;

  -- มี active claim อยู่แล้วหรือไม่ (deleted_at is null and status != 'UNDER_REVIEW')
  select * into v_existing
  from claims
  where show_id = p_show_id
    and seat_key = p_seat_key
    and deleted_at is null
    and status != 'UNDER_REVIEW'
  limit 1;

  insert into claims (
    show_id, zone, row, seat, seat_key, owner_id, x_handle,
    owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
  ) values (
    p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
    p_owner_name_optional, 'REGISTERED', now(), now()
  ) returning id into v_new_claim_id;

  if v_existing.id is not null then
    -- ชนกับ claim เดิม -> ทั้งคู่เข้า UNDER_REVIEW, เปิด review
    update claims set status = 'UNDER_REVIEW' where id = v_existing.id;
    update claims set status = 'UNDER_REVIEW' where id = v_new_claim_id;

    insert into reviews (show_id, seat_key, review_outcome)
    values (p_show_id, p_seat_key, 'PENDING')
    returning id into v_review_id;

    insert into review_claims (review_id, claim_id) values (v_review_id, v_existing.id);
    insert into review_claims (review_id, claim_id) values (v_review_id, v_new_claim_id);

    -- แจ้งเตือนทั้งสองฝ่าย ห้ามมี @ ของอีกฝ่ายใน payload
    insert into notifications (user_id, event_type, payload) values
      (v_existing.owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id)),
      (p_owner_id, 'DUPLICATE_CLAIM', jsonb_build_object('seat_key', p_seat_key, 'show_id', p_show_id));

    perform invalidate_seat_check_cache(p_seat_key);

    return jsonb_build_object(
      'ok', true,
      'status', 'UNDER_REVIEW',
      'claim_id', v_new_claim_id
    );
  end if;

  perform invalidate_seat_check_cache(p_seat_key);

  return jsonb_build_object(
    'ok', true,
    'status', 'REGISTERED',
    'claim_id', v_new_claim_id
  );
end;
$$;

-- ------------------------------------------------------------
-- check_seat: ตรวจสอบว่าที่นั่ง+ผู้ขายตรงกันไหม (POST /seat-check ใช้เรียก)
-- คืนผลเดียวกันเป๊ะไม่ว่า handle จะถูกหรือผิด ตอน UNDER_REVIEW (กันเดาตัวตน)
-- ------------------------------------------------------------
create or replace function check_seat(
  p_show_id text,
  p_seat_key text,
  p_seller_handle text,
  p_visitor_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_under_review boolean;
  v_claim claims%rowtype;
  v_claim_count int;
  v_tombstone_count int;
  v_last_deleted_at timestamptz;
  v_result jsonb;
  v_rows_affected int;
begin
  select count(*) into v_claim_count
  from claims
  where show_id = p_show_id and seat_key = p_seat_key and deleted_at is null;

  select bool_or(status = 'UNDER_REVIEW') into v_under_review
  from claims
  where show_id = p_show_id and seat_key = p_seat_key and deleted_at is null;

  select count(*), max(deleted_at) into v_tombstone_count, v_last_deleted_at
  from seat_tombstones
  where show_id = p_show_id and seat_key = p_seat_key
    and deleted_at > now() - interval '7 days';

  if v_claim_count = 0 then
    v_result := jsonb_build_object('result', 'NOT_FOUND');
  elsif v_under_review then
    -- ต้องไม่มี x_handle / claimed_at ของใครทั้งสิ้น ไม่ว่า handle จะตรงหรือไม่
    v_result := jsonb_build_object('result', 'UNDER_REVIEW');
  else
    select * into v_claim
    from claims
    where show_id = p_show_id and seat_key = p_seat_key and deleted_at is null
    limit 1;

    if normalize_handle(v_claim.x_handle) = normalize_handle(p_seller_handle) then
      if v_claim.status = 'VERIFIED' then
        v_result := jsonb_build_object(
          'result', 'MATCH_VERIFIED',
          'x_handle', v_claim.x_handle,
          'claimed_at', v_claim.claimed_at
        );
      else
        v_result := jsonb_build_object(
          'result', 'MATCH_UNVERIFIED',
          'x_handle', v_claim.x_handle,
          'claimed_at', v_claim.claimed_at
        );
      end if;
    else
      v_result := jsonb_build_object('result', 'NO_MATCH');
    end if;

    -- unique visit ต่อชั่วโมง -> ค่อย increment check_count
    insert into seat_check_logs (show_id, seat_key, visitor_hash)
    values (p_show_id, p_seat_key, p_visitor_hash)
    on conflict do nothing;

    get diagnostics v_rows_affected = row_count;

    if v_rows_affected > 0 then
      update claims
      set check_count = check_count + 1, last_checked_at = now()
      where id = v_claim.id;
    end if;
  end if;

  v_result := v_result || jsonb_build_object(
    'tombstone_count', coalesce(v_tombstone_count, 0),
    'last_deleted_at', v_last_deleted_at,
    'removal_warning', coalesce(v_tombstone_count, 0) >= 3
  );

  return v_result;
end;
$$;

-- ------------------------------------------------------------
-- delete_claim: soft delete + tombstone, ห้ามลบตอน UNDER_REVIEW
-- ------------------------------------------------------------
create or replace function delete_claim(
  p_claim_id uuid,
  p_owner_id uuid,
  p_delete_reason text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim claims%rowtype;
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

  update claims
  set deleted_at = now(), deleted_by = p_owner_id, delete_reason = p_delete_reason
  where id = p_claim_id;

  insert into seat_tombstones (show_id, seat_key) values (v_claim.show_id, v_claim.seat_key);

  perform invalidate_seat_check_cache(v_claim.seat_key);

  return jsonb_build_object('ok', true);
end;
$$;

-- ------------------------------------------------------------
-- notifications: อ่านได้เฉพาะของตัวเอง, mark-as-read ผ่าน function เท่านั้น
-- (กัน client แก้ column อื่นนอกจาก read_at)
-- ------------------------------------------------------------
create policy notifications_select_own on notifications
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function mark_notification_read(p_notification_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update notifications
  set read_at = now()
  where id = p_notification_id and user_id = auth.uid();
$$;
