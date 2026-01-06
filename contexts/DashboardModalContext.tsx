'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ModalMode = 'gateway' | 'login';

interface DashboardModalContextType {
  isOpen: boolean;
  initialMode: ModalMode;
  openModal: (mode?: ModalMode) => void;
  closeModal: () => void;
}

const DashboardModalContext = createContext<DashboardModalContextType | undefined>(undefined);

export function DashboardModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<ModalMode>('gateway');

  const openModal = useCallback((mode: ModalMode = 'gateway') => {
    setInitialMode(mode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    // Remove the dummy history state if it exists
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
    setIsOpen(false);
  }, []);

  return (
    <DashboardModalContext.Provider value={{ isOpen, initialMode, openModal, closeModal }}>
      {children}
    </DashboardModalContext.Provider>
  );
}

export function useDashboardModal() {
  const context = useContext(DashboardModalContext);
  if (context === undefined) {
    throw new Error('useDashboardModal must be used within a DashboardModalProvider');
  }
  return context;
}