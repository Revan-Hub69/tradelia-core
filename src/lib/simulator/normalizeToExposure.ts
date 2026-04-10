// ============================================================
// NORMALIZE TO EXPOSURE — SOTA exposure normalization engine
//
// Problema risolto:
//   Il RankedResult.totalCostBps è calcolato sul nozionale del
//   singolo strumento — non comparabile cross-strumento perché
//   ogni strumento ha contract size / lot size diverso.
//
// Soluzione:
//   1. Utente fornisce targetExposureEUR (quanto vuole muovere)
//   2. Per ogni strumento: calcola unitsNeeded + achievableExposure
//   3. Normalizza i costi su achievableExposure (non su target)
//   4. Salva exposureDeviationPct per il ranking con penalità
//   5. Mai scartare strumenti troppo presto: se unitsNeeded=0
//      → expose minViableExposureEUR come suggerimento
// ============================================================

import type { InstrumentType, InstrumentTypeId } from '../../data/simulator/instruments';
import type { RankedResult } from '../../data/simulator/schema/offer.types';

// ── Configurazione granularità per tipo strumento ────────────
//
// notionalGranularity:
//   'fractional'     → divisibile liberamente (CFD, crypto perp, spot FX)
//   'unit'           → 1 unit minima (ETF/ETC su borsa, ETP crypto)
//   'lot_100k'       → lotto standard FX = 100k unità base
//   'contract_fixed' → contratto fisso NON frazionabile (futures std)
//
// minUnitNotionalEUR: dimensione di 1 unità/contratto/lotto in EUR
//   Il valore è DINAMICO: deve essere calcolato a runtime con il
//   prezzo corrente dell'asset (vedi getNotionalPerUnit).
//   Questa mappa contiene i valori di fallback statici per l'MVP.
//
// NOTA IMPORTANTE:
//   NON usare valori statici in produzione — usare sempre
//   getNotionalPerUnit(instrumentTypeId, currentPriceEUR) che
//   accetta il prezzo live dal feed market data.
// ============================================================

export type NotionalGranularity =
  | 'fractional'      // CFD, crypto perp/spot, spot FX — divisibile liberamente
  | 'unit'            // ETF/ETC/ETP — 1 quota/azione minima
  | 'lot_100k'        // Spot FX OTC, CFD ECN FX — 1 lotto = 100k unità base
  | 'contract_fixed'; // Futures std/micro, crypto futures — non frazionabile

interface InstrumentGranularityConfig {
  granularity: NotionalGranularity;
  /** Notionale di 1 unità in EUR — FALLBACK STATICO per MVP.
   *  In produzione: sostituire con getNotionalPerUnit(id, price). */
  fallbackUnitNotionalEUR: number;
}

const GRANULARITY_CONFIG: Record<InstrumentTypeId, InstrumentGranularityConfig> = {
  // Spot FX OTC — 1 lotto standard = 100k unità base
  // EUR/USD: 1 lotto = €100k. USD/JPY: ≈ €90k a seconda del cambio.
  spot_fx:        { granularity: 'lot_100k',       fallbackUnitNotionalEUR: 100_000 },

  // CFD — frazionabile (micro-lotti disponibili su tutti i broker retail)
  cfd_dd:         { granularity: 'fractional',     fallbackUnitNotionalEUR: 1_000 },
  cfd_ecn:        { granularity: 'fractional',     fallbackUnitNotionalEUR: 1_000 },

  // Futures Standard — NON frazionabile
  // ES (S&P500): ≈$230k. 6E (EUR/USD): ≈€125k. GC (Gold): ≈$290k.
  // Valori di fallback approssimati — DEVONO essere overridati con prezzo live.
  futures_std:    { granularity: 'contract_fixed', fallbackUnitNotionalEUR: 130_000 },

  // Micro Futures — 1/10 del futures std
  futures_micro:  { granularity: 'contract_fixed', fallbackUnitNotionalEUR: 13_000 },

  // ETF/ETC a leva — 1 quota minima (su Xetra tipicamente €1–50)
  etf_leveraged:  { granularity: 'unit',           fallbackUnitNotionalEUR: 10 },
  etc_leveraged:  { granularity: 'unit',           fallbackUnitNotionalEUR: 10 },
  etc_physical:   { granularity: 'unit',           fallbackUnitNotionalEUR: 20 },

  // Certificati strutturati — granularità issuer-priced
  // In pratica frazionabili per valore del certificato (es. €1–5 per certificate)
  turbo_ko:       { granularity: 'unit',           fallbackUnitNotionalEUR: 5 },
  mini_future:    { granularity: 'unit',           fallbackUnitNotionalEUR: 5 },
  leva_fissa:     { granularity: 'unit',           fallbackUnitNotionalEUR: 5 },

  // Crypto — frazionabile (exchange native supporta dimensioni arbitrarie)
  crypto_spot:    { granularity: 'fractional',     fallbackUnitNotionalEUR: 1 },
  crypto_perp:    { granularity: 'fractional',     fallbackUnitNotionalEUR: 1 },
  crypto_futures: { granularity: 'contract_fixed', fallbackUnitNotionalEUR: 100 },
  crypto_cfd:     { granularity: 'fractional',     fallbackUnitNotionalEUR: 1 },
  crypto_etp:     { granularity: 'unit',           fallbackUnitNotionalEUR: 15 },
};

// ── Calcolo dinamico del notionale per unità ─────────────────
//
// In produzione: currentPriceEUR proviene dal feed market data.
// Il chiamante deve passare il prezzo corrente dell'underlying
// per ottenere un risultato market-consistent.
//
// Per ora accetta un override opzionale; se non fornito usa
// il fallback statico della config.
export function getNotionalPerUnit(
  instrumentTypeId: InstrumentTypeId,
  currentPriceEUR?: number,
): number {
  const config = GRANULARITY_CONFIG[instrumentTypeId];
  // Se il chiamante fornisce il prezzo live → usa quello
  // Questo hook è il punto di estensione per il feed market data
  if (currentPriceEUR !== undefined && currentPriceEUR > 0) {
    // Per strumenti con granularità 'fractional' il notionale per "unità"
    // non ha senso fisso → restituiamo 1 EUR (divisibile liberamente)
    if (config.granularity === 'fractional') return 1;
    return currentPriceEUR;
  }
  return config.fallbackUnitNotionalEUR;
}

// ── Tipi di output ────────────────────────────────────────────

export type ExposureFeasibility = {
  /** false se unitsNeeded arrotondato a 0 (contratto troppo grande per il target) */
  executable: boolean;
  /** true se l'offer.minPositionEUR supera il targetExposureEUR */
  minSizeViolated: boolean;
  /** Esposizione minima raggiungibile con 1 unità (solo per non-executable) */
  minViableExposureEUR: number | null;
};

export type ExposureWarnings = {
  /** true se l'arrotondamento ha prodotto più del 5% di deviazione */
  rounding: boolean;
  /** true se |exposureDeviationPct| > 20% */
  largeDeviation: boolean;
  /** true se lo strumento non è frazionabile e il target non è multiplo esatto */
  notFractionallyDivisible: boolean;
};

export type NormalizedExposureResult = {
  // ── Input ────────────────────────────────────────────────
  targetExposureEUR: number;

  // ── Esposizione raggiungibile ─────────────────────────────
  /** Numero di unità/contratti/lotti necessari (post-rounding) */
  unitsNeeded: number;
  /** Esposizione effettiva dopo arrotondamento al granulo minimo */
  achievableExposureEUR: number;
  /** (achievable - target) / target — CRITICO per il ranking */
  exposureDeviationPct: number;

  // ── Costi normalizzati su achievableExposure ─────────────
  /** Costo totale in EUR su questa esposizione (da RankedResult.totalCostBps) */
  totalCostEUR: number;
  /** Costi in bps normalizzati su achievableExposureEUR — COMPARABILE cross-strumento */
  totalCostBps: number;
  /** Breakdown costi in EUR su questa esposizione */
  costBreakdownEUR: {
    spreadEUR:     number;
    commissionEUR: number;
    overnightEUR:  number;
    fundingEUR:    number;
    rebasingEUR:   number;
    fxEUR:         number;
    otherEUR:      number;
  };

  // ── Feasibility & Warnings ────────────────────────────────
  feasibility: ExposureFeasibility;
  warnings: ExposureWarnings;
};

// ── Helper interni ───────────────────────────────────────────

/** Arrotonda unitsNeeded in base alla granularità dello strumento */
function roundUnits(
  rawUnits: number,
  granularity: NotionalGranularity,
): number {
  switch (granularity) {
    case 'fractional':
      // Frazionabile liberamente → nessun arrotondamento
      // Limitiamo a 8 decimali per evitare floating point noise
      return Math.round(rawUnits * 1e8) / 1e8;

    case 'unit':
      // ETF/ETC/ETP/certificati → intero (non si compra 0.5 quote)
      return Math.floor(rawUnits);

    case 'lot_100k':
      // Spot FX / CFD ECN — 0.01 lotti come minimo (micro-lot)
      // Arrotonda al centesimo di lotto
      return Math.floor(rawUnits * 100) / 100;

    case 'contract_fixed':
      // Futures, crypto futures — solo interi
      return Math.floor(rawUnits);
  }
}

/** Converte bps in EUR su una data esposizione */
function bpsToEUR(bps: number, exposureEUR: number): number {
  return (bps / 10_000) * exposureEUR;
}

// ── Funzione principale ───────────────────────────────────────

/**
 * normalizeToExposure
 *
 * Prende un RankedResult (già calcolato dal motore simulatore)
 * e lo normalizza rispetto a targetExposureEUR fornito dall'utente.
 *
 * @param result          RankedResult dal motore di ranking
 * @param instrument      InstrumentType dell'offerta
 * @param targetExposureEUR  Esposizione nozionale target in EUR
 * @param currentPriceEUR   Prezzo corrente dell'underlying in EUR
 *                          (opzionale — usa fallback statico se non fornito)
 * @returns NormalizedExposureResult pronto per computeInstrumentScore
 */
export function normalizeToExposure(
  result: RankedResult,
  instrument: InstrumentType,
  targetExposureEUR: number,
  currentPriceEUR?: number,
): NormalizedExposureResult {
  const config = GRANULARITY_CONFIG[instrument.id];
  const unitNotionalEUR = getNotionalPerUnit(instrument.id, currentPriceEUR);

  // ── 1. Calcola unitsNeeded grezzi (pre-rounding) ──────────
  const rawUnits = targetExposureEUR / unitNotionalEUR;
  const roundedUnits = roundUnits(rawUnits, config.granularity);

  // ── 2. Calcola achievableExposure ─────────────────────────
  const achievableExposureEUR = roundedUnits * unitNotionalEUR;

  // ── 3. Deviation dal target ───────────────────────────────
  const exposureDeviationPct =
    targetExposureEUR > 0
      ? (achievableExposureEUR - targetExposureEUR) / targetExposureEUR
      : 0;

  // ── 4. Feasibility ────────────────────────────────────────
  const executable = roundedUnits > 0;
  const minSizeViolated =
    result.offer.minPositionEUR !== undefined &&
    result.offer.minPositionEUR > targetExposureEUR;

  const minViableExposureEUR = executable ? null : unitNotionalEUR;

  const feasibility: ExposureFeasibility = {
    executable,
    minSizeViolated,
    minViableExposureEUR,
  };

  // ── 5. Costi normalizzati su achievableExposure ───────────
  // IMPORTANTE: normalizziamo su achievableExposure (non su target)
  // perché il trader paga i costi sull'esposizione effettiva,
  // non su quella desiderata.
  //
  // Se non executable → i costi sono 0 (posizione non apribile)
  let totalCostBpsNorm = 0;
  let totalCostEUR = 0;
  const costBreakdownEUR = {
    spreadEUR: 0, commissionEUR: 0, overnightEUR: 0,
    fundingEUR: 0, rebasingEUR: 0, fxEUR: 0, otherEUR: 0,
  };

  if (executable && achievableExposureEUR > 0) {
    // Il RankedResult.totalCostBps è già calcolato sul nozionale
    // dello strumento — qui lo ricavoiamo in EUR assoluti e
    // poi lo renormalizziamo su achievableExposure.
    //
    // Ratio: quante volte la nostra achievableExposure è multipla
    // del nozionale su cui il motore ha calcolato i bps
    // (che è 1 lotto / 1 contratto / 1 unità = unitNotionalEUR)
    const scaleFactor = achievableExposureEUR / unitNotionalEUR;

    // Costo assoluto in EUR = bps/10000 * unitNotionalEUR * scaleFactor
    // = bps/10000 * achievableExposureEUR ← semplificato
    totalCostEUR = bpsToEUR(result.totalCostBps, achievableExposureEUR);

    // Re-normalizziamo in bps su achievableExposure
    // (risultato identico a totalCostBps dell'offer, ma ora la base è univoca)
    totalCostBpsNorm = result.totalCostBps;

    // Breakdown in EUR
    const bd = result.costBreakdown;
    costBreakdownEUR.spreadEUR     = bpsToEUR(bd.spreadBps,     achievableExposureEUR);
    costBreakdownEUR.commissionEUR = bpsToEUR(bd.commissionBps, achievableExposureEUR);
    costBreakdownEUR.overnightEUR  = bpsToEUR(bd.overnightBps,  achievableExposureEUR);
    costBreakdownEUR.fundingEUR    = bpsToEUR(bd.fundingBps,    achievableExposureEUR);
    costBreakdownEUR.rebasingEUR   = bpsToEUR(bd.rebasingBps,   achievableExposureEUR);
    costBreakdownEUR.fxEUR         = bpsToEUR(bd.fxBps,         achievableExposureEUR);
    costBreakdownEUR.otherEUR      = bpsToEUR(bd.otherBps,      achievableExposureEUR);
  }

  // ── 6. Warnings ───────────────────────────────────────────
  const absDeviation = Math.abs(exposureDeviationPct);
  const warnings: ExposureWarnings = {
    rounding:                  absDeviation > 0.05,
    largeDeviation:            absDeviation > 0.20,
    notFractionallyDivisible:  config.granularity === 'contract_fixed' && rawUnits !== Math.floor(rawUnits),
  };

  return {
    targetExposureEUR,
    unitsNeeded:           roundedUnits,
    achievableExposureEUR,
    exposureDeviationPct,
    totalCostEUR,
    totalCostBps:          totalCostBpsNorm,
    costBreakdownEUR,
    feasibility,
    warnings,
  };
}
