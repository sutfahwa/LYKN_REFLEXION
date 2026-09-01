// พอร์ต Deno/TS ของ shared/seatKey.js — logic ต้องตรงกันเป๊ะทั้งสองฝั่ง
// (ฝั่งเว็บใช้ shared/seatKey.js, ฝั่ง Edge Function ใช้ไฟล์นี้)
// ถ้าแก้ logic ฝั่งใดฝั่งหนึ่ง ต้องแก้อีกฝั่งให้ตรงกันด้วย มี unit test คู่กันทั้งสองฝั่ง

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';

const PREFIX_WORDS = ['โซน', 'แถว', 'ที่นั่ง', 'เลขที่'];
const PREFIX_RE = new RegExp('^(' + PREFIX_WORDS.join('|') + ')\\s*');

export function thaiDigitsToArabic(str: string): string {
  return String(str).replace(/[๐-๙]/g, (ch) => String(THAI_DIGITS.indexOf(ch)));
}

export function stripPrefixWords(str: string): string {
  return str.replace(PREFIX_RE, '');
}

export function normalizeSegment(raw: unknown): string {
  let s = String(raw ?? '').trim();
  s = thaiDigitsToArabic(s);
  s = stripPrefixWords(s);
  s = s.trim().toUpperCase();
  if (/^\d+$/.test(s)) {
    s = s.padStart(3, '0');
  }
  return s;
}

export function buildSeatKey(input: { showId: string; zone: string; row: string; seat: string }): string {
  const { showId, zone, row, seat } = input;
  return [showId, zone, row, seat].map(normalizeSegment).join('|');
}
