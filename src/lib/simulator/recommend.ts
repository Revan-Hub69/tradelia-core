// ============================================================
// RECOMMEND ENGINE v4
//
// CHANGES v4 (vs v3):
//   Allineato a EngineInput v6 — rimossi stopLossPips/riskPct/avgHoldingDays
//   RecommendInput ora estende direttamente EngineInput
//   (tradesPerMonth già presente su EngineInput)
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

export type BrokerRow = {
  rank:               number;
  brokerId:           string;
  brokerName:         string;
  accountTypeName:    string;
  singleTradeCostBps: number;
  singleTradeCostEUR: number;
  singleTradeCost:    CostRange;
  monthlyCostEUR:     number;
  monthlyCostBps:     number;
  monthlyCost:        CostRange;
  breakdown: {
    spreadEUR:      number;
    commissionEUR:  number;
    slippageEUR:    number;
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
    lotSize:        number;
    assetClass:     string;
    underlyingId:   string;
  };
};

/**
 * RecommendInput v4 — identico a EngineInput.
 * Nessun campo aggiuntivo: tradesPerMonth è già su EngineInput v6.
 */
export type RecommendInput = EngineInput;

// ── Costanti ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  CFD_ECN: 'CFD ECN / STP',
  CFD_DD:  'CFD Market Maker',
  SPOT_FX: 'Spot FX',
  FUTURES: 'FX Futures',
  OTHER:   'Altro',
};

const CATEGORY_ORDER: InstrumentCategory[] = ['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES', 'OTHER'];

// ── Helpers ───────────────────────────────────────────────────────────────

function categorize(instrumentTypeId: string): InstrumentCategory {
  if (instrumentTypeId === 'futures_std') return 'FUTURES';
  if (instrumentTypeId === 'spot_fx')     return 'SPOT_FX';
  if (instrumentTypeId === 'cfd_ecn')     return 'CFD_ECN';
  if (instrumentTypeId === 'cfd_dd')      return 'CFD_DD';
  return 'OTHER';
}

function toBrokerRow(raw: SimulatorResult, tradesPerMonth: number, rank: number): BrokerRow {
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
    singleTradeCostEUR: singleTradeCost.expected,
    singleTradeCost,
    monthlyCostEUR:     monthlyCost.expected,
    monthlyCostBps:     raw.totalCostBps * tradesPerMonth,
    monthlyCost,
    breakdown: {
      spreadEUR:      raw.costBreakdown.spreadEUR      * tradesPerMonth,
      commissionEUR:  raw.costBreakdown.commissionEUR  * tradesPerMonth,
      slippageEUR:    raw.costBreakdown.slippageEUR    * tradesPerMonth,
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

export function recommend(input: RecommendInput): RecommendOutput {
  const rawResults = runEngine(input);

  const byCategory = Object.fromEntries(
    CATEGORY_ORDER.map(cat => {
      const rows = rawResults
        .filter(r => r.feasibility !== 'INFEASIBLE' && categorize(r.instrumentName) === cat)
        .sort((a, b) => a.costRange.perTrade.expected - b.costRange.perTrade.expected)
        .map((r, i) => toBrokerRow(r, input.tradesPerMonth, i + 1));

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

  const rejected: RankedEntry[] = rawResults
    .filter(r => r.feasibility === 'INFEASIBLE')
    .map((r, i) => toRankedEntry(toBrokerRow(r, input.tradesPerMonth, i + 1), categorize(r.instrumentName)));

  const globalRanking: RankedEntry[] = CATEGORY_ORDER
    .flatMap(cat => byCategory[cat].brokers.map(row => toRankedEntry(row, cat)))
    .sort((a, b) => a.monthlyCost.expected - b.monthlyCost.expected)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const bestOverall        = globalRanking[0] ?? null;
  const anySustainable     = globalRanking.some(e => e.feasibilityDetail.sustainable);
  const suggestCurrencyETF = globalRanking.length > 0 && !anySustainable;

  return {
    rankingTable:  toRankingTable(byCategory),
    byCategory,
    globalRanking,
    bestOverall,
    rejected,
    suggestCurrencyETF,
    inputSummary: {
      capital:        input.capital,
      tradesPerMonth: input.tradesPerMonth,
      lotSize:        input.lotSize,
      assetClass:     input.assetClass,
      underlyingId:   input.underlyingId,
    },
  };
}
