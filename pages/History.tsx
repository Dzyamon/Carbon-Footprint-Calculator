import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { EmissionResult } from '../types';
import { Clock, BarChart2, Loader2 } from 'lucide-react';

export const History: React.FC = () => {
  const { t } = useLanguage();
  const [history, setHistory] = useState<EmissionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setHistory(data);
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <Clock className="w-8 h-8 mr-3 text-emerald-600" />
          {t('history_title')}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <BarChart2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-xl text-slate-500">{t('history_empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                <span className="text-sm text-slate-500">
                  {item.date ? new Date(item.date).toLocaleString() : 'Date N/A'}
                </span>
                <span className="text-lg font-bold text-emerald-600">{item.total} kg CO₂e</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-slate-500 uppercase">{t('scope1')}</div>
                  <div className="font-semibold">{item.scope1}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">{t('scope2')}</div>
                  <div className="font-semibold">{item.scope2}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">{t('scope3')}</div>
                  <div className="font-semibold">{item.scope3}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};