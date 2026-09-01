-- ============================================================
-- หลักฐานรับแค่ "รูปภาพ" เท่านั้น (ตัดวิดีโอออก) จำกัดขนาดไม่เกิน 2MB — บังคับ
-- ที่ระดับ storage bucket เองด้วย (ไม่ใช่แค่ฝั่ง client) กันคนข้าม UI ยิง
-- อัปโหลดตรงมาที่ storage API แล้วหลบ validation ของหน้าเว็บไปเลย
-- ============================================================
update storage.buckets
set file_size_limit = 2097152, -- 2MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
where id = 'evidence';
