// ============================================================
// RECOMMEND ENGINE v2
//
// Output: classifica broker per tipo strumento,
//         ordinata per costo mensile stimato (EUR) ASC.
//
// Struttura output principale (UI-ready):
//
//   rankingTable: InstrumentRanking[]
//   ├── { instrumentType: 'CFD ECN/STP', brokers: BrokerRow[] }
//   ├── { instrumentType: 'CFD Market Maker', brokers: BrokerRow[] }
//   ├── { instrumentType: 'Spot FX', brokers: BrokerRow[] }
//   └── { instrumentType: 'FX Futures', brokers: BrokerRow[] }
//
//   Ogni BrokerRow:
//   { rank, brokerName, accountType, monthlyCostEUR, breakdown, feasibility }
//
// Logica:
//   1. runEngine() per singolo trade
//   2. × tradesPerMonth → costi mensili
//   3. Raggruppa per InstrumentCategory
//   4. INFEASIBLE → rejected[] (non nella tabella)
//   5. Dentro ogni categoria: ordina per monthlyCostEUR ASC
//   6. toRankingTable() → array ordinato per categoria, solo quelle non vuote
// ============================================================

import { runEngine }         from './engine';
import type { EngineInput, SimulatorResult } from './engine';

// ── Tipi ───────────────────────────────────────────────────────────────────

export type InstrumentCategory =
  | 'CFD_ECN'
  | 'CFD_DD'
  | 'SPOT_FX'
  | 'FUTURES'
  | 'OTHER';

/** Riga singola nella tabella broker per uno strumento. UI-ready. */
export type BrokerRow = {
  rank:             number;
  brokerId:         string;
  brokerName:       string;
  accountTypeName:  string;
  // Costo singolo trade
  singleTradeCostBps: number;
  singleTradeCostEUR: number;
  // Costo mensile stimato (= singleTrade × tradesPerMonth)
  monthlyCostEUR:   number;
  monthlyCostBps:   number;
  // Breakdown mensile — ogni voce è già scalata × tradesPerMonth
  breakdown: {
    spreadEUR:      number;
    commissionEUR:  number;
    overnightEUR:   number;
    exchangeFeeEUR: number;
    rollEUR:        number;
  };
  feasibility:      import('./engine').Feasibility;
  feasibilityDetail: import('./engine').FeasibilityDetail;
  score:            number;
  // Futures: taglia selezionata (micro/mini/full), null per CFD/Spot
  contractSize:     'micro' | 'mini' | 'full' | null;
  raw:              SimulatorResult;
};

/**
 * Classifica broker per UN tipo strumento.
 * Questa è l'unità di rendering della UI:
 *   <InstrumentRankingTable data={ranking} />
 */
export type InstrumentRanking = {
  category:      InstrumentCategory;
  categoryLabel: string;           // 'CFD ECN/STP', 'FX Futures', ...
  brokers:       BrokerRow[];      // ordinato per monthlyCostEUR ASC, solo accessible
  cheapest:      BrokerRow | null; // brokers[0]
  unavailable:   boolean;          // true se nessun broker accessibile
};

/** Entry interna (pre-UI) — mantiene compatibilità con globalRanking */
export type RankedEntry = BrokerRow & {
  instrumentCategory: InstrumentCategory;
};

export type RecommendOutput = {
  /**
   * STRUTTURA PRINCIPALE — lista per tipo strumento, UI-ready.
   * Ordinata: CFD_ECN → CFD_DD → SPOT_FX → FUTURES → OTHER.
   * Categorie senza broker accessibili sono ESCLUSE.
   */
  rankingTable:       InstrumentRanking[];

  /** Stessa struttura, include anche categorie vuote — per debug/completezza */
  byCategory:         Record<InstrumentCategory, InstrumentRanking>;

  /** Tutti i broker accessibili, mixed, ordinati per monthlyCostEUR ASC */
  globalRanking:      RankedEntry[];

  /** Broker assoluto più economico tra tutti i tipi strumento */
  bestOverall:        RankedEntry | null;

  /** Offerte scartate (INFEASIBLE) — da mostrare separatamente nella UI */
  rejected:           RankedEntry[];

  /** true = nessuna offerta è risk-sustainable → suggerisci ETF valutario */
  suggestCurrencyETF: boolean;

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
  /** Numero operazioni al mese — default 10 */
  tradesPerMonth: number;
  /** Giorni medi di holding per trade — default 1 (intraday) */
  avgHoldingDays: number;
};

// ── Costanti ───────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  CFD_ECN:  'CFD ECN / STP',
  CFD_DD:   'CFD Market Maker',
  SPOT_FX:  'Spot FX',
  FUTURES:  'FX Futures',
  OTHER:    'Altro',
};

/** Ordine di rendering nella UI */
const CATEGORY_ORDER: InstrumentCategory[] = [
  'CFD_ECN',
  'CFD_DD',
  'SPOT_FX',
  'FUTURES',
  'OTHER',
];

// ── Helpers ────────────────────────────────────────────────────────────────

function categorize(instrumentTypeId: string): InstrumentCategory {
  if (instrumentTypeId === 'futures_std') return 'FUTURES';
  if (instrumentTypeId === 'spot_fx')     return 'SPOT_FX';
  if (instrumentTypeId === 'cfd_ecn')     return 'CFD_ECN';
  if (instrumentTypeId === 'cfd_dd')      return 'CFD_DD';
  return 'OTHER';
}

function toBrokerRow(
  raw:            SimulatorResult,
  tradesPerMonth: number,
  rank:           number,
): BrokerRow {
  const singleTradeCostEUR = raw.costBreakdown.totalEUR;
  const singleTradeCostBps = raw.totalCostBps;

  return {
    rank,
    brokerId:          raw.id.split('_')[0] ?? raw.id,
    brokerName:        raw.brokerName,
    accountTypeName:   raw.accountTypeName,
    singleTradeCostBps,
    singleTradeCostEUR,
    monthlyCostEUR:    singleTradeCostEUR * tradesPerMonth,
    monthlyCostBps:    singleTradeCostBps * tradesPerMonth,
    breakdown: {
      spreadEUR:      raw.costBreakdown.spreadEUR      * tradesPerMonth,
      commissionEUR:  raw.costBreakdown.commissionEUR  * tradesPerMonth,
      overnightEUR:   raw.costBreakdown.overnightEUR   * tradesPerMonth,
      exchangeFeeEUR: raw.costBreakdown.exchangeFeeEUR * tradesPerMonth,
      rollEUR:        raw.costBreakdown.rollEUR        * tradesPerMonth,
    },
    feasibility:        raw.feasibility,
    feasibilityDetail:  raw.feasibilityDetail,
    score:              raw.score,
    contractSize:       raw.contractSize,
    raw,
  };
}

function toRankedEntry(row: BrokerRow, category: InstrumentCategory): RankedEntry {
  return { ...row, instrumentCategory: category };
}

/**
 * Costruisce InstrumentRanking[] dalla mappa byCategory.
 * - Filtra categorie vuote (unavailable)
 * - Rispetta CATEGORY_ORDER
 * Esporta per testing diretto.
 */
export function toRankingTable(
  byCategory: Record<InstrumentCategory, InstrumentRanking>,
): InstrumentRanking[] {
  return CATEGORY_ORDER
    .map(cat => byCategory[cat])
    .filter(r => !r.unavailable);
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

  const rawResults = runEngine({
    ...engineParams,
    exposure,
    capital:   effectiveCapital,
    nTrades:   1,
    nDaysOpen: avgHoldingDays,
  });

  // ── Raggruppa per categoria ─────────────────────────────────────────────
  const byCategory = Object.fromEntries(
    CATEGORY_ORDER.map(cat => {
      const rows = rawResults
        .filter(r => r.feasibility !== 'INFEASIBLE' && categorize(r.instrumentName) === cat)
        .sort((a, b) => a.costBreakdown.totalEUR - b.costBreakdown.totalEUR)
        .map((r, i) => toBrokerRow(r, tradesPerMonth, i + 1));

      const ranking: InstrumentRanking = {
        category:      cat,
        categoryLabel: CATEGORY_LABELS[cat],
        brokers:       rows,
        cheapest:      rows[0] ?? null,
        unavailable:   rows.length === 0,
      };
      return [cat, ranking] as const;
    }),
  ) as Record<InstrumentCategory, InstrumentRanking>;

  // ── Rejected (INFEASIBLE) ───────────────────────────────────────────────
  const rejected: RankedEntry[] = rawResults
    .filter(r => r.feasibility === 'INFEASIBLE')
    .map((r, i) => toRankedEntry(toBrokerRow(r, tradesPerMonth, i + 1), categorize(r.instrumentName)));

  // ── Global ranking (accessible, mixed, ASC) ────────────────────────────
  const globalRanking: RankedEntry[] = CATEGORY_ORDER
    .flatMap(cat => byCategory[cat].brokers.map(row => toRankedEntry(row, cat)))
    .sort((a, b) => a.monthlyCostEUR - b.monthlyCostEUR)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const bestOverall = globalRanking[0] ?? null;

  // ── suggestCurrencyETF ─────────────────────────────────────────────────
  const anySustainable = globalRanking.some(e => e.feasibilityDetail.sustainable);
  const suggestCurrencyETF = globalRanking.length > 0 && !anySustainable;

  return {
    rankingTable:  toRankingTable(byCategory),
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
