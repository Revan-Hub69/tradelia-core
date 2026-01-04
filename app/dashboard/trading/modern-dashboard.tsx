"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, StatCard } from "@/components/dashboard/card";
import { OverviewIcon, UniverseIcon, RegimeIcon, AIIcon, RefreshIcon } from "@/components/icons/dashboard-icons";

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
    TREND: "bg-emerald-100 text-emerald-800 border-emerald-200",
    RANGE: "bg-amber-100 text-amber-800 border-amber-200", 
    TRANSITION: "bg-slate-100 text-slate-800 border-slate-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[regime]}`}>
      {regime}
    </span>
  );
}

// Components
function RegimeWidget({ regime }: { regime: RegimeOutput | null }) {
  if (!regime) {
    return (
      <Card title="Market Regime" loading={true} />
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              STRESS
            </span>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-500">Trend Strength</p>
            <p className="text-lg font-semibold text-slate-900">{formatNumber(regime.metrics.trendStrength)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Range Ratio</p>
            <p className="text-lg font-semibold text-slate-900">{formatNumber(regime.metrics.rangeRatio)}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-500">ATR14</p>
            <p className="text-lg font-semibold text-slate-900">{formatNumber(regime.metrics.atr14)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">EMA Alignment</p>
            <p className="text-lg font-semibold text-slate-900">
              {regime.metrics.ema20 > regime.metrics.ema50 ? "Bullish ↗" : "Bearish ↘"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-slate-500">Allowed Setups</p>
            <p className="text-sm font-medium text-slate-900 break-words">{regime.allowedSetups.join(", ") || "None"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Reason</p>
            <p className="text-xs text-slate-600 break-all">{regime.reasonCode}</p>
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
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Regime</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Spread</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {candidates.slice(0, 5).map((candidate) => (
              <tr key={candidate.symbol} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{candidate.symbol}</div>
                    <div className="text-sm text-slate-500 truncate">${formatNumber(candidate.htf.price)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRegimeBadge(candidate.htf.regime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{candidate.scores.total}</div>
                  <div className="text-xs text-slate-500">T:{candidate.scores.tradeability} R:{candidate.scores.regimeMatch}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {formatBps(candidate.ws.spreadBpsNow)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 max-w-32">
                    {candidate.reasons.blocks.slice(0, 1).map((reason, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 border border-red-200 truncate max-w-20" title={reason}>
                        {reason.length > 8 ? reason.substring(0, 8) + '...' : reason}
                      </span>
                    ))}
                    {candidate.reasons.warnings.slice(0, 1).map((reason, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700 border border-amber-200 truncate max-w-20" title={reason}>
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

function AIAnalysisWidget({ data, aiGoal, setAiGoal }: { 
  data: any; 
  aiGoal: string;
  setAiGoal: (goal: string) => void;
}) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const aiPacket = {
        version: "tradelia-ai-packet-v1",
        asOf: Date.now(),
        symbol: data.symbol,
        regime4h: data.regime,
        universe: data.universe ? {
          meta: data.universe.meta,
          market: data.universe.market,
          long: data.universe.long.slice(0, 3),
          short: data.universe.short.slice(0, 3),
        } : null,
        instruction: "Usa solo questi dati. Non calcolare indicatori. Tratta regime4h.regime come gate (TREND/RANGE/TRANSITION), rispetta allowedSetups/forbiddenSetups e segui i reason code del Universe (long/short).",
      };

      const response = await fetch("/api/trading/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: aiGoal, packet: aiPacket })
      });

      if (!response.ok) throw new Error("AI analysis failed");
      
      const result = await response.json();
      setAnalysis(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI analysis failed");
    } finally {
      setLoading(false);
    }
  }, [data, aiGoal]);

  return (
    <Card 
      title="AI Analysis" 
      subtitle="Intelligent market insights"
      actions={
        <button
          onClick={runAnalysis}
          disabled={loading || !data}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      }
      loading={loading}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Analysis Goal
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-sm resize-none"
            rows={3}
            value={aiGoal}
            onChange={(e) => setAiGoal(e.target.value)}
            placeholder="Describe what you want to analyze..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {analysis && (
          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <div className="prose prose-sm max-w-none text-slate-700">
              {(() => {
                // Prova a estrarre testo leggibile dall'AI response
                if (typeof analysis === 'string') {
                  return <div className="whitespace-pre-wrap">{analysis}</div>;
                }
                
                if (typeof analysis === 'object' && analysis !== null) {
                  const result = analysis as any;
                  
                  // Cerca campi comuni per testo leggibile
                  if (result.analysis) {
                    return <div className="whitespace-pre-wrap">{result.analysis}</div>;
                  }
                  if (result.summary) {
                    return <div className="whitespace-pre-wrap">{result.summary}</div>;
                  }
                  if (result.brief) {
                    return <div className="whitespace-pre-wrap">{result.brief}</div>;
                  }
                  if (result.content) {
                    return <div className="whitespace-pre-wrap">{result.content}</div>;
                  }
                  if (result.text) {
                    return <div className="whitespace-pre-wrap">{result.text}</div>;
                  }
                  if (result.message) {
                    return <div className="whitespace-pre-wrap">{result.message}</div>;
                  }
                  
                  // Se ha una struttura riconoscibile, formattala meglio
                  if (result.regime && result.recommendations) {
                    return (
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-slate-900">Regime Analysis</h4>
                          <p className="text-sm text-slate-600">{result.regime}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">Recommendations</h4>
                          <div className="text-sm text-slate-600">
                            {Array.isArray(result.recommendations) 
                              ? result.recommendations.map((rec: string, i: number) => (
                                  <p key={i} className="mb-1">• {rec}</p>
                                ))
                              : <p>{result.recommendations}</p>
                            }
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                
                // Fallback: mostra JSON formattato ma più leggibile
                return (
                  <details className="cursor-pointer">
                    <summary className="font-medium text-slate-900 mb-2">
                      AI Response (JSON) - Click to expand
                    </summary>
                    <pre className="text-xs text-slate-600 overflow-auto bg-white p-3 rounded border">
                      {JSON.stringify(analysis, null, 2)}
                    </pre>
                  </details>
                );
              })()}
            </div>
          </div>
        )}

        {!analysis && !error && !loading && (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-4">
              <AIIcon size={48} />
            </div>
            <p className="text-slate-500">Click "Run Analysis" to get AI insights on current market conditions</p>
          </div>
        )}
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
  const [aiGoal, setAiGoal] = useState("Analizza i dati attuali e fornisci un brief operativo in italiano. Spiega il regime di mercato, i migliori candidati long/short e eventuali rischi. Rispondi in modo chiaro e diretto, non in JSON.");

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
    <div className="space-y-6">
      {/* Controls */}
      <Card title="Market Controls">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Anchor Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-sm"
              placeholder="BTCUSDT"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-colors"
            >
              <RefreshIcon size={16} className="mr-2" />
              {loading ? "Loading..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {universe && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Anchor Symbol"
            value={universe.market.anchor.symbol}
            change={universe.market.anchor.bias}
            changeType={universe.market.anchor.bias === "BULL" ? "positive" : universe.market.anchor.bias === "BEAR" ? "negative" : "neutral"}
            icon={<OverviewIcon size={24} className="text-slate-600" />}
          />
          <StatCard
            title="Long Candidates"
            value={universe.long.length}
            icon={<RegimeIcon size={24} className="text-emerald-600" />}
          />
          <StatCard
            title="Short Candidates"
            value={universe.short.length}
            icon={<RegimeIcon size={24} className="text-red-600 rotate-180" />}
          />
          <StatCard
            title="Data Source"
            value={universe.meta.source.toUpperCase()}
            change={`Updated ${new Date(universe.meta.ts).toLocaleTimeString()}`}
            icon={<UniverseIcon size={24} className="text-slate-600" />}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regime Analysis */}
        <div className="lg:col-span-1">
          <RegimeWidget regime={regime} />
        </div>

        {/* AI Analysis */}
        <div className="lg:col-span-2">
          <AIAnalysisWidget data={aiData} aiGoal={aiGoal} setAiGoal={setAiGoal} />
        </div>
      </div>

      {/* Universe Tables */}
      {universe && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UniverseTable candidates={universe.long} title="Long Opportunities" />
          <UniverseTable candidates={universe.short} title="Short Opportunities" />
        </div>
      )}
    </div>
  );
}