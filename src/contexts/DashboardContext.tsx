/*
 * DASHBOARD CONTEXT - Centralized Navigation State
 *
 * Read-only context for dashboard navigation awareness
 * Single source of truth for section, title, status
 * Consumed by Header, Sidebar, BottomNav, CommandPalette
 */

'use client';

import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type DashboardSection =
  | 'home'
  | 'learn'
  | 'progress'
  | 'community'
  | 'profile';

export type StatusChip = {
  type: 'streak' | 'focus' | 'next' | 'progress';
  value: number | string;
  labelKey?: string;
};

export type DashboardContextType = {
  section: DashboardSection;
  titleKey: string;
  status?: StatusChip;
  breadcrumb?: string[];
};

// ============================================================================
// CONTEXT
// ============================================================================

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

type DashboardContextProviderProps = {
  children: ReactNode;
};

export function DashboardContextProvider({ children }: DashboardContextProviderProps) {
  const pathname = usePathname();

  // Derive context from pathname (single source of truth)
  const contextValue = useMemo<DashboardContextType>(() => {
    // Remove locale prefix if present
    const cleanPath = pathname.replace(/^\/(en|it|es|fr|de)/, '');

    // Map pathname to section
    if (cleanPath === '/dashboard' || cleanPath === '/dashboard/') {
      return {
        section: 'home',
        titleKey: 'Dashboard.nav_home',
        breadcrumb: ['Dashboard'],
      };
    }

    if (cleanPath.startsWith('/dashboard/learn') || cleanPath.startsWith('/dashboard/path')) {
      return {
        section: 'learn',
        titleKey: 'Dashboard.nav_learn',
        breadcrumb: ['Dashboard', 'Learn'],
      };
    }

    if (cleanPath.startsWith('/dashboard/progress')) {
      return {
        section: 'progress',
        titleKey: 'Dashboard.nav_progress',
        breadcrumb: ['Dashboard', 'Progress'],
      };
    }

    if (cleanPath.startsWith('/dashboard/community')) {
      return {
        section: 'community',
        titleKey: 'Dashboard.nav_community',
        breadcrumb: ['Dashboard', 'Community'],
      };
    }

    if (cleanPath.startsWith('/dashboard/profile') || cleanPath.startsWith('/dashboard/user-profile')) {
      return {
        section: 'profile',
        titleKey: 'Dashboard.nav_profile',
        breadcrumb: ['Dashboard', 'Profile'],
      };
    }

    // Default fallback
    return {
      section: 'home',
      titleKey: 'Dashboard.nav_home',
      breadcrumb: ['Dashboard'],
    };
  }, [pathname]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useDashboardContext() {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error('useDashboardContext must be used within DashboardContextProvider');
  }

  return context;
}

// ============================================================================
// OPTIONAL: Hook with default fallback (no throw)
// ============================================================================

export function useDashboardContextSafe(): DashboardContextType {
  const context = useContext(DashboardContext);

  // Fallback if used outside provider
  if (context === undefined) {
    return {
      section: 'home',
      titleKey: 'Dashboard.nav_home',
      breadcrumb: ['Dashboard'],
    };
  }

  return context;
}
