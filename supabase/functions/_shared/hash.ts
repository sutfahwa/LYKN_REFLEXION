// ห้ามเก็บ IP ดิบ — ทุกอย่างเก็บเป็น hash(IP + user_agent + daily_salt) เท่านั้น
// daily_salt คำนวณสดทุกครั้งจาก secret คงที่ (DAILY_HASH_SECRET) + วันที่ UTC ปัจจุบัน
// ไม่ต้องเก็บ salt ไว้ที่ไหน เปลี่ยนเองทุกวันโดยอัตโนมัติ กันการ track ข้ามวัน

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function dailySalt(): Promise<string> {
  const secret = Deno.env.get('DAILY_HASH_SECRET') ?? '';
  const todayUtc = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return sha256Hex(secret + '|' + todayUtc);
}

function getClientIp(req: Request): string {
  // Supabase/Cloudflare edge ใส่ IP จริงของผู้เรียกไว้ใน header นี้
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('cf-connecting-ip') ?? 'unknown';
}

// ใช้แยกแยะ "การเข้าชมที่ไม่ซ้ำ" ต่อ 1 ชั่วโมง (นับ check_count)
export async function visitorHash(req: Request): Promise<string> {
  const salt = await dailySalt();
  const ip = getClientIp(req);
  const ua = req.headers.get('user-agent') ?? 'unknown';
  return sha256Hex(ip + '|' + ua + '|' + salt);
}

// ใช้ rate-limit ระดับ IP ล้วนๆ (ไม่รวม user-agent) กัน IP เดียวยิงรัว
export async function ipHash(req: Request): Promise<string> {
  const salt = await dailySalt();
  const ip = getClientIp(req);
  return sha256Hex(ip + '|' + salt);
}
