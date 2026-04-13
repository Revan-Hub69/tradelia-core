// ============================================================
// INSTRUMENT OFFERS — Dati numerici di mercato (aggiornati periodicamente)
//
// AGGIORNAMENTO v1.1 (fix SOTA):
//   + minLotSize aggiunto su tutti gli offer (0.01 standard FX)
//   - rimossi campi extra non presenti su InstrumentOffer:
//     makerFeePct, takerFeePct, fundingRateTypicalPct8h, fundingRateMaxPct8h,
//     fundingNotes, rebasingLeverageMult, rebasingNotes,
//     koDistancePctTypical, koNotes, depositFiatPct,
//     withdrawalFeeUSD, withdrawalFeeUSDCheap, terAnnualPct
// ============================================================

import type { InstrumentOffer } from '../schema/offer.types';

export const INSTRUMENT_OFFERS: InstrumentOffer[] = [

  // ── TICKMILL CLASSIC (CFD DD — spread-only, no commission) ──────
  {
    brokerId:            'tickmill',
    accountTypeId:       'tickmill_classic',
    instrumentTypeId:    'cfd_dd',
    ugIds:               ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons:  ['intraday', 'daily', 'swing'],
    minPositionEUR:      1000,
    maxLeverageOffered:  30,

    availableContractSizes: null,
    contractSizeNominalEUR: null,

    underlyingOverrides: {
      eurusd:   { spreadAvgBps: 16, spreadMinBps: 13, spreadMaxBps: null, overnightLongPipsPerDay: -6.90,   overnightShortPipsPerDay: +4.20,   marginRequirementPct: 3.33, slippageAvgBps: null },
      gbpusd:   { spreadAvgBps: 18, spreadMinBps: 15, spreadMaxBps: null, overnightLongPipsPerDay: -1.70,   overnightShortPipsPerDay: -1.30,   marginRequirementPct: 3.33, slippageAvgBps: null },
      usdjpy:   { spreadAvgBps: 16, spreadMinBps: 13, spreadMaxBps: null, overnightLongPipsPerDay: +10.45,  overnightShortPipsPerDay: -15.60,  marginRequirementPct: 3.33, slippageAvgBps: null },
      usdchf:   { spreadAvgBps: 19, spreadMinBps: 16, spreadMaxBps: null, overnightLongPipsPerDay: +7.19,   overnightShortPipsPerDay: -10.40,  marginRequirementPct: 3.33, slippageAvgBps: null },
      audusd:   { spreadAvgBps: 16, spreadMinBps: 13, spreadMaxBps: null, overnightLongPipsPerDay: +0.20,   overnightShortPipsPerDay: -1.90,   marginRequirementPct: 3.33, slippageAvgBps: null },
      usdcad:   { spreadAvgBps: 17, spreadMinBps: 14, spreadMaxBps: null, overnightLongPipsPerDay: +4.40,   overnightShortPipsPerDay: -7.60,   marginRequirementPct: 3.33, slippageAvgBps: null },
      nzdusd:   { spreadAvgBps: 18, spreadMinBps: 15, spreadMaxBps: null, overnightLongPipsPerDay: -2.90,   overnightShortPipsPerDay: +1.30,   marginRequirementPct: 3.33, slippageAvgBps: null },
      eurgbp:   { spreadAvgBps: 19, spreadMinBps: 16, spreadMaxBps: null, overnightLongPipsPerDay: -5.36,   overnightShortPipsPerDay: +2.08,   marginRequirementPct: 5.00, slippageAvgBps: null },
      eurjpy:   { spreadAvgBps: 20, spreadMinBps: 17, spreadMaxBps: null, overnightLongPipsPerDay: +4.66,   overnightShortPipsPerDay: -9.56,   marginRequirementPct: 5.00, slippageAvgBps: null },
      gbpjpy:   { spreadAvgBps: 25, spreadMinBps: 20, spreadMaxBps: null, overnightLongPipsPerDay: +9.91,   overnightShortPipsPerDay: -24.93,  marginRequirementPct: 5.00, slippageAvgBps: null },
      eurchf:   { spreadAvgBps: 24, spreadMinBps: 21, spreadMaxBps: null, overnightLongPipsPerDay: +3.11,   overnightShortPipsPerDay: -8.75,   marginRequirementPct: 5.00, slippageAvgBps: null },
      eurcad:   { spreadAvgBps: 27, spreadMinBps: 24, spreadMaxBps: null, overnightLongPipsPerDay: -5.58,   overnightShortPipsPerDay: -3.48,   marginRequirementPct: 5.00, slippageAvgBps: null },
      euraud:   { spreadAvgBps: 26, spreadMinBps: 23, spreadMaxBps: null, overnightLongPipsPerDay: -13.13,  overnightShortPipsPerDay: +8.27,   marginRequirementPct: 5.00, slippageAvgBps: null },
      audjpy:   { spreadAvgBps: 24, spreadMinBps: 21, spreadMaxBps: null, overnightLongPipsPerDay: +9.41,   overnightShortPipsPerDay: -13.13,  marginRequirementPct: 5.00, slippageAvgBps: null },
    },

    marginRequirementPct:     3.33,
    maintenanceMarginPct:     null,
    minLotSize:               0.01,   // micro lot = 1.000 unità base

    commissionPerLotEUR:      null,
    commissionPerLotUSD:      null,
    commissionPerContractEUR: null,
    commissionPerContractUSD: null,
    commissionMinPerTradeEUR: null,
    commissionMinPerTradeUSD: null,
    commissionNotes:          'Nessuna commissione — spread incluso nel markup',

    exchangeFeePerContractEUR: null,
    exchangeFeePerContractUSD: null,

    spreadAvgBps:             16,
    spreadMinBps:             13,
    spreadMaxBps:             null,
    spreadNotes:              'Spread medio 1.6 pips — include markup broker',

    overnightLongPipsPerDay:    null,
    overnightShortPipsPerDay:   null,
    overnightTripleDay:         'wednesday',
    overnightTripleMultiplier:  3,
    overnightNotes:             'Swap da sito Tickmill — per coppia in underlyingOverrides',

    rollSpreadBps:             null,
    rollFrequencyDays:         null,
    rollNotes:                 '',

    fxConversionBps:           null,

    slippageAvgBps:            null,
    executionType:             'market',
    maxSlippageOnInstantBps:   null,

    depositWireEUR:            0,
    withdrawalWireEUR:         0,
    inactivityFeeMonthlyEUR:   0,

    lastUpdated:               '2026-04-09',
    dataSource:                'tickmill.com/eu/it',
    notes:                     '',
  },

  // ── TICKMILL PRO (CFD ECN — raw spread + $6 RT commission) ──────
  {
    brokerId:            'tickmill',
    accountTypeId:       'tickmill_pro',
    instrumentTypeId:    'cfd_ecn',
    ugIds:               ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons:  ['intraday', 'daily', 'swing'],
    minPositionEUR:      1000,
    maxLeverageOffered:  30,

    availableContractSizes: null,
    contractSizeNominalEUR: null,

    underlyingOverrides: {
      eurusd:   { spreadAvgBps: 1,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -6.90,    overnightShortPipsPerDay: +4.20,    marginRequirementPct: 3.33, slippageAvgBps: null },
      gbpusd:   { spreadAvgBps: 3,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -1.70,    overnightShortPipsPerDay: -1.30,    marginRequirementPct: 3.33, slippageAvgBps: null },
      usdjpy:   { spreadAvgBps: 1,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +10.45,   overnightShortPipsPerDay: -15.60,   marginRequirementPct: 3.33, slippageAvgBps: null },
      usdchf:   { spreadAvgBps: 4,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +7.19,    overnightShortPipsPerDay: -10.40,   marginRequirementPct: 3.33, slippageAvgBps: null },
      audusd:   { spreadAvgBps: 1,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +0.20,    overnightShortPipsPerDay: -1.90,    marginRequirementPct: 3.33, slippageAvgBps: null },
      usdcad:   { spreadAvgBps: 2,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +4.40,    overnightShortPipsPerDay: -7.60,    marginRequirementPct: 3.33, slippageAvgBps: null },
      nzdusd:   { spreadAvgBps: 3,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -2.90,    overnightShortPipsPerDay: +1.30,    marginRequirementPct: 3.33, slippageAvgBps: null },
      eurgbp:   { spreadAvgBps: 4,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -5.36,    overnightShortPipsPerDay: +2.08,    marginRequirementPct: 5.00, slippageAvgBps: null },
      eurjpy:   { spreadAvgBps: 5,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +4.66,    overnightShortPipsPerDay: -9.56,    marginRequirementPct: 5.00, slippageAvgBps: null },
      gbpjpy:   { spreadAvgBps: 10,  spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +9.91,    overnightShortPipsPerDay: -24.93,   marginRequirementPct: 5.00, slippageAvgBps: null },
      eurchf:   { spreadAvgBps: 9,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +3.11,    overnightShortPipsPerDay: -8.75,    marginRequirementPct: 5.00, slippageAvgBps: null },
      eurcad:   { spreadAvgBps: 12,  spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -5.58,    overnightShortPipsPerDay: -3.48,    marginRequirementPct: 5.00, slippageAvgBps: null },
      euraud:   { spreadAvgBps: 11,  spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -13.13,   overnightShortPipsPerDay: +8.27,    marginRequirementPct: 5.00, slippageAvgBps: null },
      audjpy:   { spreadAvgBps: 9,   spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +9.41,    overnightShortPipsPerDay: -13.13,   marginRequirementPct: 5.00, slippageAvgBps: null },
      usdtry:   { spreadAvgBps: 220, spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -4252.27, overnightShortPipsPerDay: +2822.22, marginRequirementPct: 5.00, slippageAvgBps: null },
      usdmxn:   { spreadAvgBps: 340, spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -206.96,  overnightShortPipsPerDay: +81.61,   marginRequirementPct: 5.00, slippageAvgBps: null },
      usdzar:   { spreadAvgBps: 792, spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -184.59,  overnightShortPipsPerDay: +70.02,   marginRequirementPct: 5.00, slippageAvgBps: null },
      eurtry:   { spreadAvgBps: 290, spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: -6631.77, overnightShortPipsPerDay: +3553.13, marginRequirementPct: 5.00, slippageAvgBps: null },
      usdsgd:   { spreadAvgBps: 19,  spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +6.75,    overnightShortPipsPerDay: -11.24,   marginRequirementPct: 5.00, slippageAvgBps: null },
      usdhkd:   { spreadAvgBps: 65,  spreadMinBps: 0, spreadMaxBps: null, overnightLongPipsPerDay: +0.70,    overnightShortPipsPerDay: -95.72,   marginRequirementPct: 5.00, slippageAvgBps: null },
    },

    marginRequirementPct:     3.33,
    maintenanceMarginPct:     null,
    minLotSize:               0.01,   // micro lot = 1.000 unità base

    commissionPerLotEUR:      null,
    commissionPerLotUSD:      6.00,   // $3/side = $6 round-trip
    commissionPerContractEUR: null,
    commissionPerContractUSD: null,
    commissionMinPerTradeEUR: null,
    commissionMinPerTradeUSD: null,
    commissionNotes:          '$3/side = $6 round-trip per lot standard',

    exchangeFeePerContractEUR: null,
    exchangeFeePerContractUSD: null,

    spreadAvgBps:             1,
    spreadMinBps:             0,
    spreadMaxBps:             null,
    spreadNotes:              'Raw spread da LP — near zero su major in sessione attiva',

    overnightLongPipsPerDay:    null,
    overnightShortPipsPerDay:   null,
    overnightTripleDay:         'wednesday',
    overnightTripleMultiplier:  3,
    overnightNotes:             'Swap da sito Tickmill — per coppia in underlyingOverrides',

    rollSpreadBps:             null,
    rollFrequencyDays:         null,
    rollNotes:                 '',

    fxConversionBps:           null,

    slippageAvgBps:            null,
    executionType:             'market',
    maxSlippageOnInstantBps:   null,

    depositWireEUR:            0,
    withdrawalWireEUR:         0,
    inactivityFeeMonthlyEUR:   0,

    lastUpdated:               '2026-04-09',
    dataSource:                'tickmill.com/eu/it',
    notes:                     '',
  },

];
