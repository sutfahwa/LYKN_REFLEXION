// ค่าตั้งต้นเชื่อมต่อ Supabase — ใช้ร่วมกันทุกหน้า โหลดผ่าน <script src="/shared/supabaseConfig.js">
// SUPABASE_ANON_KEY เป็น publishable/anon key ปลอดภัยฝังในโค้ดฝั่ง client ได้
// (ไม่ใช่ service_role key ซึ่งห้ามอยู่ในไฟล์ที่ deploy ขึ้นเว็บเด็ดขาด)
const SUPABASE_URL = 'https://xyqbvgbtspcjkyioxeiu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xAEHbbqXmYGRReCcAs7RQA_0zEUt27d';

function supabaseFunctionUrl(name) {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

// singleton client — ต้องโหลด supabase-js UMD (CDN) ไว้ก่อนไฟล์นี้ในหน้าที่ต้องใช้
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
let _sbClient = null;
function getSupabaseClient() {
  if (!_sbClient) {
    _sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _sbClient;
}
