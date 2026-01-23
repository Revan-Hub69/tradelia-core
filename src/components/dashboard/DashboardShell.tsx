/*
 * DASHBOARD SHELL - Server Component
 *
 * Server-side composition layer for dashboard layout
 * Handles structure, data fetching, and metadata
 * Delegates client interactions to DashboardClient
 */

import { SkipLinks } from '@/components/accessibility/SkipLinks';

import { DashboardClient } from './DashboardClient';

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />

      {/* 
        CSS Grid Layout - Best Practice 2026
        Research: https://akashhamirwasia.com/blog/how-to-and-not-to-build-sidebar-layouts/
        
        Grid defines layout structure:
        - Mobile: Single column (sidebar hidden, bottom nav shown)
        - Tablet/Desktop: [sidebar | main content]
        
        Benefits:
        - No manual margin/width synchronization
        - Parent controls layout (Single Source of Truth)
        - Sidebar uses position:sticky (stays visible while scrolling)
        - Easy responsive adjustments
      */}
      <DashboardClient>{children}</DashboardClient>
    </div>
  );
}
