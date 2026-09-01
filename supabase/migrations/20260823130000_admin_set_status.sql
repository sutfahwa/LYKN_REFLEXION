-- admin_set_claim_status: แอดมินเปลี่ยนสถานะบัตรตรงๆ (ปุ่ม "เปลี่ยนสถานะ"
-- ในตารางอนุมัติบัตร) ใช้กรณีที่ไม่ต้องผ่านขั้นตอนตรวจหลักฐานปกติ
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

revoke execute on function admin_set_claim_status(uuid, claim_status, text, uuid) from public, anon, authenticated;
grant execute on function admin_set_claim_status(uuid, claim_status, text, uuid) to service_role;
