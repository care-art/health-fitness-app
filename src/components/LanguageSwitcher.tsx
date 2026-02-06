import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Icon } from './common';

export const LanguageSwitcher: React.FC = () => {
  const { 
    language, 
    languageConfig, 
    setLanguage, 
    autoDetect, 
    setAutoDetect,
    detectedLanguage,
    detectionMethod,
    supportedLanguages,
    t,
    isLoading 
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
  };

  const getDetectionMethodText = () => {
    switch (detectionMethod) {
      case 'ip':
        return t('language.auto') + ' (IP)';
      case 'browser':
        return t('language.auto') + ' (Browser)';
      default:
        return t('language.auto');
    }
  };

  if (isLoading) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-500">
        <Icon name="Globe" size={18} />
        <span className="text-sm">Loading...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* 切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{languageConfig.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{languageConfig.nativeName}</span>
        <Icon name="ChevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            {/* 头部 */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{t('language.title')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('language.description')}</p>
            </div>

            {/* 自动检测选项 */}
            <div className="p-3 border-b border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="language-mode"
                  checked={autoDetect}
                  onChange={() => setAutoDetect(true)}
                  className="w-4 h-4 text-emerald-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{t('language.auto')}</p>
                  <p className="text-xs text-gray-500">{t('language.autoDescription')}</p>
                  {detectedLanguage && autoDetect && (
                    <p className="text-xs text-emerald-600 mt-1">
                      {t('language.detected', { language: getDetectionMethodText() })}
                    </p>
                  )}
                </div>
              </label>
            </div>

            {/* 手动选择 */}
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                {t('language.manual')}
              </p>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      language === lang.code && !autoDetect
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lang.nativeName}</p>
                      <p className="text-xs text-gray-500">{lang.name}</p>
                    </div>
                    {language === lang.code && !autoDetect && (
                      <Icon name="Check" size={16} className="text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 底部信息 */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {t('language.savePreference')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 简化的语言切换按钮（用于移动端）
export const LanguageSwitcherCompact: React.FC = () => {
  const { languageConfig, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <span className="text-base">{languageConfig.flag}</span>
        <Icon name="ChevronDown" size={14} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 ${
                  languageConfig.code === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
