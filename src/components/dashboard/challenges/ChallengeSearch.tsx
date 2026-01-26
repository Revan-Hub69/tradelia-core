'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ChallengeSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function ChallengeSearch({
  value,
  onChange,
  placeholder = 'Search challenges...',
}: ChallengeSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
          type="button"
          aria-label="Clear search"
        >
          <X className="size-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
