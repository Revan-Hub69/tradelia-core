/**
 * Sidebar State Feature Types - Tradelia 2026
 */

export type SidebarState = 'expanded' | 'compact' | 'hidden';

export interface SidebarStore {
  state: SidebarState;
  setState: (state: SidebarState) => void;
  toggle: () => void;
  isTransitioning: boolean;
  isHydrated: boolean;
  setHydrated: () => void;
}

export interface SidebarConfig {
  defaultState: SidebarState;
  persistState: boolean;
  animationDuration: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}