import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Factory, Zap, Globe } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-5 text-xl text-slate-500">
          {t('subtitle')}
        </p>
        <div className="mt-8">
          <Link
            to="/calculator"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:text-lg md:px-10 transition-colors shadow-lg"
          >
            {t('startCalc')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Factory className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="ml-3 text-lg font-bold text-slate-900">{t('scope1')}</h3>
          </div>
          <p className="text-slate-600">{t('scope1Desc')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-sky-500">
          <div className="flex items-center mb-4">
            <div className="bg-sky-100 p-3 rounded-full">
              <Zap className="h-6 w-6 text-sky-600" />
            </div>
            <h3 className="ml-3 text-lg font-bold text-slate-900">{t('scope2')}</h3>
          </div>
          <p className="text-slate-600">{t('scope2Desc')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="ml-3 text-lg font-bold text-slate-900">{t('scope3')}</h3>
          </div>
          <p className="text-slate-600">{t('scope3Desc')}</p>
        </div>
      </div>
    </div>
  );
};
