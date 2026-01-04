"use client";

import { useState, useEffect, useCallback } from "react";
import { CloseIcon } from "@/components/icons/dashboard-icons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [groqKey, setGroqKey] = useState("");
  const [hasLocalKey, setHasLocalKey] = useState<boolean | null>(null);
  const [localSecretsPath, setLocalSecretsPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
  }, [isOpen, loadLocalSecretsStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-card rounded border border-border/50 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-foreground">
                    Dashboard Settings
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted/30 transition-subtle"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

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
                        <span className="font-medium text-foreground">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>URL:</span>
                        <span className="font-medium font-mono text-xs text-foreground">http://localhost:3001/dashboard/trading</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded border border-border/50 px-4 py-2 bg-background text-base font-medium text-foreground hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm transition-subtle"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}