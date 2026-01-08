/**
 * Widgets Layer - Tradelia 2026
 * 
 * Componenti compositi che combinano features e entities per creare
 * interfacce utente complete. Rappresentano sezioni complete dell'UI.
 */

// Dashboard shell - Main layout wrapper
// export { DashboardShell } from './dashboard-shell/DashboardShell';

// Dashboard grid - Main dashboard layout
// export { DashboardGrid } from './dashboard-grid/DashboardGrid';

// Header widget - Top navigation and controls
// export { HeaderWidget } from './header/HeaderWidget';

// Sidebar widget - Navigation sidebar
export * from './sidebar';

// Card widgets - Advanced card system
export * from './cards';

// Type exports (avoiding conflicts with features)
export type { DashboardShellProps, DashboardLayoutConfig } from './dashboard-shell/types';
export type { DashboardGridProps, GridLayoutConfig } from './dashboard-grid/types';
export type { HeaderWidgetProps, HeaderConfig } from './header/types';
export type { CardGridWidgetProps, CardGridConfig } from './card-grid/types';