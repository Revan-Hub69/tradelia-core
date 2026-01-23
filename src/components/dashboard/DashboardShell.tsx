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

      {/* Client boundary - all interactive components */}
      <DashboardClient>
        {/* Main Content - passed as children to maintain server rendering */}
        <main
          id="main-content"
          className="min-h-screen px-4 py-6 pt-20 md:pl-[calc(var(--sidebar-width-current)+1rem)]"
        >
          {children}
        </main>
      </DashboardClient>
    </div>
  );
}
