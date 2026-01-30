const roundTo = (n: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
};

const precisionMap: Record<string, number> = {
  // 2 decimals
  "constraints.hard_limits.max_dd_pct": 2,
  "constraints.hard_limits.daily_loss_pct": 2,
  "constraints.hard_limits.profit_target_pct": 2,
  "constraints.risk_budget.daily_risk_cap_pct": 2,
  "constraints.risk_budget.risk_per_trade_pct": 2,
  "data_quality.freshness": 2,
  "data_quality.integrity": 2,
  "data_quality.coverage": 2,
  "uncertainty.data_u": 2,
  "uncertainty.regime_u": 2,
  "uncertainty.execution_u": 2,
  "uncertainty.disagreement_u": 2,
  "regime.confidence": 2,
  "regime.transition_risk": 2,
  "market.liquidity_proxy": 2,

  // 4 decimals
  "cost_distribution.expected": 4,
  "cost_distribution.tail_risk": 4,
};

export function quantize(field: string, value: number | null): number | null {
  if (value == null) return null;
  const decimals = precisionMap[field];
  if (decimals == null) return value;
  return roundTo(value, decimals);
}

export function getPrecisionMap(): Record<string, number> {
  return { ...precisionMap };
}
