import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Factory, Zap, Globe, BarChart3, ShieldCheck, Server, Palette, LifeBuoy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { api } from '../services/api';
import { UsageStats } from '../types';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getStats()
      .then((data) => {
        if (mounted) {
          setStats(data);
        }
      })
      .catch(() => setStatsError(true));
    return () => {
      mounted = false;
    };
  }, []);

  const projectHighlights = [
    {
      title: t('project_info_title'),
      description: t('project_info_body'),
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
    },
    {
      title: t('hosting_title'),
      description: t('hosting_body'),
      icon: <Server className="h-6 w-6 text-sky-600" />,
    },
    {
      title: t('support_title'),
      description: t('support_body'),
      icon: <LifeBuoy className="h-6 w-6 text-amber-600" />,
    },
    {
      title: t('design_title'),
      description: t('design_body'),
      icon: <Palette className="h-6 w-6 text-purple-600" />,
    },
  ];

  const statCards = [
    { label: t('stats_total_calcs'), value: stats?.totalCalculations ?? '—' },
    { label: t('stats_total_emissions'), value: stats ? `${stats.totalEmissions.toLocaleString()} kg` : '—' },
    { label: t('stats_avg_emission'), value: stats ? `${stats.averageEmission.toLocaleString()} kg` : '—' },
    { label: t('stats_last_calc'), value: stats?.lastCalculationAt ? new Date(stats.lastCalculationAt).toLocaleString() : (statsError ? 'N/A' : '—') },
  ];

  const chartData = [
    { name: 'Scope 1', value: stats?.scopeAverages?.scope1 ?? 0, fill: '#10b981' },
    { name: 'Scope 2', value: stats?.scopeAverages?.scope2 ?? 0, fill: '#0ea5e9' },
    { name: 'Scope 3', value: stats?.scopeAverages?.scope3 ?? 0, fill: '#a855f7' },
  ];

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

      <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">{t('stats_heading')}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((card, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">{card.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {chartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectHighlights.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center mb-3 space-x-3">
              <div className="p-2 bg-slate-100 rounded-full">{item.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            </div>
            <p className="text-slate-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
