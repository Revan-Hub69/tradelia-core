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

export function CommandItem({ command, isSelected, query, onSelect }: CommandItemProps) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150',
        'hover:bg-muted/30 focus:bg-muted/30 focus:outline-none',
        isSelected && 'bg-muted/50'
      )}
      onClick={onSelect}
      onMouseEnter={() => {
        // Could update selected index on hover if needed
      }}
    >
      {command.icon && (
        <command.icon className="w-4 h-4 text-muted-foreground shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">
          {highlightMatch(command.label, query)}
        </div>
        {command.description && (
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {highlightMatch(command.description, query)}
          </div>
        )}
      </div>
      
      {command.shortcut && (
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
          {command.shortcut.split('+').map((key, index) => (
            <span key={index} className="text-xs">
              {key}
            </span>
          ))}
        </kbd>
      )}
    </button>
  );
}