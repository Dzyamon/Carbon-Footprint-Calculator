import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FAQ_CONTENT } from '../constants';
import { HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const { language, t } = useLanguage();
  const faqs = FAQ_CONTENT[language];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 mr-3 text-emerald-600" />
          {t('faq_title')}
        </h1>
      </div>

      <div className="space-y-6">
        {faqs.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.question}</h3>
            <p className="text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
