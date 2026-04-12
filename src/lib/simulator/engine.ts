// ============================================================
// SIMULATOR ENGINE v3
//
// Fixes from product review 2026-04-12 (round 2):
//   - sustainable = risk-based (riskPerTradePct < 2%), NOT cost-based
//   - futures spread: tickValueUSD (monetary), NOT tickSizeUSD (price unit)
//   - futures sizing: usableCapital = capital * 0.20 (conservative)
//   - score: max(1, ...) — no dead zero
//   - EngineInput: stopLossPips + riskPct for risk-aware sizing
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId } from '@/data/simulator/underlyings';
import type { InstrumentOffer } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

// ── Costanti ──────────────────────────────────────────────────────────
const USD_TO_EUR        = 0.92;
const LOT_SIZE          = 100_000;
const SCORE_HALF_LIFE   = 20;           // bps dove score = 50
const k                 = Math.LN2 / SCORE_HALF_LIFE;
const MAX_RISK_PCT      = 0.02;         // 2% — soglia sustainable
const FUTURES_CAPITAL_RATIO = 0.20;     // 20% del capitale usabile per margine

// ── Futures CME FX — parametri per taglia ────────────────────────────
// tickValueUSD = valore monetario di 1 tick (movimento minimo)
// EUR/USD full: 1 tick = 0.0001, contract = 125.000 EUR → tickValue = $12.50
// EUR/USD mini: contract = 62.500 EUR → tickValue = $6.25
// EUR/USD micro: contract = 12.500 EUR → tickValue = $1.25
const FUTURES_PARAMS: Record<'micro' | 'mini' | 'full', {
  nominalEUR:    number;
  marginEUR:     number;
  tickValueUSD:  number;  // CORRETTO: valore monetario, non price unit
  ticksInSpread: number;
}> = {
  micro: { nominalEUR: 12_500,  marginEUR: 250,   tickValueUSD: 1.25,  ticksInSpread: 1 },
  mini:  { nominalEUR: 62_500,  marginEUR: 1_250,  tickValueUSD: 6.25,  ticksInSpread: 1 },
  full:  { nominalEUR: 125_000, marginEUR: 2_500,  tickValueUSD: 12.50, ticksInSpread: 1 },
};

// ── Tipi pubblici ─────────────────────────────────────────────────────
export type Feasibility = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';

export type FeasibilityDetail = {
  access:           boolean;  // minPositionEUR <= exposure
  canTrade:         boolean;  // capital >= marginRequired
  sustainable:      boolean;  // riskPerTradePct < 2%
  label:            Feasibility;
  marginRequired:   number;   // EUR
  riskPerTradePct:  number;   // 0..1
};

export type CostBreakdown = {
  spreadEUR:       number;
  commissionEUR:   number;
  overnightEUR:    number;
  exchangeFeeEUR:  number;
  rollEUR:         number;
  totalEUR:        number;
  spreadBps:       number;
  commissionBps:   number;
  overnightBps:    number;
  exchangeFeeBps:  number;
  rollBps:         number;
  totalBps:        number;
};

export type SimulatorResult = {
  id:                string;
  instrumentName:    string;
  brokerName:        string;
  accountTypeName:   string;
  score:             number;
  feasibility:       Feasibility;
  feasibilityDetail: FeasibilityDetail;
  costBreakdown:     CostBreakdown;
  lots:              number;
  contracts:         number;
  contractSize:      'micro' | 'mini' | 'full' | null;
  // legacy flat fields
  spreadCostBps:      number;
  commissionCostBps:  number;
  overnightCostBps:   number;
  totalCostBps:       number;
  spreadCost:         number;
  commissionCost:     number;
  overnightCost:      number;
  slippageCost:       number;
  achievableExposure: number;
  deviationPct:       number;
};

export type TradeDirection = 'long' | 'short';

export type EngineInput = {
  exposure:       number;          // nozionale EUR desiderato
  capital?:       number;          // capitale totale — default = exposure
  assetClass:     AssetClass;
  underlyingId?:  UnderlyingId;
  direction?:     TradeDirection;  // default 'long'
  nDaysOpen?:     number;          // giorni medi di holding, default 1
  nTrades?:       number;          // numero operazioni, default 1
  stopLossPips?:  number;          // per risk-based sustainability check
  riskPct?:       number;          // frazione di capital a rischio (0..1), default 0.01
};

// ── Helpers interni ───────────────────────────────────────────────────

function ugIdsForAssetClass(ac: AssetClass): string[] {
  switch (ac) {
    case 'FOREX':       return ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'];
    case 'CRYPTO':      return ['ug_crypto_major'];
    case 'INDICES':     return ['ug_indices_eu', 'ug_indices_us'];
    case 'COMMODITIES': return ['ug_commodities_energy', 'ug_commodities_metals'];
    default:            return [];
  }
}

function pipValueEURPerLot(quoteCurrency: string): number {
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  return pipSize * LOT_SIZE * USD_TO_EUR;
}

function toBps(eur: number, reference: number): number {
  return reference > 0 ? (eur / reference) * 10_000 : 0;
}

/** Overnight EUR: usa override offer > override underlying > underlying fallback */
function calcOvernightEUR(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
  direction:    TradeDirection,
  effectiveDays: number,
  lots:         number,
): number {
  if (effectiveDays === 0 || !underlyingId) return 0;

  const underlying = UNDERLYINGS[underlyingId];
  const overrides  = offer.underlyingOverrides?.[underlyingId];
  const quoteCcy   = underlying?.quoteCurrency ?? 'USD';

  const pipsPerDay = direction === 'long'
    ? (overrides?.overnightLongPipsPerDay  ?? offer.overnightLongPipsPerDay  ?? underlying?.overnightLongPipsPerDay  ?? 0)
    : (overrides?.overnightShortPipsPerDay ?? offer.overnightShortPipsPerDay ?? underlying?.overnightShortPipsPerDay ?? 0);

  if (pipsPerDay === 0) return 0;

  // Rollover triplo mercoledì
  const tripleMultiplier = offer.overnightTripleMultiplier ?? 3;
  const extraNights      = effectiveDays >= 7
    ? Math.floor(effectiveDays / 7) * (tripleMultiplier - 1)
    : 0;
  const totalNights = effectiveDays + extraNights;

  const pipValEUR  = pipValueEURPerLot(quoteCcy);
  const costEUR    = Math.abs(pipsPerDay) * totalNights * pipValEUR * lots;
  return pipsPerDay < 0 ? costEUR : 0; // carry positivo non dedotto in v1
}

/**
 * Sustainability check risk-based.
 * riskPerTradePct = (stopLossPips * pipValue * lots) / capital
 * Se stopLossPips non fornito: fallback su stima 20 pips (EUR/USD tipico)
 */
function calcRiskPerTradePct(
  lots:          number,
  capital:       number,
  underlyingId:  UnderlyingId | undefined,
  stopLossPips:  number,
): number {
  if (capital <= 0 || lots <= 0) return 1;
  const quoteCcy   = underlyingId ? (UNDERLYINGS[underlyingId]?.quoteCurrency ?? 'USD') : 'USD';
  const pipValEUR  = pipValueEURPerLot(quoteCcy);
  return (stopLossPips * pipValEUR * lots) / capital;
}

function calcScore(totalCostBps: number): number {
  return Math.max(1, Math.round(100 * Math.exp(-k * totalCostBps)));
}

function calcFeasibility(
  offer:           InstrumentOffer,
  exposure:        number,
  capital:         number,
  lots:            number,
  underlyingId:    UnderlyingId | undefined,
  totalCostBps:    number,
  stopLossPips:    number,
): FeasibilityDetail {
  const marginRequired   = (offer.marginRequirementPct / 100) * exposure;
  const access           = offer.minPositionEUR <= exposure;
  const canTrade         = capital >= marginRequired;
  const riskPerTradePct  = calcRiskPerTradePct(lots, capital, underlyingId, stopLossPips);
  const sustainable      = riskPerTradePct < MAX_RISK_PCT;
  void totalCostBps; // reserved for future use in label logic

  let label: Feasibility;
  if (!access || !canTrade)                         label = 'INFEASIBLE';
  else if (!sustainable)                            label = 'WARNING';    // accessibile ma rischio alto
  else if (totalCostBps < 15)                       label = 'OPTIMAL';
  else if (totalCostBps < 40)                       label = 'FEASIBLE';
  else                                              label = 'WARNING';

  return { access, canTrade, sustainable, label, marginRequired, riskPerTradePct };
}

// ── CFD / Spot FX ─────────────────────────────────────────────────────

function calcCFDCosts(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
  exposure:     number,
  direction:    TradeDirection,
  nDaysOpen:    number,
  nTrades:      number,
): CostBreakdown {
  const lots = exposure / LOT_SIZE;

  // Spread
  let spreadBps = offer.spreadAvgBps;
  if (underlyingId && offer.underlyingOverrides?.[underlyingId]?.spreadAvgBps != null) {
    spreadBps = offer.underlyingOverrides[underlyingId]!.spreadAvgBps!;
  }
  const spreadEUR = (spreadBps / 10_000) * exposure * nTrades;

  // Commission — USD first, EUR at the end
  let commissionEUR = 0;
  if (offer.commissionPerLotUSD != null) {
    const commissionUSD = offer.commissionPerLotUSD * lots * nTrades;
    commissionEUR       = commissionUSD * USD_TO_EUR;
  } else if (offer.commissionPerLotEUR != null) {
    commissionEUR = offer.commissionPerLotEUR * lots * nTrades;
  }

  // Overnight — intraday = 0 notti
  const effectiveDays = (
    offer.compatibleHorizons.includes('intraday') && nDaysOpen <= 1
  ) ? 0 : nDaysOpen;
  const overnightEUR = calcOvernightEUR(offer, underlyingId, direction, effectiveDays, lots);

  const totalEUR = spreadEUR + commissionEUR + overnightEUR;

  return {
    spreadEUR,   commissionEUR,  overnightEUR,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR,
    spreadBps:       toBps(spreadEUR,      exposure),
    commissionBps:   toBps(commissionEUR,  exposure),
    overnightBps:    toBps(overnightEUR,   exposure),
    exchangeFeeBps:  0, rollBps: 0,
    totalBps:        toBps(totalEUR,       exposure),
  };
}

// ── Futures (tick-based) ──────────────────────────────────────────────

function calcFuturesCosts(
  offer:     InstrumentOffer,
  capital:   number,
  nDaysOpen: number,
  nTrades:   number,
): { breakdown: CostBreakdown; contracts: number; contractSize: 'micro' | 'mini' | 'full' | null } {
  const usableCapital = capital * FUTURES_CAPITAL_RATIO;

  const sizes = (['full', 'mini', 'micro'] as const).filter(sz =>
    (offer.availableContractSizes?.includes(sz) ?? false) &&
    usableCapital >= FUTURES_PARAMS[sz].marginEUR,
  );

  if (sizes.length === 0) {
    return {
      contracts: 0, contractSize: null,
      breakdown: {
        spreadEUR: 0, commissionEUR: 0, overnightEUR: 0,
        exchangeFeeEUR: 0, rollEUR: 0, totalEUR: 0,
        spreadBps: 0, commissionBps: 0, overnightBps: 0,
        exchangeFeeBps: 0, rollBps: 0, totalBps: 0,
      },
    };
  }

  const selectedSize = sizes[0];
  const params       = FUTURES_PARAMS[selectedSize];
  const contracts    = Math.max(1, Math.floor(usableCapital / params.marginEUR));
  const nominalEUR   = contracts * params.nominalEUR;

  // Spread — CORRETTO: tickValueUSD è il valore monetario, non il price movement
  const spreadEUR = contracts * params.tickValueUSD * params.ticksInSpread * USD_TO_EUR * nTrades;

  // Commission broker
  let commissionEUR = 0;
  if (offer.commissionPerContractEUR != null) {
    commissionEUR = offer.commissionPerContractEUR * contracts * nTrades;
  } else if (offer.commissionPerContractUSD != null) {
    commissionEUR = offer.commissionPerContractUSD * contracts * nTrades * USD_TO_EUR;
  }

  // Exchange fee (CME/Eurex — separata)
  let exchangeFeeEUR = 0;
  if (offer.exchangeFeePerContractEUR != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractEUR * contracts * nTrades;
  } else if (offer.exchangeFeePerContractUSD != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractUSD * contracts * nTrades * USD_TO_EUR;
  }

  // Roll cost
  let rollEUR = 0;
  if (offer.rollSpreadBps != null && offer.rollFrequencyDays != null && nDaysOpen > offer.rollFrequencyDays) {
    const rolls = Math.floor(nDaysOpen / offer.rollFrequencyDays);
    rollEUR     = (offer.rollSpreadBps / 10_000) * nominalEUR * rolls;
  }

  const totalEUR = spreadEUR + commissionEUR + exchangeFeeEUR + rollEUR;

  return {
    contracts,
    contractSize: selectedSize,
    breakdown: {
      spreadEUR, commissionEUR, overnightEUR: 0,
      exchangeFeeEUR, rollEUR, totalEUR,
      spreadBps:       toBps(spreadEUR,      nominalEUR),
      commissionBps:   toBps(commissionEUR,  nominalEUR),
      overnightBps:    0,
      exchangeFeeBps:  toBps(exchangeFeeEUR, nominalEUR),
      rollBps:         toBps(rollEUR,        nominalEUR),
      totalBps:        toBps(totalEUR,       nominalEUR),
    },
  };
}

// ── Engine principale ─────────────────────────────────────────────────

export function runEngine({
  exposure,
  capital,
  assetClass,
  underlyingId,
  direction    = 'long',
  nDaysOpen    = 1,
  nTrades      = 1,
  stopLossPips = 20,
  riskPct      = 0.01,
}: EngineInput): SimulatorResult[] {
  if (exposure < 100 || nTrades === 0) return [];

  const effectiveCapital = capital ?? exposure;
  const ugIds = ugIdsForAssetClass(assetClass);

  const compatibleOffers = INSTRUMENT_OFFERS.filter(offer =>
    offer.ugIds.some(ug => ugIds.includes(ug)) &&
    offer.minPositionEUR <= exposure,
  );

  if (compatibleOffers.length === 0) return [];

  void riskPct; // reserved: future risk-based lot sizing (v1: exposure-based)

  const results: SimulatorResult[] = compatibleOffers.flatMap(offer => {
    const broker    = BROKERS[offer.brokerId];
    const isFutures = offer.instrumentTypeId === 'futures_std';

    let breakdown:   CostBreakdown;
    let contracts    = 0;
    let contractSize: 'micro' | 'mini' | 'full' | null = null;
    let lots         = 0;

    if (isFutures) {
      const res  = calcFuturesCosts(offer, effectiveCapital, nDaysOpen, nTrades);
      breakdown  = res.breakdown;
      contracts  = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return [];
      lots = 0;
    } else {
      breakdown = calcCFDCosts(offer, underlyingId, exposure, direction, nDaysOpen, nTrades);
      lots      = exposure / LOT_SIZE;
    }

    const totalCostBps = breakdown.totalBps;
    const feasDetail   = calcFeasibility(
      offer, exposure, effectiveCapital, lots, underlyingId, totalCostBps, stopLossPips,
    );
    const score = calcScore(totalCostBps);

    const achievableExposure = isFutures
      ? contracts * (FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR)
      : exposure;

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
      // legacy
      spreadCostBps:      breakdown.spreadBps,
      commissionCostBps:  breakdown.commissionBps,
      overnightCostBps:   breakdown.overnightBps,
      totalCostBps,
      spreadCost:         breakdown.spreadEUR,
      commissionCost:     breakdown.commissionEUR,
      overnightCost:      breakdown.overnightEUR,
      slippageCost:       0,
      achievableExposure,
      deviationPct:       0,
    }] satisfies SimulatorResult[];
  });

  return results.sort((a, b) => b.score - a.score);
}
