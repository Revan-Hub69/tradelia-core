// ============================================================
// SIMULATOR ENGINE v2 — motore costi reale
//
// Modello corretto (product review 2026-04-12):
//
//   CFD / Spot FX
//   ─────────────
//   spreadCostEUR     = spreadBps / 10_000 * exposure * nTrades
//   commissionCostEUR = commissionPerLotUSD * lots * nTrades * USD_TO_EUR
//   overnightCostEUR  = pipValue * |pipsPerDay| * effectiveDays
//                       (incl. triplo mercoledì su giorni reali)
//
//   Futures (tick-based — NON bps)
//   ────────────────────────────────
//   contracts         = floor(capital * 0.3 / marginPerContract)
//   spreadCostEUR     = contracts * tickValue * ticksInSpread * nTrades
//   commissionCostEUR = contracts * (commissionPerContract + exchangeFee) * nTrades
//   rollCostEUR       = appended se holdingDays > rollFrequencyDays
//
//   Score
//   ─────
//   score = round(100 * exp(-k * totalCostBps))
//   k = ln(2) / 20 → 20 bps = score 50, 5 bps = score 97
//
//   Feasibility (separato dai costi)
//   ──────────────────────────────────
//   access:      minPositionEUR <= exposure
//   canTrade:    capital >= marginRequired per position
//   sustainable: totalCostBps < 80
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId } from '@/data/simulator/underlyings';
import type { InstrumentOffer } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

// ── Costanti ─────────────────────────────────────────────────────────
const USD_TO_EUR      = 0.92;   // aggiornare periodicamente
const LOT_SIZE        = 100_000; // unità base FX
const SCORE_HALF_LIFE = 20;      // bps dove score = 50
const k               = Math.LN2 / SCORE_HALF_LIFE;

// ── Futures: parametri per taglia CME FX (EUR/USD come riferimento) ──
const FUTURES_PARAMS: Record<'micro' | 'mini' | 'full', {
  nominalEUR:       number;
  marginEUR:        number;
  tickSizeUSD:      number;  // 1 tick = 0.0001 * lotSize = $12.50 per full
  ticksInSpread:    number;  // tipico per EUR/USD
}> = {
  micro: { nominalEUR: 12_500,  marginEUR: 250,   tickSizeUSD: 1.25,  ticksInSpread: 1 },
  mini:  { nominalEUR: 62_500,  marginEUR: 1_250,  tickSizeUSD: 6.25,  ticksInSpread: 1 },
  full:  { nominalEUR: 125_000, marginEUR: 2_500,  tickSizeUSD: 12.50, ticksInSpread: 1 },
};

// ── Tipi esportati ────────────────────────────────────────────────────
export type Feasibility = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';

export type FeasibilityDetail = {
  access:      boolean;  // minPositionEUR <= exposure
  canTrade:    boolean;  // capitale >= margine per 1 posizione
  sustainable: boolean;  // totalCostBps < 80
  label:       Feasibility;
};

export type CostBreakdown = {
  spreadEUR:        number;
  commissionEUR:    number;
  overnightEUR:     number;
  exchangeFeeEUR:   number;
  rollEUR:          number;
  totalEUR:         number;
  // in bps sul nozionale
  spreadBps:        number;
  commissionBps:    number;
  overnightBps:     number;
  exchangeFeeBps:   number;
  rollBps:          number;
  totalBps:         number;
};

export type SimulatorResult = {
  id:               string;
  instrumentName:   string;
  brokerName:       string;
  accountTypeName:  string;
  score:            number;
  feasibility:      Feasibility;
  feasibilityDetail: FeasibilityDetail;
  costBreakdown:    CostBreakdown;
  lots:             number;      // lotti standard (CFD/Spot)
  contracts:        number;      // contratti (Futures), 0 altrimenti
  contractSize:     'micro' | 'mini' | 'full' | null;
  // legacy flat fields per retrocompatibilità UI
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
  exposure:      number;          // nozionale EUR desiderato
  capital?:      number;          // capitale totale — default = exposure
  assetClass:    AssetClass;
  underlyingId?: UnderlyingId;
  direction?:    TradeDirection;  // default 'long'
  nDaysOpen?:    number;          // giorni medi di holding, default 1
  nTrades?:      number;          // numero operazioni, default 1
};

// ── Helpers ───────────────────────────────────────────────────────────

function ugIdsForAssetClass(ac: AssetClass): string[] {
  switch (ac) {
    case 'FOREX':       return ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'];
    case 'CRYPTO':      return ['ug_crypto_major'];
    case 'INDICES':     return ['ug_indices_eu', 'ug_indices_us'];
    case 'COMMODITIES': return ['ug_commodities_energy', 'ug_commodities_metals'];
    default:            return [];
  }
}

/**
 * Pip value in EUR per lotto per la coppia.
 * USD-quoted: pipValue = 0.0001 * 100_000 * USD_TO_EUR
 * JPY-quoted: pipValue = 0.01   * 100_000 * (1/spot) ≈ approssimazione con USD_TO_EUR
 * Semplificazione v1: usiamo USD_TO_EUR come fattore di conversione per tutte le coppie
 */
function pipValueEURPerLot(quoteCurrency: string): number {
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  return pipSize * LOT_SIZE * USD_TO_EUR;
}

/**
 * Overnight cost in EUR considerando:
 * - long vs short direction
 * - giorni reali (con mercoledì triplo)
 * - offerId overrides > underlying fallback
 */
function calcOvernightEUR(
  offer:         InstrumentOffer,
  underlyingId:  UnderlyingId | undefined,
  direction:     TradeDirection,
  nDaysOpen:     number,
  lots:          number,
  exposureEUR:   number,
): number {
  if (nDaysOpen === 0 || !underlyingId) return 0;

  const underlying  = UNDERLYINGS[underlyingId];
  const overrides   = offer.underlyingOverrides?.[underlyingId];
  const quoteCcy    = underlying?.quoteCurrency ?? 'USD';

  const pipsPerDay  = direction === 'long'
    ? (overrides?.overnightLongPipsPerDay  ?? offer.overnightLongPipsPerDay  ?? underlying?.overnightLongPipsPerDay  ?? 0)
    : (overrides?.overnightShortPipsPerDay ?? offer.overnightShortPipsPerDay ?? underlying?.overnightShortPipsPerDay ?? 0);

  if (pipsPerDay === 0) return 0;

  // Rollover triplo: conta quante notti includono mercoledì
  // Semplificazione: su nDaysOpen > 2, aggiungi 2 notti extra per settimana intera
  const tripleMultiplier = offer.overnightTripleMultiplier ?? 3;
  const extraNights      = nDaysOpen >= 7
    ? Math.floor(nDaysOpen / 7) * (tripleMultiplier - 1)
    : 0;
  const effectiveNights  = nDaysOpen + extraNights;

  const pipValEUR = pipValueEURPerLot(quoteCcy);
  // pipsPerDay può essere positivo (guadagno) o negativo (costo)
  // Restituiamo il costo assoluto: Math.max(0, -pipsPerDay) per costo
  const rawCostEUR = Math.abs(pipsPerDay) * effectiveNights * pipValEUR * lots;
  // Se pipsPerDay > 0 è un ricavo (carry positivo) — per ora conservativo: sommiamo solo i costi
  const isCost = pipsPerDay < 0;
  return isCost ? rawCostEUR : 0; // carry positivo non viene dedotto dal costo totale in v1
}

/** Score esponenziale: 5bps → 97, 20bps → 50, 40bps → 25, 80bps → 6 */
function calcScore(totalCostBps: number): number {
  return Math.round(100 * Math.exp(-k * totalCostBps));
}

/** Converti EUR assoluto in bps sul nozionale */
function toBps(eur: number, exposure: number): number {
  return exposure > 0 ? (eur / exposure) * 10_000 : 0;
}

/** Feasibility separata dal costo */
function calcFeasibility(
  offer:        InstrumentOffer,
  exposure:     number,
  capital:      number,
  totalCostBps: number,
): FeasibilityDetail {
  const marginEUR   = (offer.marginRequirementPct / 100) * exposure;
  const access      = offer.minPositionEUR <= exposure;
  const canTrade    = capital >= marginEUR;
  const sustainable = totalCostBps < 80;

  let label: Feasibility;
  if (!access || !canTrade)           label = 'INFEASIBLE';
  else if (!sustainable)              label = 'WARNING';
  else if (totalCostBps < 15)         label = 'OPTIMAL';
  else if (totalCostBps < 40)         label = 'FEASIBLE';
  else                                label = 'WARNING';

  return { access, canTrade, sustainable, label };
}

// ── CFD / Spot FX cost model ─────────────────────────────────────────

function calcCFDCosts(
  offer:         InstrumentOffer,
  underlyingId:  UnderlyingId | undefined,
  exposure:      number,
  capital:       number,
  direction:     TradeDirection,
  nDaysOpen:     number,
  nTrades:       number,
): CostBreakdown {
  const lots = exposure / LOT_SIZE;

  // ── Spread ──────────────────────────────────────────────────────
  let spreadBps = offer.spreadAvgBps;
  if (underlyingId && offer.underlyingOverrides?.[underlyingId]?.spreadAvgBps != null) {
    spreadBps = offer.underlyingOverrides[underlyingId]!.spreadAvgBps!;
  }
  const spreadEUR = (spreadBps / 10_000) * exposure * nTrades;

  // ── Commission ──────────────────────────────────────────────────
  // REGOLA: calcola USD first, converti in EUR alla fine
  let commissionUSD = 0;
  if (offer.commissionPerLotUSD != null) {
    commissionUSD = offer.commissionPerLotUSD * lots * nTrades;
  } else if (offer.commissionPerLotEUR != null) {
    // già in EUR, saltiamo la conversione
    const commissionEURDirect = offer.commissionPerLotEUR * lots * nTrades;
    const commBps = toBps(commissionEURDirect, exposure);
    // Overnight
    const overnightEUR = calcOvernightEUR(offer, underlyingId, direction, nDaysOpen, lots, exposure);
    const totalEUR     = spreadEUR + commissionEURDirect + overnightEUR;
    return {
      spreadEUR,    commissionEUR: commissionEURDirect,    overnightEUR, exchangeFeeEUR: 0, rollEUR: 0,
      totalEUR,
      spreadBps:    toBps(spreadEUR, exposure),
      commissionBps: commBps,
      overnightBps:  toBps(overnightEUR, exposure),
      exchangeFeeBps: 0,
      rollBps:        0,
      totalBps:       toBps(totalEUR, exposure),
    };
  }
  const commissionEUR = commissionUSD * USD_TO_EUR;

  // ── Overnight ───────────────────────────────────────────────────
  // Intraday: se l'utente tiene < 1 giorno, overnight = 0
  const effectiveDays = (
    offer.compatibleHorizons.includes('intraday') &&
    nDaysOpen <= 1
  ) ? 0 : nDaysOpen;
  const overnightEUR = calcOvernightEUR(offer, underlyingId, direction, effectiveDays, lots, exposure);

  const totalEUR = spreadEUR + commissionEUR + overnightEUR;

  return {
    spreadEUR,
    commissionEUR,
    overnightEUR,
    exchangeFeeEUR: 0,
    rollEUR:        0,
    totalEUR,
    spreadBps:      toBps(spreadEUR,      exposure),
    commissionBps:  toBps(commissionEUR,  exposure),
    overnightBps:   toBps(overnightEUR,   exposure),
    exchangeFeeBps: 0,
    rollBps:        0,
    totalBps:       toBps(totalEUR,       exposure),
  };
}

// ── Futures cost model (tick-based) ──────────────────────────────────

function calcFuturesCosts(
  offer:       InstrumentOffer,
  capital:     number,
  nDaysOpen:   number,
  nTrades:     number,
): { breakdown: CostBreakdown; contracts: number; contractSize: 'micro' | 'mini' | 'full' | null } {
  // Seleziona la taglia più grande accessibile con il 30% del capitale come margine
  const sizes = (['full', 'mini', 'micro'] as const).filter(sz => {
    const available = offer.availableContractSizes?.includes(sz) ?? false;
    if (!available) return false;
    return capital * 0.3 >= FUTURES_PARAMS[sz].marginEUR;
  });

  if (sizes.length === 0) {
    // Nessuna taglia accessibile
    const zero: CostBreakdown = {
      spreadEUR: 0, commissionEUR: 0, overnightEUR: 0,
      exchangeFeeEUR: 0, rollEUR: 0, totalEUR: 0,
      spreadBps: 0, commissionBps: 0, overnightBps: 0,
      exchangeFeeBps: 0, rollBps: 0, totalBps: 0,
    };
    return { breakdown: zero, contracts: 0, contractSize: null };
  }

  const selectedSize = sizes[0]; // la più grande accessibile
  const params       = FUTURES_PARAMS[selectedSize];
  const contracts    = Math.max(1, Math.floor((capital * 0.3) / params.marginEUR));
  const nominalEUR   = contracts * params.nominalEUR;

  // Spread (tick-based)
  const spreadEUR = contracts * params.tickSizeUSD * params.ticksInSpread * USD_TO_EUR * nTrades;

  // Commission broker
  let commissionEUR = 0;
  if (offer.commissionPerContractEUR != null) {
    commissionEUR = offer.commissionPerContractEUR * contracts * nTrades;
  } else if (offer.commissionPerContractUSD != null) {
    commissionEUR = offer.commissionPerContractUSD * contracts * nTrades * USD_TO_EUR;
  }

  // Exchange fee CME (separata)
  let exchangeFeeEUR = 0;
  if (offer.exchangeFeePerContractEUR != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractEUR * contracts * nTrades;
  } else if (offer.exchangeFeePerContractUSD != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractUSD * contracts * nTrades * USD_TO_EUR;
  }

  // Roll cost — appended se holdingDays > rollFrequencyDays
  let rollEUR = 0;
  if (offer.rollSpreadBps != null && offer.rollFrequencyDays != null && nDaysOpen > offer.rollFrequencyDays) {
    const rolls    = Math.floor(nDaysOpen / offer.rollFrequencyDays);
    rollEUR        = (offer.rollSpreadBps / 10_000) * nominalEUR * rolls;
  }

  const totalEUR = spreadEUR + commissionEUR + exchangeFeeEUR + rollEUR;

  return {
    contracts,
    contractSize: selectedSize,
    breakdown: {
      spreadEUR,
      commissionEUR,
      overnightEUR:   0, // futures: costo nel basis, non overnight
      exchangeFeeEUR,
      rollEUR,
      totalEUR,
      spreadBps:      toBps(spreadEUR,      nominalEUR),
      commissionBps:  toBps(commissionEUR,  nominalEUR),
      overnightBps:   0,
      exchangeFeeBps: toBps(exchangeFeeEUR, nominalEUR),
      rollBps:        toBps(rollEUR,        nominalEUR),
      totalBps:       toBps(totalEUR,       nominalEUR),
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
}: EngineInput): SimulatorResult[] {
  if (exposure < 100) return [];
  const effectiveCapital = capital ?? exposure;
  const ugIds = ugIdsForAssetClass(assetClass);

  const compatibleOffers = INSTRUMENT_OFFERS.filter(offer =>
    offer.ugIds.some(ug => ugIds.includes(ug)) &&
    offer.minPositionEUR <= exposure,
  );

  if (compatibleOffers.length === 0) return [];

  const results: SimulatorResult[] = compatibleOffers.flatMap(offer => {
    const broker    = BROKERS[offer.brokerId];
    const isFutures = offer.instrumentTypeId === 'futures_std';

    let breakdown:   CostBreakdown;
    let contracts    = 0;
    let contractSize: 'micro' | 'mini' | 'full' | null = null;

    if (isFutures) {
      const res  = calcFuturesCosts(offer, effectiveCapital, nDaysOpen, nTrades);
      breakdown  = res.breakdown;
      contracts  = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return []; // taglia non accessibile → escludi
    } else {
      breakdown = calcCFDCosts(offer, underlyingId, exposure, effectiveCapital, direction, nDaysOpen, nTrades);
    }

    const totalCostBps    = breakdown.totalBps;
    const feasDetail      = calcFeasibility(offer, exposure, effectiveCapital, totalCostBps);
    const score           = calcScore(totalCostBps);
    const lots            = isFutures ? 0 : exposure / LOT_SIZE;

    return [{
      id:              `${offer.brokerId}_${offer.accountTypeId}_${offer.instrumentTypeId}`,
      instrumentName:  offer.instrumentTypeId,
      brokerName:      broker?.name ?? offer.brokerId,
      accountTypeName: offer.accountTypeId,
      score,
      feasibility:     feasDetail.label,
      feasibilityDetail: feasDetail,
      costBreakdown:   breakdown,
      lots,
      contracts,
      contractSize,
      // legacy flat
      spreadCostBps:     breakdown.spreadBps,
      commissionCostBps: breakdown.commissionBps,
      overnightCostBps:  breakdown.overnightBps,
      totalCostBps,
      spreadCost:        breakdown.spreadEUR,
      commissionCost:    breakdown.commissionEUR,
      overnightCost:     breakdown.overnightEUR,
      slippageCost:      0,
      achievableExposure: isFutures ? contracts * (FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR) : exposure,
      deviationPct:      0,
    }] satisfies SimulatorResult[];
  });

  return results.sort((a, b) => b.score - a.score);
}
