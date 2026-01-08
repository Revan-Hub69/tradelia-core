/**
 * Command Palette Store - Tradelia 2026
 * 
 * Zustand store per gestire lo stato della command palette
 * Con persistenza per recent commands e search history
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Command, CommandPaletteState } from '@/entities/command';
import { fuzzySearch } from '../lib/fuzzy-search';

interface CommandStore extends CommandPaletteState {
  // Actions
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  executeSelected: () => void;
  executeCommand: (command: Command) => void;
  addToRecent: (command: Command) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  updateFilteredCommands: (allCommands: Command[]) => void;
  
  // Internal state
  allCommands: Command[];
  setAllCommands: (commands: Command[]) => void;
}

export const useCommandStore = create<CommandStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: false,
      query: '',
      selectedIndex: 0,
      recentCommands: [],
      searchHistory: [],
      filteredCommands: [],
      allCommands: [],

      // Actions
      setOpen: (open) => {
        const state = get();
        set({ 
          isOpen: open, 
          query: open ? state.query : '',
          selectedIndex: 0
        });
        
        if (open) {
          // Update filtered commands when opening
          get().updateFilteredCommands(state.allCommands);
        }
      },

      setQuery: (query) => {
        set({ query, selectedIndex: 0 });
        get().updateFilteredCommands(get().allCommands);
      },

      setSelectedIndex: (index) => {
        const { filteredCommands } = get();
        const clampedIndex = Math.max(0, Math.min(index, filteredCommands.length - 1));
        set({ selectedIndex: clampedIndex });
      },

      selectNext: () => {
        const { selectedIndex, filteredCommands } = get();
        const nextIndex = selectedIndex < filteredCommands.length - 1 ? selectedIndex + 1 : 0;
        set({ selectedIndex: nextIndex });
      },

      selectPrevious: () => {
        const { selectedIndex, filteredCommands } = get();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredCommands.length - 1;
        set({ selectedIndex: prevIndex });
      },

      executeSelected: () => {
        const { filteredCommands, selectedIndex } = get();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          get().executeCommand(selectedCommand);
        }
      },

      executeCommand: (command) => {
        const { query } = get();
        
        // Add to recent commands
        get().addToRecent(command);
        
        // Add query to history if it exists
        if (query.trim()) {
          get().addToHistory(query);
        }
        
        // Close palette
        set({ isOpen: false, query: '', selectedIndex: 0 });
        
        // Execute command
        try {
          const result = command.action();
          if (result instanceof Promise) {
            result.catch(console.error);
          }
        } catch (error) {
          console.error('Command execution failed:', error);
        }
      },

      addToRecent: (command) => {
        const { recentCommands } = get();
        const filtered = recentCommands.filter(c => c.id !== command.id);
        const updated = [command, ...filtered].slice(0, 5); // Keep only 5 recent
        set({ recentCommands: updated });
      },

      addToHistory: (query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;
        
        const { searchHistory } = get();
        const filtered = searchHistory.filter(h => h !== trimmedQuery);
        const updated = [trimmedQuery, ...filtered].slice(0, 10); // Keep only 10 history items
        set({ searchHistory: updated });
      },

      clearHistory: () => {
        set({ searchHistory: [], recentCommands: [] });
      },

      updateFilteredCommands: (allCommands) => {
        const { query, recentCommands } = get();
        
        if (!query.trim()) {
          // Show recent commands when no query
          const recentIds = new Set(recentCommands.map(c => c.id));
          const otherCommands = allCommands.filter(c => !recentIds.has(c.id) && !c.hidden);
          set({ 
            filteredCommands: [
              ...recentCommands.filter(c => !c.hidden),
              ...otherCommands.slice(0, 8) // Show top 8 other commands
            ]
          });
        } else {
          // Fuzzy search
          const searchResults = fuzzySearch(query, allCommands);
          set({ 
            filteredCommands: searchResults
              .slice(0, 10) // Limit to 10 results
              .map(result => result.command)
          });
        }
      },

      setAllCommands: (commands) => {
        set({ allCommands: commands });
        get().updateFilteredCommands(commands);
      }
    }),
    {
      name: 'tradelia-command-palette',
      // Only persist user data, not UI state
      partialize: (state) => ({
        recentCommands: state.recentCommands,
        searchHistory: state.searchHistory
      })
    }
  )
);

// Selectors for better performance
export const useCommandPaletteOpen = () => useCommandStore(state => state.isOpen);
export const useCommandPaletteQuery = () => useCommandStore(state => state.query);
export const useCommandPaletteSelected = () => useCommandStore(state => ({
  selectedIndex: state.selectedIndex,
  selectedCommand: state.filteredCommands[state.selectedIndex]
}));
export const useCommandPaletteResults = () => useCommandStore(state => ({
  filteredCommands: state.filteredCommands,
  hasResults: state.filteredCommands.length > 0
}));