// POST /submit-evidence — บันทึกหลักฐานที่อัปโหลดขึ้น Storage แล้ว (ไฟล์ต้อง
// อัปโหลดจาก client ตรงไปที่ bucket "evidence" ก่อน ด้วย path "{claim_id}/{filename}"
// โดยใช้ session ของผู้ใช้เอง — RLS ของ storage.objects จะเช็คความเป็นเจ้าของ
// claim ให้อัตโนมัติอยู่แล้ว ฟังก์ชันนี้แค่บันทึกลงตาราง evidences)
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';

// ตัดวิดีโอออกแล้ว (จำกัดขนาดไฟล์ที่ 2MB ทำให้วิดีโอไม่พอใช้จริง) — รับแค่รูปภาพ
// (ค่า VIDEO ที่เคยมีในข้อมูลเก่ายังอ่านแสดงผลได้ปกติ แค่ส่งใหม่ไม่ได้แล้ว)
const VALID_TYPES = ['SCREENSHOT'];

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
  const type = String(body.type ?? '').trim().toUpperCase();
  const fileKey = String(body.file_key ?? '').trim();

  if (!claimId || !fileKey || !VALID_TYPES.includes(type)) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  // file_key ต้องอยู่ในโฟลเดอร์ของ claim_id นี้เท่านั้น กัน client ส่ง path ของคนอื่นมา
  if (!fileKey.startsWith(`${claimId}/`)) {
    return jsonResponse({ error: 'INVALID_FILE_KEY' }, 400);
  }

  const admin = supabaseAdmin();

  const rateOk = await admin.rpc('check_rate_limit', {
    p_bucket: 'evidence_user_day', p_key: user.id, p_limit: 10, p_window_seconds: 86400,
  });
  if (rateOk.error || rateOk.data === false) {
    return jsonResponse({ error: 'RATE_LIMITED' }, 429);
  }

  const result = await admin.rpc('submit_evidence', {
    p_claim_id: claimId,
    p_owner_id: user.id,
    p_type: type,
    p_file_key: fileKey,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string; replaced_file_key?: string | null };
  if (!data.ok) {
    const statusMap: Record<string, number> = {
      NOT_FOUND: 404, FORBIDDEN: 403, ALREADY_DELETED: 409, ALREADY_VERIFIED: 409, CLAIM_REJECTED_FINAL: 409,
    };
    return jsonResponse(data, statusMap[data.error ?? ''] ?? 400);
  }

  // มีไฟล์เก่าที่เพิ่งถูกแทนที่ (ยังไม่เคยตรวจ) -> ลบไฟล์จริงออกจาก storage ด้วย
  if (data.replaced_file_key) {
    const removeResult = await admin.storage.from('evidence').remove([data.replaced_file_key]);
    if (removeResult.error) {
      console.error('[submit-evidence] storage.remove failed', data.replaced_file_key, removeResult.error);
    }
  }

  return jsonResponse(data, 201);
});
