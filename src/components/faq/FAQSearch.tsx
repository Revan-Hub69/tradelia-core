'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

type FAQSearchProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function FAQSearch({
  onSearch,
  placeholder = 'Search FAQs...',
}: FAQSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={e => handleChange(e.target.value)}
        className="px-10"
        aria-label="Search frequently asked questions"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
