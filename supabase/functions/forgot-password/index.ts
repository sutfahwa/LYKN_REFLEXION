// POST /forgot-password — ขอลิงก์รีเซ็ตรหัสผ่าน
// ตามที่ผู้ใช้ต้องการ (ตรงข้ามกับหลัก anti-enumeration ทั่วไป): ถ้าอีเมลนี้ไม่มี
// บัญชีอยู่ในระบบ ให้แจ้งตรงๆ ว่าไม่พบอีเมลนี้ แทนที่จะตอบกลางๆ เหมือนกันทุกกรณี
// จำกัด rate limit ตาม IP กันคนยิงสุ่มเช็คอีเมลจำนวนมาก + cooldown 5 นาทีต่อ
// อีเมล/บัญชี (นับฝั่ง server ผูกกับ user ไม่ใช่ฝั่ง browser) กันสแปมส่งซ้ำถี่ๆ
// ให้บัญชีเดียวแม้จะเปลี่ยน browser/ล้าง cache ก็ยังโดน cooldown เหมือนเดิม
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { ipHash } from '../_shared/hash.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400);
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!email) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const ipH = await ipHash(req);

  const rateOk = await admin.rpc('check_rate_limit', {
    p_bucket: 'forgot_password_ip', p_key: ipH, p_limit: 10, p_window_seconds: 3600,
  });
  if (rateOk.error || rateOk.data === false) {
    return jsonResponse({ error: 'RATE_LIMITED' }, 429);
  }

  // เช็คว่ามีบัญชีนี้อยู่จริงหรือไม่ ผ่าน RPC (security definer)
  const existsResult = await admin.rpc('email_exists', { p_email: email });
  if (existsResult.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }
  if (existsResult.data !== true) {
    return jsonResponse({ error: 'EMAIL_NOT_FOUND' }, 404);
  }

  // cooldown 5 นาทีต่ออีเมล — เช็คหลัง email_exists เพื่อไม่กินโควตา cooldown
  // ของอีเมลที่ไม่มีอยู่จริงในระบบ
  const cooldownOk = await admin.rpc('check_rate_limit', {
    p_bucket: 'forgot_password_email', p_key: email, p_limit: 1, p_window_seconds: 300,
  });
  if (cooldownOk.error || cooldownOk.data === false) {
    return jsonResponse({ error: 'COOLDOWN_ACTIVE' }, 429);
  }

  const origin = req.headers.get('origin') ?? '';
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/profile/index.html`,
  });

  if (error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  return jsonResponse({ ok: true }, 200);
});
