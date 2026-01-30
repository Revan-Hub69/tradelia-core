import { describe, it, expect } from "vitest";
import { decide } from "../policy/decide";
import type { DecisionStateCanonicalV1 } from "../canonical/canonicalizeDecisionState";

const cfg = {
  versions: { policy: "v0.1", model: "none", spec: "v1.1" },
  min_quality: { freshness: 0.6, integrity: 0.7, coverage: 0.7 },
  uncertainty: { skip_at_u: 0.8, delay_at_u: 0.5 },
  cost: { fail_if_tail_gt_edge: true, restrict_if_tail_near_edge: true, near_edge_ratio: 0.8 },
};

const ds: DecisionStateCanonicalV1 = {
  _schema: "DecisionStateCanonical",
  _v: 1,
  timestamp_utc_iso: "2026-01-29T19:00:00Z",
  constraints: {
    trade_gate: "OPEN",
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
    risk_budget: { daily_risk_cap_pct: 1, risk_per_trade_pct: 0.25, max_trades: 3, cooldown_minutes: 10 },
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
    watchlist_target_sorted: ["EURUSD"],
    fallback_index_sorted: null,
    catalyst_strength: null,
    universe_today_sorted: { FOREX: ["EURUSD"], CRYPTO: [], FUTURES: [], EQUITIES_NEWS: [] },
  },
  signal_candidates_sorted: [{ setup_id: "FX_LONDON_BREAKOUT", expected_edge: 0.0012 }],
};

describe("policy invariants", () => {
  it("idempotence: same state => same decision", () => {
    const d1 = decide(ds, cfg);
    const d2 = decide(ds, cfg);
    expect(JSON.stringify(d1)).toBe(JSON.stringify(d2));
  });

  it("fail-safe: low data quality => SKIP", () => {
    const bad = { ...ds, data_quality: { freshness: 0.1, integrity: 0.1, coverage: 0.1 } };
    const d = decide(bad as any, cfg);
    expect(d.action).toBe("SKIP");
  });

  it("monotonicity: higher uncertainty should not become more permissive", () => {
    const low = decide({ ...ds, uncertainty: { data_u: 0.1, regime_u: 0.1, execution_u: 0.1, disagreement_u: 0.1 } }, cfg);
    const high = decide({ ...ds, uncertainty: { data_u: 0.9, regime_u: 0.9, execution_u: 0.9, disagreement_u: 0.9 } }, cfg);
    expect(!(high.action === "TRADE" && low.action !== "TRADE")).toBe(true);
  });
});
