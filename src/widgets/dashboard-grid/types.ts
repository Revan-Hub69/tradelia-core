/**
 * Dashboard Grid Types - Tradelia 2026
 */

import type { ReactNode } from 'react';

export interface DashboardGridProps {
  children?: ReactNode;
  className?: string;
  columns?: number;
  gap?: number;
}

export interface GridLayoutConfig {
  columns: number;
  rows: number;
  gap: number;
  minCardWidth: number;
  maxCardWidth: number;
}