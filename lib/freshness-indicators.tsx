import { ClockIcon, CalendarIcon, WifiIcon, WifiOffIcon } from '@/components/icons/TradeliaIcons';

export type DataCategory = 'freshness-critical' | 'stale-allowed' | 'static-snapshot' | 'immutable-asset';
export type FreshnessStatus = 'fresh' | 'stale' | 'snapshot' | 'offline';

export interface FreshnessData {
  category: DataCategory;
  status: FreshnessStatus;
  timestamp?: number;
  age?: number;
  nextUpdate?: number;
}

export function FreshnessIndicator({ data }: { data: FreshnessData }) {
  const { category, status, timestamp, age, nextUpdate } = data;

  // Freshness-Critical indicators
  if (category === 'freshness-critical') {
    if (status === 'fresh') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">
            Live • {timestamp ? formatTime(timestamp) : 'now'}
          </span>
        </div>
      );
    } else if (status === 'offline') {
      return (
        <div className="flex items-center gap-2">
          <WifiOffIcon className="w-3 h-3 text-red-500" />
          <span className="text-xs text-red-600 font-medium">
            Offline • Real-time data unavailable
          </span>
        </div>
      );
    }
  }

  // Stale-Allowed indicators
  if (category === 'stale-allowed') {
    if (status === 'fresh') {
      return (
        <div className="flex items-center gap-2">
          <WifiIcon className="w-3 h-3 text-green-500" />
          <span className="text-xs text-muted-foreground">
            Updated {timestamp ? formatTimeAgo(timestamp) : 'now'}
          </span>
        </div>
      );
    } else if (status === 'stale') {
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="w-3 h-3 text-amber-500" />
          <span className="text-xs text-amber-600">
            Last updated {timestamp ? formatTimeAgo(timestamp) : 'unknown'}
          </span>
        </div>
      );
    }
  }

  // Static-Snapshot indicators
  if (category === 'static-snapshot') {
    return (
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Snapshot: {timestamp ? formatDate(timestamp) : 'unknown'}
          {nextUpdate && ` • Next: ${formatDate(nextUpdate)}`}
        </span>
      </div>
    );
  }

  // Immutable-Asset (no indicator needed)
  return null;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Hook for extracting freshness data from fetch responses
export function useFreshnessData(response: Response): FreshnessData {
  const category = (response.headers.get('X-Data-Category') as DataCategory) || 'freshness-critical';
  const freshness = response.headers.get('X-Data-Freshness') as FreshnessStatus || 'fresh';
  const cacheStatus = response.headers.get('X-Cache-Status');
  const ageHeader = response.headers.get('X-Data-Age');
  
  const result: FreshnessData = {
    category,
    status: freshness,
    timestamp: Date.now()
  };
  
  // Only add age if it exists and is valid
  if (ageHeader) {
    const parsedAge = parseInt(ageHeader) * 1000;
    if (!isNaN(parsedAge)) {
      result.age = parsedAge;
    }
  }
  
  return result;
}

// Utility for API calls with freshness awareness
export async function fetchWithFreshness(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  const freshnessData = useFreshnessData(response);
  const data = await response.json();
  
  return {
    data,
    freshness: freshnessData,
    ok: response.ok,
    status: response.status
  };
}

// Component for displaying data age warnings
export function DataAgeWarning({ data }: { data: FreshnessData }) {
  if (data.category !== 'stale-allowed' || data.status !== 'stale') {
    return null;
  }

  const ageInMinutes = data.age ? Math.floor(data.age / 60000) : 0;
  
  if (ageInMinutes > 30) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-amber-800">Data may be outdated</span>
        </div>
        <p className="text-amber-700 mt-1">
          This information was last updated {ageInMinutes} minutes ago. 
          Some details may have changed.
        </p>
      </div>
    );
  }

  return null;
}