'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

import { FOREX_PAIRS } from '../data/forex-pairs';
import { CurrencyFlag } from './CurrencyFlag';

type PairCommandSelectorProps = {
  value: string;
  onSelectAction: (symbol: string) => void;
  placeholder?: string;
  /** Optional callback to scroll element into view when opened */
  onOpenScrollAction?: (element: HTMLElement) => void;
};

export function PairCommandSelector({
  value,
  onSelectAction,
  placeholder = 'Seleziona coppia...',
  onOpenScrollAction,
}: PairCommandSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  const currentPair = FOREX_PAIRS.find(p => p.symbol === value);

  // Filter pairs based on query
  const filteredPairs = FOREX_PAIRS.filter(pair => {
    const q = query.toLowerCase();
    return (
      (pair.symbol.toLowerCase().includes(q) ||
        pair.base.toLowerCase().includes(q) ||
        pair.quote.toLowerCase().includes(q) ||
        pair.name.toLowerCase().includes(q))
    );
  });

  // Reset highlight when query changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  // Focus input and scroll into view when opened
  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const timer = setTimeout((): void => {
      inputRef.current?.focus();
      if (containerRef.current) {
        onOpenScrollAction?.(containerRef.current);
      }
      return undefined;
    }, 50);
    return () => clearTimeout(timer);
  }, [open, onOpenScrollAction]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (!open) return undefined;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % filteredPairs.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => (i - 1 + filteredPairs.length) % filteredPairs.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredPairs[highlightedIndex]) {
          handleSelect(filteredPairs[highlightedIndex].symbol);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const handleSelect = (symbol: string) => {
    onSelectAction(symbol);
    setOpen(false);
    setQuery('');
  };

  const handleTriggerClick = () => {
    setOpen(true);
  };


  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger - shows current selection */}
      <button
        type="button"
        id={triggerId}
        onClick={handleTriggerClick}
        className={cn(
          'group flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-all',
          open
            ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
            : 'border-border bg-background hover:border-primary/40 hover:bg-muted/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2.5">
          {currentPair ? (
            <>
              <span className="flex items-center -space-x-1">
                <CurrencyFlag code={currentPair.base} size="md" />
                <CurrencyFlag code={currentPair.quote} size="md" />
              </span>
              <div className="flex flex-col items-start">
                <span className="font-mono text-sm font-semibold tracking-tight">
                  {currentPair.symbol}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {currentPair.name}
                </span>
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <Search className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.2, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
            style={{ maxHeight: 'min(60vh, 320px)' }}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {/* Results list - flat, no search */}
            <div
              ref={listRef}
              className="overflow-y-auto p-1"
              style={{ maxHeight: 'calc(min(60vh, 320px) - 28px)' }}
            >
              <div role="listbox" className="space-y-0.5">
                {filteredPairs.map((pair, index) => {
                  const selected = pair.symbol === value;
                  const highlighted = index === highlightedIndex;

                  return (
                    <button
                      key={pair.symbol}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleSelect(pair.symbol)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        highlighted && 'bg-accent',
                        selected && !highlighted && 'bg-primary/5',
                        !highlighted && !selected && 'hover:bg-muted'
                      )}
                    >
                      <span className="flex items-center -space-x-1 shrink-0">
                        <CurrencyFlag code={pair.base} size="sm" />
                        <CurrencyFlag code={pair.quote} size="sm" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="font-mono text-sm font-semibold">
                          {pair.symbol}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {pair.name}
                        </span>
                      </div>
                      {selected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer hint */}
            <div className="sticky bottom-0 border-t border-border bg-muted/50 px-3 py-1.5 text-[10px] text-muted-foreground">
              ↑↓ per navigare · Enter per selezionare · Esc per chiudere
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
