/**
 * Sidebar Widget Types - Tradelia 2026
 */

import type { NavigationItem } from '../../entities/navigation/types';

export interface SidebarWidgetProps {
  className?: string;
  expanded?: boolean;
  onToggle?: () => void;
  navigationItems?: NavigationItem[];
}

export interface SidebarConfig {
  expandedWidth: number;
  compactWidth: number;
  animationDuration: number;
  showLabels: boolean;
}