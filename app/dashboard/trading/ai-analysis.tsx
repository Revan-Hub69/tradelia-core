"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/dashboard/card";
import { Drawer } from "@/components/dashboard/drawer";

type DataExportProps = {
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
  audit: {
    input_coverage_pct: number;
    assumptions: string[];
    conflicts: string[];
    sanity_checks: Array<{
      name: string;
      pass: boolean;
      detail: string;
    }>;
    input_hash: string;
    timestamp: number;
  };
}

export function AIAnalysis({ data }: DataExportProps) {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [analysis, setAnalysis] = useState<NasaAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<"export" | "ai">("export");
  const [copied, setCopied] = useState<string | null>(null);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  // Download JSON
  const downloadJson = useCallback((content: object, filename: string) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Build export data
  const buildExportData = useCallback(() => {
    if (!data) return null;
    return {
      meta: {
        exported_at: new Date().toISOString(),
        symbol: data.symbol,
        source: "tradelia-dashboard"
      },
      regime: data.regime,
      universe: data.universe
    };
  }, [data]);

  // Run AI Analysis
  const runAnalysis = useCallback(async (mode: BrickMode) => {
    if (!data || !aiEnabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const rawInput = {
        symbol: data.symbol,
        ts: Date.now(),
        source: "dashboard",
        regime: data.regime,
        universe: data.universe
      };

      if (!rawInput.symbol) throw new Error("Simbolo mancante");
      if (mode !== "BRICK2_ONLY" && !rawInput.regime) throw new Error("Regime mancante");
      if (mode !== "BRICK1_ONLY" && !rawInput.universe?.long?.length && !rawInput.universe?.short?.length) {
        throw new Error("Universe mancante");
      }

      const response = await fetch("/api/trading/ai/nasa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: rawInput })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(err.error || `Errore: ${response.status}`);
      }
      
      const result = await response.json();
      setAnalysis(result.output as NasaAnalysisResult);
      setDrawerContent("ai");
      setDrawerOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisi fallita");
    } finally {
      setLoading(false);
    }
  }, [data, aiEnabled]);

  // No data state
  if (!data) {
    return (
      <Card title="Dati & Analisi" subtitle="Export e analisi AI">
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">Carica i dati di mercato</p>
        </div>
      </Card>
    );
  }

  const exportData = buildExportData();
  const longCount = data.universe?.long?.length || 0;
  const shortCount = data.universe?.short?.length || 0;
  const regime = data.regime?.regime4h?.regime || data.regime?.regime || "—";

  return (
    <>
      <Card 
        title="Dati & Analisi" 
        subtitle="Export e analisi AI"
      >
        <div className="space-y-4">
          {/* Data Summary Row */}
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2 py-1 rounded bg-muted/30 text-foreground font-medium">
              {data.symbol}
            </span>
            <span className="text-muted-foreground">
              {regime}
            </span>
            <span className="text-muted-foreground">
              L:{longCount} S:{shortCount}
            </span>
          </div>

          {/* Export Section */}
          <div className="p-3 rounded border border-border/50 bg-muted/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Export
              </span>
              <button
                onClick={() => { setDrawerContent("export"); setDrawerOpen(true); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-subtle"
              >
                Dettagli →
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(exportData, null, 2), 'json')}
                className="flex-1 px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 transition-subtle"
              >
                {copied === 'json' ? '✓ Copiato' : 'Copia JSON'}
              </button>
              <button
                onClick={() => downloadJson(exportData!, `${data.symbol}-${Date.now()}.json`)}
                className="flex-1 px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 transition-subtle"
              >
                Download
              </button>
            </div>
          </div>

          {/* AI Section */}
          <div className="p-3 rounded border border-border/50 bg-muted/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Analisi AI
              </span>
              {/* Toggle */}
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  aiEnabled ? 'bg-foreground' : 'bg-border'
                }`}
                aria-label={aiEnabled ? "Disabilita AI" : "Abilita AI"}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-transform ${
                    aiEnabled ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {!aiEnabled ? (
              <p className="text-xs text-muted-foreground">
                AI disabilitata. Attiva per eseguire analisi.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => runAnalysis("BRICK1_ONLY")}
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 disabled:opacity-50 transition-subtle"
                  >
                    {loading ? "..." : "Regime"}
                  </button>
                  <button
                    onClick={() => runAnalysis("BRICK2_ONLY")}
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 disabled:opacity-50 transition-subtle"
                  >
                    {loading ? "..." : "Universe"}
                  </button>
                  <button
                    onClick={() => runAnalysis("BRICK1_PLUS_BRICK2")}
                    disabled={loading}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-subtle"
                  >
                    {loading ? "..." : "Completa"}
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-status-risk">{error}</p>
                )}
                {analysis && (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        analysis.status.go_no_go === "GO" 
                          ? "bg-status-ok/20 text-status-ok"
                          : "bg-status-risk/20 text-status-risk"
                      }`}>
                        {analysis.status.go_no_go}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {analysis.status.confidence}%
                      </span>
                    </div>
                    <button
                      onClick={() => { setDrawerContent("ai"); setDrawerOpen(true); }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-subtle"
                    >
                      Dettagli →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Drawer */}
      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title={drawerContent === "export" ? "Export Dati" : "Risultati AI"}
        size="compact"
      >
        {drawerContent === "export" ? (
          <ExportDrawerContent 
            data={data} 
            exportData={exportData}
            copied={copied}
            copyToClipboard={copyToClipboard}
          />
        ) : (
          <AIDrawerContent analysis={analysis} />
        )}
      </Drawer>
    </>
  );
}

// Export Drawer Content
function ExportDrawerContent({ 
  data, 
  exportData, 
  copied, 
  copyToClipboard 
}: { 
  data: any; 
  exportData: any;
  copied: string | null;
  copyToClipboard: (content: string, label: string) => void;
}) {
  const longCount = data.universe?.long?.length || 0;
  const shortCount = data.universe?.short?.length || 0;

  return (
    <div className="space-y-4">
      {/* Regime */}
      <DataSection
        title="Regime"
        count={null}
        data={data.regime}
        copied={copied}
        copyKey="regime"
        copyToClipboard={copyToClipboard}
      />

      {/* Long */}
      <DataSection
        title="Long Candidates"
        count={longCount}
        data={data.universe?.long || []}
        copied={copied}
        copyKey="long"
        copyToClipboard={copyToClipboard}
      />

      {/* Short */}
      <DataSection
        title="Short Candidates"
        count={shortCount}
        data={data.universe?.short || []}
        copied={copied}
        copyKey="short"
        copyToClipboard={copyToClipboard}
      />

      {/* Full */}
      <DataSection
        title="Export Completo"
        count={null}
        data={exportData}
        copied={copied}
        copyKey="full"
        copyToClipboard={copyToClipboard}
        defaultOpen={false}
      />

      {/* Instructions */}
      <div className="p-3 rounded bg-muted/20 border border-border/30">
        <p className="text-xs text-muted-foreground">
          Copia il JSON e incollalo in VS Code per analisi con i tuoi script.
        </p>
      </div>
    </div>
  );
}

// Data Section Component
function DataSection({
  title,
  count,
  data,
  copied,
  copyKey,
  copyToClipboard,
  defaultOpen = true
}: {
  title: string;
  count: number | null;
  data: any;
  copied: string | null;
  copyKey: string;
  copyToClipboard: (content: string, label: string) => void;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-subtle">
        <span>
          {title}
          {count !== null && <span className="ml-1 text-muted-foreground">({count})</span>}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard(JSON.stringify(data, null, 2), copyKey);
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {copied === copyKey ? '✓' : 'Copia'}
        </button>
      </summary>
      <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-48 font-mono">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

// AI Drawer Content
function AIDrawerContent({ analysis }: { analysis: NasaAnalysisResult | null }) {
  if (!analysis) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">Nessuna analisi disponibile</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="p-3 rounded bg-muted/20 border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Decisione
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            analysis.status.go_no_go === "GO" 
              ? "bg-status-ok/20 text-status-ok"
              : "bg-status-risk/20 text-status-risk"
          }`}>
            {analysis.status.go_no_go}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Stato</span>
            <div className="font-medium text-foreground">{analysis.status.state}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Confidence</span>
            <div className="font-medium text-foreground">{analysis.status.confidence}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Coverage</span>
            <div className="font-medium text-foreground">{analysis.audit.input_coverage_pct}%</div>
          </div>
        </div>
      </div>

      {/* Blocking Reasons */}
      {analysis.status.blocking_reasons.length > 0 && (
        <div className="p-3 rounded bg-status-risk/10 border border-status-risk/30">
          <p className="text-xs font-medium text-status-risk mb-1">Blocchi</p>
          <ul className="text-xs text-status-risk space-y-0.5">
            {analysis.status.blocking_reasons.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sanity Checks */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
          Sanity Checks
        </p>
        <div className="space-y-1">
          {analysis.audit.sanity_checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs">
              <span className="text-muted-foreground">{check.name.replace(/_/g, ' ')}</span>
              <span className={check.pass ? "text-status-ok" : "text-status-risk"}>
                {check.pass ? "OK" : "FAIL"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conflicts */}
      {analysis.audit.conflicts.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
            Conflitti
          </p>
          <ul className="text-xs text-status-attention space-y-1">
            {analysis.audit.conflicts.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta */}
      <div className="pt-2 border-t border-border/30 text-xs text-muted-foreground">
        <div>Run: {analysis.meta.run_id}</div>
        <div>Hash: {analysis.audit.input_hash}</div>
      </div>
    </div>
  );
}
