// เมนูนำทางและ helper ภาษา ใช้ร่วมกันทุกหน้า (แต่ละหน้าโหลดไฟล์นี้ผ่าน <script src>)

// ============================================================
// สวิตช์ปิดปรับปรุงชั่วคราว (kill switch) — ใช้ตอนคนเข้าเยอะจนโควต้า Supabase/
// Netlify ใกล้เต็ม แล้วอยากพักระบบชั่วคราวโดยไม่ต้องรอให้แต่ละ request ค่อยๆ fail
// เอง แก้แค่บรรทัดเดียว (true/false) ด้านล่างนี้ แล้วค่อย deploy ทีเดียวตอนพร้อม
// (ไม่ auto-detect โควต้าเอง เพราะแยกไม่ออกจริงๆ ว่า error ที่เจอเป็นเพราะโควต้า
// เต็มหรือปัญหาอื่นชั่วคราว — ให้แอดมินเป็นคนตัดสินใจเปิด/ปิดเองแทน)
//
// ผลตอนเปิด (true): ทุกหน้าฝั่งผู้ใช้ (ไม่รวม /admin) เด้งไปหน้า
// "ปิดปรับปรุงชั่วคราว" (/errors/503/index.html) ทันทีตั้งแต่โหลดหน้า — ฝั่งแอดมิน
// ยังเข้าจัดการ/เช็คข้อมูลได้ตามปกติระหว่างปิดปรับปรุง
// ============================================================
const MAINTENANCE_MODE = false;
if (MAINTENANCE_MODE && !location.pathname.startsWith('/admin')) {
  location.replace('/errors/503/index.html');
}

// ============================================================
// แจ้งเตือนกรณีเปิดเว็บผ่าน in-app browser ของแอปอื่น (X/Twitter, Instagram,
// Facebook, LINE, TikTok) — บั๊กที่พี่แจ้ง "แนบไฟล์ไม่ได้ ไม่ส่งไปเปิดที่ browser
// อื่น": in-app browser พวกนี้มักบล็อก/จำกัด <input type="file"> ไม่ให้เปิด
// file picker เต็มรูปแบบเหมือน Safari/Chrome จริง — และ**ไม่มีทางที่หน้าเว็บจะสั่ง
// ให้เด้งออกไปเปิดในเบราว์เซอร์นอกแอปเองได้** (ทั้ง iOS และ Android ตั้งใจบล็อกไว้
// เพื่อความปลอดภัย ไม่ใช่ข้อจำกัดของโค้ดเรา) ทำได้แค่ตรวจจับแล้วแจ้งผู้ใช้ให้กดเปิด
// เองผ่านเมนูของแอปนั้นๆ — ตรวจจาก user agent ซึ่งไม่แม่นยำ 100% เพราะแต่ละแอป
// เปลี่ยนวิธี identify ตัวเองได้ตลอดเวลาโดยไม่แจ้งล่วงหน้า
// ============================================================
const IN_APP_BROWSER_PATTERNS = [
  { test: /Twitter/i, th: 'X (Twitter)', en: 'X (Twitter)' },
  { test: /Instagram/i, th: 'Instagram', en: 'Instagram' },
  { test: /FBAN|FBAV|FB_IAB/i, th: 'Facebook', en: 'Facebook' },
  { test: /\bLine\//i, th: 'LINE', en: 'LINE' },
  { test: /BytedanceWebview|musical_ly|TikTok/i, th: 'TikTok', en: 'TikTok' }
];
function detectInAppBrowser() {
  const ua = (navigator.userAgent || '');
  for (const p of IN_APP_BROWSER_PATTERNS) {
    if (p.test.test(ua)) return p;
  }
  return null;
}
function dismissInAppBrowserBanner() {
  const el = document.getElementById('lykn-iab-banner');
  if (el) el.remove();
  try { sessionStorage.setItem('lykn_iab_dismissed', '1'); } catch (e) { /* ignore */ }
}
function initInAppBrowserBanner() {
  if (location.pathname.startsWith('/admin')) return;
  const app = detectInAppBrowser();
  if (!app) return;
  try {
    if (sessionStorage.getItem('lykn_iab_dismissed') === '1') return;
  } catch (e) { /* ignore */ }

  const en = getStoredLang() === 'en';
  const text = en
    ? `You're viewing this inside the ${app.en} app's browser — some features (like attaching evidence files) may not work here. Tap the ⋯ or share icon above, then choose "Open in Browser" for full functionality.`
    : `คุณกำลังเปิดเว็บนี้ผ่านเบราว์เซอร์ในแอป ${app.th} — บางฟีเจอร์ (เช่น แนบไฟล์หลักฐาน) อาจใช้งานไม่ได้ กดปุ่ม ⋯ หรือไอคอนแชร์ด้านบนของแอป แล้วเลือก "เปิดในเบราว์เซอร์" เพื่อใช้งานได้เต็มรูปแบบ`;

  const banner = document.createElement('div');
  banner.id = 'lykn-iab-banner';
  banner.style.cssText = 'position:fixed;top:60px;left:12px;right:12px;z-index:49;display:flex;align-items:flex-start;gap:10px;background:rgba(255,176,32,0.14);backdrop-filter:blur(6px);border:1px solid rgba(255,176,32,0.4);border-radius:12px;padding:12px 14px;box-shadow:0 8px 20px rgba(0,0,0,0.35);font-family:\'Noto Sans Thai\',sans-serif;';
  banner.innerHTML =
    '<div style="width:18px;height:18px;border-radius:50%;background:#ffb066;color:#0d1117;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex:none;margin-top:1px">!</div>' +
    '<div style="flex:1;font-size:12.5px;line-height:1.6;color:#eafffb"></div>' +
    '<div id="lykn-iab-close" style="flex:none;cursor:pointer;color:#8ea6a3;font-size:16px;line-height:1;padding:2px">✕</div>';
  banner.querySelector('div:nth-child(2)').textContent = text;
  banner.querySelector('#lykn-iab-close').addEventListener('click', dismissInAppBrowserBanner);
  document.body.appendChild(banner);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInAppBrowserBanner);
} else {
  initInAppBrowserBanner();
}

// สไตล์กล่องแจ้งเตือนแบบ alert message (success/warning/error/info) — ใช้ค่าสีชุด
// เดียวกับที่มีอยู่แล้วในเว็บ (เช่น การ์ดผลตรวจสอบที่นั่ง) เพื่อให้ธีมสอดคล้องกันทั้งเว็บ
// คืนแค่ token สี/ไอคอน ส่วน markup ยังต้องใส่แยกในแต่ละไฟล์ตามธรรมเนียมเดิมของโปรเจกต์
const ALERT_VARIANTS = {
  success: { bg: 'rgba(111,224,214,0.1)', border: 'rgba(111,224,214,0.35)', iconBg: '#6fe0d6', textColor: '#6fe0d6', icon: '✓' },
  warning: { bg: 'rgba(255,176,32,0.1)', border: 'rgba(255,176,32,0.4)', iconBg: '#ffb066', textColor: '#ffb066', icon: '!' },
  error: { bg: 'rgba(255,80,80,0.1)', border: 'rgba(255,107,107,0.4)', iconBg: '#ff6b6b', textColor: '#ff6b6b', icon: '✕' },
  info: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', iconBg: '#8ea6a3', textColor: '#c7d4d2', icon: 'i' }
};
function alertVariant(name) { return ALERT_VARIANTS[name] || ALERT_VARIANTS.info; }

function lyknPages(en) {
  return [
    { key: 'home', label: en ? 'Home' : 'หน้าแรก', href: '/index.html' },
    { key: 'details', label: en ? 'Concert Details' : 'รายละเอียดคอนเสิร์ต', href: '/details/overview/index.html' },
    { key: 'seat', label: "Where's My Seat", href: '/details/seat/index.html' },
    { key: 'check', label: en ? 'Seat Check' : 'ตรวจสอบที่นั่ง', href: '/details/check/index.html' },
    { key: 'tips', label: en ? 'Ticket Tips' : 'เคล็ดลับกดบัตร', href: '/tips/index.html' },
    { key: 'watchlist', label: 'LYKN Watchlist', href: '/watchlist/series/index.html' },
    { key: 'faq', label: en ? 'FAQ' : 'คำถามที่พบบ่อย', href: '/faq/index.html' },
    { key: 'gacha', label: 'Lucky Draw', href: '/gacha/index.html' },
    { key: 'guide', label: en ? 'How to Use This Site' : 'วิธีใช้งานเว็บ', href: '/guide/index.html' },
    { key: 'profile', label: en ? 'My Profile' : 'โปรไฟล์ของฉัน', href: '/profile/index.html' }
  ];
}

// รายการเมนูใน hamburger แบบ "candy box" (กริด 2 คอลัมน์ + คำอธิบายสั้นๆ) —
// ไม่รวมหน้าแรก (อยู่เป็นแถวแยกด้านบนสุดของเมนูเสมอ) และไม่รวมโปรไฟล์ (มีปุ่ม
// โปรไฟล์/เข้าสู่ระบบแยกออกไปเป็นปุ่มของตัวเองใน nav อยู่แล้ว ไม่ต้องซ้ำ)
const MENU_DESCRIPTIONS = {
  details: { th: 'วันที่ สถานที่ และรายละเอียดงาน', en: 'Date, venue & event info' },
  seat: { th: 'ดูผังที่นั่ง โซน แถว และมุมมองจำลอง', en: 'Explore the seat map & zone views' },
  check: { th: 'เช็กที่นั่งกับผู้ขายก่อนซื้อ', en: "Verify a seller's seat before buying" },
  tips: { th: 'เทคนิคและคำแนะนำการจองบัตร', en: 'Tips & tricks for ticket day' },
  watchlist: { th: 'ซีรีส์และเพลงที่ควรดูก่อนงาน', en: 'Series & songs to watch first' },
  faq: { th: 'คำตอบข้อสงสัยที่พบบ่อย', en: 'Answers to common questions' },
  gacha: { th: 'สุ่มการ์ดพิเศษ', en: 'Draw exclusive cards' },
  guide: { th: 'สรุปวิธีใช้ทุกเมนู และเงื่อนไขที่ควรรู้', en: 'How every menu works, plus what to know' }
};
function buildMenuItems(currentPageKey, en) {
  return lyknPages(en).filter(p => p.key !== 'home' && p.key !== 'profile').map(p => ({
    label: p.label,
    desc: (MENU_DESCRIPTIONS[p.key] || {})[en ? 'en' : 'th'] || '',
    href: p.href,
    bg: currentPageKey === p.key ? 'rgba(111,224,214,0.15)' : 'rgba(255,255,255,0.04)',
    color: currentPageKey === p.key ? '#6fe0d6' : '#eafffb'
  }));
}

function homeLabel(en) { return en ? 'Home' : 'หน้าหลัก'; }
function homeDesc(en) { return en ? 'Back to the homepage' : 'กลับไปยังหน้าแรกของเว็บไซต์'; }

// ข้อมูลโปรไฟล์ (อวาตาร์+ชื่อ) สำหรับปุ่มบน nav bar เมื่อ login แล้ว — ดึงจาก
// user_metadata ตรงๆ (ไม่ query DB เพิ่ม) ใช้ fallback เดียวกับหน้าโปรไฟล์
// เผื่อยังไม่เคยตั้งค่าโปรไฟล์ (เช่น เพิ่งสมัครด้วยอีเมล ยังไม่ผ่านหน้า setup)
function navProfileInfo(session, en) {
  if (!session || !session.user) return null;
  const meta = session.user.user_metadata || {};
  return {
    emoji: meta.profile_emoji || '🦊',
    bg: meta.profile_bg || '#0891b2',
    name: meta.profile_name || (en ? 'My Profile' : 'โปรไฟล์ของฉัน')
  };
}

// ตัวเลือกภาษาแบบ dropdown (ธง + รหัสภาษา + ลูกศร) แทนปุ่ม TH/EN คู่แบบเดิม
function buildLangSelector(en, onSetLang) {
  const langs = [
    { code: 'th', flag: '🇹🇭', label: 'ไทย (TH)', shortLabel: 'TH' },
    { code: 'en', flag: '🇬🇧', label: 'English (EN)', shortLabel: 'EN' }
  ];
  const current = langs.find(l => l.code === (en ? 'en' : 'th'));
  return {
    currentFlag: current.flag,
    currentShortLabel: current.shortLabel,
    options: langs.map(l => ({
      flag: l.flag,
      shortLabel: l.shortLabel,
      label: l.label,
      selected: l.code === current.code,
      bg: l.code === current.code ? 'rgba(111,224,214,0.15)' : 'transparent',
      color: l.code === current.code ? '#6fe0d6' : '#dcece9',
      onClick: () => onSetLang(l.code)
    }))
  };
}

// ระบบแจ้งเตือน (กระดิ่งบน nav) — โหลด/ทำเครื่องหมายอ่านผ่านตาราง `notifications`
// ใน Supabase (RLS กรองให้เห็นของตัวเอง + "ประกาศ" ที่ user_id เป็น null ซึ่งทุกคน
// เห็นร่วมกัน รวมถึงคนที่ยังไม่ login) ใช้ร่วมกันทุกหน้าที่มี nav — component คือ
// instance ของหน้านั้นๆ (มี state/setState) — เขียนเป็นฟังก์ชันแยกแทนการผูกเป็น
// method ตรงๆ เพราะแต่ละไฟล์มี class Component ของตัวเอง ไม่ได้แชร์กัน
const NOTIF_DROPDOWN_LIMIT = 10;

// ประกาศ (event_type ANNOUNCEMENT, user_id เป็น null) เป็น row เดียวกันที่ทุกคน
// เห็นร่วมกัน จะ update read_at ในตารางตรงๆ ไม่ได้ (จะกลายเป็น "อ่านแล้ว" ให้ทุกคน
// พร้อมกัน) เลยเก็บสถานะอ่านของประกาศแยกไว้ที่เครื่องผู้ใช้แต่ละคนผ่าน localStorage แทน
const READ_ANNOUNCEMENTS_KEY = 'lykn_read_announcements';
function getReadAnnouncementIds() {
  try { return new Set(JSON.parse(localStorage.getItem(READ_ANNOUNCEMENTS_KEY) || '[]')); }
  catch { return new Set(); }
}
function markAnnouncementReadLocally(id) {
  try {
    const ids = getReadAnnouncementIds();
    ids.add(id);
    localStorage.setItem(READ_ANNOUNCEMENTS_KEY, JSON.stringify([...ids]));
  } catch { /* localStorage ใช้ไม่ได้ (private mode ฯลฯ) — ปล่อยผ่าน ไม่ critical */ }
}
function isNotifRead(n) {
  if (n.user_id) return !!n.read_at;
  return getReadAnnouncementIds().has(n.id);
}

async function loadNotifications(component, sb, limit) {
  component.setState({ notifStatus: 'loading' });
  const { data, error } = await sb.from('notifications').select('*').order('created_at', { ascending: false }).limit(limit || NOTIF_DROPDOWN_LIMIT);
  if (error) { component.setState({ notifStatus: 'error' }); return; }
  component.setState({ notifStatus: 'done', notifications: data || [] });
}

function toggleNotifDropdown(component, sb) {
  const opening = !component.state.isNotifOpen;
  component.setState({ isNotifOpen: opening });
  if (opening) loadNotifications(component, sb, NOTIF_DROPDOWN_LIMIT);
}

function closeNotifDropdown(component) { component.setState({ isNotifOpen: false }); }

async function markNotifRead(component, sb, id) {
  await sb.rpc('mark_notification_read', { p_notification_id: id });
  component.setState({
    notifications: component.state.notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
  });
}

async function markAllNotifsRead(component, sb) {
  const unread = component.state.notifications.filter(n => !isNotifRead(n));
  if (!unread.length) return;
  const now = new Date().toISOString();
  unread.filter(n => !n.user_id).forEach(n => markAnnouncementReadLocally(n.id));
  component.setState({
    notifications: component.state.notifications.map(n => (n.user_id && !n.read_at) ? { ...n, read_at: now } : n)
  });
  await Promise.all(unread.filter(n => n.user_id).map(n => sb.rpc('mark_notification_read', { p_notification_id: n.id })));
}

// เปิดการ์ดแจ้งเตือน = ถือว่าอ่านแล้วเสมอ (ทั้งของตัวเองและประกาศ) ถ้าเป็นประกาศ
// แบบ "กดได้" (payload.is_clickable) จะเปิด modal รายละเอียดเพิ่มขึ้นมาด้วย
function openNotif(component, sb, n) {
  if (n.user_id) {
    markNotifRead(component, sb, n.id);
  } else {
    markAnnouncementReadLocally(n.id);
    component.setState({ notifications: [...component.state.notifications] }); // force re-render (อ่านสถานะจาก localStorage ใหม่)
  }
  if (n.event_type === 'ANNOUNCEMENT' && n.payload && n.payload.is_clickable) {
    component.setState({ isNotifOpen: false, announcementDetail: n.payload });
  }
}

function closeAnnouncementDetail(component) { component.setState({ announcementDetail: null }); }

// event_type ของแต่ละแจ้งเตือน -> key ข้อความใน t.profile.notifEvent (บาง event
// ต้องแยกข้อความตามผลลัพธ์ใน payload ด้วย เช่น อนุมัติ/ปฏิเสธ)
function notifTextKey(n) {
  if (n.event_type === 'EVIDENCE_RESULT') {
    return n.payload?.result === 'APPROVED' ? 'EVIDENCE_RESULT_APPROVED' : 'EVIDENCE_RESULT_REJECTED';
  }
  if (n.event_type === 'REVIEW_RESULT') {
    return n.payload?.outcome === 'OWNER_CONFIRMED' ? 'REVIEW_RESULT_OWNER_CONFIRMED'
      : n.payload?.outcome === 'FALSE_CLAIM_REMOVED' ? 'REVIEW_RESULT_FALSE_CLAIM_REMOVED' : 'REVIEW_RESULT';
  }
  return n.event_type;
}

// ประกาศ (ANNOUNCEMENT) เป็นข้อความอิสระที่แอดมินพิมพ์เอง (title/body ใน payload)
// ต่างจาก event อื่นที่เป็นข้อความสำเร็จรูปแปลไว้ล่วงหน้าใน t.profile.notifEvent
function notifCardText(n, t) {
  if (n.event_type === 'ANNOUNCEMENT') return (n.payload && n.payload.title) || '';
  return t.profile.notifEvent[notifTextKey(n)] || n.event_type;
}

function buildNotifCards(component, sb, t, locale) {
  return component.state.notifications.map(n => {
    const isAnnouncement = n.event_type === 'ANNOUNCEMENT';
    const subtext = isAnnouncement ? ((n.payload && n.payload.body) || '') : '';
    return {
      text: notifCardText(n, t),
      hasSubtext: !!subtext,
      subtext,
      timeLabel: new Date(n.created_at).toLocaleString(locale),
      bg: isNotifRead(n) ? 'transparent' : 'rgba(111,224,214,0.06)',
      onClick: () => openNotif(component, sb, n)
    };
  });
}

function getStoredLang() {
  try {
    return localStorage.getItem('lykn_lang') === 'en' ? 'en' : 'th';
  } catch (e) {
    return 'th';
  }
}

function setStoredLang(lang) {
  try {
    localStorage.setItem('lykn_lang', lang);
  } catch (e) { /* ignore (private mode etc.) */ }
}
