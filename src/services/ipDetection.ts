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

// 缓存检测结果
let cachedResult: IPDetectionResult | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

/**
 * 检测用户IP地址并返回地理位置信息
 */
export async function detectLocationByIP(): Promise<IPDetectionResult> {
  // 检查缓存
  if (cachedResult && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('Using cached IP detection result');
    return cachedResult;
  }

  // 尝试多个IP检测服务
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
          
          // 缓存结果
          cachedResult = detectionResult;
          cacheTimestamp = Date.now();
          
          console.log(`IP Detection successful via ${service.name}:`, detectionResult);
          return detectionResult;
        }
      }
    } catch (error) {
      console.warn(`IP detection service ${service.name} failed:`, error);
      continue;
    }
  }

  // 所有服务都失败，返回默认值
  console.warn('All IP detection services failed, using default');
  return {
    country: 'CN',
    countryName: 'China',
    language: DEFAULT_LANGUAGE,
    source: 'default',
  };
}

/**
 * 获取单个IP服务的数据
 */
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
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * 清除IP检测缓存
 */
export function clearIPCache(): void {
  cachedResult = null;
  cacheTimestamp = 0;
}

/**
 * 获取浏览器语言设置
 */
export function getBrowserLanguage(): string {
  const navigatorLanguage = navigator.language || (navigator as any).userLanguage;
  return navigatorLanguage || DEFAULT_LANGUAGE;
}

/**
 * 综合检测最佳语言
 */
export async function detectBestLanguage(): Promise<{
  language: Language;
  method: 'ip' | 'browser' | 'default';
  details: IPDetectionResult | null;
}> {
  try {
    // 首先尝试IP检测
    const ipResult = await detectLocationByIP();
    if (ipResult.source !== 'default') {
      return {
        language: ipResult.language,
        method: 'ip',
        details: ipResult,
      };
    }
  } catch (error) {
    console.warn('IP detection failed:', error);
  }
  
  // 回退到浏览器语言
  const browserLang = getBrowserLanguage();
  if (browserLang) {
    return {
      language: browserLang as Language,
      method: 'browser',
      details: null,
    };
  }
  
  // 最终回退到默认语言
  return {
    language: DEFAULT_LANGUAGE,
    method: 'default',
    details: null,
  };
}
