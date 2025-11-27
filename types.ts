
export enum Language {
  EN = 'en',
  PL = 'pl',
  SK = 'sk',
  DE = 'de',
  IT = 'it',
  HR = 'hr',
}

export interface Scope1Inputs {
  naturalGas: number; // m3
  heatingOil: number; // liters
  coal: number; // kg
  diesel: number; // liters
  petrol: number; // liters
  refrigerants: number; // kg
}

export interface Scope2Inputs {
  electricity: number; // kWh
  districtHeating: number; // GJ
}

export interface Scope3Inputs {
  water: number; // m3
  waste: number; // kg
  airTravelShort: number; // km (< 500km)
  airTravelLong: number; // km (> 500km)
  railTravel: number; // km
}

export interface CalculatorState {
  scope1: Scope1Inputs;
  scope2: Scope2Inputs;
  scope3: Scope3Inputs;
}

export interface EmissionResult {
  id?: string;
  date?: string;
  scope1: number; // kg CO2e
  scope2: number; // kg CO2e
  scope3: number; // kg CO2e
  total: number; // kg CO2e
  breakdown: {
    [key: string]: number;
  };
}

export interface HistoryItem {
  id: string;
  date: string;
  result: EmissionResult;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ManualStep {
  title: string;
  description: string;
}

export interface UsageStats {
  totalCalculations: number;
  totalEmissions: number;
  averageEmission: number;
  lastCalculationAt?: string;
  lastTotal?: number;
  scopeAverages: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
}

export type TranslationKey = 
  | 'title'
  | 'subtitle'
  | 'startCalc'
  | 'scope1'
  | 'scope2'
  | 'scope3'
  | 'results'
  | 'calculate'
  | 'next'
  | 'back'
  | 'naturalGas'
  | 'heatingOil'
  | 'coal'
  | 'diesel'
  | 'petrol'
  | 'refrigerants'
  | 'electricity'
  | 'districtHeating'
  | 'water'
  | 'waste'
  | 'airTravelShort'
  | 'airTravelLong'
  | 'railTravel'
  | 'scope1Desc'
  | 'scope2Desc'
  | 'scope3Desc'
  | 'totalEmissions'
  | 'downloadReport'
  | 'unit_m3'
  | 'unit_l'
  | 'unit_kg'
  | 'unit_kwh'
  | 'unit_gj'
  | 'unit_km'
  | 'menu_home'
  | 'menu_calc'
  | 'menu_history'
  | 'menu_faq'
  | 'history_title'
  | 'history_empty'
  | 'faq_title'
  | 'a11y_contrast'
  | 'a11y_font'
  | 'project_info_title'
  | 'project_info_body'
  | 'hosting_title'
  | 'hosting_body'
  | 'support_title'
  | 'support_body'
  | 'design_title'
  | 'design_body'
  | 'stats_heading'
  | 'stats_total_calcs'
  | 'stats_total_emissions'
  | 'stats_avg_emission'
  | 'stats_last_calc'
  | 'manual_heading'
  | 'manual_intro';

export interface NavItem {
  label: string;
  path: string;
}
