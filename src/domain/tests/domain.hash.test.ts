import { describe, it, expect } from "vitest";
import { DecisionStateSchema } from "../contracts/decisionState";
import { canonicalizeDecisionStateV1 } from "../canonical/canonicalizeDecisionState";
import { computeStateHash } from "../canonical/stateHash";

const sampleDecisionState = () => {
  return DecisionStateSchema.parse({
    timestamp_utc_iso: "2026-01-29T19:00:00Z",
    constraints: {
      trade_gate: "OPEN",
      risk_budget: { daily_risk_cap_pct: 1, risk_per_trade_pct: 0.25, max_trades: 3, cooldown_minutes: 15 },
      hard_limits: {
        max_dd_pct: 10,
        daily_loss_pct: 5,
        profit_target_pct: 10,
        min_days: 5,
        max_position_size: null,
        max_trades_per_day: null,
        max_open_positions: null,
        news_trading_allowed: false,
        weekend_holding_allowed: false,
        ea_allowed: false,
      },
    },
    data_quality: { freshness: 1, integrity: 1, coverage: 1 },
    uncertainty: { data_u: 0.1, regime_u: 0.2, execution_u: 0.1, disagreement_u: 0.1 },
    regime: { state: "BREAKOUT", confidence: 0.7, transition_risk: 0.2 },
    market: { volatility_level: "NORMAL", liquidity_proxy: 0.7, session: "EU", event_risk: "NONE" },
    path_state: { loss_streak: 0, recovery_mode: false, pacing_status: "NORMAL" },
    cost_distribution: { expected: 0.0002, tail_risk: 0.0008 },
    venue_selection: {
      venue_gate: { FOREX: "ENABLED", CRYPTO: "DISABLED", FUTURES: "DISABLED", EQUITIES_NEWS: "DISABLED" },
      primary_arena_today: "FOREX",
      secondary_arena: null,
      watchlist_target: ["EURUSD", "GBPUSD"],
      fallback_index: null,
      catalyst_strength: null,
      universe_today: { FOREX: ["EURUSD", "GBPUSD"], CRYPTO: [], FUTURES: [], EQUITIES_NEWS: [] },
    },
    signal_candidates: [{ setup_id: "FX_LONDON_BREAKOUT", expected_edge: 0.0012 }],
  });
};

describe("state hash", () => {
  it("same canonical JSON => same hash", () => {
    const ds1 = sampleDecisionState();
    const ds2 = sampleDecisionState();
    const c1 = canonicalizeDecisionStateV1(ds1);
    const c2 = canonicalizeDecisionStateV1(ds2);
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
    expect(computeStateHash(c1)).toBe(computeStateHash(c2));
  });

  it("canonicalization sorts arrays deterministically", () => {
    const ds = sampleDecisionState();
    ds.venue_selection.watchlist_target = ["GBPUSD", "EURUSD"];
    const c = canonicalizeDecisionStateV1(ds);
    expect(c.venue_selection.watchlist_target_sorted).toEqual(["EURUSD", "GBPUSD"]);
  });
});
