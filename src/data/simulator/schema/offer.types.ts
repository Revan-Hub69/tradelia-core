// ============================================================
// OFFER TYPES — Schema InstrumentOffer
//
// AGGIORNAMENTO v1:
//   + availableContractSizes  — taglie futures disponibili per questo broker
//   + contractSizeNominalEUR  — nozionale per taglia (micro/mini/full)
//   + exchangeFeePerContractEUR — fee CME/Eurex separata dalla commission broker
//
// AGGIORNAMENTO v1.1 (fix SOTA):
//   + minLotSize              — lotto minimo per questo offer (default 0.01)
//
// AGGIORNAMENTO v1.2 (refactor overnight):
//   RIMOSSO overnight dal motore di calcolo.
//   Gli swap cambiano ogni giorno (tassi banca centrale + markup broker)
//   → falsa precisione includerli nel ranking.
//   I dati swap restano come campo informativo (swapInfo) sul result,
//   NON entrano in totalCostEUR né influenzano il ranking.
// ============================================================

import type { InstrumentTypeId } from '../instruments';
import type { UnderlyingGroupId } from '../underlying-groups';
import type { HorizonId } from '../horizons';
import type { AccountTypeId, BrokerId } from './broker.types';
import type { UnderlyingId } from './index';
import type { FuturesContractSize } from '../instruments';

export type ExecutionType = 'instant' | 'market';

export type UnderlyingOfferOverride = {
  spreadAvgBps:         number | null;
  spreadMinBps:         number | null;
  spreadMaxBps:         number | null;
  // swap: dato informativo — non entra nel calcolo motore
  swapLongPipsPerDay:   number | null;
  swapShortPipsPerDay:  number | null;
  marginRequirementPct: number | null;
  slippageAvgBps:       number | null;
};

/**
 * Dato informativo sugli swap di un offer per un underlying specifico.
 * NON entra nel calcolo del motore — esposto come SwapInfo sul SimulatorResult.
 * Long e short mostrati separatamente perché dipendono dal differenziale tassi.
 */
export type SwapInfo = {
  longPipsPerDay:  number | null;  // negativo = costo, positivo = credito
  shortPipsPerDay: number | null;
  lastUpdated:     string | null;  // ISO date "YYYY-MM-DD" — per trasparenza
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
  availableContractSizes: FuturesContractSize[] | null;
  contractSizeNominalEUR: Partial<Record<NonNullable<FuturesContractSize>, number>> | null;

  // ── Override per singolo underlying ────────────────────────────
  underlyingOverrides: Partial<Record<UnderlyingId, UnderlyingOfferOverride>> | null;

  // ── Margin ───────────────────────────────────────────────────
  marginRequirementPct:  number;
  maintenanceMarginPct:  number | null;

  // ── Lot size ─────────────────────────────────────────────────
  /**
   * Lotto minimo per questo offer.
   * FX standard: 0.01 (micro lot = 1.000 unità base)
   * Alcuni broker ECN: 0.001 (nano lot)
   * Futures: non applicabile (usa contracts invece)
   */
  minLotSize: number;

  // ── Commissioni ─────────────────────────────────────────────
  commissionPerLotEUR:       number | null; // CFD ECN / Spot FX
  commissionPerLotUSD:       number | null;
  commissionPerContractEUR:  number | null; // Futures — commission broker
  commissionPerContractUSD:  number | null;
  commissionMinPerTradeEUR:  number | null;
  commissionMinPerTradeUSD:  number | null;
  commissionNotes:           string;

  // ── Exchange Fee (futures only) ─────────────────────────────
  exchangeFeePerContractEUR: number | null;
  exchangeFeePerContractUSD: number | null;

  // ── Spread ─────────────────────────────────────────────────
  spreadAvgBps: number;
  spreadMinBps: number;
  spreadMaxBps: number;
  spreadNotes:  string;

  // ── Swap / Overnight — DATO INFORMATIVO (non entra nel motore) ─
  /**
   * Valori indicativi swap. Cambiano ogni giorno in base a:
   *   - Differenziale tassi banche centrali (Fed, BCE, BoE...)
   *   - Markup broker sul tasso interbancario
   * Non includere nel calcolo totalCostEUR.
   * Esporre come SwapInfo sul SimulatorResult con lastUpdated visibile.
   */
  swapLongPipsPerDay:  number | null;
  swapShortPipsPerDay: number | null;
  swapLastUpdated:     string | null;  // "YYYY-MM-DD"
  swapNotes:           string;

  // ── Roll (futures) ─────────────────────────────────────────
  rollSpreadBps:     number | null;
  rollFrequencyDays: number | null;
  rollNotes:         string;

  // ── FX Conversion ────────────────────────────────────────
  fxConversionBps: number | null;

  // ── Slippage / Execution ──────────────────────────────────
  slippageAvgBps:          number | null;
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
  selectedContractSize: NonNullable<FuturesContractSize> | null;
  totalCostBps: number;
  costBreakdown: {
    spreadBps:      number;
    commissionBps:  number;
    exchangeFeeBps: number;
    // overnight/swap NON incluso — vedi swapInfo
    rollBps:        number;
    fxBps:          number;
    otherBps:       number;
  };
  // Dato informativo swap — NON influenza il ranking
  swapInfo: SwapInfo | null;
  warnings:    string[];
  compatibilityFlags: {
    leverageOk:      boolean;
    accountSizeOk:   boolean;
    positionSizeOk:  boolean;
    horizonOk:       boolean;
    accessibleIT:    boolean;
    contractSizeOk:  boolean;
  };
};
