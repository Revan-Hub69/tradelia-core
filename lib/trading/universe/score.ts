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

function logScore(value: number, maxValue: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  const safeMax = Math.max(1, maxValue);
  const normalized = Math.log10(value + 1) / Math.log10(safeMax + 1);
  return clamp01(normalized);
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

  const spreadEffBps = Math.max(input.spreadBpsNow, input.spreadMeanBps60s);
  const jitterAbsBps = Number.isFinite(input.spreadStdBps60s) ? Math.max(0, input.spreadStdBps60s) : 0;
  const cv = jitterAbsBps / Math.max(Number.isFinite(input.spreadMeanBps60s) ? input.spreadMeanBps60s : 0, eps);

  const impactBps = spreadEffBps + 2.0 * jitterAbsBps;
  const impact01 = linScoreUpper(impactBps, 0.5, 12);
  const impactScore = 55 * impact01;

  const stability01 = linScoreUpper(jitterAbsBps, 0.05, 1.0);
  const stabilityScore = 10 * stability01;

  const activityPenalty01 = linScoreLower(input.msgRate60s, 0, 8);
  const activityPenalty = 10 * (1 - activityPenalty01);
  const activityBonus = 10 * logScore(input.msgRate60s, 1000);

  const atrPct = input.atrPct4h;
  let vol01 = 0;
  if (Number.isFinite(atrPct)) {
    if (atrPct >= 0.8 && atrPct <= 5.5) vol01 = 1;
    else if (atrPct < 0.8) vol01 = clamp01((atrPct - 0.2) / (0.8 - 0.2));
    else vol01 = clamp01((10.0 - atrPct) / (10.0 - 5.5));
  }
  const volFitScore = 25 * vol01;

  const raw = Math.max(0, impactScore + stabilityScore + activityBonus + volFitScore - activityPenalty);
  const hm = healthMultiplier(input.wsHealth);
  const score = Math.round(Math.max(0, Math.min(100, raw * hm)));

  return {
    score,
    parts: {
      spreadEffBps,
      jitterAbsBps,
      impactBps,
      cv,
      raw,
      hm,
      impactScore,
      stabilityScore,
      activityBonus,
      activityPenalty,
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
