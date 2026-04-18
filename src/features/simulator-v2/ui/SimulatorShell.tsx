'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import type { AssetId } from '../data/assets';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { BottomSheet } from '../layout/BottomSheet';
import { Drawer } from '../layout/Drawer';
import type { BrokerResult, SimulatorInput } from '../state/useSimulatorState';
import { computeResults } from '../state/useSimulatorState';
import { CompareView } from './CompareView';
import { DetailView } from './DetailView';
import { Wizard } from './Wizard';

type ShellState = 'wizard' | 'results_compare' | 'results_detail';

type SimulatorShellProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  assetId: AssetId | null;
};

export function SimulatorShell({ isOpen, onCloseAction, assetId }: SimulatorShellProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [view, setView] = useState<ShellState>('wizard');
  const [input, setInput] = useState<SimulatorInput | null>(null);
  const [results, setResults] = useState<BrokerResult[] | null>(null);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView('wizard');
      setInput(null);
      setResults(null);
      setSelectedBrokerId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = useCallback((nextInput: SimulatorInput) => {
    setInput(nextInput);
    setResults(computeResults(nextInput));
    setView('results_compare');
  }, []);

  const handleUpdateInput = useCallback((patch: Partial<SimulatorInput>) => {
    setInput((prev) => {
      if (!prev) {
        return prev;
      }
      const next = { ...prev, ...patch };
      setResults(computeResults(next));
      return next;
    });
  }, []);

  const handleSelectBroker = useCallback((brokerId: string) => {
    setSelectedBrokerId(brokerId);
    setView('results_detail');
  }, []);

  const handleBackToCompare = useCallback(() => {
    setSelectedBrokerId(null);
    setView('results_compare');
  }, []);

  const getSelectedBroker = () => {
    if (!selectedBrokerId || !results) {
      return null;
    }
    return results.find(r => r.id === selectedBrokerId) ?? null;
  };

  const renderContent = () => {
    if (!assetId) {
      return null;
    }

    switch (view) {
      case 'wizard':
        return (
          <Wizard
            assetId={assetId}
            onSubmitAction={handleSubmit}
            onCloseAction={onCloseAction}
          />
        );
      case 'results_compare':
        if (!results || !input) {
          return null;
        }
        return (
          <CompareView
            results={results}
            input={input}
            onSelectBrokerAction={handleSelectBroker}
            onBackAction={() => setView('wizard')}
            onCloseAction={onCloseAction}
            onUpdateInputAction={handleUpdateInput}
          />
        );
      case 'results_detail': {
        const broker = getSelectedBroker();
        if (!broker) {
          return null;
        }
        return (
          <DetailView
            broker={broker}
            onBackAction={handleBackToCompare}
            onCloseAction={onCloseAction}
          />
        );
      }
      default:
        return null;
    }
  };

  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );

  if (isDesktop) {
    return (
      <Drawer isOpen={isOpen} onClose={onCloseAction} width="560px">
        {content}
      </Drawer>
    );
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onCloseAction}>
      {content}
    </BottomSheet>
  );
}
