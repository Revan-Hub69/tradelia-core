import { z } from "zod";

export const ExecutionLogSchema = z.object({
  timestamp_utc_iso: z.string(),
  venue: z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]),
  symbol: z.string(),
  order_intent: z
    .object({
      side: z.enum(["BUY", "SELL"]),
      qty: z.number(),
      type: z.enum(["MARKET", "LIMIT", "STOP"]),
      limit_price: z.number().nullable(),
      stop_price: z.number().nullable(),
    })
    .nullable(),
  fill_time_ms: z.number().int().min(0).nullable(),
  spread_ticks: z.number().nullable(),
  slippage_ticks: z.number().nullable(),
  violations: z.array(z.string()).nullable(),
  realized_cost: z
    .object({
      commission: z.number().nullable(),
      fees: z.number().nullable(),
      est_impact: z.number().nullable(),
    })
    .nullable(),
  ref: z
    .object({
      state_hash: z.string(),
      policy_decision_id: z.string().nullable(),
    })
    .nullable(),
});

export type ExecutionLog = z.infer<typeof ExecutionLogSchema>;
