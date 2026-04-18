/**
 * Broker dataset for Tradelia simulator.
 *
 * Source: typical spreads / commissions / min deposits pubblicati sulle pagine
 * ufficiali dei broker (aggregato manualmente · snapshot 2026-04).
 * NON sono misurazioni real-time. UI deve etichettarli come "dati aggregati".
 */

export type BrokerTier = 'cent' | 'starter' | 'standard' | 'ecn' | 'pro';

export type BrokerAccount = {
  id: string;
  brokerId: string;
  brokerName: string;
  accountName: string;
  tier: BrokerTier;
  minDepositEur: number;
  /** Typical EUR/USD spread in pips (midpoint of declared range). */
  spreadEurUsdPip: number;
  /** Commission per standard lot round-turn in EUR (0 if spread-only). */
  commissionPerLotEur: number;
  /** Minimum tradable lot size. */
  minLotSize: number;
  regulator: string;
  /** Typical overnight swap EUR/USD long side, €/lot/night (indicative, include markup broker). */
  swapLongPerLotEur?: number;
  /** Average execution latency (ms) in normal conditions. */
  avgExecutionMs?: number;
  /** Deposit/withdrawal notes (short summary). */
  depositNote?: string;
  /** Trading platforms supported. */
  platforms?: string[];
  /** Max leverage for retail (ESMA) */
  maxLeverageRetail?: number;
};

export const BROKER_ACCOUNTS: BrokerAccount[] = [
  // CENT / MICRO — per capitale < 100€
  {
    id: 'xm-ultra-low',
    brokerId: 'xm',
    brokerName: 'XM',
    accountName: 'Ultra-Low',
    tier: 'cent',
    minDepositEur: 5,
    spreadEurUsdPip: 0.6,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'CySEC · ASIC · FCA',
  },
  {
    id: 'exness-cent',
    brokerId: 'exness',
    brokerName: 'Exness',
    accountName: 'Standard Cent',
    tier: 'cent',
    minDepositEur: 10,
    spreadEurUsdPip: 1.0,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'CySEC · FCA · FSCA',
  },

  // STARTER — per capitale 100-1.000€
  {
    id: 'fxtm-micro',
    brokerId: 'fxtm',
    brokerName: 'FXTM',
    accountName: 'Micro',
    tier: 'starter',
    minDepositEur: 10,
    spreadEurUsdPip: 1.5,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'CySEC · FCA · FSCA',
  },
  {
    id: 'octafx-standard',
    brokerId: 'octafx',
    brokerName: 'OctaFX',
    accountName: 'MT5 Standard',
    tier: 'starter',
    minDepositEur: 25,
    spreadEurUsdPip: 0.6,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'CySEC',
  },
  {
    id: 'pepperstone-standard',
    brokerId: 'pepperstone',
    brokerName: 'Pepperstone',
    accountName: 'Standard',
    tier: 'standard',
    minDepositEur: 0,
    spreadEurUsdPip: 1.0,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'FCA · ASIC · CySEC',
  },
  {
    id: 'xtb-standard',
    brokerId: 'xtb',
    brokerName: 'XTB',
    accountName: 'Standard',
    tier: 'standard',
    minDepositEur: 0,
    spreadEurUsdPip: 0.9,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'CySEC · KNF · FCA',
  },
  {
    id: 'oanda-core',
    brokerId: 'oanda',
    brokerName: 'OANDA',
    accountName: 'Core',
    tier: 'standard',
    minDepositEur: 0,
    spreadEurUsdPip: 1.2,
    commissionPerLotEur: 0,
    minLotSize: 0.01,
    regulator: 'FCA · CFTC · ASIC',
  },

  // ECN RAW — conviene da 2.500€+ per via delle commissioni
  {
    id: 'ic-markets-raw',
    brokerId: 'ic-markets',
    brokerName: 'IC Markets',
    accountName: 'Raw Spread',
    tier: 'ecn',
    minDepositEur: 200,
    spreadEurUsdPip: 0.1,
    commissionPerLotEur: 6,
    minLotSize: 0.01,
    regulator: 'ASIC · CySEC · FSA',
  },
  {
    id: 'pepperstone-razor',
    brokerId: 'pepperstone',
    brokerName: 'Pepperstone',
    accountName: 'Razor',
    tier: 'ecn',
    minDepositEur: 0,
    spreadEurUsdPip: 0.1,
    commissionPerLotEur: 7,
    minLotSize: 0.01,
    regulator: 'FCA · ASIC · CySEC',
  },
  {
    id: 'tickmill-pro',
    brokerId: 'tickmill',
    brokerName: 'Tickmill',
    accountName: 'Pro',
    tier: 'ecn',
    minDepositEur: 100,
    spreadEurUsdPip: 0.2,
    commissionPerLotEur: 4,
    minLotSize: 0.01,
    regulator: 'FCA · CySEC · FSA',
  },

  // PRO — VIP tiers con commissioni ridotte, min deposit alto
  {
    id: 'ic-markets-cplus',
    brokerId: 'ic-markets',
    brokerName: 'IC Markets',
    accountName: 'cTrader VIP',
    tier: 'pro',
    minDepositEur: 25000,
    spreadEurUsdPip: 0.1,
    commissionPerLotEur: 3,
    minLotSize: 0.01,
    regulator: 'ASIC · CySEC · FSA',
  },
];

export const BROKER_TIERS: { id: BrokerTier; label: string; range: string }[] = [
  { id: 'cent', label: 'Cent', range: '€5 – €100' },
  { id: 'starter', label: 'Starter', range: '€10 – €500' },
  { id: 'standard', label: 'Standard', range: '€0 – €2.500' },
  { id: 'ecn', label: 'ECN', range: '€100 – €10k' },
  { id: 'pro', label: 'Pro', range: '€10k+' },
];

export type TradingMode = 'intraday' | 'multiday';

/**
 * Calcola costo mensile totale per un account broker.
 * pipValue = €10 per standard lot a EUR/USD (semplificazione).
 * In modalità multiday, aggiunge il costo swap (markup broker su EUR/USD long)
 * stimato su nightsPerTrade notti per trade.
 */
export function estimateMonthlyCost(
  account: BrokerAccount,
  lotSize: number,
  tradesPerMonth: number,
  mode: TradingMode = 'intraday',
  nightsPerTrade = 0,
): number {
  const pipValuePerLot = 10; // EUR/USD standard
  const spreadCostPerTrade = account.spreadEurUsdPip * pipValuePerLot * lotSize;
  const commissionCostPerTrade = account.commissionPerLotEur * lotSize;
  let costPerTrade = spreadCostPerTrade + commissionCostPerTrade;
  if (mode === 'multiday' && nightsPerTrade > 0) {
    const qual = getBrokerQualitative(account);
    // swap long è tipicamente negativo (costo): usiamo valore assoluto come costo
    const swapPerNight = Math.abs(qual.swapLongPerLotEur) * lotSize;
    costPerTrade += swapPerNight * nightsPerTrade;
  }
  return costPerTrade * tradesPerMonth;
}

/**
 * Breakdown dettagliato del costo calcolato (componenti incluse nel motore).
 */
export function computeCostBreakdown(
  account: BrokerAccount,
  lotSize: number,
  tradesPerMonth: number,
  mode: TradingMode = 'intraday',
  nightsPerTrade = 0,
) {
  const pipValuePerLot = 10;
  const spreadPerTrade = account.spreadEurUsdPip * pipValuePerLot * lotSize;
  const commissionPerTrade = account.commissionPerLotEur * lotSize;
  const qual = getBrokerQualitative(account);
  const swapPerTrade = mode === 'multiday' && nightsPerTrade > 0
    ? Math.abs(qual.swapLongPerLotEur) * lotSize * nightsPerTrade
    : 0;
  return {
    spreadPerTrade: Number(spreadPerTrade.toFixed(2)),
    commissionPerTrade: Number(commissionPerTrade.toFixed(2)),
    swapPerTrade: Number(swapPerTrade.toFixed(2)),
    spreadPerMonth: Number((spreadPerTrade * tradesPerMonth).toFixed(2)),
    commissionPerMonth: Number((commissionPerTrade * tradesPerMonth).toFixed(2)),
    swapPerMonth: Number((swapPerTrade * tradesPerMonth).toFixed(2)),
  };
}

/**
 * Default qualitativi per tier (usati quando il singolo broker non li dichiara).
 * Indicativi — non entrano nel calcolo costo mensile.
 */
const TIER_DEFAULTS: Record<BrokerTier, {
  swapLongPerLotEur: number;
  avgExecutionMs: number;
  depositNote: string;
  platforms: string[];
  maxLeverageRetail: number;
}> = {
  cent: {
    swapLongPerLotEur: -7,
    avgExecutionMs: 80,
    depositNote: 'Carte, e-wallet, SEPA gratis',
    platforms: ['MT4', 'MT5'],
    maxLeverageRetail: 30,
  },
  starter: {
    swapLongPerLotEur: -6.5,
    avgExecutionMs: 60,
    depositNote: 'Carte, e-wallet, SEPA gratis',
    platforms: ['MT4', 'MT5'],
    maxLeverageRetail: 30,
  },
  standard: {
    swapLongPerLotEur: -6,
    avgExecutionMs: 45,
    depositNote: 'SEPA gratis · Carta 1.5% · Bonifici €15',
    platforms: ['MT4', 'MT5', 'WebTrader'],
    maxLeverageRetail: 30,
  },
  ecn: {
    swapLongPerLotEur: -5,
    avgExecutionMs: 25,
    depositNote: 'SEPA gratis · Carta 0-2% · Prelievi gratuiti',
    platforms: ['MT4', 'MT5', 'cTrader'],
    maxLeverageRetail: 30,
  },
  pro: {
    swapLongPerLotEur: -4,
    avgExecutionMs: 15,
    depositNote: 'Tutti i metodi gratuiti · Priority support',
    platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'],
    maxLeverageRetail: 30,
  },
};

/**
 * Risolve i campi qualitativi con fallback ai default per tier.
 */
export function getBrokerQualitative(account: BrokerAccount) {
  const defaults = TIER_DEFAULTS[account.tier];
  return {
    swapLongPerLotEur: account.swapLongPerLotEur ?? defaults.swapLongPerLotEur,
    avgExecutionMs: account.avgExecutionMs ?? defaults.avgExecutionMs,
    depositNote: account.depositNote ?? defaults.depositNote,
    platforms: account.platforms ?? defaults.platforms,
    maxLeverageRetail: account.maxLeverageRetail ?? defaults.maxLeverageRetail,
  };
}
