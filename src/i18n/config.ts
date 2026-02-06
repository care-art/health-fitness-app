// 国际化配置
export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru' | 'ar';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

// 支持的语言列表
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文', flag: '🇹🇼', direction: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'ja', name: '日本語', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'ko', name: '한국어', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'ru', name: 'Русский', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
];

// 默认语言
export const DEFAULT_LANGUAGE: Language = 'zh-CN';

// 本地存储键
export const STORAGE_KEY = 'user-language-preference';

// IP检测服务配置
export const IP_DETECTION_SERVICES = [
  { name: 'ipapi', url: 'https://ipapi.co/json/', timeout: 5000 },
  { name: 'ipinfo', url: 'https://ipinfo.io/json', timeout: 5000 },
  { name: 'geojs', url: 'https://get.geojs.io/v1/ip/geo.json', timeout: 5000 },
];

// 国家代码到语言的映射
export const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  // 中国
  'CN': 'zh-CN',
  // 台湾
  'TW': 'zh-TW',
  // 香港
  'HK': 'zh-TW',
  // 澳门
  'MO': 'zh-TW',
  // 新加坡
  'SG': 'zh-CN',
  // 马来西亚
  'MY': 'zh-CN',
  // 美国
  'US': 'en',
  // 英国
  'GB': 'en',
  // 加拿大
  'CA': 'en',
  // 澳大利亚
  'AU': 'en',
  // 新西兰
  'NZ': 'en',
  // 日本
  'JP': 'ja',
  // 韩国
  'KR': 'ko',
  // 西班牙
  'ES': 'es',
  // 墨西哥
  'MX': 'es',
  // 阿根廷
  'AR': 'es',
  // 哥伦比亚
  'CO': 'es',
  // 法国
  'FR': 'fr',
  // 德国
  'DE': 'de',
  // 奥地利
  'AT': 'de',
  // 瑞士
  'CH': 'de',
  // 俄罗斯
  'RU': 'ru',
  // 乌克兰
  'UA': 'ru',
  // 沙特阿拉伯
  'SA': 'ar',
  // 阿联酋
  'AE': 'ar',
  // 埃及
  'EG': 'ar',
};

// 获取语言配置
export function getLanguageConfig(code: Language): LanguageConfig {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
}

// 检查语言是否支持
export function isLanguageSupported(code: string): code is Language {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}
