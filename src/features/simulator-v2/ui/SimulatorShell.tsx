'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { useMediaQuery } from '../hooks/useMediaQuery';
import { BottomSheet } from '../layout/BottomSheet';
import { Drawer } from '../layout/Drawer';
import type { MockResult, SimulatorInput } from '../state/useSimulatorState';
import { MOCK_RESULTS } from '../state/useSimulatorState';
import type { AssetId } from './AssetSelector';
import { CompareView } from './CompareView';
import { DetailView } from './DetailView';
import { Wizard } from './Wizard';

type ShellState = 'wizard' | 'results_compare' | 'results_detail';

type SimulatorShellProps = {
  isOpen: boolean;
  onClose: () => void;
  assetId: AssetId | null;
};

export function SimulatorShell({ isOpen, onClose, assetId }: SimulatorShellProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [view, setView] = useState<ShellState>('wizard');
  const [, setInput] = useState<SimulatorInput | null>(null);
  const [results, setResults] = useState<MockResult[] | null>(null);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  // Reset state every time shell opens
  useEffect(() => {
    if (isOpen) {
      setView('wizard');
      setInput(null);
      setResults(null);
      setSelectedBrokerId(null);
    }
  }, [isOpen]);

  // Lock body scroll when open
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
    setResults(MOCK_RESULTS);
    setView('results_compare');
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
            onSubmit={handleSubmit}
            onClose={onClose}
          />
        );
      case 'results_compare':
        if (!results) {
          return null;
        }
        return (
          <CompareView
            results={results}
            onSelectBroker={handleSelectBroker}
            onBack={() => setView('wizard')}
            onClose={onClose}
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
            onBack={handleBackToCompare}
            onClose={onClose}
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
      <Drawer isOpen={isOpen} onClose={onClose} width="560px">
        {content}
      </Drawer>
    );
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {content}
    </BottomSheet>
  );
}
