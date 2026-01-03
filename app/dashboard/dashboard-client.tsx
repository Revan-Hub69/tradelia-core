"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Regime = "TREND" | "RANGE" | "NO_TRADE";

type SnapshotResponse = {
  source: "binance";
  symbol: string;
  interval: string;
  limit: number;
  asOf: number;
  candles: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }>;
  regime: {
    regime: Regime;
    confidence: number;
    reason: unknown;
  };
};

type AiResponse = {
  model?: string;
  id?: string;
  created?: number;
  usage?: unknown;
  output?: unknown;
  error?: string;
};

const INTERVAL_OPTIONS = ["15m", "1h", "4h", "1d"] as const;

function regimeBadgeClass(regime: Regime) {
  if (regime === "TREND") return "status-ok";
  if (regime === "RANGE") return "status-attention";
  return "status-risk";
}

function formatConfidence(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

export function DashboardClient() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState<(typeof INTERVAL_OPTIONS)[number]>("4h");
  const [limit, setLimit] = useState(300);

  const [snapshot, setSnapshot] = useState<SnapshotResponse | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);

  const [ai, setAi] = useState<AiResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const storageKey = useMemo(
    () => `tradelia-prev-regime:${symbol.trim().toUpperCase()}:${interval}`,
    [symbol, interval],
  );

  const loadSnapshot = useCallback(async () => {
    setLoadingSnapshot(true);
    setSnapshotError(null);
    setAi(null);
    setAiError(null);

    const prev = window.localStorage.getItem(storageKey);
    const previousRegime = prev === "TREND" || prev === "RANGE" || prev === "NO_TRADE" ? prev : undefined;

    const url = new URL("/api/snapshot", window.location.origin);
    url.searchParams.set("symbol", symbol.trim().toUpperCase());
    url.searchParams.set("interval", interval);
    url.searchParams.set("limit", String(limit));
    if (previousRegime) url.searchParams.set("previousRegime", previousRegime);

    try {
      const res = await fetch(url.toString(), { method: "GET" });
      const data = (await res.json()) as unknown;
      if (!res.ok) {
        const message = isPlainObject(data) && typeof data.error === "string" ? data.error : "Snapshot error.";
        throw new Error(message);
      }

      const parsed = data as SnapshotResponse;
      setSnapshot(parsed);
      window.localStorage.setItem(storageKey, parsed.regime.regime);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Snapshot error.";
      setSnapshotError(message);
    } finally {
      setLoadingSnapshot(false);
    }
  }, [interval, limit, storageKey, symbol]);

  const runAi = useCallback(async () => {
    if (!snapshot) return;
    setLoadingAi(true);
    setAiError(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: snapshot.symbol,
          interval: snapshot.interval,
          regime: snapshot.regime,
        }),
      });
      const data = (await res.json()) as unknown;
      if (!res.ok) {
        const message = isPlainObject(data) && typeof data.error === "string" ? data.error : "AI error.";
        throw new Error(message);
      }
      setAi(data as AiResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI error.";
      setAiError(message);
    } finally {
      setLoadingAi(false);
    }
  }, [snapshot]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const currentRegime = snapshot?.regime.regime;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">Snapshot + Regime</h2>
            <p className="text-xs text-muted-foreground">REST-only (Binance) → classificatore deterministico</p>
          </div>
          <button
            type="button"
            className="btn-primary px-4 py-2 text-xs"
            onClick={() => void loadSnapshot()}
            disabled={loadingSnapshot}
          >
            {loadingSnapshot ? "Aggiorno..." : "Aggiorna"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Symbol</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="BTCUSDT"
              spellCheck={false}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Interval</span>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={interval}
              onChange={(e) => setInterval(e.target.value as (typeof INTERVAL_OPTIONS)[number])}
            >
              {INTERVAL_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Limit</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={String(limit)}
              onChange={(e) => setLimit(Number(e.target.value))}
              inputMode="numeric"
            />
          </label>
        </div>

        {snapshotError && (
          <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
            {snapshotError}
          </div>
        )}

        {snapshot && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`${regimeBadgeClass(snapshot.regime.regime)} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]`}
              >
                {snapshot.regime.regime}
              </span>
              <span className="text-xs text-muted-foreground">
                confidence: {formatConfidence(snapshot.regime.confidence)}
              </span>
              <span className="text-xs text-muted-foreground">
                candles: {snapshot.limit} · asOf: {new Date(snapshot.asOf).toLocaleString()}
              </span>
            </div>

            <details className="accordion">
              <summary>Dettagli JSON (regime.reason)</summary>
              <pre className="mt-4 max-h-[360px] overflow-auto rounded-2xl border border-border bg-background/60 p-4 text-xs text-foreground">
                {JSON.stringify(snapshot.regime.reason, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      <section className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">AI Decider (Groq)</h2>
            <p className="text-xs text-muted-foreground">Riceve il regime come gate + setup ammessi</p>
          </div>
          <button
            type="button"
            className="btn-primary px-4 py-2 text-xs"
            onClick={() => void runAi()}
            disabled={!snapshot || loadingAi}
            title={!snapshot ? "Carica prima lo snapshot" : undefined}
          >
            {loadingAi ? "Chiedo..." : "Chiedi AI"}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {!snapshot && (
            <p className="text-sm text-muted-foreground">Carica uno snapshot per inviare {`{regime,...}`} all&apos;AI.</p>
          )}

          {snapshot && (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Gate</p>
              <p className="mt-2">
                regime: <span className="font-semibold">{currentRegime}</span>
              </p>
            </div>
          )}

          {aiError && (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">{aiError}</div>
          )}

          {ai && (
            <details className="accordion" open>
              <summary>Output AI</summary>
              <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-border bg-background/60 p-4 text-xs text-foreground">
                {JSON.stringify(ai.output ?? ai, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </section>
    </div>
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

