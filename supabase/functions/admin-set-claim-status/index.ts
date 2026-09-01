// POST /admin-set-claim-status — แอดมินเปลี่ยนสถานะบัตรตรงๆ (ปุ่ม "เปลี่ยนสถานะ")
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

const VALID_STATUSES = ['REGISTERED', 'VERIFIED', 'UNDER_REVIEW'];

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

  const claimId = String(body.claim_id ?? '').trim();
  const status = String(body.status ?? '').trim().toUpperCase();
  const adminNote = body.admin_note ? String(body.admin_note).trim() : null;

  if (!claimId || !VALID_STATUSES.includes(status)) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const result = await admin.rpc('admin_set_claim_status', {
    p_claim_id: claimId, p_status: status, p_admin_note: adminNote, p_admin_id: user.id,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string };
  if (!data.ok) {
    return jsonResponse(data, data.error === 'NOT_FOUND' ? 404 : 400);
  }

  return jsonResponse(data, 200);
});
