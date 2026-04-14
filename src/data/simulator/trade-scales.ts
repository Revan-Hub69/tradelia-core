// Scale discrete per pill preset + slider opzionale

export const TRADES_PER_MONTH_STEPS = [
  1, 2, 3, 5, 8, 10, 15, 20, 30, 50, 75, 100, 150, 200, 300, 500,
] as const;
export type TradesPerMonthStep = typeof TRADES_PER_MONTH_STEPS[number];
export const TRADES_DEFAULT: TradesPerMonthStep = 20;

// Preset pill visibili per trade/mese (coprono ~90% utenti)
export const TRADES_PRESETS: { value: TradesPerMonthStep; label: string }[] = [
  { value: 5,   label: '5'    },
  { value: 20,  label: '20'   },
  { value: 50,  label: '50'   },
  { value: 100, label: '100'  },
  { value: 200, label: '200+' },
];

export function snapToTradesStep(value: number): TradesPerMonthStep {
  return TRADES_PER_MONTH_STEPS.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

// ---------------------------------------------------------------------------

export const ACCOUNT_SIZE_STEPS = [
  50, 100, 200, 300, 500, 750,
  1_000, 2_000, 3_000, 5_000,
  10_000, 25_000, 50_000,
  100_000, 250_000, 500_000,
] as const;
export type AccountSizeStep = typeof ACCOUNT_SIZE_STEPS[number];
export const ACCOUNT_SIZE_DEFAULT: AccountSizeStep = 1_000;

// Preset pill visibili per account size
export const ACCOUNT_PRESETS: { value: AccountSizeStep; label: string }[] = [
  { value: 200,    label: '200€'  },
  { value: 1_000,  label: '1k€'   },
  { value: 5_000,  label: '5k€'   },
  { value: 25_000, label: '25k€'  },
  { value: 100_000, label: '100k€' },
];

export function snapToAccountStep(value: number): AccountSizeStep {
  return ACCOUNT_SIZE_STEPS.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

export function formatAccountSize(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M€`;
  if (v >= 10_000)    return `${(v / 1_000).toFixed(0)}k€`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1)}k€`;
  return `${v}€`;
}

// ---------------------------------------------------------------------------

export const RISK_PERCENT_STEPS = [0.5, 1, 2, 3, 5] as const;
export type RiskPercentStep = typeof RISK_PERCENT_STEPS[number];
export const RISK_PERCENT_DEFAULT: RiskPercentStep = 1;

// Stop medio implicito per asset group → deriva notionale
export const AVG_STOP_FRACTION: Record<string, number> = {
  ug_fx_core:          0.005,
  ug_fx_cross:         0.006,
  ug_fx_exotic:        0.010,
  ug_index_us:         0.008,
  ug_index_eu:         0.008,
  ug_index_asia:       0.010,
  ug_equity_us_large:  0.015,
  ug_equity_us_mid:    0.020,
  ug_equity_eu_large:  0.015,
  ug_equity_asia:      0.020,
  ug_commodity_metal:  0.010,
  ug_commodity_energy: 0.015,
  ug_crypto_major:     0.025,
  ug_crypto_altcoin:   0.040,
};

export function deriveNotional(accountSize: number, riskPercent: number, ugId: string): number {
  const stop = AVG_STOP_FRACTION[ugId] ?? 0.01;
  return Math.round((accountSize * riskPercent / 100) / stop);
}
