"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Regime4h = "TREND" | "RANGE" | "TRANSITION";

type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

type Regime4hOutput = {
  version: "regime-4h-v1";
  regime: Regime4h;
  stress: boolean;
  keptPrevious: boolean;
  metrics: {
    atr14: number;
    ema20: number;
    ema50: number;
    ema200: number;
    trendStrength: number;
    rangeRatio: number;
    returnsStd20: number;
    emaState: "aligned_strong" | "aligned_emerging" | "none";
    trueRangeLast: number;
  };
  allowedSetups: string[];
  forbiddenSetups: string[];
  reasonCode: string;
};

type TradingRegimeResponse = {
  source: string;
  symbol: string;
  interval: "4h";
  limit: number;
  asOf: number;
  candles: Candle[];
  regime: Regime4hOutput;
};

type ScreenerOk = Regime4hOutput & {
  symbol: string;
  ok: true;
  market: unknown;
  book: { bid: number; ask: number; spreadBps: number | null } | null;
  ticker24h: unknown;
  eligibility: { eligible: boolean; blocks: string[]; warnings: string[] };
};

type ScreenerErr = { symbol: string; ok: false; error: string };

type ScreenerResponse = {
  asOf: number;
  results: Array<ScreenerOk | ScreenerErr>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function inferErrorMessage(value: unknown, fallback: string) {
  if (!isPlainObject(value)) return fallback;
  return typeof value.error === "string" && value.error.trim().length > 0 ? value.error : fallback;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value);
}

function formatBps(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${value.toFixed(2)} bps`;
}

function regimeBadgeClass(regime: Regime4h) {
  if (regime === "TREND") return "status-ok";
  if (regime === "RANGE") return "status-attention";
  return "status-risk";
}

export function DashboardClient() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [limit, setLimit] = useState(300);
  const [concurrency, setConcurrency] = useState(3);

  const [regime, setRegime] = useState<TradingRegimeResponse | null>(null);
  const [regimeError, setRegimeError] = useState<string | null>(null);
  const [loadingRegime, setLoadingRegime] = useState(false);

  const [screener, setScreener] = useState<ScreenerResponse | null>(null);
  const [screenerError, setScreenerError] = useState<string | null>(null);
  const [loadingScreener, setLoadingScreener] = useState(false);

  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [regimeConfigText, setRegimeConfigText] = useState("");
  const [screenerConfigText, setScreenerConfigText] = useState("");
  const [symbolsConfigText, setSymbolsConfigText] = useState("");

  const [saving, setSaving] = useState<null | "regime" | "screener" | "symbols">(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const normalizedSymbol = useMemo(() => symbol.trim().toUpperCase(), [symbol]);

  const loadConfigs = useCallback(async () => {
    setLoadingConfigs(true);
    setConfigError(null);
    setSaveMessage(null);

    try {
      const [regimeRes, screenerRes, symbolsRes] = await Promise.all([
        fetch("/api/trading/config/regime", { method: "GET" }),
        fetch("/api/trading/config/screener", { method: "GET" }),
        fetch("/api/trading/config/symbols", { method: "GET" }),
      ]);

      const [regimeJson, screenerJson, symbolsJson] = await Promise.all([
        regimeRes.json().catch(() => ({})),
        screenerRes.json().catch(() => ({})),
        symbolsRes.json().catch(() => ({})),
      ]);

      if (!regimeRes.ok) throw new Error(inferErrorMessage(regimeJson, "Failed to load regime config."));
      if (!screenerRes.ok) throw new Error(inferErrorMessage(screenerJson, "Failed to load screener config."));
      if (!symbolsRes.ok) throw new Error(inferErrorMessage(symbolsJson, "Failed to load symbols config."));

      setRegimeConfigText(JSON.stringify(regimeJson, null, 2));
      setScreenerConfigText(JSON.stringify(screenerJson, null, 2));
      setSymbolsConfigText(JSON.stringify(symbolsJson, null, 2));
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : "Failed to load configs.");
    } finally {
      setLoadingConfigs(false);
    }
  }, []);

  const runRegime = useCallback(async () => {
    setLoadingRegime(true);
    setRegimeError(null);

    try {
      const url = new URL("/api/trading/regime", window.location.origin);
      url.searchParams.set("symbol", normalizedSymbol);
      url.searchParams.set("limit", String(limit));

      const res = await fetch(url.toString(), { method: "GET" });
      const data = (await res.json().catch(() => ({}))) as unknown;
      if (!res.ok) throw new Error(inferErrorMessage(data, "Failed to compute regime."));
      setRegime(data as TradingRegimeResponse);
    } catch (error) {
      setRegimeError(error instanceof Error ? error.message : "Failed to compute regime.");
      setRegime(null);
    } finally {
      setLoadingRegime(false);
    }
  }, [limit, normalizedSymbol]);

  const runScreener = useCallback(async () => {
    setLoadingScreener(true);
    setScreenerError(null);

    try {
      const url = new URL("/api/trading/screener", window.location.origin);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("concurrency", String(concurrency));

      const res = await fetch(url.toString(), { method: "GET" });
      const data = (await res.json().catch(() => ({}))) as unknown;
      if (!res.ok) throw new Error(inferErrorMessage(data, "Failed to run screener."));
      setScreener(data as ScreenerResponse);
    } catch (error) {
      setScreenerError(error instanceof Error ? error.message : "Failed to run screener.");
      setScreener(null);
    } finally {
      setLoadingScreener(false);
    }
  }, [concurrency, limit]);

  const saveConfig = useCallback(
    async (which: "regime" | "screener" | "symbols") => {
      setSaving(which);
      setSaveMessage(null);
      setConfigError(null);

      const text = which === "regime" ? regimeConfigText : which === "screener" ? screenerConfigText : symbolsConfigText;
      const endpoint =
        which === "regime"
          ? "/api/trading/config/regime"
          : which === "screener"
            ? "/api/trading/config/screener"
            : "/api/trading/config/symbols";

      let parsed: unknown;
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        setConfigError("Invalid JSON.");
        setSaving(null);
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });

        const data = (await res.json().catch(() => ({}))) as unknown;
        if (!res.ok) throw new Error(inferErrorMessage(data, "Save failed."));

        const pretty = JSON.stringify(data, null, 2);
        if (which === "regime") setRegimeConfigText(pretty);
        if (which === "screener") setScreenerConfigText(pretty);
        if (which === "symbols") setSymbolsConfigText(pretty);

        setSaveMessage("Saved.");
      } catch (error) {
        setConfigError(error instanceof Error ? error.message : "Save failed.");
      } finally {
        setSaving(null);
      }
    },
    [regimeConfigText, screenerConfigText, symbolsConfigText],
  );

  useEffect(() => {
    void loadConfigs();
  }, [loadConfigs]);

  useEffect(() => {
    void runRegime();
  }, [runRegime]);

  return (
    <div className="space-y-8">
      <div className="surface-card p-4 text-xs text-muted-foreground">
        Config e stato sono salvati su filesystem (consigliato: locale/VPS). In produzione su serverless non è affidabile.
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="surface-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">Regime 4h (deterministico)</h2>
              <p className="text-xs text-muted-foreground">Gate architetturale: TREND / RANGE / TRANSITION</p>
            </div>
            <button
              type="button"
              className="btn-primary px-4 py-2 text-xs"
              onClick={() => void runRegime()}
              disabled={loadingRegime}
            >
              {loadingRegime ? "Calcolo..." : "Ricalcola"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Limit</span>
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={String(limit)}
                onChange={(e) => setLimit(Number(e.target.value))}
                inputMode="numeric"
              />
            </label>
          </div>

          {regimeError && (
            <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
              {regimeError}
            </div>
          )}

          {regime && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`${regimeBadgeClass(regime.regime.regime)} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]`}
                >
                  {regime.regime.regime}
                </span>
                {regime.regime.stress && (
                  <span className="inline-flex rounded-full bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                    stress
                  </span>
                )}
                {regime.regime.keptPrevious && (
                  <span className="text-xs text-muted-foreground">keptPrevious</span>
                )}
                <span className="text-xs text-muted-foreground">
                  asOf: {new Date(regime.asOf).toLocaleString()} | candles: {regime.limit}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Metrics</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <dt className="text-muted-foreground">ATR14</dt>
                    <dd className="text-right">{formatNumber(regime.regime.metrics.atr14)}</dd>
                    <dt className="text-muted-foreground">trendStrength</dt>
                    <dd className="text-right">{formatNumber(regime.regime.metrics.trendStrength)}</dd>
                    <dt className="text-muted-foreground">rangeRatio</dt>
                    <dd className="text-right">{formatNumber(regime.regime.metrics.rangeRatio)}</dd>
                    <dt className="text-muted-foreground">returnsStd20</dt>
                    <dd className="text-right">{formatNumber(regime.regime.metrics.returnsStd20)}</dd>
                    <dt className="text-muted-foreground">emaState</dt>
                    <dd className="text-right">{regime.regime.metrics.emaState}</dd>
                    <dt className="text-muted-foreground">trueRangeLast</dt>
                    <dd className="text-right">{formatNumber(regime.regime.metrics.trueRangeLast)}</dd>
                  </dl>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Setups</p>
                  <p className="mt-3 text-xs">
                    allowed: <span className="font-semibold">{regime.regime.allowedSetups.join(", ")}</span>
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">forbidden: {regime.regime.forbiddenSetups.join(", ")}</p>
                  <p className="mt-2 text-xs text-muted-foreground">reason: {regime.regime.reasonCode}</p>
                </div>
              </div>

              <details className="accordion">
                <summary>JSON (regime)</summary>
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-border bg-background/60 p-4 text-xs text-foreground">
                  {JSON.stringify(regime.regime, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </section>

        <section className="surface-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">Screener (watchlist)</h2>
              <p className="text-xs text-muted-foreground">Filtra per regime + spread + volume</p>
            </div>
            <button
              type="button"
              className="btn-primary px-4 py-2 text-xs"
              onClick={() => void runScreener()}
              disabled={loadingScreener}
            >
              {loadingScreener ? "Scansiono..." : "Run"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Limit</span>
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={String(limit)}
                onChange={(e) => setLimit(Number(e.target.value))}
                inputMode="numeric"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Concurrency</span>
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={String(concurrency)}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                inputMode="numeric"
              />
            </label>
          </div>

          {screenerError && (
            <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
              {screenerError}
            </div>
          )}

          {screener && (
            <div className="mt-6 space-y-4">
              <p className="text-xs text-muted-foreground">asOf: {new Date(screener.asOf).toLocaleString()}</p>

              <div className="max-h-[520px] overflow-auto rounded-2xl border border-border">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur">
                    <tr className="border-b border-border">
                      <th className="px-3 py-2 font-semibold text-muted-foreground">Symbol</th>
                      <th className="px-3 py-2 font-semibold text-muted-foreground">Regime</th>
                      <th className="px-3 py-2 font-semibold text-muted-foreground">Stress</th>
                      <th className="px-3 py-2 font-semibold text-muted-foreground">Eligible</th>
                      <th className="px-3 py-2 font-semibold text-muted-foreground">Spread</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screener.results.map((row) => {
                      if (!row.ok) {
                        return (
                          <tr key={row.symbol} className="border-b border-border/60">
                            <td className="px-3 py-2 font-semibold text-foreground">{row.symbol}</td>
                            <td className="px-3 py-2 text-muted-foreground" colSpan={4}>
                              {row.error}
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={row.symbol} className="border-b border-border/60">
                          <td className="px-3 py-2 font-semibold text-foreground">{row.symbol}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`${regimeBadgeClass(row.regime)} inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]`}
                            >
                              {row.regime}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{row.stress ? "yes" : "no"}</td>
                          <td className="px-3 py-2 text-muted-foreground">{row.eligibility.eligible ? "yes" : "no"}</td>
                          <td className="px-3 py-2 text-muted-foreground">{formatBps(row.book?.spreadBps)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <details className="accordion">
                <summary>JSON (results)</summary>
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-border bg-background/60 p-4 text-xs text-foreground">
                  {JSON.stringify(screener.results, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </section>

        <section className="surface-card p-6 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">Config (locale)</h2>
              <p className="text-xs text-muted-foreground">Modifica JSON e salva su `config/*.json`</p>
            </div>
            <button
              type="button"
              className="btn-secondary px-4 py-2 text-xs"
              onClick={() => void loadConfigs()}
              disabled={loadingConfigs}
            >
              {loadingConfigs ? "Ricarico..." : "Reload"}
            </button>
          </div>

          {(configError || saveMessage) && (
            <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
              {configError ?? saveMessage}
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">regime.json</p>
                <button
                  type="button"
                  className="btn-primary px-3 py-1 text-[10px]"
                  onClick={() => void saveConfig("regime")}
                  disabled={saving !== null}
                >
                  {saving === "regime" ? "Saving..." : "Save"}
                </button>
              </div>
              <textarea
                className="h-[360px] w-full resize-none rounded-2xl border border-border bg-background/60 p-3 font-mono text-[11px] text-foreground"
                value={regimeConfigText}
                onChange={(e) => setRegimeConfigText(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">screener.json</p>
                <button
                  type="button"
                  className="btn-primary px-3 py-1 text-[10px]"
                  onClick={() => void saveConfig("screener")}
                  disabled={saving !== null}
                >
                  {saving === "screener" ? "Saving..." : "Save"}
                </button>
              </div>
              <textarea
                className="h-[360px] w-full resize-none rounded-2xl border border-border bg-background/60 p-3 font-mono text-[11px] text-foreground"
                value={screenerConfigText}
                onChange={(e) => setScreenerConfigText(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">symbols.json</p>
                <button
                  type="button"
                  className="btn-primary px-3 py-1 text-[10px]"
                  onClick={() => void saveConfig("symbols")}
                  disabled={saving !== null}
                >
                  {saving === "symbols" ? "Saving..." : "Save"}
                </button>
              </div>
              <textarea
                className="h-[360px] w-full resize-none rounded-2xl border border-border bg-background/60 p-3 font-mono text-[11px] text-foreground"
                value={symbolsConfigText}
                onChange={(e) => setSymbolsConfigText(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
