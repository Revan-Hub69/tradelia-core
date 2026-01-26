'use client';

import { useEffect, useState } from 'react';

import { ChallengeCard } from '@/components/dashboard/challenges/ChallengeCard';
import { ChallengeComparison } from '@/components/dashboard/challenges/ChallengeComparison';
import { ChallengeDrawer } from '@/components/dashboard/challenges/ChallengeDrawer';
import { ChallengeFilters } from '@/components/dashboard/challenges/ChallengeFilters';
import { ChallengeSearch } from '@/components/dashboard/challenges/ChallengeSearch';
import { ChallengeSortDropdown } from '@/components/dashboard/challenges/ChallengeSortDropdown';

type Challenge = {
  id: string;
  name: string;
  description: string;
  is_free: boolean;
  entry_fee: number | null;
  currency: string;
  refundable: boolean;
  account_size: number;
  scaling_potential: number | null;
  profit_split: { initial: number; scaled?: number; maximum?: number };
  rules: {
    profitTarget?: number;
    maxDailyLoss?: number;
    maxDrawdown?: number;
    minTradingDays?: number;
    timeLimit?: number;
    consistencyRule?: string;
  };
  payout_speed: string;
  first_payout_delay: number;
  markets: string[];
  platforms: string[];
  pros: string[];
  cons: string[];
  best_for: string;
  official_url: string;
  popularity: number;
  success_rate: number | null;
  prop_firms: {
    name: string;
    logo_url: string;
    reputation: number;
    website_url: string;
  };
};

type FilterState = {
  cost: string[];
  accountSize: string[];
  profitSplit: string[];
  payoutSpeed: string[];
  type: string[];
  market: string[];
};

type SortOption =
  | 'recommended'
  | 'lowest_cost'
  | 'highest_split'
  | 'fastest_payout'
  | 'largest_account';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<FilterState>({
    cost: [],
    accountSize: [],
    profitSplit: [],
    payoutSpeed: [],
    type: [],
    market: [],
  });

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/challenges');
        const data = await response.json();

        if (data.success) {
          setChallenges(data.data);
          setFilteredChallenges(data.data);
        } else {
          setError('Failed to load challenges');
        }
      } catch (err) {
        setError('An error occurred while loading challenges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Apply filters, search, and sort
  useEffect(() => {
    let result = [...challenges];

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.prop_firms.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply filters
    if (filters.cost.length > 0) {
      result = result.filter((c) => {
        if (filters.cost.includes('free')) {
          return c.is_free;
        }
        if (!c.entry_fee) {
          return false;
        }
        if (filters.cost.includes('<50')) {
          return c.entry_fee < 50;
        }
        if (filters.cost.includes('50-200')) {
          return c.entry_fee >= 50 && c.entry_fee <= 200;
        }
        if (filters.cost.includes('200-500')) {
          return c.entry_fee > 200 && c.entry_fee <= 500;
        }
        if (filters.cost.includes('500+')) {
          return c.entry_fee > 500;
        }
        return false;
      });
    }

    if (filters.accountSize.length > 0) {
      result = result.filter((c) => {
        if (filters.accountSize.includes('<10k')) {
          return c.account_size < 10000;
        }
        if (filters.accountSize.includes('10k-50k')) {
          return c.account_size >= 10000 && c.account_size < 50000;
        }
        if (filters.accountSize.includes('50k-100k')) {
          return c.account_size >= 50000 && c.account_size < 100000;
        }
        if (filters.accountSize.includes('100k+')) {
          return c.account_size >= 100000;
        }
        return false;
      });
    }

    if (filters.profitSplit.length > 0) {
      result = result.filter((c) => {
        const maxSplit = c.profit_split.maximum || c.profit_split.scaled || c.profit_split.initial;
        if (filters.profitSplit.includes('80+')) {
          return maxSplit >= 80;
        }
        if (filters.profitSplit.includes('90+')) {
          return maxSplit >= 90;
        }
        if (filters.profitSplit.includes('95+')) {
          return maxSplit >= 95;
        }
        if (filters.profitSplit.includes('100')) {
          return maxSplit === 100;
        }
        return false;
      });
    }

    // Apply sort
    switch (sortOption) {
      case 'lowest_cost':
        result.sort((a, b) => {
          const aFee = a.is_free ? 0 : a.entry_fee || 0;
          const bFee = b.is_free ? 0 : b.entry_fee || 0;
          return aFee - bFee;
        });
        break;
      case 'highest_split':
        result.sort((a, b) => {
          const aMax = a.profit_split.maximum || a.profit_split.scaled || a.profit_split.initial;
          const bMax = b.profit_split.maximum || b.profit_split.scaled || b.profit_split.initial;
          return bMax - aMax;
        });
        break;
      case 'largest_account':
        result.sort((a, b) => b.account_size - a.account_size);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    setFilteredChallenges(result);
  }, [challenges, searchQuery, filters, sortOption]);

  const handleCompareToggle = (id: string) => {
    if (comparisonIds.includes(id)) {
      setComparisonIds(comparisonIds.filter((cid) => cid !== id));
    } else if (comparisonIds.length < 3) {
      setComparisonIds([...comparisonIds, id]);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      cost: [],
      accountSize: [],
      profitSplit: [],
      payoutSpeed: [],
      type: [],
      market: [],
    });
  };

  const comparisonChallenges = challenges.filter((c) =>
    comparisonIds.includes(c.id),
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/30">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Challenge Library</h1>
          <p className="text-muted-foreground">
            Browse and compare
            {' '}
            {challenges.length}
            {' '}
            trading challenges from top prop firms worldwide
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <ChallengeSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <ChallengeSortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 shrink-0">
            <ChallengeFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
              resultCount={filteredChallenges.length}
            />
          </aside>

          {/* Challenge Grid */}
          <div className="flex-1">
            {comparisonIds.length > 0 && (
              <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold">
                      {comparisonIds.length}
                    </span>
                    {' '}
                    challenge
                    {comparisonIds.length !== 1 ? 's' : ''}
                    {' '}
                    selected
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowComparison(true)}
                      disabled={comparisonIds.length < 2}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                      type="button"
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => setComparisonIds([])}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredChallenges.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">
                  No challenges found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredChallenges.map((challenge) => {
                  return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onViewDetails={(c) => {
                      return setSelectedChallenge(c);
                    }}
                    onCompareToggle={handleCompareToggle}
                    isComparing={comparisonIds.includes(challenge.id)}
                  />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Challenge Drawer */}
      <ChallengeDrawer
        challenge={selectedChallenge}
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        onEnroll={() => {
          // TODO: Implement enrollment flow
        }}
      />

      {/* Comparison Modal */}
      {showComparison && comparisonChallenges.length >= 2 && (
        <ChallengeComparison
          challenges={comparisonChallenges}
          onRemove={(id) => {
            setComparisonIds(comparisonIds.filter((cid) => {
              return cid !== id;
            }));
            if (comparisonIds.length <= 2) {
              setShowComparison(false);
            }
          }}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
