/**
 * CHALLENGE SCHEMAS - Runtime Validation
 * Best Practice 2026: Zod for type-safe validation
 */

import { z } from 'zod';

/**
 * Offer Schema - Account size options
 */
export const OfferSchema = z.object({
  id: z.string(),
  offer_name: z.string(),
  account_size: z.number().positive(),
  account_currency: z.string(),
  entry_fee: z.number().nullable(),
  fee_currency: z.string().nullable(),
  refundable: z.boolean(),
  is_featured: z.boolean().optional(),
  display_order: z.number(),
  // New fields for adaptive KPIs
  prize_pool: z.number().nullable().optional(),
  first_prize: z.number().nullable().optional(),
  max_participants: z.number().nullable().optional(),
  current_participants: z.number().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  registration_deadline: z.string().nullable().optional(),
  frequency: z.string().optional(),
  scaling_max: z.number().nullable().optional(),
  time_limit_days: z.number().nullable().optional(),
});

export type Offer = z.infer<typeof OfferSchema>;

/**
 * Program Schema - Challenge/Competition
 */
export const ProgramSchema = z.object({
  id: z.string(),
  name: z.string(),
  organizer_name: z.string(),
  category: z.enum(['free_competition', 'paid_evaluation']),
  subtype: z.string(),
  has_free_trial: z.boolean(),
  ruleset_mode: z.enum(['target_based', 'ranking_based']).optional(),
  description: z.string().nullable().optional(),
  best_for: z.string().nullable().optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

export type Program = z.infer<typeof ProgramSchema>;

/**
 * KPIs Schema - Key Performance Indicators
 */
export const KPIsSchema = z.object({
  profit_split_max: z.number().nullable(),
  max_drawdown_pct: z.number().nullable(),
  max_daily_loss_pct: z.number().nullable(),
  time_limit_common: z.number().nullable(),
  freshness_days: z.number(),
  sources_count: z.number(),
});

export type KPIs = z.infer<typeof KPIsSchema>;

/**
 * Ruleset Schema - Trading rules per phase
 */
export const RulesetSchema = z.object({
  phase_number: z.number(),
  profit_target_pct: z.number().nullable(),
  max_drawdown_pct: z.number().nullable(),
  max_drawdown_type: z.enum(['balance_based', 'equity_based', 'trailing']).optional(),
  max_daily_loss_pct: z.number().nullable(),
  max_daily_loss_type: z.enum(['balance_based', 'equity_based']).optional(),
  daily_loss_reset_time: z.string().nullable().optional(),
  min_trading_days: z.number().nullable(),
  consistency_required: z.boolean().optional(),
  best_day_max_pct: z.number().nullable().optional(),
  ea_allowed: z.boolean().optional(),
  news_trading: z.boolean().optional(),
  weekend_holding: z.boolean().optional(),
  max_position_size: z.number().nullable().optional(),
  max_open_positions: z.number().nullable().optional(),
});

export type Ruleset = z.infer<typeof RulesetSchema>;

/**
 * Payout Terms Schema
 */
export const PayoutTermsSchema = z.object({
  profit_split_initial: z.number(),
  profit_split_scaled: z.number().nullable().optional(),
  profit_split_max: z.number(),
  payout_frequency: z.string(),
  first_payout_delay_days: z.number(),
  eligible_after_phase: z.number(),
  withdrawal_methods: z.array(z.string()).optional(),
  min_withdrawal: z.number().nullable().optional(),
  payout_processing_time_hours: z.number().nullable().optional(),
});

export type PayoutTerms = z.infer<typeof PayoutTermsSchema>;

/**
 * Market Access Schema
 */
export const MarketAccessSchema = z.object({
  markets_available: z.array(z.string()),
  platforms: z.array(z.string()),
  instruments_count: z.number().nullable().optional(),
  leverage_max: z.number().nullable().optional(),
  commission_structure: z.string().nullable().optional(),
  trading_hours: z.string().nullable().optional(),
});

export type MarketAccess = z.infer<typeof MarketAccessSchema>;

/**
 * Validate data with Zod schema
 * Returns validated data or throws error
 */
export function validateOffer(data: unknown): Offer {
  return OfferSchema.parse(data);
}

export function validateProgram(data: unknown): Program {
  return ProgramSchema.parse(data);
}

export function validateKPIs(data: unknown): KPIs {
  return KPIsSchema.parse(data);
}

/**
 * Safe validation - returns null on error
 */
export function safeValidateOffer(data: unknown): Offer | null {
  const result = OfferSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function safeValidateProgram(data: unknown): Program | null {
  const result = ProgramSchema.safeParse(data);
  return result.success ? result.data : null;
}
