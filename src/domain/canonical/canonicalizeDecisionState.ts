import type { DecisionState } from "../contracts/decisionState";
import { quantize } from "./quantize";

type Venue = "FOREX" | "CRYPTO" | "FUTURES" | "EQUITIES_NEWS";
type Gate = "ENABLED" | "DISABLED";

export type DecisionStateCanonicalV1 = {
  _schema: "DecisionStateCanonical";
  _v: 1;
  timestamp_utc_iso: string;

  constraints: {
    trade_gate: "OPEN" | "RESTRICTED" | "CLOSED";
    hard_limits: {
      max_dd_pct: number;
      daily_loss_pct: number;
      profit_target_pct: number;
      min_days: number;
      max_position_size: number | null;
      max_trades_per_day: number | null;
      max_open_positions: number | null;
      news_trading_allowed: boolean;
      weekend_holding_allowed: boolean;
      ea_allowed: boolean;
    };
    risk_budget: {
      daily_risk_cap_pct: number;
      risk_per_trade_pct: number;
      max_trades: number;
      cooldown_minutes: number;
    };
  };

  data_quality: { freshness: number; integrity: number; coverage: number };
  uncertainty: { data_u: number; regime_u: number; execution_u: number; disagreement_u: number };
  regime: { state: string; confidence: number; transition_risk: number };
  market: { volatility_level: string; liquidity_proxy: number | null; session: string; event_risk: string };
  path_state: { loss_streak: number; recovery_mode: boolean; pacing_status: string };
  cost_distribution: { expected: number; tail_risk: number };

  venue_selection: {
    venue_gate: Record<Venue, Gate>;
    primary_arena_today: Venue | null;
    secondary_arena: Venue | null;
    watchlist_target_sorted: string[] | null;
    fallback_index_sorted: string[] | null;
    catalyst_strength: "LOW" | "MED" | "HIGH" | null;
    universe_today_sorted: Record<Venue, string[]> | null;
  };

  signal_candidates_sorted: { setup_id: string; expected_edge: number | null }[] | null;
};

const sortAsc = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b));

const sortCandidates = (arr: { setup_id: string; expected_edge: number | null }[]) => {
  return [...arr].sort((a, b) => {
    const idCmp = a.setup_id.localeCompare(b.setup_id);
    if (idCmp !== 0) return idCmp;
    const ea = a.expected_edge ?? Number.NEGATIVE_INFINITY;
    const eb = b.expected_edge ?? Number.NEGATIVE_INFINITY;
    return eb - ea;
  });
};

const gateOrDisabled = (value?: Gate) => value ?? "DISABLED";

export function canonicalizeDecisionStateV1(ds: DecisionState): DecisionStateCanonicalV1 {
  const vSel = ds.venue_selection;

  const universeSorted = vSel.universe_today
    ? {
        FOREX: sortAsc(vSel.universe_today.FOREX ?? []),
        CRYPTO: sortAsc(vSel.universe_today.CRYPTO ?? []),
        FUTURES: sortAsc(vSel.universe_today.FUTURES ?? []),
        EQUITIES_NEWS: sortAsc(vSel.universe_today.EQUITIES_NEWS ?? []),
      }
    : null;

  return {
    _schema: "DecisionStateCanonical",
    _v: 1,
    timestamp_utc_iso: ds.timestamp_utc_iso,

    constraints: {
      trade_gate: ds.constraints.trade_gate,
      hard_limits: {
        max_dd_pct: quantize("constraints.hard_limits.max_dd_pct", ds.constraints.hard_limits.max_dd_pct) ?? 0,
        daily_loss_pct: quantize("constraints.hard_limits.daily_loss_pct", ds.constraints.hard_limits.daily_loss_pct) ?? 0,
        profit_target_pct: quantize("constraints.hard_limits.profit_target_pct", ds.constraints.hard_limits.profit_target_pct) ?? 0,
        min_days: ds.constraints.hard_limits.min_days,
        max_position_size: ds.constraints.hard_limits.max_position_size ?? null,
        max_trades_per_day: ds.constraints.hard_limits.max_trades_per_day ?? null,
        max_open_positions: ds.constraints.hard_limits.max_open_positions ?? null,
        news_trading_allowed: ds.constraints.hard_limits.news_trading_allowed,
        weekend_holding_allowed: ds.constraints.hard_limits.weekend_holding_allowed,
        ea_allowed: ds.constraints.hard_limits.ea_allowed,
      },
      risk_budget: {
        daily_risk_cap_pct: quantize("constraints.risk_budget.daily_risk_cap_pct", ds.constraints.risk_budget.daily_risk_cap_pct) ?? 0,
        risk_per_trade_pct: quantize("constraints.risk_budget.risk_per_trade_pct", ds.constraints.risk_budget.risk_per_trade_pct) ?? 0,
        max_trades: ds.constraints.risk_budget.max_trades,
        cooldown_minutes: ds.constraints.risk_budget.cooldown_minutes,
      },
    },

    data_quality: {
      freshness: quantize("data_quality.freshness", ds.data_quality.freshness) ?? 0,
      integrity: quantize("data_quality.integrity", ds.data_quality.integrity) ?? 0,
      coverage: quantize("data_quality.coverage", ds.data_quality.coverage) ?? 0,
    },
    uncertainty: {
      data_u: quantize("uncertainty.data_u", ds.uncertainty.data_u) ?? 0,
      regime_u: quantize("uncertainty.regime_u", ds.uncertainty.regime_u) ?? 0,
      execution_u: quantize("uncertainty.execution_u", ds.uncertainty.execution_u) ?? 0,
      disagreement_u: quantize("uncertainty.disagreement_u", ds.uncertainty.disagreement_u) ?? 0,
    },
    regime: {
      state: ds.regime.state,
      confidence: quantize("regime.confidence", ds.regime.confidence) ?? 0,
      transition_risk: quantize("regime.transition_risk", ds.regime.transition_risk) ?? 0,
    },
    market: {
      volatility_level: ds.market.volatility_level,
      liquidity_proxy: quantize("market.liquidity_proxy", ds.market.liquidity_proxy),
      session: ds.market.session,
      event_risk: ds.market.event_risk,
    },
    path_state: {
      loss_streak: ds.path_state.loss_streak,
      recovery_mode: ds.path_state.recovery_mode,
      pacing_status: ds.path_state.pacing_status,
    },
    cost_distribution: {
      expected: quantize("cost_distribution.expected", ds.cost_distribution.expected) ?? 0,
      tail_risk: quantize("cost_distribution.tail_risk", ds.cost_distribution.tail_risk) ?? 0,
    },

    venue_selection: {
      venue_gate: {
        FOREX: gateOrDisabled(vSel.venue_gate.FOREX),
        CRYPTO: gateOrDisabled(vSel.venue_gate.CRYPTO),
        FUTURES: gateOrDisabled(vSel.venue_gate.FUTURES),
        EQUITIES_NEWS: gateOrDisabled(vSel.venue_gate.EQUITIES_NEWS),
      },
      primary_arena_today: vSel.primary_arena_today ?? null,
      secondary_arena: vSel.secondary_arena ?? null,
      watchlist_target_sorted: vSel.watchlist_target ? sortAsc(vSel.watchlist_target) : null,
      fallback_index_sorted: vSel.fallback_index ? sortAsc(vSel.fallback_index) : null,
      catalyst_strength: vSel.catalyst_strength ?? null,
      universe_today_sorted: universeSorted,
    },

    signal_candidates_sorted: ds.signal_candidates ? sortCandidates(ds.signal_candidates) : null,
  };
}
