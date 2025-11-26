import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { CalculatorState, EmissionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, AlertCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Results: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<EmissionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const rawData = location.state?.data as CalculatorState | undefined;

  useEffect(() => {
    if (!rawData) {
      navigate('/calculator');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.calculate(rawData);
        setResults(data);
      } catch (err) {
        setError('Failed to calculate results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rawData, navigate]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-container');
    if (!element) return;

    setIsGeneratingPdf(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EcoCalc_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600">Calculating your footprint...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Error</h2>
        <p className="text-slate-600 mb-6">{error || "Something went wrong"}</p>
        <button onClick={() => navigate('/calculator')} className="text-emerald-600 hover:underline">
          Return to Calculator
        </button>
      </div>
    );
  }

  const chartData = [
    { name: t('scope1'), value: results.scope1, fill: '#10b981' },
    { name: t('scope2'), value: results.scope2, fill: '#0ea5e9' },
    { name: t('scope3'), value: results.scope3, fill: '#a855f7' },
  ];

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-3xl font-bold text-slate-900">{t('results')}</h1>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )} 
          {t('downloadReport')}
        </button>
      </div>

      <div id="report-container" className="bg-white p-8 rounded-xl shadow-lg print:shadow-none print:p-0">
        <div className="mb-8 border-b pb-4">
           <div className="flex justify-between items-end">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">EcoCalc Report</h1>
                <p className="text-slate-500 text-sm mt-1">Carbon Footprint Analysis</p>
             </div>
             <p className="text-slate-500 text-sm">Generated on: {currentDate}</p>
             {results.id && <p className="text-slate-400 text-xs">ID: {results.id}</p>}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-900 text-white p-6 rounded-lg shadow-md print:bg-slate-100 print:text-black print:border">
            <h3 className="text-sm uppercase tracking-wider opacity-70 mb-1">{t('totalEmissions')}</h3>
            <p className="text-4xl font-bold">{results.total.toLocaleString()} <span className="text-lg font-normal">kg CO₂e</span></p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 print:bg-white print:border-slate-300">
            <h3 className="text-sm font-semibold text-emerald-800 mb-1">{t('scope1')}</h3>
            <p className="text-2xl font-bold text-emerald-600">{results.scope1.toLocaleString()} <span className="text-xs text-slate-500">kg</span></p>
            <p className="text-xs text-emerald-700 mt-2 opacity-80">{t('scope1Desc')}</p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg border border-sky-100 print:bg-white print:border-slate-300">
            <h3 className="text-sm font-semibold text-sky-800 mb-1">{t('scope2')}</h3>
            <p className="text-2xl font-bold text-sky-600">{results.scope2.toLocaleString()} <span className="text-xs text-slate-500">kg</span></p>
            <p className="text-xs text-sky-700 mt-2 opacity-80">{t('scope2Desc')}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 print:bg-white print:border-slate-300">
            <h3 className="text-sm font-semibold text-purple-800 mb-1">{t('scope3')}</h3>
            <p className="text-2xl font-bold text-purple-600">{results.scope3.toLocaleString()} <span className="text-xs text-slate-500">kg</span></p>
            <p className="text-xs text-purple-700 mt-2 opacity-80">{t('scope3Desc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 print:break-inside-avoid">
          <div className="h-80 border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-center">Emissions by Scope</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                  isAnimationActive={false} 
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80 border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-center">Breakdown Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40} isAnimationActive={false}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-x-auto print:break-inside-avoid">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Emission (kg CO₂e)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
               {Object.entries(results.breakdown || {}).map(([key, val]) => {
                  const numericVal = val as number;
                  if (numericVal <= 0) return null;
                  return (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">{numericVal.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">{((numericVal / results.total) * 100).toFixed(1)}%</td>
                    </tr>
                  )
               })}
            </tbody>
            <tfoot className="bg-slate-50">
               <tr>
                <td className="px-6 py-3 text-left text-sm font-bold text-slate-900">TOTAL</td>
                <td className="px-6 py-3 text-right text-sm font-bold text-slate-900">{results.total.toFixed(2)}</td>
                <td className="px-6 py-3 text-right text-sm font-bold text-slate-900">100%</td>
               </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 p-4 bg-amber-50 text-amber-800 rounded-md text-sm flex items-start print:hidden">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            Note: This calculation uses average emission factors typical for Poland and the EU. 
            For official ESG reporting, please consult with a certified auditor.
          </p>
        </div>
      </div>
    </div>
  );
};