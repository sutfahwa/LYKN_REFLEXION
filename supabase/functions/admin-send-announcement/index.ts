// POST /admin-send-announcement — แอดมินส่งประกาศ/แจ้งเตือนกว้างถึงทุกคน
// (รวมคนที่ยังไม่ login) จากหน้า admin โดยไม่ต้องแก้โค้ด
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  const user = await getAuthedUser(req);
  if (!user || !isAdminUser(user)) {
    return jsonResponse({ error: 'FORBIDDEN' }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400);
  }

  const title = String(body.title ?? '').trim();
  const bodyText = String(body.body ?? '').trim();
  const isClickable = Boolean(body.is_clickable);
  const detail = isClickable ? String(body.detail ?? '').trim() : null;

  if (!title || !bodyText || (isClickable && !detail)) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const result = await admin.rpc('admin_send_announcement', {
    p_title: title, p_body: bodyText, p_is_clickable: isClickable, p_detail: detail, p_admin_id: user.id,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string; id?: string };
  if (!data.ok) {
    return jsonResponse(data, 400);
  }

  return jsonResponse(data, 200);
});
