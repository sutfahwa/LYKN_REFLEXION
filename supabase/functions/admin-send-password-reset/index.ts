// POST /admin-send-password-reset — แอดมินกดส่งอีเมลรีเซ็ตรหัสผ่านแทน user
// (เผื่อ user ทำอีเมลตัวเองไม่ได้ หรือแอดมินอยากช่วยรีเซ็ตให้) ใช้ path เดียว
// กับ resetPasswordForEmail ปกติ ไม่ต้องเช็ค rate limit เพราะเป็นแอดมินที่
// login แล้วเท่านั้นที่เรียกได้ ไม่ใช่ endpoint สาธารณะแบบ forgot-password
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  const authedUser = await getAuthedUser(req);
  if (!authedUser || !isAdminUser(authedUser)) {
    return jsonResponse({ error: 'FORBIDDEN' }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400);
  }

  const targetUserId = body.user_id ? String(body.user_id).trim() : null;
  const email = String(body.email ?? '').trim().toLowerCase();
  if (!email) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();

  // บัญชีที่สมัครมาจาก x.com ล้วนๆ (ไม่มี identity แบบอีเมล/รหัสผ่านเลย) ไม่มี
  // รหัสผ่านให้รีเซ็ต — กันไว้ฝั่ง server ด้วย เผื่อมีคนยิง request ข้ามปุ่มที่ซ่อนไว้
  if (targetUserId) {
    const { data: targetUserData } = await admin.auth.admin.getUserById(targetUserId);
    const providers = (targetUserData?.user?.app_metadata?.providers as string[] | undefined) ?? [];
    if (!providers.includes('email')) {
      return jsonResponse({ error: 'NOT_EMAIL_ACCOUNT' }, 400);
    }
  }

  const origin = req.headers.get('origin') ?? '';

  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/profile/index.html`,
  });
  if (error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  await admin.from('admin_user_action_log').insert({
    action: 'PASSWORD_RESET_SENT',
    target_user_id: targetUserId,
    target_email: email,
    target_profile_name: body.profile_name ? String(body.profile_name) : null,
    performed_by_admin_id: authedUser.id,
    performed_by_admin_email: authedUser.email,
    note: null,
  });

  return jsonResponse({ ok: true }, 200);
});
