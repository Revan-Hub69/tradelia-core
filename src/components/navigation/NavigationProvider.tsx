/*
 * NAVIGATION PROVIDER - Global Navigation State
 *
 * Provides keyboard shortcuts and navigation state management
 * Ensures consistent behavior across all navigation components
 * Manages drawer/modal visibility state for bottom nav coordination
 *
 * NOTE: Hook moved to separate file for Fast Refresh compatibility
 */

'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { NavigationContext } from './NavigationContext';

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
