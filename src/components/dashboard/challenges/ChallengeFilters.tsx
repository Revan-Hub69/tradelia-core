'use client';

import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

type FilterState = {
  cost: string[];
  accountSize: string[];
  profitSplit: string[];
  payoutSpeed: string[];
  type: string[];
  market: string[];
};

type ChallengeFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  resultCount: number;
};

const FILTER_OPTIONS = {
  cost: [
    { value: 'free', label: 'Free' },
    { value: '<50', label: 'Under $50' },
    { value: '50-200', label: '$50-$200' },
    { value: '200-500', label: '$200-$500' },
    { value: '500+', label: '$500+' },
  ],
  accountSize: [
    { value: '<10k', label: 'Under $10K' },
    { value: '10k-50k', label: '$10K-$50K' },
    { value: '50k-100k', label: '$50K-$100K' },
    { value: '100k+', label: '$100K+' },
  ],
  profitSplit: [
    { value: '80+', label: '80%+' },
    { value: '90+', label: '90%+' },
    { value: '95+', label: '95%+' },
    { value: '100', label: '100%' },
  ],
  payoutSpeed: [
    { value: 'instant', label: 'Instant' },
    { value: 'same_day', label: 'Same Day' },
    { value: '24_48h', label: '24-48h' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi_weekly', label: 'Bi-weekly' },
  ],
  type: [
    { value: 'free', label: 'Free Competition' },
    { value: '1_step', label: '1-Step' },
    { value: '2_step', label: '2-Step' },
    { value: 'instant', label: 'Instant Funding' },
  ],
  market: [
    { value: 'forex', label: 'Forex' },
    { value: 'futures', label: 'Futures' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'stocks', label: 'Stocks' },
  ],
};

export function ChallengeFilters({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
}: ChallengeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          type="button"
        >
          <Filter className="size-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {Object.values(filters).flat().length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterContent
          filters={filters}
          toggleFilter={toggleFilter}
          onClearFilters={onClearFilters}
          resultCount={resultCount}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              return setIsOpen(false);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => {
                  return setIsOpen(false);
                }}
                className="rounded-lg p-2 hover:bg-muted"
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>
            <FilterContent
              filters={filters}
              toggleFilter={toggleFilter}
              onClearFilters={onClearFilters}
              resultCount={resultCount}
              hasActiveFilters={hasActiveFilters}
            />
          </motion.div>
        </div>
      )}
    </>
  );
}

type FilterContentProps = {
  filters: FilterState;
  toggleFilter: (category: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
};

function FilterContent({
  filters,
  toggleFilter,
  onClearFilters,
  resultCount,
  hasActiveFilters,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
            type="button"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Result Count */}
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <div className="text-2xl font-bold text-foreground">{resultCount}</div>
        <div className="text-xs text-muted-foreground">challenges found</div>
      </div>

      {/* Filter Sections */}
      {Object.entries(FILTER_OPTIONS).map(([category, options]) => {
        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium capitalize text-foreground">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="space-y-2">
              {options.map((option) => {
                const isActive = filters[category as keyof FilterState].includes(
                  option.value,
                );
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => {
                        return toggleFilter(
                          category as keyof FilterState,
                          option.value,
                        );
                      }}
                      className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                    <span className="text-sm text-foreground">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
