/**
 * Command Input Component - Tradelia 2026
 * 
 * Input field per la command palette con search icon e clear button
 * Segue i principi Tradelia 2026: funzionalità chiara, design neutrale
 */

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { cn } from '@/shared/ui/utils';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
}

export interface CommandInputRef {
  focus: () => void;
  blur: () => void;
  select: () => void;
}

export const CommandInput = forwardRef<CommandInputRef, CommandInputProps>(
  ({ value, onChange, onKeyDown, placeholder = "Cerca comandi...", className }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      select: () => inputRef.current?.select()
    }));

    const handleClear = () => {
      onChange('');
      inputRef.current?.focus();
    };

    return (
      <div className={cn(
        'relative flex items-center',
        className
      )}>
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={cn(
            // Base styles seguendo Tradelia 2026
            'w-full h-12 pl-10 pr-10 text-sm',
            'bg-background border-0 border-b-2 border-border/50',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-primary/60',
            'transition-colors duration-150'
          )}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1 rounded text-muted-foreground hover:text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/60',
              'transition-colors duration-150'
            )}
            aria-label="Cancella ricerca"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

CommandInput.displayName = 'CommandInput';