const NON_KO_LOCALES = ['en', 'ja', 'zh-cn', 'zh-tw', 'es', 'fr', 'de', 'pt-br', 'hi', 'ar', 'ru', 'id', 'tr', 'it', 'vi', 'th', 'nl'];
const ALL_LOCALES = ['ko', ...NON_KO_LOCALES];

function buildPattern(locales) {
  return `(?:${locales.map((locale) => locale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`;
}

const QUERY_LANG_PATTERN = buildPattern(ALL_LOCALES);
const LOCALIZED_LEGAL_PATTERN = buildPattern(NON_KO_LOCALES);

const FOOTER_LABELS = {
  ko: { terms: '이용약관', privacy: '개인정보처리방침', about: '소개', contact: '문의' },
  en: { terms: 'Terms', privacy: 'Privacy Policy', about: 'About', contact: 'Contact' },
  ja: { terms: '利用規約', privacy: 'プライバシーポリシー', about: 'サイト紹介', contact: 'お問い合わせ' },
  'zh-cn': { terms: '使用条款', privacy: '隐私政策', about: '关于', contact: '联系我们' },
  'zh-tw': { terms: '使用條款', privacy: '隱私權政策', about: '關於', contact: '聯絡我們' },
  es: { terms: 'Términos del servicio', privacy: 'Política de privacidad', about: 'Acerca de', contact: 'Contacto' },
  fr: { terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité', about: 'À propos', contact: 'Contact' },
  de: { terms: 'Nutzungsbedingungen', privacy: 'Datenschutzerklärung', about: 'Über uns', contact: 'Kontakt' },
  'pt-br': { terms: 'Termos de uso', privacy: 'Política de privacidade', about: 'Sobre', contact: 'Contato' },
  hi: { terms: 'उपयोग की शर्तें', privacy: 'गोपनीयता नीति', about: 'हमारे बारे में', contact: 'संपर्क' },
  ar: { terms: 'شروط الاستخدام', privacy: 'سياسة الخصوصية', about: 'حول الموقع', contact: 'اتصل بنا' },
  ru: { terms: 'Условия использования', privacy: 'Политика конфиденциальности', about: 'О сервисе', contact: 'Контакты' },
  id: { terms: 'Ketentuan penggunaan', privacy: 'Kebijakan privasi', about: 'Tentang', contact: 'Kontak' },
  tr: { terms: 'Kullanım Koşulları', privacy: 'Gizlilik Politikası', about: 'Hakkımızda', contact: 'İletişim' },
  it: { terms: 'Termini di servizio', privacy: 'Informativa sulla privacy', about: 'Chi siamo', contact: 'Contatti' },
  vi: { terms: 'Điều khoản sử dụng', privacy: 'Chính sách quyền riêng tư', about: 'Giới thiệu', contact: 'Liên hệ' },
  th: { terms: 'ข้อกำหนดการใช้งาน', privacy: 'นโยบายความเป็นส่วนตัว', about: 'เกี่ยวกับ', contact: 'ติดต่อ' },
  nl: { terms: 'Gebruiksvoorwaarden', privacy: 'Privacybeleid', about: 'Over ons', contact: 'Contact' }
};

const FOOTER_COPY = {
  ko: '제작: Juntae Ko',
  en: 'Designed and Developed by Juntae Ko',
  ja: '制作: Juntae Ko',
  'zh-cn': '制作：Juntae Ko',
  'zh-tw': '製作：Juntae Ko',
  es: 'Creado por Juntae Ko',
  fr: 'Conçu par Juntae Ko',
  de: 'Erstellt von Juntae Ko',
  'pt-br': 'Criado por Juntae Ko',
  hi: 'निर्माता: Juntae Ko',
  ar: 'إعداد: Juntae Ko',
  ru: 'Создано Juntae Ko',
  id: 'Dibuat oleh Juntae Ko',
  tr: 'Hazırlayan: Juntae Ko',
  it: 'Creato da Juntae Ko',
  vi: 'Được tạo bởi Juntae Ko',
  th: 'สร้างโดย Juntae Ko',
  nl: 'Gemaakt door Juntae Ko'
};

const RTL_LOCALES = new Set(['ar']);

module.exports = {
  ALL_LOCALES,
  NON_KO_LOCALES,
  QUERY_LANG_PATTERN,
  LOCALIZED_LEGAL_PATTERN,
  FOOTER_LABELS,
  FOOTER_COPY,
  RTL_LOCALES
};
