'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

import { FOREX_PAIRS, type ForexPair } from '../data/forex-pairs';
import { PairSelector } from './PairSelector';

type PairChipProps = {
  value: string;
  onSelect: (symbol: string) => void;
  label?: string;
};

export function PairChip({ value, onSelect, label = 'Simula su' }: PairChipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const pair: ForexPair | undefined = FOREX_PAIRS.find(p => p.symbol === value);

  // Close on escape
  useEffect(() => {
    if (!open) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 transition-all',
          'border-border/60 bg-popover/60 backdrop-blur-sm',
          'hover:border-primary/40 hover:bg-popover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {pair && (
          <>
            <span className="flex items-center text-base leading-none -space-x-0.5">
              <span>{pair.baseFlag}</span>
              <span>{pair.quoteFlag}</span>
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              {pair.symbol}
            </span>
          </>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-data-[open=true]:rotate-180" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[200] bg-background/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Seleziona coppia forex"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={cn(
                'fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2',
                'rounded-2xl border border-border bg-card p-5 shadow-2xl',
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Scegli coppia
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    18 coppie disponibili in 3 categorie
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Chiudi"
                >
                  <X className="size-4" />
                </button>
              </div>

              <PairSelector value={value} onSelect={handleSelect} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
