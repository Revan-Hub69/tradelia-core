/**
 * Sidebar State Store - Tradelia 2026
 * 
 * Store Zustand per la gestione dello stato della sidebar.
 * Supporta 3 stati: expanded (280px), compact (72px), hidden (0px)
 * Persistenza con localStorage per device-specific state.
 */

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { SidebarState, SidebarStore } from './types';

const STORAGE_KEY = 'tradelia-sidebar-state';

export const useSidebarStore = create<SidebarStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        state: 'expanded' as SidebarState,
        isTransitioning: false,
        isHydrated: false,
        
        setState: (state: SidebarState) => {
          set({ isTransitioning: true, state });
          // Reset transitioning after animation completes (300ms)
          setTimeout(() => set({ isTransitioning: false }), 300);
        },
        
        toggle: () => {
          const current = get().state;
          // Cycle: expanded -> compact -> hidden -> expanded
          const next: SidebarState = 
            current === 'expanded' ? 'compact' : 
            current === 'compact' ? 'hidden' : 'expanded';
          get().setState(next);
        },
        
        setHydrated: () => set({ isHydrated: true }),
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({ state: state.state }), // Only persist the state, not isTransitioning or isHydrated
        onRehydrateStorage: () => (state) => {
          // Mark as hydrated when rehydration completes
          if (state) {
            state.setHydrated();
          }
        },
      }
    )
  )
);

// Selector hooks for specific state values
export const useSidebarState = () => useSidebarStore((state) => state.state);
export const useIsSidebarExpanded = () => useSidebarStore((state) => state.state === 'expanded');
export const useIsSidebarCompact = () => useSidebarStore((state) => state.state === 'compact');
export const useIsSidebarHidden = () => useSidebarStore((state) => state.state === 'hidden');
export const useIsSidebarTransitioning = () => useSidebarStore((state) => state.isTransitioning);
export const useIsSidebarHydrated = () => useSidebarStore((state) => state.isHydrated);
