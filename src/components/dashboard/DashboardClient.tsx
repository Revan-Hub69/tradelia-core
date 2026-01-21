/*
 * DASHBOARD CLIENT - Client Component Boundary
 *
 * Client-side interactive layer for dashboard
 * Handles all user interactions, state, and effects
 * Wraps navigation components and interactive features
 */

'use client';

import { CommandPalette } from '@/components/navigation/CommandPalette';
import { NavigationProvider } from '@/components/navigation/NavigationProvider';
import { PWABottomNavigationSimple } from '@/components/navigation/PWABottomNavigationSimple';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
import { DashboardContextProvider } from '@/contexts/DashboardContext';

import { DashboardHeader } from './DashboardHeader';

type DashboardClientProps = {
  children: React.ReactNode;
};

export function DashboardClient({ children }: DashboardClientProps) {
  return (
    <NavigationProvider>
      <DashboardContextProvider>
        {/* Sidebar Navigation - Tablet and Desktop (768px+) */}
        <SidebarNavigation className="layout-sidebar" />

        {/* Header - Always visible */}
        <DashboardHeader
          showScrollShadow
          className="layout-header"
        />

        {/* Main Content - Server Component passed as children */}
        {children}

        {/* Bottom Navigation - Mobile only (< 768px) */}
        <PWABottomNavigationSimple className="layout-nav" />

        {/* Command Palette - Desktop feature */}
        <CommandPalette />
      </DashboardContextProvider>
    </NavigationProvider>
  );
}
