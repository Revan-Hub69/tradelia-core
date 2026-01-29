'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '@/components/dashboard/challenges/EmptyState';
import { ProgramCard } from '@/components/dashboard/challenges/ProgramCard';
import { ProgramDrawer } from '@/components/dashboard/challenges/ProgramDrawer';
import type { ProgramData } from '@/types/program';
import { cn } from '@/utils/Helpers';

type CategoryFilter = 'all' | 'free' | 'challenges' | 'tournaments';
type SortOption = 'popularity' | 'account_size_asc' | 'account_size_desc' | 'profit_split_desc' | 'cost_asc' | 'freshness';

type FilterState = {
  cost: string[];
  accountSize: string[];
  profitSplit: string[];
  type: string[];
  market: string[];
  platform: string[];
};

export default function ChallengesPage() {
  const t = useTranslations('Challenges') as any;
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);

  // Category filter (3 main categories)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  // Advanced filters
  const [filters, setFilters] = useState<FilterState>({
    cost: [],
    accountSize: [],
    profitSplit: [],
    type: [],
    market: [],
    platform: [],
  });

  // Sort
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/programs');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch programs');
        }

        if (data.success) {
          setPrograms(data.data || []);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Category filtering
  const categoryFilteredPrograms = useMemo(() => {
    if (categoryFilter === 'all') {
      return programs;
    }

    return programs.filter((program) => {
      if (categoryFilter === 'free') {
        return program.program.category === 'free_competition';
      }
      if (categoryFilter === 'challenges') {
        return program.program.category === 'paid_evaluation';
      }
      if (categoryFilter === 'tournaments') {
        // Tournament logic - can be based on ruleset_mode or other criteria
        return program.program.ruleset_mode === 'ranking_based';
      }
      return true;
    });
  }, [programs, categoryFilter]);

  // Advanced filtering
  const filteredPrograms = useMemo(() => {
    return categoryFilteredPrograms.filter((program) => {
      const offer = program.offers[0];
      if (!offer) {
        return false;
      }

      // Cost filter
      if (filters.cost.length > 0) {
        const fee = offer.entry_fee || 0;
        const matchesCost = filters.cost.some((range) => {
          if (range === 'free') {
            return fee === 0;
          }
          if (range === 'under50') {
            return fee > 0 && fee < 50;
          }
          if (range === '50to200') {
            return fee >= 50 && fee <= 200;
          }
          if (range === '200to500') {
            return fee >= 200 && fee <= 500;
          }
          if (range === '500plus') {
            return fee > 500;
          }
          return false;
        });
        if (!matchesCost) {
          return false;
        }
      }

      // Account size filter
      if (filters.accountSize.length > 0) {
        const size = offer.account_size;
        const matchesSize = filters.accountSize.some((range) => {
          if (range === 'under10k') {
            return size < 10000;
          }
          if (range === '10kto50k') {
            return size >= 10000 && size < 50000;
          }
          if (range === '50kto100k') {
            return size >= 50000 && size < 100000;
          }
          if (range === '100kplus') {
            return size >= 100000;
          }
          return false;
        });
        if (!matchesSize) {
          return false;
        }
      }

      // Profit split filter
      if (filters.profitSplit.length > 0) {
        const split = program.kpis.profit_split_max || 0;
        const matchesSplit = filters.profitSplit.some((range) => {
          if (range === '80plus') {
            return split >= 80;
          }
          if (range === '90plus') {
            return split >= 90;
          }
          if (range === '95plus') {
            return split >= 95;
          }
          if (range === '100') {
            return split === 100;
          }
          return false;
        });
        if (!matchesSplit) {
          return false;
        }
      }

      return true;
    });
  }, [categoryFilteredPrograms, filters]);

  // Sorting
  const sortedPrograms = useMemo(() => {
    return [...filteredPrograms].sort((a, b) => {
      const offerA = a.offers[0];
      const offerB = b.offers[0];

      if (!offerA || !offerB) {
        return 0;
      }

      switch (sortBy) {
        case 'account_size_asc':
          return offerA.account_size - offerB.account_size;
        case 'account_size_desc':
          return offerB.account_size - offerA.account_size;
        case 'profit_split_desc':
          return (b.kpis.profit_split_max || 0) - (a.kpis.profit_split_max || 0);
        case 'cost_asc':
          return (offerA.entry_fee || 0) - (offerB.entry_fee || 0);
        case 'freshness':
          return a.kpis.freshness_days - b.kpis.freshness_days;
        default: // popularity
          return 0;
      }
    });
  }, [filteredPrograms, sortBy]);

  // URL state sync
  useEffect(() => {
    const params = new URLSearchParams();

    if (categoryFilter !== 'all') {
      params.set('category', categoryFilter);
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });

    if (sortBy !== 'popularity') {
      params.set('sort', sortBy);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [categoryFilter, filters, sortBy]);

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlCategory = params.get('category') as CategoryFilter;
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    }

    const urlFilters: FilterState = {
      cost: params.get('cost')?.split(',').filter(Boolean) || [],
      accountSize: params.get('accountSize')?.split(',').filter(Boolean) || [],
      profitSplit: params.get('profitSplit')?.split(',').filter(Boolean) || [],
      type: params.get('type')?.split(',').filter(Boolean) || [],
      market: params.get('market')?.split(',').filter(Boolean) || [],
      platform: params.get('platform')?.split(',').filter(Boolean) || [],
    };

    setFilters(urlFilters);

    const urlSort = params.get('sort') as SortOption;
    if (urlSort) {
      setSortBy(urlSort);
    }
  }, []);

  const handleViewDetails = (programId: string, _offerId: string) => {
    const program = programs.find(p => p.program.id === programId);
    if (program) {
      setSelectedProgram(program);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedProgram(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-96 animate-pulse rounded-lg bg-muted" />
          </div>

          {/* Cards skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-[400px] animate-pulse rounded-[32px] bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  // Empty state - no programs in database
  if (programs.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t('page.title')}</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t('page.subtitle', { count: 0 })}
            </p>
          </div>

          <EmptyState type="no-programs" />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('page.title')}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t('page.subtitle', { count: programs.length })}
          </p>
        </div>

        {/* Category Tabs - 3 main categories - Tradelia Design System */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={cn(
              'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900 dark:shadow-slate-100/20'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
            type="button"
          >
            {t('categories.all')}
          </button>
          <button
            onClick={() => setCategoryFilter('free')}
            className={cn(
              'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
              categoryFilter === 'free'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
            type="button"
          >
            {t('categories.free')}
          </button>
          <button
            onClick={() => setCategoryFilter('challenges')}
            className={cn(
              'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
              categoryFilter === 'challenges'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
            type="button"
          >
            {t('categories.challenges')}
          </button>
          <button
            onClick={() => setCategoryFilter('tournaments')}
            className={cn(
              'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
              categoryFilter === 'tournaments'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
            type="button"
          >
            {t('categories.tournaments')}
          </button>
        </div>

        {/* Results count and sort */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('filters.results', { count: sortedPrograms.length })}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <option value="popularity">{t('sort.popularity')}</option>
              <option value="account_size_asc">{t('sort.accountSizeAsc')}</option>
              <option value="account_size_desc">{t('sort.accountSizeDesc')}</option>
              <option value="profit_split_desc">{t('sort.profitSplitDesc')}</option>
              <option value="cost_asc">{t('sort.costAsc')}</option>
              <option value="freshness">{t('sort.freshness')}</option>
            </select>
          </div>
        </div>

        {/* Programs grid - Tradelia Design System with padding */}
        {sortedPrograms.length === 0 ? (
          <EmptyState
            type="no-results"
            onAction={() => {
              setCategoryFilter('all');
              setFilters({
                cost: [],
                accountSize: [],
                profitSplit: [],
                type: [],
                market: [],
                platform: [],
              });
            }}
          />
        ) : (
          <div className="grid gap-6 px-2 pb-8 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
            {sortedPrograms.map(programData => (
              <ProgramCard
                key={programData.program.id}
                program={programData.program}
                offers={programData.offers}
                kpis={programData.kpis}
                marketAccess={programData.marketAccess}
                platforms={programData.platforms}
                onViewDetailsAction={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Program Drawer */}
      {selectedProgram && (
        <ProgramDrawer
          program={selectedProgram.program}
          offers={selectedProgram.offers}
          rulesets={selectedProgram.rulesets}
          payoutTerms={selectedProgram.payoutTerms}
          marketAccess={selectedProgram.marketAccess}
          isOpen={!!selectedProgram}
          onCloseAction={handleCloseDrawer}
          onEnrollAction={async (programId: string, offerId: string) => {
            try {
              const response = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  programId,
                  offerId,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                return {
                  success: false,
                  error: data.error || 'Failed to create enrollment',
                };
              }

              return {
                success: true,
              };
            } catch (err) {
              return {
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error',
              };
            }
          }}
        />
      )}
    </div>
  );
}
