-- ============================================================
-- เติม audit_logs ที่ยังขาดอยู่ ให้ "ประวัติการดำเนินการ" ของบัตร (ปุ่มดูรายละเอียด
-- หน้าแอดมิน) เห็นครบทุกเหตุการณ์ ไม่ใช่แค่ REGISTER_CLAIM บรรทัดเดียว:
--
-- 1) submit_evidence ไม่เคย insert audit_logs เลยตั้งแต่แรก — ผู้ใช้ส่งหลักฐาน
--    แล้วไม่มีร่องรอยในประวัติเลย
-- 2) ตอนที่นั่งชนกันครั้งแรก (ยังไม่เคยมีข้อพิพาทมาก่อน) register_claim/
--    edit_claim จะ update สถานะบัตรของ "เจ้าของเดิม" เป็น UNDER_REVIEW เฉยๆ
--    โดยไม่ log อะไรเลย ประวัติของบัตรเจ้าของเดิมเลยไม่เห็นว่า "เกิดข้อพิพาท"
--    ตอนไหน เห็นแต่ฝั่งบัตรใหม่ที่เพิ่งมาชน
-- ============================================================

create or replace function submit_evidence(
  p_claim_id uuid,
  p_owner_id uuid,
  p_type evidence_type,
  p_file_key text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim claims%rowtype;
  v_evidence_id uuid;
  v_old_pending_id uuid;
  v_old_file_key text;
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

  if v_claim.status = 'VERIFIED' then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_VERIFIED');
  end if;

  if v_claim.status = 'REJECTED' then
    return jsonb_build_object('ok', false, 'error', 'CLAIM_REJECTED_FINAL');
  end if;

  select id, file_key into v_old_pending_id, v_old_file_key
  from evidences
  where claim_id = p_claim_id and review_result = 'PENDING' and deleted_at is null
  order by submitted_at desc
  limit 1;

  if v_old_pending_id is not null then
    update evidences set deleted_at = now() where id = v_old_pending_id;
  end if;

  insert into evidences (claim_id, type, file_key)
  values (p_claim_id, p_type, p_file_key)
  returning id into v_evidence_id;

  update claims set
    evidence_requested_at = null,
    reopen_reason = null,
    status = case when status = 'EVIDENCE_REJECTED' then 'REGISTERED' else status end,
    evidence_reject_reason = case when status = 'EVIDENCE_REJECTED' then null else evidence_reject_reason end
  where id = p_claim_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_owner_id, 'SUBMIT_EVIDENCE', 'evidence', v_evidence_id, null,
    jsonb_build_object('type', p_type, 'claim_id', p_claim_id));

  return jsonb_build_object('ok', true, 'evidence_id', v_evidence_id, 'replaced_file_key', v_old_file_key);
end;
$$;

revoke execute on function submit_evidence(uuid, uuid, evidence_type, text) from public, anon, authenticated;
grant execute on function submit_evidence(uuid, uuid, evidence_type, text) to service_role;

-- ------------------------------------------------------------
-- register_claim: เพิ่ม log ตอนบัตรเดิม (เจ้าของก่อนหน้า) ถูกเปลี่ยนเป็น
-- UNDER_REVIEW เพราะมีคนมาชนที่นั่ง (กิ่งที่ยังไม่เคยมีข้อพิพาทมาก่อน)
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

-- ------------------------------------------------------------
-- edit_claim: log เดียวกันสำหรับกิ่งที่แก้ที่นั่งแล้วไปชนกับบัตรเดิมของคนอื่น
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

    insert into audit_logs (actor_id, action, target_type, target_id, before, after)
    values (p_owner_id, 'DISPUTE_OPENED', 'claim', v_existing.id,
      jsonb_build_object('status', v_existing.status),
      jsonb_build_object('status', 'UNDER_REVIEW'));

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
