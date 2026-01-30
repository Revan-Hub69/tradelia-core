import { z } from "zod";

export type Venue = "FOREX" | "CRYPTO" | "FUTURES" | "EQUITIES_NEWS";
export type TradeGate = "OPEN" | "RESTRICTED" | "CLOSED";
export type EventRisk = "NONE" | "SCHEDULED" | "LIVE";
export type Session = "EU" | "US" | "ASIA" | "OFF";

export const SessionBlockSchema = z.object({
  // minutes since midnight [0..1439]
  start_minute: z.number().int().min(0).max(1439),
  end_minute: z.number().int().min(0).max(1440),
});

export const SessionWindowSchema = z.object({
  timezone: z.string(),
  allowed_blocks: z.array(SessionBlockSchema).min(1),
  no_trade_buffer_minutes: z.number().int().min(0).max(240),
  hard_cutoff_minute: z.number().int().min(0).max(1440),
});

export const ChallengeSpecSchema = z.object({
  id: z.string(),
  version: z.string(),
  venue_gate: z.record(z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]), z.enum(["ENABLED", "DISABLED"])),
  target_pct: z.number().min(0),
  max_dd_pct: z.number().min(0),
  daily_loss_pct: z.number().min(0),
  min_days: z.number().int().min(0),
  ea_allowed: z.boolean(),
  news_trading_allowed: z.boolean(),
  weekend_holding_allowed: z.boolean(),
  session_window: SessionWindowSchema,
});

export type ChallengeSpec = z.infer<typeof ChallengeSpecSchema>;
export type SessionWindow = z.infer<typeof SessionWindowSchema>;
export type SessionBlock = z.infer<typeof SessionBlockSchema>;
