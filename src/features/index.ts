/**
 * Features Layer - Tradelia 2026
 * 
 * Feature specifiche che implementano la logica di business.
 * Possono dipendere da entities e shared, ma non da widgets o processes.
 */

// Locale switching
export { LocaleSwitcher } from './locale-switcher/components/LocaleSwitcher';

// Widget reordering
export * from './widget-reorder';

// Command palette
export { CommandPalette } from './command-palette/components/CommandPalette';
export { getDefaultCommands } from './command-palette/lib/default-commands';
export { useCommandStore } from './command-palette/store/command-store';
export type { Command } from './command-palette/store/command-store';

// Placeholder exports (to be implemented)
export type { LocaleConfig } from './locale-switcher/types';