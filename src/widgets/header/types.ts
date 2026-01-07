/**
 * Header Widget Types - Tradelia 2026
 */

export interface HeaderWidgetProps {
  className?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

export interface HeaderConfig {
  height: number;
  showLogo: boolean;
  showBreadcrumbs: boolean;
  showActions: boolean;
}