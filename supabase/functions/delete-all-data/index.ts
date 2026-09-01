// POST /delete-all-data — ลบบัญชีของตัวเองถาวร (บัตร/หลักฐาน/แจ้งเตือน +
// ตัวบัญชี auth.users เอง) ตามที่สัญญาไว้ในปุ่ม "ลบข้อมูลของฉันทั้งหมด" —
// บล็อกไว้ถ้ามีบัตรใบใดกำลังอยู่ระหว่างข้อพิพาท ทำแบบเดียวกับที่แอดมินลบบัญชี
// user คนอื่น (admin-delete-user) ทุกอย่าง ต่างกันแค่ผู้ทำ — สมัครใหม่ด้วย
// อีเมล/ตัวตนเดิมได้เสมอหลังลบ (ไม่ใช่แค่ล้างข้อมูลแล้วบัญชียัง login ได้)
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';

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

  const admin = supabaseAdmin();

  const result = await admin.rpc('delete_all_user_data', { p_owner_id: user.id });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string; file_keys?: string[] };
  if (!data.ok) {
    return jsonResponse(data, data.error === 'HAS_ACTIVE_DISPUTE' ? 409 : 400);
  }

  if (data.file_keys && data.file_keys.length > 0) {
    await admin.storage.from('evidence').remove(data.file_keys);
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  await admin.from('admin_user_action_log').insert({
    action: 'SELF_DELETE_ACCOUNT',
    target_user_id: user.id,
    target_email: user.email,
    target_profile_name: user.user_metadata?.profile_name ?? null,
    performed_by_admin_id: user.id,
    performed_by_admin_email: user.email,
    note: null,
  });

  return jsonResponse({ ok: true }, 200);
});
