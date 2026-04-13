// ============================================================
// SIMULATOR ENGINE v4.3
//
// CHANGES v4.3:
//   add: brokerMeta on SimulatorResult — exposes affiliate/esma fields
//        needed by ScoreCard for disclaimer + CTA rendering.
//        Fields: website, affiliateUrl, isAffiliate, esmaRiskPct, esmaLegalName
//
// CHANGES v4.2 (preserved):
//   fix(🔴): calcSpreadEUR — rimosso spreadPips (campo inesistente sul tipo).
//   fix(🔴): isIntraday — ora derivato da nDaysOpen <= 1
//   fix(🟠): estMonthlyNotional — ora passato esplicitamente dal caller
//   fix(🟡): minLotSize — letto da offer.minLotSize
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId, Underlying } from '@/data/simulator/underlyings';
import type { InstrumentOffer } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

// ── Constants ──────────────────────────────────────────────────────────────
const LOT_SIZE          = 100_000;
const SCORE_HALF_LIFE   = 20;
const k                 = Math.LN2 / SCORE_HALF_LIFE;
const DEFAULT_RISK_PCT  = 0.01;
const FUTURES_CAPITAL_RATIO = 0.20;

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
  micro: { nominalEUR: 12_500,  marginEUR: 250,   tickValueUSD: 1.25,  ticksInSpread: 1 },
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

function overnightToRange(v: number): Range {
  if (v >= 0) return { best: v * 1.2, expected: v, worst: v * 0.4 };
  return { best: v * 0.5, expected: v, worst: v * 1.8 };
}

// ── Volatility & slippage ──────────────────────────────────────────────────
export type VolatilityRegime = 'LOW' | 'NORMAL' | 'HIGH';

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
  const tierKey     = SLIPPAGE_BASE_PIPS[liquidityTier] ? liquidityTier : 'default';
  const basePips    = SLIPPAGE_BASE_PIPS[tierKey]![regime]!;
  const volumeFactor = lots > 5 ? 1.2 : 1.0;
  const expected    = basePips * 2 * pipVal * lots * volumeFactor;
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

  const lotsStep = Math.floor(lotsRaw / minLots) * minLots;

  const esmaLev = esmaLeverageForOffer(offer);
  const maxLots = (capital * esmaLev) / LOT_SIZE;
  let lots      = Math.min(lotsStep, maxLots);

  const exposure     = lots * LOT_SIZE;
  const marginNeeded = (offer.marginRequirementPct / 100) * exposure;
  if (marginNeeded > capital) {
    const adjustedExp  = capital / (offer.marginRequirementPct / 100);
    const adjustedLots = Math.floor((adjustedExp / LOT_SIZE) / minLots) * minLots;
    if (adjustedLots < minLots) return 0;
    lots = adjustedLots;
  }

  return lots;
}

// ── Overnight ─────────────────────────────────────────────────────────────
function calcOvernightEUR(
  offer:           InstrumentOffer,
  underlying:      Underlying | undefined,
  direction:       TradeDirection,
  holdingDays:     number,
  lots:            number,
  quoteCurrency:   string,
  accountCurrency: string,
): number {
  if (holdingDays === 0 || !underlying) return 0;

  const overrides = offer.underlyingOverrides?.[underlying.id];

  const pipsPerDay = direction === 'long'
    ? (overrides?.overnightLongPipsPerDay  ?? offer.overnightLongPipsPerDay  ?? underlying.overnightLongPipsPerDay  ?? 0)
    : (overrides?.overnightShortPipsPerDay ?? offer.overnightShortPipsPerDay ?? underlying.overnightShortPipsPerDay ?? 0);

  if (pipsPerDay === 0) return 0;

  const tripleMultiplier = offer.overnightTripleMultiplier ?? 3;
  const extraNights      = holdingDays >= 7
    ? Math.floor(holdingDays / 7) * (tripleMultiplier - 1)
    : 0;
  const totalNights = holdingDays + extraNights;

  const pipVal = pipValue(quoteCurrency, accountCurrency);
  return pipsPerDay * totalNights * pipVal * lots;
}

// ── Spread → EUR ──────────────────────────────────────────────────────────
function calcSpreadEUR(
  offer:           InstrumentOffer,
  underlyingId:    UnderlyingId | undefined,
  exposure:        number,
): number {
  const overrides  = underlyingId ? offer.underlyingOverrides?.[underlyingId] : undefined;
  const spreadBps  = overrides?.spreadAvgBps ?? offer.spreadAvgBps;
  return (spreadBps / 10_000) * exposure;
}

// ── CostBreakdown ─────────────────────────────────────────────────────────
export type CostBreakdown = {
  spreadEUR:       number;
  commissionEUR:   number;
  overnightEUR:    number;
  slippageEUR:     number;
  exchangeFeeEUR:  number;
  rollEUR:         number;
  totalEUR:        number;
  spreadBps:       number;
  commissionBps:   number;
  overnightBps:    number;
  slippageBps:     number;
  exchangeFeeBps:  number;
  rollBps:         number;
  totalBps:        number;
  range: {
    spread:     Range;
    commission: Range;
    overnight:  Range;
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
  offer:            InstrumentOffer;
  underlying:       Underlying | undefined;
  exposure:         number;
  lots:             number;
  direction:        TradeDirection;
  holdingDays:      number;
  monthlyNotional:  number;
  quoteCurrency:    string;
  accountCurrency:  string;
  regime:           VolatilityRegime;
  isIntraday:       boolean;
}): CostBreakdown {
  const {
    offer, underlying, exposure, lots, direction,
    holdingDays, monthlyNotional, quoteCurrency, accountCurrency,
    regime, isIntraday,
  } = params;

  const pipVal      = pipValue(quoteCurrency, accountCurrency);
  const liquidityTier = underlying?.liquidityTier ?? 'tier2';

  const spreadBase = calcSpreadEUR(offer, underlying?.id, exposure);
  const spreadR    = spreadToRange(spreadBase, regime);

  const tierMult = commissionTierMultiplier(monthlyNotional);
  let commBase = 0;
  if (offer.commissionPerLotEUR != null) {
    commBase = offer.commissionPerLotEUR * lots * tierMult;
  } else if (offer.commissionPerLotUSD != null) {
    commBase = offer.commissionPerLotUSD * fxRate('USD', accountCurrency) * lots * tierMult;
  }
  const commissionR = toRange(commBase);

  const effectiveDays = isIntraday ? 0 : holdingDays;
  const overnightBase = calcOvernightEUR(offer, underlying, direction, effectiveDays, lots, quoteCurrency, accountCurrency);
  const overnightR    = overnightToRange(overnightBase);

  const slippageR = calcSlippageRange(lots, pipVal, liquidityTier, regime);

  const totalR   = sumRange([spreadR, commissionR, overnightR, slippageR]);
  const totalEUR = totalR.expected;

  return {
    spreadEUR:      spreadR.expected,
    commissionEUR:  commissionR.expected,
    overnightEUR:   overnightR.expected,
    slippageEUR:    slippageR.expected,
    exchangeFeeEUR: 0,
    rollEUR:        0,
    totalEUR,
    spreadBps:      toBps(spreadR.expected,      exposure),
    commissionBps:  toBps(commissionR.expected,  exposure),
    overnightBps:   toBps(overnightR.expected,   exposure),
    slippageBps:    toBps(slippageR.expected,    exposure),
    exchangeFeeBps: 0,
    rollBps:        0,
    totalBps:       toBps(totalEUR,              exposure),
    range: { spread: spreadR, commission: commissionR, overnight: overnightR, slippage: slippageR, total: totalR },
  };
}

// ── Futures cost calculator ───────────────────────────────────────────────
function calcFuturesCosts(
  offer:           InstrumentOffer,
  capital:         number,
  holdingDays:     number,
  accountCurrency: string,
  regime:          VolatilityRegime,
): { breakdown: CostBreakdown; contracts: number; contractSize: 'micro' | 'mini' | 'full' | null } {
  const usableCapital = capital * FUTURES_CAPITAL_RATIO;

  const sizes = (['full', 'mini', 'micro'] as const).filter(sz =>
    (offer.availableContractSizes?.includes(sz) ?? false) &&
    usableCapital >= FUTURES_PARAMS[sz].marginEUR,
  );

  const empty = (): CostBreakdown => ({
    spreadEUR: 0, commissionEUR: 0, overnightEUR: 0, slippageEUR: 0,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR: 0,
    spreadBps: 0, commissionBps: 0, overnightBps: 0, slippageBps: 0,
    exchangeFeeBps: 0, rollBps: 0, totalBps: 0,
    range: { spread: toRange(0), commission: toRange(0), overnight: toRange(0), slippage: toRange(0), total: toRange(0) },
  });

  if (sizes.length === 0) return { contracts: 0, contractSize: null, breakdown: empty() };

  const selectedSize = sizes[0]!;
  const params       = FUTURES_PARAMS[selectedSize];
  const contracts    = Math.max(1, Math.floor(usableCapital / params.marginEUR));
  const nominalEUR   = contracts * params.nominalEUR;

  const fxUSD    = fxRate('USD', accountCurrency);
  const spreadBase = contracts * params.tickValueUSD * params.ticksInSpread * fxUSD;
  const spreadR  = spreadToRange(spreadBase, regime);

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
  if (offer.rollSpreadBps != null && offer.rollFrequencyDays != null && holdingDays > offer.rollFrequencyDays) {
    const rolls = Math.floor(holdingDays / offer.rollFrequencyDays);
    rollBase    = (offer.rollSpreadBps / 10_000) * nominalEUR * rolls;
  }

  const futuresSlippagePips = regime === 'HIGH' ? 2 : regime === 'NORMAL' ? 1 : 0.5;
  const slippageBase = futuresSlippagePips * params.tickValueUSD * fxUSD * contracts;
  const slippageR    = { best: slippageBase * 0.4, expected: slippageBase, worst: slippageBase * 2.5 };

  const totalR = sumRange([spreadR, commissionR, toRange(exchangeFeeBase), toRange(rollBase), slippageR]);

  return {
    contracts,
    contractSize: selectedSize,
    breakdown: {
      spreadEUR:      spreadR.expected,
      commissionEUR:  commissionR.expected,
      overnightEUR:   0,
      slippageEUR:    slippageR.expected,
      exchangeFeeEUR: exchangeFeeBase,
      rollEUR:        rollBase,
      totalEUR:       totalR.expected,
      spreadBps:      toBps(spreadR.expected,     nominalEUR),
      commissionBps:  toBps(commissionR.expected, nominalEUR),
      overnightBps:   0,
      slippageBps:    toBps(slippageR.expected,   nominalEUR),
      exchangeFeeBps: toBps(exchangeFeeBase,       nominalEUR),
      rollBps:        toBps(rollBase,              nominalEUR),
      totalBps:       toBps(totalR.expected,       nominalEUR),
      range: { spread: spreadR, commission: commissionR, overnight: toRange(0), slippage: slippageR, total: totalR },
    },
  };
}

// ── Public types ──────────────────────────────────────────────────────────
export type TradeDirection = 'long' | 'short';

export type EngineInput = {
  capital?:          number;
  assetClass:        AssetClass;
  underlyingId?:     UnderlyingId;
  direction?:        TradeDirection;
  nDaysOpen?:        number;
  stopLossPips?:     number;
  riskPct?:          number;
  accountCurrency?:  string;
  volatilityRegime?: VolatilityRegime;
  monthlyVolumeEUR?: number;
};

/**
 * Metadati broker esposti sul result — necessari per rendering card.
 * Tutti i campi sono opzionali perché il broker potrebbe non essere
 * presente nel catalogo (BROKERS è Partial<Record<BrokerId, Broker>>).
 */
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
  spreadCostBps:      number;
  commissionCostBps:  number;
  overnightCostBps:   number;
  slippageCostBps:    number;
  totalCostBps:       number;
  spreadCost:         number;
  commissionCost:     number;
  overnightCost:      number;
  slippageCost:       number;
  achievableExposure: number;
  costRange: {
    perTrade: Range;
  };
  /** v4.3: broker metadata for card rendering (disclaimer, CTA, affiliate) */
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
  assetClass,
  underlyingId,
  direction        = 'long',
  nDaysOpen        = 1,
  stopLossPips     = 20,
  riskPct,
  accountCurrency  = 'EUR',
  volatilityRegime = 'NORMAL',
  monthlyVolumeEUR,
}: EngineInput): SimulatorResult[] {
  const effectiveCapital = capital ?? 0;
  if (effectiveCapital <= 0) return [];

  const effectiveRisk = riskPct ?? DEFAULT_RISK_PCT;
  const underlying    = underlyingId ? UNDERLYINGS[underlyingId] : undefined;
  const quoteCcy      = underlying?.quoteCurrency ?? 'USD';
  const isIntraday    = nDaysOpen <= 1;

  const ugIds = ugIdsForAssetClass(assetClass);
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
      const res    = calcFuturesCosts(offer, effectiveCapital, nDaysOpen, accountCurrency, volatilityRegime);
      breakdown    = res.breakdown;
      contracts    = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return [];
      exposure = contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR;

    } else {
      lots = calcProfessionalLots({
        capital:         effectiveCapital,
        riskPct:         effectiveRisk,
        stopLossPips,
        quoteCurrency:   quoteCcy,
        accountCurrency,
        offer,
      });
      if (lots <= 0) return [];

      exposure = lots * LOT_SIZE;
      if (offer.minPositionEUR > exposure) return [];

      const estMonthlyNotional = monthlyVolumeEUR ?? (exposure * 22);

      breakdown = calcFxCosts({
        offer, underlying, exposure, lots, direction,
        holdingDays:     nDaysOpen,
        monthlyNotional: estMonthlyNotional,
        quoteCurrency:   quoteCcy,
        accountCurrency,
        regime:          volatilityRegime,
        isIntraday,
      });
    }

    const pipVal          = pipValue(quoteCcy, accountCurrency);
    const riskPerTradePct = lots > 0
      ? (stopLossPips * pipVal * lots) / effectiveCapital
      : 0;

    const totalCostBps = breakdown.totalBps;
    const feasDetail   = calcFeasibility(
      offer, exposure, effectiveCapital, lots, totalCostBps, riskPerTradePct,
    );
    const score = calcScore(totalCostBps);
    const costPerTradeEUR = breakdown.totalEUR;

    // v4.3: build brokerMeta from BROKERS catalog
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
      spreadCostBps:     breakdown.spreadBps,
      commissionCostBps: breakdown.commissionBps,
      overnightCostBps:  breakdown.overnightBps,
      slippageCostBps:   breakdown.slippageBps,
      totalCostBps,
      spreadCost:        breakdown.spreadEUR,
      commissionCost:    breakdown.commissionEUR,
      overnightCost:     breakdown.overnightEUR,
      slippageCost:      breakdown.slippageEUR,
      achievableExposure: exposure,
      costRange: { perTrade: breakdown.range.total },
      brokerMeta,
    }] satisfies SimulatorResult[];
  });

  return results.sort((a, b) => a.costRange.perTrade.expected - b.costRange.perTrade.expected);
}
