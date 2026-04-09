// ============================================================
// BROKERS — dati reali per asset class
// Struttura: Broker → AccountType → InstrumentOffer
//
// Flusso matcher:
//   SimulatorState (ugId, horizonId, styleId, accountSize,
//                   positionSize, leverageProfile)
//       ↓
//   filterBrokers() → InstrumentOffer[] compatibili
//       ↓
//   scoreBroker()   → RankedResult[] ordinati per costo totale
//
// STATO POPOLAMENTO:
//   ⏳ TODO — Dati da inserire dopo selezione broker
// ============================================================

import type { UnderlyingGroupId }  from './underlying-groups';
import type { InstrumentTypeId }   from './instruments';
import type { HorizonId }          from './horizons';
import type { AccountSizeId }      from './account-sizes';
import type { LeverageProfileId }  from './leverage-profiles';

// ============================================================
// 1. BROKER — entità padre
// ============================================================

export type BrokerId =
  // ── FOREX / CFD ECN ──────────────────────────────────────
  | 'ic_markets'
  | 'pepperstone'
  | 'tickmill'
  | 'admirals'
  | 'xm'
  // ── SPOT FX OTC / ECN NDD ────────────────────────────────
  | 'interactive_brokers'
  | 'dukascopy'
  | 'saxo_bank'
  | 'swissquote'
  // ── FUTURES + MULTI-ASSET ─────────────────────────────────
  | 'exante'
  | 'mexem'
  | 'fineco'
  | 'directa'
  | 'lynx'
  // ── CERTIFICATI SEDEX ────────────────────────────────────
  | 'ig_markets'
  | 'iwbank'
  | 'webank'
  // ── BROKER IT AZIONI / ETF ───────────────────────────────
  | 'degiro'
  | 'scalable_capital'
  | 'flatex'
  | 'trade_republic'
  // ── CRYPTO EXCHANGE ──────────────────────────────────────
  | 'mexc'
  | 'kraken'
  | 'bybit'
  | 'bitget'
  | 'okx'
  | 'deribit';

export type RegulationZone =
  | 'EU'       // CySEC, BaFin, CONSOB, AMF, ecc.
  | 'UK'       // FCA
  | 'AU'       // ASIC
  | 'CH'       // FINMA
  | 'CY'       // CySEC (Cipro)
  | 'offshore' // Seychelles, Vanuatu, ecc.
  | 'US'       // CFTC/NFA
  | 'global';  // exchange globale (Kraken, MEXC)

export type PlatformType =
  | 'mt4'
  | 'mt5'
  | 'ctrader'
  | 'proprietary'
  | 'tws'         // Interactive Brokers Trader Workstation
  | 'web'
  | 'api';

export type Broker = {
  id:               BrokerId;
  name:             string;
  logoSlug:         string;
  website:          string;
  regulationZones:  RegulationZone[];
  accessibleFromIT: boolean;
  minDepositEUR:    number;
  platformTypes:    PlatformType[];
  notes:            string;
};

export const BROKERS: Partial<Record<BrokerId, Broker>> = {

  // TODO: Inserire broker dopo selezione

};

// ============================================================
// 2. ACCOUNT TYPE
// ============================================================

export type AccountTypeId = string;

export type AccountType = {
  id:                         AccountTypeId;
  brokerId:                   BrokerId;
  label:                      string;
  labelEn:                    string;
  accountCurrencies:          ('EUR' | 'USD' | 'GBP')[];
  minDepositEUR:              number;
  compatibleAccountSizes:     AccountSizeId[];
  compatibleLeverageProfiles: LeverageProfileId[];
  notes:                      string;
};

export const ACCOUNT_TYPES: AccountType[] = [

  // TODO: Inserire account types dopo selezione broker

];

// ============================================================
// 3. INSTRUMENT OFFERS — FOREX
// Nota spread: 1 pip EUR/USD = 10 bps sul nozionale 100k
// Nota commission: $7 RT su 100k = 7 bps
// ============================================================

export type InstrumentOffer = {
  accountTypeId:            AccountTypeId;
  instrumentTypeId:         InstrumentTypeId;
  ugIds:                    UnderlyingGroupId[];
  compatibleHorizons:       HorizonId[];
  minPositionEUR:           number;
  maxLeverageOffered:       number | null;
  marginRequirementPct:     number;        // margine iniziale richiesto per questa coppia
  maintenanceMarginPct:    number | null; // margine di mantenimento per liquidation
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
  overnightTripleDay:      'wednesday' | 'friday' | 'none' | null; // giorno triplice swap FX vs crypto
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
  koNotes:                  string;
  fxConversionBps:         number | null;
  terAnnualPct:             number | null;
  depositFiatPct:           number | null;
  withdrawalFeeUSD:         number | null;
  withdrawalFeeUSDCheap:    number | null;
  slippageAvgBps:           number | null;
  slippageNewsBps:          number | null;
  notes:                    string;
};

export const INSTRUMENT_OFFERS: InstrumentOffer[] = [

  // TODO: Inserire offerte strumenti dopo selezione broker

];

// ============================================================
// 4. HELPER TYPES — output del matcher
// ============================================================

export type RankedResult = {
  rank:         number;
  broker:       Broker;
  accountType:  AccountType;
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
