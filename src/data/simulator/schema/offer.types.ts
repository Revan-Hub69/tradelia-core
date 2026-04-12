// ============================================================
// OFFER TYPES — Schema InstrumentOffer
//
// AGGIORNAMENTO v1:
//   + availableContractSizes  — taglie futures disponibili per questo broker
//   + contractSizeNominalEUR  — nozionale per taglia (micro/mini/full)
//   + exchangeFeePerContractEUR — fee CME/Eurex separata dalla commission broker
// ============================================================

import type { InstrumentTypeId } from '../instruments';
import type { UnderlyingGroupId } from '../underlying-groups';
import type { HorizonId } from '../horizons';
import type { AccountTypeId, BrokerId } from './broker.types';
import type { UnderlyingId } from './index';
import type { FuturesContractSize } from '../instruments';

export type ExecutionType = 'instant' | 'market';

export type UnderlyingOfferOverride = {
  spreadAvgBps:             number | null;
  spreadMinBps:             number | null;
  spreadMaxBps:             number | null;
  overnightLongPipsPerDay:  number | null;
  overnightShortPipsPerDay: number | null;
  marginRequirementPct:     number | null;
  slippageAvgBps:           number | null;
};

export type InstrumentOffer = {
  // ── Identificazione ────────────────────────────────────────────
  brokerId:           BrokerId;
  accountTypeId:      AccountTypeId;
  instrumentTypeId:   InstrumentTypeId;
  ugIds:              UnderlyingGroupId[];
  compatibleHorizons: HorizonId[];
  minPositionEUR:     number;
  maxLeverageOffered: number | null;

  // ── Contract Size (futures only) ──────────────────────────────
  /**
   * Taglie contratto che questo broker offre per questo strumento.
   * null = non applicabile (CFD, Spot FX).
   *
   * Il motore usa questo campo + il capitale utente per determinare
   * quale taglia è accessibile:
   *   micro → margin ~250 EUR  (accessibile da ~500 EUR capitale)
   *   mini  → margin ~1.250 EUR (accessibile da ~2.500 EUR capitale)
   *   full  → margin ~2.500 EUR (accessibile da ~5.000 EUR capitale)
   */
  availableContractSizes: FuturesContractSize[] | null;
  /**
   * Nozionale in EUR per taglia — valori CME FX futures (EUR/USD come riferimento).
   * Il motore usa questo per normalizzare i costi in bps sul nozionale.
   */
  contractSizeNominalEUR: Partial<Record<NonNullable<FuturesContractSize>, number>> | null;

  // ── Override per singolo underlying ────────────────────────────
  underlyingOverrides: Partial<Record<UnderlyingId, UnderlyingOfferOverride>> | null;

  // ── Margin ───────────────────────────────────────────────────
  marginRequirementPct:  number;
  maintenanceMarginPct:  number | null;

  // ── Commissioni ─────────────────────────────────────────────
  commissionPerLotEUR:       number | null; // CFD ECN / Spot FX
  commissionPerLotUSD:       number | null;
  commissionPerContractEUR:  number | null; // Futures — commission broker
  commissionPerContractUSD:  number | null;
  commissionMinPerTradeEUR:  number | null;
  commissionMinPerTradeUSD:  number | null;
  commissionNotes:           string;

  // ── Exchange Fee (futures only) ─────────────────────────────
  /**
   * Fee CME/Eurex separata dalla commission broker.
   * Per futures FX CME (2025):
   *   full/mini → ~1.50 USD per contratto (exchange + NFA + regulatory)
   *   micro     → ~0.35 USD per contratto
   * null = non applicabile (CFD, Spot)
   */
  exchangeFeePerContractEUR: number | null;
  exchangeFeePerContractUSD: number | null;

  // ── Spread ─────────────────────────────────────────────────
  spreadAvgBps: number;
  spreadMinBps: number;
  spreadMaxBps: number;
  spreadNotes:  string;

  // ── Overnight / Swap ───────────────────────────────────────
  overnightLongPipsPerDay:   number | null;
  overnightShortPipsPerDay:  number | null;
  overnightTripleDay:        'wednesday' | 'friday' | 'none' | null;
  overnightTripleMultiplier: number | null;
  overnightNotes:            string;

  // ── Roll (futures) ─────────────────────────────────────────
  rollSpreadBps:    number | null;
  rollFrequencyDays: number | null;
  rollNotes:        string;

  // ── FX Conversion ────────────────────────────────────────
  fxConversionBps: number | null;

  // ── Slippage / Execution ──────────────────────────────────
  slippageAvgBps:          number | null; // solo da fonti verificate (MyFXBook)
  executionType:           ExecutionType | null;
  maxSlippageOnInstantBps: number | null;

  // ── Fee account ──────────────────────────────────────────
  depositWireEUR:           number | null;
  withdrawalWireEUR:        number | null;
  inactivityFeeMonthlyEUR:  number | null;

  // ── Metadata ─────────────────────────────────────────────
  lastUpdated: string;
  dataSource:  string;
  notes:       string;
};

export type RankedResult = {
  rank:         number;
  broker:       import('./broker.types').Broker;
  accountType:  import('./broker.types').AccountType;
  offer:        InstrumentOffer;
  /**
   * Taglia contratto selezionata dal motore per questo risultato.
   * null per CFD/Spot.
   */
  selectedContractSize: NonNullable<FuturesContractSize> | null;
  totalCostBps: number;
  costBreakdown: {
    spreadBps:     number;
    commissionBps: number;
    exchangeFeeBps: number; // nuovo — fee CME separata
    overnightBps:  number;
    rollBps:       number;
    fxBps:         number;
    otherBps:      number;
  };
  warnings:    string[];
  compatibilityFlags: {
    leverageOk:      boolean;
    accountSizeOk:   boolean;
    positionSizeOk:  boolean;
    horizonOk:       boolean;
    accessibleIT:    boolean;
    contractSizeOk:  boolean; // nuovo — capitale sufficiente per la taglia
  };
};
