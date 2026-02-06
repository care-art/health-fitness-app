import type { Translation } from './zh-CN';
import { zhCN } from './zh-CN';
import { en } from './en';

export type { Translation };

// 所有语言翻译
export const translations: Record<string, Translation> = {
  'zh-CN': zhCN,
  'zh-TW': zhCN, // 繁体中文使用简体中文
  'en': en,
  'ja': en, // 日语使用英语作为备选
  'ko': en, // 韩语使用英语作为备选
  'es': en, // 西班牙语使用英语作为备选
  'fr': en, // 法语使用英语作为备选
  'de': en, // 德语使用英语作为备选
  'ru': en, // 俄语使用英语作为备选
  'ar': en, // 阿拉伯语使用英语作为备选
};

export function getTranslation(language: string): Translation {
  const translation = translations[language];
  if (translation) {
    return translation;
  }
  console.warn(`Translation not found for: ${language}, falling back to zh-CN`);
  return translations['zh-CN'];
}
