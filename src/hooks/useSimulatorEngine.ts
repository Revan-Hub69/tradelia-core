'use client';

import { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { AssetClass } from '@/components/simulatore/AssetSelector';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';

export type SimulatorResult = {
  id: string;
  instrumentName: string;
  brokerName: string;
  score: number;
  feasibility: Feasibility;
  spreadCost: number;
  commissionCost: number;
  overnightCost: number;
  slippageCost: number;
  achievableExposure: number;
  deviationPct: number;
};

type EngineInput = { exposure: number; assetClass: AssetClass; };

/** Stub engine — replace with normalizeToExposure + computeInstrumentScore */
function runEngine({ exposure, assetClass }: EngineInput): SimulatorResult[] {
  if (exposure < 100) return [];
  return [
    {
      id: `${assetClass}-cfd-ig`,
      instrumentName: `${assetClass} CFD`,
      brokerName: 'IG Markets',
      score: 84, feasibility: 'OPTIMAL',
      spreadCost: exposure * 0.0008, commissionCost: 0,
      overnightCost: exposure * 0.0002, slippageCost: exposure * 0.0001,
      achievableExposure: exposure, deviationPct: 0.2,
    },
    {
      id: `${assetClass}-future-ibkr`,
      instrumentName: `${assetClass} Futures`,
      brokerName: 'Interactive Brokers',
      score: 71,
      feasibility: exposure >= 5000 ? 'FEASIBLE' : 'WARNING',
      spreadCost: exposure * 0.0003, commissionCost: exposure * 0.0006,
      overnightCost: 0, slippageCost: exposure * 0.0002,
      achievableExposure: exposure >= 5000 ? exposure : Math.floor(exposure / 5000) * 5000,
      deviationPct: exposure >= 5000 ? 0 : ((exposure % 5000) / exposure) * 100,
    },
    {
      id: `${assetClass}-etf-xtb`,
      instrumentName: `${assetClass} ETF`,
      brokerName: 'XTB',
      score: 58, feasibility: 'FEASIBLE',
      spreadCost: exposure * 0.0015, commissionCost: exposure * 0.0004,
      overnightCost: 0, slippageCost: exposure * 0.0003,
      achievableExposure: exposure, deviationPct: 1.1,
    },
    {
      id: `${assetClass}-option-deribit`,
      instrumentName: `${assetClass} Option`,
      brokerName: 'Deribit',
      score: 41,
      feasibility: exposure >= 2000 ? 'WARNING' : 'INFEASIBLE',
      spreadCost: exposure * 0.002, commissionCost: exposure * 0.0008,
      overnightCost: 0, slippageCost: exposure * 0.0005,
      achievableExposure: exposure >= 2000 ? exposure : 0,
      deviationPct: exposure >= 2000 ? 3.2 : 100,
    },
  ].sort((a, b) => b.score - a.score);
}

export function useSimulatorEngine() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initExposure = Number(searchParams.get('exposure') ?? 5000);
  const initAsset = (searchParams.get('asset') as AssetClass) ?? 'FOREX';

  const [exposure, setExposureRaw] = useState<number>(initExposure);
  const [assetClass, setAssetClassRaw] = useState<AssetClass>(initAsset);
  const [results, setResults] = useState<SimulatorResult[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncUrl = useCallback((exp: number, asset: AssetClass) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('exposure', String(exp));
    params.set('asset', asset);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams, startTransition]);

  const runDebounced = useCallback((exp: number, asset: AssetClass) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsComputing(true);
    debounceRef.current = setTimeout(() => {
      setResults(runEngine({ exposure: exp, assetClass: asset }));
      setIsComputing(false);
    }, 300);
  }, []);

  const setExposure = useCallback((v: number) => {
    setExposureRaw(v); syncUrl(v, assetClass); runDebounced(v, assetClass);
  }, [assetClass, syncUrl, runDebounced]);

  const setAssetClass = useCallback((v: AssetClass) => {
    setAssetClassRaw(v); syncUrl(exposure, v); runDebounced(exposure, v);
  }, [exposure, syncUrl, runDebounced]);

  useEffect(() => {
    runDebounced(initExposure, initAsset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { exposure, setExposure, assetClass, setAssetClass, results, isComputing: isComputing || isPending };
}
