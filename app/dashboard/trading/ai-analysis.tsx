"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/dashboard/card";
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
  const [goal, setGoal] = useState("Analizza il regime di mercato attuale e fornisci un brief operativo. Spiega la situazione in modo chiaro e diretto, suggerendo eventuali opportunità o rischi da considerare.");

  const runAnalysis = useCallback(async () => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/trading/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: `${goal}\n\nIMPORTANTE: Rispondi SOLO in italiano, in modo conversazionale e diretto. NON usare JSON. Scrivi come se stessi parlando con un trader esperto. Usa paragrafi brevi e chiari.`,
          packet: {
            version: "tradelia-ai-packet-v1",
            asOf: Date.now(),
            symbol: data.symbol,
            regime4h: data.regime,
            universe: data.universe ? {
              meta: data.universe.meta,
              market: data.universe.market,
              long: data.universe.long.slice(0, 5),
              short: data.universe.short.slice(0, 5),
            } : null,
          }
        })
      });

      if (!response.ok) throw new Error("AI analysis failed");
      
      const result = await response.json();
      
      // Extract conversational text from AI response
      let analysisText = "";
      
      if (typeof result === "string") {
        analysisText = result;
      } else if (result && typeof result === "object") {
        // Try to extract meaningful conversational content
        const possibleFields = ['analysis', 'summary', 'content', 'text', 'message', 'response', 'brief', 'answer'];
        
        for (const field of possibleFields) {
          if (result[field] && typeof result[field] === 'string') {
            analysisText = result[field];
            break;
          }
        }
        
        // If no direct text field, try to extract from nested objects
        if (!analysisText) {
          if (result.choices && Array.isArray(result.choices) && result.choices[0]?.message?.content) {
            analysisText = result.choices[0].message.content;
          } else if (result.data && typeof result.data === 'string') {
            analysisText = result.data;
          } else if (result.result && typeof result.result === 'string') {
            analysisText = result.result;
          }
        }
        
        // If still no text, try to format structured response
        if (!analysisText && result.regime && result.recommendations) {
          analysisText = `**Regime di Mercato**: ${result.regime}\n\n**Raccomandazioni**:\n${
            Array.isArray(result.recommendations) 
              ? result.recommendations.map((rec: string) => `• ${rec}`).join('\n')
              : result.recommendations
          }`;
        }
        
        // Last resort: inform user to try again with different prompt
        if (!analysisText) {
          analysisText = "La risposta AI non è in un formato leggibile. Prova a modificare la richiesta di analisi per ottenere una risposta più chiara.";
        }
      } else {
        analysisText = "Risposta AI non valida. Verifica la configurazione e riprova.";
      }
      
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
    <Card 
      title="AI Analysis" 
      subtitle="Analisi intelligente del mercato"
      actions={
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50 transition-subtle"
        >
          {loading ? "Analyzing..." : "Avvia Analisi"}
        </button>
      }
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
              Premi "Avvia Analisi" per ottenere insights AI sui dati di mercato attuali
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}