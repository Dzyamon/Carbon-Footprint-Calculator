import { CalculatorState, EmissionResult } from '../types';

// In Docker/Production, this should be configurable. 
// For this MVP docker-compose setup, localhost:8000 is exposed to the browser.
const API_URL = 'http://localhost:8000/api';

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
  }
};