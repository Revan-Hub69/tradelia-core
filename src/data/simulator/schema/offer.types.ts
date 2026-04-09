// ============================================================
// OFFER TYPES — Schema puro per InstrumentOffer
// ============================================================

import type { InstrumentTypeId } from '../instruments';
import type { UnderlyingGroupId } from '../underlying-groups';
import type { HorizonId } from '../horizons';
import type { AccountTypeId, BrokerId } from './broker.types';
import type { UnderlyingId } from './index';

export type ExecutionType = 'instant' | 'market';

// Override per singola coppia (EUR/USD, GBP/JPY, etc)
// I valori sono in pip per notte — formato broker standard
export type UnderlyingOfferOverride = {
  spreadAvgBps:            number | null;
  spreadMinBps:            number | null;
  spreadMaxBps:            number | null;
  overnightLongPipsPerDay:  number | null;
  overnightShortPipsPerDay: number | null;
  marginRequirementPct:    number | null;
  slippageAvgBps:          number | null;
  slippageNewsBps:         number | null;
};

export type InstrumentOffer = {
  // Identificazione
  brokerId:            BrokerId;
  accountTypeId:       AccountTypeId;
  instrumentTypeId:    InstrumentTypeId;
  ugIds:               UnderlyingGroupId[];
  compatibleHorizons:  HorizonId[];
  minPositionEUR:      number;
  maxLeverageOffered:  number | null;

  // Override per singolo underlying
  underlyingOverrides: Partial<Record<UnderlyingId, UnderlyingOfferOverride>> | null;

  // Margin
  marginRequirementPct:     number;
  maintenanceMarginPct:     number | null;

  // Commissioni
  commissionPerLotEUR:      number | null;
  commissionPerLotUSD:      number | null;
  commissionPerContractEUR: number | null;
  commissionPerContractUSD: number | null;
  commissionMinPerTradeEUR: number | null;
  commissionMinPerTradeUSD: number | null;
  makerFeePct:              number | null;
  takerFeePct:              number | null;
  commissionNotes:          string;

  // Spread
  spreadAvgBps:             number;
  spreadMinBps:             number;
  spreadMaxBps:             number;
  spreadNotes:              string;

  // Overnight / Swap (in pip per notte — formato broker standard)
  overnightLongPipsPerDay:    number | null;
  overnightShortPipsPerDay:   number | null;
  overnightTripleDay:         'wednesday' | 'friday' | 'none' | null;
  overnightTripleMultiplier:  number | null;  // es. 3.0 o 2.8
  overnightNotes:             string;

  // Funding (crypto perp)
  fundingRateTypicalPct8h: number | null;
  fundingRateMaxPct8h:     number | null;
  fundingNotes:            string;

  // Rebasing
  rebasingLeverageMult:   number | null;
  rebasingNotes:         string;

  // Roll (futures)
  rollSpreadBps:           number | null;
  rollFrequencyDays:      number | null;
  rollNotes:              string;

  // KO / Liquidation
  koDistancePctTypical:   number | null;
  koNotes:                string;

  // FX Conversion
  fxConversionBps:        number | null;

  // TER (ETF/ETC/ETP)
  terAnnualPct:            number | null;

  // Fee depositi/prelievi
  depositWireEUR:          number | null;
  depositFiatPct:          number | null;
  withdrawalWireEUR:      number | null;
  withdrawalFeeUSD:       number | null;
  withdrawalFeeUSDCheap:  number | null;
  inactivityFeeMonthlyEUR: number | null;

  // Slippage / Execution
  slippageAvgBps:          number | null;
  slippageNewsBps:         number | null;
  executionType:          ExecutionType | null;
  maxSlippageOnInstantBps: number | null;

  // Metadata
  lastUpdated:             string;
  dataSource:              string;
  notes:                   string;
};

export type RankedResult = {
  rank:         number;
  broker:       import('./broker.types').Broker;
  accountType:  import('./broker.types').AccountType;
  offer:        InstrumentOffer;
  totalCostBps: number;
  costBreakdown: {
    spreadBps:     number;
    commissionBps: number;
    overnightBps:  number;
    fundingBps:    number;
    rebasingBps:  number;
    fxBps:         number;
    otherBps:      number;
  };
  warnings:    string[];
  compatibilityFlags: {
    leverageOk:     boolean;
    accountSizeOk:  boolean;
    positionSizeOk: boolean;
    horizonOk:      boolean;
    accessibleIT:   boolean;
  };
};