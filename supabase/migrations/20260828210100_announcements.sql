-- ระบบ "ประกาศ/แจ้งเตือนกว้าง" (ANNOUNCEMENT) — แอดมินส่งแจ้งเตือนจากหน้า admin
-- ได้เลยโดยไม่ต้องแก้โค้ด ต่างจากแจ้งเตือนเดิม (DUPLICATE_CLAIM/EVIDENCE_RESULT/
-- REVIEW_RESULT) ที่ผูกกับ user_id คนใดคนหนึ่งเสมอ — ANNOUNCEMENT ใช้ user_id
-- เป็น null แทน แปลว่า "ส่งถึงทุกคน" รวมถึงคนที่ยังไม่ได้ login ด้วย
-- (เนื้อหา title/body/is_clickable/detail เก็บใน payload jsonb เดิมที่มีอยู่แล้ว
-- ไม่ต้องเพิ่มคอลัมน์ใหม่)

alter table notifications alter column user_id drop not null;

-- ------------------------------------------------------------
-- RLS: อ่านประกาศ (user_id is null) ได้ทั้ง anon และ authenticated
-- (นโยบายเดิม notifications_select_own ยังอยู่ ใช้คู่กัน — client query
-- ธรรมดา select('*') แบบไม่ filter จะได้ทั้งของตัวเอง + ประกาศรวมกันอัตโนมัติ
-- เพราะ RLS policy หลายอันจะ OR กัน)
-- ------------------------------------------------------------
create policy notifications_select_announcements on notifications
  for select
  to anon, authenticated
  using (user_id is null and event_type = 'ANNOUNCEMENT');

-- ------------------------------------------------------------
-- admin_send_announcement: แอดมินส่งประกาศใหม่ (audit-logged เหมือน
-- admin action อื่นๆ ในระบบนี้) — เรียกผ่าน service_role เท่านั้น
-- ------------------------------------------------------------
create or replace function admin_send_announcement(
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
  v_id uuid;
begin
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'MISSING_FIELDS');
  end if;

  insert into notifications (user_id, event_type, payload, status, sent_at, created_at)
  values (
    null,
    'ANNOUNCEMENT',
    jsonb_build_object(
      'title', trim(p_title),
      'body', trim(p_body),
      'is_clickable', coalesce(p_is_clickable, false),
      'detail', case when coalesce(p_is_clickable, false) then p_detail else null end
    ),
    'SENT',
    now(),
    now()
  )
  returning id into v_id;

  insert into audit_logs (actor_id, action, target_type, target_id, before, after)
  values (p_admin_id, 'SEND_ANNOUNCEMENT', 'notification', v_id,
    null,
    jsonb_build_object('title', p_title, 'is_clickable', coalesce(p_is_clickable, false)));

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

revoke execute on function admin_send_announcement(text, text, boolean, text, uuid) from public, anon, authenticated;
grant execute on function admin_send_announcement(text, text, boolean, text, uuid) to service_role;
