/**
 * Program Types - Challenge Library 2026
 *
 * Shared types for trading programs, offers, rulesets, etc.
 */

export type Program = {
  id: string;
  name: string;
  organizer_name: string;
  category: 'free_competition' | 'paid_evaluation';
  subtype: string;
  has_free_trial: boolean;
  ruleset_mode?: 'target_based' | 'ranking_based';
  description?: string | null;
  best_for?: string | null;
  pros?: string[];
  cons?: string[];
  official_url?: string | null;
};

export type Offer = {
  id: string;
  offer_name: string;
  account_size: number;
  account_currency: string;
  entry_fee: number | null;
  fee_currency: string | null;
  refundable: boolean;
  is_featured?: boolean;
  display_order: number;
  recurring?: boolean;
  next_edition_date?: string | null;
  max_participants?: number | null;
  scaling_max?: number | null;
  time_limit_days?: number | null;
};

export type Ruleset = {
  phase_number: number;
  profit_target_pct: number | null;
  max_drawdown_pct: number | null;
  max_drawdown_type?: 'balance_based' | 'equity_based' | 'trailing';
  max_daily_loss_pct: number | null;
  max_daily_loss_type?: 'balance_based' | 'equity_based';
  daily_loss_reset_time?: string | null;
  min_trading_days: number | null;
  consistency_required?: boolean;
  best_day_max_pct?: number | null;
  ea_allowed?: boolean;
  news_trading?: boolean;
  weekend_holding?: boolean;
  max_position_size?: number | null;
  max_open_positions?: number | null;
};

export type PayoutTerms = {
  profit_split_initial: number;
  profit_split_scaled?: number | null;
  profit_split_max: number;
  payout_frequency: string;
  first_payout_delay_days: number;
  eligible_after_phase: number;
  withdrawal_methods?: string[];
  min_withdrawal?: number | null;
  payout_processing_time_hours?: number | null;
};

export type MarketAccess = {
  markets_available: string[];
  platforms: string[];
  instruments_count?: number | null;
  leverage_forex?: string | null;
  leverage_indices?: string | null;
  leverage_commodities?: string | null;
  leverage_crypto?: string | null;
  commission_forex?: number | null;
  commission_indices?: number | null;
  trading_hours?: string | null;
};

export type KPIs = {
  profit_target_phase1: number | null;
  profit_target_phase2: number | null;
  max_drawdown_pct: number | null;
  max_daily_loss_pct: number | null;
  profit_split_max: number | null;
  min_trading_days: number | null;
  phase_count: number;
  first_payout_delay_days: number | null;
  time_limit_common: number | null;
  freshness_days: number;
  sources_count: number;
};

export type Permissions = {
  ea_allowed?: boolean;
  news_trading?: boolean;
  weekend_holding?: boolean;
};

export type ProgramData = {
  program: Program;
  offers: Offer[];
  rulesets: Ruleset[];
  payoutTerms: PayoutTerms | null;
  marketAccess: MarketAccess | null;
  kpis: KPIs;
  permissions: Permissions;
  platforms: string[];
};
