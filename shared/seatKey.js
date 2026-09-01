// util กลาง: normalize ค่าที่นั่ง (โซน/แถว/เลขที่นั่ง/รอบการแสดง) ให้เทียบกันได้เสมอ
// ไม่ว่าผู้ใช้จะพิมพ์ "b" "B" "โซน B" หรือเลขไทย "๒" "2" "02" ก็ตาม
// ใช้ทั้งฝั่ง client (form ลงทะเบียน/ตรวจสอบ) และฝั่ง Edge Function (ต้องคัดลอกไฟล์นี้
// ไปด้วยเวลา deploy function เพราะ Deno ใน Supabase อ่านไฟล์นอก functions/ ไม่ได้โดยตรง)

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';

// คำนำหน้าที่ผู้ใช้มักพิมพ์ติดมากับค่า เช่น "โซน B", "แถว A", "เลขที่ 12"
const PREFIX_WORDS = ['โซน', 'แถว', 'ที่นั่ง', 'เลขที่'];
const PREFIX_RE = new RegExp('^(' + PREFIX_WORDS.join('|') + ')\\s*');

function thaiDigitsToArabic(str) {
  return String(str).replace(/[๐-๙]/g, (ch) => String(THAI_DIGITS.indexOf(ch)));
}

function stripPrefixWords(str) {
  return str.replace(PREFIX_RE, '');
}

// normalize ค่าดิบ 1 ช่อง (โซน หรือ แถว หรือ เลขที่นั่ง หรือ show_id) ให้เป็นรูปแบบเทียบกันได้:
// trim -> แปลงเลขไทยเป็นอารบิก -> ตัดคำนำหน้า -> trim -> ตัวพิมพ์ใหญ่ -> ถ้าเป็นตัวเลขล้วน pad เป็น 3 หลัก
function normalizeSegment(raw) {
  let s = String(raw ?? '').trim();
  s = thaiDigitsToArabic(s);
  s = stripPrefixWords(s);
  s = s.trim().toUpperCase();
  if (/^\d+$/.test(s)) {
    s = s.padStart(3, '0');
  }
  return s;
}

// สร้าง seat_key รูปแบบ {show_id}|{ZONE}|{ROW}|{SEAT}
// เช่น buildSeatKey({ showId: '2569-10-24', zone: 'b', row: 'a', seat: '๒' })
//      -> '2569-10-24|B|A|002'
function buildSeatKey({ showId, zone, row, seat }) {
  return [showId, zone, row, seat].map(normalizeSegment).join('|');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildSeatKey, normalizeSegment, thaiDigitsToArabic, stripPrefixWords };
}
