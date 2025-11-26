// This service is being replaced by the backend API.
// Keeping it for fallback or types if necessary, but the App now uses services/api.ts
// for persistence.

import { EmissionResult, HistoryItem } from '../types';

export const saveResult = (result: EmissionResult): void => {
  // No-op: Data is saved by the backend in api.calculate
  console.log("Saving is handled by the backend API.");
};

export const getHistory = (): HistoryItem[] => {
  // No-op: Data is fetched via API
  return [];
};