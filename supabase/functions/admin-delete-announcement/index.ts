// POST /admin-delete-announcement — ลบประกาศทิ้งถาวร
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

  const id = String(body.id ?? '').trim();
  if (!id) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const result = await admin.rpc('admin_delete_announcement', { p_id: id, p_admin_id: user.id });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string };
  if (!data.ok) {
    return jsonResponse(data, data.error === 'NOT_FOUND' ? 404 : 400);
  }

  return jsonResponse(data, 200);
});
