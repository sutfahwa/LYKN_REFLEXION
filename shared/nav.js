// เมนูนำทางและ helper ภาษา ใช้ร่วมกันทุกหน้า (แต่ละหน้าโหลดไฟล์นี้ผ่าน <script src>)

function lyknPages(en) {
  return [
    { key: 'home', label: en ? 'Home' : 'หน้าแรก', href: '/index.html' },
    { key: 'details', label: en ? 'Concert Details' : 'รายละเอียดคอนเสิร์ต', href: '/details/overview/index.html' },
    { key: 'tips', label: en ? 'Ticket Tips' : 'เคล็ดลับกดบัตร', href: '/tips/index.html' },
    { key: 'watchlist', label: 'LYKN Watchlist', href: '/watchlist/series/index.html' },
    { key: 'faq', label: en ? 'FAQ' : 'คำถามที่พบบ่อย', href: '/faq/index.html' },
    { key: 'gacha', label: 'Lucky Draw', href: '/gacha/index.html' }
  ];
}

// รายการเมนูใน hamburger (ไม่รวมหน้าแรก เพราะหน้าแรกอยู่นอกเมนูเสมอ ในรูปโลโก้)
function buildMenuItems(currentPageKey, en) {
  return lyknPages(en).filter(p => p.key !== 'home').map(p => ({
    label: p.label,
    href: p.href,
    bg: currentPageKey === p.key ? 'rgba(111,224,214,0.15)' : 'transparent',
    color: currentPageKey === p.key ? '#6fe0d6' : '#dcece9'
  }));
}

function homeLabel(en) { return en ? 'Home' : 'หน้าหลัก'; }

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
      label: l.label,
      selected: l.code === current.code,
      bg: l.code === current.code ? 'rgba(111,224,214,0.15)' : 'transparent',
      color: l.code === current.code ? '#6fe0d6' : '#dcece9',
      onClick: () => onSetLang(l.code)
    }))
  };
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
