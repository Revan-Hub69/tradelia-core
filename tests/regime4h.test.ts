import assert from "node:assert/strict";
import test from "node:test";

import type { Candle } from "@/adapters/binance";
import { computeRegime4h, type RegimeConfig } from "@/engines/regime4h";

const config: RegimeConfig = {
  version: "regime-4h-config-v1",
  windows: {
    atr14: 14,
    ema20: 20,
    ema50: 50,
    ema200: 200,
    returnsStd20: 20,
    rangeHHLL50: 50,
  },
  thresholds: {
    stressTrueRangeToAtr: 2.2,
    enterTrend: { trendStrengthMin: 0.7, rangeRatioMin: 3.0 },
    exitTrend: { trendStrengthMin: 0.6, rangeRatioMin: 2.5 },
    enterRange: { trendStrengthMax: 0.45, rangeRatioMin: 2.0 },
    exitRange: { trendStrengthMax: 0.55, rangeRatioMin: 1.8 },
  },
};

function makeCandles(length: number, { base, drift, vol }: { base: number; drift: number; vol: number }): Candle[] {
  const candles: Candle[] = [];
  let price = base;
  const intervalMs = 4 * 60 * 60 * 1000;
  const anchor = 1_700_000_000_000;
  const start = anchor - (anchor % intervalMs);
  for (let i = 0; i < length; i += 1) {
    const t = start + i * intervalMs;
    const o = price;
    const c = price + drift;
    const h = Math.max(o, c) + vol;
    const l = Math.min(o, c) - vol;
    const v = 1000;
    candles.push({ t, o, h, l, c, v });
    price = c;
  }
  return candles;
}

test("computeRegime4h: no NaN metrics", () => {
  const candles = makeCandles(320, { base: 100, drift: 0.2, vol: 0.5 });
  const out = computeRegime4h({ candles4h: candles, config });
  assert.ok(out.metrics.atr14 > 0);
  assert.ok(Number.isFinite(out.metrics.trendStrength));
  assert.ok(Number.isFinite(out.metrics.rangeRatio));
  assert.ok(Number.isFinite(out.metrics.returnsStd20));
});

test("computeRegime4h: hysteresis holds TREND when exit not triggered", () => {
  const candles = makeCandles(320, { base: 100, drift: 0.25, vol: 0.8 });
  const out = computeRegime4h({ candles4h: candles, config, previousRegime: "TREND" });
  assert.equal(out.regime, "TREND");
  assert.equal(out.keptPrevious, true);
});

test("computeRegime4h: allowedSetups coherent", () => {
  const candles = makeCandles(320, { base: 100, drift: 0.0, vol: 2.0 });
  const out = computeRegime4h({ candles4h: candles, config });
  assert.ok(out.allowedSetups.length >= 1);
  if (out.regime === "TREND") assert.deepEqual(out.allowedSetups, ["trend_pullback"]);
  if (out.regime === "RANGE") assert.deepEqual(out.allowedSetups, ["range_rejection"]);
  if (out.regime === "TRANSITION") assert.deepEqual(out.allowedSetups, ["breakout_retest_only"]);
});

test("computeRegime4h: trueRangeLast uses Wilder true range (gap-aware)", () => {
  const candles = makeCandles(320, { base: 100, drift: 0.0, vol: 0.5 });
  const lastIndex = candles.length - 1;
  const prevClose = candles[lastIndex - 1].c;

  candles[lastIndex] = {
    ...candles[lastIndex],
    o: 130,
    c: 130,
    h: 131,
    l: 129,
  };

  const out = computeRegime4h({ candles4h: candles, config });
  const expected = Math.max(131 - 129, Math.abs(131 - prevClose), Math.abs(129 - prevClose));
  assert.equal(out.metrics.trueRangeLast, expected);
});

test("computeRegime4h: handles unsorted candles deterministically", () => {
  const candles = makeCandles(320, { base: 100, drift: 0.15, vol: 0.8 });
  const outSorted = computeRegime4h({ candles4h: candles, config });
  const outUnsorted = computeRegime4h({ candles4h: [...candles].reverse(), config });
  assert.equal(outUnsorted.regime, outSorted.regime);
  assert.equal(outUnsorted.metrics.emaState, outSorted.metrics.emaState);
  assert.ok(Math.abs(outUnsorted.metrics.atr14 - outSorted.metrics.atr14) < 1e-12);
});
