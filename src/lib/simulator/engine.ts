// ============================================================
// SIMULATOR ENGINE — motore di calcolo costi reale
//
// Legge INSTRUMENT_OFFERS e UNDERLYINGS per produrre
// SimulatorResult[] ordinati per score.
//
// Modello costi (v1 — FX CFD/ECN):
//   totalCostBps = spreadBps + commissionBps + overnightBps
//
// overnightBps:
//   - usa underlyingOverrides[underlyingId] se presente
//   - altrimenti usa i pips da UNDERLYINGS come fallback
//   - per horizons intraday → overnight = 0
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId } from '@/data/simulator/underlyings';
import type { InstrumentOffer } from '@/data/simulator/schema/offer.types';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

// USD → EUR conversion rate (aggiornare periodicamente)
const USD_TO_EUR = 0.92;

// Lot size standard FX = 100.000 unità valuta base
const LOT_SIZE = 100_000;

export type SimulatorResult = {
  id:                  string;
  instrumentName:      string;
  brokerName:          string;
  accountTypeName:     string;
  score:               number;
  feasibility:         Feasibility;
  spreadCostBps:       number;
  commissionCostBps:   number;
  overnightCostBps:    number;
  totalCostBps:        number;
  // legacy fields per compatibilità UI esistente
  spreadCost:          number;
  commissionCost:      number;
  overnightCost:       number;
  slippageCost:        number;
  achievableExposure:  number;
  deviationPct:        number;
};

export type EngineInput = {
  exposure:      number;       // EUR nozionale desiderato
  assetClass:    AssetClass;
  underlyingId?: UnderlyingId; // coppia specifica (opzionale)
  nDaysOpen?:    number;       // giorni medi di holding (default 1)
  nTrades?:      number;       // numero operazioni (default 1)
};

// ── Utility: converti pip overhead in bps sul nozionale ──────
// Per FX: 1 pip = 0.0001 per JPY-quoted = 0.01
// pip_value_per_lot = pip_size * lot_size (in quote currency)
// Per semplificare: 1 pip su 1 lot EUR/USD = $10 → su nozionale exposure
// overnightBps = |pipsPerDay * nDays| * pipValueEUR / exposure * 10000
function overnightToBps(
  pipsPerDay:  number,
  nDays:       number,
  exposure:    number,
  quoteCurrency: string,
): number {
  if (nDays === 0 || pipsPerDay === 0) return 0;
  // pip size: JPY-quoted = 0.01, else 0.0001
  const pipSize     = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  // pip value per lot in quote currency
  const pipValueQC  = pipSize * LOT_SIZE;
  // lots in trade
  const lots        = exposure / LOT_SIZE;
  // total overnight cost in quote currency
  const costQC      = Math.abs(pipsPerDay) * nDays * pipValueQC * lots;
  // convert to EUR (rough: if USD-quoted use USD_TO_EUR, else treat 1:1)
  const costEUR     = quoteCurrency === 'USD' ? costQC * USD_TO_EUR : costQC * USD_TO_EUR;
  // express as bps of exposure
  return (costEUR / exposure) * 10_000;
}

// ── Utility: commission in bps ────────────────────────────────
function commissionToBps(
  offer:    InstrumentOffer,
  exposure: number,
): number {
  const lots = exposure / LOT_SIZE;
  // per lot USD (es. Tickmill Pro: $6 RT)
  if (offer.commissionPerLotUSD != null) {
    const costEUR = offer.commissionPerLotUSD * lots * USD_TO_EUR;
    return (costEUR / exposure) * 10_000;
  }
  // per lot EUR
  if (offer.commissionPerLotEUR != null) {
    const costEUR = offer.commissionPerLotEUR * lots;
    return (costEUR / exposure) * 10_000;
  }
  return 0;
}

// ── Feasibility da totalCostBps ───────────────────────────────
function toFeasibility(bps: number, exposure: number, minPos: number): Feasibility {
  if (exposure < minPos)   return 'INFEASIBLE';
  if (bps < 15)            return 'OPTIMAL';
  if (bps < 40)            return 'FEASIBLE';
  if (bps < 80)            return 'WARNING';
  return 'INFEASIBLE';
}

// ── Score 0–100 (inverso di costo) ───────────────────────────
function toScore(bps: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - bps * 1.5)));
}

// ── Mappa AssetClass → ugIds compatibili ─────────────────────
function ugIdsForAssetClass(ac: AssetClass): string[] {
  switch (ac) {
    case 'FOREX':  return ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'];
    case 'CRYPTO': return ['ug_crypto_major'];
    case 'INDICES': return ['ug_indices_eu', 'ug_indices_us'];
    case 'COMMODITIES': return ['ug_commodities_energy', 'ug_commodities_metals'];
    default: return [];
  }
}

// ── Engine principale ─────────────────────────────────────────
export function runEngine({
  exposure,
  assetClass,
  underlyingId,
  nDaysOpen = 1,
  nTrades   = 1,
}: EngineInput): SimulatorResult[] {
  if (exposure < 100) return [];

  const ugIds = ugIdsForAssetClass(assetClass);

  // Filtra le offer compatibili con assetClass
  const compatibleOffers = INSTRUMENT_OFFERS.filter(offer =>
    offer.ugIds.some(ug => ugIds.includes(ug)) &&
    offer.minPositionEUR <= exposure,
  );

  if (compatibleOffers.length === 0) return [];

  const results: SimulatorResult[] = compatibleOffers.map(offer => {
    const broker = BROKERS[offer.brokerId];
    const brokerName = broker?.name ?? offer.brokerId;

    // ── Spread bps ────────────────────────────────────────────
    let spreadBps = offer.spreadAvgBps;
    // Se c'è un override per la coppia selezionata, usalo
    if (underlyingId && offer.underlyingOverrides?.[underlyingId]?.spreadAvgBps != null) {
      spreadBps = offer.underlyingOverrides[underlyingId]!.spreadAvgBps!;
    }
    const spreadCostBps = spreadBps * nTrades;

    // ── Commission bps ────────────────────────────────────────
    const commissionCostBps = commissionToBps(offer, exposure) * nTrades;

    // ── Overnight bps ─────────────────────────────────────────
    let overnightCostBps = 0;
    // Intraday = 0 notti → nessun overnight
    const effectiveDays = offer.compatibleHorizons.includes('intraday') && nDaysOpen === 1
      ? 0
      : nDaysOpen;

    if (effectiveDays > 0 && underlyingId) {
      const underlying = UNDERLYINGS[underlyingId];
      const overrides  = offer.underlyingOverrides?.[underlyingId];
      // long overnight (prendiamo il valore più sfavorevole come worst-case)
      const pipsPerDay = overrides?.overnightLongPipsPerDay
        ?? underlying?.overnightLongPipsPerDay
        ?? 0;
      overnightCostBps = overnightToBps(
        pipsPerDay,
        effectiveDays,
        exposure,
        underlying?.quoteCurrency ?? 'USD',
      );
    }

    const totalCostBps = spreadCostBps + commissionCostBps + overnightCostBps;
    const feasibility  = toFeasibility(totalCostBps, exposure, offer.minPositionEUR);
    const score        = toScore(totalCostBps);

    // Valori assoluti EUR per compatibilità UI
    const spreadCostEUR     = (spreadCostBps     / 10_000) * exposure;
    const commissionCostEUR = (commissionCostBps / 10_000) * exposure;
    const overnightCostEUR  = (overnightCostBps  / 10_000) * exposure;

    return {
      id:                 `${offer.brokerId}_${offer.accountTypeId}_${offer.instrumentTypeId}`,
      instrumentName:     offer.instrumentTypeId,
      brokerName,
      accountTypeName:    offer.accountTypeId,
      score,
      feasibility,
      spreadCostBps,
      commissionCostBps,
      overnightCostBps,
      totalCostBps,
      // legacy
      spreadCost:         spreadCostEUR,
      commissionCost:     commissionCostEUR,
      overnightCost:      overnightCostEUR,
      slippageCost:       0,
      achievableExposure: exposure,
      deviationPct:       0,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}
