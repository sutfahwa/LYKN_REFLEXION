// POST /set-x-handle — ตั้งค่า @x.com ของบัญชีอีเมล (ตั้งได้ครั้งเดียวตามที่สัญญาไว้ในหน้าเว็บ)
// เดิม client เรียก supabase.auth.updateUser() ตรงๆ ไม่มีการตรวจสอบใดๆ เลย ทำให้
// ใครก็ตั้ง @handle ซ้ำกับบัญชีอื่นที่มีอยู่แล้วได้ (ทั้งบัญชี x.com OAuth จริง และบัญชี
// อีเมลอื่นที่ตั้งไว้ก่อน) เปิดช่องปลอมตัวเป็นผู้ขายคนอื่นในหน้าตรวจสอบที่นั่ง — ย้าย
// การตั้งค่ามาทำฝั่ง server แทน เพื่อบังคับกฎ "ตั้งได้ครั้งเดียว" + "ห้ามซ้ำกับคนอื่น" จริง
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';

const HANDLE_PATTERN = /^[A-Za-z0-9_]{1,15}$/;

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  const user = await getAuthedUser(req);
  if (!user) {
    return jsonResponse({ error: 'UNAUTHORIZED' }, 401);
  }

  // บัญชี x.com OAuth ดึง handle จาก provider โดยตรงอยู่แล้ว ไม่ต้อง/ไม่ให้ตั้งเองผ่านทางนี้
  if (user.app_metadata?.provider === 'x') {
    return jsonResponse({ error: 'NOT_APPLICABLE_FOR_X_AUTH' }, 400);
  }

  const existingHandle = (user.user_metadata?.user_name ?? '').toString().trim();
  if (existingHandle) {
    return jsonResponse({ error: 'HANDLE_ALREADY_SET' }, 409);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400);
  }

  const handle = String(body.handle ?? '').trim().replace(/^@/, '');
  if (!handle) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }
  if (!HANDLE_PATTERN.test(handle)) {
    return jsonResponse({ error: 'INVALID_HANDLE_FORMAT' }, 400);
  }

  const admin = supabaseAdmin();

  const { data: takenCheck, error: takenError } = await admin.rpc('is_x_handle_taken', {
    p_handle: handle, p_exclude_user_id: user.id,
  });
  if (takenError) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }
  if (takenCheck === true) {
    return jsonResponse({ error: 'HANDLE_ALREADY_TAKEN' }, 409);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, user_name: handle },
  });
  if (updateError) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  return jsonResponse({ ok: true, handle }, 200);
});
