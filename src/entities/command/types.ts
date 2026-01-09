/**
 * Command Entity Types - Tradelia 2026
 * 
 * Definizioni di tipi per il sistema di command palette
 */

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: CommandCategory;
  keywords: string[];
  shortcut?: string;
  icon?: string; // Icon name from TradeliaIcons
  action: () => void | Promise<void>;
  disabled?: boolean;
  hidden?: boolean;
}

export type CommandCategory = 
  | 'navigation'
  | 'actions' 
  | 'settings'
  | 'data'
  | 'help'
  | 'recent';

export interface CommandGroup {
  category: CommandCategory;
  label: string;
  commands: Command[];
}

export interface CommandSearchResult {
  command: Command;
  score: number;
  matchedKeywords: string[];
}

export interface CommandHistory {
  commandId: string;
  executedAt: Date;
  query?: string;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  recentCommands: Command[];
  searchHistory: string[];
  filteredCommands: Command[];
}