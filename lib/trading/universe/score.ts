import type { MarketBias } from "./bias";

export type WsHealth = "OK" | "DEGRADED" | "STALE";
export type MarketSide = "LONG" | "SHORT";
export type Regime4h = "TREND" | "RANGE" | "TRANSITION";
export type EmaState = "aligned_strong" | "aligned_emerging" | "none";

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

function clamp100(value: number) {
  return Math.max(0, Math.min(100, value));
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

function emaStateWeight(emaState: EmaState) {
  if (emaState === "aligned_strong") return 1.0;
  if (emaState === "aligned_emerging") return 0.65;
  return 0;
}

function directionFactor(side: MarketSide, bias: MarketBias) {
  if (bias === "NEUTRAL") return 0.65;
  if (bias === "BULL") return side === "LONG" ? 1 : 0;
  return side === "SHORT" ? 1 : 0;
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

export function regimeMatchScore(input: {
  side: MarketSide;
  regime: Regime4h;
  bias: MarketBias;
  stress: boolean;
  trendStrength: number;
  rangeRatio: number;
  emaState: EmaState;
  atrPct4h: number;
}) {
  const trendStrength = Number.isFinite(input.trendStrength) ? input.trendStrength : 0;
  const rangeRatio = Number.isFinite(input.rangeRatio) ? input.rangeRatio : 0;
  const atrPct4h = Number.isFinite(input.atrPct4h) ? input.atrPct4h : 0;

  const emaW = emaStateWeight(input.emaState);
  const dirW = directionFactor(input.side, input.bias);

  const trend01 = clamp01((trendStrength - 0.55) / (1.6 - 0.55));
  const range01 = clamp01((rangeRatio - 2.0) / (10.0 - 2.0));

  let baseStrength = 0;
  let directionalMultiplier = 1;

  if (input.regime === "TREND") {
    baseStrength = 30 + 25 * emaW + 30 * trend01 + 15 * range01;
    directionalMultiplier = 0.25 + 0.75 * dirW;
  } else if (input.regime === "RANGE") {
    const antiTrend01 = 1 - trend01;
    const structure01 = 1 - emaW;
    baseStrength = 35 + 40 * range01 + 15 * antiTrend01 + 10 * structure01;
    directionalMultiplier = 0.85 + 0.15 * dirW;
  } else {
    const antiTrend01 = 1 - trend01;
    const structure01 = 1 - emaW;
    baseStrength = 15 + 20 * range01 + 10 * antiTrend01 + 10 * structure01;
    directionalMultiplier = 0.9 + 0.1 * dirW;
  }

  let score = clamp100(baseStrength * directionalMultiplier);

  if (atrPct4h > 0 && atrPct4h < 0.35) score *= 0.85;
  if (atrPct4h > 8.0) score *= 0.85;

  if (input.stress) score *= 0.6;

  return Math.round(clamp100(score));
}

export function totalScore(tradeability: number, match: number) {
  if (!Number.isFinite(tradeability) || !Number.isFinite(match)) return 0;
  return Math.round((tradeability * match) / 100);
}
