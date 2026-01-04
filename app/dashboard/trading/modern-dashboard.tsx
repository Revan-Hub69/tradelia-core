"use client";

import { useCallback, useEffect, useState } from "react";
import React from "react";
import { Card, StatCard } from "@/components/dashboard/card";
import { Drawer } from "@/components/dashboard/drawer";
import { EnhancedTable } from "@/components/dashboard/enhanced-table";
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

type WsHealth = "OK" | "DEGRADED" | "STALE";

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
  wsHealth?: {
    connected: boolean;
    health: WsHealth;
    lastMessageAgeSec: number;
    symbolCount: number;
  };
  long: UniverseCandidate[];
  short: UniverseCandidate[];
};

// Setup Engine Response Type (BRICK 3)
type SetupEngineResponse = {
  symbol: string;
  timestamp: number;
  status: "SETUP_FOUND" | "NO_SETUP" | "BLOCKED" | "REVIEW";
  setup: {
    setupId: string;
    setupType: string;
    direction: "LONG" | "SHORT";
    entry: { type: string; price: number; ttlSeconds: number };
    stop: { type: string; price: number; reasoning: string };
    targets: { primary: { price: number; reasoning: string }; secondary?: { price: number; reasoning: string } };
    riskReward: { ratio: number; riskBps: number; rewardBps: number };
    score: { total: number; confidence: string; contributions: Array<{ factor: string; contribution: number }> };
    evidence: Array<{ type: string; description: string; value: number }>;
  } | null;
  analysis: {
    regime: { type: string; strength: number; direction: string; stress: boolean };
    structure: { swingHigh: number; swingLow: number; nearestResistance: number; nearestSupport: number };
    l2Summary: { imbalance5bps: number; imbalance10bps: number; voidScore: number; liquidityStress: string };
    tapeSummary: { cvd5m: number; slope5m: number; aggressionRatio: number; divergence: boolean; exhaustion: boolean };
    gate: { status: string; whyNotTrade: string[]; passedGates: string[]; failedGates: string[] };
  };
  reasons: string[];
  meta: { wsConnected: boolean; wsHealth: string; tradesCount: number; depthLevels: number };
};

// Utility functions
function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function _formatBps(value: number | null | undefined): string {
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

// WS Health Indicator Component
function WsHealthIndicator({ wsHealth, source }: { wsHealth?: UniverseData['wsHealth']; source: string }) {
  const getHealthColor = (health?: WsHealth) => {
    if (!health) return "bg-muted/30 text-muted-foreground";
    const colors = {
      OK: "bg-status-ok/20 text-status-ok",
      DEGRADED: "bg-status-attention/20 text-status-attention",
      STALE: "bg-status-risk/20 text-status-risk"
    };
    return colors[health];
  };

  const isWsActive = source === "rest+ws" && wsHealth?.connected;
  const healthStatus = wsHealth?.health || (source === "rest" ? "REST" : "UNKNOWN");

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`px-2 py-1 rounded font-medium ${getHealthColor(wsHealth?.health)}`}>
        {isWsActive ? `WS ${healthStatus}` : "REST ONLY"}
      </span>
      {wsHealth && (
        <span className="text-muted-foreground">
          {wsHealth.symbolCount} symbols • {wsHealth.lastMessageAgeSec.toFixed(1)}s ago
        </span>
      )}
    </div>
  );
}

// Setup Analysis Drawer Content (BRICK 3)
function SetupAnalysisContent({ 
  data, 
  loading, 
  error 
}: { 
  data: SetupEngineResponse | null; 
  loading: boolean; 
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Analisi in corso...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded border border-status-risk/30 bg-status-risk/10">
        <p className="text-sm text-status-risk">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const statusColors = {
    SETUP_FOUND: "bg-status-ok/20 text-status-ok border-status-ok/30",
    NO_SETUP: "bg-muted/30 text-muted-foreground border-border/50",
    BLOCKED: "bg-status-risk/20 text-status-risk border-status-risk/30",
    REVIEW: "bg-status-attention/20 text-status-attention border-status-attention/30",
  };

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between p-3 rounded border border-border/50 bg-muted/10">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[data.status]}`}>
            {data.status.replace("_", " ")}
          </span>
          <span className="text-sm font-medium text-foreground">{data.symbol}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(data.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Setup Details (if found) */}
      {data.setup && (
        <div className="space-y-3">
          <div className="p-4 rounded border border-border/50 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Setup</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <p className="text-sm font-medium text-foreground">{data.setup.setupType} {data.setup.direction}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-sm font-medium text-foreground">{data.setup.score.total} ({data.setup.score.confidence})</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entry</p>
                <p className="text-sm font-medium text-foreground">${data.setup.entry.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stop</p>
                <p className="text-sm font-medium text-foreground">${data.setup.stop.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Target</p>
                <p className="text-sm font-medium text-foreground">${data.setup.targets.primary.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">R:R</p>
                <p className="text-sm font-medium text-foreground">{data.setup.riskReward.ratio.toFixed(2)}:1</p>
              </div>
            </div>
          </div>

          {/* Score Contributions */}
          <div className="p-4 rounded border border-border/50 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Score Breakdown</p>
            <div className="space-y-2">
              {data.setup.score.contributions.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.factor}</span>
                  <span className={`font-medium ${c.contribution >= 0 ? 'text-status-ok' : 'text-status-risk'}`}>
                    {c.contribution >= 0 ? '+' : ''}{c.contribution.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded border border-border/50 bg-background">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Regime</p>
          <p className="text-sm font-medium text-foreground">{data.analysis.regime.type}</p>
          <p className="text-xs text-muted-foreground">
            {data.analysis.regime.direction} • {(data.analysis.regime.strength * 100).toFixed(0)}%
          </p>
        </div>
        <div className="p-3 rounded border border-border/50 bg-background">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">L2</p>
          <p className="text-sm font-medium text-foreground">{data.analysis.l2Summary.liquidityStress}</p>
          <p className="text-xs text-muted-foreground">
            Imb: {(data.analysis.l2Summary.imbalance10bps * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-3 rounded border border-border/50 bg-background">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Tape</p>
          <p className="text-sm font-medium text-foreground">
            CVD: {data.analysis.tapeSummary.slope5m > 0 ? '↑' : '↓'}
          </p>
          <p className="text-xs text-muted-foreground">
            Aggr: {(data.analysis.tapeSummary.aggressionRatio * 100).toFixed(0)}%
          </p>
        </div>
        <div className="p-3 rounded border border-border/50 bg-background">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Gate</p>
          <p className="text-sm font-medium text-foreground">{data.analysis.gate.status}</p>
          <p className="text-xs text-muted-foreground">
            {data.analysis.gate.passedGates.length}/{data.analysis.gate.passedGates.length + data.analysis.gate.failedGates.length} passed
          </p>
        </div>
      </div>

      {/* Reasons */}
      {data.reasons.length > 0 && (
        <div className="p-4 rounded border border-border/50 bg-background">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Reasoning</p>
          <ul className="space-y-1">
            {data.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground p-2 bg-muted/10 rounded">
        <span>WS: {data.meta.wsConnected ? data.meta.wsHealth : 'Disconnected'}</span>
        <span>{data.meta.tradesCount} trades • {data.meta.depthLevels} levels</span>
      </div>
    </div>
  );
}

// Compact Universe Card Component
function CompactUniverseCard({ 
  candidates, 
  title, 
  type: _type,
  onCandidateClick
}: { 
  candidates: UniverseCandidate[]; 
  title: string; 
  type: "long" | "short";
  onCandidateClick: (candidate: UniverseCandidate) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const topCandidates = candidates.slice(0, 3);
  const hasMore = candidates.length > 3;

  return (
    <>
      <Card 
        title={title} 
        subtitle={`${candidates.length} candidates`}
        actions={
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-subtle"
          >
            Espandi Tabella
          </button>
        }
      >
        <div className="space-y-2">
          {topCandidates.map((candidate, index) => (
            <div 
              key={candidate.symbol} 
              className="flex items-center justify-between p-2 bg-muted/20 rounded border border-border/30 cursor-pointer hover:bg-muted/40 transition-subtle"
              onClick={() => onCandidateClick(candidate)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-xs text-muted-foreground w-4">#{index + 1}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{candidate.symbol}</div>
                  <div className="text-xs text-muted-foreground">${formatNumber(candidate.htf.price)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getRegimeBadge(candidate.htf.regime)}
                <div className="text-xs font-medium text-foreground">
                  {candidate.scores.total}
                </div>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-xs text-primary hover:text-primary/80 transition-subtle"
              >
                +{candidates.length - 3} altri candidati
              </button>
            </div>
          )}
        </div>
      </Card>

      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title={`${title} - Analisi Completa`}
        size="table"
      >
        <EnhancedTable 
          candidates={candidates} 
          title={title} 
          defaultMode="detailed"
          onCandidateClick={(c) => {
            setDrawerOpen(false);
            onCandidateClick(c);
          }}
        />
      </Drawer>
    </>
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

// Main Component
export function ModernDashboard() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [universe, setUniverse] = useState<UniverseData | null>(null);
  const [regime, setRegime] = useState<RegimeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // BRICK 3: Setup Analysis State
  const [setupDrawerOpen, setSetupDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<UniverseCandidate | null>(null);
  const [setupData, setSetupData] = useState<SetupEngineResponse | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

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
      
      // Map wsHealth from API response
      if (universeData.market?.quality?.ws) {
        const ws = universeData.market.quality.ws;
        universeData.wsHealth = {
          connected: ws.available,
          health: ws.health,
          lastMessageAgeSec: ws.lastMessageAgeSec,
          symbolCount: universeData.meta?.topN || 0
        };
      }
      
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

  // BRICK 3: Load setup analysis for selected candidate
  const loadSetupAnalysis = useCallback(async (candidate: UniverseCandidate) => {
    setSelectedCandidate(candidate);
    setSetupDrawerOpen(true);
    setSetupLoading(true);
    setSetupError(null);
    setSetupData(null);
    
    try {
      const setupUrl = new URL(`/api/trading/setup/${candidate.symbol}`, window.location.origin);
      const res = await fetch(setupUrl.toString());
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setSetupData(data);
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : "Failed to load setup analysis");
    } finally {
      setSetupLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const aiData = regime && universe ? { symbol, regime, universe } : null;

  return (
    <div className="space-y-3">
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
        <div id="universe" className="space-y-3">
          {/* WS Health Bar */}
          <div className="flex items-center justify-between p-3 rounded border border-border/50 bg-muted/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Data Source
              </span>
              <WsHealthIndicator wsHealth={universe.wsHealth} source={universe.meta.source} />
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(universe.meta.ts).toLocaleTimeString()}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
              title="Source Quality"
              value={universe.meta.source === "rest+ws" ? "Live" : "REST"}
              change={universe.wsHealth?.health === "OK" ? "Real-time" : "Delayed"}
              changeType={universe.wsHealth?.health === "OK" ? "positive" : "neutral"}
              icon={<UniverseIcon size={20} className="text-muted-foreground" />}
            />
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <CompactUniverseCard 
            candidates={universe.long} 
            title="Long Opportunities" 
            type="long"
            onCandidateClick={loadSetupAnalysis}
          />
          <CompactUniverseCard 
            candidates={universe.short} 
            title="Short Opportunities" 
            type="short"
            onCandidateClick={loadSetupAnalysis}
          />
        </div>
      )}

      {/* BRICK 3: Setup Analysis Drawer */}
      <Drawer
        open={setupDrawerOpen}
        onClose={() => setSetupDrawerOpen(false)}
        title={selectedCandidate ? `Setup Analysis - ${selectedCandidate.symbol}` : "Setup Analysis"}
        size="wide"
      >
        <SetupAnalysisContent 
          data={setupData} 
          loading={setupLoading} 
          error={setupError} 
        />
      </Drawer>
    </div>
  );
}