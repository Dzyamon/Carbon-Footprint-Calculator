import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CalculatorState, TranslationKey } from '../types';
import { Factory, Zap, Globe, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const INITIAL_STATE: CalculatorState = {
  scope1: { naturalGas: 0, heatingOil: 0, coal: 0, diesel: 0, petrol: 0, refrigerants: 0 },
  scope2: { electricity: 0, districtHeating: 0 },
  scope3: { water: 0, waste: 0, airTravelShort: 0, airTravelLong: 0, railTravel: 0 },
};

interface InputRowProps {
  labelKey: TranslationKey;
  value: number;
  onChange: (v: string) => void;
  unitKey: TranslationKey;
}

const InputRow: React.FC<InputRowProps> = ({ labelKey, value, onChange, unitKey }) => {
  const { t } = useLanguage();
  // Local state to handle string inputs (e.g. "1.", "0.5") without forcing number parsing immediately in the UI
  const [localValue, setLocalValue] = useState(value === 0 ? '' : value.toString());

  useEffect(() => {
    // Only sync from parent if the numeric value actually differs from our local parse.
    // This prevents "1." being replaced by "1" while typing.
    const parsedLocal = parseFloat(localValue) || 0;
    if (parsedLocal !== value) {
      setLocalValue(value === 0 ? '' : value.toString());
    }
  }, [value, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Strict validation: Allow empty string or non-negative float format
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setLocalValue(val);
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent 'e', 'E', '-', '+' which are allowed in type="number" but not desired here
    // In type="text", handleChange handles most, but this adds extra safety
    if (['e', 'E', '-', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Prevent paste of non-numeric content
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d*\.?\d*$/.test(pasteData)) {
      e.preventDefault();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{t(labelKey)}</label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          inputMode="decimal"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="bg-white text-black focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-3 pr-12 sm:text-sm border-slate-300 rounded-md py-2 border"
          placeholder="0"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-slate-500 sm:text-sm">{t(unitKey)}</span>
        </div>
      </div>
    </div>
  );
};

export const Calculator: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<CalculatorState>(INITIAL_STATE);

  const updateScope1 = (field: keyof CalculatorState['scope1'], value: string) => {
    setData(prev => ({ ...prev, scope1: { ...prev.scope1, [field]: parseFloat(value) || 0 } }));
  };
  
  const updateScope2 = (field: keyof CalculatorState['scope2'], value: string) => {
    setData(prev => ({ ...prev, scope2: { ...prev.scope2, [field]: parseFloat(value) || 0 } }));
  };
  
  const updateScope3 = (field: keyof CalculatorState['scope3'], value: string) => {
    setData(prev => ({ ...prev, scope3: { ...prev.scope3, [field]: parseFloat(value) || 0 } }));
  };

  const handleSubmit = () => {
    navigate('/results', { state: { data } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
          
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${step >= 1 ? 'border-emerald-600' : 'border-slate-300'}`}>
              <Factory className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium mt-2">{t('scope1')}</span>
          </div>

          <div className={`flex flex-col items-center ${step >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${step >= 2 ? 'border-emerald-600' : 'border-slate-300'}`}>
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium mt-2">{t('scope2')}</span>
          </div>

          <div className={`flex flex-col items-center ${step >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 ${step >= 3 ? 'border-emerald-600' : 'border-slate-300'}`}>
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium mt-2">{t('scope3')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-10">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Factory className="mr-3 text-emerald-600" /> {t('scope1')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputRow labelKey="naturalGas" unitKey="unit_m3" value={data.scope1.naturalGas} onChange={(v) => updateScope1('naturalGas', v)} />
                <InputRow labelKey="heatingOil" unitKey="unit_l" value={data.scope1.heatingOil} onChange={(v) => updateScope1('heatingOil', v)} />
                <InputRow labelKey="coal" unitKey="unit_kg" value={data.scope1.coal} onChange={(v) => updateScope1('coal', v)} />
                <InputRow labelKey="diesel" unitKey="unit_l" value={data.scope1.diesel} onChange={(v) => updateScope1('diesel', v)} />
                <InputRow labelKey="petrol" unitKey="unit_l" value={data.scope1.petrol} onChange={(v) => updateScope1('petrol', v)} />
                <InputRow labelKey="refrigerants" unitKey="unit_kg" value={data.scope1.refrigerants} onChange={(v) => updateScope1('refrigerants', v)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Zap className="mr-3 text-sky-600" /> {t('scope2')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputRow labelKey="electricity" unitKey="unit_kwh" value={data.scope2.electricity} onChange={(v) => updateScope2('electricity', v)} />
                <InputRow labelKey="districtHeating" unitKey="unit_gj" value={data.scope2.districtHeating} onChange={(v) => updateScope2('districtHeating', v)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Globe className="mr-3 text-purple-600" /> {t('scope3')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputRow labelKey="water" unitKey="unit_m3" value={data.scope3.water} onChange={(v) => updateScope3('water', v)} />
                <InputRow labelKey="waste" unitKey="unit_kg" value={data.scope3.waste} onChange={(v) => updateScope3('waste', v)} />
                <InputRow labelKey="airTravelShort" unitKey="unit_km" value={data.scope3.airTravelShort} onChange={(v) => updateScope3('airTravelShort', v)} />
                <InputRow labelKey="airTravelLong" unitKey="unit_km" value={data.scope3.airTravelLong} onChange={(v) => updateScope3('airTravelLong', v)} />
                <InputRow labelKey="railTravel" unitKey="unit_km" value={data.scope3.railTravel} onChange={(v) => updateScope3('railTravel', v)} />
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3)}
            disabled={step === 1}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('back')}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(prev => Math.min(3, prev + 1) as 1 | 2 | 3)}
              className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
            >
              {t('next')} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
             <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-lg text-sm font-medium"
            >
              {t('calculate')} <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};