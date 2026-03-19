import { IP_DETECTION_SERVICES, COUNTRY_TO_LANGUAGE, DEFAULT_LANGUAGE, type Language } from '../i18n/config';

interface IPDetectionResult {
  country: string;
  countryName: string;
  language: Language;
  source: string;
}

interface IPServiceResponse {
  country?: string;
  country_code?: string;
  countryCode?: string;
  country_name?: string;
  countryName?: string;
}

let cachedResult: IPDetectionResult | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function detectLocationByIP(): Promise<IPDetectionResult> {
  if (cachedResult && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedResult;
  }

  for (const service of IP_DETECTION_SERVICES) {
    try {
      const result = await fetchIPService(service.url, service.timeout);
      if (result) {
        const countryCode = result.country || result.country_code || result.countryCode;
        if (countryCode) {
          const normalizedCode = countryCode.toUpperCase();
          const language = COUNTRY_TO_LANGUAGE[normalizedCode] || DEFAULT_LANGUAGE;

          const detectionResult: IPDetectionResult = {
            country: normalizedCode,
            countryName: result.country_name || result.countryName || normalizedCode,
            language,
            source: service.name,
          };

          cachedResult = detectionResult;
          cacheTimestamp = Date.now();

          return detectionResult;
        }
      }
    } catch {
      continue;
    }
  }

  return {
    country: 'CN',
    countryName: 'China',
    language: DEFAULT_LANGUAGE,
    source: 'default',
  };
}

async function fetchIPService(url: string, timeout: number): Promise<IPServiceResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch {
    clearTimeout(timeoutId);
    throw new Error('Fetch failed');
  }
}

export function clearIPCache(): void {
  cachedResult = null;
  cacheTimestamp = 0;
}

export function getBrowserLanguage(): Language {
  const navigatorLanguage = navigator.language || (navigator as any).userLanguage;
  if (!navigatorLanguage) return DEFAULT_LANGUAGE;

  const langCode = navigatorLanguage.toLowerCase().split('-')[0];

  const browserLangMap: Record<string, Language> = {
    'zh': 'zh-CN',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'ru': 'ru',
    'ar': 'ar',
  };

  return browserLangMap[langCode] || DEFAULT_LANGUAGE;
}

export async function detectBestLanguage(): Promise<{
  language: Language;
  method: 'ip' | 'browser' | 'default';
  details: IPDetectionResult | null;
}> {
  try {
    const ipResult = await detectLocationByIP();
    if (ipResult.source !== 'default') {
      return {
        language: ipResult.language,
        method: 'ip',
        details: ipResult,
      };
    }
  } catch {
    // IP 检测失败，尝试浏览器语言
  }

  const browserLang = getBrowserLanguage();
  if (browserLang !== DEFAULT_LANGUAGE) {
    return {
      language: browserLang,
      method: 'browser',
      details: null,
    };
  }

  return {
    language: DEFAULT_LANGUAGE,
    method: 'default',
    details: null,
  };
}
