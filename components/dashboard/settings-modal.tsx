"use client";

import { useState, useEffect, useCallback } from "react";
import { CloseIcon } from "@/components/icons/dashboard-icons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthStatus {
  ts: number;
  services: {
    binance_rest: {
      ok: boolean;
      status: number;
      ms: number;
      error?: string;
    };
    groq_env: {
      ok: boolean;
    };
  };
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [groqKey, setGroqKey] = useState("");
  const [hasLocalKey, setHasLocalKey] = useState<boolean | null>(null);
  const [localSecretsPath, setLocalSecretsPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date().toLocaleString());
  }, []);

  const loadHealthStatus = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/trading/health", { method: "GET", cache: "no-store" });
      if (res.ok) {
        const health = await res.json();
        setHealthStatus(health);
      }
    } catch (error) {
      console.error("Failed to load health status:", error);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const loadLocalSecretsStatus = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/trading/local/secrets", { method: "GET", cache: "no-store" });
      if (res.status === 404) {
        setLocalSecretsPath(null);
        setHasLocalKey(null);
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Impossibile leggere lo stato secrets.");
      setLocalSecretsPath(typeof json.secretsPath === "string" ? json.secretsPath : null);
      setHasLocalKey(Boolean(json.hasGroqApiKey));
    } catch (error) {
      setLocalSecretsPath(null);
      setHasLocalKey(null);
      setError(error instanceof Error ? error.message : "Impossibile leggere lo stato secrets.");
    }
  }, []);

  const saveGroqKey = useCallback(async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/trading/local/secrets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groqApiKey: groqKey }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Salvataggio secrets fallito.");
      setLocalSecretsPath(typeof json.secretsPath === "string" ? json.secretsPath : null);
      setHasLocalKey(Boolean(json.hasGroqApiKey));
      setGroqKey("");
      setMessage("Groq key salvata (solo locale)");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Salvataggio secrets fallito.");
    } finally {
      setSaving(false);
    }
  }, [groqKey]);

  const launchWsDaemon = useCallback(async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/trading/local/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "ws-daemon" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Impossibile avviare ws-daemon.");
      setMessage(json.message || "WS Daemon avviato");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossibile avviare ws-daemon.");
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    loadLocalSecretsStatus();
    loadHealthStatus();
  }, [isOpen, loadLocalSecretsStatus, loadHealthStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card border border-border/50 rounded shadow-xl max-h-[85dvh] overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Dashboard Settings</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/30 transition-subtle">
            <CloseIcon size={16} />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(85dvh-56px)]">
          {(error || message) && (
            <div className={`mb-6 p-4 rounded border ${error ? 'bg-status-risk/10 border-status-risk/30' : 'bg-status-ok/10 border-status-ok/30'}`}>
              <div className={`text-sm ${error ? 'text-status-risk' : 'text-status-ok'}`}>
                {error || message}
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* System Controls */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">System Controls</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">WebSocket Daemon</p>
                    <p className="text-xs text-muted-foreground">Avvia il daemon WS per dati real-time</p>
                  </div>
                  <button
                    onClick={launchWsDaemon}
                    className="inline-flex items-center px-3 py-2 border border-border/50 text-sm leading-4 font-medium rounded text-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary transition-subtle"
                  >
                    Launch WS Daemon
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">Development Commands</p>
                    <p className="text-xs text-muted-foreground">Comandi per sviluppo locale</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigator.clipboard?.writeText("npm run dev:local")}
                      className="inline-flex items-center px-3 py-1 border border-border/50 text-xs font-medium rounded text-muted-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary transition-subtle"
                    >
                      Copy dev:local
                    </button>
                    <button
                      onClick={() => navigator.clipboard?.writeText("npm run ws:daemon")}
                      className="inline-flex items-center px-3 py-1 border border-border/50 text-xs font-medium rounded text-muted-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary transition-subtle"
                    >
                      Copy ws:daemon
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Configuration */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">AI Configuration</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                    hasLocalKey === null 
                      ? "bg-muted/30 text-muted-foreground border-border/50"
                      : hasLocalKey 
                      ? "bg-status-ok/20 text-status-ok border-status-ok/30"
                      : "bg-status-risk/20 text-status-risk border-status-risk/30"
                  }`}>
                    {hasLocalKey === null ? "Unknown" : hasLocalKey ? "Configured" : "Missing"}
                  </span>
                  <span className="text-muted-foreground">Groq API Key Status</span>
                </div>
                
                {localSecretsPath && (
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded font-mono break-all border border-border/50">
                    Path: {localSecretsPath}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    New API Key
                  </label>
                  <input
                    type="password"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder={hasLocalKey === null ? "Disponibile solo in locale" : "gsk_..."}
                    className="w-full px-3 py-2 border border-border/50 rounded bg-background focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-subtle"
                    disabled={hasLocalKey === null}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lascia vuoto e salva per rimuovere la key locale (torna a GROQ_API_KEY env)
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={saveGroqKey}
                    disabled={saving || hasLocalKey === null}
                    className="inline-flex items-center px-4 py-2 border border-border/50 text-sm font-medium rounded text-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-subtle"
                  >
                    {saving ? "Saving..." : "Save Key"}
                  </button>
                  <button
                    onClick={() => {
                      setGroqKey("");
                      setError(null);
                      setMessage(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-border/50 text-sm font-medium rounded text-muted-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary transition-subtle"
                  >
                    Reset
                  </button>
                  <button
                    onClick={loadLocalSecretsStatus}
                    className="inline-flex items-center px-4 py-2 border border-border/50 text-sm font-medium rounded text-muted-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary transition-subtle"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4">System Info</h4>
              <div className="bg-muted/30 rounded p-4 text-sm text-muted-foreground space-y-1 border border-border/50">
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <span className="font-medium text-foreground">Development</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-medium text-foreground">Local-first</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium text-foreground">{currentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>URL:</span>
                  <span className="font-medium font-mono text-xs text-foreground">http://localhost:3001/dashboard/trading</span>
                </div>
              </div>
            </div>

            {/* API Health Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-foreground">API Health Status</h4>
                <button
                  onClick={loadHealthStatus}
                  disabled={healthLoading}
                  className="inline-flex items-center px-3 py-1 border border-border/50 text-xs font-medium rounded text-muted-foreground bg-background hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-subtle"
                >
                  {healthLoading ? "Checking..." : "Refresh"}
                </button>
              </div>
              <div className="space-y-3">
                {healthStatus ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">Binance REST API</p>
                        <p className="text-xs text-muted-foreground">Market data source</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                          healthStatus.services.binance_rest.ok
                            ? "bg-status-ok/20 text-status-ok border-status-ok/30"
                            : "bg-status-risk/20 text-status-risk border-status-risk/30"
                        }`}>
                          {healthStatus.services.binance_rest.ok ? "Online" : "Offline"}
                        </span>
                        {healthStatus.services.binance_rest.ok && (
                          <span className="text-xs text-muted-foreground">
                            {healthStatus.services.binance_rest.ms}ms
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">Groq AI API</p>
                        <p className="text-xs text-muted-foreground">AI analysis service</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        healthStatus.services.groq_env.ok
                          ? "bg-status-ok/20 text-status-ok border-status-ok/30"
                          : "bg-status-risk/20 text-status-risk border-status-risk/30"
                      }`}>
                        {healthStatus.services.groq_env.ok ? "Configured" : "Missing Key"}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last check: {new Date(healthStatus.ts).toLocaleTimeString()}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      {healthLoading ? "Checking API status..." : "Click Refresh to check API status"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}