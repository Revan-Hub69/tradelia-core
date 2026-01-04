import assert from "node:assert/strict";
import test from "node:test";

import { regimeMatchScore, tradeabilityScore, type EmaState, type Regime4h, type WsHealth } from "@/lib/trading/universe/score";

test("regimeMatchScore: TREND favors bias-consistent side and scales with strength", () => {
  const base = {
    regime: "TREND" as Regime4h,
    stress: false,
    bias: "BULL" as const,
    rangeRatio: 6,
    atrPct4h: 1.2,
  };

  const strong = regimeMatchScore({
    ...base,
    side: "LONG",
    emaState: "aligned_strong" as EmaState,
    trendStrength: 1.4,
  });

  const weak = regimeMatchScore({
    ...base,
    side: "LONG",
    emaState: "aligned_emerging" as EmaState,
    trendStrength: 0.75,
  });

  const contrarian = regimeMatchScore({
    ...base,
    side: "SHORT",
    emaState: "aligned_strong" as EmaState,
    trendStrength: 1.4,
  });

  assert.ok(strong > weak);
  assert.ok(strong > contrarian);
  assert.ok(contrarian < 50);
});

test("regimeMatchScore: RANGE is side-symmetric and higher than TRANSITION", () => {
  const common = {
    bias: "NEUTRAL" as const,
    stress: false,
    emaState: "none" as EmaState,
    trendStrength: 0.25,
    rangeRatio: 6,
    atrPct4h: 1.0,
  };

  const rangeLong = regimeMatchScore({ ...common, side: "LONG", regime: "RANGE" });
  const rangeShort = regimeMatchScore({ ...common, side: "SHORT", regime: "RANGE" });
  const transition = regimeMatchScore({ ...common, side: "LONG", regime: "TRANSITION" });

  assert.ok(Math.abs(rangeLong - rangeShort) <= 5);
  assert.ok(rangeLong > transition);
});

test("tradeabilityScore: impact/jitter penalize noisy symbols", () => {
  const health: WsHealth = "OK";

  const btcLike = tradeabilityScore({
    spreadBpsNow: 0.01,
    spreadMeanBps60s: 0.02,
    spreadStdBps60s: 0.01,
    msgRate60s: 800,
    atrPct4h: 1.0,
    wsHealth: health,
  });

  const noisy = tradeabilityScore({
    spreadBpsNow: 6,
    spreadMeanBps60s: 7,
    spreadStdBps60s: 1.2,
    msgRate60s: 200,
    atrPct4h: 3.0,
    wsHealth: health,
  });

  assert.ok(btcLike.score > noisy.score);
  assert.ok(noisy.parts.impactBps > btcLike.parts.impactBps);
});

