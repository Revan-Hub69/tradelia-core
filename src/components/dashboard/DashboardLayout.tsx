'use client';

import React from 'react';

import { useDashboardSwipeNavigation } from '@/hooks/useSwipeNavigation';

import { MobileNavigation } from './MobileNavigation';
import type { DashboardState } from './types';

type DashboardLayoutProps = {
  children: React.ReactNode;
  dashboardState: DashboardState;
  activeSection?: 'overview' | 'paths' | 'progress' | 'settings';
  onSectionChange?: (section: 'overview' | 'paths' | 'progress' | 'settings') => void;
  className?: string;
};

/**
 * DashboardLayout - Main container for dashboard components
 *
 * Extends existing layout patterns with glassmorphism design system:
 * - Maintains same spacing system (--space-xs to --space-2xl)
 * - Uses existing z-index hierarchy
 * - Follows mobile-first responsive approach
 * - Integrates with existing navigation system
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  dashboardState,
  activeSection = 'overview',
  onSectionChange = () => {},
  className = '',
}) => {
  const { ui } = dashboardState;

  // Swipe navigation for mobile
  const swipeRef = useDashboardSwipeNavigation(activeSection, onSectionChange);

  return (
    <div className={`min-h-screen bg-background ${className}`} ref={swipeRef as React.RefObject<HTMLDivElement>}>
      {/* Main Dashboard Container */}
      <div className="mx-auto max-w-screen-xl px-3 pb-16 pt-6">
        {/* Loading State */}
        {ui.isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {ui.error && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{ui.error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!ui.isLoading && !ui.error && (
          <div className="space-y-6">
            {children}
          </div>
        )}
      </div>

      {/* Mobile Navigation - Bottom Fixed */}
      {ui.isMobile && (
        <MobileNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      )}
    </div>
  );
};
