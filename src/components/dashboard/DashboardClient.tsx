/*
 * DASHBOARD CLIENT - Client Component Boundary
 *
 * Client-side interactive layer for dashboard
 * Handles all user interactions, state, and effects
 * Wraps navigation components and interactive features
 *
 * PERFORMANCE OPTIMIZED:
 * - Dynamic imports for heavy components
 * - Suspense boundaries for better UX
 * - Lazy loading for non-critical features
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { NavigationProvider } from '@/components/navigation/NavigationProvider';
import { BottomNavigationSimple } from '@/components/navigation/BottomNavigationSimple';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
import { DashboardContextProvider } from '@/contexts/DashboardContext';

import { DashboardHeader } from './DashboardHeader';

// Dynamic imports for performance optimization
const CommandPalette = dynamic(
  () => import('@/components/navigation/CommandPalette').then(mod => ({ default: mod.CommandPalette })),
  {
    ssr: false,
    loading: () => null, // No loading state needed for command palette
  },
);

type DashboardClientProps = {
  children: React.ReactNode;
};

export function DashboardClient({ children }: DashboardClientProps) {
  return (
    <NavigationProvider>
      <DashboardContextProvider>
        {/* Sidebar Navigation - Tablet and Desktop (768px+) */}
        <Suspense fallback={(
          <div className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border/20 md:block">
            <div className="h-full animate-pulse bg-muted/20" />
          </div>
        )}
        >
          <SidebarNavigation />
        </Suspense>

        {/* Header - Always visible */}
        <DashboardHeader
          showScrollShadow
          hideOnScroll={true}
        />

        {/* Main Content - Server Component passed as children */}
        {children}

        {/* Bottom Navigation - Mobile only (< 768px) */}
        <BottomNavigationSimple />

        {/* Command Palette - Desktop feature (lazy loaded) */}
        <CommandPalette />
      </DashboardContextProvider>
    </NavigationProvider>
  );
}
