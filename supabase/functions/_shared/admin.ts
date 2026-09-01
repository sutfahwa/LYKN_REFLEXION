// ตรวจว่า user ที่ login อยู่เป็นแอดมินหรือไม่ — เช็คจาก allowlist อีเมล
// (ADMIN_EMAILS secret, คั่นด้วย comma) เป็นการ authorize ฝั่ง server จริง
// ไม่ใช่แค่ hidden path ฝั่ง client แบบใน design mockup เดิม
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowlist = (Deno.env.get('ADMIN_EMAILS') ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

// ตรวจสิทธิ์แอดมินจาก user object เต็ม — แหล่งข้อมูลหลักตอนนี้คือ
// app_metadata.role === 'admin' (เก็บเป็น column จริงใน auth.users ตั้งได้
// เฉพาะฝั่ง service_role เท่านั้น client แก้เองผ่าน updateUser() ไม่ได้ ปลอดภัย
// เหมือน ADMIN_EMAILS เดิม) — เช็ค ADMIN_EMAILS เป็น fallback ไว้ด้วยกันตกหล่น
// เผื่อกรณีตั้งอีเมลไว้ใน secret แต่ยังไม่ได้ปั๊ม role ให้ user คนนั้น
export function isAdminUser(
  user: { email?: string | null; app_metadata?: Record<string, unknown> } | null | undefined
): boolean {
  if (!user) return false;
  if (user.app_metadata?.role === 'admin') return true;
  return isAdminEmail(user.email);
}
