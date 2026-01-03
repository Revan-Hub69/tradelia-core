import "server-only";

export function isTradingEnabled() {
  const raw = process.env.TRADING_ENABLED;
  if (raw === undefined) {
    return process.env.NODE_ENV !== "production";
  }
  const normalized = raw.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

