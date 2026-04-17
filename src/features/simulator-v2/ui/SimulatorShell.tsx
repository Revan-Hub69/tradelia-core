'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { useMediaQuery } from '../hooks/useMediaQuery';
import { BottomSheet } from '../layout/BottomSheet';
import { Drawer } from '../layout/Drawer';
import { useSimulatorState } from '../state/useSimulatorState';
import { CompareView } from './CompareView';
import { DetailView } from './DetailView';
import { Wizard } from './Wizard';

type SimulatorShellProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SimulatorShell({ isOpen, onClose }: SimulatorShellProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const {
    state,
    submitWizard,
    selectBroker,
    backToCompare,
    getSelectedBroker,
  } = useSimulatorState();

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

  // Render content based on current state
  const renderContent = () => {
    if (!state.selectedAsset) {
      return null;
    }

    switch (state.currentState) {
      case 'wizard':
        return (
          <Wizard
            assetId={state.selectedAsset}
            onSubmit={submitWizard}
            onClose={onClose}
          />
        );

      case 'results_compare':
        if (!state.results) {
          return null;
        }
        return (
          <CompareView
            results={state.results}
            onSelectBroker={selectBroker}
            onBack={() => {}}
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
            onBack={backToCompare}
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
        key={state.currentState}
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
