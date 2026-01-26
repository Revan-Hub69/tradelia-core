'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, Check } from 'lucide-react';
import { useState } from 'react';

import type { SortOption } from '@/types/challenge';

type ChallengeSortDropdownProps = {
  value: SortOption;
  onChange: (option: SortOption) => void;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'lowest_cost', label: 'Lowest Cost' },
  { value: 'highest_split', label: 'Highest Split' },
  { value: 'fastest_payout', label: 'Fastest Payout' },
  { value: 'largest_account', label: 'Largest Account' },
];

export function ChallengeSortDropdown({
  value,
  onChange,
}: ChallengeSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    SORT_OPTIONS.find((opt) => {
      return opt.value === value;
    })?.label || 'Sort by';

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        type="button"
      >
        <ArrowUpDown className="size-4" />
        {currentLabel}
      </motion.button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close dropdown"
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
          >
            {SORT_OPTIONS.map((option) => {
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted ${
                    value === option.value ? 'bg-muted' : ''
                  }`}
                  type="button"
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="size-4 text-primary" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
