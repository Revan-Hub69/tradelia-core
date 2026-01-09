import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  keywords: string[];
  shortcut?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandStore {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  recentCommands: Command[];
  searchHistory: string[];
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  addToRecent: (command: Command) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useCommandStore = create<CommandStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      query: '',
      selectedIndex: 0,
      recentCommands: [],
      searchHistory: [],
      
      setOpen: (open) => {
        set({ 
          isOpen: open, 
          query: open ? get().query : '',
          selectedIndex: 0
        });
      },
      
      setQuery: (query) => set({ query, selectedIndex: 0 }),
      
      setSelectedIndex: (index) => set({ selectedIndex: index }),
      
      addToRecent: (command) => {
        const recent = get().recentCommands;
        const filtered = recent.filter(c => c.id !== command.id);
        set({ recentCommands: [command, ...filtered].slice(0, 5) });
      },
      
      addToHistory: (query) => {
        if (query.trim()) {
          const history = get().searchHistory;
          const filtered = history.filter(h => h !== query);
          set({ searchHistory: [query, ...filtered].slice(0, 10) });
        }
      },
      
      clearHistory: () => set({ searchHistory: [], recentCommands: [] })
    }),
    {
      name: 'tradelia-command-palette',
      partialize: (state) => ({
        recentCommands: state.recentCommands,
        searchHistory: state.searchHistory
      })
    }
  )
);