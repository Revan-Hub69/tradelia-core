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
          {/* Sidebar Navigation - Tablet and Desktop (768px+) */}
          {/* Position sticky keeps it visible while scrolling */}
          <Suspense fallback={null}>
            <SidebarNavigation />
          </Suspense>

          {/* Main Content Area - Grid automatically sizes this */}
          <div className="flex min-h-screen flex-col">
            {/* Header - Sticky at top of content area */}
            <DashboardHeader showScrollShadow hideOnScroll={true} />

            {/* Main Content - Server Component passed as children */}
            <main id="main-content" className="flex-1 px-4 py-6 pt-20">
              {children}
            </main>
          </div>
        </div>

        {/* Bottom Navigation - Mobile only (< 768px) */}
        <BottomNavigationSimple />

        {/* Command Palette - Desktop feature (lazy loaded) */}
        <CommandPalette />
      </DashboardContextProvider>
    </NavigationProvider>
  );
}
