// ============================================================
// RECOMMEND ENGINE v3
//
// CHANGES v3 (vs v2):
//
//   fix(🔴): eliminato double-scaling
//            engine ora è per-trade → recommend moltiplica × tradesPerMonth
//            PRIMA: engine riceveva nTrades e recommend moltiplicava ancora
//
//   add(🟢): BrokerRow.monthlyCost: CostRange (best/expected/worst)
//            BrokerRow.singleTradeCost: CostRange
//
//   fix(🟠): monthlyCostEUR mantenuto come backward-compat (= expected)
//
//   fix(🟠): sort per monthlyCost.expected ASC (non score)
//
//   fix(🟠): breakdown monthly ora include slippageEUR scalato
// ============================================================

import { runEngine }         from './engine';
import type { EngineInput, SimulatorResult } from './engine';

// ── Range type (re-export per UI) ─────────────────────────────────────────
export type CostRange = {
  best:     number;
  expected: number;
  worst:    number;
};

function scaleRange(r: CostRange, factor: number): CostRange {
  return { best: r.best * factor, expected: r.expected * factor, worst: r.worst * factor };
}

// ── Tipi ──────────────────────────────────────────────────────────────────

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
  // Costo per singolo trade
  singleTradeCostBps: number;
  singleTradeCostEUR: number;        // backward compat (= expected)
  singleTradeCost:    CostRange;     // NEW — distribuzione per trade
  // Costo mensile (= singleTrade × tradesPerMonth)
  monthlyCostEUR:   number;          // backward compat (= expected)
  monthlyCostBps:   number;
  monthlyCost:      CostRange;       // NEW — distribuzione mensile
  // Breakdown mensile (ogni voce scalata × tradesPerMonth, valore expected)
  breakdown: {
    spreadEUR:      number;
    commissionEUR:  number;
    overnightEUR:   number;
    slippageEUR:    number;          // NEW — non più assente
    exchangeFeeEUR: number;
    rollEUR:        number;
  };
  feasibility:       import('./engine').Feasibility;
  feasibilityDetail: import('./engine').FeasibilityDetail;
  score:             number;
  contractSize:      'micro' | 'mini' | 'full' | null;
  raw:               SimulatorResult;
};

export type InstrumentRanking = {
  category:      InstrumentCategory;
  categoryLabel: string;
  brokers:       BrokerRow[];
  cheapest:      BrokerRow | null;
  unavailable:   boolean;
};

export type RankedEntry = BrokerRow & {
  instrumentCategory: InstrumentCategory;
};

export type RecommendOutput = {
  rankingTable:       InstrumentRanking[];
  byCategory:         Record<InstrumentCategory, InstrumentRanking>;
  globalRanking:      RankedEntry[];
  bestOverall:        RankedEntry | null;
  rejected:           RankedEntry[];
  suggestCurrencyETF: boolean;
  inputSummary: {
    capital:        number;
    tradesPerMonth: number;
    avgHoldingDays: number;
    assetClass:     string;
    underlyingId:   string | undefined;
  };
};

export type RecommendInput = Omit<EngineInput, 'nDaysOpen'> & {
  /** Numero operazioni al mese — default 10 */
  tradesPerMonth: number;
  /** Giorni medi di holding per trade — default 1 (intraday) */
  avgHoldingDays: number;
};

// ── Costanti ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  CFD_ECN:  'CFD ECN / STP',
  CFD_DD:   'CFD Market Maker',
  SPOT_FX:  'Spot FX',
  FUTURES:  'FX Futures',
  OTHER:    'Altro',
};

const CATEGORY_ORDER: InstrumentCategory[] = [
  'CFD_ECN',
  'CFD_DD',
  'SPOT_FX',
  'FUTURES',
  'OTHER',
];

// ── Helpers ───────────────────────────────────────────────────────────────

function categorize(instrumentTypeId: string): InstrumentCategory {
  if (instrumentTypeId === 'futures_std') return 'FUTURES';
  if (instrumentTypeId === 'spot_fx')     return 'SPOT_FX';
  if (instrumentTypeId === 'cfd_ecn')     return 'CFD_ECN';
  if (instrumentTypeId === 'cfd_dd')      return 'CFD_DD';
  return 'OTHER';
}

/**
 * Converte SimulatorResult (per-trade) → BrokerRow (mensile).
 * SCALING: singleTrade × tradesPerMonth.
 * Nessun double-scaling: engine è per singolo trade.
 */
function toBrokerRow(
  raw:            SimulatorResult,
  tradesPerMonth: number,
  rank:           number,
): BrokerRow {
  const perTrade = raw.costRange.perTrade;

  const singleTradeCost: CostRange = {
    best:     perTrade.best,
    expected: perTrade.expected,
    worst:    perTrade.worst,
  };

  const monthlyCost = scaleRange(singleTradeCost, tradesPerMonth);

  return {
    rank,
    brokerId:           raw.id.split('_')[0] ?? raw.id,
    brokerName:         raw.brokerName,
    accountTypeName:    raw.accountTypeName,
    singleTradeCostBps: raw.totalCostBps,
    singleTradeCostEUR: singleTradeCost.expected,   // backward compat
    singleTradeCost,
    monthlyCostEUR:     monthlyCost.expected,        // backward compat
    monthlyCostBps:     raw.totalCostBps * tradesPerMonth,
    monthlyCost,
    breakdown: {
      spreadEUR:      raw.costBreakdown.spreadEUR      * tradesPerMonth,
      commissionEUR:  raw.costBreakdown.commissionEUR  * tradesPerMonth,
      overnightEUR:   raw.costBreakdown.overnightEUR   * tradesPerMonth,
      slippageEUR:    raw.costBreakdown.slippageEUR    * tradesPerMonth,  // NEW
      exchangeFeeEUR: raw.costBreakdown.exchangeFeeEUR * tradesPerMonth,
      rollEUR:        raw.costBreakdown.rollEUR        * tradesPerMonth,
    },
    feasibility:       raw.feasibility,
    feasibilityDetail: raw.feasibilityDetail,
    score:             raw.score,
    contractSize:      raw.contractSize,
    raw,
  };
}

function toRankedEntry(row: BrokerRow, category: InstrumentCategory): RankedEntry {
  return { ...row, instrumentCategory: category };
}

export function toRankingTable(
  byCategory: Record<InstrumentCategory, InstrumentRanking>,
): InstrumentRanking[] {
  return CATEGORY_ORDER
    .map(cat => byCategory[cat])
    .filter((r): r is InstrumentRanking => !r.unavailable);
}

// ── Funzione principale ───────────────────────────────────────────────────

export function recommend({
  tradesPerMonth = 10,
  avgHoldingDays = 1,
  capital,
  ...engineParams
}: RecommendInput): RecommendOutput {
  const effectiveCapital = capital ?? 0;

  // Engine per singolo trade — nessun nTrades passato
  const rawResults = runEngine({
    ...engineParams,
    capital:   effectiveCapital,
    nDaysOpen: avgHoldingDays,
  });

  // ── Raggruppa per categoria ────────────────────────────────────────────
  const byCategory = Object.fromEntries(
    CATEGORY_ORDER.map(cat => {
      const rows = rawResults
        .filter(r => r.feasibility !== 'INFEASIBLE' && categorize(r.instrumentName) === cat)
        // sort per costo atteso per trade ASC (engine ha già ordinato, ma ri-sort per sicurezza)
        .sort((a, b) => a.costRange.perTrade.expected - b.costRange.perTrade.expected)
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

  // ── Rejected ───────────────────────────────────────────────────────────
  const rejected: RankedEntry[] = rawResults
    .filter(r => r.feasibility === 'INFEASIBLE')
    .map((r, i) => toRankedEntry(toBrokerRow(r, tradesPerMonth, i + 1), categorize(r.instrumentName)));

  // ── Global ranking ─────────────────────────────────────────────────────
  const globalRanking: RankedEntry[] = CATEGORY_ORDER
    .flatMap(cat => byCategory[cat].brokers.map(row => toRankedEntry(row, cat)))
    .sort((a, b) => a.monthlyCost.expected - b.monthlyCost.expected)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const bestOverall = globalRanking[0] ?? null;

  const anySustainable    = globalRanking.some(e => e.feasibilityDetail.sustainable);
  const suggestCurrencyETF = globalRanking.length > 0 && !anySustainable;

  return {
    rankingTable:  toRankingTable(byCategory),
    byCategory,
    globalRanking,
    bestOverall,
    rejected,
    suggestCurrencyETF,
    inputSummary: {
      capital:        effectiveCapital,
      tradesPerMonth,
      avgHoldingDays,
      assetClass:     engineParams.assetClass,
      underlyingId:   engineParams.underlyingId,
    },
  };
}
