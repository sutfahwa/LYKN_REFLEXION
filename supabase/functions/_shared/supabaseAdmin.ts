import { createClient } from 'jsr:@supabase/supabase-js@2';

// service_role client — bypass RLS ได้ ใช้เฉพาะฝั่ง server (Edge Function) เท่านั้น
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY เป็น env var ที่ Supabase inject ให้อัตโนมัติ
// ทุก Edge Function ไม่ต้องตั้งเอง
export function supabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
}

// ตรวจ JWT ของผู้เรียก (จาก header Authorization) แล้วคืน user ที่ login อยู่
// คืน null ถ้าไม่ได้ login / token ไม่ถูกต้อง
export async function getAuthedUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const client = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}
