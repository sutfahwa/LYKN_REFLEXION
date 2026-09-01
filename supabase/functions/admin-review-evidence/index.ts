// POST /admin-review-evidence — แอดมินตัดสินหลักฐาน 1 ชิ้น (ผ่าน/ไม่ผ่าน)
// ลบไฟล์จริงออกจาก storage ทันทีหลังตัดสิน เก็บไว้แค่ผลตรวจในตาราง
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

const VALID_RESULTS = ['APPROVED', 'REJECTED'];

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

  const evidenceId = String(body.evidence_id ?? '').trim();
  const result = String(body.result ?? '').trim().toUpperCase();
  const reviewNote = body.review_note ? String(body.review_note).trim() : null;

  if (!evidenceId || !VALID_RESULTS.includes(result)) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  if (result === 'REJECTED' && !reviewNote) {
    return jsonResponse({ error: 'REASON_REQUIRED' }, 400);
  }

  const admin = supabaseAdmin();

  const rpcResult = await admin.rpc('admin_review_evidence', {
    p_evidence_id: evidenceId,
    p_result: result,
    p_reviewed_by: user.id,
    p_review_note: reviewNote,
  });

  if (rpcResult.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = rpcResult.data as { ok: boolean; error?: string; file_key?: string };
  if (!data.ok) {
    return jsonResponse(data, data.error === 'NOT_FOUND' ? 404 : 400);
  }

  if (data.file_key) {
    const removeResult = await admin.storage.from('evidence').remove([data.file_key]);
    if (removeResult.error) {
      // ไฟล์ในตาราง evidences ถูก mark ว่าตรวจแล้วเรียบร้อยไปแล้ว (แก้ไขไม่ได้แล้ว
      // ตรงนี้) แต่ไฟล์จริงอาจยังค้างอยู่ใน storage — log ไว้ให้เห็นใน function logs
      console.error('[admin-review-evidence] storage.remove failed', data.file_key, removeResult.error);
    }
  }

  return jsonResponse({ ok: true }, 200);
});
