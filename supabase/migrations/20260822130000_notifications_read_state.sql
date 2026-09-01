-- เพิ่ม read_at ให้ notifications เพื่อรองรับ "ไอคอนแจ้งเตือน" ในตัวเว็บ
-- (แยกจาก status ที่ track สถานะการส่งอีเมล — read_at คือสถานะ "ผู้ใช้เปิดดูแล้วหรือยัง"
-- ในกระดิ่งแจ้งเตือนบนเว็บ ซึ่งเป็นคนละเรื่องกับอีเมลส่งสำเร็จหรือไม่)
alter table notifications
  add column read_at timestamptz;

create index notifications_user_unread_idx
  on notifications (user_id, read_at)
  where read_at is null;
