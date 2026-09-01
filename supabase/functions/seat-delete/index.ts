// POST /seat-delete — ลบ (soft delete) บัตรที่ตัวเองลงทะเบียนไว้
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400);
  }

  const claimId = String(body.claim_id ?? '').trim();
  const deleteReason = body.delete_reason ? String(body.delete_reason).trim() : null;

  if (!claimId) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();

  const result = await admin.rpc('delete_claim', {
    p_claim_id: claimId,
    p_owner_id: user.id,
    p_delete_reason: deleteReason,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string };
  if (!data.ok) {
    const statusMap: Record<string, number> = {
      NOT_FOUND: 404,
      FORBIDDEN: 403,
      ALREADY_DELETED: 409,
      UNDER_REVIEW_LOCKED: 409,
    };
    return jsonResponse(data, statusMap[data.error ?? ''] ?? 400);
  }

  return jsonResponse(data, 200);
});
