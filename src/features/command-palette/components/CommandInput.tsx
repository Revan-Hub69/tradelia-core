'use client';

import { useRef, useEffect } from 'react';
import { SearchIcon } from '@/components/icons/TradeliaIcons';
import { cn } from '@/shared/ui/utils';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function CommandInput({ value, onChange, placeholder }: CommandInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 border-b border-border/50">
      <SearchIcon className="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none'
        )}
        autoComplete="off"
        spellCheck={false}
      />
      <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
        <span className="text-xs">ESC</span>
      </kbd>
    </div>
  );
}