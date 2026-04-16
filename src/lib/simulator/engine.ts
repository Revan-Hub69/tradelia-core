// ============================================================
// SIMULATOR ENGINE v6.0
//
// CHANGES v6.0 (input model SOTA):
//   RIMOSSO stopLossPips   — sizing ora esterno (sizing.ts)
//   RIMOSSO riskPct        — sizing ora esterno (sizing.ts)
//   RIMOSSO avgHoldingDays — swap fuori dal motore (output only)
//   RIMOSSO calcProfessionalLots — responsabilità di sizing.ts
//   ADD lotSize su EngineInput  — lotti già calcolati, clampati ESMA
//
// INVARIATO da v5.0:
//   - swap fuori dal calcolo → swapInfo su SimulatorResult
//   - regime fisso NORMAL interno
//   - Range (best/expected/worst) su tutti i costi
//   - brokerMeta su SimulatorResult
//   - commission tiering su volume mensile
//   - slippage model per liquidityTier
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId, Underlying } from '@/data/simulator/underlyings';
import type { InstrumentOffer, SwapInfo } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

// ── Constants ──────────────────────────────────────────────────────────────
const LOT_SIZE        = 100_000;
const SCORE_HALF_LIFE = 40;
const k               = Math.LN2 / SCORE_HALF_LIFE;

// ── Volatility regime — INTERNO, non esposto ──────────────────────────────
type VolatilityRegime = 'LOW' | 'NORMAL' | 'HIGH';
const DEFAULT_REGIME: VolatilityRegime = 'NORMAL';

// ── FX rates → EUR (snapshot aprile 2026) ─────────────────────────────────
const FX_RATE_TO_EUR: Record<string, number> = {
  EUR: 1.00, USD: 0.92, GBP: 1.17, JPY: 0.0062,
  CHF: 1.04, AUD: 0.59, CAD: 0.67, NZD: 0.55,
  TRY: 0.028, MXN: 0.046, ZAR: 0.048, SGD: 0.68, HKD: 0.118,
};

function fxRate(from: string, to: string): number {
  if (from === to) return 1;
  return (FX_RATE_TO_EUR[from] ?? 1) / (FX_RATE_TO_EUR[to] ?? 1);
}

// ── Pip value per lot (dynamic based on size) ──────────────────────────
function pipValue(lots: number, quoteCurrency: string, accountCurrency = 'EUR'): number {
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  const actualSize = lots * LOT_SIZE;
  return pipSize * actualSize * fxRate(quoteCurrency, accountCurrency);
}

// ── Simplified pip value for display (standard lot) ────────────────────────
function displayPipValue(quoteCurrency: string, accountCurrency = 'EUR'): number {
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  return pipSize * LOT_SIZE * fxRate(quoteCurrency, accountCurrency);
}

// ── ESMA leverage cap ──────────────────────────────────────────────────────
const ESMA_LEVERAGE: Record<string, number> = {
  ug_fx_major: 30, ug_fx_minor: 20, ug_fx_exotic: 20,
  ug_crypto_major: 2,
  ug_indices_eu: 20, ug_indices_us: 20,
  ug_equity_us: 5, ug_equity_eu: 5,
  ug_commodities_energy: 10, ug_commodities_metals: 10,
};

const FUTURES_PARAMS: Record<'micro' | 'mini' | 'full', {
  nominalEUR: number; marginEUR: number; tickValueUSD: number; ticksInSpread: number;
}> = {
  micro: { nominalEUR: 12_500,  marginEUR: 250,   tickValueUSD: 1.25,  ticksInSpread: 1 },
  mini:  { nominalEUR: 62_500,  marginEUR: 1_250, tickValueUSD: 6.25,  ticksInSpread: 1 },
  full:  { nominalEUR: 125_000, marginEUR: 2_500, tickValueUSD: 12.50, ticksInSpread: 1 },
};

// ── Range type ─────────────────────────────────────────────────────────────
export type Range = { best: number; expected: number; worst: number; };

function toRange(v: number): Range { return { best: v, expected: v, worst: v }; }

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
  lots: number, pipVal: number, liquidityTier: string, regime: VolatilityRegime,
): Range {
  const tierKey  = SLIPPAGE_BASE_PIPS[liquidityTier] ? liquidityTier : 'default';
  const basePips = SLIPPAGE_BASE_PIPS[tierKey]![regime]!;
  const volumeFactor = lots > 5 ? 1.2 : 1.0;
  const expected = basePips * 2 * pipVal * lots * volumeFactor;
  return { best: expected * 0.4, expected, worst: expected * 2.2 };
}

// ── Commission tiering ─────────────────────────────────────────────────────
function commissionTierMultiplier(monthlyNotionalEUR: number): number {
  if (monthlyNotionalEUR >= 200_000_000) return 0.50;
  if (monthlyNotionalEUR >=  50_000_000) return 0.70;
  if (monthlyNotionalEUR >=  10_000_000) return 0.85;
  return 1.00;
}

function toBps(eur: number, reference: number): number {
  return reference > 0 ? (eur / reference) * 10_000 : 0;
}

// ── Spread → EUR ──────────────────────────────────────────────────────────
function calcSpreadEUR(
  offer: InstrumentOffer, underlyingId: UnderlyingId | undefined, exposure: number,
): number {
  const overrides  = underlyingId ? offer.underlyingOverrides?.[underlyingId] : undefined;
  const spreadBps  = overrides?.spreadAvgBps ?? offer.spreadAvgBps;
  return (spreadBps / 10_000) * exposure;
}

// ── SwapInfo builder ──────────────────────────────────────────────────────
function buildSwapInfo(
  offer: InstrumentOffer, underlyingId: UnderlyingId | undefined,
): SwapInfo | null {
  const overrides   = underlyingId ? offer.underlyingOverrides?.[underlyingId] : undefined;
  const longPips    = overrides?.swapLongPipsPerDay  ?? offer.swapLongPipsPerDay;
  const shortPips   = overrides?.swapShortPipsPerDay ?? offer.swapShortPipsPerDay;
  if (longPips == null && shortPips == null) return null;
  return { longPipsPerDay: longPips ?? null, shortPipsPerDay: shortPips ?? null, lastUpdated: offer.swapLastUpdated ?? null };
}

// ── CostBreakdown ─────────────────────────────────────────────────────────
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
  // Monthly aggregated costs
  monthlyCostEUR: number;
  monthlyTrades: number;
};

// ── Feasibility ───────────────────────────────────────────────────────────
export type Feasibility       = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';
export type FeasibilityDetail = {
  access:          boolean;
  canTrade:        boolean;
  sustainable:     boolean;
  label:           Feasibility;
  marginRequired:  number;
  exposurePctCapital: number;
};

function calcFeasibility(
  offer:             InstrumentOffer,
  exposure:          number,
  capital:           number,
  lots:              number,
  totalCostBps:      number,
): FeasibilityDetail {
  const marginRequired    = (offer.marginRequirementPct / 100) * exposure;
  const access            = offer.minPositionEUR <= exposure;
  const canTrade          = capital >= marginRequired;
  const exposurePctCapital = exposure / capital;
  const costRatio         = totalCostBps / 10_000;
  const sustainable       = exposurePctCapital < 0.5 && costRatio < 0.005;
  void lots;

  let label: Feasibility;
  if (!access || !canTrade || lots <= 0) label = 'INFEASIBLE';
  else if (!sustainable)                  label = 'WARNING';
  else if (totalCostBps < 15)             label = 'OPTIMAL';
  else if (totalCostBps < 40)             label = 'FEASIBLE';
  else                                    label = 'WARNING';

  return { access, canTrade, sustainable, label, marginRequired, exposurePctCapital };
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
  tradesPerMonth:  number;
  slippageMode:    'ideal' | 'good' | 'realistic' | 'volatile';
}): CostBreakdown {
  const { offer, underlying, exposure, lots: totalLots, monthlyNotional, quoteCurrency, accountCurrency, tradesPerMonth, slippageMode } = params;
  
  // Pip value dynamically based on actual lot size (not just standard)
  const pipVal = pipValue(totalLots, quoteCurrency, accountCurrency);
  const liquidityTier = underlying?.liquidityTier ?? 'tier2';
  
  // Slippage: base latency + market stress multiplier
  const baseSlippagePips: Record<string, number> = { ideal: 0, good: 0.1, realistic: 0.3, volatile: 0.8 };
  const stressMultiplier: Record<string, number> = { ideal: 1, good: 1.2, realistic: 1.5, volatile: 2.5 };
  const slippagePips = baseSlippagePips[slippageMode] * stressMultiplier[slippageMode];

  // Spread: use avg by default for realism (not min marketing)
  const spreadType: 'min' | 'avg' = 'avg';
  const spreadPips = spreadType === 'min' ? (offer.spreadMinBps ?? 5) : (offer.spreadAvgBps ?? 10);
  const spreadR = spreadToRange((spreadPips / 10_000) * exposure, DEFAULT_REGIME);

  // Commission: use totalLots consistently + commission type (RT vs per_side)
  const commissionType = offer.commissionType ?? 'round_turn';
  const tierMult = commissionTierMultiplier(monthlyNotional);
  let commBase = 0;
  if (offer.commissionPerLotEUR != null) {
    commBase = offer.commissionPerLotEUR * totalLots * tierMult;
  } else if (offer.commissionPerLotUSD != null) {
    commBase = offer.commissionPerLotUSD * fxRate('USD', accountCurrency) * totalLots * tierMult;
  }
  // Min commission - CRITICAL for small accounts
  if (offer.commissionMinPerTradeEUR != null) {
    commBase = Math.max(commBase, offer.commissionMinPerTradeEUR);
  }
  // If per_side, double the commission (open + close)
  if (commissionType === 'per_side') {
    commBase = commBase * 2;
  }
  const commissionR = toRange(commBase);
  
  // Slippage based on mode selection
  const slippageBase = slippagePips * pipVal;
  const slippageR = toRange(slippageBase);
  const totalR = sumRange([spreadR, commissionR, slippageR]);
  const totalEUR = totalR.expected;

  // Monthly aggregated cost
  const monthlyCost = totalEUR * tradesPerMonth;

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
    monthlyCostEUR: monthlyCost,
    monthlyTrades: tradesPerMonth,
  };
}

// ── Futures cost calculator ───────────────────────────────────────────────
const FUTURES_CAPITAL_RATIO = 0.20;

function calcFuturesCosts(
  offer: InstrumentOffer, capital: number, accountCurrency: string,
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
  const fxUSD        = fxRate('USD', accountCurrency);

  const spreadBase  = contracts * fp.tickValueUSD * fp.ticksInSpread * fxUSD;
  const spreadR     = spreadToRange(spreadBase, regime);

  let commBase = 0;
  if (offer.commissionPerContractEUR != null) commBase = offer.commissionPerContractEUR * contracts;
  else if (offer.commissionPerContractUSD != null) commBase = offer.commissionPerContractUSD * contracts * fxUSD;
  const commissionR = toRange(commBase);

  let exchangeFeeBase = 0;
  if (offer.exchangeFeePerContractEUR != null) exchangeFeeBase = offer.exchangeFeePerContractEUR * contracts;
  else if (offer.exchangeFeePerContractUSD != null) exchangeFeeBase = offer.exchangeFeePerContractUSD * contracts * fxUSD;

  const futuresSlippagePips = regime === 'HIGH' ? 2 : 1;
  const slippageBase = futuresSlippagePips * fp.tickValueUSD * fxUSD * contracts;
  const slippageR    = { best: slippageBase * 0.4, expected: slippageBase, worst: slippageBase * 2.5 };

  const totalR = sumRange([spreadR, commissionR, toRange(exchangeFeeBase), slippageR]);

  return {
    contracts,
    contractSize: selectedSize,
    breakdown: {
      spreadEUR:      spreadR.expected,
      commissionEUR:  commissionR.expected,
      slippageEUR:    slippageR.expected,
      exchangeFeeEUR: exchangeFeeBase,
      rollEUR:        0,
      totalEUR:       totalR.expected,
      spreadBps:      toBps(spreadR.expected,     nominalEUR),
      commissionBps:  toBps(commissionR.expected, nominalEUR),
      slippageBps:    toBps(slippageR.expected,   nominalEUR),
      exchangeFeeBps: toBps(exchangeFeeBase,       nominalEUR),
      rollBps:        0,
      totalBps:       toBps(totalR.expected,       nominalEUR),
      range: { spread: spreadR, commission: commissionR, slippage: slippageR, total: totalR },
    },
  };
}

// ── Public types ──────────────────────────────────────────────────────────

/**
 * EngineInput v6 — pulito.
 * lotSize e tradesPerMonth sono già calcolati da sizing.ts.
 * L'engine non conosce come l'utente ha espresso la dimensione.
 */
export type EngineInput = {
  capital:          number;
  underlyingId:     UnderlyingId;
  assetClass:       AssetClass;
  /** Lotti già calcolati e clampati ESMA da sizing.ts */
  lotSize:          number;
  tradesPerMonth:   number;
  accountCurrency?: string;  // default 'EUR'
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
  monthlyCostEUR:     number;
  spreadCostBps:      number;
  commissionCostBps:  number;
  slippageCostBps:    number;
  totalCostBps:       number;
  spreadCost:         number;
  commissionCost:     number;
  slippageCost:       number;
  achievableExposure: number;
  costRange: { perTrade: Range; };
  /** Dato informativo swap — NON influenza score/ranking */
  swapInfo:           SwapInfo | null;
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
  underlyingId,
  assetClass,
  lotSize,
  tradesPerMonth,
  accountCurrency = 'EUR',
}: EngineInput): SimulatorResult[] {
  if (capital <= 0 || lotSize <= 0) return [];

  const underlying = UNDERLYINGS[underlyingId];
  const quoteCcy   = underlying?.quoteCurrency ?? 'USD';
  const ugIds      = ugIdsForAssetClass(assetClass);

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
      const res    = calcFuturesCosts(offer, capital, accountCurrency);
      breakdown    = res.breakdown;
      contracts    = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return [];
      exposure = contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR;
    } else {
      // Usa lotSize già calcolato da sizing.ts
      // Verifica minLot dell'offer
      const minLot = offer.minLotSize ?? 0.01;
      lots         = Math.max(lotSize, minLot);
      lots         = +(Math.round(lots / minLot) * minLot).toFixed(2);

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

    const totalCostBps   = breakdown.totalBps;
    const feasDetail     = calcFeasibility(offer, exposure, capital, lots, totalCostBps);
    const score          = calcScore(totalCostBps);
    const costPerTradeEUR = breakdown.totalEUR;
    const monthlyCostEUR  = costPerTradeEUR * tradesPerMonth;
    const swapInfo        = buildSwapInfo(offer, underlyingId);

    const brokerMeta: BrokerMeta = {
      website:       broker?.website       ?? '#',
      affiliateUrl:  broker?.affiliateUrl  ?? null,
      isAffiliate:   broker?.isAffiliate   ?? false,
      esmaRiskPct:   broker?.esmaRiskPct   ?? null,
      esmaLegalName: broker?.esmaLegalName ?? null,
    };

    return [{
      id:                 `${offer.brokerId}_${offer.accountTypeId}_${offer.instrumentTypeId}`,
      instrumentName:     offer.instrumentTypeId,
      brokerName:         broker?.name ?? offer.brokerId,
      accountTypeName:    offer.accountTypeId,
      score,
      feasibility:        feasDetail.label,
      feasibilityDetail:  feasDetail,
      costBreakdown:      breakdown,
      lots,
      contracts,
      contractSize,
      costPerTradeEUR,
      monthlyCostEUR,
      spreadCostBps:      breakdown.spreadBps,
      commissionCostBps:  breakdown.commissionBps,
      slippageCostBps:    breakdown.slippageBps,
      totalCostBps,
      spreadCost:         breakdown.spreadEUR,
      commissionCost:     breakdown.commissionEUR,
      slippageCost:       breakdown.slippageEUR,
      achievableExposure: exposure,
      costRange:          { perTrade: breakdown.range.total },
      swapInfo,
      brokerMeta,
    }] satisfies SimulatorResult[];
  });

  return results.sort((a, b) => a.costRange.perTrade.expected - b.costRange.perTrade.expected);
}
