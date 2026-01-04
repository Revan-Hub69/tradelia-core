"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/dashboard/card";
import { Drawer } from "@/components/dashboard/drawer";
import { AIIcon } from "@/components/icons/dashboard-icons";

type AIAnalysisProps = {
  data: {
    symbol: string;
    regime: any;
    universe: any;
  } | null;
};

type BrickMode = "BRICK1_ONLY" | "BRICK2_ONLY" | "BRICK1_PLUS_BRICK2";

interface NasaAnalysisResult {
  meta: {
    mode: string;
    engine: { name: string; version: string };
    ts: number;
  };
  status: {
    state: "ACTIVE" | "REVIEW" | "HOLD" | "NEEDS_DATA";
    go_no_go: "GO" | "NO_GO";
    confidence: number;
    blocking_reasons: string[];
  };
  brick1?: {
    market_state: {
      regime: string;
      vol_state: string;
      liquidity_state: string;
      stress_flag: boolean;
    };
    policy: {
      allowed_playbooks: string[];
      blocked_playbooks: string[];
      max_risk_r: number;
      notes: string[];
    };
  };
  brick2?: {
    universe: {
      top: Array<{
        symbol: string;
        category: string;
        score: number;
        why: string[];
      }>;
      avoid: Array<{
        symbol: string;
        why: string[];
      }>;
    };
  };
  brick1_plus_brick2?: {
    filtered_top: Array<{
      symbol: string;
      action: "FOCUS" | "WATCH" | "IGNORE";
      playbook: string;
      reason: string[];
    }>;
  };
  audit: {
    input_coverage_pct: number;
    assumptions: string[];
    conflicts: string[];
    sanity_checks: Array<{
      name: string;
      pass: boolean;
      detail: string;
    }>;
  };
}

export function AIAnalysis({ data }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<NasaAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<BrickMode>("BRICK1_ONLY");

  const runNasaAnalysis = useCallback(async (mode: BrickMode) => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare structured input for NASA-grade analysis
      const structuredInput = {
        market: {
          anchor: {
            symbol: data.symbol,
            regime4h: data.regime,
            ts: Date.now()
          }
        },
        universe: data.universe ? {
          meta: data.universe.meta,
          market: data.universe.market,
          long: data.universe.long.slice(0, 10),
          short: data.universe.short.slice(0, 10)
        } : null
      };

      const response = await fetch("/api/trading/ai/nasa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          input: structuredInput
        })
      });

      if (!response.ok) throw new Error("NASA AI analysis failed");
      
      const result = await response.json();
      setAnalysis(result.output);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisi fallita");
    } finally {
      setLoading(false);
    }
  }, [data]);

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-status-ok/20 text-status-ok border-status-ok/30",
      REVIEW: "bg-status-attention/20 text-status-attention border-status-attention/30",
      HOLD: "bg-status-risk/20 text-status-risk border-status-risk/30",
      NEEDS_DATA: "bg-muted/30 text-muted-foreground border-border/50"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${styles[status as keyof typeof styles] || styles.NEEDS_DATA}`}>
        {status}
      </span>
    );
  };

  const getGoNoGoBadge = (decision: string) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
        decision === "GO" 
          ? "bg-status-ok/20 text-status-ok border-status-ok/30"
          : "bg-status-risk/20 text-status-risk border-status-risk/30"
      }`}>
        {decision}
      </span>
    );
  };

  if (!data) {
    return (
      <Card title="NASA-Grade AI Analysis" subtitle="Analisi strutturata a scaglioni">
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <AIIcon size={48} />
          </div>
          <p className="text-sm text-muted-foreground">Carica i dati di mercato per abilitare l'analisi NASA-grade</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        title="NASA-Grade AI Analysis" 
        subtitle="Analisi strutturata a scaglioni"
        actions={
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-subtle"
          >
            Apri Analisi
          </button>
        }
      >
        <div className="space-y-3">
          {analysis ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(analysis.status.state)}
                  {getGoNoGoBadge(analysis.status.go_no_go)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Confidence: {analysis.status.confidence}%
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Mode: {analysis.meta.mode} | Coverage: {analysis.audit.input_coverage_pct}%
              </div>
              
              {analysis.status.blocking_reasons.length > 0 && (
                <div className="text-xs text-status-risk">
                  Blocks: {analysis.status.blocking_reasons.join(", ")}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="text-muted-foreground">
                <AIIcon size={24} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">
                  {loading ? "Eseguendo analisi NASA-grade..." : "Nessuna analisi eseguita. Apri per configurare."}
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-xs text-status-risk">
              Errore: {error}
            </div>
          )}
        </div>
      </Card>

      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title="NASA-Grade AI Analysis"
        size="compact"
      >
        <div className="space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Modalità Analisi
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { mode: "BRICK1_ONLY" as BrickMode, title: "Brick 1: Market State", desc: "Regime + Policy" },
                { mode: "BRICK2_ONLY" as BrickMode, title: "Brick 2: Universe Screening", desc: "Asset Ranking" },
                { mode: "BRICK1_PLUS_BRICK2" as BrickMode, title: "Brick 1+2: Integrated", desc: "Policy + Screening" }
              ].map(({ mode, title, desc }) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`p-3 text-left rounded border transition-subtle ${
                    selectedMode === mode
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border/50 hover:bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Run Analysis */}
          <div>
            <button
              onClick={() => runNasaAnalysis(selectedMode)}
              disabled={loading}
              className="w-full rounded bg-foreground px-4 py-3 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50 transition-subtle"
            >
              {loading ? "Analizzando..." : `Esegui ${selectedMode.replace(/_/g, " ")}`}
            </button>
          </div>

          {/* Results Display */}
          {analysis && (
            <div className="space-y-4">
              {/* Status Overview */}
              <div className="rounded border border-border/30 bg-muted/20 p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Status Overview</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">State:</span>
                    <div className="mt-1">{getStatusBadge(analysis.status.state)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Decision:</span>
                    <div className="mt-1">{getGoNoGoBadge(analysis.status.go_no_go)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <div className="mt-1 text-foreground font-medium">{analysis.status.confidence}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coverage:</span>
                    <div className="mt-1 text-foreground font-medium">{analysis.audit.input_coverage_pct}%</div>
                  </div>
                </div>
              </div>

              {/* Brick 1 Results */}
              {analysis.brick1 && (
                <div className="rounded border border-border/30 bg-muted/20 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Brick 1: Market State</h4>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Regime:</span>
                        <div className="mt-1 text-foreground font-medium">{analysis.brick1.market_state.regime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vol State:</span>
                        <div className="mt-1 text-foreground font-medium">{analysis.brick1.market_state.vol_state}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Liquidity:</span>
                        <div className="mt-1 text-foreground font-medium">{analysis.brick1.market_state.liquidity_state}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stress:</span>
                        <div className="mt-1 text-foreground font-medium">{analysis.brick1.market_state.stress_flag ? "YES" : "NO"}</div>
                      </div>
                    </div>
                    
                    {analysis.brick1.policy.allowed_playbooks.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Allowed Playbooks:</span>
                        <div className="mt-1 text-foreground">{analysis.brick1.policy.allowed_playbooks.join(", ")}</div>
                      </div>
                    )}
                    
                    {analysis.brick1.policy.blocked_playbooks.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Blocked Playbooks:</span>
                        <div className="mt-1 text-status-risk">{analysis.brick1.policy.blocked_playbooks.join(", ")}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Brick 2 Results */}
              {analysis.brick2 && (
                <div className="rounded border border-border/30 bg-muted/20 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Brick 2: Universe Screening</h4>
                  <div className="space-y-3">
                    {analysis.brick2.universe.top.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Top Candidates:</span>
                        <div className="mt-2 space-y-2">
                          {analysis.brick2.universe.top.slice(0, 5).map((candidate, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-background rounded border border-border/30">
                              <div>
                                <div className="text-xs font-medium text-foreground">{candidate.symbol}</div>
                                <div className="text-xs text-muted-foreground">{candidate.category}</div>
                              </div>
                              <div className="text-xs font-medium text-foreground">{candidate.score}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Brick 1+2 Results */}
              {analysis.brick1_plus_brick2 && (
                <div className="rounded border border-border/30 bg-muted/20 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Brick 1+2: Filtered Recommendations</h4>
                  <div className="space-y-2">
                    {analysis.brick1_plus_brick2.filtered_top.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-background rounded border border-border/30">
                        <div>
                          <div className="text-xs font-medium text-foreground">{item.symbol}</div>
                          <div className="text-xs text-muted-foreground">{item.playbook}</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                          item.action === "FOCUS" 
                            ? "bg-status-ok/20 text-status-ok border-status-ok/30"
                            : item.action === "WATCH"
                            ? "bg-status-attention/20 text-status-attention border-status-attention/30"
                            : "bg-muted/30 text-muted-foreground border-border/50"
                        }`}>
                          {item.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Trail */}
              <div className="rounded border border-border/30 bg-muted/20 p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Audit Trail</h4>
                <div className="space-y-2 text-xs">
                  {analysis.audit.sanity_checks.map((check, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{check.name}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                        check.pass 
                          ? "bg-status-ok/20 text-status-ok"
                          : "bg-status-risk/20 text-status-risk"
                      }`}>
                        {check.pass ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  ))}
                  
                  {analysis.audit.conflicts.length > 0 && (
                    <div className="mt-3 p-2 bg-status-risk/10 rounded border border-status-risk/30">
                      <div className="text-status-risk font-medium">Conflicts Detected:</div>
                      <ul className="mt-1 text-status-risk">
                        {analysis.audit.conflicts.map((conflict, i) => (
                          <li key={i}>• {conflict}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}