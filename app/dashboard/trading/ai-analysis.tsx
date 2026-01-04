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
    input_hash: string;
    run_id: string;
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
    evidence: any[];
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
    evidence: any[];
  };
  brick1_plus_brick2?: {
    filtered_top: Array<{
      symbol: string;
      action: "FOCUS" | "WATCH" | "IGNORE";
      playbook: string;
      reason: string[];
    }>;
    evidence: any[];
  };
  audit: {
    input_coverage_pct: number;
    assumptions: string[];
    conflicts: string[];
    sanity_checks: Array<{
      name: string;
      pass: boolean;
      detail: string;
      value?: number;
      threshold?: number;
    }>;
    input_hash: string;
    timestamp: number;
  };
}

export function AIAnalysis({ data }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<NasaAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputCanon, setInputCanon] = useState<any>(null);

  const runAnalysis = useCallback(async (mode: BrickMode) => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // NASA-grade: Send ONLY raw data, NO mock/fallback
      const rawInput = {
        symbol: data.symbol,
        ts: Date.now(),
        source: "dashboard",
        regime: data.regime,
        universe: data.universe
      };

      // Fail-fast validation
      if (!rawInput.symbol) {
        throw new Error("Dati mancanti: simbolo anchor");
      }
      
      if (mode !== "BRICK2_ONLY" && !rawInput.regime) {
        throw new Error("Dati mancanti: regime di mercato");
      }
      
      if (mode !== "BRICK1_ONLY") {
        if (!rawInput.universe || (!rawInput.universe.long?.length && !rawInput.universe.short?.length)) {
          throw new Error("Dati mancanti: candidati universe");
        }
      }

      const response = await fetch("/api/trading/ai/nasa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: rawInput })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Errore API: ${response.status}`);
      }
      
      const result = await response.json();
      setAnalysis(result.output as NasaAnalysisResult);
      setInputCanon(result.input_canon);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisi fallita");
    } finally {
      setLoading(false);
    }
  }, [data]);

  // Status badge helper
  const getStatusColor = (state: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-status-ok/20 text-status-ok border-status-ok/30",
      REVIEW: "bg-status-attention/20 text-status-attention border-status-attention/30",
      HOLD: "bg-status-risk/20 text-status-risk border-status-risk/30",
      NEEDS_DATA: "bg-muted/30 text-muted-foreground border-border/50"
    };
    return colors[state] || colors.NEEDS_DATA;
  };

  // No data state
  if (!data) {
    return (
      <Card title="Analisi AI" subtitle="Valutazione automatica del mercato">
        <div className="text-center py-6">
          <AIIcon size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Carica i dati di mercato per abilitare l'analisi</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        title="Analisi AI" 
        subtitle="Valutazione automatica del mercato"
        actions={
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-subtle"
          >
            Dettagli
          </button>
        }
      >
        {/* Main content - always visible */}
        <div className="space-y-4">
          {/* Quick actions - run analysis directly */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runAnalysis("BRICK1_ONLY")}
              disabled={loading}
              className="flex-1 min-w-[100px] px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 disabled:opacity-50 transition-subtle"
            >
              {loading ? "..." : "Regime"}
            </button>
            <button
              onClick={() => runAnalysis("BRICK2_ONLY")}
              disabled={loading}
              className="flex-1 min-w-[100px] px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 disabled:opacity-50 transition-subtle"
            >
              {loading ? "..." : "Universe"}
            </button>
            <button
              onClick={() => runAnalysis("BRICK1_PLUS_BRICK2")}
              disabled={loading}
              className="flex-1 min-w-[100px] px-3 py-2 text-xs font-medium rounded bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-subtle"
            >
              {loading ? "..." : "Completa"}
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded bg-status-risk/10 border border-status-risk/30">
              <p className="text-xs text-status-risk">{error}</p>
            </div>
          )}

          {/* Results summary - compact */}
          {analysis && (
            <div className="space-y-3">
              {/* Decision row */}
              <div className="flex items-center justify-between p-3 rounded bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(analysis.status.state)}`}>
                    {analysis.status.state}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                    analysis.status.go_no_go === "GO" 
                      ? "bg-status-ok/20 text-status-ok border-status-ok/30"
                      : "bg-status-risk/20 text-status-risk border-status-risk/30"
                  }`}>
                    {analysis.status.go_no_go}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{analysis.status.confidence}%</div>
                  <div className="text-xs text-muted-foreground">confidence</div>
                </div>
              </div>

              {/* Key info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Coverage:</span>
                  <span className="ml-1 text-foreground font-medium">{analysis.audit.input_coverage_pct}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mode:</span>
                  <span className="ml-1 text-foreground font-medium">{analysis.meta.mode.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Blocking reasons if any */}
              {analysis.status.blocking_reasons.length > 0 && (
                <div className="p-2 rounded bg-status-risk/10 border border-status-risk/30">
                  <p className="text-xs text-status-risk font-medium mb-1">Blocchi:</p>
                  <ul className="text-xs text-status-risk space-y-0.5">
                    {analysis.status.blocking_reasons.map((reason, i) => (
                      <li key={i}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sanity checks summary */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Sanity:</span>
                {analysis.audit.sanity_checks.filter(c => c.pass).length === analysis.audit.sanity_checks.length ? (
                  <span className="text-status-ok">✓ Tutti passati</span>
                ) : (
                  <span className="text-status-attention">
                    {analysis.audit.sanity_checks.filter(c => !c.pass).length} falliti
                  </span>
                )}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="text-primary hover:text-primary/80 transition-subtle ml-auto"
                >
                  Dettagli →
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!analysis && !error && !loading && (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                Seleziona un tipo di analisi per iniziare
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Details Drawer */}
      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title="Dettagli Analisi AI"
        size="compact"
      >
        <div className="space-y-6">
          {/* Sanity Checks */}
          {analysis && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Sanity Checks</h4>
              <div className="space-y-2">
                {analysis.audit.sanity_checks.map((check, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <div>
                      <div className="text-xs font-medium text-foreground">{check.name.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-muted-foreground">{check.detail}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      check.pass ? "bg-status-ok/20 text-status-ok" : "bg-status-risk/20 text-status-risk"
                    }`}>
                      {check.pass ? "OK" : "FAIL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assumptions */}
          {analysis && analysis.audit.assumptions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Assunzioni</h4>
              <ul className="space-y-1">
                {analysis.audit.assumptions.map((assumption, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-foreground/30">•</span>
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input Canon (collapsible) */}
          {inputCanon && (
            <details className="group">
              <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-subtle">
                Input Canon (dati processati)
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(inputCanon, null, 2)}
              </pre>
            </details>
          )}

          {/* Full Response (collapsible) */}
          {analysis && (
            <details className="group">
              <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-subtle">
                Risposta completa AI
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </Drawer>
    </>
  );
}
