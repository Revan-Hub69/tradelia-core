/**
 * Features Layer - Tradelia 2026
 * 
 * Feature specifiche che implementano la logica di business.
 * Possono dipendere da entities e shared, ma non da widgets o processes.
 */

// Sidebar state management
// export { useSidebarStore } from './sidebar-state/store/sidebar-store';

// Locale switching
export { LocaleSwitcher } from './locale-switcher/components/LocaleSwitcher';

// Widget reordering
// export { useRobustDragDrop } from './widget-reorder/hooks/useRobustDragDrop';

// Command palette
// export { CommandPalette } from './command-palette/components/CommandPalette';

// Placeholder exports (to be implemented)
export type { SidebarState } from './sidebar-state/types';
export type { LocaleConfig } from './locale-switcher/types';
export type { DragDropConfig } from './widget-reorder/types';