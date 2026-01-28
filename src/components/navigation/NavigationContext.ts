/*
 * NAVIGATION CONTEXT
 *
 * Separated context definition for Fast Refresh compatibility
 * React Fast Refresh requires files to only export components
 */

'use client';

import { createContext } from 'react';

export type NavigationContextType = {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  setOverlayOpen: (isOpen: boolean) => void;
};

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
