// POST /admin-reactivate-user — ยกเลิกการปิดใช้งาน (ban_duration: 'none') ให้ user
// กลับมา login ได้ตามปกติ
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

  const targetUserId = String(body.user_id ?? '').trim();
  const targetEmail = String(body.email ?? '').trim();
  if (!targetUserId || !targetEmail) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();

  const { error } = await admin.auth.admin.updateUserById(targetUserId, {
    ban_duration: 'none',
  });
  if (error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  await admin.from('admin_user_action_log').insert({
    action: 'REACTIVATE_USER',
    target_user_id: targetUserId,
    target_email: targetEmail,
    target_profile_name: body.profile_name ? String(body.profile_name) : null,
    performed_by_admin_id: authedUser.id,
    performed_by_admin_email: authedUser.email,
    note: null,
  });

  return jsonResponse({ ok: true }, 200);
});
