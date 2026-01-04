"use client";

import { useCallback, useEffect, useState } from "react";
import { AIAnalysis } from "./ai-analysis";

// Types
type Regime4h = "TREND" | "RANGE" | "TRANSITION";

type RegimeOutput = {
  regime: Regime4h;
  stress: boolean;
  metrics: {
    atr14: number;
    ema20: number;
    ema50: number;
    ema200: number;
    trendStrength: number;
    rangeRatio: number;
  };
  allowedSetups: string[];
  forbiddenSetups: string[];
  reasonCode: string;
};

type UniverseCandidate = {
  symbol: string;
  side: "LONG" | "SHORT";
  scores: {
    total: number;
    tradeability: number;
    regimeMatch: number;
  };
  htf: {
    price: number;
    regime: Regime4h;
    stress: boolean;
  };
  ws: {
    spreadBpsNow: number;
    lastUpdateAgeSec: number;
  };
  reasons: {
    blocks: string[];
    warnings: string[];
    info: string[];
  };
};

type UniverseData = {
  meta: {
    ts: number;
    source: "rest" | "rest+ws";
    anchorSymbol: string;
    topN: number;
  };
  market: {
    anchor: {
      symbol: string;
      regime4h: RegimeOutput | null;
      bias: "BULL" | "BEAR" | "NEUTRAL";
    };
  };
  long: UniverseCandidate[];
  short: UniverseCandidate[];
};

// Utility functions
function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function formatBps(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}bps`;
}

function getRegimeColor(regime: Regime4h): string {
  switch (regime) {
    case "TREND": return "text-green-600 bg-green-50 border-green-200";
    case "RANGE": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "TRANSITION": return "text-gray-600 bg-gray-50 border-gray-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 font-semibold";
  if (score >= 60) return "text-yellow-600 font-medium";
  return "text-gray-600";
}

// Components
function RegimeCard({ regime }: { regime: RegimeOutput | null }) {
  if (!regime) {
    return (
      <div className="rounded border border-border/50 bg-muted/30 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Regime</p>
        <p className="mt-2 text-sm text-muted-foreground">Nessun dato disponibile</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-border/50 bg-background p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Regime 4H</p>
      
      <div className="mt-3 flex items-center gap-3">
        <span className={`inline-flex rounded px-2 py-1 text-xs font-medium border ${getRegimeColor(regime.regime)}`}>
          {regime.regime}
        </span>
        {regime.stress && (
          <span className="inline-flex rounded px-2 py-1 text-xs font-medium border text-red-600 bg-red-50 border-red-200">
            STRESS
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground">Trend Strength:</span>
          <span className="ml-2 font-medium">{formatNumber(regime.metrics.trendStrength)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Range Ratio:</span>
          <span className="ml-2 font-medium">{formatNumber(regime.metrics.rangeRatio)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">ATR14:</span>
          <span className="ml-2 font-medium">{formatNumber(regime.metrics.atr14)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">EMA State:</span>
          <span className="ml-2 font-medium text-xs">{regime.metrics.ema20 > regime.metrics.ema50 ? "↗" : "↘"}</span>
        </div>
      </div>

      <div className="mt-4 text-xs">
        <p className="text-muted-foreground">Setups consentiti:</p>
        <p className="mt-1 font-medium">{regime.allowedSetups.join(", ") || "Nessuno"}</p>
      </div>

      <div className="mt-2 text-xs">
        <p className="text-muted-foreground">Reason:</p>
        <p className="mt-1 text-muted-foreground">{regime.reasonCode}</p>
      </div>
    </div>
  );
}

function CandidateRow({ candidate, onSelect }: { candidate: UniverseCandidate; onSelect: (symbol: string) => void }) {
  return (
    <tr className="border-b border-border/30 hover:bg-muted/20">
      <td className="px-3 py-2">
        <button
          onClick={() => onSelect(candidate.symbol)}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {candidate.symbol}
        </button>
        <div className="text-xs text-muted-foreground">
          ${formatNumber(candidate.htf.price)}
        </div>
      </td>
      <td className="px-3 py-2 text-center">
        <span className={`inline-flex rounded px-2 py-1 text-xs font-medium border ${getRegimeColor(candidate.htf.regime)}`}>
          {candidate.htf.regime}
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        <span className={`text-sm ${getScoreColor(candidate.scores.total)}`}>
          {candidate.scores.total}
        </span>
        <div className="text-xs text-muted-foreground">
          T:{candidate.scores.tradeability} R:{candidate.scores.regimeMatch}
        </div>
      </td>
      <td className="px-3 py-2 text-center text-xs">
        <div>{formatBps(candidate.ws.spreadBpsNow)}</div>
        <div className="text-muted-foreground">{candidate.ws.lastUpdateAgeSec.toFixed(0)}s</div>
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {candidate.reasons.blocks.slice(0, 2).map((reason, i) => (
            <span key={i} className="inline-flex rounded px-1 py-0.5 text-xs bg-red-100 text-red-700 border border-red-200">
              {reason}
            </span>
          ))}
          {candidate.reasons.warnings.slice(0, 2).map((reason, i) => (
            <span key={i} className="inline-flex rounded px-1 py-0.5 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200">
              {reason}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}

function UniverseSection({ universe, onSymbolSelect }: { universe: UniverseData | null; onSymbolSelect: (symbol: string) => void }) {
  if (!universe) {
    return (
      <div className="rounded border border-border/50 bg-muted/30 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Universe</p>
        <p className="mt-2 text-sm text-muted-foreground">Nessun dato disponibile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded border border-border/50 bg-background p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Universe</p>
            <p className="mt-1 text-sm font-medium">
              Anchor: {universe.market.anchor.symbol} ({universe.market.anchor.bias})
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>Source: {universe.meta.source}</div>
            <div>Updated: {new Date(universe.meta.ts).toLocaleTimeString()}</div>
            <div>Top {universe.meta.topN}</div>
          </div>
        </div>
      </div>

      {/* Long Candidates */}
      <div className="rounded border border-border/50 bg-background">
        <div className="border-b border-border/50 px-5 py-3">
          <h3 className="text-sm font-medium text-foreground">Long Candidates ({universe.long.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Symbol</th>
                <th className="px-3 py-2 text-center font-medium text-muted-foreground">Regime</th>
                <th className="px-3 py-2 text-center font-medium text-muted-foreground">Score</th>
                <th className="px-3 py-2 text-center font-medium text-muted-foreground">Spread</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Issues</th>
              </tr>
            </thead>
            <tbody>
              {universe.long.map((candidate) => (
                <CandidateRow key={candidate.symbol} candidate={candidate} onSelect={onSymbolSelect} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Short Candidates */}
      <div className="rounded border border-border/50 bg-background">
        <div className="border-b border-border/50 px-5 py-3">
          <h3 className="text-sm font-medium text-foreground">Short Candidates ({universe.short.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Symbol</th>
                <th className="px-3 py-2 text-center font-medium text-muted-foreground">Regime</th>
                <th className="px-3 py-2 text-center font-medium text-muted-foreground">Score</th>
                <th className="px-3 py-2 text-center font-medium text-muted-foreground">Spread</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Issues</th>
              </tr>
            </thead>
            <tbody>
              {universe.short.map((candidate) => (
                <CandidateRow key={candidate.symbol} candidate={candidate} onSelect={onSymbolSelect} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main Component
export function DashboardClientV2() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [universe, setUniverse] = useState<UniverseData | null>(null);
  const [regime, setRegime] = useState<RegimeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load universe data
      const universeUrl = new URL("/api/trading/universe", window.location.origin);
      universeUrl.searchParams.set("anchor", symbol);
      universeUrl.searchParams.set("topN", "10");
      
      const universeRes = await fetch(universeUrl.toString());
      if (!universeRes.ok) throw new Error("Failed to load universe data");
      
      const universeData = await universeRes.json();
      setUniverse(universeData);
      
      // Extract regime from anchor
      if (universeData.market?.anchor?.regime4h) {
        setRegime(universeData.market.anchor.regime4h);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const handleSymbolSelect = useCallback((newSymbol: string) => {
    setSymbol(newSymbol);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const aiData = regime && universe ? { symbol, regime, universe } : null;

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded border border-border/50 bg-background p-5">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Anchor Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
              placeholder="BTCUSDT"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Regime Analysis */}
        <div className="lg:col-span-1 space-y-6">
          <RegimeCard regime={regime} />
          <AIAnalysis data={aiData} />
        </div>

        {/* Universe Data */}
        <div className="lg:col-span-2">
          <UniverseSection universe={universe} onSymbolSelect={handleSymbolSelect} />
        </div>
      </div>

      {/* Raw Data (Collapsible) */}
      <details className="rounded border border-border/50 bg-muted/30">
        <summary className="cursor-pointer p-4 text-sm font-medium">
          Raw Data (Debug)
        </summary>
        <div className="border-t border-border/50 p-4">
          <pre className="overflow-auto text-xs text-muted-foreground">
            {JSON.stringify({ regime, universe }, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}