import { z } from "zod";
import { ReasonCodes } from "./reasonCodes";
import { RiskBudgetSchema } from "./decisionState";

const reasonCodeValues = Object.values(ReasonCodes) as [string, ...string[]];

export type PolicyAction = "TRADE" | "DELAY" | "SKIP" | "HALT";

export const CostCheckSchema = z.object({
  expected: z.number().min(0),
  tail_risk: z.number().min(0),
  verdict: z.enum(["PASS", "RESTRICT", "FAIL"]),
});

export const PolicyDecisionSchema = z.object({
  timestamp_utc_iso: z.string(),
  action: z.enum(["TRADE", "DELAY", "SKIP", "HALT"]),
  trade_gate: z.enum(["OPEN", "RESTRICTED", "CLOSED"]),
  primary_arena_today: z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]).nullable(),
  selected_setup_id: z.string().nullable(),
  instruments: z.array(z.string()).nullable(),
  risk_budget_applied: RiskBudgetSchema,
  dominant_constraint: z.union([z.enum(reasonCodeValues), z.literal("UNKNOWN")]),
  reason_codes: z.array(z.enum(reasonCodeValues)).min(1),
  uncertainty_summary: z.object({
    U: z.number().min(0).max(1),
    data_u: z.number().min(0).max(1),
    regime_u: z.number().min(0).max(1),
    execution_u: z.number().min(0).max(1),
    disagreement_u: z.number().min(0).max(1),
  }),
  cost_check: CostCheckSchema,
  version: z.object({
    policy: z.string(),
    model: z.string(),
    spec: z.string(),
  }),
  state_hash: z.string(),
  audit_path_id: z.string().nullable(),
});

export type CostCheck = z.infer<typeof CostCheckSchema>;
export type PolicyDecision = z.infer<typeof PolicyDecisionSchema>;
