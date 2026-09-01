-- ============================================================
-- ล้าง function overload เก่าที่ค้างอยู่ (bug ที่เจอจากการทดสอบจริงหลัง deploy
-- รอบนี้: PostgREST เจอ register_claim/edit_claim มากกว่า 1 signature ในชื่อ
-- เดียวกัน — เพราะตลอดเซสชันที่ผ่านมา "create or replace function" ถูกใช้
-- ตอนเปลี่ยนพารามิเตอร์ (เพิ่ม p_confirm_duplicate/p_show_id เข้าไปใหม่) ซึ่งถ้า
-- signature ไม่ตรงกับของเดิมเป๊ะ Postgres จะสร้างเป็นฟังก์ชันใหม่แยกไปเลย
-- แทนที่จะ replace ของเดิม ทำให้ของเก่าค้างเป็น dead overload อยู่ในระบบ
-- ผลคือเรียก RPC ผ่าน PostgREST แล้วได้ INTERNAL_ERROR แบบสุ่ม/ไม่แน่นอน
-- เพราะเลือก overload ผิดหรือ resolve ไม่ได้ว่าจะใช้ตัวไหน
--
-- แก้ด้วยการ drop เวอร์ชันเก่าที่ไม่ได้ใช้แล้วทิ้งไปเลย เหลือแค่เวอร์ชันล่าสุด
-- ที่มาจาก 20260829090100_dispute_workflow.sql
-- ============================================================

-- register_claim เวอร์ชันเก่า (ไม่มี p_confirm_duplicate) — ค้างมาจากก่อนที่จะมี
-- ระบบ confirm ก่อนเปิดข้อพิพาท
drop function if exists register_claim(
  uuid, text, text, text, text, text, text, text, boolean, boolean
);

-- edit_claim เวอร์ชันเก่า (มี p_show_id แต่ไม่มี p_confirm_duplicate) — ค้างมาจาก
-- ก่อนที่จะย้าย show_id ออกจาก edit_claim (แก้ที่นั่งไม่เปลี่ยนรอบการแสดง) และ
-- ก่อนจะมีระบบ confirm ก่อนเปิดข้อพิพาท
drop function if exists edit_claim(
  uuid, uuid, text, text, text, text, text, text
);
