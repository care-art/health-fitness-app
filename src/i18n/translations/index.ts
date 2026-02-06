import type { Translation } from './zh-CN';
import { zhCN } from './zh-CN';
import { en } from './en';

export type { Translation };

export const translations: Record<string, Translation> = {
  'zh-CN': zhCN,
  'zh-TW': zhCN, // 使用简体中文作为繁体中文的备选
  'en': en,
};

export function getTranslation(language: string): Translation {
  return translations[language] || translations['zh-CN'];
}
