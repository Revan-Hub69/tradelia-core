/**
 * Dashboard Shell Types - Tradelia 2026
 */

import type { ReactNode } from 'react';

export interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export interface DashboardLayoutConfig {
  sidebarExpanded: boolean;
  headerHeight: number;
  sidebarWidth: number;
  sidebarCompactWidth: number;
}