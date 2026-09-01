// POST /admin-resolve-review — แอดมินตัดสินเคสข้อพิพาท (5 ค่า review_outcome)
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

const VALID_OUTCOMES = ['PENDING', 'AWAITING_EVIDENCE', 'OWNER_CONFIRMED', 'INCONCLUSIVE', 'FALSE_CLAIM_REMOVED'];

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

  const reviewId = String(body.review_id ?? '').trim();
  const outcome = String(body.outcome ?? '').trim().toUpperCase();
  const adminNote = body.admin_note ? String(body.admin_note).trim() : null;
  const winningClaimId = body.winning_claim_id ? String(body.winning_claim_id).trim() : null;
  const falseClaimId = body.false_claim_id ? String(body.false_claim_id).trim() : null;

  if (!reviewId || !VALID_OUTCOMES.includes(outcome)) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }
  if (outcome === 'OWNER_CONFIRMED' && !winningClaimId) {
    return jsonResponse({ error: 'MISSING_WINNING_CLAIM' }, 400);
  }
  if (outcome === 'FALSE_CLAIM_REMOVED' && !falseClaimId) {
    return jsonResponse({ error: 'MISSING_FALSE_CLAIM' }, 400);
  }

  const admin = supabaseAdmin();

  const result = await admin.rpc('admin_resolve_review', {
    p_review_id: reviewId,
    p_outcome: outcome,
    p_admin_note: adminNote,
    p_resolved_by: user.id,
    p_winning_claim_id: winningClaimId,
    p_false_claim_id: falseClaimId,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string; deleted_file_keys?: string[] };
  if (!data.ok) {
    return jsonResponse(data, data.error === 'NOT_FOUND' ? 404 : 400);
  }

  // หลักฐาน PENDING ของบัตรที่เกี่ยวข้อง (ทั้งฝ่ายชนะ/แพ้) ถูกตัดสินไปพร้อมกันแล้ว
  // -> ลบไฟล์จริงออกจาก storage ด้วย เก็บไว้แค่ผลตรวจในตาราง
  if (data.deleted_file_keys && data.deleted_file_keys.length > 0) {
    const removeResult = await admin.storage.from('evidence').remove(data.deleted_file_keys);
    if (removeResult.error) {
      console.error('[admin-resolve-review] storage.remove failed', data.deleted_file_keys, removeResult.error);
    }
  }

  return jsonResponse(data, 200);
});
