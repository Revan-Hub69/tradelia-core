/**
 * CommandPalette - Tradelia 2026
 * 
 * Enterprise command palette with fuzzy search, keyboard navigation,
 * and sections for Recent / Navigation / Actions.
 * 
 * @see Requirements: 16.2, 16.3, 16.4
 */

'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useTranslations } from 'next-intl';
import { useCommandPalette, type Command } from './CommandProvider';
import { useDismissableLayer } from '@/src/shared/hooks/useDismissableLayer';
import { cn } from './utils';
import { SearchIcon } from '@/components/icons/TradeliaIcons';

/**
 * Fuzzy search implementation for commands
 */
function fuzzySearch(query: string, commands: Command[]): Command[] {
  if (!query.trim()) return commands;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return commands
    .filter(cmd => !cmd.hidden && !cmd.disabled)
    .map(cmd => {
      const searchText = [
        cmd.label,
        cmd.description || '',
        ...cmd.keywords,
        cmd.shortcut || ''
      ].join(' ').toLowerCase();
      
      // Exact match gets highest score
      if (searchText.includes(normalizedQuery)) {
        return { cmd, score: 100 };
      }
      
      // Fuzzy matching
      let score = 0;
      let queryIndex = 0;
      
      for (let i = 0; i < searchText.length && queryIndex < normalizedQuery.length; i++) {
        if (searchText[i] === normalizedQuery[queryIndex]) {
          score += 1;
          queryIndex++;
        }
      }
      
      return { cmd, score: queryIndex === normalizedQuery.length ? score : 0 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ cmd }) => cmd);
}

/**
 * Highlight matching text in search results
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(normalizedQuery);
  
  if (index === -1) return text;
  
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-primary/20 text-foreground rounded px-0.5">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

/**
 * Group commands by category
 */
function groupCommands(commands: Command[]): Map<string, Command[]> {
  const groups = new Map<string, Command[]>();
  
  for (const cmd of commands) {
    if (cmd.hidden) continue;
    const category = cmd.category;
    const existing = groups.get(category) || [];
    groups.set(category, [...existing, cmd]);
  }
  
  return groups;
}

/**
 * Category labels for display
 */
const CATEGORY_LABELS: Record<string, { en: string; it: string }> = {
  navigation: { en: 'Navigation', it: 'Navigazione' },
  actions: { en: 'Actions', it: 'Azioni' },
  settings: { en: 'Settings', it: 'Impostazioni' },
  help: { en: 'Help', it: 'Aiuto' },
  recent: { en: 'Recent', it: 'Recenti' }
};

export function CommandPalette() {
  const t = useTranslations('dashboard.commandPalette');
  const {
    commands,
    recentCommands,
    isOpen,
    query,
    setQuery,
    executeCommand,
    close
  } = useCommandPalette();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const layerRef = useDismissableLayer<HTMLDivElement>(isOpen, close);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Show recent commands first, then all commands
      const recentIds = new Set(recentCommands.map(c => c.id));
      const nonRecent = commands.filter(c => !recentIds.has(c.id) && !c.hidden && !c.disabled);
      return [...recentCommands, ...nonRecent];
    }
    return fuzzySearch(query, commands);
  }, [query, commands, recentCommands]);

  // Group filtered commands by category
  const groupedCommands = useMemo(() => {
    if (!query.trim() && recentCommands.length > 0) {
      // Show recent as separate section
      const groups = new Map<string, Command[]>();
      groups.set('recent', recentCommands);
      
      const recentIds = new Set(recentCommands.map(c => c.id));
      const nonRecent = commands.filter(c => !recentIds.has(c.id) && !c.hidden && !c.disabled);
      const otherGroups = groupCommands(nonRecent);
      
      for (const [category, cmds] of otherGroups) {
        groups.set(category, cmds);
      }
      
      return groups;
    }
    return groupCommands(filteredCommands);
  }, [query, filteredCommands, recentCommands, commands]);

  // Flat list for keyboard navigation
  const flatCommands = useMemo(() => {
    const result: Command[] = [];
    for (const cmds of groupedCommands.values()) {
      result.push(...cmds);
    }
    return result;
  }, [groupedCommands]);

  // Reset selection when commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedItem = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, flatCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(flatCommands.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        const selectedCommand = flatCommands[selectedIndex];
        if (selectedCommand) {
          executeCommand(selectedCommand.id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
    }
  }, [flatCommands, selectedIndex, executeCommand, close]);

  if (!isOpen) return null;

  // Get current locale for category labels
  const locale = (typeof document !== 'undefined' && document.documentElement.lang) || 'it';

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
        ref={layerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('placeholder')}
        className={cn(
          'absolute left-1/2 top-[20%] -translate-x-1/2',
          'w-full max-w-lg mx-4',
          'bg-background border-2 border-border rounded-xl shadow-2xl',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          'overflow-hidden'
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50">
          <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            className={cn(
              'flex-1 bg-transparent text-base text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none'
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={t('placeholder')}
            aria-controls="command-list"
            aria-activedescendant={flatCommands[selectedIndex]?.id}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div
          id="command-list"
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto"
        >
          {flatCommands.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {query ? t('noResults') : t('noCommands')}
              </p>
            </div>
          ) : (
            Array.from(groupedCommands.entries()).map(([category, cmds]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="px-4 py-2 border-b border-border/30 bg-muted/30">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {CATEGORY_LABELS[category]?.[locale as 'en' | 'it'] || category}
                  </p>
                </div>
                
                {/* Commands in Category */}
                {cmds.map((cmd) => {
                  const globalIndex = flatCommands.indexOf(cmd);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={cmd.id}
                      id={cmd.id}
                      role="option"
                      aria-selected={isSelected}
                      data-index={globalIndex}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left',
                        'transition-colors duration-100',
                        'hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                        isSelected && 'bg-primary/10'
                      )}
                      onClick={() => executeCommand(cmd.id)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      {/* Icon */}
                      {cmd.icon && (
                        <cmd.icon className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      )}
                      
                      {/* Label & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {highlightMatch(cmd.label, query)}
                        </div>
                        {cmd.description && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {highlightMatch(cmd.description, query)}
                          </div>
                        )}
                      </div>
                      
                      {/* Shortcut */}
                      {cmd.shortcut && (
                        <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground font-mono">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 bg-muted/20 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↑↓</kbd>
              {t('shortcuts.navigate')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
              {t('shortcuts.select')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">esc</kbd>
              {t('shortcuts.close')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
