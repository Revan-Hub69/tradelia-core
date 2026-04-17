'use client';

import { useCallback, useState } from 'react';

import type { AssetId } from '../ui/AssetSelector';

export type SimState = 'closed' | 'wizard' | 'results_compare' | 'results_detail';

export type SimulatorInput = {
  assetId: AssetId;
  pairSymbol?: string;
  capital: number;
  tradesPerMonth: number;
  lotSize: number;
  underlyingId?: string;
};

export type SimulatorState = {
  // UI State
  isOpen: boolean;
  currentState: SimState;

  // Selection
  selectedAsset: AssetId | null;
  selectedBrokerId: string | null;

  // Input
  input: SimulatorInput | null;

  // Results (mock for now)
  results: MockResult[] | null;
};

export type MockResult = {
  id: string;
  rank: number;
  brokerName: string;
  accountType: string;
  costPerTrade: number;
  costPerMonth: number;
  score: number;
  isWinner?: boolean;
};

const initialState: SimulatorState = {
  isOpen: false,
  currentState: 'closed',
  selectedAsset: null,
  selectedBrokerId: null,
  input: null,
  results: null,
};

// Mock results for UI development
const MOCK_RESULTS: MockResult[] = [
  {
    id: '1',
    rank: 1,
    brokerName: 'Tickmill Pro',
    accountType: 'ECN',
    costPerTrade: 2.5,
    costPerMonth: 42,
    score: 94,
    isWinner: true,
  },
  {
    id: '2',
    rank: 2,
    brokerName: 'IC Markets',
    accountType: 'Raw Spread',
    costPerTrade: 3.2,
    costPerMonth: 54,
    score: 89,
  },
  {
    id: '3',
    rank: 3,
    brokerName: 'Pepperstone',
    accountType: 'Razor',
    costPerTrade: 4.1,
    costPerMonth: 68,
    score: 82,
  },
  {
    id: '4',
    rank: 4,
    brokerName: 'OANDA',
    accountType: 'Core',
    costPerTrade: 5.8,
    costPerMonth: 96,
    score: 71,
  },
  {
    id: '5',
    rank: 5,
    brokerName: 'XTB',
    accountType: 'Pro',
    costPerTrade: 7.2,
    costPerMonth: 120,
    score: 65,
  },
];

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
      results: MOCK_RESULTS,
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
