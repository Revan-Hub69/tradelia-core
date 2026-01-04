"use client";

import { useState, useCallback } from "react";

type AIAnalysisProps = {
  data: {
    symbol: string;
    regime: any;
    universe: any;
  } | null;
};

export function AIAnalysis({ data }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/trading/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: "Analizza il regime e i top candidates. Fornisci un brief operativo in italiano, max 5 punti chiave.",
          packet: {
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
          }
        })
      });

      if (!response.ok) throw new Error("AI analysis failed");
      
      const result = await response.json();
      
      // Extract meaningful text from AI response
      let analysisText = "";
      if (typeof result === "string") {
        analysisText = result;
      } else if (result.analysis) {
        analysisText = result.analysis;
      } else if (result.summary) {
        analysisText = result.summary;
      } else {
        analysisText = JSON.stringify(result, null, 2);
      }
      
      setAnalysis(analysisText);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="rounded border border-border/50 bg-muted/30 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI Analysis</p>
        <p className="mt-2 text-sm text-muted-foreground">Carica i dati per abilitare l'analisi</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-border/50 bg-background p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI Analysis</p>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {analysis && (
        <div className="rounded border border-border/30 bg-muted/20 p-4">
          <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
            {analysis}
          </pre>
        </div>
      )}

      {!analysis && !error && (
        <div className="text-sm text-muted-foreground">
          Premi "Run Analysis" per ottenere un brief operativo basato sui dati attuali.
        </div>
      )}
    </div>
  );
}