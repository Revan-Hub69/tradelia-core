/**
 * Command Item Component - Tradelia 2026
 * 
 * Singolo item nella lista dei comandi
 * Design neutrale con focus su leggibilità e accessibilità
 */

import { forwardRef } from 'react';
import { cn } from '@/shared/ui/utils';
import { formatHotkeyDisplay } from '@/shared/hooks/useHotkey';
import type { Command } from '@/entities/command';

interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  onClick: () => void;
  query?: string;
  className?: string;
}

export const CommandItem = forwardRef<HTMLButtonElement, CommandItemProps>(
  ({ command, isSelected, onClick, query = '', className }, ref) => {
    
    const highlightText = (text: string) => {
      if (!query.trim()) return text;
      
      const normalizedQuery = query.toLowerCase();
      const normalizedText = text.toLowerCase();
      const index = normalizedText.indexOf(normalizedQuery);
      
      if (index === -1) return text;
      
      return (
        <>
          {text.slice(0, index)}
          <mark className="bg-primary/20 text-foreground font-medium">
            {text.slice(index, index + query.length)}
          </mark>
          {text.slice(index + query.length)}
        </>
      );
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          // Base styles seguendo Tradelia 2026
          'w-full flex items-center gap-3 px-4 py-3 text-left',
          'rounded border border-transparent',
          'transition-all duration-150',
          // Selected state
          isSelected && [
            'bg-muted/50 border-border',
            'shadow-sm'
          ],
          // Hover state
          'hover:bg-muted/30',
          // Focus state
          'focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-1',
          // Disabled state
          command.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={command.disabled}
        role="option"
        aria-selected={isSelected}
      >
        {/* Icon */}
        {command.icon && (
          <div className="flex-shrink-0 w-4 h-4 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {/* Placeholder icon - in real implementation, use TradeliaIcons */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {highlightText(command.label)}
          </div>
          {command.description && (
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {highlightText(command.description)}
            </div>
          )}
        </div>

        {/* Shortcut */}
        {command.shortcut && (
          <div className="flex-shrink-0 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              {formatHotkeyDisplay(command.shortcut)}
            </kbd>
          </div>
        )}
      </button>
    );
  }
);

CommandItem.displayName = 'CommandItem';