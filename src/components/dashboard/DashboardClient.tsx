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
import { DashboardContextProvider } from '@/contexts/DashboardContext';

// Dynamic import for DashboardHeader - SSR-safe with skeleton components
const DashboardHeader = dynamic(
  () => import('./DashboardHeader').then(mod => ({ default: mod.DashboardHeader })),
  {
    ssr: true, // ENABLED: Components inside use mounted flag + skeletons
    loading: () => (
      <div
        className="glass-header header-height layer-header"
        style={{ minHeight: '64px' }}
        aria-hidden="true"
        role="presentation"
      />
    ),
  },
);

// Dynamic imports for performance optimization - ALL heavy components lazy loaded
const SidebarNavigation = dynamic(
  () => import('@/components/navigation/SidebarNavigation').then(mod => ({ default: mod.SidebarNavigation })),
  {
    ssr: false,
    loading: () => (
      <aside
        className="glass-sidebar"
        style={{ width: '240px', minWidth: '240px' }}
        aria-hidden="true"
        role="presentation"
      />
    ),
  },
);

const BottomNavigationSimple = dynamic(
  () => import('@/components/navigation/BottomNavigationSimple').then(mod => ({ default: mod.BottomNavigationSimple })),
  {
    ssr: false,
    loading: () => null, // Bottom nav non causa layout shift (fixed bottom)
  },
);

const CommandPalette = dynamic(
  () => import('@/components/navigation/CommandPalette').then(mod => ({ default: mod.CommandPalette })),
  {
    ssr: false,
    loading: () => null, // Modal non causa layout shift
  },
);

type DashboardClientProps = {
  children: React.ReactNode;
};

export function DashboardClient({ children }: DashboardClientProps) {
  return (
    <NavigationProvider>
      <DashboardContextProvider>
        {/*
          CSS Grid Layout Container - Best Practice 2026

          Mobile (<768px): Single column, sidebar hidden
          Tablet/Desktop (≥768px): Two columns [sidebar | content]

          Grid automatically handles:
          - Sidebar width allocation
          - Main content fills remaining space
          - No manual margin calculations needed
        */}
        <div className="grid min-h-screen md:grid-cols-[var(--sidebar-width-current)_1fr]" suppressHydrationWarning>
          {/* Sidebar Navigation - Lazy loaded (framer-motion heavy) */}
          <Suspense fallback={null}>
            <SidebarNavigation />
          </Suspense>

          {/* Main Content Area - Grid automatically sizes this */}
          <div className="flex min-h-screen flex-col">
            {/* Header - Sticky at top of content area */}
            <DashboardHeader showScrollShadow hideOnScroll />

            {/* Main Content - Server Component passed as children */}
            <main id="main-content" className="flex-1 px-4 py-6 pt-20">
              {children}
            </main>
          </div>
        </div>

        {/* Bottom Navigation - Lazy loaded */}
        <BottomNavigationSimple />

        {/* Command Palette - Lazy loaded */}
        <CommandPalette />
      </DashboardContextProvider>
    </NavigationProvider>
  );
}
