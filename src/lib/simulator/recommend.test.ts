// ============================================================
// RECOMMEND TEST SUITE v2 — relationship-based
// Vitest — globals: true — tsconfigPaths alias @/
//
// FILOSOFIA:
//   ❌ nessun numero hardcoded (31€, 37€, ecc.)
//   ✔️ solo RELAZIONI:  A < B,  ordinamento,  gating,  consistency
//
// R1   CFD ECN vince sull'intraday scalping
// R2   Ordinamento globale e per categoria monotono ASC
// R3   Futures gating — appare solo con capitale sufficiente
// R4   Rejected separato, non contaminato
// R5   Swing: overnight amplia il gap DD vs ECN
// R6   Strategy consistency (scalping / low-capital / linearità)
// R7   suggestCurrencyETF solo quando davvero insostenibile
// R8   rankingTable non contiene categorie vuote + rispetta ordine
// R9   BrokerRow struttura + breakdown >= 0 + somma == monthly
// R10  toRankingTable() helper diretto
// ============================================================

import { describe, it, expect } from 'vitest';
import { recommend, toRankingTable } from './recommend';
import type { RecommendOutput, InstrumentCategory } from './recommend';

// ── Helpers ────────────────────────────────────────────────────────────────

const base = {
  assetClass:   'FOREX' as const,
  underlyingId: 'eurusd' as const,
  direction:    'long'  as const,
  stopLossPips: 20,
};

function run(override: Partial<Parameters<typeof recommend>[0]>): RecommendOutput {
  return recommend({
    exposure:       10_000,
    capital:        10_000,
    tradesPerMonth: 10,
    avgHoldingDays: 1,
    ...base,
    ...override,
  });
}

// ── R1: CFD ECN vince sull'intraday ────────────────────────────────────────
describe('R1 — CFD ECN è il tipo strumento più economico per intraday', () => {
  const out = run({ tradesPerMonth: 20, avgHoldingDays: 1 });

  it('rankingTable[0] è CFD_ECN', () => {
    expect(out.rankingTable[0]?.category).toBe('CFD_ECN');
  });

  it('CFD_ECN cheapest < CFD_DD cheapest', () => {
    const ecn = out.byCategory.CFD_ECN.cheapest;
    const dd  = out.byCategory.CFD_DD.cheapest;
    if (ecn && dd) {
      expect(ecn.monthlyCostEUR).toBeLessThan(dd.monthlyCostEUR);
    }
  });

  it('bestOverall proviene da CFD_ECN', () => {
    expect(out.bestOverall?.instrumentCategory).toBe('CFD_ECN');
  });

  it('CFD_ECN cheapest: commission > 0 (non è DD)', () => {
    const ecn = out.byCategory.CFD_ECN.cheapest;
    expect(ecn?.breakdown.commissionEUR).toBeGreaterThan(0);
  });

  it('CFD_DD cheapest: commission = 0 (costo tutto nello spread)', () => {
    const dd = out.byCategory.CFD_DD.cheapest;
    if (dd) expect(dd.breakdown.commissionEUR).toBe(0);
  });
});

// ── R2: Ordinamento monotono ────────────────────────────────────────────────
describe('R2 — Ordinamento monotono ASC', () => {
  const out = run({});

  it('globalRanking è monotono ASC per monthlyCostEUR', () => {
    const r = out.globalRanking;
    for (let i = 1; i < r.length; i++) {
      expect(r[i].monthlyCostEUR).toBeGreaterThanOrEqual(r[i - 1].monthlyCostEUR - 0.0001);
    }
  });

  it('rank = posizione 1-indexed in globalRanking', () => {
    out.globalRanking.forEach((e, i) => expect(e.rank).toBe(i + 1));
  });

  it('brokers dentro ogni categoria sono monotoni ASC', () => {
    (['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES'] as InstrumentCategory[]).forEach(cat => {
      const rows = out.byCategory[cat].brokers;
      for (let i = 1; i < rows.length; i++) {
        expect(rows[i].monthlyCostEUR)
          .toBeGreaterThanOrEqual(rows[i - 1].monthlyCostEUR - 0.0001);
      }
    });
  });

  it('rank interno a ogni categoria è 1-indexed', () => {
    (['CFD_ECN', 'CFD_DD'] as InstrumentCategory[]).forEach(cat => {
      out.byCategory[cat].brokers.forEach((row, i) => expect(row.rank).toBe(i + 1));
    });
  });
});

// ── R3: Futures gating ──────────────────────────────────────────────────────
describe('R3 — Futures gating: appare solo se capitale sufficiente', () => {
  it('tutti i futures nel ranking non sono INFEASIBLE', () => {
    const out = run({ capital: 1_000, exposure: 1_000 });
    out.byCategory.FUTURES.brokers.forEach(r => {
      expect(r.feasibility).not.toBe('INFEASIBLE');
    });
  });

  it('futures in rankingTable IFF non vuota in byCategory', () => {
    const out = run({ capital: 20_000, exposure: 20_000 });
    const inTable      = out.rankingTable.some(r => r.category === 'FUTURES');
    const inByCategory = !out.byCategory.FUTURES.unavailable;
    expect(inTable).toBe(inByCategory);
  });

  it('20k: futures accessibili hanno monthlyCostEUR > 0', () => {
    const out = run({ capital: 20_000, exposure: 20_000 });
    out.byCategory.FUTURES.brokers.forEach(r => {
      expect(r.monthlyCostEUR).toBeGreaterThan(0);
    });
  });
});

// ── R4: Rejected separato ──────────────────────────────────────────────────
describe('R4 — Rejected separato e non contaminato', () => {
  const out = run({ capital: 500, exposure: 500 });

  it('tutti i rejected hanno feasibility INFEASIBLE', () => {
    out.rejected.forEach(r => expect(r.feasibility).toBe('INFEASIBLE'));
  });

  it('nessun rejected in globalRanking', () => {
    const rejIds = new Set(out.rejected.map(r => r.raw.id));
    out.globalRanking.forEach(r => expect(rejIds.has(r.raw.id)).toBe(false));
  });

  it('nessun rejected in rankingTable.brokers', () => {
    const rejIds = new Set(out.rejected.map(r => r.raw.id));
    out.rankingTable.forEach(cat =>
      cat.brokers.forEach(row => expect(rejIds.has(row.raw.id)).toBe(false)),
    );
  });
});

// ── R5: Swing overnight ──────────────────────────────────────────────────────
describe('R5 — Swing: overnight cresce i costi (GBP/JPY short)', () => {
  const shared = {
    exposure: 10_000, capital: 10_000,
    assetClass: 'FOREX' as const, underlyingId: 'gbpjpy' as const,
    direction: 'short' as const, tradesPerMonth: 5, stopLossPips: 40,
  };
  const intraday = recommend({ ...shared, avgHoldingDays: 1 });
  const swing    = recommend({ ...shared, avgHoldingDays: 5 });

  it('swing total >= intraday total per ogni broker comune', () => {
    const intradayMap = new Map(intraday.globalRanking.map(r => [r.raw.id, r.monthlyCostEUR]));
    swing.globalRanking
      .filter(r => intradayMap.has(r.raw.id))
      .forEach(r => {
        expect(r.monthlyCostEUR).toBeGreaterThanOrEqual(intradayMap.get(r.raw.id)! - 0.0001);
      });
  });

  it('overnight mensile > 0 per short GBP/JPY 5 giorni', () => {
    expect(swing.globalRanking.some(r => r.breakdown.overnightEUR > 0)).toBe(true);
  });

  it('invariante lineare: monthlyCost = singleTrade × tradesPerMonth', () => {
    swing.globalRanking.forEach(r => {
      expect(r.monthlyCostEUR).toBeCloseTo(r.singleTradeCostEUR * 5, 4);
    });
  });
});

// ── R6: Strategy consistency ───────────────────────────────────────────────
describe('R6 — Strategy consistency', () => {
  it('scalping (20 trade intraday) → bestOverall da CFD_ECN', () => {
    expect(run({ tradesPerMonth: 20 }).bestOverall?.instrumentCategory).toBe('CFD_ECN');
  });

  it('low capital (1k) → CFD_ECN sempre presente', () => {
    expect(run({ capital: 1_000, exposure: 1_000 }).byCategory.CFD_ECN.brokers.length)
      .toBeGreaterThan(0);
  });

  it('raddoppiare tradesPerMonth raddoppia monthlyCostEUR (proporzionale)', () => {
    const out10 = run({ tradesPerMonth: 10 });
    const out20 = run({ tradesPerMonth: 20 });
    const id = out10.bestOverall?.raw.id;
    const r10 = out10.globalRanking.find(r => r.raw.id === id);
    const r20 = out20.globalRanking.find(r => r.raw.id === id);
    if (r10 && r20) {
      expect(r20.monthlyCostEUR).toBeCloseTo(r10.monthlyCostEUR * 2, 2);
    }
  });

  it('singleTradeCostBps indipendente da tradesPerMonth (scale-invariant)', () => {
    const id = run({ tradesPerMonth: 10 }).bestOverall?.raw.id;
    const r10 = run({ tradesPerMonth: 10 }).globalRanking.find(r => r.raw.id === id);
    const r30 = run({ tradesPerMonth: 30 }).globalRanking.find(r => r.raw.id === id);
    if (r10 && r30) {
      expect(r10.singleTradeCostBps).toBeCloseTo(r30.singleTradeCostBps, 4);
    }
  });
});

// ── R7: suggestCurrencyETF ─────────────────────────────────────────────────
describe('R7 — suggestCurrencyETF logic', () => {
  it('false con profilo sano (10k, 20pip SL)', () => {
    expect(run({ stopLossPips: 20 }).suggestCurrencyETF).toBe(false);
  });

  it('true con exposure >> capital (23% riskPct)', () => {
    const out = recommend({
      exposure: 50_000, capital: 1_000,
      assetClass: 'FOREX', underlyingId: 'eurusd',
      tradesPerMonth: 10, avgHoldingDays: 1, stopLossPips: 50,
    });
    if (out.globalRanking.length > 0) {
      expect(out.suggestCurrencyETF).toBe(true);
    }
  });

  it('false quando globalRanking vuoto (nessun broker accessibile)', () => {
    const out = recommend({
      exposure: 10, capital: 10,
      assetClass: 'FOREX', tradesPerMonth: 1, avgHoldingDays: 1,
    });
    expect(out.suggestCurrencyETF).toBe(false);
  });
});

// ── R8: rankingTable filtra vuote + rispetta ordine ────────────────────────
describe('R8 — rankingTable non contiene categorie vuote', () => {
  const out = run({});

  it('ogni categoria in rankingTable ha almeno un broker', () => {
    out.rankingTable.forEach(cat => {
      expect(cat.brokers.length).toBeGreaterThan(0);
      expect(cat.unavailable).toBe(false);
    });
  });

  it('categorie vuote in byCategory assenti da rankingTable', () => {
    const emptyCats = (['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES', 'OTHER'] as InstrumentCategory[])
      .filter(cat => out.byCategory[cat].unavailable);
    emptyCats.forEach(cat => {
      expect(out.rankingTable.some(r => r.category === cat)).toBe(false);
    });
  });

  it('rankingTable rispetta CATEGORY_ORDER', () => {
    const order = ['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES', 'OTHER'];
    const tableOrder = out.rankingTable.map(r => r.category);
    const expected = order.filter(c => tableOrder.includes(c as InstrumentCategory));
    expect(tableOrder).toEqual(expected);
  });
});

// ── R9: BrokerRow struttura + breakdown ────────────────────────────────────
describe('R9 — BrokerRow struttura + breakdown invarianti', () => {
  const out = run({});

  it('ogni BrokerRow ha tutti i campi obbligatori', () => {
    out.globalRanking.forEach(r => {
      expect(typeof r.rank).toBe('number');
      expect(r.brokerName.length).toBeGreaterThan(0);
      expect(typeof r.monthlyCostEUR).toBe('number');
      expect(typeof r.monthlyCostBps).toBe('number');
      expect(typeof r.singleTradeCostEUR).toBe('number');
      expect(typeof r.singleTradeCostBps).toBe('number');
      expect(r.raw).toBeDefined();
    });
  });

  it('breakdown >= 0 per ogni voce', () => {
    out.globalRanking.forEach(r => {
      Object.values(r.breakdown).forEach(v => expect(v).toBeGreaterThanOrEqual(0));
    });
  });

  it('breakdown somma == monthlyCostEUR', () => {
    out.globalRanking.forEach(r => {
      const sum = Object.values(r.breakdown).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(r.monthlyCostEUR, 4);
    });
  });

  it('score 1 ≤ score ≤ 100', () => {
    out.globalRanking.forEach(r => {
      expect(r.score).toBeGreaterThanOrEqual(1);
      expect(r.score).toBeLessThanOrEqual(100);
    });
  });
});

// ── R10: toRankingTable() helper ───────────────────────────────────────────
describe('R10 — toRankingTable() helper', () => {
  it('equivalente a out.rankingTable per categorie', () => {
    const out = run({});
    const fromHelper = toRankingTable(out.byCategory);
    expect(fromHelper.map(r => r.category)).toEqual(out.rankingTable.map(r => r.category));
  });

  it('non include unavailable=true', () => {
    const out = run({});
    toRankingTable(out.byCategory).forEach(r => expect(r.unavailable).toBe(false));
  });
});
