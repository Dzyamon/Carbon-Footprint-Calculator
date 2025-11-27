import { CalculatorState, EmissionResult, UsageStats } from '../types';

const API_ROOT = (import.meta.env?.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const API_URL = `${API_ROOT}/api`;

export const api = {
  calculate: async (data: CalculatorState): Promise<EmissionResult> => {
    try {
      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  getHistory: async (): Promise<EmissionResult[]> => {
    try {
      const response = await fetch(`${API_URL}/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  getStats: async (): Promise<UsageStats> => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to load stats');
    }
    return response.json();
  }
};