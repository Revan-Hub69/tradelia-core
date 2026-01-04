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

export function AIAnalysis({ data }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [goal, setGoal] = useState("Analizza la situazione di mercato attuale. Come vedi i dati? Ci sono opportunità interessanti o rischi da considerare?");

  const runAnalysis = useCallback(async () => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/trading/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: goal,
          context: {
            symbol: data.symbol,
            regime4h: data.regime,
            universe: data.universe ? {
              meta: data.universe.meta,
              market: data.universe.market,
              long: data.universe.long.slice(0, 5),
              short: data.universe.short.slice(0, 5),
            } : null,
          },
          conversational: true
        })
      });

      if (!response.ok) throw new Error("AI analysis failed");
      
      // Get plain text response
      const analysisText = await response.text();
      setAnalysis(analysisText);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisi fallita");
    } finally {
      setLoading(false);
    }
  }, [data, goal]);

  if (!data) {
    return (
      <Card title="AI Analysis" subtitle="Analisi intelligente del mercato">
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            <AIIcon size={48} />
          </div>
          <p className="text-sm text-muted-foreground">Carica i dati di mercato per abilitare l'analisi AI</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        title="AI Analysis" 
        subtitle="Insights conversazionali"
        actions={
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-subtle"
          >
            Apri Analisi
          </button>
        }
      >
        <div className="flex items-center space-x-3">
          <div className="text-muted-foreground">
            <AIIcon size={24} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">
              {analysis ? "Ultima analisi completata. Apri per visualizzare e modificare." : "Nessuna analisi ancora eseguita."}
            </div>
            {loading && (
              <div className="text-xs text-primary mt-1">Analizzando...</div>
            )}
            {error && (
              <div className="text-xs text-status-risk mt-1">Errore: {error}</div>
            )}
          </div>
        </div>
      </Card>

      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title="AI Analysis"
      >
        <div className="space-y-4">
          {/* Goal Input */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Obiettivo Analisi
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border/50 rounded bg-background focus:ring-2 focus:ring-primary focus:border-primary text-sm resize-none transition-subtle"
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Descrivi cosa vuoi analizzare..."
            />
          </div>

          {/* Run Analysis Button */}
          <div>
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full rounded bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50 transition-subtle"
            >
              {loading ? "Analizzando..." : "Avvia Analisi"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded border border-status-risk/30 bg-status-risk/10 p-4">
              <div className="text-sm text-status-risk">{error}</div>
            </div>
          )}

          {/* Analysis Result */}
          {analysis && (
            <div className="rounded border border-border/30 bg-muted/20 p-4">
              <div className="prose prose-sm max-w-none">
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {analysis}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!analysis && !error && !loading && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                <AIIcon size={48} />
              </div>
              <p className="text-sm text-muted-foreground">
                Configura l'obiettivo e premi "Avvia Analisi" per ottenere insights sui dati di mercato
              </p>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}