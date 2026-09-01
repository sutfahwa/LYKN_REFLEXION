-- แยกเป็นไฟล์ migration ของตัวเองเพราะ Postgres ห้ามใช้ enum value ใหม่ในทรานแซกชัน
-- เดียวกับที่เพิ่มมัน (ALTER TYPE ... ADD VALUE ต้อง commit ก่อนถึงจะเอาไปใช้ต่อได้)
alter type notification_event_type add value if not exists 'ANNOUNCEMENT';
