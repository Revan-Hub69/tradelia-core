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
  /** Broker markup sullo swap interbank (€/lot/notte, positivo). Peggiora sia long sia short. */
  swapMarkupPerLotEur?: number;
  /** Average execution latency (ms) in normal conditions. */
  avgExecutionMs?: number;
  /** Deposit/withdrawal notes (short summary). */
  depositNote?: string;
  /** Trading platforms supported. */
  platforms?: string[];
  /** Max leverage for retail (ESMA) */
  maxLeverageRetail?: number;
  /** True se il broker è partner affiliato Tradelia (riceviamo commissioni). */
  isAffiliate?: boolean;
  /** % conti retail in perdita (disclaimer ESMA dichiarato dal broker). */
  esmaLossRatePct?: number;
  /** URL di apertura conto (eventualmente con tracking affiliate). */
  signupUrl?: string;
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
    isAffiliate: true,
    esmaLossRatePct: 73.06,
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
    isAffiliate: true,
    esmaLossRatePct: 71.40,
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
    isAffiliate: true,
    esmaLossRatePct: 77.50,
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
    isAffiliate: true,
    esmaLossRatePct: 73.50,
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
    isAffiliate: true,
    esmaLossRatePct: 75.30,
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
    isAffiliate: false,
    esmaLossRatePct: 78.00,
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
    isAffiliate: true,
    esmaLossRatePct: 76.60,
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
    isAffiliate: true,
    esmaLossRatePct: 70.64,
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
    isAffiliate: true,
    esmaLossRatePct: 75.30,
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
    isAffiliate: true,
    esmaLossRatePct: 72.10,
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
    isAffiliate: true,
    esmaLossRatePct: 70.64,
  },
];

export const BROKER_TIERS: { id: BrokerTier; label: string; range: string }[] = [
  { id: 'cent', label: 'Cent', range: '€5 – €100' },
  { id: 'starter', label: 'Starter', range: '€10 – €500' },
  { id: 'standard', label: 'Standard', range: '€0 – €2.500' },
  { id: 'ecn', label: 'ECN', range: '€100 – €10k' },
  { id: 'pro', label: 'Pro', range: '€10k+' },
];

export type CostContext = {
  lotSize: number;
  tradesPerMonth: number;
  /** Giorni medi di esposizione overnight al mese (0-25). 0 = intraday (nessun swap). */
  exposureDaysPerMonth?: number;
};

/**
 * Calcola costo mensile totale per un account broker.
 * pipValue = €10 per standard lot a EUR/USD (semplificazione).
 *
 * Se exposureDaysPerMonth > 0: aggiunge il solo **markup broker** × lot × giorni.
 * L'interbank swap rate (identico per tutti i broker) non entra nel ranking perché
 * non è una componente broker-specifica. Il markup è l'unica variabile discriminante.
 */
export function estimateMonthlyCost(
  account: BrokerAccount,
  ctx: CostContext,
): number {
  const { lotSize, tradesPerMonth, exposureDaysPerMonth = 0 } = ctx;
  const pipValuePerLot = 10;
  const spreadCostPerTrade = account.spreadEurUsdPip * pipValuePerLot * lotSize;
  const commissionCostPerTrade = account.commissionPerLotEur * lotSize;
  const tradingCost = (spreadCostPerTrade + commissionCostPerTrade) * tradesPerMonth;
  let swapCost = 0;
  if (exposureDaysPerMonth > 0) {
    const qual = getBrokerQualitative(account);
    swapCost = qual.swapMarkupPerLotEur * lotSize * exposureDaysPerMonth;
  }
  return tradingCost + swapCost;
}

/**
 * Breakdown dettagliato del costo calcolato (componenti incluse nel motore).
 */
export function computeCostBreakdown(
  account: BrokerAccount,
  ctx: CostContext,
) {
  const { lotSize, tradesPerMonth, exposureDaysPerMonth = 0 } = ctx;
  const pipValuePerLot = 10;
  const spreadPerTrade = account.spreadEurUsdPip * pipValuePerLot * lotSize;
  const commissionPerTrade = account.commissionPerLotEur * lotSize;
  const qual = getBrokerQualitative(account);
  const swapMarkupPerLotNight = exposureDaysPerMonth > 0 ? qual.swapMarkupPerLotEur : 0;
  const swapPerMonth = swapMarkupPerLotNight * lotSize * exposureDaysPerMonth;
  return {
    spreadPerTrade: Number(spreadPerTrade.toFixed(2)),
    commissionPerTrade: Number(commissionPerTrade.toFixed(2)),
    spreadPerMonth: Number((spreadPerTrade * tradesPerMonth).toFixed(2)),
    commissionPerMonth: Number((commissionPerTrade * tradesPerMonth).toFixed(2)),
    swapPerMonth: Number(swapPerMonth.toFixed(2)),
    /** Markup broker €/lot/notte (0 se intraday). È la metrica di discriminazione del ranking swap. */
    swapMarkupPerLotNight: Number(swapMarkupPerLotNight.toFixed(2)),
  };
}

/**
 * Default qualitativi per tier (usati quando il singolo broker non li dichiara).
 * Indicativi — non entrano nel calcolo costo mensile.
 */
const TIER_DEFAULTS: Record<BrokerTier, {
  swapMarkupPerLotEur: number;
  avgExecutionMs: number;
  depositNote: string;
  platforms: string[];
  maxLeverageRetail: number;
}> = {
  cent: {
    swapMarkupPerLotEur: 2.0,
    avgExecutionMs: 80,
    depositNote: 'Carte, e-wallet, SEPA gratis',
    platforms: ['MT4', 'MT5'],
    maxLeverageRetail: 30,
  },
  starter: {
    swapMarkupPerLotEur: 1.8,
    avgExecutionMs: 60,
    depositNote: 'Carte, e-wallet, SEPA gratis',
    platforms: ['MT4', 'MT5'],
    maxLeverageRetail: 30,
  },
  standard: {
    swapMarkupPerLotEur: 1.5,
    avgExecutionMs: 45,
    depositNote: 'SEPA gratis · Carta 1.5% · Bonifici €15',
    platforms: ['MT4', 'MT5', 'WebTrader'],
    maxLeverageRetail: 30,
  },
  ecn: {
    swapMarkupPerLotEur: 0.8,
    avgExecutionMs: 25,
    depositNote: 'SEPA gratis · Carta 0-2% · Prelievi gratuiti',
    platforms: ['MT4', 'MT5', 'cTrader'],
    maxLeverageRetail: 30,
  },
  pro: {
    swapMarkupPerLotEur: 0.5,
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
    swapMarkupPerLotEur: account.swapMarkupPerLotEur ?? defaults.swapMarkupPerLotEur,
    avgExecutionMs: account.avgExecutionMs ?? defaults.avgExecutionMs,
    depositNote: account.depositNote ?? defaults.depositNote,
    platforms: account.platforms ?? defaults.platforms,
    maxLeverageRetail: account.maxLeverageRetail ?? defaults.maxLeverageRetail,
  };
}
