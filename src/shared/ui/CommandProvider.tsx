/**
 * CommandProvider - Tradelia 2026
 * 
 * Context provider for command palette functionality.
 * Manages commands, recent commands, and command execution.
 * 
 * @see Requirements: 16.1
 */

'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode
} from 'react';

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: 'navigation' | 'actions' | 'settings' | 'help';
  keywords: string[];
  shortcut?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void | Promise<void>;
  disabled?: boolean;
  hidden?: boolean;
}

interface CommandContextValue {
  /** All registered commands */
  commands: Command[];
  /** Recently executed commands (max 5) */
  recentCommands: Command[];
  /** Whether the command palette is open */
  isOpen: boolean;
  /** Current search query */
  query: string;
  /** Register a new command */
  registerCommand: (command: Command) => void;
  /** Unregister a command by ID */
  unregisterCommand: (id: string) => void;
  /** Execute a command by ID */
  executeCommand: (id: string) => void;
  /** Open the command palette */
  open: () => void;
  /** Close the command palette */
  close: () => void;
  /** Toggle the command palette */
  toggle: () => void;
  /** Set the search query */
  setQuery: (query: string) => void;
  /** Clear recent commands */
  clearRecent: () => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

const RECENT_COMMANDS_KEY = 'tradelia_recent_commands_v1';
const MAX_RECENT_COMMANDS = 5;

interface CommandProviderProps {
  children: ReactNode;
  /** Initial commands to register */
  initialCommands?: Command[];
}

export function CommandProvider({ children, initialCommands = [] }: CommandProviderProps) {
  const [commands, setCommands] = useState<Command[]>(initialCommands);
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Load recent commands from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_COMMANDS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentCommandIds(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save recent commands to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(recentCommandIds));
    } catch {
      // Ignore localStorage errors
    }
  }, [recentCommandIds]);

  // Compute recent commands from IDs
  const recentCommands = useMemo(() => {
    return recentCommandIds
      .map(id => commands.find(cmd => cmd.id === id))
      .filter((cmd): cmd is Command => cmd !== undefined && !cmd.hidden)
      .slice(0, MAX_RECENT_COMMANDS);
  }, [recentCommandIds, commands]);

  const registerCommand = useCallback((command: Command) => {
    setCommands(prev => {
      // Replace if exists, otherwise add
      const exists = prev.some(cmd => cmd.id === command.id);
      if (exists) {
        return prev.map(cmd => cmd.id === command.id ? command : cmd);
      }
      return [...prev, command];
    });
  }, []);

  const unregisterCommand = useCallback((id: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
  }, []);

  const executeCommand = useCallback((id: string) => {
    const command = commands.find(cmd => cmd.id === id);
    if (!command || command.disabled) return;

    // Execute the command
    const result = command.action();
    
    // Handle async commands
    if (result instanceof Promise) {
      result.catch(console.error);
    }

    // Add to recent commands
    setRecentCommandIds(prev => {
      const filtered = prev.filter(cmdId => cmdId !== id);
      return [id, ...filtered].slice(0, MAX_RECENT_COMMANDS);
    });

    // Close palette after execution
    setIsOpen(false);
    setQuery('');
  }, [commands]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        setQuery('');
      }
      return !prev;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentCommandIds([]);
  }, []);

  const value = useMemo<CommandContextValue>(() => ({
    commands,
    recentCommands,
    isOpen,
    query,
    registerCommand,
    unregisterCommand,
    executeCommand,
    open,
    close,
    toggle,
    setQuery,
    clearRecent,
  }), [
    commands,
    recentCommands,
    isOpen,
    query,
    registerCommand,
    unregisterCommand,
    executeCommand,
    open,
    close,
    toggle,
    clearRecent,
  ]);

  return (
    <CommandContext.Provider value={value}>
      {children}
    </CommandContext.Provider>
  );
}

/**
 * Hook to access command palette context
 */
export function useCommandPalette() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within a CommandProvider');
  }
  return context;
}

/**
 * Hook to register a command on mount and unregister on unmount
 */
export function useRegisterCommand(command: Command) {
  const { registerCommand, unregisterCommand } = useCommandPalette();

  useEffect(() => {
    registerCommand(command);
    return () => unregisterCommand(command.id);
  }, [command, registerCommand, unregisterCommand]);
}
