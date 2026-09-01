// POST /admin-list-users — ดึงรายชื่อ user ทั้งหมดสำหรับหน้าจัดการ user ของแอดมิน
// ดึงตรงจาก auth.users ผ่าน admin.auth.admin.listUsers() (ไม่มีตาราง user
// แยกต่างหาก) — วนหน้าไปเรื่อยๆ จนกว่าจะครบ เผื่อ user เกิน 1 หน้า
import { handlePreflight, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin, getAuthedUser } from '../_shared/supabaseAdmin.ts';
import { isAdminUser } from '../_shared/admin.ts';

const PER_PAGE = 1000;

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);
  }

  const authedUser = await getAuthedUser(req);
  if (!authedUser || !isAdminUser(authedUser)) {
    return jsonResponse({ error: 'FORBIDDEN' }, 403);
  }

  const admin = supabaseAdmin();

  const allUsers: Record<string, unknown>[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) {
      return jsonResponse({ error: 'INTERNAL_ERROR' }, 500);
    }
    allUsers.push(...data.users);
    if (data.users.length < PER_PAGE) break;
    page += 1;
  }

  const users = allUsers.map((u: any) => {
    const bannedUntil = u.banned_until ?? null;
    const isBanned = !!bannedUntil && new Date(bannedUntil).getTime() > Date.now();
    const providers: string[] = u.app_metadata?.providers ?? [];
    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      profile_name: u.user_metadata?.profile_name ?? null,
      x_handle: u.user_metadata?.user_name ?? null,
      is_admin: isAdminUser(u),
      is_banned: isBanned,
      banned_until: bannedUntil,
      data_deleted_at: u.user_metadata?.data_deleted_at ?? null,
      signup_provider: u.app_metadata?.provider ?? null,
      has_email_login: providers.includes('email'),
    };
  });

  users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return jsonResponse({ ok: true, users }, 200);
});
