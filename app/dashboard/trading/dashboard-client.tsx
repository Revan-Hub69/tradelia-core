"use client";

import type { RegimeConfig } from "@/engines/regime4h";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type ScreenerConfig = {
  version: "screener-v1";
  filters: {
    excludeTransition: boolean;
    excludeStress: boolean;
    maxSpreadBps: number;
    minQuoteVolume24h: number;
  };
};

type SymbolsConfig = {
  version: "symbols-v1";
  symbols: string[];
};

type RegimeConfigForm = {
  version: RegimeConfig["version"];
  windows: {
    atr14: string;
    ema20: string;
    ema50: string;
    ema200: string;
    returnsStd20: string;
    rangeHHLL50: string;
  };
  thresholds: {
    stressTrueRangeToAtr: string;
    enterTrend: { trendStrengthMin: string; rangeRatioMin: string };
    exitTrend: { trendStrengthMin: string; rangeRatioMin: string };
    enterRange: { trendStrengthMax: string; rangeRatioMin: string };
    exitRange: { trendStrengthMax: string; rangeRatioMin: string };
  };
};

type ScreenerConfigForm = {
  version: ScreenerConfig["version"];
  filters: {
    excludeTransition: boolean;
    excludeStress: boolean;
    maxSpreadBps: string;
    minQuoteVolume24h: string;
  };
};

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

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

async function writeClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function normalizeSymbol(value: string) {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z0-9]{5,20}$/.test(normalized)) return null;
  return normalized;
}

function normalizeSymbols(values: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const entry of values) {
    if (typeof entry !== "string") continue;
    const symbol = normalizeSymbol(entry);
    if (!symbol) continue;
    if (seen.has(symbol)) continue;
    seen.add(symbol);
    out.push(symbol);
  }
  return out;
}

function splitSymbols(text: string) {
  return normalizeSymbols(text.split(/[\s,]+/g));
}

function parseFiniteNumber(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePositiveInt(value: string, label: string) {
  const parsed = parseFiniteNumber(value);
  if (parsed === null || !Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} deve essere un intero > 0.`);
  }
  return parsed;
}

function parsePositiveNumber(value: string, label: string) {
  const parsed = parseFiniteNumber(value);
  if (parsed === null || parsed <= 0) {
    throw new Error(`${label} deve essere un numero > 0.`);
  }
  return parsed;
}

function parseNonNegativeNumber(value: string, label: string) {
  const parsed = parseFiniteNumber(value);
  if (parsed === null || parsed < 0) {
    throw new Error(`${label} deve essere un numero ≥ 0.`);
  }
  return parsed;
}

function regimeConfigToForm(config: RegimeConfig): RegimeConfigForm {
  return {
    version: config.version,
    windows: {
      atr14: String(config.windows.atr14),
      ema20: String(config.windows.ema20),
      ema50: String(config.windows.ema50),
      ema200: String(config.windows.ema200),
      returnsStd20: String(config.windows.returnsStd20),
      rangeHHLL50: String(config.windows.rangeHHLL50),
    },
    thresholds: {
      stressTrueRangeToAtr: String(config.thresholds.stressTrueRangeToAtr),
      enterTrend: {
        trendStrengthMin: String(config.thresholds.enterTrend.trendStrengthMin),
        rangeRatioMin: String(config.thresholds.enterTrend.rangeRatioMin),
      },
      exitTrend: {
        trendStrengthMin: String(config.thresholds.exitTrend.trendStrengthMin),
        rangeRatioMin: String(config.thresholds.exitTrend.rangeRatioMin),
      },
      enterRange: {
        trendStrengthMax: String(config.thresholds.enterRange.trendStrengthMax),
        rangeRatioMin: String(config.thresholds.enterRange.rangeRatioMin),
      },
      exitRange: {
        trendStrengthMax: String(config.thresholds.exitRange.trendStrengthMax),
        rangeRatioMin: String(config.thresholds.exitRange.rangeRatioMin),
      },
    },
  };
}

function screenerConfigToForm(config: ScreenerConfig): ScreenerConfigForm {
  return {
    version: config.version,
    filters: {
      excludeTransition: config.filters.excludeTransition,
      excludeStress: config.filters.excludeStress,
      maxSpreadBps: String(config.filters.maxSpreadBps),
      minQuoteVolume24h: String(config.filters.minQuoteVolume24h),
    },
  };
}

function parseRegimeConfigForm(form: RegimeConfigForm | null): ParseResult<RegimeConfig> {
  if (!form) return { ok: false, error: "Config regime non caricata." };
  try {
    return {
      ok: true,
      value: {
        version: "regime-4h-config-v1",
        windows: {
          atr14: parsePositiveInt(form.windows.atr14, "ATR14 window"),
          ema20: parsePositiveInt(form.windows.ema20, "EMA20 window"),
          ema50: parsePositiveInt(form.windows.ema50, "EMA50 window"),
          ema200: parsePositiveInt(form.windows.ema200, "EMA200 window"),
          returnsStd20: parsePositiveInt(form.windows.returnsStd20, "returnsStd20 window"),
          rangeHHLL50: parsePositiveInt(form.windows.rangeHHLL50, "rangeHHLL50 window"),
        },
        thresholds: {
          stressTrueRangeToAtr: parsePositiveNumber(form.thresholds.stressTrueRangeToAtr, "stressTrueRangeToAtr"),
          enterTrend: {
            trendStrengthMin: parsePositiveNumber(form.thresholds.enterTrend.trendStrengthMin, "enterTrend.trendStrengthMin"),
            rangeRatioMin: parsePositiveNumber(form.thresholds.enterTrend.rangeRatioMin, "enterTrend.rangeRatioMin"),
          },
          exitTrend: {
            trendStrengthMin: parsePositiveNumber(form.thresholds.exitTrend.trendStrengthMin, "exitTrend.trendStrengthMin"),
            rangeRatioMin: parsePositiveNumber(form.thresholds.exitTrend.rangeRatioMin, "exitTrend.rangeRatioMin"),
          },
          enterRange: {
            trendStrengthMax: parsePositiveNumber(form.thresholds.enterRange.trendStrengthMax, "enterRange.trendStrengthMax"),
            rangeRatioMin: parsePositiveNumber(form.thresholds.enterRange.rangeRatioMin, "enterRange.rangeRatioMin"),
          },
          exitRange: {
            trendStrengthMax: parsePositiveNumber(form.thresholds.exitRange.trendStrengthMax, "exitRange.trendStrengthMax"),
            rangeRatioMin: parsePositiveNumber(form.thresholds.exitRange.rangeRatioMin, "exitRange.rangeRatioMin"),
          },
        },
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Config regime non valida.";
    return { ok: false, error: message };
  }
}

function parseScreenerConfigForm(form: ScreenerConfigForm | null): ParseResult<ScreenerConfig> {
  if (!form) return { ok: false, error: "Config screener non caricata." };
  try {
    return {
      ok: true,
      value: {
        version: "screener-v1",
        filters: {
          excludeTransition: form.filters.excludeTransition,
          excludeStress: form.filters.excludeStress,
          maxSpreadBps: parsePositiveNumber(form.filters.maxSpreadBps, "maxSpreadBps"),
          minQuoteVolume24h: parseNonNegativeNumber(form.filters.minQuoteVolume24h, "minQuoteVolume24h"),
        },
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Config screener non valida.";
    return { ok: false, error: message };
  }
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

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [regimeForm, setRegimeForm] = useState<RegimeConfigForm | null>(null);
  const [screenerForm, setScreenerForm] = useState<ScreenerConfigForm | null>(null);
  const [symbolsConfig, setSymbolsConfig] = useState<SymbolsConfig | null>(null);

  const [symbolToAdd, setSymbolToAdd] = useState("");
  const [symbolsBulk, setSymbolsBulk] = useState("");

  const [saving, setSaving] = useState<null | "regime" | "screener" | "symbols">(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const settingsCloseRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const normalizedSymbol = useMemo(() => symbol.trim().toUpperCase(), [symbol]);

  const showCopyNotice = useCallback((message: string) => {
    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }
    setCopyNotice(message);
    copyTimerRef.current = window.setTimeout(() => setCopyNotice(null), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const copyText = useCallback(
    async (label: string, text: string) => {
      try {
        await writeClipboard(text);
        showCopyNotice(`${label} copiato`);
      } catch {
        showCopyNotice("Copia fallita");
      }
    },
    [showCopyNotice],
  );

  const openSettings = useCallback(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => settingsCloseRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [settingsOpen]);

  const parsedRegimeConfig = useMemo(() => parseRegimeConfigForm(regimeForm), [regimeForm]);
  const parsedScreenerConfig = useMemo(() => parseScreenerConfigForm(screenerForm), [screenerForm]);

  const aiPacket = useMemo(() => {
    const configs = {
      regime: parsedRegimeConfig.ok ? parsedRegimeConfig.value : null,
      screener: parsedScreenerConfig.ok ? parsedScreenerConfig.value : null,
      symbols: symbolsConfig,
    };

    const screenerTop = screener?.results ? screener.results.slice(0, 25) : null;

    return {
      version: "tradelia-ai-packet-v1",
      asOf: Date.now(),
      symbol: normalizedSymbol,
      regime4h: regime?.regime ?? null,
      screener: screener ? { asOf: screener.asOf, top: screenerTop } : null,
      configs,
      instruction:
        "Usa solo questi dati. Non calcolare indicatori. Tratta regime4h.regime come gate (TREND/RANGE/TRANSITION) e rispetta allowedSetups/forbiddenSetups.",
    };
  }, [normalizedSymbol, regime, screener, parsedRegimeConfig, parsedScreenerConfig, symbolsConfig]);

  const aiPrompt = useMemo(() => {
    return [
      "Sei un assistente di trading. Rispondi SOLO in JSON.",
      "Non inventare dati mancanti. Non calcolare indicatori.",
      "",
      "INPUT:",
      JSON.stringify(aiPacket, null, 2),
    ].join("\n");
  }, [aiPacket]);

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

      setRegimeForm(regimeConfigToForm(regimeJson as RegimeConfig));
      setScreenerForm(screenerConfigToForm(screenerJson as ScreenerConfig));

      if (!isPlainObject(symbolsJson)) throw new Error("Invalid symbols config.");
      if (symbolsJson.version !== "symbols-v1") throw new Error("Invalid symbols config version.");
      if (!Array.isArray(symbolsJson.symbols)) throw new Error("Invalid symbols config.symbols.");

      const normalized = normalizeSymbols(symbolsJson.symbols);
      if (normalized.length === 0) throw new Error("symbols.json must include at least one valid symbol.");
      setSymbolsConfig({ version: "symbols-v1", symbols: normalized });
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : "Failed to load configs.");
    } finally {
      setLoadingConfigs(false);
    }
  }, []);

  const runRegime = useCallback(async (symbolOverride?: string) => {
    setLoadingRegime(true);
    setRegimeError(null);

    try {
      const requestedSymbol = symbolOverride ? (normalizeSymbol(symbolOverride) ?? normalizedSymbol) : normalizedSymbol;
      const url = new URL("/api/trading/regime", window.location.origin);
      url.searchParams.set("symbol", requestedSymbol);
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

  const saveConfig = useCallback(async (which: "regime" | "screener" | "symbols", value: unknown) => {
    setSaving(which);
    setSaveMessage(null);
    setConfigError(null);

    const endpoint =
      which === "regime"
        ? "/api/trading/config/regime"
        : which === "screener"
          ? "/api/trading/config/screener"
          : "/api/trading/config/symbols";

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const data = (await res.json().catch(() => ({}))) as unknown;
      if (!res.ok) throw new Error(inferErrorMessage(data, "Save failed."));

      if (which === "regime") {
        setRegimeForm(regimeConfigToForm(data as RegimeConfig));
      }

      if (which === "screener") {
        setScreenerForm(screenerConfigToForm(data as ScreenerConfig));
      }

      if (which === "symbols") {
        if (!isPlainObject(data)) throw new Error("Invalid symbols config.");
        if (data.version !== "symbols-v1") throw new Error("Invalid symbols config version.");
        if (!Array.isArray(data.symbols)) throw new Error("Invalid symbols config.symbols.");

        const normalized = normalizeSymbols(data.symbols);
        if (normalized.length === 0) throw new Error("symbols.json must include at least one valid symbol.");
        setSymbolsConfig({ version: "symbols-v1", symbols: normalized });
        setSymbolToAdd("");
        setSymbolsBulk("");
      }

      setSaveMessage("Salvato.");
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(null);
    }
  }, []);

  useEffect(() => {
    void loadConfigs();
  }, [loadConfigs]);

  useEffect(() => {
    void runRegime();
  }, [runRegime]);

  const screenerStats = useMemo(() => {
    if (!screener) return null;
    let okCount = 0;
    let eligibleCount = 0;
    let errorCount = 0;

    for (const row of screener.results) {
      if (!row.ok) {
        errorCount += 1;
        continue;
      }
      okCount += 1;
      if (row.eligibility.eligible) eligibleCount += 1;
    }

    return { total: screener.results.length, ok: okCount, eligible: eligibleCount, errors: errorCount };
  }, [screener]);

  const handleSaveRegime = useCallback(() => {
    if (!parsedRegimeConfig.ok) {
      setConfigError(parsedRegimeConfig.error);
      return;
    }
    void saveConfig("regime", parsedRegimeConfig.value);
  }, [parsedRegimeConfig, saveConfig]);

  const handleSaveScreener = useCallback(() => {
    if (!parsedScreenerConfig.ok) {
      setConfigError(parsedScreenerConfig.error);
      return;
    }
    void saveConfig("screener", parsedScreenerConfig.value);
  }, [parsedScreenerConfig, saveConfig]);

  const handleSaveSymbols = useCallback(() => {
    if (!symbolsConfig) {
      setConfigError("Config simboli non caricata.");
      return;
    }
    const normalized = normalizeSymbols(symbolsConfig.symbols);
    if (normalized.length === 0) {
      setConfigError("La watchlist deve contenere almeno un simbolo valido.");
      return;
    }
    void saveConfig("symbols", { version: "symbols-v1", symbols: normalized });
  }, [symbolsConfig, saveConfig]);

  const handleAddSymbol = useCallback(() => {
    const next = normalizeSymbol(symbolToAdd);
    if (!next) {
      setConfigError("Simbolo non valido (es: BTCUSDT).");
      return;
    }
    setSymbolsConfig((current) => {
      const existing = current?.symbols ?? [];
      const merged = normalizeSymbols([...existing, next]);
      return { version: "symbols-v1", symbols: merged.length > 0 ? merged : [next] };
    });
    setSymbolToAdd("");
  }, [symbolToAdd]);

  const handleImportSymbols = useCallback(() => {
    const incoming = splitSymbols(symbolsBulk);
    if (incoming.length === 0) {
      setConfigError("Nessun simbolo valido da importare.");
      return;
    }
    setSymbolsConfig((current) => {
      const existing = current?.symbols ?? [];
      const merged = normalizeSymbols([...existing, ...incoming]);
      return { version: "symbols-v1", symbols: merged.length > 0 ? merged : incoming };
    });
    setSymbolsBulk("");
  }, [symbolsBulk]);

  const handleRemoveSymbol = useCallback((symbolToRemove: string) => {
    setSymbolsConfig((current) => {
      if (!current) return current;
      if (current.symbols.length <= 1) return current;
      const next = current.symbols.filter((symbolEntry) => symbolEntry !== symbolToRemove);
      return next.length === 0 ? current : { ...current, symbols: next };
    });
  }, []);

  return (
    <div className="space-y-10">
      <div className="surface-card p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Workspace locale</p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Config e stato sono salvati su filesystem (consigliato: locale/VPS). In produzione su serverless non è
              affidabile.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {copyNotice && (
              <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-foreground">
                {copyNotice}
              </span>
            )}
            <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={openSettings} aria-haspopup="dialog">
              Impostazioni
            </button>
            <button
              type="button"
              className="btn-primary px-4 py-2 text-xs"
              onClick={() => void copyText("Prompt AI", aiPrompt)}
            >
              Copia prompt AI
            </button>
            <button
              type="button"
              className="btn-secondary px-4 py-2 text-xs"
              onClick={() => void copyText("JSON AI", JSON.stringify(aiPacket, null, 2))}
            >
              Copia JSON AI
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="surface-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">Regime 4h (deterministico)</h2>
              <p className="text-xs text-muted-foreground">Gate architetturale: TREND / RANGE / TRANSITION</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs"
                onClick={() => void copyText("Regime 4h", JSON.stringify(regime?.regime ?? null, null, 2))}
                disabled={!regime}
              >
                Copia JSON
              </button>
              <button
                type="button"
                className="btn-primary px-4 py-2 text-xs"
                onClick={() => void runRegime()}
                disabled={loadingRegime}
              >
                {loadingRegime ? "Calcolo..." : "Ricalcola"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
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

              <div className="grid gap-6 sm:grid-cols-2">
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
                <pre className="mt-4 max-h-[460px] overflow-auto rounded-2xl border border-border bg-background/60 p-5 text-xs text-foreground">
                  {JSON.stringify(regime.regime, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </section>

        <section className="surface-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">Screener (watchlist)</h2>
              <p className="text-xs text-muted-foreground">Filtra per regime + spread + volume</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs"
                onClick={() => void copyText("Screener", JSON.stringify(screener?.results ?? null, null, 2))}
                disabled={!screener}
              >
                Copia JSON
              </button>
              <button
                type="button"
                className="btn-primary px-4 py-2 text-xs"
                onClick={() => void runScreener()}
                disabled={loadingScreener}
              >
                {loadingScreener ? "Scansiono..." : "Scansiona"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">asOf: {new Date(screener.asOf).toLocaleString()}</p>
                {screenerStats && (
                  <p className="text-xs text-muted-foreground">
                    eligible: {screenerStats.eligible}/{screenerStats.total} | errors: {screenerStats.errors}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Tip: clicca un symbol per usarlo nel Regime.</p>

              <div className="max-h-[560px] overflow-auto rounded-2xl border border-border">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 font-semibold text-muted-foreground">Symbol</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">Regime</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">Stress</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">Eligible</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">Spread</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screener.results.map((row) => {
                      if (!row.ok) {
                        return (
                          <tr key={row.symbol} className="border-b border-border/60">
                            <td className="px-4 py-3 font-semibold text-foreground">{row.symbol}</td>
                            <td className="px-4 py-3 text-muted-foreground" colSpan={4}>
                              {row.error}
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={row.symbol}
                          className={`border-b border-border/60 ${row.eligibility.eligible ? "bg-muted/10" : ""} hover:bg-muted/20`}
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              className="transition-subtle font-semibold text-foreground hover:text-primary"
                              onClick={() => {
                                setSymbol(row.symbol);
                                void runRegime(row.symbol);
                              }}
                            >
                              {row.symbol}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`${regimeBadgeClass(row.regime)} inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]`}
                            >
                              {row.regime}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{row.stress ? "yes" : "no"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.eligibility.eligible ? "yes" : "no"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatBps(row.book?.spreadBps)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <details className="accordion">
                <summary>JSON (results)</summary>
                <pre className="mt-4 max-h-[460px] overflow-auto rounded-2xl border border-border bg-background/60 p-5 text-xs text-foreground">
                  {JSON.stringify(screener.results, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </section>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="trading-settings-title">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeSettings} />

          <div className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-border bg-background shadow-2xl">
            <div className="flex h-full flex-col" onClick={(event) => event.stopPropagation()}>
              <header className="flex items-start justify-between gap-4 border-b border-border p-6">
                <div className="space-y-1">
                  <h2 id="trading-settings-title" className="text-base font-semibold text-foreground">
                    Impostazioni
                  </h2>
                  <p className="text-xs text-muted-foreground">Soglie, filtri e watchlist (local-first).</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-xs"
                    onClick={() => void loadConfigs()}
                    disabled={loadingConfigs}
                  >
                    {loadingConfigs ? "Ricarico..." : "Ricarica"}
                  </button>
                  <button
                    ref={settingsCloseRef}
                    type="button"
                    className="btn-secondary px-3 py-2 text-xs"
                    onClick={closeSettings}
                  >
                    Chiudi
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-auto p-6">
                {(configError || saveMessage) && (
                  <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-foreground">
                    {configError ?? saveMessage}
                  </div>
                )}

                <div className="space-y-10">
                  <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">Regime 4h</h3>
                          <p className="text-xs text-muted-foreground">Soglie ENTER/EXIT + stress.</p>
                          {regimeForm && !parsedRegimeConfig.ok && (
                            <p className="text-xs text-muted-foreground">Errore: {parsedRegimeConfig.error}</p>
                          )}
                          {!regimeForm && loadingConfigs && <p className="text-xs text-muted-foreground">Caricamento...</p>}
                          {!regimeForm && !loadingConfigs && (
                            <p className="text-xs text-muted-foreground">Config regime non caricata.</p>
                          )}
                        </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="btn-secondary px-4 py-2 text-xs"
                          onClick={() =>
                            void copyText(
                              "regime.json",
                              JSON.stringify(parsedRegimeConfig.ok ? parsedRegimeConfig.value : null, null, 2),
                            )
                          }
                          disabled={!parsedRegimeConfig.ok}
                        >
                          Copia JSON
                        </button>
                        <button
                          type="button"
                          className="btn-primary px-4 py-2 text-xs"
                          onClick={handleSaveRegime}
                          disabled={saving !== null || !parsedRegimeConfig.ok}
                        >
                          {saving === "regime" ? "Salvo..." : "Salva"}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          stress TR/ATR ≥
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.stressTrueRangeToAtr ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: { ...current.thresholds, stressTrueRangeToAtr: event.target.value },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          enter TREND · trendStrength ≥
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.enterTrend.trendStrengthMin ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      enterTrend: { ...current.thresholds.enterTrend, trendStrengthMin: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          enter TREND · rangeRatio ≥
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.enterTrend.rangeRatioMin ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      enterTrend: { ...current.thresholds.enterTrend, rangeRatioMin: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          exit TREND · trendStrength &lt;
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.exitTrend.trendStrengthMin ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      exitTrend: { ...current.thresholds.exitTrend, trendStrengthMin: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          exit TREND · rangeRatio &lt;
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.exitTrend.rangeRatioMin ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      exitTrend: { ...current.thresholds.exitTrend, rangeRatioMin: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          enter RANGE · trendStrength ≤
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.enterRange.trendStrengthMax ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      enterRange: { ...current.thresholds.enterRange, trendStrengthMax: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          enter RANGE · rangeRatio ≥
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.enterRange.rangeRatioMin ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      enterRange: { ...current.thresholds.enterRange, rangeRatioMin: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          exit RANGE · trendStrength &gt;
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.exitRange.trendStrengthMax ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      exitRange: { ...current.thresholds.exitRange, trendStrengthMax: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          exit RANGE · rangeRatio &lt;
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={regimeForm?.thresholds.exitRange.rangeRatioMin ?? ""}
                          disabled={!regimeForm}
                          onChange={(event) =>
                            setRegimeForm((current) =>
                              current
                                ? {
                                    ...current,
                                    thresholds: {
                                      ...current.thresholds,
                                      exitRange: { ...current.thresholds.exitRange, rangeRatioMin: event.target.value },
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                      </label>
                    </div>

                    <details className="accordion">
                      <summary>Finestre (advanced)</summary>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            ATR
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={regimeForm?.windows.atr14 ?? ""}
                            disabled={!regimeForm}
                            onChange={(event) =>
                              setRegimeForm((current) =>
                                current ? { ...current, windows: { ...current.windows, atr14: event.target.value } } : current,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            EMA20
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={regimeForm?.windows.ema20 ?? ""}
                            disabled={!regimeForm}
                            onChange={(event) =>
                              setRegimeForm((current) =>
                                current ? { ...current, windows: { ...current.windows, ema20: event.target.value } } : current,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            EMA50
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={regimeForm?.windows.ema50 ?? ""}
                            disabled={!regimeForm}
                            onChange={(event) =>
                              setRegimeForm((current) =>
                                current ? { ...current, windows: { ...current.windows, ema50: event.target.value } } : current,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            EMA200
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={regimeForm?.windows.ema200 ?? ""}
                            disabled={!regimeForm}
                            onChange={(event) =>
                              setRegimeForm((current) =>
                                current ? { ...current, windows: { ...current.windows, ema200: event.target.value } } : current,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Std returns
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={regimeForm?.windows.returnsStd20 ?? ""}
                            disabled={!regimeForm}
                            onChange={(event) =>
                              setRegimeForm((current) =>
                                current
                                  ? { ...current, windows: { ...current.windows, returnsStd20: event.target.value } }
                                  : current,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            HH/LL window
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={regimeForm?.windows.rangeHHLL50 ?? ""}
                            disabled={!regimeForm}
                            onChange={(event) =>
                              setRegimeForm((current) =>
                                current
                                  ? { ...current, windows: { ...current.windows, rangeHHLL50: event.target.value } }
                                  : current,
                              )
                            }
                          />
                        </label>
                      </div>
                    </details>
                  </section>

                  <div className="surface-divider h-px w-full" />

                  <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">Screener</h3>
                        <p className="text-xs text-muted-foreground">Filtri liquidità/spread.</p>
                        {screenerForm && !parsedScreenerConfig.ok && (
                          <p className="text-xs text-muted-foreground">Errore: {parsedScreenerConfig.error}</p>
                        )}
                        {!screenerForm && loadingConfigs && <p className="text-xs text-muted-foreground">Caricamento...</p>}
                        {!screenerForm && !loadingConfigs && (
                          <p className="text-xs text-muted-foreground">Config screener non caricata.</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="btn-secondary px-4 py-2 text-xs"
                          onClick={() =>
                            void copyText(
                              "screener.json",
                              JSON.stringify(parsedScreenerConfig.ok ? parsedScreenerConfig.value : null, null, 2),
                            )
                          }
                          disabled={!parsedScreenerConfig.ok}
                        >
                          Copia JSON
                        </button>
                        <button
                          type="button"
                          className="btn-primary px-4 py-2 text-xs"
                          onClick={handleSaveScreener}
                          disabled={saving !== null || !parsedScreenerConfig.ok}
                        >
                          {saving === "screener" ? "Salvo..." : "Salva"}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={screenerForm?.filters.excludeTransition ?? false}
                          disabled={!screenerForm}
                          onChange={(event) =>
                            setScreenerForm((current) =>
                              current
                                ? {
                                    ...current,
                                    filters: { ...current.filters, excludeTransition: event.target.checked },
                                  }
                                : current,
                            )
                          }
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">Escludi TRANSITION</p>
                          <p className="text-xs text-muted-foreground">Mostra solo simboli in TREND o RANGE.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 p-4">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={screenerForm?.filters.excludeStress ?? false}
                          disabled={!screenerForm}
                          onChange={(event) =>
                            setScreenerForm((current) =>
                              current
                                ? {
                                    ...current,
                                    filters: { ...current.filters, excludeStress: event.target.checked },
                                  }
                                : current,
                            )
                          }
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">Escludi STRESS</p>
                          <p className="text-xs text-muted-foreground">Nasconde simboli in stress (trueRange/ATR alto).</p>
                        </div>
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            max spread (bps)
                          </span>
                          <input
                            type="number"
                            inputMode="decimal"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={screenerForm?.filters.maxSpreadBps ?? ""}
                            disabled={!screenerForm}
                            onChange={(event) =>
                              setScreenerForm((current) =>
                                current
                                  ? { ...current, filters: { ...current.filters, maxSpreadBps: event.target.value } }
                                  : current,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            min quote vol 24h
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={screenerForm?.filters.minQuoteVolume24h ?? ""}
                            disabled={!screenerForm}
                            onChange={(event) =>
                              setScreenerForm((current) =>
                                current
                                  ? { ...current, filters: { ...current.filters, minQuoteVolume24h: event.target.value } }
                                  : current,
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </section>

                  <div className="surface-divider h-px w-full" />

                  <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">Watchlist</h3>
                        <p className="text-xs text-muted-foreground">
                          Simboli scansionati dallo screener ({symbolsConfig?.symbols.length ?? 0}).
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="btn-secondary px-4 py-2 text-xs"
                          onClick={() => void copyText("symbols.json", JSON.stringify(symbolsConfig, null, 2))}
                          disabled={!symbolsConfig}
                        >
                          Copia JSON
                        </button>
                        <button
                          type="button"
                          className="btn-primary px-4 py-2 text-xs"
                          onClick={handleSaveSymbols}
                          disabled={saving !== null || !symbolsConfig || symbolsConfig.symbols.length === 0}
                        >
                          {saving === "symbols" ? "Salvo..." : "Salva"}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <label className="flex-1 space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            aggiungi symbol
                          </span>
                          <input
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={symbolToAdd}
                            onChange={(event) => setSymbolToAdd(event.target.value)}
                            placeholder="BTCUSDT"
                            spellCheck={false}
                          />
                        </label>
                        <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={handleAddSymbol}>
                          Aggiungi
                        </button>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <label className="flex-1 space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            importa (spazio / virgola / newline)
                          </span>
                          <input
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                            value={symbolsBulk}
                            onChange={(event) => setSymbolsBulk(event.target.value)}
                            placeholder="BTCUSDT, ETHUSDT, SOLUSDT"
                            spellCheck={false}
                          />
                        </label>
                        <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={handleImportSymbols}>
                          Importa
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(symbolsConfig?.symbols ?? []).map((sym) => {
                          const canRemove = (symbolsConfig?.symbols.length ?? 0) > 1;
                          return (
                            <span
                              key={sym}
                              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-foreground"
                            >
                              {sym}
                              <button
                                type="button"
                                className="transition-subtle text-muted-foreground hover:text-foreground disabled:opacity-50"
                                onClick={() => handleRemoveSymbol(sym)}
                                disabled={!canRemove}
                                aria-label={`Rimuovi ${sym}`}
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
