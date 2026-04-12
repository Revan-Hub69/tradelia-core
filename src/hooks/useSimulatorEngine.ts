'use client';

import { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { AssetClass } from '@/components/simulatore/AssetSelector';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';
import { runEngine } from '@/lib/simulator/engine';
import type { SimulatorResult } from '@/lib/simulator/engine';

// Re-export per retrocompatibilità con i componenti UI esistenti
export type { SimulatorResult };
export type { Feasibility };

export function useSimulatorEngine() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initExposure = Number(searchParams.get('exposure') ?? 5000);
  const initAsset    = (searchParams.get('asset') as AssetClass) ?? 'FOREX';

  const [exposure,   setExposureRaw]   = useState<number>(initExposure);
  const [assetClass, setAssetClassRaw] = useState<AssetClass>(initAsset);
  const [results,    setResults]       = useState<SimulatorResult[]>([]);
  const [isComputing, setIsComputing]  = useState(false);
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

  return {
    exposure,
    setExposure,
    assetClass,
    setAssetClass,
    results,
    isComputing: isComputing || isPending,
  };
}
