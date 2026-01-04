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
        <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">
                    Dashboard Settings
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

                {(error || message) && (
                  <div className={`mb-6 p-4 rounded-md ${error ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className={`text-sm ${error ? 'text-red-700' : 'text-emerald-700'}`}>
                      {error || message}
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {/* System Controls */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-4">System Controls</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <div>
                          <p className="text-sm font-medium text-slate-900">WebSocket Daemon</p>
                          <p className="text-xs text-slate-500">Avvia il daemon WS per dati real-time</p>
                        </div>
                        <button
                          onClick={launchWsDaemon}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                          Launch WS Daemon
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Development Commands</p>
                          <p className="text-xs text-slate-500">Comandi per sviluppo locale</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigator.clipboard?.writeText("npm run dev:local")}
                            className="inline-flex items-center px-3 py-1 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                          >
                            Copy dev:local
                          </button>
                          <button
                            onClick={() => navigator.clipboard?.writeText("npm run ws:daemon")}
                            className="inline-flex items-center px-3 py-1 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                          >
                            Copy ws:daemon
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Configuration */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-4">AI Configuration</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          hasLocalKey === null 
                            ? "bg-slate-100 text-slate-800 border-slate-200"
                            : hasLocalKey 
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}>
                          {hasLocalKey === null ? "Unknown" : hasLocalKey ? "Configured" : "Missing"}
                        </span>
                        <span className="text-slate-600">Groq API Key Status</span>
                      </div>
                      
                      {localSecretsPath && (
                        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded font-mono break-all">
                          Path: {localSecretsPath}
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New API Key
                        </label>
                        <input
                          type="password"
                          value={groqKey}
                          onChange={(e) => setGroqKey(e.target.value)}
                          placeholder={hasLocalKey === null ? "Disponibile solo in locale" : "gsk_..."}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-sm"
                          disabled={hasLocalKey === null}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Lascia vuoto e salva per rimuovere la key locale (torna a GROQ_API_KEY env)
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={saveGroqKey}
                          disabled={saving || hasLocalKey === null}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-colors"
                        >
                          {saving ? "Saving..." : "Save Key"}
                        </button>
                        <button
                          onClick={() => {
                            setGroqKey("");
                            setError(null);
                            setMessage(null);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                          Reset
                        </button>
                        <button
                          onClick={loadLocalSecretsStatus}
                          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                          Refresh Status
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-4">System Info</h4>
                    <div className="bg-slate-50 rounded-md p-4 text-sm text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Environment:</span>
                        <span className="font-medium">Development</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mode:</span>
                        <span className="font-medium">Local-first</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>URL:</span>
                        <span className="font-medium font-mono text-xs">http://localhost:3001/dashboard/trading</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}