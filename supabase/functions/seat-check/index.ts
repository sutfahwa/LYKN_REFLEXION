// POST /seat-check — ตรวจสอบว่าที่นั่ง + @ ผู้ขาย ตรงกันไหม
// กติกาความปลอดภัย: POST เท่านั้น, ไม่มี endpoint หาเจ้าของที่นั่งโดยไม่กรอก @,
// ตอน UNDER_REVIEW ต้องคืน response เหมือนกันเป๊ะไม่ว่า @ จะถูกหรือผิด,
// ไม่เก็บ IP ดิบ (เก็บแค่ hash), ทุกหน้า/response ใส่ Referrer-Policy: no-referrer
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { buildSeatKey } from '../_shared/seatKey.ts';
import { visitorHash, ipHash } from '../_shared/hash.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';

const CACHE_TTL_SECONDS = 45;

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
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
  const sellerHandle = String(body.seller_handle ?? '').trim();

  if (!showId || !zone || !row || !seat || !sellerHandle) {
    return jsonResponse({ error: 'MISSING_FIELDS' }, 400);
  }

  const admin = supabaseAdmin();
  const ipH = await ipHash(req);
  const visitH = await visitorHash(req);
  const user = await getAuthedUser(req);

  // rate limit: IP 30/min, 300/hr
  const ipMinuteOk = await admin.rpc('check_rate_limit', {
    p_bucket: 'seat_check_ip_min', p_key: ipH, p_limit: 30, p_window_seconds: 60,
  });
  const ipHourOk = await admin.rpc('check_rate_limit', {
    p_bucket: 'seat_check_ip_hour', p_key: ipH, p_limit: 300, p_window_seconds: 3600,
  });
  if (ipMinuteOk.error || ipHourOk.error || ipMinuteOk.data === false || ipHourOk.data === false) {
    return jsonResponse({ error: 'RATE_LIMITED' }, 429);
  }

  // rate limit: user 60/hr (เฉพาะกรณี login)
  if (user) {
    const userHourOk = await admin.rpc('check_rate_limit', {
      p_bucket: 'seat_check_user_hour', p_key: user.id, p_limit: 60, p_window_seconds: 3600,
    });
    if (userHourOk.error || userHourOk.data === false) {
      return jsonResponse({ error: 'RATE_LIMITED' }, 429);
    }
  }

  const seatKey = buildSeatKey({ showId, zone, row, seat });
  const normalizedHandle = sellerHandle.trim().toLowerCase().replace(/^@/, '');
  const cacheKey = `${showId}|${seatKey}|${normalizedHandle}`;

  // เช็ค cache ก่อน (30-60 วิ, invalidate ทันทีตอน register/delete/review)
  const cached = await admin
    .from('seat_check_cache')
    .select('response, expires_at')
    .eq('cache_key', cacheKey)
    .maybeSingle();

  let responseData: Record<string, unknown>;

  if (cached.data && new Date(cached.data.expires_at) > new Date()) {
    responseData = cached.data.response as Record<string, unknown>;
  } else {
    const result = await admin.rpc('check_seat', {
      p_show_id: showId,
      p_seat_key: seatKey,
      p_seller_handle: sellerHandle,
      p_visitor_hash: visitH,
    });

    if (result.error) {
      return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
    }

    responseData = result.data;

    await admin.from('seat_check_cache').upsert({
      cache_key: cacheKey,
      seat_key: seatKey,
      response: result.data,
      expires_at: new Date(Date.now() + CACHE_TTL_SECONDS * 1000).toISOString(),
    });
  }

  // ธง "เป็นที่นั่งของตัวเอง" คำนวณแยกจากส่วนที่แคชไว้เสมอ (query สดทุกครั้ง
  // ไม่พ่วงเข้าไปใน seat_check_cache) เพราะขึ้นกับตัวผู้เรียกคนนั้นๆ โดยตรง —
  // ถ้าเอาไปแคชรวมกับ response ทั่วไป จะมีโอกาสเผลอเอาผลของ user A ไปให้ user B
  // ที่เช็คที่นั่ง/ชื่อเดียวกันภายในหน้าต่างแคช 45 วิ
  if (user) {
    const own = await admin
      .from('claims')
      .select('id')
      .eq('show_id', showId)
      .eq('seat_key', seatKey)
      .eq('owner_id', user.id)
      .is('deleted_at', null)
      .neq('status', 'REJECTED')
      .maybeSingle();
    if (own.data) {
      responseData = { ...responseData, is_own: true };
    }
  }

  return jsonResponse(responseData, 200);
});
