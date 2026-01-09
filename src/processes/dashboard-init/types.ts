/**
 * Dashboard Initialization Process Types - Tradelia 2026
 */

import type { CardData } from '../../entities/card/types';
import type { User } from '../../entities/user/types';

export interface DashboardInitFlow {
  currentStep: InitStep;
  user?: User;
  cards: CardData[];
  isLoading: boolean;
  error?: string;
}

export type InitStep = 
  | 'loading'
  | 'user-loaded'
  | 'cards-loaded'
  | 'preferences-loaded'
  | 'ready'
  | 'error';

export interface DashboardInitConfig {
  loadUserPreferences: boolean;
  loadDefaultCards: boolean;
  enableOfflineMode: boolean;
  cacheTimeout: number;
}