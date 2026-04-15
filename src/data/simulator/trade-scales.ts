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
  { value: 200,     label: '200€'  },
  { value: 1_000,   label: '1k€'   },
  { value: 5_000,   label: '5k€'   },
  { value: 25_000,  label: '25k€'  },
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
// TRADE SIZE — nuovo modello Step 3
// ---------------------------------------------------------------------------

export type TradeSizeMode = 'amount' | 'lots' | 'auto';

// Stop medio implicito per asset group → deriva notionale (usato solo da deriveNotional legacy)
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

/** Legacy — usato internamente per back-compat con computeDrag */
export const RISK_PERCENT_STEPS = [0.5, 1, 2, 3, 5] as const;
export type RiskPercentStep = typeof RISK_PERCENT_STEPS[number];
export const RISK_PERCENT_DEFAULT: RiskPercentStep = 1;

export function deriveNotional(accountSize: number, riskPercent: number, ugId: string): number {
  const stop = AVG_STOP_FRACTION[ugId] ?? 0.01;
  return Math.round((accountSize * riskPercent / 100) / stop);
}

// ---------------------------------------------------------------------------
// NUOVA LOGICA: trade size in € assoluti
// ---------------------------------------------------------------------------

/**
 * Genera le pills di importo contestuali al capitale.
 * 4 valori calibrati sul conto + custom via slider.
 */
export function getTradeSizePills(accountSize: number): number[] {
  if (accountSize <= 200)     return [5, 10, 20, 50];
  if (accountSize <= 500)     return [10, 25, 50, 100];
  if (accountSize <= 1_000)   return [25, 50, 100, 200];
  if (accountSize <= 2_000)   return [50, 100, 200, 400];
  if (accountSize <= 5_000)   return [100, 200, 500, 1_000];
  if (accountSize <= 10_000)  return [200, 500, 1_000, 2_000];
  if (accountSize <= 25_000)  return [500, 1_000, 2_500, 5_000];
  if (accountSize <= 100_000) return [1_000, 2_500, 5_000, 10_000];
  return [2_500, 5_000, 10_000, 25_000];
}

/**
 * Leva媒体 per asset group (forex=30x, indici=20x, equity=10x, crypto=5x)
 */
export const AVG_LEVERAGE: Record<string, number> = {
  ug_fx_core:          30,
  ug_fx_cross:         20,
  ug_fx_exotic:        10,
  ug_index_us:        20,
  ug_index_eu:         20,
  ug_index_asia:       15,
  ug_equity_us_large:  10,
  ug_equity_us_mid:    10,
  ug_equity_eu_large:  10,
  ug_equity_asia:      10,
  ug_commodity_metal:  20,
  ug_commodity_energy: 15,
  ug_crypto_major:     5,
  ug_crypto_altcoin:   3,
};

/**
 * Notionale per 1 lotto per asset group
 */
export const NOTIONAL_PER_LOT: Record<string, number> = {
  ug_fx_core:          100_000,
  ug_fx_cross:        100_000,
  ug_fx_exotic:        100_000,
  ug_index_us:        50_000,
  ug_index_eu:        50_000,
  ug_index_asia:      50_000,
  ug_equity_us_large: 10_000,
  ug_equity_us_mid:   10_000,
  ug_equity_eu_large: 10_000,
  ug_equity_asia:     10_000,
  ug_commodity_metal: 25_000,
  ug_commodity_energy: 25_000,
  ug_crypto_major:   10_000,
  ug_crypto_altcoin: 10_000,
};

/**
 * Converti lotti → € margine richiesto (notionale / leva)
 */
export function lotsToMargin(lots: number, ugId?: string): number {
  const notional = NOTIONAL_PER_LOT[ugId ?? 'ug_fx_core'] * lots;
  const leverage = AVG_LEVERAGE[ugId ?? 'ug_fx_core'];
  return Math.round(notional / leverage);
}

/**
 * Converti lotti → € notionale (per display)
 */
export function lotsToNotional(lots: number, ugId?: string): number {
  const notionalPerLot = NOTIONAL_PER_LOT[ugId ?? 'ug_fx_core'];
  return Math.round(notionalPerLot * lots);
}

/**
 * Converti € notionale → lotti
 */
export function notionalToLots(notional: number, ugId?: string): number {
  const notionalPerLot = NOTIONAL_PER_LOT[ugId ?? 'ug_fx_core'];
  return notional / notionalPerLot;
}

/**
 * Genera le pills di lotti contestuali al conto.
 * 4 lotti calibrati su size account + leverage tipica.
 */
export function getLotSizes(accountSize: number, ugId?: string): number[] {
  const leverage = AVG_LEVERAGE[ugId ?? 'ug_fx_core'];
  const maxExposure = accountSize * leverage;
  const baseLots = maxExposure / 100_000;
  
  if (baseLots <= 0.01) return [0.001, 0.002, 0.005, 0.01];
  if (baseLots <= 0.05) return [0.005, 0.01, 0.02, 0.05];
  if (baseLots <= 0.1)  return [0.01, 0.02, 0.05, 0.1];
  if (baseLots <= 0.5)  return [0.05, 0.1, 0.2, 0.5];
  if (baseLots <= 1)    return [0.1, 0.25, 0.5, 1];
  if (baseLots <= 5)    return [0.5, 1, 2, 5];
  if (baseLots <= 10)   return [1, 2.5, 5, 10];
  return [2, 5, 10, 20];
}

/**
 * Stima automatica size in € quando l'utente sceglie mode Auto.
 * Profilo conservativo su conto piccolo, moderato/attivo su conto grande.
 * Considera leverage per calcolare rischio reale.
 */
export function deriveTradeSizeAuto(accountSize: number, ugId?: string): {
  size: number;
  lotSize: number;
  pct: number;
  leverage: number;
  profile: 'conservative' | 'moderate' | 'active';
} {
  const leverage = AVG_LEVERAGE[ugId ?? 'ug_fx_core'];
  let pct: number;
  
  if (accountSize <= 500) {
    pct = 2;
  } else if (accountSize <= 2_000) {
    pct = 3;
  } else if (accountSize <= 10_000) {
    pct = 5;
  } else if (accountSize <= 50_000) {
    pct = 4;
  } else {
    pct = 3;
  }
  
  const size = Math.max(Math.round(accountSize * pct / 100), 10);
  const lotSize = notionalToLots(size, ugId);
  
  const profile = pct <= 2 ? 'conservative' : pct <= 5 ? 'moderate' : 'active';
  
  return { size, lotSize, pct, leverage, profile };
}

/**
 * Semaforo coerenza size/conto → mappa su RATING_CONFIG esistente.
 */
export function tradeSizeRating(tradeSize: number, accountSize: number): 'low' | 'medium' | 'high' {
  const pct = (tradeSize / accountSize) * 100;
  if (pct <= 5)  return 'low';
  if (pct <= 12) return 'medium';
  return 'high';
}

export const TRADE_SIZE_RATING_LABEL: Record<'low' | 'medium' | 'high', string> = {
  low:    'Coerente col conto',
  medium: 'Dimensione media',
  high:   'Esposizione elevata',
};
