/*
 * NAVIGATION PROVIDER - Global Navigation State
 * 
 * Provides keyboard shortcuts and navigation state management
 * Ensures consistent behavior across all navigation components
 */

'use client';

import React from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

type NavigationProviderProps = {
  children: React.ReactNode;
};

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return <>{children}</>;
};