import { useState } from 'react';
import { 
  BMICalculator, 
  BMRTDEECalculator, 
  BodyFatCalculator, 
  WHRCalculator,
  ExerciseCalculator,
  WaterCalculator,
  NutritionCalculator,
  HealthReport 
} from './components/calculators';
import { HistoryView } from './components/HistoryView';
import { navItems } from './data/navigation';
import { Icon, StyledAppIcon } from './components/common';
import { LanguageSwitcher, LanguageSwitcherCompact } from './components/LanguageSwitcher';
import { useLanguage } from './i18n/LanguageContext';
import type { CalculatorType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('bmi');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, languageConfig } = useLanguage();

  const renderCalculator = () => {
    switch (activeTab) {
      case 'bmi':
        return <BMICalculator />;
      case 'bmr':
        return <BMRTDEECalculator />;
      case 'bodyfat':
        return <BodyFatCalculator />;
      case 'whr':
        return <WHRCalculator />;
      case 'exercise':
        return <ExerciseCalculator />;
      case 'water':
        return <WaterCalculator />;
      case 'nutrition':
        return <NutritionCalculator />;
      case 'report':
        return <HealthReport />;
      case 'history':
        return <HistoryView />;
      default:
        return <BMICalculator />;
    }
  };

  const currentNavItem = navItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50" dir={languageConfig.direction}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Icon name="Heart" size={20} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('common.appName')}</h1>
                <p className="text-xs text-gray-500">{t('common.appDescription')}</p>
              </div>
            </div>

            {/* Right Section: Language Switcher & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Switcher - Desktop */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              
              {/* Language Switcher - Mobile */}
              <div className="lg:hidden">
                <LanguageSwitcherCompact />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Icon 
                  name={isMobileMenuOpen ? 'X' : 'Menu'} 
                  size={24} 
                  className="text-gray-600"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className={`
            lg:w-72 flex-shrink-0
            ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}
          `}>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group
                      ${isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-100'
                      }
                    `}
                  >
                    <StyledAppIcon 
                      type={item.id} 
                      size="md"
                      className={isActive ? 'opacity-90' : ''}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{t(`nav.${item.id}`)}</p>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <Icon name="ChevronRight" size={16} className="text-emerald-200" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Info Card */}
            <div className="mt-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Lightbulb" size={20} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{t('tips.title')}</p>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {t('tips.daily.0')}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-3xl mx-auto">
              {/* Page Title */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {currentNavItem && (
                    <StyledAppIcon 
                      type={currentNavItem.id} 
                      size="lg"
                      className="shadow-md"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {currentNavItem ? t(`nav.${currentNavItem.id}`) : ''}
                  </h2>
                </div>
                <p className="text-gray-600 ml-14">
                  {currentNavItem?.description}
                </p>
              </div>

              {/* Calculator Content */}
              <div className="animate-fade-in">
                {renderCalculator()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={16} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-gray-600">{t('common.appName')}</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              © 2024 {t('common.appName')} | {t('common.appDescription')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                <Icon name="Github" size={20} strokeWidth={2} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                <Icon name="Twitter" size={20} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
