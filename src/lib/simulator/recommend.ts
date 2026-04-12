// ============================================================
// RECOMMEND ENGINE v1
//
// Output: classifica broker per categoria strumento,
//         ordinata per costo mensile stimato (EUR) ASC.
//
// Logica:
//   1. Chiama runEngine() con i parametri per singolo trade
//   2. Scala i costi a mensile: tradesPerMonth × nDaysOpen
//   3. Raggruppa per categoria strumento (CFD_ECN, CFD_DD, SPOT_FX, FUTURES)
//   4. Filtra INFEASIBLE → rejected[]
//   5. All'interno di ogni categoria: ordina per monthlyCostEUR ASC
//   6. Restituisce anche bestOverall (assoluto)
// ============================================================

import { runEngine }         from './engine';
import type { EngineInput, SimulatorResult } from './engine';

// ── Tipi output ────────────────────────────────────────────────────────────

export type InstrumentCategory =
  | 'CFD_ECN'
  | 'CFD_DD'
  | 'SPOT_FX'
  | 'FUTURES'
  | 'OTHER';

export type RankedEntry = {
  rank:              number;
  brokerId:          string;
  brokerName:        string;
  accountTypeName:   string;
  instrumentCategory: InstrumentCategory;
  // Costi per singolo trade (da engine)
  singleTradeCostBps: number;
  singleTradeCostEUR: number;
  // Costi mensili stimati
  monthlyCostEUR:    number;
  monthlyCostBps:    number;   // scale-invariant: bps * tradesPerMonth
  // Breakdown mensile
  monthlyBreakdown: {
    spreadEUR:      number;
    commissionEUR:  number;
    overnightEUR:   number;
    exchangeFeeEUR: number;
    rollEUR:        number;
  };
  // Feasibility
  feasibility:       import('./engine').Feasibility;
  feasibilityDetail: import('./engine').FeasibilityDetail;
  score:             number;
  // Riferimento al risultato engine grezzo
  raw:               SimulatorResult;
};

export type CategoryRanking = {
  category:       InstrumentCategory;
  label:          string;           // label human-readable
  entries:        RankedEntry[];    // ordinato per monthlyCostEUR ASC
  cheapest:       RankedEntry | null;
  unavailable:    boolean;          // nessun broker accessibile in questa categoria
};

export type RecommendOutput = {
  // Classifica per categoria
  byCategory:         Record<InstrumentCategory, CategoryRanking>;
  // Classifica globale (tutte le categorie mescolate, ordinata per monthlyCostEUR)
  globalRanking:      RankedEntry[];
  // Migliore assoluto accessibile
  bestOverall:        RankedEntry | null;
  // Offerte scartate (INFEASIBLE)
  rejected:           RankedEntry[];
  // Flag ETF valutari
  suggestCurrencyETF: boolean;
  // Input usato per calcolo (per debug/display)
  inputSummary: {
    exposure:       number;
    capital:        number;
    tradesPerMonth: number;
    avgHoldingDays: number;
    assetClass:     string;
    underlyingId:   string | undefined;
  };
};

export type RecommendInput = Omit<EngineInput, 'nTrades' | 'nDaysOpen'> & {
  tradesPerMonth: number;   // numero operazioni al mese (default 10)
  avgHoldingDays: number;   // giorni medi di holding per trade (default 1)
};

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  CFD_ECN:  'CFD ECN / STP',
  CFD_DD:   'CFD Market Maker',
  SPOT_FX:  'Spot FX',
  FUTURES:  'Futures',
  OTHER:    'Altro',
};

function categorize(instrumentTypeId: string): InstrumentCategory {
  if (instrumentTypeId === 'futures_std')  return 'FUTURES';
  if (instrumentTypeId === 'spot_fx')      return 'SPOT_FX';
  if (instrumentTypeId === 'cfd_ecn')      return 'CFD_ECN';
  if (instrumentTypeId === 'cfd_dd')       return 'CFD_DD';
  return 'OTHER';
}

function toRankedEntry(
  raw:            SimulatorResult,
  tradesPerMonth: number,
  rank:           number,
): RankedEntry {
  const singleTradeCostEUR = raw.costBreakdown.totalEUR;
  const singleTradeCostBps = raw.totalCostBps;

  const monthlyCostEUR = singleTradeCostEUR * tradesPerMonth;
  const monthlyCostBps = singleTradeCostBps * tradesPerMonth;

  const monthlyBreakdown = {
    spreadEUR:      raw.costBreakdown.spreadEUR      * tradesPerMonth,
    commissionEUR:  raw.costBreakdown.commissionEUR  * tradesPerMonth,
    overnightEUR:   raw.costBreakdown.overnightEUR   * tradesPerMonth,
    exchangeFeeEUR: raw.costBreakdown.exchangeFeeEUR * tradesPerMonth,
    rollEUR:        raw.costBreakdown.rollEUR        * tradesPerMonth,
  };

  return {
    rank,
    brokerId:           raw.id.split('_')[0] ?? raw.id,
    brokerName:         raw.brokerName,
    accountTypeName:    raw.accountTypeName,
    instrumentCategory: categorize(raw.instrumentName),
    singleTradeCostBps,
    singleTradeCostEUR,
    monthlyCostEUR,
    monthlyCostBps,
    monthlyBreakdown,
    feasibility:        raw.feasibility,
    feasibilityDetail:  raw.feasibilityDetail,
    score:              raw.score,
    raw,
  };
}

function emptyCategory(category: InstrumentCategory): CategoryRanking {
  return {
    category,
    label:       CATEGORY_LABELS[category],
    entries:     [],
    cheapest:    null,
    unavailable: true,
  };
}

// ── Funzione principale ────────────────────────────────────────────────────

export function recommend({
  tradesPerMonth = 10,
  avgHoldingDays = 1,
  capital,
  exposure,
  ...engineParams
}: RecommendInput): RecommendOutput {
  const effectiveCapital = capital ?? exposure;

  // Chiama il motore per UN singolo trade
  const rawResults = runEngine({
    ...engineParams,
    exposure,
    capital:    effectiveCapital,
    nTrades:    1,
    nDaysOpen:  avgHoldingDays,
  });

  // Converti in RankedEntry (rank provvisorio = 0, riassegnato sotto)
  const allEntries = rawResults.map(r => toRankedEntry(r, tradesPerMonth, 0));

  // Separa accessibili da INFEASIBLE
  const accessible = allEntries.filter(e => e.feasibility !== 'INFEASIBLE');
  const rejected   = allEntries
    .filter(e => e.feasibility === 'INFEASIBLE')
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // Raggruppa per categoria e ordina per monthlyCostEUR ASC
  const ALL_CATEGORIES: InstrumentCategory[] = ['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES', 'OTHER'];

  const byCategory = Object.fromEntries(
    ALL_CATEGORIES.map(cat => {
      const entries = accessible
        .filter(e => e.instrumentCategory === cat)
        .sort((a, b) => a.monthlyCostEUR - b.monthlyCostEUR)
        .map((e, i) => ({ ...e, rank: i + 1 }));

      const ranking: CategoryRanking = {
        category:    cat,
        label:       CATEGORY_LABELS[cat],
        entries,
        cheapest:    entries[0] ?? null,
        unavailable: entries.length === 0,
      };
      return [cat, ranking] as const;
    }),
  ) as Record<InstrumentCategory, CategoryRanking>;

  // Classifica globale — tutti gli accessibili, ordinati per monthlyCostEUR ASC
  const globalRanking = accessible
    .sort((a, b) => a.monthlyCostEUR - b.monthlyCostEUR)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const bestOverall = globalRanking[0] ?? null;

  // suggestCurrencyETF: nessun'offerta è sustainable (capitale troppo basso)
  const anySustainable = accessible.some(e => e.feasibilityDetail.sustainable);
  const suggestCurrencyETF = accessible.length > 0 && !anySustainable;

  return {
    byCategory,
    globalRanking,
    bestOverall,
    rejected,
    suggestCurrencyETF,
    inputSummary: {
      exposure,
      capital:        effectiveCapital,
      tradesPerMonth,
      avgHoldingDays,
      assetClass:     engineParams.assetClass,
      underlyingId:   engineParams.underlyingId,
    },
  };
}
