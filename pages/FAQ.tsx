import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FAQ_CONTENT, USER_MANUAL_CONTENT } from '../constants';
import { HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const { language, t } = useLanguage();
  const faqs = FAQ_CONTENT[language];
  const manual = USER_MANUAL_CONTENT[language];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 mr-3 text-emerald-600" />
          {t('faq_title')}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100 mb-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">{t('manual_heading')}</h2>
        <p className="text-slate-600 mb-6">{t('manual_intro')}</p>
        <div className="space-y-4">
          {manual.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
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
