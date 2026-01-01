// Market Data Dashboard Hook
// Custom hook for managing dashboard data and real-time updates

import { useState, useEffect, useCallback } from 'react';

export interface MarketDataStatus {
  ok: boolean;
  data: {
    currentRuns: any[];
    recentRuns: any[];
    statistics: {
      totalEvents: number;
      totalCandles: number;
      totalTrades: number;
      symbolsCount: number;
      latestEvent: string | null;
      totalRunDuration: string | null;
    };
    kpis: {
      totalTrades: number;
      winRate: number;
      avgReturn: number;
      expectancy: number;
      maxDrawdown: number;
      sharpeRatio: number;
      rDistribution: {
        min: number;
        max: number;
        avg: number;
        std: number;
      };
      avgSlippage: number;
      avgHoldTime: number;
      profitFactor: number;
    };
    readiness: {
      status: 'GREEN' | 'YELLOW' | 'RED';
      score: number;
      criteria: Array<{
        name: string;
        status: 'PASS' | 'WARN' | 'FAIL';
        value: any;
        threshold: any;
      }>;
      recommendation: string;
    };
    timestamp: string;
  };
}

export interface HealthStatus {
  ok: boolean;
  status: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
  timestamp: string;
  uptime: number;
  checks: Array<{
    name?: string;
    status: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
    responseTime: number;
    details?: any;
    error?: string;
  }>;
}

export interface DashboardState {
  marketDataStatus: MarketDataStatus | null;
  healthStatus: HealthStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date;
}

export function useMarketDataDashboard(refreshInterval = 30000) {
  const [state, setState] = useState<DashboardState>({
    marketDataStatus: null,
    healthStatus: null,
    loading: true,
    error: null,
    lastUpdate: new Date(),
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const headers: HeadersInit = {};
      const apiKey = process.env.NEXT_PUBLIC_MARKET_DATA_API_KEY;
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      // Fetch market data status
      const marketDataResponse = await fetch('/api/market-data/status', { headers });
      if (!marketDataResponse.ok) {
        throw new Error(`Market data API error: ${marketDataResponse.status}`);
      }
      const marketData = await marketDataResponse.json();

      // Fetch health status
      const healthResponse = await fetch('/api/health/detailed', { headers });
      if (!healthResponse.ok) {
        throw new Error(`Health API error: ${healthResponse.status}`);
      }
      const health = await healthResponse.json();

      setState(prev => ({
        ...prev,
        marketDataStatus: marketData,
        healthStatus: health,
        loading: false,
        error: null,
        lastUpdate: new Date(),
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('Dashboard fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Utility functions for dashboard
export const dashboardUtils = {
  getStatusColor: (status: string) => {
    switch (status) {
      case 'GREEN':
      case 'HEALTHY':
      case 'PASS':
        return 'text-green-600 bg-green-50';
      case 'YELLOW':
      case 'DEGRADED':
      case 'WARN':
        return 'text-yellow-600 bg-yellow-50';
      case 'RED':
      case 'UNHEALTHY':
      case 'FAIL':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  },

  formatNumber: (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  formatDuration: (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },

  formatPercentage: (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  getStatusBadgeVariant: (status: string) => {
    switch (status) {
      case 'GREEN':
      case 'HEALTHY':
      case 'PASS':
        return 'default';
      case 'YELLOW':
      case 'DEGRADED':
      case 'WARN':
        return 'secondary';
      case 'RED':
      case 'UNHEALTHY':
      case 'FAIL':
        return 'destructive';
      default:
        return 'outline';
    }
  },
};
