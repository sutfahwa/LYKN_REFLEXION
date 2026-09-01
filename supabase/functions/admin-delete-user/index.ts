// POST /admin-delete-user — ลบ user ถาวรจาก auth.users (สมัครใหม่ด้วยอีเมล
// เดิมได้) ตามที่ขอ: "ลบ คือลบ user ถาวรสามารถสมัครใหม่ได้ แต่ log ใน
// database เก็บไว้" — ก่อนลบ auth.users ต้องเคลียร์บัตร/หลักฐาน/แจ้งเตือน
// ของ user นั้นก่อน (foreign key claims.owner_id ไม่ยอมให้ลบ user ที่ยังมี
// บัตรค้างอยู่) ใช้ RPC delete_all_user_data ตัวเดียวกับปุ่ม "ลบข้อมูลของฉัน
// ทั้งหมด" ของ user เอง ซึ่งบล็อกไว้แล้วถ้ามีบัตรกำลังอยู่ระหว่างข้อพิพาท —
// เท่ากับว่าลบ user ถาวรจะลบบัตรที่ลงทะเบียนไว้ทั้งหมดของ user นั้นไปด้วย
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminEmail, isAdminUser } from '../_shared/admin.ts';

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

  const targetUserId = String(body.user_id ?? '').trim();
  const targetEmail = String(body.email ?? '').trim();
  const reason = body.reason ? String(body.reason).trim() : null;
  if (!targetUserId || !targetEmail) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  if (targetUserId === authedUser.id) {
    return jsonResponse({ error: 'CANNOT_TARGET_SELF' }, 400);
  }

  const admin = supabaseAdmin();

  // เช็คทั้ง role ใน app_metadata ของ target จริง (แหล่งข้อมูลหลัก) และ
  // ADMIN_EMAILS แบบเดิม (fallback) กันเผลอลบแอดมินที่ตั้งไว้ด้วยวิธีใดวิธีหนึ่ง
  const { data: targetUserData } = await admin.auth.admin.getUserById(targetUserId);
  if (isAdminUser(targetUserData?.user) || isAdminEmail(targetEmail)) {
    return jsonResponse({ error: 'CANNOT_DELETE_ADMIN' }, 400);
  }

  // delete_all_user_data เหลือแค่ p_owner_id พารามิเดียวแล้ว (ตัด
  // p_self_initiated ออกไปตาม 20260831100000_self_delete_full_account.sql
  // เพราะตอนนี้ทั้ง self-service กับ admin-initiated ลบบัญชีจริงเหมือนกันหมด
  // ไม่มี flag data_deleted_at ให้ปั๊มอีกต่อไป)
  const dataResult = await admin.rpc('delete_all_user_data', { p_owner_id: targetUserId });
  if (dataResult.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }
  const data = dataResult.data as { ok: boolean; error?: string; file_keys?: string[] };
  if (!data.ok) {
    return jsonResponse(data, data.error === 'HAS_ACTIVE_DISPUTE' ? 409 : 400);
  }
  if (data.file_keys && data.file_keys.length > 0) {
    await admin.storage.from('evidence').remove(data.file_keys);
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(targetUserId);
  if (deleteError) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  await admin.from('admin_user_action_log').insert({
    action: 'DELETE_USER',
    target_user_id: targetUserId,
    target_email: targetEmail,
    target_profile_name: body.profile_name ? String(body.profile_name) : null,
    performed_by_admin_id: authedUser.id,
    performed_by_admin_email: authedUser.email,
    note: reason,
  });

  return jsonResponse({ ok: true }, 200);
});
