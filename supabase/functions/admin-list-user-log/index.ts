// POST /admin-list-user-log — ดึงประวัติการจัดการ user (ลบ/ปิดใช้งาน/เปิดใช้งาน/
// ส่งรีเซ็ตรหัสผ่าน) ทั้งหมด เรียงล่าสุดก่อน สำหรับหน้าจัดการ user ของแอดมิน
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

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from('admin_user_action_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  return jsonResponse({ ok: true, log: data }, 200);
});
