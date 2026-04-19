'use client';

import { useCallback, useState } from 'react';

import type { AssetId } from '../data/assets';
import type { BrokerAccount, BrokerTier } from '../data/brokers';
import { BROKER_ACCOUNTS, computeCostBreakdown, estimateMonthlyCost } from '../data/brokers';

export type SimState = 'closed' | 'wizard' | 'results_compare' | 'results_detail';

export type SimulatorInput = {
  assetId: AssetId;
  pairSymbol?: string;
  capital: number;
  tradesPerMonth: number;
  lotSize: number;
  /** Giorni medi di esposizione overnight al mese (0-25). 0 = intraday (no swap). */
  exposureDaysPerMonth: number;
  underlyingId?: string;
};

export type IneligibilityCode =
  | 'capital-below-min-deposit'
  | 'lot-below-min-lot'
  | 'lot-above-max-lot'
  | 'capital-insufficient-for-leverage';

export type BrokerResult = {
  id: string;
  /** Rank solo per broker eligibili. Ineligibili = null. */
  rank: number | null;
  brokerName: string;
  accountName: string;
  tier: BrokerTier;
  minDepositEur: number;
  minLotSize: number;
  maxLotSize?: number;
  /** Margine richiesto (€) sul capitale per aprire la posizione su questo account. */
  marginRequiredEur?: number;
  costPerTrade: number;
  costPerMonth: number;
  /** Delta vs best eligible broker (€/mese). 0 per il winner. */
  deltaVsBestMonth: number;
  /** Raw specs */
  spreadEurUsdPip: number;
  commissionPerLotEur: number;
  /** Breakdown costo calcolato */
  breakdown: {
    spreadPerTrade: number;
    commissionPerTrade: number;
    spreadPerMonth: number;
    commissionPerMonth: number;
    swapPerMonth: number;
    /** Markup broker €/lot/notte — metrica discriminante per swap ranking. */
    swapMarkupPerLotNight: number;
    /** Effective swap days contando triple swap day. */
    effectiveSwapDays: number;
    /** FX conversion cost mensile (0 se non applicabile). */
    fxConversionPerMonth: number;
    /** Notional per trade per riferimento. */
    notionalPerTrade: number;
  };
  score: number;
  isWinner?: boolean;
  isEligible: boolean;
  /** Codici motivo ineligibilità (vuoto se eligible). */
  ineligibilityReasons: IneligibilityCode[];
  /** Regolatore principale (da entity V2) */
  regulator: string;
  /** License number se disponibile */
  licenseNumber?: string;
};

// Back-compat alias
export type MockResult = BrokerResult;

export type SimulatorState = {
  isOpen: boolean;
  currentState: SimState;
  selectedAsset: AssetId | null;
  selectedBrokerId: string | null;
  input: SimulatorInput | null;
  results: BrokerResult[] | null;
};

const initialState: SimulatorState = {
  isOpen: false,
  currentState: 'closed',
  selectedAsset: null,
  selectedBrokerId: null,
  input: null,
  results: null,
};

/**
 * Compute broker results for a given simulator input.
 * Eligibility = capital >= account.minDepositEur.
 * Ranking considers eligible accounts first, sorted by cost ascending.
 */
export function computeResults(input: SimulatorInput): BrokerResult[] {
  const ctx = {
    lotSize: input.lotSize,
    tradesPerMonth: input.tradesPerMonth,
    exposureDaysPerMonth: input.exposureDaysPerMonth,
    pairSymbol: input.pairSymbol,
    assetId: input.assetId,
    capital: input.capital,
  };
  // Tolleranza per confronto lot (evita errori floating-point).
  const LOT_EPS = 1e-9;

  // Notional standard per 1 lot (forex major = 100.000 unità base).
  // Per asset non-forex questa formula è semplificata; affineremo in futuro.
  const NOTIONAL_PER_LOT_EUR = input.assetId === 'forex' ? 100000 : 10000;

  const scored = BROKER_ACCOUNTS.map((account: BrokerAccount) => {
    // Calcolo costo usando il MAX tra lot richiesto e lot minimo broker —
    // se l'utente chiede 0.001 ma broker min 0.01, il costo reale sarebbe a 0.01.
    // Tuttavia marchiamo ineligible per trasparenza.
    const effectiveLot = Math.max(input.lotSize, account.minLotSize);
    const effectiveCtx = { ...ctx, lotSize: effectiveLot, pairSymbol: input.pairSymbol, assetId: input.assetId };
    const costPerMonth = estimateMonthlyCost(account, effectiveCtx);
    const costPerTrade = costPerMonth / Math.max(1, input.tradesPerMonth);

    // Margine richiesto = notional / leva. Confronto con capitale.
    const leverage = account.accountTrading?.maxLeverageRetail
      ?? account.maxLeverageRetail
      ?? 30;
    const marginRequiredEur = (input.lotSize * NOTIONAL_PER_LOT_EUR) / leverage;

    const maxLotSize = account.accountTrading?.maxLotSize;

    const reasons: IneligibilityCode[] = [];
    if (input.capital < account.minDepositEur) {
      reasons.push('capital-below-min-deposit');
    }
    if (input.lotSize + LOT_EPS < account.minLotSize) {
      reasons.push('lot-below-min-lot');
    }
    if (maxLotSize !== undefined && input.lotSize > maxLotSize + LOT_EPS) {
      reasons.push('lot-above-max-lot');
    }
    // Capitale insufficiente a coprire il margine (usa almeno il 100% del capitale per 1 posizione).
    if (marginRequiredEur > input.capital + 0.01) {
      reasons.push('capital-insufficient-for-leverage');
    }
    const isEligible = reasons.length === 0;
    return { account, costPerMonth, costPerTrade, isEligible, reasons, marginRequiredEur, maxLotSize };
  });

  // Sort: eligible first (by cost asc), then ineligible (by cost asc)
  scored.sort((a, b) => {
    if (a.isEligible !== b.isEligible) {
      return a.isEligible ? -1 : 1;
    }
    return a.costPerMonth - b.costPerMonth;
  });

  // Compute score: best eligible cost = 100, scale linearly
  const eligible = scored.filter(s => s.isEligible);
  const bestCost = eligible[0]?.costPerMonth ?? scored[0]?.costPerMonth ?? 1;
  const worstCost = scored[scored.length - 1]?.costPerMonth ?? bestCost;
  const range = Math.max(1, worstCost - bestCost);

  // Rank counter solo per eligibili
  let eligibleRankCounter = 0;

  return scored.map((s, idx) => {
    const normalized = 1 - (s.costPerMonth - bestCost) / range;
    const score = Math.round(Math.max(30, Math.min(100, normalized * 100)));
    const effectiveLot = Math.max(input.lotSize, s.account.minLotSize);
    const breakdown = computeCostBreakdown(s.account, { ...ctx, lotSize: effectiveLot, pairSymbol: input.pairSymbol, assetId: input.assetId });
    // Rank solo per eligibili
    if (s.isEligible) {
      eligibleRankCounter += 1;
    }
    // Regolatore V2 se disponibile, altrimenti legacy
    const regulatorV2 = s.account.entity?.regulator;
    const licenseV2 = s.account.entity?.licenseNumber;
    return {
      id: s.account.id,
      rank: s.isEligible ? eligibleRankCounter : null,
      brokerName: s.account.brokerName,
      accountName: s.account.accountName,
      tier: s.account.tier,
      minDepositEur: s.account.minDepositEur,
      minLotSize: s.account.minLotSize,
      maxLotSize: s.maxLotSize,
      marginRequiredEur: Number(s.marginRequiredEur.toFixed(2)),
      costPerTrade: Number(s.costPerTrade.toFixed(2)),
      costPerMonth: Number(s.costPerMonth.toFixed(2)),
      deltaVsBestMonth: Number((s.costPerMonth - bestCost).toFixed(2)),
      spreadEurUsdPip: s.account.spreadEurUsdPip,
      commissionPerLotEur: s.account.commissionPerLotEur,
      breakdown,
      score,
      isWinner: idx === 0 && s.isEligible,
      isEligible: s.isEligible,
      ineligibilityReasons: s.reasons,
      regulator: regulatorV2 ?? s.account.regulator,
      licenseNumber: licenseV2,
    };
  });
}

export function useSimulatorState() {
  const [state, setState] = useState<SimulatorState>(initialState);

  const open = useCallback((assetId: AssetId) => {
    setState({
      ...initialState,
      isOpen: true,
      currentState: 'wizard',
      selectedAsset: assetId,
    });
  }, []);

  const close = useCallback(() => {
    setState(initialState);
  }, []);

  const goToWizard = useCallback(() => {
    setState(prev => ({ ...prev, currentState: 'wizard' }));
  }, []);

  const submitWizard = useCallback((input: SimulatorInput) => {
    setState(prev => ({
      ...prev,
      currentState: 'results_compare',
      input,
      results: computeResults(input),
    }));
  }, []);

  const selectBroker = useCallback((brokerId: string) => {
    setState(prev => ({
      ...prev,
      currentState: 'results_detail',
      selectedBrokerId: brokerId,
    }));
  }, []);

  const backToCompare = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentState: 'results_compare',
      selectedBrokerId: null,
    }));
  }, []);

  const getSelectedBroker = useCallback(() => {
    if (!state.selectedBrokerId || !state.results) {
      return null;
    }
    return state.results.find(r => r.id === state.selectedBrokerId) || null;
  }, [state.selectedBrokerId, state.results]);

  return {
    state,
    open,
    close,
    goToWizard,
    submitWizard,
    selectBroker,
    backToCompare,
    getSelectedBroker,
  };
}

// Legacy export for SimulatorShell transition (deprecated, use computeResults)
export const MOCK_RESULTS: BrokerResult[] = [];
