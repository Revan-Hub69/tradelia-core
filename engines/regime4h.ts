import type { Candle } from "@/adapters/binance";

export type Regime4h = "TREND" | "RANGE" | "TRANSITION";

export type RegimeConfig = {
  version: "regime-4h-config-v1";
  windows: {
    atr14: number;
    ema20: number;
    ema50: number;
    ema200: number;
    returnsStd20: number;
    rangeHHLL50: number;
  };
  thresholds: {
    stressTrueRangeToAtr: number;
    enterTrend: {
      trendStrengthMin: number;
      rangeRatioMin: number;
    };
    exitTrend: {
      trendStrengthMin: number;
      rangeRatioMin: number;
    };
    enterRange: {
      trendStrengthMax: number;
      rangeRatioMin: number;
    };
    exitRange: {
      trendStrengthMax: number;
      rangeRatioMin: number;
    };
  };
};

export type Regime4hOutput = {
  version: "regime-4h-v1";
  regime: Regime4h;
  stress: boolean;
  keptPrevious: boolean;
  metrics: {
    atr14: number;
    ema20: number;
    ema50: number;
    ema200: number;
    trendStrength: number;
    rangeRatio: number;
    returnsStd20: number;
    emaState: "aligned_strong" | "aligned_emerging" | "none";
    trueRangeLast: number;
  };
  allowedSetups: string[];
  forbiddenSetups: string[];
  reasonCode: string;
};

export function computeRegime4h({
  candles4h,
  previousRegime,
  config,
}: {
  candles4h: Candle[];
  previousRegime?: Regime4h;
  config: RegimeConfig;
}): Regime4hOutput {
  assertConfig(config);
  assertCandles(candles4h, config);

  const closes = candles4h.map((candle) => candle.c);
  const ema20 = ema(closes, config.windows.ema20);
  const ema50 = ema(closes, config.windows.ema50);
  const ema200 = ema(closes, config.windows.ema200);
  const atr14 = atrWilder(candles4h, config.windows.atr14);
  const returnsStd20 = stdLogReturns(closes, config.windows.returnsStd20);

  const last = candles4h.at(-1);
  if (!last) throw new Error("Missing last candle.");

  const trueRangeLast = last.h - last.l;
  const range = highLowWindow(candles4h, config.windows.rangeHHLL50);
  const rangeRatio = (range.high - range.low) / atr14;
  const trendStrength = Math.abs(ema20 - ema50) / atr14;
  const emaState = computeEmaState({ ema20, ema50, ema200, close: last.c });
  const stress = trueRangeLast / atr14 >= config.thresholds.stressTrueRangeToAtr;

  const prev = previousRegime;
  let keptPrevious = false;
  let regime: Regime4h = "TRANSITION";

  if (prev === "TREND" && !passesExitTrend({ trendStrength, rangeRatio, emaState }, config)) {
    regime = "TREND";
    keptPrevious = true;
  } else if (prev === "RANGE" && !passesExitRange({ trendStrength, rangeRatio }, config)) {
    regime = "RANGE";
    keptPrevious = true;
  } else if (passesEnterTrend({ trendStrength, rangeRatio, emaState }, config)) {
    regime = "TREND";
  } else if (passesEnterRange({ trendStrength, rangeRatio, emaState }, config)) {
    regime = "RANGE";
  } else {
    regime = "TRANSITION";
  }

  const allowedSetups = mapAllowedSetups(regime, stress);
  const forbiddenSetups = mapForbiddenSetups(regime, stress);
  const reasonCode = buildReasonCode({ regime, stress, keptPrevious, emaState, trendStrength, rangeRatio });

  const metrics = {
    atr14,
    ema20,
    ema50,
    ema200,
    trendStrength,
    rangeRatio,
    returnsStd20,
    emaState,
    trueRangeLast,
  };

  assertNoNaN(metrics);

  return {
    version: "regime-4h-v1",
    regime,
    stress,
    keptPrevious,
    metrics,
    allowedSetups,
    forbiddenSetups,
    reasonCode,
  };
}

function mapAllowedSetups(regime: Regime4h, stress: boolean) {
  if (stress) return ["breakout_retest_only"];
  if (regime === "TREND") return ["trend_pullback"];
  if (regime === "RANGE") return ["range_rejection"];
  return ["breakout_retest_only"];
}

function mapForbiddenSetups(regime: Regime4h, stress: boolean) {
  if (stress) return ["trend_pullback", "range_rejection"];
  if (regime === "TREND") return ["range_rejection"];
  if (regime === "RANGE") return ["trend_pullback"];
  return ["trend_pullback", "range_rejection"];
}

function buildReasonCode({
  regime,
  stress,
  keptPrevious,
  emaState,
  trendStrength,
  rangeRatio,
}: {
  regime: Regime4h;
  stress: boolean;
  keptPrevious: boolean;
  emaState: Regime4hOutput["metrics"]["emaState"];
  trendStrength: number;
  rangeRatio: number;
}) {
  const tags: string[] = [];
  tags.push(`regime_${regime.toLowerCase()}`);
  if (keptPrevious) tags.push("kept_previous");
  if (stress) tags.push("stress");
  tags.push(`ema_${emaState}`);
  tags.push(`ts_${trendStrength.toFixed(3)}`);
  tags.push(`rr_${rangeRatio.toFixed(3)}`);
  return tags.join("|");
}

function passesEnterTrend(
  metrics: { trendStrength: number; rangeRatio: number; emaState: Regime4hOutput["metrics"]["emaState"] },
  config: RegimeConfig,
) {
  return (
    metrics.trendStrength >= config.thresholds.enterTrend.trendStrengthMin &&
    metrics.rangeRatio >= config.thresholds.enterTrend.rangeRatioMin &&
    metrics.emaState !== "none"
  );
}

function passesExitTrend(
  metrics: { trendStrength: number; rangeRatio: number; emaState: Regime4hOutput["metrics"]["emaState"] },
  config: RegimeConfig,
) {
  // Exit TREND when: trendStrength < 0.60 OR rangeRatio < 2.5 OR emaState == none
  return (
    metrics.trendStrength < config.thresholds.exitTrend.trendStrengthMin ||
    metrics.rangeRatio < config.thresholds.exitTrend.rangeRatioMin ||
    metrics.emaState === "none"
  );
}

function passesEnterRange(
  metrics: { trendStrength: number; rangeRatio: number; emaState: Regime4hOutput["metrics"]["emaState"] },
  config: RegimeConfig,
) {
  return (
    metrics.trendStrength <= config.thresholds.enterRange.trendStrengthMax &&
    metrics.rangeRatio >= config.thresholds.enterRange.rangeRatioMin &&
    metrics.emaState !== "aligned_strong"
  );
}

function passesExitRange(metrics: { trendStrength: number; rangeRatio: number }, config: RegimeConfig) {
  // Exit RANGE when: trendStrength > 0.55 OR rangeRatio < 1.8
  return (
    metrics.trendStrength > config.thresholds.exitRange.trendStrengthMax ||
    metrics.rangeRatio < config.thresholds.exitRange.rangeRatioMin
  );
}

function computeEmaState({
  ema20,
  ema50,
  ema200,
  close,
}: {
  ema20: number;
  ema50: number;
  ema200: number;
  close: number;
}): Regime4hOutput["metrics"]["emaState"] {
  const strongBull = ema20 > ema50 && ema50 > ema200;
  const strongBear = ema20 < ema50 && ema50 < ema200;
  if (strongBull || strongBear) return "aligned_strong";

  const emergingBull = ema20 > ema50 && close > ema200;
  const emergingBear = ema20 < ema50 && close < ema200;
  if (emergingBull || emergingBear) return "aligned_emerging";

  return "none";
}

function assertNoNaN(metrics: Regime4hOutput["metrics"]) {
  for (const [key, value] of Object.entries(metrics)) {
    if (key === "emaState") continue;
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`Invalid metric: ${key}`);
    }
  }
}

function assertConfig(config: RegimeConfig) {
  if (config.version !== "regime-4h-config-v1") {
    throw new Error("Invalid config version.");
  }
}

function assertCandles(candles: Candle[], config: RegimeConfig) {
  const required = Math.max(
    config.windows.ema200,
    config.windows.atr14 + 1,
    config.windows.returnsStd20 + 1,
    config.windows.rangeHHLL50,
  );
  if (candles.length < required) {
    throw new Error(`Not enough candles: got ${candles.length}, need at least ${required}.`);
  }
  const last = candles.at(-1);
  if (!last || last.c <= 0) {
    throw new Error("Invalid candle data.");
  }
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ema(values: number[], period: number): number {
  if (values.length < period) throw new Error("Not enough data for EMA.");
  if (period <= 1) return values.at(-1) ?? 0;

  const smoothing = 2 / (period + 1);
  let current = mean(values.slice(0, period));
  for (let index = period; index < values.length; index += 1) {
    current = values[index] * smoothing + current * (1 - smoothing);
  }
  return current;
}

function atrWilder(candles: Candle[], period: number): number {
  if (candles.length < period + 1) throw new Error("Not enough data for ATR.");

  const trs: number[] = [];
  for (let index = 1; index < candles.length; index += 1) {
    const candle = candles[index];
    const prev = candles[index - 1];
    const highLow = candle.h - candle.l;
    const highPrevClose = Math.abs(candle.h - prev.c);
    const lowPrevClose = Math.abs(candle.l - prev.c);
    trs.push(Math.max(highLow, highPrevClose, lowPrevClose));
  }

  let current = mean(trs.slice(0, period));
  for (let index = period; index < trs.length; index += 1) {
    current = (current * (period - 1) + trs[index]) / period;
  }
  if (current <= 0 || !Number.isFinite(current)) throw new Error("Invalid ATR.");
  return current;
}

function stdLogReturns(closes: number[], window: number) {
  if (closes.length < window + 1) throw new Error("Not enough data for returnsStd.");

  const returns: number[] = [];
  for (let index = 1; index < closes.length; index += 1) {
    const prev = closes[index - 1];
    const next = closes[index];
    if (prev <= 0 || next <= 0) continue;
    returns.push(Math.log(next / prev));
  }

  const slice = returns.slice(-window);
  const avg = mean(slice);
  const variance = mean(slice.map((value) => (value - avg) ** 2));
  const value = Math.sqrt(variance);
  if (!Number.isFinite(value)) throw new Error("Invalid returnsStd.");
  return value;
}

function highLowWindow(candles: Candle[], window: number) {
  const slice = candles.slice(-window);
  let high = -Infinity;
  let low = Infinity;
  for (const candle of slice) {
    if (candle.h > high) high = candle.h;
    if (candle.l < low) low = candle.l;
  }
  if (!Number.isFinite(high) || !Number.isFinite(low) || high <= 0 || low <= 0) {
    throw new Error("Invalid HH/LL.");
  }
  return { high, low };
}
