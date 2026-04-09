// ============================================================
// INSTRUMENT OFFERS — Dati numerici di mercato (aggiornati periodicamente)
// ============================================================

import type { InstrumentOffer } from '../schema/offer.types';

export const INSTRUMENT_OFFERS: InstrumentOffer[] = [

  // ── TICKMILL CLASSIC (EUR/USD) ───────────────────────────────────
  {
    brokerId:            'tickmill',
    accountTypeId:       'tickmill_classic',
    instrumentTypeId:    'cfd_dd',
    ugIds:               ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons:  ['intraday', 'daily', 'swing'],
    minPositionEUR:      1000,
    maxLeverageOffered:  30,
    underlyingOverrides: null,

    marginRequirementPct:     3.33,
    maintenanceMarginPct:    null,

    commissionPerLotEUR:      null,
    commissionPerLotUSD:      null,
    commissionPerContractEUR: null,
    commissionPerContractUSD: null,
    commissionMinPerTradeEUR: null,
    commissionMinPerTradeUSD: null,
    makerFeePct:              null,
    takerFeePct:              null,
    commissionNotes:          'Nessuna commissione — spread incluso',

    spreadAvgBps:             16,
    spreadMinBps:             13,
    spreadMaxBps:             null,
    spreadNotes:              'Spread medio 1.6 pips — include markup broker',

    overnightLongPipsPerDay:    null,
    overnightShortPipsPerDay:   null,
    overnightTripleDay:         'wednesday',
    overnightTripleMultiplier:  3,
    overnightNotes:             'Swap da sito Tickmill — calcolato dal motore',

    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h:     null,
    fundingNotes:             'Non applicabile a CFD Forex',

    rebasingLeverageMult:   null,
    rebasingNotes:          null,

    rollSpreadBps:          null,
    rollFrequencyDays:       null,
    rollNotes:               null,

    koDistancePctTypical:   null,
    koNotes:                 null,

    fxConversionBps:        null,
    terAnnualPct:            null,

    depositWireEUR:          0,
    depositFiatPct:          null,
    withdrawalWireEUR:       0,
    withdrawalFeeUSD:        null,
    withdrawalFeeUSDCheap:   null,
    inactivityFeeMonthlyEUR: 0,

    slippageAvgBps:          null,
    executionType:           'market',
    maxSlippageOnInstantBps: null,

    lastUpdated:             '2026-04-09',
    dataSource:              'tickmill.com/eu/it',
    notes:                   '',
  },

  // ── TICKMILL PRO - RAW ECN (EUR/USD) ────────────────────────────
  {
    brokerId:            'tickmill',
    accountTypeId:       'tickmill_pro',
    instrumentTypeId:    'cfd_ecn',
    ugIds:               ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons:  ['intraday', 'daily', 'swing'],
    minPositionEUR:      1000,
    maxLeverageOffered:  30,
    underlyingOverrides: null,

    marginRequirementPct:     3.33,
    maintenanceMarginPct:    null,

    commissionPerLotEUR:      null,
    commissionPerLotUSD:      6.00,  // $3/side = $6 RT
    commissionPerContractEUR: null,
    commissionPerContractUSD: null,
    commissionMinPerTradeEUR: null,
    commissionMinPerTradeUSD: null,
    makerFeePct:              null,
    takerFeePct:              null,
    commissionNotes:          '$3/side = $6 round turn',

    spreadAvgBps:             1,
    spreadMinBps:             0,
    spreadMaxBps:             null,
    spreadNotes:              'Raw spread da LP — near zero',

    overnightLongPipsPerDay:    null,
    overnightShortPipsPerDay:   null,
    overnightTripleDay:         'wednesday',
    overnightTripleMultiplier:  3,
    overnightNotes:             'Swap da sito Tickmill — calcolato dal motore',

    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h:     null,
    fundingNotes:             'Non applicabile a CFD Forex',

    rebasingLeverageMult:   null,
    rebasingNotes:          null,

    rollSpreadBps:          null,
    rollFrequencyDays:       null,
    rollNotes:               null,

    koDistancePctTypical:   null,
    koNotes:                 null,

    fxConversionBps:        null,
    terAnnualPct:            null,

    depositWireEUR:          0,
    depositFiatPct:          null,
    withdrawalWireEUR:       0,
    withdrawalFeeUSD:        null,
    withdrawalFeeUSDCheap:   null,
    inactivityFeeMonthlyEUR: 0,

    slippageAvgBps:          null,
    executionType:           'market',
    maxSlippageOnInstantBps: null,

    lastUpdated:             '2026-04-09',
    dataSource:              'tickmill.com/eu/it',
    notes:                   '',
  },

];