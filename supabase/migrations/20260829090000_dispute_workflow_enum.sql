-- แยกเป็นไฟล์ของตัวเองเพราะ Postgres ห้ามใช้ enum value ใหม่ในทรานแซกชัน
-- เดียวกับที่เพิ่มมัน (ต้อง commit ก่อนถึงจะใช้ต่อได้)
alter type notification_event_type add value if not exists 'EVIDENCE_REQUESTED';
