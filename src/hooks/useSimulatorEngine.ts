'use client';

import { useState, useCallback, useTransition, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { AssetClass } from '@/components/simulatore/AssetSelector';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';
import { runEngine } from '@/lib/simulator/engine';
import type { SimulatorResult, EngineInput } from '@/lib/simulator/engine';

export type { SimulatorResult };
export type { Feasibility };

// Capitale reale (EUR) per fascia account.
// NON è l'exposure — il motore calcola exposure = capital × ESMA_leverage.
const ACCOUNT_TO_CAPITAL: Record<string, number> = {
  demo:    250,
  micro:   1_250,
  retail:  6_000,
  semipro: 30_000,
  pro:     100_000,
};

const STYLE_TO_DAYS: Record<string, number> = {
  scalping: 0, intraday: 1, swing: 7, position: 30,
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

/**
 * Converte il profilo UI → parametri EngineInput.
 * nTrades rimosso (v4 engine è sempre per-singolo-trade).
 * Scaling mensile = responsabilità del caller / recommend().
 */
function profileToEngineParams(p: ProfileInput): Partial<EngineInput> {
  return {
    capital:      p.account ? (ACCOUNT_TO_CAPITAL[p.account] ?? 6_000) : 6_000,
    nDaysOpen:    p.style   ? (STYLE_TO_DAYS[p.style]         ?? 1)    : 1,
    stopLossPips: p.leva    ? (LEVA_TO_SL_PIPS[p.leva]        ?? 20)   : 20,
  };
}

export function useSimulatorEngine() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [assetClass,  setAssetClassState] = useState<AssetClass | null>(null);
  const [profile,     setProfileState]    = useState<ProfileInput>({});
  const [results,     setResults]         = useState<SimulatorResult[]>([]);
  const [isComputing, setIsComputing]     = useState(false);

  const assetRef      = useRef<AssetClass | null>(null);
  const profileRef    = useRef<ProfileInput>({});
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRun = useCallback(() => {
    if (!assetRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsComputing(true);
    debounceRef.current = setTimeout(() => {
      const extra = profileToEngineParams(profileRef.current);
      const input: EngineInput = {
        assetClass: assetRef.current!,
        ...extra,
      };
      setResults(runEngine(input));
      setIsComputing(false);
    }, 250);
  }, []);

  const syncUrl = useCallback((ac: AssetClass, capital: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('capital', String(capital));
    params.set('asset',   ac);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams, startTransition]);

  const setAssetClass = useCallback((v: AssetClass) => {
    assetRef.current = v;
    setAssetClassState(v);
    const capital = ACCOUNT_TO_CAPITAL[profileRef.current.account ?? ''] ?? 6_000;
    syncUrl(v, capital);
    scheduleRun();
  }, [syncUrl, scheduleRun]);

  const setProfile = useCallback((p: ProfileInput) => {
    profileRef.current = p;
    setProfileState(p);
    if (assetRef.current) {
      const capital = ACCOUNT_TO_CAPITAL[p.account ?? ''] ?? 6_000;
      syncUrl(assetRef.current, capital);
    }
    scheduleRun();
  }, [syncUrl, scheduleRun]);

  // setExposure: no-op stub — exposure è derivata da capital × ESMA nel motore.
  // Mantenuto per compatibilità con SimulatoreShell senza modificare il componente.
  const setExposure = useCallback((_exposure: number) => {
    // intenzionalmente vuoto: il motore ignora exposure diretta
  }, []);

  return {
    assetClass,
    setAssetClass,
    profile,
    setProfile,
    setExposure,
    results,
    isComputing: isComputing || isPending,
  };
}
