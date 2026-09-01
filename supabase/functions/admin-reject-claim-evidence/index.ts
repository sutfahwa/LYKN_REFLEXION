// POST /admin-reject-claim-evidence — แอดมินปฏิเสธบัตรตรงๆ ตอนตรวจหลักฐาน
// (ไม่ใช่ผ่านข้อพิพาท) ต้องระบุเหตุผลเสมอ ผู้ใช้ยังแก้ไข/ส่งหลักฐานใหม่ได้
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

  const claimId = String(body.claim_id ?? '').trim();
  const adminNote = String(body.admin_note ?? '').trim();

  if (!claimId || !adminNote) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const result = await admin.rpc('admin_reject_claim_evidence', {
    p_claim_id: claimId, p_admin_note: adminNote, p_admin_id: user.id,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string; deleted_file_key?: string | null };
  if (!data.ok) {
    const statusMap: Record<string, number> = {
      NOT_FOUND: 404, ALREADY_DELETED: 409, DISPUTE_IN_PROGRESS: 409, REASON_REQUIRED: 400,
    };
    return jsonResponse(data, statusMap[data.error ?? ''] ?? 400);
  }

  // หลักฐาน PENDING ของบัตรนี้ถูกตัดสินว่าไม่ผ่านไปพร้อมกันแล้ว -> ลบไฟล์จริงทิ้ง
  if (data.deleted_file_key) {
    const removeResult = await admin.storage.from('evidence').remove([data.deleted_file_key]);
    if (removeResult.error) {
      console.error('[admin-reject-claim-evidence] storage.remove failed', data.deleted_file_key, removeResult.error);
    }
  }

  return jsonResponse(data, 200);
});
