-- ============================================================
-- ระบบตรวจสอบความเป็นเจ้าของบัตร (Ownership Check) — schema เริ่มต้น
--
-- สำคัญ: ทุกตารางเปิด Row Level Security (RLS) โดย "ไม่มี policy ใดๆ"
-- ให้ role anon/authenticated เลย เจตนาคือบล็อกไม่ให้ PostgREST
-- (REST API อัตโนมัติของ Supabase) เข้าถึงตารางเหล่านี้ได้ตรงๆ จาก
-- ฝั่ง client เด็ดขาด — การอ่าน/เขียนทั้งหมดต้องผ่าน Edge Function
-- ที่ใช้ service_role key (รันฝั่ง server เท่านั้น) ซึ่งจะเป็นที่เดียว
-- ที่บังคับใช้กติกาความปลอดภัยทั้งหมด (ไม่มี endpoint หาเจ้าของที่นั่ง,
-- ไม่คืนข้อมูลอีกฝ่ายตอน UNDER_REVIEW, POST เท่านั้น ฯลฯ)
-- ============================================================

create extension if not exists pgcrypto;

create type claim_status as enum ('REGISTERED', 'VERIFIED', 'UNDER_REVIEW');

create type review_outcome_type as enum (
  'PENDING', 'AWAITING_EVIDENCE', 'OWNER_CONFIRMED', 'INCONCLUSIVE', 'FALSE_CLAIM_REMOVED'
);

create type evidence_type as enum ('VIDEO', 'SCREENSHOT');
create type evidence_review_result as enum ('PENDING', 'APPROVED', 'REJECTED');
create type notification_event_type as enum ('DUPLICATE_CLAIM', 'EVIDENCE_RESULT', 'REVIEW_RESULT');
create type notification_status as enum ('QUEUED', 'SENT', 'FAILED');

-- ------------------------------------------------------------
-- claims
-- ------------------------------------------------------------
create table claims (
  id uuid primary key default gen_random_uuid(),
  show_id text not null,
  zone text not null,
  row text not null,
  seat text not null,
  seat_key text not null,
  owner_id uuid not null references auth.users(id),
  x_handle text not null,
  owner_name_optional text,
  status claim_status not null default 'REGISTERED',
  claimed_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id),
  delete_reason text,
  check_count integer not null default 0,
  last_checked_at timestamptz,
  terms_accepted_at timestamptz not null,
  ownership_confirmed_at timestamptz not null
);

-- ที่ถูกลบไม่บล็อกการลงใหม่ (deleted_at is null) และปล่อยให้ซ้ำได้
-- เมื่อเข้าสถานะ UNDER_REVIEW (status != 'UNDER_REVIEW')
create unique index claims_active_seat_key_uniq
  on claims (show_id, seat_key)
  where deleted_at is null and status != 'UNDER_REVIEW';

create index claims_seat_key_idx on claims (show_id, seat_key);
create index claims_owner_id_idx on claims (owner_id);
create index claims_status_idx on claims (status);

alter table claims enable row level security;

-- ------------------------------------------------------------
-- seat_tombstones
-- ------------------------------------------------------------
create table seat_tombstones (
  id uuid primary key default gen_random_uuid(),
  show_id text not null,
  seat_key text not null,
  deleted_at timestamptz not null default now()
);

create index seat_tombstones_seat_key_idx on seat_tombstones (show_id, seat_key);
create index seat_tombstones_deleted_at_idx on seat_tombstones (deleted_at);

alter table seat_tombstones enable row level security;

-- ------------------------------------------------------------
-- reviews
-- ------------------------------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  show_id text not null,
  seat_key text not null,
  review_outcome review_outcome_type not null default 'PENDING',
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id),
  admin_note text
);

create index reviews_seat_key_idx on reviews (show_id, seat_key);
create index reviews_outcome_idx on reviews (review_outcome);

alter table reviews enable row level security;

-- ------------------------------------------------------------
-- review_claims (join table: 1 review อาจผูกได้หลาย claim)
-- ------------------------------------------------------------
create table review_claims (
  review_id uuid not null references reviews(id) on delete cascade,
  claim_id uuid not null references claims(id) on delete cascade,
  primary key (review_id, claim_id)
);

alter table review_claims enable row level security;

-- ------------------------------------------------------------
-- evidences
-- ------------------------------------------------------------
create table evidences (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims(id) on delete cascade,
  type evidence_type not null,
  file_key text not null,                 -- path ใน private storage bucket "evidence"
  review_result evidence_review_result not null default 'PENDING',
  reviewed_by uuid references auth.users(id),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  deleted_at timestamptz                  -- ไฟล์จริงถูกลบทันทีหลังตรวจ, เก็บไว้แค่ผลตรวจ
);

create index evidences_claim_id_idx on evidences (claim_id);

alter table evidences enable row level security;

-- ------------------------------------------------------------
-- seat_check_logs
-- ------------------------------------------------------------
create table seat_check_logs (
  id uuid primary key default gen_random_uuid(),
  show_id text not null,
  seat_key text not null,
  visitor_hash text not null,
  checked_at timestamptz not null default now(),
  -- date_trunc บน timestamptz ตรงๆ ไม่ immutable (ขึ้นกับ timezone ของ session)
  -- เลยแปลงเป็น timestamp แบบ UTC ก่อนตัดชั่วโมง ให้ผลลัพธ์คงที่เสมอ
  checked_hour timestamp generated always as (date_trunc('hour', checked_at at time zone 'utc')) stored
);

-- unique ต่อ visitor_hash ต่อ seat_key ต่อชั่วโมง — ใช้ ON CONFLICT DO NOTHING
-- ตอน insert แล้วเช็คว่า insert ได้จริงไหม เพื่อรู้ว่าเป็น unique visit หรือไม่
-- (ก่อนจะ increment claims.check_count)
create unique index seat_check_logs_unique_visit
  on seat_check_logs (show_id, seat_key, visitor_hash, checked_hour);

create index seat_check_logs_seat_key_idx on seat_check_logs (show_id, seat_key);

alter table seat_check_logs enable row level security;

-- ------------------------------------------------------------
-- notifications
-- ------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  event_type notification_event_type not null,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  status notification_status not null default 'QUEUED'
);

create index notifications_user_id_idx on notifications (user_id);
create index notifications_status_idx on notifications (status);

alter table notifications enable row level security;

-- ------------------------------------------------------------
-- audit_logs
-- ------------------------------------------------------------
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_type text not null,
  target_id uuid not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_target_idx on audit_logs (target_type, target_id);
create index audit_logs_actor_idx on audit_logs (actor_id);

alter table audit_logs enable row level security;

-- ------------------------------------------------------------
-- Storage bucket สำหรับไฟล์หลักฐาน — private เท่านั้น เข้าถึงผ่าน
-- signed URL ที่ Edge Function สร้างให้ (อายุ 15 นาที) เท่านั้น
-- ไม่มี public access และไม่มี RLS policy ให้ client โดยตรง
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;
