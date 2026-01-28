/*
 * NAVIGATION PROVIDER - Global Navigation State
 *
 * Provides keyboard shortcuts and navigation state management
 * Ensures consistent behavior across all navigation components
 * Manages drawer/modal visibility state for bottom nav coordination
 */

'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

type NavigationContextType = {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  setOverlayOpen: (isOpen: boolean) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

type NavigationProviderProps = {
  children: React.ReactNode;
};

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Track if any overlay (drawer, modal, bottom sheet) is open
  // This is used to hide bottom navigation on mobile
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const openOverlay = useCallback(() => {
    setIsOverlayOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  const setOverlayOpen = useCallback((isOpen: boolean) => {
    setIsOverlayOpen(isOpen);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ isOverlayOpen, openOverlay, closeOverlay, setOverlayOpen }),
    [isOverlayOpen, openOverlay, closeOverlay, setOverlayOpen],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook to use navigation context
export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};
