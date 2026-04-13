'use client';

import { useState, useCallback, useTransition, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { AssetClass } from '@/components/simulatore/AssetSelector';
import type { Feasibility } from '@/components/simulatore/FeasibilityBadge';
import { runEngine } from '@/lib/simulator/engine';
import type { SimulatorResult, EngineInput } from '@/lib/simulator/engine';

export type { SimulatorResult };
export type { Feasibility };

// ── Capital per fascia account ─────────────────────────────────────────
const ACCOUNT_TO_CAPITAL: Record<string, number> = {
  demo:    250,
  micro:   1_250,
  retail:  6_000,
  semipro: 30_000,
  pro:     100_000,
};

// ── Holding days per stile ─────────────────────────────────────────────
const STYLE_TO_DAYS: Record<string, number> = {
  scalping: 0, intraday: 1, swing: 7, position: 30,
};

// ── Trades al MESE per stile × frequenza ──────────────────────────────
// scalping/intraday: × 22 giorni lavorativi
// swing:            × 4 settimane
// position:         diretto (nr trades al mese)
const FREQ_TRADES_MONTHLY: Record<string, Record<string, number>> = {
  scalping:  { low: 7 * 22,   mid: 30 * 22,  high: 100 * 22 },
  intraday:  { low: 1 * 22,   mid: 4  * 22,  high: 10  * 22 },
  swing:     { low: 1 * 4,    mid: 4  * 4,   high: 10  * 4  },
  position:  { low: 1,        mid: 3,        high: 6        },
};

// ── Stop loss in pips per livello leva ────────────────────────────────
const LEVA_TO_SL_PIPS: Record<string, number> = {
  nessuna: 200, bassa: 100, media: 30, alta: 15,
};

export type ProfileInput = {
  style?:         string | null;
  freq?:          string | null;
  account?:       string | null;
  leva?:          string | null;
  underlyingId?:  string | null;   // coppia specifica (es. 'eurusd')
};

export type EnrichedResult = SimulatorResult & {
  tradesPerMonth:   number;
  spreadMonth:      number;
  commissionMonth:  number;
  overnightMonth:   number;
  slippageMonth:    number;
  totalMonth:       number;
};

// nDaysOpen = 0 → scalping, overnight sempre zero.
// overnight non si moltiplica come spread/comm: l'engine lo calcola già su nDaysOpen;
// moltiplicare per tradesPerMonth è corretto solo assumendo 1 trade aperto alla volta
// (ipotesi valida per V1 con trader retail).
// totalMonth è la somma esplicita dei componenti — non costPerTradeEUR × trades —
// così rimane coerente anche quando overnightCost diverge dal modello per-trade.
function enrichResults(
  results: SimulatorResult[],
  tradesPerMonth: number,
  nDaysOpen: number,
): EnrichedResult[] {
  return results.map(r => {
    const spreadM     = r.spreadCost     * tradesPerMonth;
    const commM       = r.commissionCost * tradesPerMonth;
    const slippageM   = r.slippageCost   * tradesPerMonth;
    const overnightM  = nDaysOpen === 0 ? 0 : r.overnightCost * tradesPerMonth;
    return {
      ...r,
      tradesPerMonth,
      spreadMonth:     spreadM,
      commissionMonth: commM,
      overnightMonth:  overnightM,
      slippageMonth:   slippageM,
      totalMonth:      spreadM + commM + overnightM + slippageM,
    };
  });
}

export function useSimulatorEngine() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [assetClass,  setAssetClassState] = useState<AssetClass | null>(null);
  const [profile,     setProfileState]    = useState<ProfileInput>({});
  const [results,     setResults]         = useState<EnrichedResult[]>([]);
  const [isComputing, setIsComputing]     = useState(false);

  const assetRef    = useRef<AssetClass | null>(null);
  const profileRef  = useRef<ProfileInput>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRun = useCallback(() => {
    if (!assetRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsComputing(true);

    debounceRef.current = setTimeout(() => {
      const p = profileRef.current;

      const capital        = ACCOUNT_TO_CAPITAL[p.account ?? ''] ?? 6_000;
      const nDaysOpen      = STYLE_TO_DAYS[p.style ?? ''] ?? 1;
      const stopLossPips   = LEVA_TO_SL_PIPS[p.leva ?? ''] ?? 20;
      const tradesPerMonth = (p.style && p.freq)
        ? (FREQ_TRADES_MONTHLY[p.style]?.[p.freq] ?? 1)
        : 1;

      // ── Step 1: dry run per ottenere exposure reale ────────────────
      // monthlyVolumeEUR richiede i lots → servono prima i lots.
      // In V1 con 1-2 broker il doppio run è ~0.1ms → nessun problema.
      // In V2 con N broker: ottimizzare calcolando exposure una volta per ugId.
      const dryInput: EngineInput = {
        assetClass:   assetRef.current!,
        capital,
        nDaysOpen,
        stopLossPips,
        underlyingId: (p.underlyingId ?? undefined) as EngineInput['underlyingId'],
      };
      const dryResults = runEngine(dryInput);

      const avgExposure = dryResults.length > 0
        ? dryResults.reduce((s, r) => s + r.achievableExposure, 0) / dryResults.length
        : capital * 10;

      const monthlyVolumeEUR = avgExposure * tradesPerMonth;

      // ── Step 2: run reale con monthlyVolumeEUR ─────────────────────
      const input: EngineInput = { ...dryInput, monthlyVolumeEUR };
      const raw = runEngine(input);

      setResults(enrichResults(raw, tradesPerMonth, nDaysOpen));
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

  // no-op stub — exposure derivata dal motore
  const setExposure = useCallback((_exposure: number) => {}, []);

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
