'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

import { FOREX_PAIRS, type ForexPair } from '../data/forex-pairs';
import { CurrencyFlag } from './CurrencyFlag';
import { PairSelector } from './PairSelector';

type PairChipProps = {
  value: string;
  onSelectAction: (symbol: string) => void;
  label?: string;
};

/**
 * PairChip: clickable chip that reveals an inline collapsible PairSelector.
 * No modal, no portal — just an expanding section that slides down under
 * the chip. This avoids all positioning issues and is the standard pattern
 * for contextual selectors inside drawers/sheets.
 */
export function PairChip({ value, onSelectAction }: PairChipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const pair: ForexPair | undefined = FOREX_PAIRS.find(p => p.symbol === value);

  const handleSelect = (symbol: string) => {
    onSelectAction(symbol);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Scroll into view when opened
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [open]);

  return (
    <div className="w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'group inline-flex items-center gap-2 rounded-full border px-3 py-1 transition-all',
          open
            ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
            : 'border-border/60 bg-popover/60 hover:border-primary/40 hover:bg-popover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
        aria-expanded={open}
      >
        {pair && (
          <>
            <span className="flex items-center -space-x-1">
              <CurrencyFlag code={pair.base} size="sm" />
              <CurrencyFlag code={pair.quote} size="sm" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
              {pair.symbol}
            </span>
          </>
        )}
        <ChevronDown
          className={cn(
            'size-3.5 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180 text-primary',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="mt-3 max-h-[50vh] overflow-y-auto">
              <PairSelector value={value} onSelectAction={handleSelect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
