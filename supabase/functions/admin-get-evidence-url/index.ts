// POST /admin-get-evidence-url — สร้าง signed URL อายุ 15 นาทีให้แอดมินดูไฟล์หลักฐาน
// นี่คือทางเดียวที่เข้าถึงไฟล์ในตาราง evidence ได้ (bucket ปิด ไม่มี public/RLS select)
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

const SIGNED_URL_TTL_SECONDS = 15 * 60;

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

  const fileKey = String(body.file_key ?? '').trim();
  if (!fileKey) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();

  // เช็คก่อนว่า file_key นี้มีอยู่จริงในตาราง evidences (ไม่ใช่ path ที่เดา/ยัดเข้ามาเอง)
  // ป้องกันแอดมินที่ token หลุด/ถูกขโมยใช้ endpoint นี้ไล่เดา path เพื่อออก signed URL ของไฟล์ใดก็ได้ใน bucket
  const { data: evidenceRow, error: evidenceLookupError } = await admin
    .from('evidences')
    .select('id')
    .eq('file_key', fileKey)
    .maybeSingle();

  if (evidenceLookupError || !evidenceRow) {
    return jsonResponse({ error: 'FILE_NOT_FOUND' }, 404);
  }

  const { data, error } = await admin.storage.from('evidence').createSignedUrl(fileKey, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    return jsonResponse({ error: 'FILE_NOT_FOUND' }, 404);
  }

  return jsonResponse({ ok: true, url: data.signedUrl, expires_in: SIGNED_URL_TTL_SECONDS }, 200);
});
