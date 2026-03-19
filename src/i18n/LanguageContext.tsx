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

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function getStoredPreference(): { language: Language; autoDetect: boolean } | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (typeof parsed.language === 'string' && typeof parsed.autoDetect === 'boolean') {
      return { language: parsed.language as Language, autoDetect: parsed.autoDetect };
    }
    return null;
  } catch {
    return null;
  }
}

function savePreference(language: Language, autoDetect: boolean): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, autoDetect }));
  } catch {
    // Storage full or unavailable
  }
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);
  const [detectionMethod, setDetectionMethod] = useState<'ip' | 'browser' | 'default' | null>(null);
  const [autoDetect, setAutoDetectState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [translation, setTranslation] = useState<Translation>(getTranslation(DEFAULT_LANGUAGE));

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const saved = getStoredPreference();
        if (saved && !saved.autoDetect && isLanguageSupported(saved.language)) {
          setLanguageState(saved.language);
          setAutoDetectState(false);
          setTranslation(getTranslation(saved.language));
          setIsLoading(false);
          return;
        }

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
      } catch {
        setLanguageState(DEFAULT_LANGUAGE);
        setTranslation(getTranslation(DEFAULT_LANGUAGE));
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    if (isLanguageSupported(lang)) {
      setLanguageState(lang);
      setTranslation(getTranslation(lang));
      savePreference(lang, false);
      setAutoDetectState(false);
    }
  }, []);

  const setAutoDetect = useCallback((enabled: boolean) => {
    setAutoDetectState(enabled);

    if (enabled && detectedLanguage) {
      setLanguageState(detectedLanguage);
      setTranslation(getTranslation(detectedLanguage));
    }

    savePreference(language, enabled);
  }, [detectedLanguage, language]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translation;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in (value as object)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string') {
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

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};
