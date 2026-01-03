export type MarketBias = "BULL" | "BEAR" | "NEUTRAL";

export function deriveBias(ema20: number, ema50: number, ema200: number, close: number): MarketBias {
  if (!Number.isFinite(ema20) || !Number.isFinite(ema50) || !Number.isFinite(ema200) || !Number.isFinite(close)) {
    return "NEUTRAL";
  }
  if (ema20 > ema50 && close > ema200) return "BULL";
  if (ema20 < ema50 && close < ema200) return "BEAR";
  return "NEUTRAL";
}

