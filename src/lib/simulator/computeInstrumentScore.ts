// ============================================================
// COMPUTE INSTRUMENT SCORE — quant-desk scoring engine
//
// Problema risolto:
//   Non si può sortare per totalCostBps quando le esposizioni
//   achievable divergono dal target. Un CFD con 0% deviation e
//   un futures micro con +150% deviation non sono comparabili
//   con un semplice sort su costo.
//
// Soluzione SOTA:
//   score = costScore
//         - penalty(exposureDeviation)
//         - penalty(nonExecutable)
//         - penalty(capitalInefficiency)
//
// Output:
//   InstrumentScoreResult — pronto per sort() e render nel ranking
// ============================================================

import type { RankedResult } from '../../data/simulator/schema/offer.types';
import type { NormalizedExposureResult } from './normalizeToExposure';

// ── Costanti di tuning delle penalità ─────────────────────────
//
// Questi parametri sono il "cuore quantitativo" del ranking.
// Valori calibrati per riflettere la percezione di un trader retail:
//   - Il costo è il fattore dominante (peso 1.0)
//   - La deviation dall'esposizione target è penalizzata in modo
//     non lineare (quadratica per deviazioni grandi)
//   - L'inefficienza di capitale (margine immobilizzato) penalizza
//     strumenti che richiedono troppo margine per la stessa esposizione
//
// TUNING: modificare questi valori per calibrare il ranking.
// In produzione: possono essere esposti come config dell'utente.
const PENALTY_CONFIG = {
  /** Moltiplicatore penalità deviazione esposizione.
   *  Formula: penalty = k_dev * deviationPct^2
   *  A 20% deviation → penalty = 0.5 * 0.04 = 0.02 (2 bps aggiuntivi su 100)
   *  A 50% deviation → penalty = 0.5 * 0.25 = 0.125 (12.5 bps)
   *  A 100% deviation → penalty = 0.5 * 1.0 = 0.50 (50 bps)
   */
  k_deviation: 0.5,

  /** Score assegnato agli strumenti non eseguibili.
   *  -Infinity garantisce che vengano sempre messi in fondo.
   *  Usiamo un valore finito molto basso per permettere
   *  ugualmente un ordinamento tra non-executable (per il
   *  messaggio "minimum viable exposure"). */
  nonExecutableScore: -1_000_000,

  /** Soglia oltre la quale lo strumento è considerato
   *  "capital inefficient" — margine immobilizzato / esposizione.
   *  Default 20%: se serve più del 20% di margine sul nozionale
   *  rispetto alla media degli strumenti, viene penalizzato. */
  capitalEfficiencyThresholdPct: 0.20,

  /** Penalità per capitale inefficiente (in unità di bps equivalenti).
   *  Aggiunta allo score negativo se marginRequirementPct > soglia. */
  k_capitalInefficiency: 5.0,
} as const;

// ── Tipi di output ────────────────────────────────────────────

export type ScoreComponents = {
  /** Costo base in bps (normalizzato su achievableExposure) — componente principale */
  costBps:               number;
  /** Penalità deviazione esposizione — non lineare (quadratica) */
  deviationPenaltyBps:   number;
  /** Penalità efficienza capitale — 0 se marginRequirementPct nella norma */
  capitalPenaltyBps:     number;
  /** Score finale = -costBps - deviationPenaltyBps - capitalPenaltyBps
   *  (negativo: più alto in valore assoluto = peggio) */
  finalScore:            number;
};

export type ExecutabilityInfo = {
  executable:           boolean;
  /** Motivo di non esecutabilità, se presente */
  reason:               'not_executable' | 'min_size_violated' | null;
  /** Esposizione minima raggiungibile — da mostrare in UX come suggerimento */
  minViableExposureEUR: number | null;
};

export type InstrumentScoreResult = {
  // ── Identificazione ─────────────────────────────────────
  brokerId:        string;
  accountTypeId:   string;
  instrumentTypeId: string;

  // ── Esposizione normalizzata ─────────────────────────────
  normalized: NormalizedExposureResult;

  // ── Score breakdown ─────────────────────────────────────
  score: ScoreComponents;

  // ── Executability info ───────────────────────────────────
  executability: ExecutabilityInfo;

  // ── Flag per il rendering UI ─────────────────────────────
  isRecommended:  boolean;   // top pick nella sua categoria
  hasCaveats:     boolean;   // warnings attivi (deviation, capital, etc.)
};

// ── Funzione principale ───────────────────────────────────────

/**
 * computeInstrumentScore
 *
 * Prende un RankedResult + il suo NormalizedExposureResult e
 * produce un InstrumentScoreResult con uno score finale comparabile
 * tra tutti gli strumenti sullo stesso underlying.
 *
 * @param result      RankedResult dal motore di ranking
 * @param normalized  Output di normalizeToExposure per questo result
 * @returns InstrumentScoreResult pronto per sort e render
 */
export function computeInstrumentScore(
  result: RankedResult,
  normalized: NormalizedExposureResult,
): InstrumentScoreResult {
  const { feasibility, warnings, exposureDeviationPct, totalCostBps } = normalized;

  // ── 1. Non executable → score minimo ──────────────────────
  if (!feasibility.executable) {
    const reason: ExecutabilityInfo['reason'] = feasibility.minSizeViolated
      ? 'min_size_violated'
      : 'not_executable';

    return {
      brokerId:        result.offer.brokerId,
      accountTypeId:   result.offer.accountTypeId,
      instrumentTypeId: result.offer.instrumentTypeId,
      normalized,
      score: {
        costBps:             0,
        deviationPenaltyBps: 0,
        capitalPenaltyBps:   0,
        finalScore:          PENALTY_CONFIG.nonExecutableScore,
      },
      executability: {
        executable:           false,
        reason,
        minViableExposureEUR: feasibility.minViableExposureEUR,
      },
      isRecommended: false,
      hasCaveats:    true,
    };
  }

  // ── 2. Cost score ─────────────────────────────────────────
  const costBps = totalCostBps;

  // ── 3. Deviation penalty (quadratica) ─────────────────────
  // Usiamo il quadrato della deviazione assoluta:
  //   - Deviazioni piccole (<5%) → penalità quasi irrilevante
  //   - Deviazioni grandi (>20%) → penalità cresce rapidamente
  // Moltiplichiamo per 10_000 per convertire in bps equivalenti.
  const absDeviation = Math.abs(exposureDeviationPct);
  const deviationPenaltyBps =
    PENALTY_CONFIG.k_deviation * Math.pow(absDeviation, 2) * 10_000;

  // ── 4. Capital efficiency penalty ─────────────────────────
  // Se il margine richiesto è sopra la soglia → penalità fissa.
  // Rilevante principalmente per futures (initial margin elevato)
  // e turbo KO vicini al barrier.
  const marginPct = result.offer.marginRequirementPct / 100;
  const capitalPenaltyBps =
    marginPct > PENALTY_CONFIG.capitalEfficiencyThresholdPct
      ? PENALTY_CONFIG.k_capitalInefficiency
      : 0;

  // ── 5. Final score ─────────────────────────────────────────
  // Convention: score più alto = meglio.
  // Partiamo da 0 e sottraiamo i costi + penalità.
  // (score = -totalCost in bps equivalenti)
  const finalScore = -(costBps + deviationPenaltyBps + capitalPenaltyBps);

  // ── 6. Executability info ─────────────────────────────────
  const executability: ExecutabilityInfo = {
    executable:           true,
    reason:               null,
    minViableExposureEUR: null,
  };

  // ── 7. Flags UI ───────────────────────────────────────────
  const hasCaveats =
    warnings.rounding ||
    warnings.largeDeviation ||
    warnings.notFractionallyDivisible ||
    result.warnings.length > 0;

  return {
    brokerId:        result.offer.brokerId,
    accountTypeId:   result.offer.accountTypeId,
    instrumentTypeId: result.offer.instrumentTypeId,
    normalized,
    score: {
      costBps,
      deviationPenaltyBps,
      capitalPenaltyBps,
      finalScore,
    },
    executability,
    isRecommended: false, // sarà settato dal caller dopo il sort
    hasCaveats,
  };
}

// ── Funzione di aggregazione: rank multipli risultati ────────

/**
 * rankInstrumentScores
 *
 * Prende un array di InstrumentScoreResult (già calcolati)
 * e restituisce l'array ordinato per finalScore descending.
 * Setta isRecommended=true sul top result executable.
 *
 * @param scores  Array di InstrumentScoreResult da ordinare
 * @returns Array ordinato, con isRecommended=true sul top pick
 */
export function rankInstrumentScores(
  scores: InstrumentScoreResult[],
): InstrumentScoreResult[] {
  const sorted = [...scores].sort(
    (a, b) => b.score.finalScore - a.score.finalScore,
  );

  // Trova il primo executable e lo marca come recommended
  const topExecutable = sorted.find(s => s.executability.executable);
  if (topExecutable) {
    topExecutable.isRecommended = true;
  }

  return sorted;
}
