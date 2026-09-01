// POST /seat-register — ลงทะเบียนที่นั่งของตัวเอง (ต้อง login ด้วย x.com ก่อน)
// x_handle ดึงจาก session ที่ login ไว้เท่านั้น ไม่รับจาก client เพื่อกันการปลอมแปลง
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { buildSeatKey } from '../_shared/seatKey.ts';
import { isValidSeat } from '../_shared/venueMap.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';

function extractXHandle(user: { user_metadata?: Record<string, unknown> }): string | null {
  const meta = user.user_metadata ?? {};
  const handle = meta.user_name ?? meta.preferred_username ?? meta.nickname;
  return typeof handle === 'string' && handle.trim() ? handle.trim() : null;
}

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

  const xHandle = extractXHandle(user);
  if (!xHandle) {
    return jsonResponse({ error: 'X_HANDLE_MISSING' }, 400);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400);
  }

  const showId = String(body.show_id ?? '').trim();
  const zone = String(body.zone ?? '').trim();
  const row = String(body.row ?? '').trim();
  const seat = String(body.seat ?? '').trim();
  const ownerNameOptional = body.owner_name_optional ? String(body.owner_name_optional).trim() : null;
  const termsAccepted = body.terms_accepted === true;
  const ownershipConfirmed = body.ownership_confirmed === true;
  const confirmDuplicate = body.confirm_duplicate === true;

  if (!showId || !zone || !row || !seat) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  if (!isValidSeat(zone, row, seat)) {
    return jsonResponse({ error: 'SEAT_NOT_ON_MAP' }, 400);
  }

  if (!termsAccepted || !ownershipConfirmed) {
    return jsonResponse({ error: 'TERMS_NOT_ACCEPTED' }, 400);
  }

  const admin = supabaseAdmin();

  const rateOk = await admin.rpc('check_rate_limit', {
    p_bucket: 'register_user_day', p_key: user.id, p_limit: 20, p_window_seconds: 86400,
  });
  if (rateOk.error || rateOk.data === false) {
    return jsonResponse({ error: 'RATE_LIMITED' }, 429);
  }

  const seatKey = buildSeatKey({ showId, zone, row, seat });

  const result = await admin.rpc('register_claim', {
    p_owner_id: user.id,
    p_x_handle: xHandle,
    p_show_id: showId,
    p_zone: zone,
    p_row: row,
    p_seat: seat,
    p_seat_key: seatKey,
    p_owner_name_optional: ownerNameOptional,
    p_terms_accepted: termsAccepted,
    p_ownership_confirmed: ownershipConfirmed,
    p_confirm_duplicate: confirmDuplicate,
  });

  if (result.error) {
    return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
  }

  const data = result.data as { ok: boolean; error?: string };
  if (!data.ok) {
    const statusMap: Record<string, number> = {
      SEAT_ALREADY_CLAIMED: 409,
      SEAT_REGISTRATION_BLOCKED: 403,
      SELF_DUPLICATE: 409,
      SEAT_COOLDOWN: 409,
      RATE_LIMITED: 429,
    };
    return jsonResponse(data, statusMap[data.error ?? ''] ?? 400);
  }

  return jsonResponse(data, 201);
});
