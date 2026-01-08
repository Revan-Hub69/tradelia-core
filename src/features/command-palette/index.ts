/**
 * Command Palette Feature - Barrel Exports
 */

export { CommandPalette } from './components/CommandPalette';
export { CommandInput } from './components/CommandInput';
export { CommandItem } from './components/CommandItem';
export { CommandList } from './components/CommandList';

export { 
  useCommandStore,
  useCommandPaletteOpen,
  useCommandPaletteQuery,
  useCommandPaletteSelected,
  useCommandPaletteResults
} from './store/command-store';

export { fuzzySearch, highlightMatches } from './lib/fuzzy-search';