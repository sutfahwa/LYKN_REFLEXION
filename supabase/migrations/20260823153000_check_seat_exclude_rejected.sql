-- ============================================================
-- บั๊กที่เจอตอนเขียน test case: check_seat ไม่ได้ยกเว้นสถานะ REJECTED
-- ออกจากการนับ/การดึงแถวที่จะใช้ตอบผล ทำให้ที่นั่งที่เพิ่งตัดสินข้อพิพาท
-- เสร็จ (ผู้ชนะ VERIFIED + ผู้แพ้ REJECTED ทั้งคู่ deleted_at เป็น null)
-- มีโอกาสสุ่มดึงแถวของผู้แพ้ (REJECTED) มาตอบเป็นผลลัพธ์แทนผู้ชนะตัวจริง
-- เพราะไม่มี order by กำกับ — แก้ให้ query ทั้งสองจุดยกเว้น REJECTED เหมือน
-- ที่ partial unique index / register_claim ทำอยู่แล้ว
-- ============================================================

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
  where show_id = p_show_id and seat_key = p_seat_key and deleted_at is null and status != 'REJECTED';

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
    where show_id = p_show_id and seat_key = p_seat_key and deleted_at is null and status != 'REJECTED'
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
