// ============================================================
// SIMULATOR ENGINE v3.4
//
// CHANGES v3.4:
//   fix(🔴): pipValueEURPerLot ora usa fxRateToEUR dinamico per quoteCurrency
//            (era fisso USD_TO_EUR → tutti i cross non-USD erano falsati)
//   fix(🔴): overnight mantiene il segno (swap positivo = guadagno carry)
//            (era Math.abs → eliminava carry trading)
//   fix(🟠): spread FX calcolato in pips→EUR, non bps su exposure
//            (bps derivati DOPO come metrica secondaria)
//   fix(🟠): commission standardizzata in EUR lato dataset
//            (USD_TO_EUR rimane solo come fallback statico)
//   add(🟢): monthlyCostEUR nel risultato
//   add(🟢): costPerTradeEUR nel risultato
//   fix(🟢): sort finale per monthlyCostEUR ASC (non score)
//   fix(🟠): calcProfessionalLots — se lotsRaw < minLots restituisce minLots
//            invece di 0 (evita INFEASIBLE per capital piccoli)
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId, Underlying } from '@/data/simulator/underlyings';
import type { InstrumentOffer } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

const LOT_SIZE         = 100_000;
const SCORE_HALF_LIFE  = 20;
const k                = Math.LN2 / SCORE_HALF_LIFE;
const DEFAULT_RISK_PCT = 0.01;   // 1% capitale per trade
const FUTURES_CAPITAL_RATIO = 0.20;
const TRADING_DAYS_PER_MONTH = 21;

// ── FX rates statici vs EUR ──────────────────────────────────
// Aggiornati manualmente ogni release. Per v1 sufficienti —
// in v2 verranno sostituiti con feed live.
// Tutti i valori = quante EUR vale 1 unità della valuta.
const FX_RATE_TO_EUR: Record<string, number> = {
  EUR: 1.00,
  USD: 0.92,
  GBP: 1.17,
  JPY: 0.0062,  // 1 JPY ≈ 0.0062 EUR
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

/** 1 pip in EUR per 1 lot standard (100k unità base). */
function pipValueEURPerLot(quoteCurrency: string): number {
  const pipSize    = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  const fxToEUR    = FX_RATE_TO_EUR[quoteCurrency] ?? FX_RATE_TO_EUR['USD'];
  return pipSize * LOT_SIZE * fxToEUR;
}

// ── ESMA leverage cap ────────────────────────────────────────
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

export type Feasibility = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';

export type FeasibilityDetail = {
  access:           boolean;
  canTrade:         boolean;
  sustainable:      boolean;
  label:            Feasibility;
  marginRequired:   number;
  riskPerTradePct:  number;
};

export type CostBreakdown = {
  spreadEUR:       number;
  commissionEUR:   number;
  overnightEUR:    number;   // negativo = costo, positivo = carry guadagnato
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
  // Costi per singolo trade
  spreadCostBps:      number;
  commissionCostBps:  number;
  overnightCostBps:   number;
  totalCostBps:       number;
  spreadCost:         number;
  commissionCost:     number;
  overnightCost:      number;
  slippageCost:       number;
  // Costi aggregati (chiave per UX)
  costPerTradeEUR:    number;
  monthlyCostEUR:     number;
  // Exposure reale
  achievableExposure: number;
  deviationPct:       number;
};

export type TradeDirection = 'long' | 'short';

export type EngineInput = {
  capital?:       number;
  assetClass:     AssetClass;
  underlyingId?:  UnderlyingId;
  direction?:     TradeDirection;
  nDaysOpen?:     number;
  nTrades?:       number;     // trade al mese
  stopLossPips?:  number;
  riskPct?:       number;
};

// ── Helpers ──────────────────────────────────────────────────

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

function esmaLeverageForOffer(offer: InstrumentOffer): number {
  const leverages = offer.ugIds.map(ug => ESMA_LEVERAGE[ug] ?? 1);
  return Math.max(...leverages);
}

function toBps(eur: number, reference: number): number {
  return reference > 0 ? (eur / reference) * 10_000 : 0;
}

/**
 * Lotizzazione professionale basata sul rischio.
 * lots = (capital × riskPct) / (stopLossPips × pipValueEUR)
 *
 * - Se il risultato è sotto minLots → restituisce minLots (non 0)
 *   così i capital piccoli vedono almeno 1 risultato (flaggato WARNING)
 * - Clampato al CAP ESMA (mai superare capital × esmaLev / LOT_SIZE)
 * - Ridotto se il margine richiesto supera il capitale
 */
function calcProfessionalLots(params: {
  capital:       number;
  riskPct:       number;
  stopLossPips:  number;
  quoteCurrency: string;
  offer:         InstrumentOffer;
}): number {
  const { capital, riskPct, stopLossPips, quoteCurrency, offer } = params;

  const riskEUR   = capital * riskPct;
  const pipValEUR = pipValueEURPerLot(quoteCurrency);

  if (pipValEUR <= 0 || stopLossPips <= 0) return 0;

  const lotsRaw  = riskEUR / (stopLossPips * pipValEUR);
  const minLots  = offer.minLotSize ?? 0.01;

  // Se non si arriva neanche a 1 micro lot → usa minLots (WARNING, non INFEASIBLE)
  const lotsStep = lotsRaw >= minLots
    ? Math.floor(lotsRaw / minLots) * minLots
    : minLots;

  // CAP ESMA
  const esmaLev = esmaLeverageForOffer(offer);
  const maxLots = (capital * esmaLev) / LOT_SIZE;
  let lots      = Math.min(lotsStep, maxLots);

  // Aggiustamento margine: se margine > capitale, scendi
  const exposure     = lots * LOT_SIZE;
  const marginNeeded = (offer.marginRequirementPct / 100) * exposure;
  if (marginNeeded > capital) {
    const adjustedExp  = capital / (offer.marginRequirementPct / 100);
    const adjustedLots = Math.floor((adjustedExp / LOT_SIZE) / minLots) * minLots;
    lots = Math.max(minLots, adjustedLots);
  }

  return lots;
}

// ── Overnight ────────────────────────────────────────────────
/**
 * Costo overnight netto in EUR.
 * Il SEGNO è preservato:
 *   negativo = costo (swap negativo → il trader paga)
 *   positivo = guadagno carry (swap positivo → il trader incassa)
 *
 * Formula:
 *   overnightEUR = pipsPerDay × totalNights × pipValueEUR × lots
 *
 * Rollover triplo: la notte del mercoledì vale 3 notti.
 * Approx: ogni 7gg si aggiungono 2 notti extra.
 */
function calcOvernightEUR(
  offer:         InstrumentOffer,
  underlying:    Underlying | undefined,
  direction:     TradeDirection,
  effectiveDays: number,
  lots:          number,
): number {
  if (effectiveDays === 0 || !underlying) return 0;

  const overrides = offer.underlyingOverrides?.[underlying.id];
  const quoteCcy  = underlying.quoteCurrency;

  const pipsPerDay = direction === 'long'
    ? (overrides?.overnightLongPipsPerDay  ?? offer.overnightLongPipsPerDay  ?? underlying.overnightLongPipsPerDay)
    : (overrides?.overnightShortPipsPerDay ?? offer.overnightShortPipsPerDay ?? underlying.overnightShortPipsPerDay);

  if (pipsPerDay === 0) return 0;

  const tripleMultiplier = offer.overnightTripleMultiplier ?? 3;
  const extraNights      = effectiveDays >= 7
    ? Math.floor(effectiveDays / 7) * (tripleMultiplier - 1)
    : 0;
  const totalNights = effectiveDays + extraNights;

  const pipValEUR = pipValueEURPerLot(quoteCcy);

  // Segno preservato: negativo = costo, positivo = carry guadagnato
  return pipsPerDay * totalNights * pipValEUR * lots;
}

// ── Spread → EUR (FX: pips-based, non bps) ───────────────────
/**
 * Per FX: spread in pips → EUR usando pipValue reale.
 * Per asset non-FX o se spreadPips non disponibile: fallback su bps × exposure.
 */
function calcSpreadEUR(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
  exposure:     number,
  lots:         number,
  quoteCurrency: string,
  nTrades:      number,
): number {
  // Cerca spreadPips (FX-native) con override per coppia specifica
  const overrides   = underlyingId ? offer.underlyingOverrides?.[underlyingId] : undefined;
  const spreadPips  = overrides?.spreadPips ?? offer.spreadPips;

  if (spreadPips != null) {
    // FX pips → EUR
    return spreadPips * pipValueEURPerLot(quoteCurrency) * lots * nTrades;
  }

  // Fallback: spreadAvgBps × exposure (per indici, equity, commodity)
  return (offer.spreadAvgBps / 10_000) * exposure * nTrades;
}

function calcScore(totalCostBps: number): number {
  return Math.max(1, Math.round(100 * Math.exp(-k * totalCostBps)));
}

function calcFeasibility(
  offer:           InstrumentOffer,
  exposure:        number,
  capital:         number,
  lots:            number,
  totalCostBps:    number,
  riskPerTradePct: number,
  nTrades:         number,
): FeasibilityDetail {
  const marginRequired = (offer.marginRequirementPct / 100) * exposure;
  const access         = offer.minPositionEUR <= exposure;
  const canTrade       = capital >= marginRequired;
  // Sustainable: rischio per trade AND costi totali ragionevoli
  const monthlyCostRatio = (totalCostBps / 10_000) * nTrades;
  const sustainable      = riskPerTradePct < 0.02 && monthlyCostRatio < 0.05;
  void lots;

  let label: Feasibility;
  if (!access || !canTrade || lots <= 0) label = 'INFEASIBLE';
  else if (!sustainable)                  label = 'WARNING';
  else if (totalCostBps < 15)             label = 'OPTIMAL';
  else if (totalCostBps < 40)             label = 'FEASIBLE';
  else                                    label = 'WARNING';

  return { access, canTrade, sustainable, label, marginRequired, riskPerTradePct };
}

// ── CFD costs ─────────────────────────────────────────────────
function calcCFDCosts(
  offer:        InstrumentOffer,
  underlying:   Underlying | undefined,
  exposure:     number,
  lots:         number,
  direction:    TradeDirection,
  nDaysOpen:    number,
  nTrades:      number,
): CostBreakdown {
  const quoteCcy = underlying?.quoteCurrency ?? 'USD';

  const spreadEUR = calcSpreadEUR(
    offer, underlying?.id, exposure, lots, quoteCcy, nTrades,
  );

  let commissionEUR = 0;
  if (offer.commissionPerLotEUR != null) {
    commissionEUR = offer.commissionPerLotEUR * lots * nTrades;
  } else if (offer.commissionPerLotUSD != null) {
    commissionEUR = offer.commissionPerLotUSD * (FX_RATE_TO_EUR['USD'] ?? 0.92) * lots * nTrades;
  }

  const effectiveDays = (
    offer.compatibleHorizons.includes('intraday') && nDaysOpen <= 1
  ) ? 0 : nDaysOpen;
  const overnightEUR = calcOvernightEUR(offer, underlying, direction, effectiveDays, lots);

  // totalEUR: overnight può essere negativo (carry) → riduce il costo totale
  const totalEUR = spreadEUR + commissionEUR + overnightEUR;

  return {
    spreadEUR, commissionEUR, overnightEUR,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR,
    spreadBps:      toBps(spreadEUR,     exposure),
    commissionBps:  toBps(commissionEUR, exposure),
    overnightBps:   toBps(overnightEUR,  exposure),
    exchangeFeeBps: 0, rollBps: 0,
    totalBps:       toBps(totalEUR,      exposure),
  };
}

// ── Spot FX costs ─────────────────────────────────────────────
function calcSpotFxCosts(
  offer:      InstrumentOffer,
  underlying: Underlying | undefined,
  exposure:   number,
  lots:       number,
  direction:  TradeDirection,
  nDaysOpen:  number,
  nTrades:    number,
): CostBreakdown {
  const quoteCcy = underlying?.quoteCurrency ?? 'USD';

  const spreadEUR = calcSpreadEUR(
    offer, underlying?.id, exposure, lots, quoteCcy, nTrades,
  );

  let commissionEUR = 0;
  if (offer.commissionPerLotEUR != null) {
    commissionEUR = offer.commissionPerLotEUR * lots * nTrades;
  } else if (offer.commissionPerLotUSD != null) {
    commissionEUR = offer.commissionPerLotUSD * (FX_RATE_TO_EUR['USD'] ?? 0.92) * lots * nTrades;
  }

  // Spot: nessuna intraday exemption — ogni notte si paga
  const overnightEUR = nDaysOpen > 0
    ? calcOvernightEUR(offer, underlying, direction, nDaysOpen, lots)
    : 0;

  const totalEUR = spreadEUR + commissionEUR + overnightEUR;

  return {
    spreadEUR, commissionEUR, overnightEUR,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR,
    spreadBps:      toBps(spreadEUR,     exposure),
    commissionBps:  toBps(commissionEUR, exposure),
    overnightBps:   toBps(overnightEUR,  exposure),
    exchangeFeeBps: 0, rollBps: 0,
    totalBps:       toBps(totalEUR,      exposure),
  };
}

// ── Futures costs ─────────────────────────────────────────────
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

  const fxUSD = FX_RATE_TO_EUR['USD'] ?? 0.92;
  const spreadEUR = contracts * params.tickValueUSD * params.ticksInSpread * fxUSD * nTrades;

  let commissionEUR = 0;
  if (offer.commissionPerContractEUR != null) {
    commissionEUR = offer.commissionPerContractEUR * contracts * nTrades;
  } else if (offer.commissionPerContractUSD != null) {
    commissionEUR = offer.commissionPerContractUSD * contracts * nTrades * fxUSD;
  }

  let exchangeFeeEUR = 0;
  if (offer.exchangeFeePerContractEUR != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractEUR * contracts * nTrades;
  } else if (offer.exchangeFeePerContractUSD != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractUSD * contracts * nTrades * fxUSD;
  }

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
      spreadBps:      toBps(spreadEUR,      nominalEUR),
      commissionBps:  toBps(commissionEUR,  nominalEUR),
      overnightBps:   0,
      exchangeFeeBps: toBps(exchangeFeeEUR, nominalEUR),
      rollBps:        toBps(rollEUR,        nominalEUR),
      totalBps:       toBps(totalEUR,       nominalEUR),
    },
  };
}

// ── Main engine ───────────────────────────────────────────────
export function runEngine({
  capital,
  assetClass,
  underlyingId,
  direction    = 'long',
  nDaysOpen    = 1,
  nTrades      = 1,
  stopLossPips = 20,
  riskPct,
}: EngineInput): SimulatorResult[] {
  if (nTrades === 0) return [];

  const effectiveCapital = capital ?? 0;
  if (effectiveCapital <= 0) return [];

  const effectiveRisk = riskPct ?? DEFAULT_RISK_PCT;

  const underlying  = underlyingId ? UNDERLYINGS[underlyingId] : undefined;
  const quoteCcy    = underlying?.quoteCurrency ?? 'USD';

  const ugIds = ugIdsForAssetClass(assetClass);
  const compatibleOffers = INSTRUMENT_OFFERS.filter(offer =>
    offer.ugIds.some(ug => ugIds.includes(ug)),
  );
  if (compatibleOffers.length === 0) return [];

  const results: SimulatorResult[] = compatibleOffers.flatMap(offer => {
    const broker    = BROKERS[offer.brokerId];
    const isFutures = offer.instrumentTypeId === 'futures_std';
    const isSpotFx  = offer.instrumentTypeId === 'spot_fx';
    const isCfd     = !isFutures && !isSpotFx;

    let breakdown:    CostBreakdown;
    let contracts     = 0;
    let contractSize: 'micro' | 'mini' | 'full' | null = null;
    let lots          = 0;
    let exposure      = 0;

    if (isFutures) {
      const res    = calcFuturesCosts(offer, effectiveCapital, nDaysOpen, nTrades);
      breakdown    = res.breakdown;
      contracts    = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return [];
      exposure = contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR;

    } else if (isSpotFx || isCfd) {
      lots = calcProfessionalLots({
        capital:       effectiveCapital,
        riskPct:       effectiveRisk,
        stopLossPips,
        quoteCurrency: quoteCcy,
        offer,
      });

      if (lots <= 0) return [];

      exposure = lots * LOT_SIZE;

      if (offer.minPositionEUR > exposure) return [];

      breakdown = isSpotFx
        ? calcSpotFxCosts(offer, underlying, exposure, lots, direction, nDaysOpen, nTrades)
        : calcCFDCosts(offer, underlying, exposure, lots, direction, nDaysOpen, nTrades);

    } else {
      return [];
    }

    const pipValEUR = pipValueEURPerLot(quoteCcy);
    const riskPerTradePct = lots > 0
      ? (stopLossPips * pipValEUR * lots) / effectiveCapital
      : 0;

    const totalCostBps = breakdown.totalBps;
    const feasDetail   = calcFeasibility(
      offer, exposure, effectiveCapital, lots,
      totalCostBps, riskPerTradePct, nTrades,
    );
    const score = calcScore(totalCostBps);

    // costo per singolo trade (spread + comm + overnight 1 trade)
    const costPerTradeEUR = nTrades > 0 ? breakdown.totalEUR / nTrades : 0;
    // costo mensile: totalEUR per nTrades × TRADING_DAYS_PER_MONTH
    // nTrades è già mensile (da profileToEngineParams → FREQ_TRADES moltiplicato × giorni)
    const monthlyCostEUR  = breakdown.totalEUR;

    const achievableExposure = isFutures
      ? contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR
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
      spreadCostBps:      breakdown.spreadBps,
      commissionCostBps:  breakdown.commissionBps,
      overnightCostBps:   breakdown.overnightBps,
      totalCostBps,
      spreadCost:         breakdown.spreadEUR,
      commissionCost:     breakdown.commissionEUR,
      overnightCost:      breakdown.overnightEUR,
      slippageCost:       0,
      costPerTradeEUR,
      monthlyCostEUR,
      achievableExposure,
      deviationPct:       0,
    }] satisfies SimulatorResult[];
  });

  // Sort per costo mensile ASC — il più economico prima.
  // Score mantenuto nel risultato per uso UI (colore, badge) ma non determina l'ordine.
  return results.sort((a, b) => a.monthlyCostEUR - b.monthlyCostEUR);
}

export { TRADING_DAYS_PER_MONTH };
