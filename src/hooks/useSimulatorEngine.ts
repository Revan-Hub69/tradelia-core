'use client';

import { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { AssetClass } from '@/components/simulatore/AssetSelector';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';
import { runEngine } from '@/lib/simulator/engine';
import type { SimulatorResult, EngineInput } from '@/lib/simulator/engine';

// Re-export per retrocompatibilità con i componenti UI esistenti
export type { SimulatorResult };
export type { Feasibility };

// ── Mapping UI → EngineInput ──────────────────────────────────────────
// account → capital (punto medio del range)
const ACCOUNT_TO_CAPITAL: Record<string, number> = {
  demo:    250,
  micro:   1_250,
  retail:  6_000,
  semipro: 30_000,
  pro:     100_000,
};

// style → nDaysOpen (giorni medi holding)
const STYLE_TO_DAYS: Record<string, number> = {
  scalping:  0,   // intraday puro — notti = 0
  intraday:  1,
  swing:     7,
  position:  30,
};

// freq → nTrades/mese → normalizzato su 1 sessione (engine usa nTrades per run)
// Usiamo il numero medio giornaliero / settimanale / mensile in base allo style
const FREQ_TRADES: Record<string, Record<string, number>> = {
  scalping:  { low: 7,   mid: 30,  high: 100 },
  intraday:  { low: 1,   mid: 4,   high: 10  },
  swing:     { low: 1,   mid: 4,   high: 10  },
  position:  { low: 1,   mid: 3,   high: 6   },
};

// leva → stopLossPips (stima conservativa per il risk check)
const LEVA_TO_SL_PIPS: Record<string, number> = {
  nessuna: 200,
  bassa:   100,
  media:   30,
  alta:    15,
};

export type ProfileInput = {
  style?:   string | null;
  freq?:    string | null;
  account?: string | null;
  leva?:    string | null;
};

function profileToEngineParams(p: ProfileInput): Partial<EngineInput> {
  const capital      = p.account ? (ACCOUNT_TO_CAPITAL[p.account] ?? 6_000) : 6_000;
  const nDaysOpen    = p.style   ? (STYLE_TO_DAYS[p.style]  ?? 1)   : 1;
  const nTrades      = (p.style && p.freq)
    ? (FREQ_TRADES[p.style]?.[p.freq] ?? 1)
    : 1;
  const stopLossPips = p.leva   ? (LEVA_TO_SL_PIPS[p.leva] ?? 20)  : 20;
  return { capital, nDaysOpen, nTrades, stopLossPips };
}

export function useSimulatorEngine() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initExposure = Number(searchParams.get('exposure') ?? 5000);
  const initAsset    = (searchParams.get('asset') as AssetClass) ?? 'FOREX';

  const [exposure,   setExposureRaw]   = useState<number>(initExposure);
  const [assetClass, setAssetClassRaw] = useState<AssetClass>(initAsset);
  const [profile,    setProfileRaw]    = useState<ProfileInput>({});
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

  const runDebounced = useCallback((
    exp: number,
    asset: AssetClass,
    prof: ProfileInput,
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsComputing(true);
    debounceRef.current = setTimeout(() => {
      const extraParams = profileToEngineParams(prof);
      setResults(runEngine({ exposure: exp, assetClass: asset, ...extraParams }));
      setIsComputing(false);
    }, 300);
  }, []);

  const setExposure = useCallback((v: number) => {
    setExposureRaw(v);
    syncUrl(v, assetClass);
    runDebounced(v, assetClass, profile);
  }, [assetClass, profile, syncUrl, runDebounced]);

  const setAssetClass = useCallback((v: AssetClass) => {
    setAssetClassRaw(v);
    syncUrl(exposure, v);
    runDebounced(exposure, v, profile);
  }, [exposure, profile, syncUrl, runDebounced]);

  const setProfile = useCallback((p: ProfileInput) => {
    setProfileRaw(p);
    runDebounced(exposure, assetClass, p);
  }, [exposure, assetClass, runDebounced]);

  useEffect(() => {
    runDebounced(initExposure, initAsset, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    exposure,
    setExposure,
    assetClass,
    setAssetClass,
    profile,
    setProfile,
    results,
    isComputing: isComputing || isPending,
  };
}
