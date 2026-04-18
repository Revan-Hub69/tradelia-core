'use client';

import { useCallback, useState } from 'react';

import type { AssetId } from '../data/assets';
import type { BrokerAccount, BrokerTier, TradingMode } from '../data/brokers';
import { BROKER_ACCOUNTS, computeCostBreakdown, estimateMonthlyCost } from '../data/brokers';

export type SimState = 'closed' | 'wizard' | 'results_compare' | 'results_detail';

export type SimulatorInput = {
  assetId: AssetId;
  pairSymbol?: string;
  capital: number;
  tradesPerMonth: number;
  lotSize: number;
  /** Modalità operativa: intraday (nessuno swap) o multiday (swap incluso nel calcolo). */
  mode: TradingMode;
  /** Giorni medi di esposizione overnight al mese (0-30). Solo se mode=multiday. */
  exposureDaysPerMonth?: number;
  underlyingId?: string;
};

export type BrokerResult = {
  id: string;
  rank: number;
  brokerName: string;
  accountName: string;
  tier: BrokerTier;
  minDepositEur: number;
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
  };
  score: number;
  isWinner?: boolean;
  isEligible: boolean;
  regulator: string;
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
    mode: input.mode,
    exposureDaysPerMonth: input.exposureDaysPerMonth ?? 0,
  };
  const scored = BROKER_ACCOUNTS.map((account: BrokerAccount) => {
    const costPerMonth = estimateMonthlyCost(account, ctx);
    const costPerTrade = costPerMonth / Math.max(1, input.tradesPerMonth);
    const isEligible = input.capital >= account.minDepositEur;
    return { account, costPerMonth, costPerTrade, isEligible };
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

  return scored.map((s, idx) => {
    const normalized = 1 - (s.costPerMonth - bestCost) / range;
    const score = Math.round(Math.max(30, Math.min(100, normalized * 100)));
    const breakdown = computeCostBreakdown(s.account, ctx);
    return {
      id: s.account.id,
      rank: idx + 1,
      brokerName: s.account.brokerName,
      accountName: s.account.accountName,
      tier: s.account.tier,
      minDepositEur: s.account.minDepositEur,
      costPerTrade: Number(s.costPerTrade.toFixed(2)),
      costPerMonth: Number(s.costPerMonth.toFixed(2)),
      deltaVsBestMonth: Number((s.costPerMonth - bestCost).toFixed(2)),
      spreadEurUsdPip: s.account.spreadEurUsdPip,
      commissionPerLotEur: s.account.commissionPerLotEur,
      breakdown,
      score,
      isWinner: idx === 0 && s.isEligible,
      isEligible: s.isEligible,
      regulator: s.account.regulator,
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
