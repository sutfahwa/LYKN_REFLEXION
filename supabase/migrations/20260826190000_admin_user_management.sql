-- ============================================================
-- admin_user_action_log: log การจัดการ user จากหน้าแอดมิน (ลบถาวร/
-- ปิดใช้งาน/เปิดใช้งานคืน/ส่งอีเมลรีเซ็ตรหัสผ่าน) เก็บ snapshot อีเมล+ชื่อ
-- โปรไฟล์ไว้ตอนทำรายการ เพราะกรณี "ลบถาวร" แถว auth.users จะหายไปจริง
-- ต้องมีที่เก็บนอก auth.users ถึงจะย้อนดูได้ว่าใครทำอะไรกับใครไปบ้าง
--
-- เข้าถึงได้เฉพาะ service_role (เรียกจาก Edge Function ที่เช็ค isAdminEmail
-- แล้วเท่านั้น) — ไม่มี RPC/policy ให้ authenticated เรียกตรงๆ เหมือน
-- seat_check_cache
-- ============================================================

create table admin_user_action_log (
  id uuid primary key default gen_random_uuid(),
  action text not null check (action in ('DELETE_USER', 'DEACTIVATE_USER', 'REACTIVATE_USER', 'PASSWORD_RESET_SENT')),
  target_user_id uuid,
  target_email text not null,
  target_profile_name text,
  performed_by_admin_id uuid not null,
  performed_by_admin_email text not null,
  note text,
  created_at timestamptz not null default now()
);

create index admin_user_action_log_created_at_idx on admin_user_action_log (created_at desc);
create index admin_user_action_log_target_user_id_idx on admin_user_action_log (target_user_id);

alter table admin_user_action_log enable row level security;
