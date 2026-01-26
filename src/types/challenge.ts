/**
 * Challenge Types - Shared across Challenge Library components
 * Single source of truth for Challenge data structure
 */

export type Challenge = {
  id: string;
  name: string;
  description: string;
  is_free: boolean;
  entry_fee: number | null;
  currency: string;
  refundable: boolean;
  account_size: number;
  scaling_potential: number | null;
  profit_split: { initial: number; scaled?: number; maximum?: number };
  rules: {
    profitTarget?: number;
    maxDailyLoss?: number;
    maxDrawdown?: number;
    minTradingDays?: number;
    timeLimit?: number;
    consistencyRule?: string;
  };
  payout_speed: string;
  first_payout_delay: number;
  markets: string[];
  platforms: string[];
  pros: string[];
  cons: string[];
  best_for: string;
  official_url: string;
  popularity: number;
  success_rate: number | null;
  prop_firms: {
    name: string;
    logo_url: string;
    reputation: number;
    website_url: string;
  };
};

export type FilterState = {
  cost: string[];
  accountSize: string[];
  profitSplit: string[];
  payoutSpeed: string[];
  type: string[];
  market: string[];
};

export type SortOption =
  | 'recommended'
  | 'lowest_cost'
  | 'highest_split'
  | 'fastest_payout'
  | 'largest_account';
