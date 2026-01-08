/**
 * Command List Component - Tradelia 2026
 * 
 * Lista scrollabile dei comandi con categorizzazione
 * Ottimizzata per keyboard navigation e accessibilità
 */

import { forwardRef, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/ui/utils';
import { CommandItem } from './CommandItem';
import type { Command, CommandCategory } from '@/entities/command';

interface CommandListProps {
  commands: Command[];
  selectedIndex: number;
  onSelectCommand: (command: Command) => void;
  query?: string;
  className?: string;
}

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  recent: 'recent',
  navigation: 'navigation',
  actions: 'actions',
  settings: 'settings',
  data: 'data',
  help: 'help'
};

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  ({ commands, selectedIndex, onSelectCommand, query = '', className }, ref) => {
    const t = useTranslations('dashboard.commandPalette');
    const listRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLButtonElement>(null);

    // Scroll selected item into view
    useEffect(() => {
      if (selectedItemRef.current) {
        selectedItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, [selectedIndex]);

    // Group commands by category
    const groupedCommands = commands.reduce((groups, command, index) => {
      const category = command.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({ command, originalIndex: index });
      return groups;
    }, {} as Record<CommandCategory, Array<{ command: Command; originalIndex: number }>>);

    // Render empty state
    if (commands.length === 0) {
      return (
        <div 
          ref={ref}
          className={cn(
            'flex items-center justify-center py-12 text-center',
            className
          )}
        >
          <div className="space-y-2">
            <div className="text-muted-foreground">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              {query ? t('noResults') : t('noCommands')}
            </p>
            {query && (
              <p className="text-xs text-muted-foreground">
                {t('tryDifferentTerms')}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'max-h-80 overflow-y-auto',
          'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border',
          className
        )}
        role="listbox"
        aria-label="Comandi disponibili"
      >
        <div ref={listRef} className="p-2 space-y-1">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category} className="space-y-1">
              {/* Category Header */}
              {!query && Object.keys(groupedCommands).length > 1 && (
                <div className="px-2 py-1">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t(CATEGORY_LABELS[category as CommandCategory])}
                  </h3>
                </div>
              )}
              
              {/* Command Items */}
              {items.map(({ command, originalIndex }) => (
                <CommandItem
                  key={command.id}
                  ref={originalIndex === selectedIndex ? selectedItemRef : undefined}
                  command={command}
                  isSelected={originalIndex === selectedIndex}
                  onClick={() => onSelectCommand(command)}
                  query={query}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CommandList.displayName = 'CommandList';