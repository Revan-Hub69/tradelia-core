'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ProgramCard } from '@/components/dashboard/challenges/ProgramCard';
import { ProgramDrawer } from '@/components/dashboard/challenges/ProgramDrawer';
import type { ProgramData } from '@/types/program';

export default function ChallengesPage() {
  const t = useTranslations('Challenges');
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

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

  const handleViewDetails = (programId: string, _offerId: string) => {
    const program = programs.find(p => p.program.id === programId);
    if (program) {
      setSelectedProgram(program);
    }
  };

  const handleCompareToggle = (offerId: string) => {
    if (comparisonIds.includes(offerId)) {
      setComparisonIds(comparisonIds.filter(id => id !== offerId));
    } else if (comparisonIds.length < 3) {
      setComparisonIds([...comparisonIds, offerId]);
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
                className="h-[600px] animate-pulse rounded-[32px] bg-muted"
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
        <div className="rounded-[32px] border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-xl font-bold text-red-600 dark:text-red-400">
            Failed to Load Programs
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (programs.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Challenge Library</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Browse and compare trading challenges from top prop firms worldwide
            </p>
          </div>

          <div className="rounded-[32px] border border-dashed border-border p-12 text-center">
            <div className="mb-4 text-6xl">📊</div>
            <h2 className="mb-2 text-xl font-bold">No Programs Available</h2>
            <p className="text-sm text-muted-foreground">
              Programs will appear here once they are added to the database.
            </p>
          </div>
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
          <h1 className="text-2xl font-bold sm:text-3xl">Challenge Library</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Browse and compare
            {' '}
            {programs.length}
            {' '}
            trading challenge
            {programs.length !== 1 ? 's' : ''}
            {' '}
            from top prop firms worldwide
          </p>
        </div>

        {/* Comparison bar */}
        {comparisonIds.length > 0 && (
          <div className="rounded-[32px] border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold">{comparisonIds.length}</span>
                {' '}
                offer
                {comparisonIds.length !== 1 ? 's' : ''}
                {' '}
                selected for comparison
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // TODO: Implement comparison view
                    console.log('Compare offers:', comparisonIds);
                  }}
                  disabled={comparisonIds.length < 2}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  type="button"
                >
                  {t('actions.compare')}
                </button>
                <button
                  onClick={() => setComparisonIds([])}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Programs grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map(programData => (
            <ProgramCard
              key={programData.program.id}
              program={programData.program}
              offers={programData.offers}
              kpis={programData.kpis}
              permissions={programData.permissions}
              platforms={programData.platforms}
              onViewDetails={handleViewDetails}
              onCompareToggle={handleCompareToggle}
              isComparing={comparisonIds.some(id =>
                programData.offers.some(offer => offer.id === id),
              )}
            />
          ))}
        </div>
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
          onClose={handleCloseDrawer}
          onEnroll={(programId) => {
            // TODO: Implement enrollment flow
            console.log('Enroll in program:', programId);
          }}
        />
      )}
    </div>
  );
}
