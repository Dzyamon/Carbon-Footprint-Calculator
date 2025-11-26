import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, History, HelpCircle, Sun, Type } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { toggleHighContrast, toggleFontSize, highContrast } = useAccessibility();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-emerald-600';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-slate-800">EcoCalc</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
               <Link to="/" className={isActive('/')}>{t('menu_home')}</Link>
               <Link to="/calculator" className={isActive('/calculator')}>{t('menu_calc')}</Link>
               <Link to="/history" className={isActive('/history')}>{t('menu_history')}</Link>
               <Link to="/faq" className={isActive('/faq')}>{t('menu_faq')}</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleFontSize} 
              className="p-2 rounded-full hover:bg-slate-100" 
              title={t('a11y_font')}
            >
              <Type className="h-5 w-5 text-slate-600" />
            </button>
            <button 
              onClick={toggleHighContrast} 
              className={`p-2 rounded-full hover:bg-slate-100 ${highContrast ? 'bg-slate-200' : ''}`}
              title={t('a11y_contrast')}
            >
              <Sun className="h-5 w-5 text-slate-600" />
            </button>
            <LanguageSwitcher />
          </div>
        </div>
        
        {/* Mobile menu link row */}
        <div className="md:hidden flex justify-around py-2 border-t border-slate-100 text-sm">
           <Link to="/calculator" className={isActive('/calculator')}>{t('menu_calc')}</Link>
           <Link to="/history" className={isActive('/history')}>{t('menu_history')}</Link>
           <Link to="/faq" className={isActive('/faq')}>{t('menu_faq')}</Link>
        </div>
      </div>
    </nav>
  );
};
