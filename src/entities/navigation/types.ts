/**
 * Navigation Entity Types - Tradelia 2026
 */

import type React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  progress?: number; // 0-100 for progress indicators
  children?: NavigationItem[];
  keywords?: string[]; // for search functionality
  badge?: string; // optional badge text
  isDisabled?: boolean;
}

export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}

export interface NavigationConfig {
  groups: NavigationGroup[];
  searchable: boolean;
  collapsible: boolean;
}