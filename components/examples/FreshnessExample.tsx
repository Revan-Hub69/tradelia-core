'use client';

import { useState, useEffect } from 'react';
import { FreshnessIndicator, DataAgeWarning, type FreshnessData } from '@/lib/freshness-indicators';

// Health data type
interface HealthData {
  status: string;
  timestamp: number;
}

// Esempio di componente che utilizza il sistema di freshness
export function FreshnessExample() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [healthFreshness, setHealthFreshness] = useState<FreshnessData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      // Simula una chiamata API con freshness awareness
      // Per ora usiamo dati mock, in futuro sarà sostituito con vera API
      const mockData = { status: 'healthy', timestamp: Date.now() };
      
      // Simula freshness data per il test
      setHealthData(mockData);
      setHealthFreshness({
        category: 'freshness-critical',
        status: 'fresh',
        timestamp: Date.now()
      });
    } catch (error) {
      // Simula dati offline
      setHealthFreshness({
        category: 'freshness-critical',
        status: 'offline',
        timestamp: Date.now()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Data Freshness Contract - Live Example
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Questo esempio dimostra come il sistema di freshness categorizza e visualizza 
          lo stato dei dati in tempo reale.
        </p>
      </div>

      {/* Freshness-Critical Example */}
      <div className="rounded border-2 border-border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Trading System Health</h3>
          <button 
            onClick={fetchHealthData}
            disabled={loading}
            className="text-xs px-3 py-1 rounded border border-border hover:bg-muted/30 transition-colors"
          >
            {loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {healthFreshness && (
          <div className="mb-3">
            <FreshnessIndicator data={healthFreshness} />
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <strong>Category:</strong> Freshness-Critical<br />
          <strong>Policy:</strong> Network-first, no cache<br />
          <strong>Rationale:</strong> System health affects trading decisions
        </div>

        {healthData && (
          <div className="mt-3 p-3 rounded bg-muted/30 text-xs">
            <pre>{JSON.stringify(healthData, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Stale-Allowed Example */}
      <div className="rounded border-2 border-border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">User Preferences</h3>
        </div>

        <div className="mb-3">
          <FreshnessIndicator 
            data={{
              category: 'stale-allowed',
              status: 'stale',
              timestamp: Date.now() - 1800000, // 30 minutes ago
              age: 1800000
            }} 
          />
        </div>

        <DataAgeWarning 
          data={{
            category: 'stale-allowed',
            status: 'stale',
            timestamp: Date.now() - 1800000,
            age: 1800000
          }} 
        />

        <div className="text-sm text-muted-foreground mt-3">
          <strong>Category:</strong> Stale-Allowed<br />
          <strong>Policy:</strong> Stale-while-revalidate, 30min TTL<br />
          <strong>Rationale:</strong> Configuration data, not time-sensitive
        </div>
      </div>

      {/* Static-Snapshot Example */}
      <div className="rounded border-2 border-border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Daily Market Report</h3>
        </div>

        <div className="mb-3">
          <FreshnessIndicator 
            data={{
              category: 'static-snapshot',
              status: 'snapshot',
              timestamp: Date.now() - 86400000, // Yesterday
              nextUpdate: Date.now() + 3600000 // In 1 hour
            }} 
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <strong>Category:</strong> Static-Snapshot<br />
          <strong>Policy:</strong> Cache-first with validation, 24h TTL<br />
          <strong>Rationale:</strong> Daily reports are static by design
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="rounded border border-border/50 bg-muted/20 p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Implementation Notes</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Service Worker rispetta automaticamente le policy di categoria</li>
          <li>• UI indicators mostrano chiaramente lo stato di freshness</li>
          <li>• Dati freshness-critical non vengono mai serviti da cache</li>
          <li>• Warnings automatici per dati troppo vecchi</li>
          <li>• Fallback graceful per situazioni offline</li>
        </ul>
      </div>
    </div>
  );
}