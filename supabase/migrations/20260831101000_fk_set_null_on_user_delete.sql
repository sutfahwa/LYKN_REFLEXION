-- ============================================================
-- บั๊กที่เจอตอนทดสอบ "ลบข้อมูลของฉันทั้งหมด" แบบใหม่ (ลบบัญชีจริงตาม
-- 20260831100000_self_delete_full_account.sql): กดลบแล้วได้ INTERNAL_ERROR
-- ทุกครั้งถ้า user คนนั้นเคยลงทะเบียน/แก้ไข/ส่งหลักฐานมาก่อน — เพราะ
-- audit_logs.actor_id มี FK ไปที่ auth.users(id) แบบ NO ACTION (ค่า default)
-- ซึ่งบล็อกการลบ auth.users ถ้ายังมีแถวใน audit_logs อ้างอิง actor_id นั้นอยู่
-- (delete_all_user_data ลบแค่ claims/notifications ของ owner ไม่เคยแตะ
-- audit_logs เลย เพราะตั้งใจให้เป็น log ถาวรอยู่แล้ว)
--
-- แก้โดยเปลี่ยน FK ที่เป็น NO ACTION ไปที่ auth.users(id) ทุกตัวที่มีไว้เพื่อ
-- "บันทึกว่าใครเคยทำอะไร" (ไม่ใช่ความเป็นเจ้าของข้อมูลจริง) ให้เป็น
-- ON DELETE SET NULL แทน — แถว log/แถวบัตรยังอยู่ครบเหมือนเดิม แค่ช่องอ้างอิง
-- คนที่ถูกลบบัญชีไปแล้วจะกลายเป็น null (เหมือนที่ admin_user_action_log ทำ
-- อยู่แล้วด้วยการไม่ใส่ FK เลย แต่เก็บ email/ชื่อ snapshot ไว้แทน):
--   - audit_logs.actor_id            (คนที่ทำ action — พบว่าเป็นตัวบล็อกจริง)
--   - claims.verified_by             (แอดมินที่กดยืนยันบัตร)
--   - claims.evidence_requested_by   (แอดมินที่ขอหลักฐานเพิ่ม)
--   - claims.deleted_by              (แอดมินที่ลบบัตรแทน user)
--   - reviews.resolved_by            (แอดมินที่ตัดสินเคสข้อพิพาท)
--   - evidences.reviewed_by          (แอดมินที่ตรวจหลักฐาน)
--
-- ไม่แตะ claims.owner_id / notifications.user_id — สองคอลัมน์นี้คือ "ความ
-- เป็นเจ้าของ" จริง delete_all_user_data ลบทั้งแถวทิ้งไปแล้วเสมอก่อนจะลบ
-- auth.users ต่อ ไม่มีทางเหลือแถวมาบล็อกได้อยู่แล้ว ปล่อย NO ACTION ไว้ตามเดิม
-- เพื่อกันบั๊กอื่นที่อาจลืมลบ claims ก่อนแล้วมโนว่า owner_id เป็น null ได้
-- ============================================================

alter table audit_logs drop constraint audit_logs_actor_id_fkey;
alter table audit_logs add constraint audit_logs_actor_id_fkey
  foreign key (actor_id) references auth.users(id) on delete set null;

alter table claims drop constraint claims_verified_by_fkey;
alter table claims add constraint claims_verified_by_fkey
  foreign key (verified_by) references auth.users(id) on delete set null;

alter table claims drop constraint claims_evidence_requested_by_fkey;
alter table claims add constraint claims_evidence_requested_by_fkey
  foreign key (evidence_requested_by) references auth.users(id) on delete set null;

alter table claims drop constraint claims_deleted_by_fkey;
alter table claims add constraint claims_deleted_by_fkey
  foreign key (deleted_by) references auth.users(id) on delete set null;

alter table reviews drop constraint reviews_resolved_by_fkey;
alter table reviews add constraint reviews_resolved_by_fkey
  foreign key (resolved_by) references auth.users(id) on delete set null;

alter table evidences drop constraint evidences_reviewed_by_fkey;
alter table evidences add constraint evidences_reviewed_by_fkey
  foreign key (reviewed_by) references auth.users(id) on delete set null;
