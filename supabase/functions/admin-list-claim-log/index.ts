// POST /admin-list-claim-log — log ทั้งหมดของ claim หนึ่งใบ (รวม log ของ
// review/evidence ที่เกี่ยวข้องด้วย) ให้แอดมินดูย้อนหลังได้ว่าเกิดอะไรขึ้นบ้าง
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
  if (!claimId) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const result = await admin.rpc('admin_list_claim_log', { p_claim_id: claimId });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  return jsonResponse({ ok: true, log: result.data }, 200);
});
