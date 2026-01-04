"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, StatCard } from "@/components/dashboard/card";
import { OverviewIcon, UniverseIcon, RegimeIcon, RefreshIcon } from "@/components/icons/dashboard-icons";
import { AIAnalysis } from "./ai-analysis";

// Types (same as before)
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

function getRegimeBadge(regime: Regime4h) {
  const styles = {
    TREND: "bg-status-ok/20 text-status-ok border-status-ok/30",
    RANGE: "bg-status-attention/20 text-status-attention border-status-attention/30", 
    TRANSITION: "bg-muted/30 text-muted-foreground border-border/50"
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${styles[regime]}`}>
      {regime}
    </span>
  );
}

// Components
function RegimeWidget({ regime }: { regime: RegimeOutput | null }) {
  if (!regime) {
    return (
      <Card title="Market Regime" loading={true}>
        <div></div>
      </Card>
    );
  }

  return (
    <Card 
      title="Market Regime" 
      subtitle="4H timeframe analysis"
      actions={
        <div className="flex items-center space-x-2">
          {getRegimeBadge(regime.regime)}
          {regime.stress && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-status-risk/20 text-status-risk border border-status-risk/30">
              STRESS
            </span>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Trend Strength</p>
            <p className="text-lg font-semibold text-foreground">{formatNumber(regime.metrics.trendStrength)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Range Ratio</p>
            <p className="text-lg font-semibold text-foreground">{formatNumber(regime.metrics.rangeRatio)}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ATR14</p>
            <p className="text-lg font-semibold text-foreground">{formatNumber(regime.metrics.atr14)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">EMA Alignment</p>
            <p className="text-lg font-semibold text-foreground">
              {regime.metrics.ema20 > regime.metrics.ema50 ? "Bullish ↗" : "Bearish ↘"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Allowed Setups</p>
            <p className="text-sm font-medium text-foreground break-words">{regime.allowedSetups.join(", ") || "None"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Reason</p>
            <p className="text-xs text-muted-foreground break-all">{regime.reasonCode}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function UniverseTable({ candidates, title }: { candidates: UniverseCandidate[]; title: string }) {
  return (
    <Card title={title} subtitle={`${candidates.length} candidates`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/30">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Regime</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Spread</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border/30">
            {candidates.slice(0, 5).map((candidate) => (
              <tr key={candidate.symbol} className="hover:bg-muted/20 transition-subtle">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{candidate.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">${formatNumber(candidate.htf.price)}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getRegimeBadge(candidate.htf.regime)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{candidate.scores.total}</div>
                  <div className="text-xs text-muted-foreground">T:{candidate.scores.tradeability} R:{candidate.scores.regimeMatch}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatBps(candidate.ws.spreadBpsNow)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 max-w-32">
                    {candidate.reasons.blocks.slice(0, 1).map((reason, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-status-risk/20 text-status-risk border border-status-risk/30 truncate max-w-20" title={reason}>
                        {reason.length > 8 ? reason.substring(0, 8) + '...' : reason}
                      </span>
                    ))}
                    {candidate.reasons.warnings.slice(0, 1).map((reason, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-status-attention/20 text-status-attention border border-status-attention/30 truncate max-w-20" title={reason}>
                        {reason.length > 8 ? reason.substring(0, 8) + '...' : reason}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Main Component
export function ModernDashboard() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [universe, setUniverse] = useState<UniverseData | null>(null);
  const [regime, setRegime] = useState<RegimeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const universeUrl = new URL("/api/trading/universe", window.location.origin);
      universeUrl.searchParams.set("anchor", symbol);
      universeUrl.searchParams.set("topN", "10");
      
      const universeRes = await fetch(universeUrl.toString());
      if (!universeRes.ok) throw new Error("Failed to load universe data");
      
      const universeData = await universeRes.json();
      setUniverse(universeData);
      
      if (universeData.market?.anchor?.regime4h) {
        setRegime(universeData.market.anchor.regime4h);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const aiData = regime && universe ? { symbol, regime, universe } : null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card title="Market Controls" subtitle="Configurazione simbolo di riferimento">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Anchor Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-border/50 rounded bg-background focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-subtle"
              placeholder="BTCUSDT"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-border/50 text-sm font-medium rounded text-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-subtle"
            >
              <RefreshIcon size={16} className="mr-2" />
              {loading ? "Loading..." : "Aggiorna Dati"}
            </button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="rounded border border-status-risk/30 bg-status-risk/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-status-risk">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-status-risk">Error</h3>
              <div className="mt-2 text-sm text-status-risk">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {universe && (
        <div id="universe" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Anchor Symbol"
            value={universe.market.anchor.symbol}
            change={universe.market.anchor.bias}
            changeType={universe.market.anchor.bias === "BULL" ? "positive" : universe.market.anchor.bias === "BEAR" ? "negative" : "neutral"}
            icon={<OverviewIcon size={20} className="text-muted-foreground" />}
          />
          <StatCard
            title="Long Candidates"
            value={universe.long.length}
            icon={<RegimeIcon size={20} className="text-status-ok" />}
          />
          <StatCard
            title="Short Candidates"
            value={universe.short.length}
            icon={<RegimeIcon size={20} className="text-status-risk rotate-180" />}
          />
          <StatCard
            title="Data Source"
            value={universe.meta.source.toUpperCase()}
            change={`Updated ${new Date(universe.meta.ts).toLocaleTimeString()}`}
            icon={<UniverseIcon size={20} className="text-muted-foreground" />}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Regime Analysis */}
        <div id="regime" className="lg:col-span-1">
          <RegimeWidget regime={regime} />
        </div>

        {/* AI Analysis */}
        <div id="ai" className="lg:col-span-2">
          <AIAnalysis data={aiData} />
        </div>
      </div>

      {/* Universe Tables */}
      {universe && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UniverseTable candidates={universe.long} title="Long Opportunities" />
          <UniverseTable candidates={universe.short} title="Short Opportunities" />
        </div>
      )}
    </div>
  );
}