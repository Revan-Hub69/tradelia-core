/**
 * Features Layer - Tradelia 2026
 * 
 * Feature specifiche che implementano la logica di business.
 * Possono dipendere da entities e shared, ma non da widgets o processes.
 */

// Sidebar state management
export * from './sidebar-state';

// Locale switching
export { LocaleSwitcher } from './locale-switcher/components/LocaleSwitcher';

// Widget reordering
export * from './widget-reorder';

// Command palette
// export { CommandPalette } from './command-palette/components/CommandPalette';

// Placeholder exports (to be implemented)
export type { LocaleConfig } from './locale-switcher/types';