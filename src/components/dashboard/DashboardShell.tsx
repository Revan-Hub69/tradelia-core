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
  // Server-side data fetching can go here
  // const userData = await fetchUserData();
  // const navigationItems = await fetchNavigationItems();

  return (
    <div className="layout-stable bg-background">
      <SkipLinks />

      {/* Client boundary - all interactive components */}
      <DashboardClient>
        {/* Main Content - passed as children to maintain server rendering */}
        <main
          id="main-content"
          className="layout-main content-stable px-4 py-6"
        >
          {children}
        </main>
      </DashboardClient>
    </div>
  );
}
