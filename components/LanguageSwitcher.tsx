import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 shadow-sm"
      >
        <option value={Language.EN}>🇬🇧 English</option>
        <option value={Language.PL}>🇵🇱 Polski</option>
        <option value={Language.SK}>🇸🇰 Slovenčina</option>
        <option value={Language.DE}>🇩🇪 Deutsch</option>
        <option value={Language.IT}>🇮🇹 Italiano</option>
        <option value={Language.HR}>🇭🇷 Hrvatski</option>
      </select>
    </div>
  );
};
