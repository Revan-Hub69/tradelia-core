// ============================================================
// RECOMMEND TEST SUITE
// Vitest — globals: true — tsconfigPaths alias @/
//
// R1  Standard trader         — 10k, 20 trade/mese, intraday
// R2  Capitale basso          — 1k, INFEASIBLE in rejected
// R3  Swing trader            — 20k, 5 trade/mese, 3gg hold
// R4  Output shape            — tutti i campi presenti
// R5  suggestCurrencyETF      — solo quando davvero insostenibile
// R6  Ranking monotono        — monthlyCostEUR non decresce
// R7  Category labels         — label corrette per ogni categoria
// ============================================================

import { describe, it, expect } from 'vitest';
import { recommend }           from './recommend';
import type { RecommendOutput, InstrumentCategory } from './recommend';

// ── R1: Standard intraday trader ──────────────────────────────────────────
describe('R1 — Standard trader (10k, 20 trade/mese, intraday EUR/USD)', () => {
  const out: RecommendOutput = recommend({
    exposure:       10_000,
    capital:        10_000,
    assetClass:     'FOREX',
    underlyingId:   'eurusd',
    direction:      'long',
    tradesPerMonth: 20,
    avgHoldingDays: 1,
    stopLossPips:   20,
  });

  it('bestOverall is defined', () => {
    expect(out.bestOverall).not.toBeNull();
  });

  it('bestOverall monthlyCostEUR > 0', () => {
    expect(out.bestOverall!.monthlyCostEUR).toBeGreaterThan(0);
  });

  it('CFD_ECN category has entries', () => {
    expect(out.byCategory.CFD_ECN.entries.length).toBeGreaterThan(0);
  });

  it('CFD_ECN cheapest monthly cost < 50 EUR (20 trade × <2.5 EUR/trade)', () => {
    // Tickmill Pro: ~1.55 EUR/trade × 20 = 31 EUR/mese
    expect(out.byCategory.CFD_ECN.cheapest!.monthlyCostEUR).toBeLessThan(50);
  });

  it('globalRanking[0] === bestOverall', () => {
    expect(out.globalRanking[0]?.brokerName).toBe(out.bestOverall!.brokerName);
  });

  it('bestOverall feasibility != INFEASIBLE', () => {
    expect(out.bestOverall!.feasibility).not.toBe('INFEASIBLE');
  });

  it('inputSummary reflects input', () => {
    expect(out.inputSummary.exposure).toBe(10_000);
    expect(out.inputSummary.tradesPerMonth).toBe(20);
    expect(out.inputSummary.avgHoldingDays).toBe(1);
  });
});

// ── R2: Capitale basso ────────────────────────────────────────────────────
describe('R2 — Capitale basso (1k, verifica rejected)', () => {
  const out = recommend({
    exposure:       1_000,
    capital:        1_000,
    assetClass:     'FOREX',
    underlyingId:   'eurusd',
    tradesPerMonth: 10,
    avgHoldingDays: 1,
    stopLossPips:   20,
  });

  it('returns a result object', () => {
    expect(out).toBeDefined();
  });

  it('rejected entries have feasibility INFEASIBLE', () => {
    out.rejected.forEach(r => {
      expect(r.feasibility).toBe('INFEASIBLE');
    });
  });

  it('no rejected entry appears in globalRanking', () => {
    const rejectedIds = new Set(out.rejected.map(r => r.raw.id));
    out.globalRanking.forEach(r => {
      expect(rejectedIds.has(r.raw.id)).toBe(false);
    });
  });

  it('suggestCurrencyETF is boolean', () => {
    expect(typeof out.suggestCurrencyETF).toBe('boolean');
  });
});

// ── R3: Swing trader ──────────────────────────────────────────────────────
describe('R3 — Swing trader (20k, 5 trade/mese, 3gg hold, GBP/JPY)', () => {
  const out = recommend({
    exposure:       20_000,
    capital:        20_000,
    assetClass:     'FOREX',
    underlyingId:   'gbpjpy',
    direction:      'short',  // carry cost
    tradesPerMonth: 5,
    avgHoldingDays: 3,
    stopLossPips:   50,
  });

  it('has results', () => {
    expect(out.globalRanking.length).toBeGreaterThan(0);
  });

  it('monthly overnight cost > 0 (short GBP/JPY 3gg carry)', () => {
    const hasOvernight = out.globalRanking.some(
      r => r.monthlyBreakdown.overnightEUR > 0,
    );
    expect(hasOvernight).toBe(true);
  });

  it('CFD_ECN entries sorted by monthlyCostEUR ASC', () => {
    const entries = out.byCategory.CFD_ECN.entries;
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].monthlyCostEUR).toBeGreaterThanOrEqual(entries[i - 1].monthlyCostEUR);
    }
  });

  it('5 trade/mese: monthlyCost = singleTradeCost * 5', () => {
    const e = out.globalRanking[0];
    if (e) {
      expect(e.monthlyCostEUR).toBeCloseTo(e.singleTradeCostEUR * 5, 4);
    }
  });
});

// ── R4: Output shape ──────────────────────────────────────────────────────
describe('R4 — Output shape validation', () => {
  const out = recommend({
    exposure:       10_000,
    capital:        10_000,
    assetClass:     'FOREX',
    underlyingId:   'eurusd',
    tradesPerMonth: 10,
    avgHoldingDays: 1,
  });

  const CATS: InstrumentCategory[] = ['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES', 'OTHER'];

  it('byCategory has all 5 categories', () => {
    CATS.forEach(cat => {
      expect(out.byCategory[cat]).toBeDefined();
    });
  });

  it('each category has required fields', () => {
    CATS.forEach(cat => {
      const c = out.byCategory[cat];
      expect(typeof c.category).toBe('string');
      expect(typeof c.label).toBe('string');
      expect(Array.isArray(c.entries)).toBe(true);
      expect(typeof c.unavailable).toBe('boolean');
    });
  });

  it('each RankedEntry has all required fields', () => {
    out.globalRanking.forEach(e => {
      expect(typeof e.rank).toBe('number');
      expect(typeof e.brokerName).toBe('string');
      expect(typeof e.monthlyCostEUR).toBe('number');
      expect(typeof e.monthlyCostBps).toBe('number');
      expect(typeof e.singleTradeCostEUR).toBe('number');
      expect(typeof e.singleTradeCostBps).toBe('number');
      expect(typeof e.monthlyBreakdown.spreadEUR).toBe('number');
      expect(typeof e.monthlyBreakdown.commissionEUR).toBe('number');
      expect(typeof e.monthlyBreakdown.overnightEUR).toBe('number');
      expect(e.raw).toBeDefined();
    });
  });

  it('inputSummary has all fields', () => {
    expect(typeof out.inputSummary.exposure).toBe('number');
    expect(typeof out.inputSummary.capital).toBe('number');
    expect(typeof out.inputSummary.tradesPerMonth).toBe('number');
    expect(typeof out.inputSummary.avgHoldingDays).toBe('number');
    expect(typeof out.inputSummary.assetClass).toBe('string');
  });
});

// ── R5: suggestCurrencyETF ────────────────────────────────────────────────
describe('R5 — suggestCurrencyETF logic', () => {
  it('false when capital is sufficient and trades are sustainable', () => {
    const out = recommend({
      exposure:       10_000,
      capital:        10_000,
      assetClass:     'FOREX',
      underlyingId:   'eurusd',
      tradesPerMonth: 10,
      avgHoldingDays: 1,
      stopLossPips:   20,
    });
    // Con 10k e 20pip SL riskPct = 0.18% << 2% → sustainable = true
    expect(out.suggestCurrencyETF).toBe(false);
  });

  it('true when ALL accessible offers are unsustainable (huge lot vs capital)', () => {
    const out = recommend({
      exposure:       50_000,  // 0.5 lot su 1k capitale
      capital:        1_000,
      assetClass:     'FOREX',
      underlyingId:   'eurusd',
      tradesPerMonth: 10,
      avgHoldingDays: 1,
      stopLossPips:   50,
    });
    // riskPct = (50 * 9.2 * 0.5) / 1000 = 23% >> 2%
    if (out.globalRanking.length > 0) {
      expect(out.suggestCurrencyETF).toBe(true);
    }
  });
});

// ── R6: Monotonia ranking ─────────────────────────────────────────────────
describe('R6 — globalRanking è monotono per monthlyCostEUR', () => {
  const out = recommend({
    exposure:       10_000,
    capital:        10_000,
    assetClass:     'FOREX',
    tradesPerMonth: 10,
    avgHoldingDays: 1,
  });

  it('globalRanking sorted ASC by monthlyCostEUR', () => {
    for (let i = 1; i < out.globalRanking.length; i++) {
      expect(out.globalRanking[i].monthlyCostEUR)
        .toBeGreaterThanOrEqual(out.globalRanking[i - 1].monthlyCostEUR - 0.0001);
    }
  });

  it('rank field matches array position (1-indexed)', () => {
    out.globalRanking.forEach((e, idx) => {
      expect(e.rank).toBe(idx + 1);
    });
  });
});

// ── R7: Category labels ───────────────────────────────────────────────────
describe('R7 — Category labels corrette', () => {
  const out = recommend({
    exposure:       10_000,
    capital:        10_000,
    assetClass:     'FOREX',
    tradesPerMonth: 10,
    avgHoldingDays: 1,
  });

  it('CFD_ECN label is correct', () => {
    expect(out.byCategory.CFD_ECN.label).toBe('CFD ECN / STP');
  });

  it('FUTURES label is correct', () => {
    expect(out.byCategory.FUTURES.label).toBe('Futures');
  });

  it('unavailable = true for categories with no accessible offers', () => {
    const emptyCats = (['CFD_ECN', 'CFD_DD', 'SPOT_FX', 'FUTURES', 'OTHER'] as InstrumentCategory[])
      .filter(cat => out.byCategory[cat].entries.length === 0);
    emptyCats.forEach(cat => {
      expect(out.byCategory[cat].unavailable).toBe(true);
    });
  });
});
