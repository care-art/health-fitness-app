import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language, LanguageConfig } from './config';
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  STORAGE_KEY,
  getLanguageConfig,
  isLanguageSupported 
} from './config';
import { detectBestLanguage } from '../services/ipDetection';
import { getTranslation, type Translation } from './translations';

interface LanguageContextType {
  language: Language;
  languageConfig: LanguageConfig;
  translation: Translation;
  detectedLanguage: Language | null;
  detectionMethod: 'ip' | 'browser' | 'default' | null;
  isLoading: boolean;
  setLanguage: (lang: Language) => void;
  setAutoDetect: (enabled: boolean) => void;
  autoDetect: boolean;
  supportedLanguages: LanguageConfig[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);
  const [detectionMethod, setDetectionMethod] = useState<'ip' | 'browser' | 'default' | null>(null);
  const [autoDetect, setAutoDetectState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [translation, setTranslation] = useState<Translation>(getTranslation(DEFAULT_LANGUAGE));

  // 初始化语言设置
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // 1. 检查本地存储的用户偏好
        const savedPreference = localStorage.getItem(STORAGE_KEY);
        if (savedPreference) {
          const { language: savedLang, autoDetect: savedAuto } = JSON.parse(savedPreference);
          
          if (!savedAuto && isLanguageSupported(savedLang)) {
            setLanguageState(savedLang);
            setAutoDetectState(false);
            setTranslation(getTranslation(savedLang));
            setIsLoading(false);
            return;
          }
        }

        // 2. 自动检测语言
        setIsLoading(true);
        const detection = await detectBestLanguage();
        
        setDetectedLanguage(detection.language);
        setDetectionMethod(detection.method);
        
        if (isLanguageSupported(detection.language)) {
          setLanguageState(detection.language);
          setTranslation(getTranslation(detection.language));
        } else {
          setLanguageState(DEFAULT_LANGUAGE);
          setTranslation(getTranslation(DEFAULT_LANGUAGE));
        }
      } catch (error) {
        console.error('Language initialization failed:', error);
        setLanguageState(DEFAULT_LANGUAGE);
        setTranslation(getTranslation(DEFAULT_LANGUAGE));
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  // 设置语言
  const setLanguage = useCallback((lang: Language) => {
    if (isLanguageSupported(lang)) {
      setLanguageState(lang);
      setTranslation(getTranslation(lang));
      
      // 保存到本地存储
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        language: lang,
        autoDetect: false,
      }));
      
      setAutoDetectState(false);
    }
  }, []);

  // 设置自动检测
  const setAutoDetect = useCallback((enabled: boolean) => {
    setAutoDetectState(enabled);
    
    if (enabled && detectedLanguage) {
      setLanguageState(detectedLanguage);
      setTranslation(getTranslation(detectedLanguage));
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      language: language,
      autoDetect: enabled,
    }));
  }, [detectedLanguage, language]);

  // 翻译函数
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 返回原key作为fallback
      }
    }
    
    if (typeof value === 'string') {
      // 替换参数
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          const paramValue = params[paramKey];
          return paramValue !== undefined ? String(paramValue) : match;
        });
      }
      return value;
    }
    
    return key;
  }, [translation]);

  const languageConfig = getLanguageConfig(language);

  const value: LanguageContextType = {
    language,
    languageConfig,
    translation,
    detectedLanguage,
    detectionMethod,
    isLoading,
    setLanguage,
    setAutoDetect,
    autoDetect,
    supportedLanguages: SUPPORTED_LANGUAGES,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义Hook
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 简化版翻译Hook
export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};
