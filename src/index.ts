/**
 * Tradelia 2026 - Main Barrel Export
 * 
 * Esportazioni principali dell'architettura modulare seguendo i principi
 * di layer separation e import boundaries.
 */

// Shared layer - Utilities, configurations, and UI primitives
export * from './shared';

// Entities layer - Business domain entities
export * from './entities';

// Features layer - Feature-specific logic
export { 
  useSidebarStore, 
  useSidebarState, 
  useIsSidebarExpanded,
  useIsSidebarCompact,
  useIsSidebarHidden,
  useRobustDragDrop,
  LocaleSwitcher 
} from './features';

// Widgets layer - Composite UI components
export {
  DashboardSidebar,
  AdvancedCard,
  SummaryCard,
  DetailCard,
  ActionCard,
  WarningCard,
  EducationalCard,
  CardGrid
} from './widgets';

// Processes layer - Business process orchestration
export * from './processes';

// Server layer - Server-side logic (use with caution in client code)
// Note: Server exports should only be used in server-side code
export type * from './server';