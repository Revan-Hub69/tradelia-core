'use client';

import { useState, useCallback, useTransition, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { runEngine } from '@/lib/simulator/engine';
import type { SimulatorResult, EngineInput } from '@/lib/simulator/engine';

export type { SimulatorResult };

export type EnrichedResult = SimulatorResult & {
  tradesPerMonth:   number;
  spreadMonth:      number;
  commissionMonth:  number;
  slippageMonth:    number;
  totalMonth:       number;
};

function enrichResults(
  results: SimulatorResult[],
  tradesPerMonth: number,
): EnrichedResult[] {
  return results.map(r => ({
    ...r,
    tradesPerMonth,
    spreadMonth:     r.spreadCost     * tradesPerMonth,
    commissionMonth: r.commissionCost * tradesPerMonth,
    slippageMonth:   r.slippageCost   * tradesPerMonth,
    totalMonth:      r.monthlyCostEUR,
  }));
}

export function useSimulatorEngine() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [results,     setResults]     = useState<EnrichedResult[]>([]);
  const [isComputing, setIsComputing] = useState(false);

  const inputRef    = useRef<EngineInput | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRun = useCallback((input: EngineInput) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsComputing(true);

    debounceRef.current = setTimeout(() => {
      const raw = runEngine(input);
      setResults(enrichResults(raw, input.tradesPerMonth));
      setIsComputing(false);
    }, 250);
  }, []);

  const syncUrl = useCallback((input: EngineInput) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('asset',   input.assetClass);
    params.set('capital', String(input.capital));
    if (input.underlyingId) params.set('underlying', input.underlyingId);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams, startTransition]);

  const setEngineInput = useCallback((input: EngineInput) => {
    inputRef.current = input;
    syncUrl(input);
    scheduleRun(input);
  }, [syncUrl, scheduleRun]);

  return {
    setEngineInput,
    results,
    isComputing: isComputing || isPending,
  };
}
