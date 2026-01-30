import type { DecisionStateCanonicalV1 } from "../canonical/canonicalizeDecisionState";
import type { PolicyDecision } from "../contracts/policyDecision";
import { ReasonCodes } from "../contracts/reasonCodes";

const maxU = (u: DecisionStateCanonicalV1["uncertainty"]) => {
  return Math.max(u.data_u, u.regime_u, u.execution_u, u.disagreement_u);
};

type Versions = { policy: string; model: string; spec: string };

export type DecideConfig = {
  versions: Versions;
  min_quality: { freshness: number; integrity: number; coverage: number };
  uncertainty: { skip_at_u: number; delay_at_u: number };
  cost: { fail_if_tail_gt_edge: boolean; restrict_if_tail_near_edge: boolean; near_edge_ratio: number };
};

const uniq = (arr: string[]) => Array.from(new Set(arr));

export function decide(ds: DecisionStateCanonicalV1, cfg: DecideConfig): PolicyDecision {
  const now = ds.timestamp_utc_iso;
  const reason_codes: string[] = [];

  // 1) DATA QUALITY (fail-safe)
  if (ds.data_quality.freshness < cfg.min_quality.freshness) reason_codes.push(ReasonCodes.DATA_FAIL_STALE_FRESHNESS);
  if (ds.data_quality.integrity < cfg.min_quality.integrity) reason_codes.push(ReasonCodes.DATA_FAIL_INTEGRITY);
  if (ds.data_quality.coverage < cfg.min_quality.coverage) reason_codes.push(ReasonCodes.DATA_FAIL_LOW_COVERAGE);

  // 2) HARD CONSTRAINTS
  if (ds.constraints.trade_gate === "CLOSED") reason_codes.push(ReasonCodes.RISK_FAIL_TRADE_GATE_CLOSED);

  // 3) NEWS / EVENT POLICY
  if (!ds.constraints.hard_limits.news_trading_allowed && (ds.market.event_risk === "SCHEDULED" || ds.market.event_risk === "LIVE")) {
    reason_codes.push(ReasonCodes.CONSTRAINT_RULES_NEWS_NOT_ALLOWED);
  }
  if (ds.market.event_risk === "LIVE") {
    reason_codes.push(ReasonCodes.SESSION_FAIL_EVENT_BUFFER_ACTIVE);
  }

  // 4) UNCERTAINTY GATE
  const U = maxU(ds.uncertainty);
  let shouldDelay = false;
  if (U >= cfg.uncertainty.skip_at_u) {
    if (!reason_codes.some((x) => x.includes(".FAIL.")) && !reason_codes.some((x) => x.startsWith("CONSTRAINT."))) {
      reason_codes.push(ReasonCodes.REGIME_REVIEW_LOW_CONFIDENCE);
      shouldDelay = true;
    }
  } else if (U >= cfg.uncertainty.delay_at_u) {
    reason_codes.push(ReasonCodes.REGIME_REVIEW_LOW_CONFIDENCE);
    shouldDelay = true;
  }

  // 5) VENUE COMPLIANCE
  const primary = ds.venue_selection.primary_arena_today;
  if (primary) {
    const enabled = ds.venue_selection.venue_gate[primary] === "ENABLED";
    if (!enabled) reason_codes.push(ReasonCodes.VENUE_FAIL_DISABLED_BY_RULES);

    const uni = ds.venue_selection.universe_today_sorted;
    if (!uni || (uni[primary]?.length ?? 0) < 1) reason_codes.push(ReasonCodes.VENUE_FAIL_NO_PRIMARY_UNIVERSE);
  }

  // 6) BASIC COST VERDICT
  const candidates = ds.signal_candidates_sorted ?? [];
  const bestEdge = candidates
    .map((c) => c.expected_edge)
    .filter((x): x is number => typeof x === "number")
    .sort((a, b) => b - a)[0];

  let cost_verdict: "PASS" | "RESTRICT" | "FAIL" = "PASS";
  if (typeof bestEdge === "number" && bestEdge > 0) {
    if (cfg.cost.fail_if_tail_gt_edge && ds.cost_distribution.tail_risk > bestEdge) {
      cost_verdict = "FAIL";
      reason_codes.push(ReasonCodes.COST_FAIL_TAIL_GT_EDGE);
    } else if (cfg.cost.restrict_if_tail_near_edge && ds.cost_distribution.tail_risk > bestEdge * cfg.cost.near_edge_ratio) {
      cost_verdict = "RESTRICT";
      reason_codes.push(ReasonCodes.COST_RESTRICT_TAIL_NEAR_EDGE);
    }
  }

  // 7) ACTION SELECTION
  const hasExecHalt = reason_codes.some((x) => x.startsWith("EXEC.HALT."));
  const hasHardFail =
    reason_codes.some((x) => x.startsWith("DATA.FAIL.")) ||
    reason_codes.some((x) => x.startsWith("CONSTRAINT.")) ||
    reason_codes.some((x) => x.startsWith("RISK.FAIL.")) ||
    reason_codes.some((x) => x.startsWith("VENUE.FAIL.")) ||
    reason_codes.some((x) => x.startsWith("COST.FAIL."));

  let action: PolicyDecision["action"] = "SKIP";
  let trade_gate: PolicyDecision["trade_gate"] = ds.constraints.trade_gate;

  if (hasExecHalt) {
    action = "HALT";
    trade_gate = "CLOSED";
  } else if (hasHardFail) {
    action = "SKIP";
  } else if (shouldDelay) {
    action = "DELAY";
  } else {
    if (ds.constraints.trade_gate === "OPEN" && primary && candidates.length > 0) {
      action = "TRADE";
      reason_codes.push(ReasonCodes.TRADE_OK_ALL_GATES);
    } else {
      action = "SKIP";
      reason_codes.push(ReasonCodes.SETUP_FAIL_NO_MATCH);
    }
  }

  const selected = action === "TRADE" ? candidates[0] : null;

  return {
    timestamp_utc_iso: now,
    action,
    trade_gate,
    primary_arena_today: primary ?? null,
    selected_setup_id: action === "TRADE" ? (selected?.setup_id ?? null) : null,
    instruments: action === "TRADE" ? (ds.venue_selection.universe_today_sorted?.[primary ?? "FOREX"]?.slice(0, 1) ?? null) : null,
    risk_budget_applied: {
      daily_risk_cap_pct: ds.constraints.risk_budget.daily_risk_cap_pct,
      risk_per_trade_pct: ds.constraints.risk_budget.risk_per_trade_pct,
      max_trades: ds.constraints.risk_budget.max_trades,
      cooldown_minutes: ds.constraints.risk_budget.cooldown_minutes,
    },
    dominant_constraint: (reason_codes[0] ?? "UNKNOWN") as PolicyDecision["dominant_constraint"],
    reason_codes: uniq(reason_codes).slice(0, 8),
    uncertainty_summary: { U, ...ds.uncertainty },
    cost_check: { expected: ds.cost_distribution.expected, tail_risk: ds.cost_distribution.tail_risk, verdict: cost_verdict },
    version: cfg.versions,
    state_hash: "MUST_BE_SET_BY_ORCHESTRATOR",
    audit_path_id: null,
  };
}
