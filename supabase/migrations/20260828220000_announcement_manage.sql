-- จัดการประกาศที่ส่งไปแล้ว (ดูรายการ/แก้ไข/ลบ) จากหน้า admin — audit-logged
-- เหมือน admin action อื่นๆ ในระบบนี้ เรียกผ่าน service_role เท่านั้น

create or replace function admin_list_announcements()
returns table (
  id uuid, title text, body text, is_clickable boolean, detail text, created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    id,
    payload ->> 'title' as title,
    payload ->> 'body' as body,
    coalesce((payload ->> 'is_clickable')::boolean, false) as is_clickable,
    payload ->> 'detail' as detail,
    created_at
  from notifications
  where event_type = 'ANNOUNCEMENT'
  order by created_at desc;
$$;

revoke execute on function admin_list_announcements() from public, anon, authenticated;
grant execute on function admin_list_announcements() to service_role;

create or replace function admin_edit_announcement(
  p_id uuid,
  p_title text,
  p_body text,
  p_is_clickable boolean,
  p_detail text,
  p_admin_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
begin
  select payload into v_before from notifications where id = p_id and event_type = 'ANNOUNCEMENT';
  if v_before is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'MISSING_FIELDS');
  end if;

  update notifications
  set payload = jsonb_build_object(
    'title', trim(p_title),
    'body', trim(p_body),
    'is_clickable', coalesce(p_is_clickable, false),
    'detail', case when coalesce(p_is_clickable, false) then p_detail else null end
  )
  where id = p_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'EDIT_ANNOUNCEMENT', 'notification', p_id, v_before,
    jsonb_build_object('title', p_title, 'is_clickable', coalesce(p_is_clickable, false)));

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function admin_edit_announcement(uuid, text, text, boolean, text, uuid) from public, anon, authenticated;
grant execute on function admin_edit_announcement(uuid, text, text, boolean, text, uuid) to service_role;

create or replace function admin_delete_announcement(p_id uuid, p_admin_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
begin
  select payload into v_before from notifications where id = p_id and event_type = 'ANNOUNCEMENT';
  if v_before is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  delete from notifications where id = p_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'DELETE_ANNOUNCEMENT', 'notification', p_id, v_before, null);

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function admin_delete_announcement(uuid, uuid) from public, anon, authenticated;
grant execute on function admin_delete_announcement(uuid, uuid) to service_role;
