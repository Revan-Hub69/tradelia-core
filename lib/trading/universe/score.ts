import type { MarketBias } from "./bias";

export type WsHealth = "OK" | "DEGRADED" | "STALE";
export type MarketSide = "LONG" | "SHORT";
export type Regime4h = "TREND" | "RANGE" | "TRANSITION";

export function wsHealthFromAge(ageSec: number): WsHealth {
  if (!Number.isFinite(ageSec)) return "STALE";
  if (ageSec <= 2) return "OK";
  if (ageSec <= 10) return "DEGRADED";
  return "STALE";
}

export function healthMultiplier(health: WsHealth) {
  if (health === "OK") return 1.0;
  if (health === "DEGRADED") return 0.7;
  return 0.4;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function linScoreUpper(value: number, idealMax: number, hardMax: number) {
  if (!Number.isFinite(value)) return 0;
  if (value <= idealMax) return 1;
  if (value >= hardMax) return 0;
  return 1 - (value - idealMax) / (hardMax - idealMax);
}

function linScoreLower(value: number, hardMin: number, idealMin: number) {
  if (!Number.isFinite(value)) return 0;
  if (value <= hardMin) return 0;
  if (value >= idealMin) return 1;
  return (value - hardMin) / (idealMin - hardMin);
}

export function tradeabilityScore(input: {
  spreadBpsNow: number;
  spreadMeanBps60s: number;
  spreadStdBps60s: number;
  msgRate60s: number;
  atrPct4h: number;
  wsHealth: WsHealth;
}) {
  const eps = 1e-6;

  const spreadEff = Math.max(input.spreadBpsNow, input.spreadMeanBps60s);
  const spread01 = linScoreUpper(spreadEff, 8, 25);
  const spreadScore = 40 * spread01;

  const cv = input.spreadStdBps60s / Math.max(input.spreadMeanBps60s, eps);
  const jitter01 = linScoreUpper(cv, 0.35, 1.2);
  const stabilityScore = 20 * jitter01;

  const act01 = linScoreLower(input.msgRate60s, 3, 25);
  const activityScore = 20 * act01;

  const atrPct = input.atrPct4h;
  let vol01 = 0;
  if (Number.isFinite(atrPct)) {
    if (atrPct >= 0.6 && atrPct <= 6.0) vol01 = 1;
    else if (atrPct < 0.6) vol01 = clamp01((atrPct - 0.2) / (0.6 - 0.2));
    else vol01 = clamp01((10.0 - atrPct) / (10.0 - 6.0));
  }
  const volFitScore = 20 * vol01;

  const raw = spreadScore + stabilityScore + activityScore + volFitScore;
  const hm = healthMultiplier(input.wsHealth);
  const score = Math.round(Math.max(0, Math.min(100, raw * hm)));

  return {
    score,
    parts: {
      spreadEff,
      cv,
      raw,
      hm,
      spreadScore,
      stabilityScore,
      activityScore,
      volFitScore,
    },
  };
}

export function regimeMatchScore(side: MarketSide, regime: Regime4h, bias: MarketBias, stress: boolean) {
  let base = 0;

  if (regime === "TRANSITION") base = 10;
  else if (regime === "RANGE") base = 30;
  else {
    if (bias === "BULL") base = side === "LONG" ? 85 : 15;
    else if (bias === "BEAR") base = side === "SHORT" ? 85 : 15;
    else base = 40;
  }

  if (stress) base = Math.round(base * 0.6);
  return Math.max(0, Math.min(100, base));
}

export function totalScore(tradeability: number, match: number) {
  if (!Number.isFinite(tradeability) || !Number.isFinite(match)) return 0;
  return Math.round((tradeability * match) / 100);
}

