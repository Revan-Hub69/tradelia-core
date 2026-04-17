'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/utils/Helpers';

import {
  FOREX_PAIRS,
  PAIR_CATEGORIES,
  type PairCategory,
} from '../data/forex-pairs';
import { CurrencyFlag } from './CurrencyFlag';

type PairSelectorProps = {
  value: string | null;
  onSelect: (symbol: string) => void;
  className?: string;
};

export function PairSelector({ value, onSelect, className }: PairSelectorProps) {
  const [category, setCategory] = useState<PairCategory>('major');

  const pairs = useMemo(
    () => FOREX_PAIRS.filter(p => p.category === category),
    [category],
  );

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Categoria coppie forex"
        className="relative grid grid-cols-3 gap-1 rounded-xl border border-border/60 bg-card/60 p-1 backdrop-blur-sm"
      >
        {PAIR_CATEGORIES.map((cat) => {
          const active = cat.id === category;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(cat.id)}
              className={cn(
                'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                active
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {active && (
                <motion.span
                  layoutId="pair-tab-bg"
                  className="absolute inset-0 rounded-lg bg-primary shadow-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category description */}
      <p className="text-xs text-muted-foreground">
        {PAIR_CATEGORIES.find(c => c.id === category)?.desc}
      </p>

      {/* Pairs grid */}
      <div
        role="radiogroup"
        aria-label="Seleziona coppia forex"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {pairs.map((pair, idx) => {
            const selected = value === pair.symbol;
            return (
              <motion.button
                key={pair.symbol}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelect(pair.symbol)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.02, duration: 0.2 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  selected
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border/60 bg-card/60 hover:border-primary/40 hover:bg-popover',
                )}
              >
                {/* Flags */}
                <div className="flex items-center -space-x-1">
                  <CurrencyFlag code={pair.base} size="md" />
                  <CurrencyFlag code={pair.quote} size="md" />
                </div>

                {/* Symbol + name */}
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-semibold tracking-tight text-foreground">
                    {pair.symbol}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {pair.name}
                  </p>
                </div>

                {/* Check */}
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/60 bg-transparent',
                  )}
                  aria-hidden="true"
                >
                  {selected && <Check className="size-3" strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
