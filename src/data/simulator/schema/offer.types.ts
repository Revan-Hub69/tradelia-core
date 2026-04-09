// ============================================================
// OFFER TYPES — Schema puro per InstrumentOffer
// ============================================================

import type { InstrumentTypeId } from '../instruments';
import type { UnderlyingGroupId } from '../underlying-groups';
import type { HorizonId } from '../horizons';
import type { AccountTypeId } from './broker.types';

export type InstrumentOffer = {
  accountTypeId:            AccountTypeId;
  instrumentTypeId:         InstrumentTypeId;
  ugIds:                    UnderlyingGroupId[];
  compatibleHorizons:       HorizonId[];
  minPositionEUR:           number;
  maxLeverageOffered:       number | null;
  marginRequirementPct:     number;
  maintenanceMarginPct:     number | null;
  commissionPerLotEUR:      number | null;
  commissionPerLotUSD:      number | null;
  commissionPerContractEUR: number | null;
  commissionPerContractUSD: number | null;
  makerFeePct:              number | null;
  takerFeePct:              number | null;
  commissionNotes:          string;
  spreadAvgBps:             number;
  spreadMinBps:            number;
  spreadMaxBps:            number;
  spreadNotes:              string;
  overnightLongAnnualPct:  number | null;
  overnightShortAnnualPct: number | null;
  overnightTripleDay:      'wednesday' | 'friday' | 'none' | null;
  overnightNotes:          string;
  fundingRateTypicalPct8h: number | null;
  fundingRateMaxPct8h:      number | null;
  fundingNotes:             string;
  rebasingLeverageMult:    number | null;
  rebasingNotes:           string;
  rollSpreadBps:           number | null;
  rollFrequencyDays:        number | null;
  rollNotes:                string;
  koDistancePctTypical:    number | null;
  koNotes:                 string;
  fxConversionBps:         number | null;
  terAnnualPct:             number | null;
  depositFiatPct:           number | null;
  withdrawalFeeUSD:         number | null;
  withdrawalFeeUSDCheap:    number | null;
  slippageAvgBps:           number | null;
  slippageNewsBps:          number | null;
  notes:                    string;
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