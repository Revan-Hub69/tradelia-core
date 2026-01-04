"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/dashboard/card";
import { Drawer } from "@/components/dashboard/drawer";
import { AIIcon } from "@/components/icons/dashboard-icons";

type DataExportProps = {
  data: {
    symbol: string;
    regime: any;
    universe: any;
  } | null;
};

// AI Analysis disabled - rate limit issues
// This component now focuses on data export for VS Code analysis
const AI_ENABLED = false;

export function AIAnalysis({ data }: DataExportProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Copy to clipboard helper
  const copyToClipboard = useCallback(async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
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

  // Download JSON file
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

  // No data state
  if (!data) {
    return (
      <Card title="Export Dati" subtitle="Esporta dati per analisi esterna">
        <div className="text-center py-6">
          <AIIcon size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Carica i dati di mercato per abilitare l'export</p>
        </div>
      </Card>
    );
  }

  const exportData = buildExportData();
  const longCount = data.universe?.long?.length || 0;
  const shortCount = data.universe?.short?.length || 0;

  return (
    <>
      <Card 
        title="Export Dati" 
        subtitle="Esporta per analisi in VS Code"
        actions={
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-subtle"
          >
            Visualizza
          </button>
        }
      >
        <div className="space-y-4">
          {/* AI Disabled Notice */}
          {!AI_ENABLED && (
            <div className="p-3 rounded bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">AI disabilitata</span> — Rate limit raggiunto. 
                Usa l'export per analizzare i dati in VS Code.
              </p>
            </div>
          )}

          {/* Data Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded bg-muted/20 border border-border/30 text-center">
              <div className="text-lg font-medium text-foreground">{data.symbol}</div>
              <div className="text-xs text-muted-foreground">Anchor</div>
            </div>
            <div className="p-3 rounded bg-muted/20 border border-border/30 text-center">
              <div className="text-lg font-medium text-status-ok">{longCount}</div>
              <div className="text-xs text-muted-foreground">Long</div>
            </div>
            <div className="p-3 rounded bg-muted/20 border border-border/30 text-center">
              <div className="text-lg font-medium text-status-risk">{shortCount}</div>
              <div className="text-xs text-muted-foreground">Short</div>
            </div>
          </div>

          {/* Regime Info */}
          {data.regime && (
            <div className="p-3 rounded bg-muted/20 border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Regime</span>
                <span className="text-xs font-medium text-foreground">
                  {data.regime.regime4h?.regime || data.regime.regime || "N/A"}
                </span>
              </div>
              {data.regime.regime4h?.metrics?.atr14 && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">ATR14</span>
                  <span className="text-xs font-medium text-foreground">
                    {Number(data.regime.regime4h.metrics.atr14).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Export Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyToClipboard(JSON.stringify(exportData, null, 2), 'all')}
              className="flex-1 min-w-[100px] px-3 py-2 text-xs font-medium rounded border border-border/50 hover:bg-muted/30 transition-subtle"
            >
              {copied === 'all' ? '✓ Copiato' : 'Copia JSON'}
            </button>
            <button
              onClick={() => downloadJson(exportData!, `tradelia-${data.symbol}-${Date.now()}.json`)}
              className="flex-1 min-w-[100px] px-3 py-2 text-xs font-medium rounded bg-foreground text-background hover:bg-foreground/90 transition-subtle"
            >
              Download
            </button>
          </div>

          {/* Quick Copy Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyToClipboard(JSON.stringify(data.regime, null, 2), 'regime')}
              className="px-2 py-1 text-xs rounded border border-border/50 hover:bg-muted/30 transition-subtle"
            >
              {copied === 'regime' ? '✓' : 'Regime'}
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(data.universe?.long || [], null, 2), 'long')}
              className="px-2 py-1 text-xs rounded border border-border/50 hover:bg-muted/30 transition-subtle"
            >
              {copied === 'long' ? '✓' : 'Long'}
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify(data.universe?.short || [], null, 2), 'short')}
              className="px-2 py-1 text-xs rounded border border-border/50 hover:bg-muted/30 transition-subtle"
            >
              {copied === 'short' ? '✓' : 'Short'}
            </button>
          </div>
        </div>
      </Card>

      {/* Data Viewer Drawer */}
      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title="Dati Raw"
        size="compact"
      >
        <div className="space-y-6">
          {/* Regime Data */}
          <details className="group" open>
            <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-subtle flex items-center justify-between">
              <span>Regime Data</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(JSON.stringify(data.regime, null, 2), 'regime-drawer');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {copied === 'regime-drawer' ? '✓ Copiato' : 'Copia'}
              </button>
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-48 font-mono">
              {JSON.stringify(data.regime, null, 2)}
            </pre>
          </details>

          {/* Long Candidates */}
          <details className="group">
            <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-subtle flex items-center justify-between">
              <span>Long Candidates ({longCount})</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(JSON.stringify(data.universe?.long || [], null, 2), 'long-drawer');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {copied === 'long-drawer' ? '✓ Copiato' : 'Copia'}
              </button>
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-48 font-mono">
              {JSON.stringify(data.universe?.long || [], null, 2)}
            </pre>
          </details>

          {/* Short Candidates */}
          <details className="group">
            <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-subtle flex items-center justify-between">
              <span>Short Candidates ({shortCount})</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(JSON.stringify(data.universe?.short || [], null, 2), 'short-drawer');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {copied === 'short-drawer' ? '✓ Copiato' : 'Copia'}
              </button>
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-48 font-mono">
              {JSON.stringify(data.universe?.short || [], null, 2)}
            </pre>
          </details>

          {/* Full Export */}
          <details className="group">
            <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-subtle flex items-center justify-between">
              <span>Export Completo</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(JSON.stringify(exportData, null, 2), 'full-drawer');
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {copied === 'full-drawer' ? '✓ Copiato' : 'Copia'}
              </button>
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded overflow-auto max-h-64 font-mono">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </details>

          {/* Usage Instructions */}
          <div className="p-3 rounded bg-muted/20 border border-border/30">
            <p className="text-xs font-medium text-foreground mb-2">Come usare in VS Code:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copia il JSON desiderato</li>
              <li>Crea un file .json in VS Code</li>
              <li>Incolla e analizza con i tuoi script</li>
            </ol>
          </div>
        </div>
      </Drawer>
    </>
  );
}
