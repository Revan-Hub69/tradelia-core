import { z } from "zod";

export type VolatilityLevel = "LOW" | "NORMAL" | "HIGH";
export type RegimeState = "TREND" | "RANGE" | "BREAKOUT" | "EXPANSION" | "EVENT";

export const RiskBudgetSchema = z.object({
  daily_risk_cap_pct: z.number().min(0).max(100),
  risk_per_trade_pct: z.number().min(0).max(100),
  max_trades: z.number().int().min(0).max(100),
  cooldown_minutes: z.number().int().min(0).max(240),
});

export const HardLimitsSchema = z.object({
  max_dd_pct: z.number().min(0).max(100),
  daily_loss_pct: z.number().min(0).max(100),
  profit_target_pct: z.number().min(0).max(100),
  min_days: z.number().int().min(0).max(3650),
  max_position_size: z.number().int().min(0).max(1000).nullable(),
  max_trades_per_day: z.number().int().min(0).max(1000).nullable(),
  max_open_positions: z.number().int().min(0).max(1000).nullable(),
  news_trading_allowed: z.boolean(),
  weekend_holding_allowed: z.boolean(),
  ea_allowed: z.boolean(),
});

export const DataQualitySchema = z.object({
  freshness: z.number().min(0).max(1),
  integrity: z.number().min(0).max(1),
  coverage: z.number().min(0).max(1),
});

export const UncertaintySchema = z.object({
  data_u: z.number().min(0).max(1),
  regime_u: z.number().min(0).max(1),
  execution_u: z.number().min(0).max(1),
  disagreement_u: z.number().min(0).max(1),
});

export const RegimeSchema = z.object({
  state: z.enum(["TREND", "RANGE", "BREAKOUT", "EXPANSION", "EVENT"]),
  confidence: z.number().min(0).max(1),
  transition_risk: z.number().min(0).max(1),
});

export const MarketSchema = z.object({
  volatility_level: z.enum(["LOW", "NORMAL", "HIGH"]),
  liquidity_proxy: z.number().min(0).max(1).nullable(),
  session: z.enum(["EU", "US", "ASIA", "OFF"]),
  event_risk: z.enum(["NONE", "SCHEDULED", "LIVE"]),
});

export const PathStateSchema = z.object({
  loss_streak: z.number().int().min(0).max(50),
  recovery_mode: z.boolean(),
  pacing_status: z.enum(["NORMAL", "SLOW", "STOP"]),
});

export const CostDistributionSchema = z.object({
  expected: z.number().min(0),
  tail_risk: z.number().min(0),
});

export const VenueSelectionSchema = z.object({
  venue_gate: z.record(z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]), z.enum(["ENABLED", "DISABLED"])),
  primary_arena_today: z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]).nullable(),
  secondary_arena: z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]).nullable(),
  watchlist_target: z.array(z.string()).nullable(),
  fallback_index: z.array(z.string()).nullable(),
  catalyst_strength: z.enum(["LOW", "MED", "HIGH"]).nullable(),
  universe_today: z.record(z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]), z.array(z.string())).nullable(),
});

export const SignalCandidateSchema = z.object({
  setup_id: z.string(),
  expected_edge: z.number().nullable(),
});

export const DecisionStateSchema = z.object({
  timestamp_utc_iso: z.string(),
  constraints: z.object({
    trade_gate: z.enum(["OPEN", "RESTRICTED", "CLOSED"]),
    risk_budget: RiskBudgetSchema,
    hard_limits: HardLimitsSchema,
  }),
  data_quality: DataQualitySchema,
  uncertainty: UncertaintySchema,
  regime: RegimeSchema,
  market: MarketSchema,
  path_state: PathStateSchema,
  cost_distribution: CostDistributionSchema,
  venue_selection: VenueSelectionSchema,
  signal_candidates: z.array(SignalCandidateSchema).nullable(),
});

export type DecisionState = z.infer<typeof DecisionStateSchema>;
export type RiskBudget = z.infer<typeof RiskBudgetSchema>;
export type HardLimits = z.infer<typeof HardLimitsSchema>;
export type DataQuality = z.infer<typeof DataQualitySchema>;
export type Uncertainty = z.infer<typeof UncertaintySchema>;
export type Regime = z.infer<typeof RegimeSchema>;
export type Market = z.infer<typeof MarketSchema>;
export type PathState = z.infer<typeof PathStateSchema>;
export type CostDistribution = z.infer<typeof CostDistributionSchema>;
export type VenueSelection = z.infer<typeof VenueSelectionSchema>;
export type SignalCandidate = z.infer<typeof SignalCandidateSchema>;
