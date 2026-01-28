/*
 * USE NAVIGATION CONTEXT HOOK
 *
 * Separated from NavigationProvider for Fast Refresh compatibility
 * React Fast Refresh requires files to only export components
 */

'use client';

import { useContext } from 'react';

import type { NavigationContextType } from './NavigationContext';
import { NavigationContext } from './NavigationContext';

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};
