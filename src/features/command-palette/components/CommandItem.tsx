'use client';

import { Command } from '../store/command-store';
import { highlightMatch } from '../lib/fuzzy-search';
import { cn } from '@/shared/ui/utils';

interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  query: string;
  onSelect: () => void;
}

/**
 * CommandItem - Density-aware command palette item
 * Responds to compact/comfortable mode (REQ 20.2)
 * Maintains min 24px target size for WCAG 2.5.8 compliance
 */
export function CommandItem({ command, isSelected, query, onSelect }: CommandItemProps) {
  return (
    <button
      className={cn(
        // Density-aware list item with min 24px target size
        'w-full flex items-center density-gap density-list-item text-left transition-colors duration-150',
        'hover:bg-muted/30 focus:bg-muted/30 focus:outline-none',
        isSelected && 'bg-muted/50'
      )}
      onClick={onSelect}
      onMouseEnter={() => {
        // Could update selected index on hover if needed
      }}
    >
      {command.icon && (
        <command.icon className="density-icon text-muted-foreground shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="density-text-secondary font-medium text-foreground">
          {highlightMatch(command.label, query)}
        </div>
        {command.description && (
          <div className="density-text-tertiary text-muted-foreground mt-0.5 truncate">
            {highlightMatch(command.description, query)}
          </div>
        )}
      </div>
      
      {command.shortcut && (
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-1 density-text-tertiary text-muted-foreground min-h-[24px]">
          {command.shortcut.split('+').map((key, index) => (
            <span key={index} className="density-text-tertiary">
              {key}
            </span>
          ))}
        </kbd>
      )}
    </button>
  );
}