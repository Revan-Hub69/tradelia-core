export type OhlcvCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type Regime = "TREND" | "RANGE" | "NO_TRADE";

export type RegimeClassifierConfig = {
  ema: {
    fast: number;
    mid: number;
    slow: number;
  };
  atrPeriod: number;
  rangeWindow: number;
  returnsStdWindow: number;
  oscillationWindow: number;
  thresholds: {
    maxVolNorm: number;
    trend: {
      enter: {
        trendStrength: number;
        rangeRatio: number;
      };
      exit: {
        trendStrength: number;
        rangeRatio: number;
      };
    };
    range: {
      enter: {
        trendStrengthMax: number;
        rangeRatio: number;
        touchFraction: number;
        midCrossesMin: number;
        touchCountMin: number;
      };
      exit: {
        trendStrengthMax: number;
        rangeRatio: number;
        touchFraction: number;
        midCrossesMin: number;
        touchCountMin: number;
      };
    };
  };
};

export const DEFAULT_REGIME_CONFIG: RegimeClassifierConfig = {
  ema: { fast: 20, mid: 50, slow: 200 },
  atrPeriod: 14,
  rangeWindow: 20,
  returnsStdWindow: 20,
  oscillationWindow: 20,
  thresholds: {
    maxVolNorm: 0.08,
    trend: {
      enter: { trendStrength: 0.8, rangeRatio: 3 },
      exit: { trendStrength: 0.65, rangeRatio: 2.5 },
    },
    range: {
      enter: {
        trendStrengthMax: 0.4,
        rangeRatio: 2,
        touchFraction: 0.2,
        midCrossesMin: 2,
        touchCountMin: 2,
      },
      exit: {
        trendStrengthMax: 0.55,
        rangeRatio: 1.8,
        touchFraction: 0.2,
        midCrossesMin: 1,
        touchCountMin: 1,
      },
    },
  },
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

export type RegimeClassifierOutput = {
  regime: Regime;
  confidence: number;
  reason: {
    version: "regime-v1";
    previousRegime?: Regime;
    rawRegime: Regime;
    keptPrevious: boolean;
    metrics: {
      price: number;
      atr: number;
      emaFast: number;
      emaMid: number;
      emaSlow: number;
      trendStrength: number;
      rangeHigh: number;
      rangeLow: number;
      rangeRatio: number;
      volNorm: number;
      returnsStd: number;
      emaAlignment: "bull" | "bear" | "none";
      oscillation: {
        mid: number;
        midCrosses: number;
        upperTouches: number;
        lowerTouches: number;
      };
    };
    checks: {
      trend: {
        trendStrength: boolean;
        emaAlignment: boolean;
        rangeRatio: boolean;
        volNorm: boolean;
      };
      range: {
        trendStrength: boolean;
        rangeRatio: boolean;
        oscillation: boolean;
        volNorm: boolean;
      };
    };
    thresholds: RegimeClassifierConfig["thresholds"];
  };
};

export function classifyRegime({
  candles,
  previousRegime,
  config,
}: {
  candles: OhlcvCandle[];
  previousRegime?: Regime;
  config?: DeepPartial<RegimeClassifierConfig>;
}): RegimeClassifierOutput {
  const resolvedConfig = resolveConfig(config);
  assertEnoughCandles(candles, resolvedConfig);

  const closes = candles.map((candle) => candle.close);
  const price = closes.at(-1);
  if (!isFiniteNumber(price) || price <= 0) {
    throw new Error("Invalid candle data: last close must be a positive number.");
  }

  const emaFast = ema(closes, resolvedConfig.ema.fast);
  const emaMid = ema(closes, resolvedConfig.ema.mid);
  const emaSlow = ema(closes, resolvedConfig.ema.slow);
  const atrValue = atr(candles, resolvedConfig.atrPeriod);

  if (emaFast === null || emaMid === null || emaSlow === null || atrValue === null) {
    throw new Error("Not enough data to compute required indicators (EMA/ATR).");
  }
  if (atrValue <= 0) {
    throw new Error("Invalid candle data: ATR must be > 0.");
  }

  const { high: rangeHigh, low: rangeLow } = highLowWindow(candles, resolvedConfig.rangeWindow);
  const rangeRatio = (rangeHigh - rangeLow) / atrValue;
  const trendStrength = Math.abs(emaFast - emaMid) / atrValue;
  const volNorm = atrValue / price;
  const returnsStd = stdLogReturns(closes, resolvedConfig.returnsStdWindow);

  const emaAlignment = computeEmaAlignment({ emaFast, emaMid, emaSlow });
  const oscillation = oscillationStats(candles, resolvedConfig.oscillationWindow, resolvedConfig.thresholds.range);

  const trendChecks = {
    trendStrength: trendStrength >= resolvedConfig.thresholds.trend.enter.trendStrength,
    emaAlignment: emaAlignment !== "none",
    rangeRatio: rangeRatio >= resolvedConfig.thresholds.trend.enter.rangeRatio,
    volNorm: volNorm <= resolvedConfig.thresholds.maxVolNorm,
  };

  const rangeChecks = {
    trendStrength: trendStrength <= resolvedConfig.thresholds.range.enter.trendStrengthMax,
    rangeRatio: rangeRatio >= resolvedConfig.thresholds.range.enter.rangeRatio,
    oscillation: oscillation.ok,
    volNorm: volNorm <= resolvedConfig.thresholds.maxVolNorm,
  };

  const rawRegime: Regime = trendChecks.trendStrength &&
    trendChecks.emaAlignment &&
    trendChecks.rangeRatio &&
    trendChecks.volNorm
    ? "TREND"
    : rangeChecks.trendStrength &&
        rangeChecks.rangeRatio &&
        rangeChecks.oscillation &&
        rangeChecks.volNorm
      ? "RANGE"
      : "NO_TRADE";

  const hysteresis = applyHysteresis({
    rawRegime,
    previousRegime,
    metrics: { trendStrength, rangeRatio, emaAlignment, volNorm, oscillation },
    thresholds: resolvedConfig.thresholds,
  });

  const trendScore = scoreTrend({
    trendStrength,
    rangeRatio,
    volNorm,
    emaAlignment,
    thresholds: resolvedConfig.thresholds,
  });
  const rangeScore = scoreRange({
    trendStrength,
    rangeRatio,
    volNorm,
    oscillation,
    thresholds: resolvedConfig.thresholds,
  });

  const confidence =
    hysteresis.regime === "TREND"
      ? trendScore
      : hysteresis.regime === "RANGE"
        ? rangeScore
        : clamp01(1 - Math.max(trendScore, rangeScore));

  return {
    regime: hysteresis.regime,
    confidence,
    reason: {
      version: "regime-v1",
      previousRegime,
      rawRegime,
      keptPrevious: hysteresis.keptPrevious,
      metrics: {
        price,
        atr: atrValue,
        emaFast,
        emaMid,
        emaSlow,
        trendStrength,
        rangeHigh,
        rangeLow,
        rangeRatio,
        volNorm,
        returnsStd,
        emaAlignment,
        oscillation: {
          mid: oscillation.mid,
          midCrosses: oscillation.midCrosses,
          upperTouches: oscillation.upperTouches,
          lowerTouches: oscillation.lowerTouches,
        },
      },
      checks: {
        trend: trendChecks,
        range: rangeChecks,
      },
      thresholds: resolvedConfig.thresholds,
    },
  };
}

function resolveConfig(override?: DeepPartial<RegimeClassifierConfig>): RegimeClassifierConfig {
  if (!override) return DEFAULT_REGIME_CONFIG;
  return {
    ...DEFAULT_REGIME_CONFIG,
    ...override,
    ema: { ...DEFAULT_REGIME_CONFIG.ema, ...override.ema },
    thresholds: {
      ...DEFAULT_REGIME_CONFIG.thresholds,
      ...override.thresholds,
      trend: {
        ...DEFAULT_REGIME_CONFIG.thresholds.trend,
        ...override.thresholds?.trend,
        enter: {
          ...DEFAULT_REGIME_CONFIG.thresholds.trend.enter,
          ...override.thresholds?.trend?.enter,
        },
        exit: {
          ...DEFAULT_REGIME_CONFIG.thresholds.trend.exit,
          ...override.thresholds?.trend?.exit,
        },
      },
      range: {
        ...DEFAULT_REGIME_CONFIG.thresholds.range,
        ...override.thresholds?.range,
        enter: {
          ...DEFAULT_REGIME_CONFIG.thresholds.range.enter,
          ...override.thresholds?.range?.enter,
        },
        exit: {
          ...DEFAULT_REGIME_CONFIG.thresholds.range.exit,
          ...override.thresholds?.range?.exit,
        },
      },
    },
  };
}

function assertEnoughCandles(candles: OhlcvCandle[], config: RegimeClassifierConfig) {
  const required = Math.max(
    config.ema.slow,
    config.atrPeriod + 1,
    config.rangeWindow,
    config.returnsStdWindow + 1,
    config.oscillationWindow,
  );
  if (candles.length < required) {
    throw new Error(
      `Not enough candles: got ${candles.length}, need at least ${required} for EMA${config.ema.slow}.`,
    );
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp01(value: number) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ema(values: number[], period: number): number | null {
  if (values.length < period) return null;
  if (period <= 1) return values.at(-1) ?? null;

  const smoothing = 2 / (period + 1);
  let current = mean(values.slice(0, period));

  for (let index = period; index < values.length; index += 1) {
    current = values[index] * smoothing + current * (1 - smoothing);
  }

  return current;
}

function atr(candles: OhlcvCandle[], period: number): number | null {
  if (period <= 0) return null;
  if (candles.length < period + 1) return null;

  const trs: number[] = [];
  for (let index = 1; index < candles.length; index += 1) {
    const candle = candles[index];
    const prev = candles[index - 1];

    const highLow = candle.high - candle.low;
    const highPrevClose = Math.abs(candle.high - prev.close);
    const lowPrevClose = Math.abs(candle.low - prev.close);
    trs.push(Math.max(highLow, highPrevClose, lowPrevClose));
  }

  if (trs.length < period) return null;
  let current = mean(trs.slice(0, period));
  for (let index = period; index < trs.length; index += 1) {
    current = (current * (period - 1) + trs[index]) / period;
  }
  return current;
}

function stdLogReturns(closes: number[], window: number) {
  if (window <= 1) return 0;
  if (closes.length < window + 1) return 0;

  const returns: number[] = [];
  for (let index = 1; index < closes.length; index += 1) {
    const prev = closes[index - 1];
    const next = closes[index];
    if (prev <= 0 || next <= 0) continue;
    returns.push(Math.log(next / prev));
  }

  if (returns.length < window) return 0;
  const slice = returns.slice(-window);
  const avg = mean(slice);
  const variance = mean(slice.map((value) => (value - avg) ** 2));
  return Math.sqrt(variance);
}

function highLowWindow(candles: OhlcvCandle[], window: number) {
  const slice = candles.slice(-window);
  let high = -Infinity;
  let low = Infinity;

  for (const candle of slice) {
    if (candle.high > high) high = candle.high;
    if (candle.low < low) low = candle.low;
  }

  return { high, low };
}

function computeEmaAlignment({
  emaFast,
  emaMid,
  emaSlow,
}: {
  emaFast: number;
  emaMid: number;
  emaSlow: number;
}): "bull" | "bear" | "none" {
  if (emaFast > emaMid && emaMid > emaSlow) return "bull";
  if (emaFast < emaMid && emaMid < emaSlow) return "bear";
  return "none";
}

type OscillationStats = {
  ok: boolean;
  mid: number;
  midCrosses: number;
  upperTouches: number;
  lowerTouches: number;
};

function oscillationStats(
  candles: OhlcvCandle[],
  window: number,
  thresholds: RegimeClassifierConfig["thresholds"]["range"],
): OscillationStats {
  const slice = candles.slice(-window);
  const { high, low } = highLowWindow(slice, slice.length);
  const width = high - low;
  const mid = (high + low) / 2;

  if (width <= 0 || slice.length < 2) {
    return { ok: false, mid, midCrosses: 0, upperTouches: 0, lowerTouches: 0 };
  }

  const touchFraction = thresholds.enter.touchFraction;
  const upperZone = high - width * touchFraction;
  const lowerZone = low + width * touchFraction;

  let midCrosses = 0;
  let upperTouches = 0;
  let lowerTouches = 0;
  let prevSide = slice[0].close >= mid;

  for (const candle of slice) {
    const close = candle.close;
    const side = close >= mid;
    if (side !== prevSide) {
      midCrosses += 1;
      prevSide = side;
    }
    if (close >= upperZone) upperTouches += 1;
    if (close <= lowerZone) lowerTouches += 1;
  }

  const ok =
    midCrosses >= thresholds.enter.midCrossesMin &&
    upperTouches >= thresholds.enter.touchCountMin &&
    lowerTouches >= thresholds.enter.touchCountMin;

  return { ok, mid, midCrosses, upperTouches, lowerTouches };
}

function applyHysteresis({
  rawRegime,
  previousRegime,
  metrics,
  thresholds,
}: {
  rawRegime: Regime;
  previousRegime?: Regime;
  metrics: {
    trendStrength: number;
    rangeRatio: number;
    emaAlignment: "bull" | "bear" | "none";
    volNorm: number;
    oscillation: OscillationStats;
  };
  thresholds: RegimeClassifierConfig["thresholds"];
}): { regime: Regime; keptPrevious: boolean } {
  if (!previousRegime || previousRegime === "NO_TRADE") {
    return { regime: rawRegime, keptPrevious: false };
  }

  if (previousRegime === "TREND") {
    const hold =
      metrics.volNorm <= thresholds.maxVolNorm &&
      metrics.emaAlignment !== "none" &&
      metrics.trendStrength >= thresholds.trend.exit.trendStrength &&
      metrics.rangeRatio >= thresholds.trend.exit.rangeRatio;
    if (hold) return { regime: "TREND", keptPrevious: rawRegime !== "TREND" };
    return { regime: rawRegime === "TREND" ? "TREND" : "NO_TRADE", keptPrevious: false };
  }

  const hold =
    metrics.volNorm <= thresholds.maxVolNorm &&
    metrics.trendStrength <= thresholds.range.exit.trendStrengthMax &&
    metrics.rangeRatio >= thresholds.range.exit.rangeRatio &&
    holdsOscillation(metrics.oscillation, thresholds.range.exit);

  if (hold) return { regime: "RANGE", keptPrevious: rawRegime !== "RANGE" };
  return { regime: rawRegime === "RANGE" ? "RANGE" : "NO_TRADE", keptPrevious: false };
}

function holdsOscillation(
  oscillation: OscillationStats,
  exit: RegimeClassifierConfig["thresholds"]["range"]["exit"],
) {
  return (
    oscillation.midCrosses >= exit.midCrossesMin &&
    oscillation.upperTouches >= exit.touchCountMin &&
    oscillation.lowerTouches >= exit.touchCountMin
  );
}

function normalizeBetween(value: number, low: number, high: number) {
  if (high <= low) return value >= high ? 1 : 0;
  return clamp01((value - low) / (high - low));
}

function scoreTrend({
  trendStrength,
  rangeRatio,
  volNorm,
  emaAlignment,
  thresholds,
}: {
  trendStrength: number;
  rangeRatio: number;
  volNorm: number;
  emaAlignment: "bull" | "bear" | "none";
  thresholds: RegimeClassifierConfig["thresholds"];
}) {
  const strength = normalizeBetween(trendStrength, thresholds.trend.exit.trendStrength, thresholds.trend.enter.trendStrength);
  const range = normalizeBetween(rangeRatio, thresholds.trend.exit.rangeRatio, thresholds.trend.enter.rangeRatio);
  const vol = clamp01((thresholds.maxVolNorm - volNorm) / thresholds.maxVolNorm);
  const align = emaAlignment === "none" ? 0 : 1;

  return Math.min(strength, range, vol, align);
}

function scoreRange({
  trendStrength,
  rangeRatio,
  volNorm,
  oscillation,
  thresholds,
}: {
  trendStrength: number;
  rangeRatio: number;
  volNorm: number;
  oscillation: OscillationStats;
  thresholds: RegimeClassifierConfig["thresholds"];
}) {
  const denom = thresholds.range.exit.trendStrengthMax - thresholds.range.enter.trendStrengthMax;
  const strength =
    denom <= 0
      ? trendStrength <= thresholds.range.enter.trendStrengthMax
        ? 1
        : 0
      : clamp01((thresholds.range.exit.trendStrengthMax - trendStrength) / denom);

  const range = normalizeBetween(rangeRatio, thresholds.range.exit.rangeRatio, thresholds.range.enter.rangeRatio);
  const vol = clamp01((thresholds.maxVolNorm - volNorm) / thresholds.maxVolNorm);

  const midCrosses = clamp01(oscillation.midCrosses / thresholds.range.enter.midCrossesMin);
  const upperTouches = clamp01(oscillation.upperTouches / thresholds.range.enter.touchCountMin);
  const lowerTouches = clamp01(oscillation.lowerTouches / thresholds.range.enter.touchCountMin);
  const osc = Math.min(midCrosses, upperTouches, lowerTouches);

  return Math.min(strength, range, vol, osc);
}

