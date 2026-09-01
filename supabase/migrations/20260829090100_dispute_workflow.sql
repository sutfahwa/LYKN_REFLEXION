-- ============================================================
-- ปรับปรุงระบบข้อพิพาท/อนุมัติบัตร ตามฟีดแบ็กชุดใหญ่:
-- 1) ลงทะเบียนซ้ำต้อง "ยืนยัน" ก่อนถึงจะเข้าสู่ข้อพิพาทจริง (กันกรอกผิด)
-- 2) บัตรที่ถูก REJECTED แล้ว ห้ามลงทะเบียนที่นั่งเดิมซ้ำอีกด้วยคนเดิม
-- 3) แอดมินเปลี่ยนสถานะ/อนุมัติบัตรที่กำลังมีข้อพิพาทไม่ได้ (ต้องผ่านหน้าข้อพิพาท)
-- 4) จะยืนยันเจ้าของ (OWNER_CONFIRMED) ได้ ทุกฝ่ายในข้อพิพาทต้องส่งหลักฐานมาก่อน
-- 5) แอดมินขอหลักฐานเพิ่มจากผู้อ้างสิทธิ์รายใดรายหนึ่งได้ (ระบุว่าขอจากใคร)
-- 6) log รายรายการ (claim) ดูได้ว่าเกิดอะไรขึ้นบ้าง รวมถึง log ของ review/evidence ที่เกี่ยว
-- ============================================================

-- ------------------------------------------------------------
-- 1) เก็บสถานะ "ขอหลักฐานเพิ่ม" ต่อ claim (ระบุเจาะจงว่าขอจากใคร)
-- ------------------------------------------------------------
alter table claims add column evidence_requested_at timestamptz;
alter table claims add column evidence_requested_note text;
alter table claims add column evidence_requested_by uuid references auth.users(id);

-- ------------------------------------------------------------
-- 2) admin_set_claim_status: ห้ามแก้สถานะบัตรที่กำลังมีข้อพิพาทอยู่ตรงๆ
--    (ต้องไปจัดการที่หน้าข้อพิพาทเท่านั้น เพื่อไม่ให้ข้ามขั้นตอนตรวจสอบ)
-- ------------------------------------------------------------
create or replace function admin_set_claim_status(
  p_claim_id uuid,
  p_status claim_status,
  p_admin_note text,
  p_admin_id uuid
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

  if v_claim.status = 'UNDER_REVIEW' then
    return jsonb_build_object('ok', false, 'error', 'DISPUTE_IN_PROGRESS');
  end if;

  update claims
  set status = p_status,
    verified_at = case when p_status = 'VERIFIED' then now() else verified_at end,
    verified_by = case when p_status = 'VERIFIED' then p_admin_id else verified_by end
  where id = p_claim_id;

  perform invalidate_seat_check_cache(v_claim.seat_key);

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'SET_CLAIM_STATUS', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status),
    jsonb_build_object('status', p_status, 'admin_note', p_admin_note));

  return jsonb_build_object('ok', true);
end;
$$;

-- ------------------------------------------------------------
-- 3) register_claim: เพิ่ม p_confirm_duplicate — ถ้าที่นั่งนี้มีคนอ้างสิทธิ์/มี
--    ข้อพิพาทอยู่แล้ว และยังไม่ confirm จะคืน error ให้ฝั่ง client เปิด popup
--    ถามยืนยันก่อน (เผื่อกรอกผิด) ไม่สร้างอะไรจนกว่าจะ confirm มาจริง
--    เพิ่มด้วย: ห้ามลงทะเบียนที่นั่งเดิมซ้ำถ้าเคยถูกตัดสินว่า REJECTED มาแล้ว
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

  -- หมายเหตุ: เคยมีกติกาห้ามลงทะเบียนซ้ำถ้าที่นั่งนี้เคยถูกตัดสินว่า REJECTED
  -- มาก่อน (ด้วยคนเดิม) แต่ยกเลิกไปแล้ว — ลงทะเบียนใหม่ได้ปกติ ถ้าชนกับคนอื่น
  -- อีกก็เข้า flow ข้อพิพาทตามปกติ (confirm ก่อนเปิดข้อพิพาท)

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

  insert into claims (
    show_id, zone, row, seat, seat_key, owner_id, x_handle,
    owner_name_optional, status, terms_accepted_at, ownership_confirmed_at
  ) values (
    p_show_id, p_zone, p_row, p_seat, p_seat_key, p_owner_id, p_x_handle,
    p_owner_name_optional, 'REGISTERED', now(), now()
  ) returning id into v_new_claim_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'REGISTER_CLAIM', 'claim', v_new_claim_id, null,
    jsonb_build_object('status', 'REGISTERED', 'seat_key', p_seat_key));

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

-- ------------------------------------------------------------
-- 4) edit_claim: ใช้กติกาเดียวกัน (confirm ก่อนชนกับที่นั่งคนอื่น + ห้ามชนกับ
--    ที่นั่งที่ตัวเองเคยโดน REJECTED)
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

  update claims set
    zone = p_zone, row = p_row, seat = p_seat, seat_key = p_seat_key,
    owner_name_optional = p_owner_name_optional,
    status = 'REGISTERED', verified_at = null, verified_by = null,
    claimed_at = now()
  where id = p_claim_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'EDIT_CLAIM', 'claim', p_claim_id,
    jsonb_build_object('status', v_claim.status, 'seat_key', v_claim.seat_key),
    jsonb_build_object('status', 'REGISTERED', 'seat_key', p_seat_key));

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

-- ------------------------------------------------------------
-- 5) admin_resolve_review: จะยืนยันเจ้าของ (OWNER_CONFIRMED) ได้ ทุกฝ่ายใน
--    ข้อพิพาทต้องเคยส่งหลักฐานมาอย่างน้อย 1 ชิ้นก่อน (กันตัดสินจากคำพูดอย่างเดียว)
-- ------------------------------------------------------------
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
  v_missing_evidence_count int;
begin
  select * into v_review from reviews where id = p_review_id;
  if v_review.id is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  if p_outcome = 'OWNER_CONFIRMED' then
    select count(*) into v_missing_evidence_count
    from review_claims rc
    where rc.review_id = p_review_id
      and not exists (select 1 from evidences e where e.claim_id = rc.claim_id);

    if v_missing_evidence_count > 0 then
      return jsonb_build_object('ok', false, 'error', 'BOTH_MUST_SUBMIT_EVIDENCE');
    end if;
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

  elsif p_outcome = 'INCONCLUSIVE' then
    -- หาข้อสรุปไม่ได้ -> ปิดเคสนี้ไว้ก่อน แต่คืนบัตรทุกใบกลับไปเป็น REGISTERED
    -- แทนที่จะค้างเป็น UNDER_REVIEW ตลอดไป (ให้ผู้ใช้ยื่นหลักฐานเพิ่มหรือแก้ไขได้)
    for v_claim_id in
      select rc.claim_id from review_claims rc where rc.review_id = p_review_id
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

-- ------------------------------------------------------------
-- 6) admin_request_evidence: แอดมินขอหลักฐานเพิ่มจากผู้อ้างสิทธิ์รายใดรายหนึ่ง
--    เจาะจงเป็นราย claim (ไม่กระทบอีกฝ่ายในข้อพิพาทเดียวกัน)
-- ------------------------------------------------------------
create or replace function admin_request_evidence(
  p_claim_id uuid,
  p_admin_note text,
  p_admin_id uuid
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

  update claims
  set evidence_requested_at = now(), evidence_requested_note = p_admin_note, evidence_requested_by = p_admin_id
  where id = p_claim_id;

  insert into notifications (user_id, event_type, payload)
  values (v_claim.owner_id, 'EVIDENCE_REQUESTED', jsonb_build_object(
    'claim_id', p_claim_id, 'seat_key', v_claim.seat_key, 'note', p_admin_note
  ));

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'REQUEST_EVIDENCE', 'claim', p_claim_id, null, jsonb_build_object('note', p_admin_note));

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function admin_request_evidence(uuid, text, uuid) from public, anon, authenticated;
grant execute on function admin_request_evidence(uuid, text, uuid) to service_role;

-- ------------------------------------------------------------
-- 7) admin_list_claim_log: log ทั้งหมดที่เกี่ยวกับ claim หนึ่งใบ — รวม log
--    ของ claim เอง, ของ review ที่ผูกอยู่ (เปิด/ปิดข้อพิพาท), และของ evidence
--    ที่ยื่นมา (ตรวจผ่าน/ไม่ผ่าน) เรียงเวลาล่าสุดก่อน
-- ------------------------------------------------------------
create or replace function admin_list_claim_log(p_claim_id uuid)
returns table (
  action text, actor_email text, created_at timestamptz, before jsonb, after jsonb
)
language sql
security definer
set search_path = public
as $$
  select al.action, u.email as actor_email, al.created_at, al.before, al.after
  from audit_logs al
  left join auth.users u on u.id = al.actor_id
  where (al.target_type = 'claim' and al.target_id = p_claim_id)
     or (al.target_type = 'review' and al.target_id in (
           select rc.review_id from review_claims rc where rc.claim_id = p_claim_id
         ))
     or (al.target_type = 'evidence' and al.target_id in (
           select e.id from evidences e where e.claim_id = p_claim_id
         ))
  order by al.created_at asc;
$$;

revoke execute on function admin_list_claim_log(uuid) from public, anon, authenticated;
grant execute on function admin_list_claim_log(uuid) to service_role;

-- ------------------------------------------------------------
-- 8) admin_list_disputes: เพิ่ม evidence_count + evidence_requested_at ต่อ
--    claimant ให้แอดมินเห็นในตาราง (ใครส่งหลักฐานแล้ว/ยังไม่ส่ง/ถูกขอเพิ่ม)
--    ต้อง drop ก่อนเพราะเปลี่ยนจำนวนคอลัมน์ output (เพิ่มคอลัมน์ใหม่ต่อท้าย)
-- ------------------------------------------------------------
drop function if exists admin_list_disputes();

create or replace function admin_list_disputes()
returns table (
  review_id uuid, show_id text, seat_key text, review_outcome review_outcome_type,
  opened_at timestamptz, resolved_at timestamptz, admin_note text,
  claim_id uuid, x_handle text, profile_name text, claim_status claim_status, claimed_at timestamptz,
  evidence_count bigint, evidence_requested_at timestamptz
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
    c.status as claim_status, c.claimed_at,
    (select count(*) from evidences e where e.claim_id = c.id) as evidence_count,
    c.evidence_requested_at
  from reviews r
  join review_claims rc on rc.review_id = r.id
  join claims c on c.id = rc.claim_id
  join auth.users u on u.id = c.owner_id
  order by r.opened_at asc, c.claimed_at asc;
$$;

revoke execute on function admin_list_disputes() from public, anon, authenticated;
grant execute on function admin_list_disputes() to service_role;
