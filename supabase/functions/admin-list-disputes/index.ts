// POST /admin-list-disputes — ดึงคิวข้อพิพาททั้งหมดสำหรับแอดมิน
// รองรับ body { claim_id } เพิ่มเติมเพื่อขอรายชื่อไฟล์หลักฐานของ claim นั้น
// (ใช้เปิด evidence-docs modal โดยไม่ต้องมี endpoint แยก)
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

  const admin = supabaseAdmin();

  let claimIdForEvidence: string | null = null;
  try {
    const body = await req.json();
    claimIdForEvidence = body?.claim_id ? String(body.claim_id) : null;
  } catch {
    // body ว่างก็ได้ แค่ขอ dispute list เฉยๆ
  }

  const disputesResult = await admin.rpc('admin_list_disputes');
  if (disputesResult.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  let evidence: unknown = null;
  if (claimIdForEvidence) {
    const evResult = await admin.rpc('admin_list_evidence_for_claim', { p_claim_id: claimIdForEvidence });
    if (!evResult.error) evidence = evResult.data;
  }

  return jsonResponse({ ok: true, disputes: disputesResult.data, evidence }, 200);
});
