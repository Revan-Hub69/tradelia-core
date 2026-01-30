import { describe, it, expect } from "vitest";
import { validateActionReasonMatrix } from "../policy/reasonMatrix";
import { ReasonCodes } from "../contracts/reasonCodes";

const baseDecision = () => ({
  timestamp_utc_iso: "2026-01-29T19:00:00Z",
  action: "TRADE",
  trade_gate: "OPEN",
  primary_arena_today: "FOREX",
  selected_setup_id: "X",
  instruments: ["EURUSD"],
  risk_budget_applied: { daily_risk_cap_pct: 1, risk_per_trade_pct: 0.25, max_trades: 3, cooldown_minutes: 10 },
  dominant_constraint: ReasonCodes.TRADE_OK_ALL_GATES,
  reason_codes: [ReasonCodes.TRADE_OK_ALL_GATES],
  uncertainty_summary: { U: 0.2, data_u: 0.1, regime_u: 0.2, execution_u: 0.1, disagreement_u: 0.1 },
  cost_check: { expected: 0.0002, tail_risk: 0.0008, verdict: "PASS" },
  version: { policy: "v0.1", model: "none", spec: "v1.1" },
  state_hash: "abc",
  audit_path_id: null,
});

describe("action/reason matrix", () => {
  it("TRADE must have TRADE.OK.* and no FAIL/HALT", () => {
    const d = baseDecision();
    const res = validateActionReasonMatrix(d as any);
    expect(res.ok).toBe(true);

    const bad = { ...d, reason_codes: [ReasonCodes.DATA_FAIL_INTEGRITY, ReasonCodes.TRADE_OK_ALL_GATES] };
    expect(validateActionReasonMatrix(bad as any).ok).toBe(false);
  });

  it("HALT requires EXEC.HALT.* and trade_gate CLOSED", () => {
    const d = { ...baseDecision(), action: "HALT", trade_gate: "CLOSED", selected_setup_id: null, reason_codes: [ReasonCodes.EXEC_HALT_SPREAD_P99], dominant_constraint: ReasonCodes.EXEC_HALT_SPREAD_P99 };
    expect(validateActionReasonMatrix(d as any).ok).toBe(true);
  });
});
