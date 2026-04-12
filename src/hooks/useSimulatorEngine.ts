'use client';

import { useState, useCallback, useTransition, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { AssetClass } from '@/components/simulatore/AssetSelector';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';
import { runEngine } from '@/lib/simulator/engine';
import type { SimulatorResult, EngineInput } from '@/lib/simulator/engine';

export type { SimulatorResult };
export type { Feasibility };

// ── Mapping UI → EngineInput ───────────────────────────────────────────
const ACCOUNT_TO_CAPITAL: Record<string, number> = {
  demo: 250, micro: 1_250, retail: 6_000, semipro: 30_000, pro: 100_000,
};
const STYLE_TO_DAYS: Record<string, number> = {
  scalping: 0, intraday: 1, swing: 7, position: 30,
};
const FREQ_TRADES: Record<string, Record<string, number>> = {
  scalping:  { low: 7,  mid: 30, high: 100 },
  intraday:  { low: 1,  mid: 4,  high: 10  },
  swing:     { low: 1,  mid: 4,  high: 10  },
  position:  { low: 1,  mid: 3,  high: 6   },
};
const LEVA_TO_SL_PIPS: Record<string, number> = {
  nessuna: 200, bassa: 100, media: 30, alta: 15,
};

export type ProfileInput = {
  style?:   string | null;
  freq?:    string | null;
  account?: string | null;
  leva?:    string | null;
};

function profileToEngineParams(p: ProfileInput): Partial<EngineInput> {
  return {
    capital:      p.account ? (ACCOUNT_TO_CAPITAL[p.account] ?? 6_000) : 6_000,
    nDaysOpen:    p.style   ? (STYLE_TO_DAYS[p.style]         ?? 1)    : 1,
    nTrades:      (p.style && p.freq) ? (FREQ_TRADES[p.style]?.[p.freq] ?? 1) : 1,
    stopLossPips: p.leva    ? (LEVA_TO_SL_PIPS[p.leva]        ?? 20)   : 20,
  };
}

export function useSimulatorEngine() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initExposure = Number(searchParams.get('exposure') ?? 6_000);
  const initAsset    = (searchParams.get('asset') as AssetClass) ?? 'FOREX';

  // ── state ──────────────────────────────────────────────────────────
  const [exposure,    setExposureState]   = useState<number>(initExposure);
  const [assetClass,  setAssetClassState] = useState<AssetClass>(initAsset);
  const [profile,     setProfileState]    = useState<ProfileInput>({});
  const [results,     setResults]         = useState<SimulatorResult[]>([]);
  const [isComputing, setIsComputing]     = useState(false);

  // ── refs — sempre aggiornati, leggibili dai callback senza stale closure ──
  const exposureRef   = useRef(initExposure);
  const assetRef      = useRef(initAsset);
  const profileRef    = useRef<ProfileInput>({});
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── motore ────────────────────────────────────────────────────────
  const scheduleRun = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsComputing(true);
    debounceRef.current = setTimeout(() => {
      const extra = profileToEngineParams(profileRef.current);
      setResults(runEngine({
        exposure:   exposureRef.current,
        assetClass: assetRef.current,
        ...extra,
      }));
      setIsComputing(false);
    }, 250);
  }, []);

  // ── URL sync ──────────────────────────────────────────────────────
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('exposure', String(exposureRef.current));
    params.set('asset',    assetRef.current);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams, startTransition]);

  // ── setters pubblici ──────────────────────────────────────────────
  const setExposure = useCallback((v: number) => {
    exposureRef.current = v;
    setExposureState(v);
    syncUrl();
    scheduleRun();
  }, [syncUrl, scheduleRun]);

  const setAssetClass = useCallback((v: AssetClass) => {
    assetRef.current = v;
    setAssetClassState(v);
    syncUrl();
    scheduleRun();
  }, [syncUrl, scheduleRun]);

  const setProfile = useCallback((p: ProfileInput) => {
    profileRef.current = p;
    setProfileState(p);
    scheduleRun();
  }, [scheduleRun]);

  // ── primo run al mount ─────────────────────────────────────────────
  useEffect(() => {
    scheduleRun();
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
