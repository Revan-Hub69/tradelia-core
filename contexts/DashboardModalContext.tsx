'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DashboardModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const DashboardModalContext = createContext<DashboardModalContextType | undefined>(undefined);

export function DashboardModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DashboardModalContext.Provider value={{ isOpen, openModal, closeModal }}>
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