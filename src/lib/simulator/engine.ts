// ============================================================
// SIMULATOR ENGINE v5.0
//
// CHANGES v5.0 (refactor direzione/overnight/regime):
//   RIMOSSO direction     — serviva solo per overnight, ora fuori dal motore
//   RIMOSSO volatilityRegime dall'input — fisso a NORMAL internamente
//   RIMOSSO calcOvernightEUR — swap esposti come swapInfo (dato informativo)
//   RIMOSSO overnightEUR/Bps da CostBreakdown e SimulatorResult
//   FIX(🔴) calcProfessionalLots floating point — Math.round + toFixed(2)
//   FIX(🔴) adjustedLots floating point — stesso fix ramo margin clamp
//   FIX(🔴) isIntraday = nDaysOpen === 0 (1 notte ≠ intraday)
//   ADD swapInfo su SimulatorResult — long/short pips/day, lastUpdated
//   ADD riskPct obbligatorio su EngineInput
//   ADD tradesPerMonth su EngineInput
//   RENAME nDaysOpen → avgHoldingDays per chiarezza semantica
//
// CHANGES v4.3 (preserved):
//   add: brokerMeta su SimulatorResult
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId, Underlying } from '@/data/simulator/underlyings';
import type { InstrumentOffer, SwapInfo } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

// ── Constants ──────────────────────────────────────────────────────────────
const LOT_SIZE              = 100_000;
const SCORE_HALF_LIFE       = 40;   // v5.0: era 20 — curva troppo aggressiva per retail
const k                     = Math.LN2 / SCORE_HALF_LIFE;
const FUTURES_CAPITAL_RATIO = 0.20;

// ── Volatility regime — INTERNO, non esposto come input ───────────────────
// Retail non conosce il regime corrente. Fissiamo NORMAL come assunzione
// conservativa per le stime di spread e slippage.
type VolatilityRegime = 'LOW' | 'NORMAL' | 'HIGH';
const DEFAULT_REGIME: VolatilityRegime = 'NORMAL';

// ── FX rates → EUR (static v4.2 — snapshot aprile 2026, pivot via EUR) ────
const FX_RATE_TO_EUR: Record<string, number> = {
  EUR: 1.00,
  USD: 0.92,
  GBP: 1.17,
  JPY: 0.0062,
  CHF: 1.04,
  AUD: 0.59,
  CAD: 0.67,
  NZD: 0.55,
  TRY: 0.028,
  MXN: 0.046,
  ZAR: 0.048,
  SGD: 0.68,
  HKD: 0.118,
};

function fxRate(from: string, to: string): number {
  if (from === to) return 1;
  const fromEUR = FX_RATE_TO_EUR[from] ?? 1;
  const toEUR   = FX_RATE_TO_EUR[to]   ?? 1;
  return fromEUR / toEUR;
}

function pipValue(quoteCurrency: string, accountCurrency = 'EUR'): number {
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  return pipSize * LOT_SIZE * fxRate(quoteCurrency, accountCurrency);
}

// ── ESMA leverage cap ──────────────────────────────────────────────────────
const ESMA_LEVERAGE: Record<string, number> = {
  ug_fx_major:            30,
  ug_fx_minor:            20,
  ug_fx_exotic:           20,
  ug_crypto_major:         2,
  ug_indices_eu:          20,
  ug_indices_us:          20,
  ug_equity_us:            5,
  ug_equity_eu:            5,
  ug_commodities_energy:  10,
  ug_commodities_metals:  10,
};

const FUTURES_PARAMS: Record<'micro' | 'mini' | 'full', {
  nominalEUR:    number;
  marginEUR:     number;
  tickValueUSD:  number;
  ticksInSpread: number;
}> = {
  micro: { nominalEUR: 12_500,  marginEUR: 250,    tickValueUSD: 1.25,  ticksInSpread: 1 },
  mini:  { nominalEUR: 62_500,  marginEUR: 1_250,  tickValueUSD: 6.25,  ticksInSpread: 1 },
  full:  { nominalEUR: 125_000, marginEUR: 2_500,  tickValueUSD: 12.50, ticksInSpread: 1 },
};

// ── Range type ─────────────────────────────────────────────────────────────
export type Range = {
  best:     number;
  expected: number;
  worst:    number;
};

function toRange(v: number): Range {
  return { best: v, expected: v, worst: v };
}

function sumRange(ranges: Range[]): Range {
  return ranges.reduce(
    (acc, r) => ({ best: acc.best + r.best, expected: acc.expected + r.expected, worst: acc.worst + r.worst }),
    { best: 0, expected: 0, worst: 0 },
  );
}

function spreadToRange(v: number, regime: VolatilityRegime): Range {
  const worstMult = regime === 'HIGH' ? 3.5 : regime === 'NORMAL' ? 2.0 : 1.4;
  return { best: v * 0.7, expected: v, worst: v * worstMult };
}

// ── Slippage ───────────────────────────────────────────────────────────────
const SLIPPAGE_BASE_PIPS: Record<string, Record<VolatilityRegime, number>> = {
  tier1:   { LOW: 0.05, NORMAL: 0.15, HIGH: 0.50 },
  tier2:   { LOW: 0.15, NORMAL: 0.35, HIGH: 1.20 },
  tier3:   { LOW: 0.40, NORMAL: 0.80, HIGH: 2.50 },
  default: { LOW: 0.20, NORMAL: 0.40, HIGH: 1.40 },
};

function calcSlippageRange(
  lots:          number,
  pipVal:        number,
  liquidityTier: string,
  regime:        VolatilityRegime,
): Range {
  const tierKey      = SLIPPAGE_BASE_PIPS[liquidityTier] ? liquidityTier : 'default';
  const basePips     = SLIPPAGE_BASE_PIPS[tierKey]![regime]!;
  const volumeFactor = lots > 5 ? 1.2 : 1.0;
  const expected     = basePips * 2 * pipVal * lots * volumeFactor;
  return { best: expected * 0.4, expected, worst: expected * 2.2 };
}

// ── Commission tiering ─────────────────────────────────────────────────────
function commissionTierMultiplier(monthlyNotionalEUR: number): number {
  if (monthlyNotionalEUR >= 200_000_000) return 0.50;
  if (monthlyNotionalEUR >=  50_000_000) return 0.70;
  if (monthlyNotionalEUR >=  10_000_000) return 0.85;
  return 1.00;
}

// ── ESMA leverage helpers ──────────────────────────────────────────────────
function esmaLeverageForOffer(offer: InstrumentOffer): number {
  const leverages = offer.ugIds.map(ug => ESMA_LEVERAGE[ug] ?? 1);
  return Math.max(...leverages);
}

function toBps(eur: number, reference: number): number {
  return reference > 0 ? (eur / reference) * 10_000 : 0;
}

// ── Position sizing ────────────────────────────────────────────────────────
// FIX v5.0:
//   - Math.round invece di Math.floor per evitare floating point erosion
//     (es. 0.2999... → Math.floor dava 2 invece di 3)
//   - toFixed(2) per normalizzare il risultato a 2 decimali
//   - Stesso fix nel ramo margin clamp (adjustedLots)
function calcProfessionalLots(params: {
  capital:         number;
  riskPct:         number;
  stopLossPips:    number;
  quoteCurrency:   string;
  accountCurrency: string;
  offer:           InstrumentOffer;
}): number {
  const { capital, riskPct, stopLossPips, quoteCurrency, accountCurrency, offer } = params;

  const riskEUR = capital * riskPct;
  const pipVal  = pipValue(quoteCurrency, accountCurrency);

  if (pipVal <= 0 || stopLossPips <= 0) return 0;

  const lotsRaw = riskEUR / (stopLossPips * pipVal);
  const minLots = offer.minLotSize ?? 0.01;

  if (lotsRaw < minLots) return 0;

  // Math.round — non floor — per evitare floating point erosion
  const steps    = Math.round(lotsRaw / minLots);
  const lotsStep = +(steps * minLots).toFixed(2);

  const esmaLev = esmaLeverageForOffer(offer);
  const maxLots = (capital * esmaLev) / LOT_SIZE;
  let lots      = Math.min(lotsStep, maxLots);

  const exposure     = lots * LOT_SIZE;
  const marginNeeded = (offer.marginRequirementPct / 100) * exposure;
  if (marginNeeded > capital) {
    // Nel ramo margin clamp usiamo Math.floor — non vogliamo superare il margine disponibile
    const adjustedExp  = capital / (offer.marginRequirementPct / 100);
    const adjSteps     = Math.floor((adjustedExp / LOT_SIZE) / minLots);
    const adjustedLots = +(adjSteps * minLots).toFixed(2);
    if (adjustedLots < minLots) return 0;
    lots = adjustedLots;
  }

  return lots;
}

// ── Spread → EUR ──────────────────────────────────────────────────────────
function calcSpreadEUR(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
  exposure:     number,
): number {
  const overrides = underlyingId ? offer.underlyingOverrides?.[underlyingId] : undefined;
  const spreadBps = overrides?.spreadAvgBps ?? offer.spreadAvgBps;
  return (spreadBps / 10_000) * exposure;
}

// ── SwapInfo builder — dato informativo, non entra nel totale ──────────────
function buildSwapInfo(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
): SwapInfo | null {
  const overrides = underlyingId ? offer.underlyingOverrides?.[underlyingId] : undefined;

  const longPips  = overrides?.swapLongPipsPerDay  ?? offer.swapLongPipsPerDay;
  const shortPips = overrides?.swapShortPipsPerDay ?? offer.swapShortPipsPerDay;

  // Se non abbiamo nessun dato swap, non esponiamo nulla
  if (longPips == null && shortPips == null) return null;

  return {
    longPipsPerDay:  longPips  ?? null,
    shortPipsPerDay: shortPips ?? null,
    lastUpdated:     offer.swapLastUpdated ?? null,
  };
}

// ── CostBreakdown ─────────────────────────────────────────────────────────
// NOTA v5.0: overnight rimosso — non entra più nel calcolo del motore.
// I dati swap sono esposti separatamente come SwapInfo su SimulatorResult.
export type CostBreakdown = {
  spreadEUR:      number;
  commissionEUR:  number;
  slippageEUR:    number;
  exchangeFeeEUR: number;
  rollEUR:        number;
  totalEUR:       number;
  spreadBps:      number;
  commissionBps:  number;
  slippageBps:    number;
  exchangeFeeBps: number;
  rollBps:        number;
  totalBps:       number;
  range: {
    spread:     Range;
    commission: Range;
    slippage:   Range;
    total:      Range;
  };
};

// ── Feasibility ───────────────────────────────────────────────────────────
export type Feasibility = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';

export type FeasibilityDetail = {
  access:           boolean;
  canTrade:         boolean;
  sustainable:      boolean;
  label:            Feasibility;
  marginRequired:   number;
  riskPerTradePct:  number;
};

function calcFeasibility(
  offer:           InstrumentOffer,
  exposure:        number,
  capital:         number,
  lots:            number,
  totalCostBps:    number,
  riskPerTradePct: number,
): FeasibilityDetail {
  const marginRequired = (offer.marginRequirementPct / 100) * exposure;
  const access         = offer.minPositionEUR <= exposure;
  const canTrade       = capital >= marginRequired;
  const costRatio      = totalCostBps / 10_000;
  const sustainable    = riskPerTradePct < 0.02 && costRatio < 0.005;
  void lots;

  let label: Feasibility;
  if (!access || !canTrade || lots <= 0) label = 'INFEASIBLE';
  else if (!sustainable)                  label = 'WARNING';
  else if (totalCostBps < 15)             label = 'OPTIMAL';
  else if (totalCostBps < 40)             label = 'FEASIBLE';
  else                                    label = 'WARNING';

  return { access, canTrade, sustainable, label, marginRequired, riskPerTradePct };
}

function calcScore(totalCostBps: number): number {
  return Math.max(1, Math.round(100 * Math.exp(-k * totalCostBps)));
}

// ── CFD / Spot FX cost calculator ─────────────────────────────────────────
function calcFxCosts(params: {
  offer:           InstrumentOffer;
  underlying:      Underlying | undefined;
  exposure:        number;
  lots:            number;
  monthlyNotional: number;
  quoteCurrency:   string;
  accountCurrency: string;
}): CostBreakdown {
  const { offer, underlying, exposure, lots, monthlyNotional, quoteCurrency, accountCurrency } = params;

  const pipVal        = pipValue(quoteCurrency, accountCurrency);
  const liquidityTier = underlying?.liquidityTier ?? 'tier2';
  const regime        = DEFAULT_REGIME;

  const spreadBase  = calcSpreadEUR(offer, underlying?.id, exposure);
  const spreadR     = spreadToRange(spreadBase, regime);

  const tierMult = commissionTierMultiplier(monthlyNotional);
  let commBase = 0;
  if (offer.commissionPerLotEUR != null) {
    commBase = offer.commissionPerLotEUR * lots * tierMult;
  } else if (offer.commissionPerLotUSD != null) {
    commBase = offer.commissionPerLotUSD * fxRate('USD', accountCurrency) * lots * tierMult;
  }
  // Applica minimo per trade se definito
  if (offer.commissionMinPerTradeEUR != null) {
    commBase = Math.max(commBase, offer.commissionMinPerTradeEUR);
  }
  const commissionR = toRange(commBase);

  const slippageR = calcSlippageRange(lots, pipVal, liquidityTier, regime);

  // Overnight NON incluso — vedi swapInfo su SimulatorResult
  const totalR   = sumRange([spreadR, commissionR, slippageR]);
  const totalEUR = totalR.expected;

  return {
    spreadEUR:      spreadR.expected,
    commissionEUR:  commissionR.expected,
    slippageEUR:    slippageR.expected,
    exchangeFeeEUR: 0,
    rollEUR:        0,
    totalEUR,
    spreadBps:      toBps(spreadR.expected,     exposure),
    commissionBps:  toBps(commissionR.expected, exposure),
    slippageBps:    toBps(slippageR.expected,   exposure),
    exchangeFeeBps: 0,
    rollBps:        0,
    totalBps:       toBps(totalEUR,             exposure),
    range: { spread: spreadR, commission: commissionR, slippage: slippageR, total: totalR },
  };
}

// ── Futures cost calculator ───────────────────────────────────────────────
function calcFuturesCosts(
  offer:           InstrumentOffer,
  capital:         number,
  avgHoldingDays:  number,
  accountCurrency: string,
): { breakdown: CostBreakdown; contracts: number; contractSize: 'micro' | 'mini' | 'full' | null } {
  const usableCapital = capital * FUTURES_CAPITAL_RATIO;
  const regime        = DEFAULT_REGIME;

  const sizes = (['full', 'mini', 'micro'] as const).filter(sz =>
    (offer.availableContractSizes?.includes(sz) ?? false) &&
    usableCapital >= FUTURES_PARAMS[sz].marginEUR,
  );

  const empty = (): CostBreakdown => ({
    spreadEUR: 0, commissionEUR: 0, slippageEUR: 0,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR: 0,
    spreadBps: 0, commissionBps: 0, slippageBps: 0,
    exchangeFeeBps: 0, rollBps: 0, totalBps: 0,
    range: { spread: toRange(0), commission: toRange(0), slippage: toRange(0), total: toRange(0) },
  });

  if (sizes.length === 0) return { contracts: 0, contractSize: null, breakdown: empty() };

  const selectedSize = sizes[0]!;
  const fp           = FUTURES_PARAMS[selectedSize];
  const contracts    = Math.max(1, Math.floor(usableCapital / fp.marginEUR));
  const nominalEUR   = contracts * fp.nominalEUR;

  const fxUSD      = fxRate('USD', accountCurrency);
  const spreadBase = contracts * fp.tickValueUSD * fp.ticksInSpread * fxUSD;
  const spreadR    = spreadToRange(spreadBase, regime);

  let commBase = 0;
  if (offer.commissionPerContractEUR != null) {
    commBase = offer.commissionPerContractEUR * contracts;
  } else if (offer.commissionPerContractUSD != null) {
    commBase = offer.commissionPerContractUSD * contracts * fxUSD;
  }
  const commissionR = toRange(commBase);

  let exchangeFeeBase = 0;
  if (offer.exchangeFeePerContractEUR != null) {
    exchangeFeeBase = offer.exchangeFeePerContractEUR * contracts;
  } else if (offer.exchangeFeePerContractUSD != null) {
    exchangeFeeBase = offer.exchangeFeePerContractUSD * contracts * fxUSD;
  }

  let rollBase = 0;
  if (offer.rollSpreadBps != null && offer.rollFrequencyDays != null && avgHoldingDays > offer.rollFrequencyDays) {
    const rolls = Math.floor(avgHoldingDays / offer.rollFrequencyDays);
    rollBase    = (offer.rollSpreadBps / 10_000) * nominalEUR * rolls;
  }

  const futuresSlippagePips = regime === 'HIGH' ? 2 : regime === 'NORMAL' ? 1 : 0.5;
  const slippageBase = futuresSlippagePips * fp.tickValueUSD * fxUSD * contracts;
  const slippageR    = { best: slippageBase * 0.4, expected: slippageBase, worst: slippageBase * 2.5 };

  const totalR = sumRange([spreadR, commissionR, toRange(exchangeFeeBase), toRange(rollBase), slippageR]);

  return {
    contracts,
    contractSize: selectedSize,
    breakdown: {
      spreadEUR:      spreadR.expected,
      commissionEUR:  commissionR.expected,
      slippageEUR:    slippageR.expected,
      exchangeFeeEUR: exchangeFeeBase,
      rollEUR:        rollBase,
      totalEUR:       totalR.expected,
      spreadBps:      toBps(spreadR.expected,     nominalEUR),
      commissionBps:  toBps(commissionR.expected, nominalEUR),
      slippageBps:    toBps(slippageR.expected,   nominalEUR),
      exchangeFeeBps: toBps(exchangeFeeBase,       nominalEUR),
      rollBps:        toBps(rollBase,              nominalEUR),
      totalBps:       toBps(totalR.expected,       nominalEUR),
      range: { spread: spreadR, commission: commissionR, slippage: slippageR, total: totalR },
    },
  };
}

// ── Public types ──────────────────────────────────────────────────────────
export type EngineInput = {
  capital:         number;
  riskPct:         number;        // es. 0.01 = 1% — obbligatorio, no default nascosto
  underlyingId:    UnderlyingId;
  assetClass:      AssetClass;
  stopLossPips:    number;
  tradesPerMonth:  number;
  avgHoldingDays:  number;        // 0 = intraday, 1+ = notti (solo per nota UI swap)
  accountCurrency?: string;       // default 'EUR'
};

export type BrokerMeta = {
  website:       string;
  affiliateUrl:  string | null;
  isAffiliate:   boolean;
  esmaRiskPct:   number | null;
  esmaLegalName: string | null;
};

export type SimulatorResult = {
  id:                 string;
  instrumentName:     string;
  brokerName:         string;
  accountTypeName:    string;
  score:              number;
  feasibility:        Feasibility;
  feasibilityDetail:  FeasibilityDetail;
  costBreakdown:      CostBreakdown;
  lots:               number;
  contracts:          number;
  contractSize:       'micro' | 'mini' | 'full' | null;
  costPerTradeEUR:    number;
  monthlyCostEUR:     number;     // costPerTradeEUR × tradesPerMonth
  spreadCostBps:      number;
  commissionCostBps:  number;
  slippageCostBps:    number;
  totalCostBps:       number;
  spreadCost:         number;
  commissionCost:     number;
  slippageCost:       number;
  achievableExposure: number;
  costRange: {
    perTrade: Range;
  };
  /** Dato informativo swap — NON influenza score/ranking */
  swapInfo:           SwapInfo | null;
  /** v4.3: broker metadata per card rendering */
  brokerMeta:         BrokerMeta;
};

// ── UG → AssetClass mapping ───────────────────────────────────────────────
function ugIdsForAssetClass(ac: AssetClass): string[] {
  switch (ac) {
    case 'FOREX':     return ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'];
    case 'CRYPTO':    return ['ug_crypto_major'];
    case 'INDEX':     return ['ug_indices_eu', 'ug_indices_us'];
    case 'EQUITY':    return ['ug_equity_us', 'ug_equity_eu'];
    case 'COMMODITY': return ['ug_commodities_energy', 'ug_commodities_metals'];
    default:          return [];
  }
}

// ── Main engine ───────────────────────────────────────────────────────────
export function runEngine({
  capital,
  riskPct,
  underlyingId,
  assetClass,
  stopLossPips,
  tradesPerMonth,
  avgHoldingDays,
  accountCurrency = 'EUR',
}: EngineInput): SimulatorResult[] {
  if (capital <= 0) return [];

  const underlying = UNDERLYINGS[underlyingId];
  const quoteCcy   = underlying?.quoteCurrency ?? 'USD';

  // avgHoldingDays === 0 → intraday — usato solo per la nota UI swap,
  // NON cambia i calcoli di costo (overnight rimosso dal motore)
  const hasOvernight = avgHoldingDays > 0;
  void hasOvernight; // esposto in UI tramite SimulatorResult.avgHoldingDays

  const ugIds            = ugIdsForAssetClass(assetClass);
  const compatibleOffers = INSTRUMENT_OFFERS.filter(offer =>
    offer.ugIds.some(ug => ugIds.includes(ug)),
  );
  if (compatibleOffers.length === 0) return [];

  const results: SimulatorResult[] = compatibleOffers.flatMap(offer => {
    const broker    = BROKERS[offer.brokerId];
    const isFutures = offer.instrumentTypeId === 'futures_std';

    let breakdown:    CostBreakdown;
    let contracts     = 0;
    let contractSize: 'micro' | 'mini' | 'full' | null = null;
    let lots          = 0;
    let exposure      = 0;

    if (isFutures) {
      const res    = calcFuturesCosts(offer, capital, avgHoldingDays, accountCurrency);
      breakdown    = res.breakdown;
      contracts    = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return [];
      exposure = contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR;

    } else {
      lots = calcProfessionalLots({
        capital,
        riskPct,
        stopLossPips,
        quoteCurrency:   quoteCcy,
        accountCurrency,
        offer,
      });
      if (lots <= 0) return [];

      exposure = lots * LOT_SIZE;
      if (offer.minPositionEUR > exposure) return [];

      const estMonthlyNotional = exposure * tradesPerMonth;

      breakdown = calcFxCosts({
        offer,
        underlying,
        exposure,
        lots,
        monthlyNotional: estMonthlyNotional,
        quoteCurrency:   quoteCcy,
        accountCurrency,
      });
    }

    const pipVal          = pipValue(quoteCcy, accountCurrency);
    const riskPerTradePct = lots > 0
      ? (stopLossPips * pipVal * lots) / capital
      : 0;

    const totalCostBps    = breakdown.totalBps;
    const feasDetail      = calcFeasibility(offer, exposure, capital, lots, totalCostBps, riskPerTradePct);
    const score           = calcScore(totalCostBps);
    const costPerTradeEUR = breakdown.totalEUR;
    const monthlyCostEUR  = costPerTradeEUR * tradesPerMonth;

    const swapInfo = buildSwapInfo(offer, underlyingId);

    const brokerMeta: BrokerMeta = {
      website:       broker?.website       ?? '#',
      affiliateUrl:  broker?.affiliateUrl  ?? null,
      isAffiliate:   broker?.isAffiliate   ?? false,
      esmaRiskPct:   broker?.esmaRiskPct   ?? null,
      esmaLegalName: broker?.esmaLegalName ?? null,
    };

    return [{
      id:                `${offer.brokerId}_${offer.accountTypeId}_${offer.instrumentTypeId}`,
      instrumentName:    offer.instrumentTypeId,
      brokerName:        broker?.name ?? offer.brokerId,
      accountTypeName:   offer.accountTypeId,
      score,
      feasibility:       feasDetail.label,
      feasibilityDetail: feasDetail,
      costBreakdown:     breakdown,
      lots,
      contracts,
      contractSize,
      costPerTradeEUR,
      monthlyCostEUR,
      spreadCostBps:     breakdown.spreadBps,
      commissionCostBps: breakdown.commissionBps,
      slippageCostBps:   breakdown.slippageBps,
      totalCostBps,
      spreadCost:        breakdown.spreadEUR,
      commissionCost:    breakdown.commissionEUR,
      slippageCost:      breakdown.slippageEUR,
      achievableExposure: exposure,
      costRange: { perTrade: breakdown.range.total },
      swapInfo,
      brokerMeta,
    }] satisfies SimulatorResult[];
  });

  return results.sort((a, b) => a.costRange.perTrade.expected - b.costRange.perTrade.expected);
}
