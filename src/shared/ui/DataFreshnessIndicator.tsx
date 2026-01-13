/**
 * Data Freshness Indicator - Tradelia 2026
 * 
 * Componente per indicare la freschezza dei dati nelle card
 */

'use client';

import { forwardRef, useEffect, useState } from 'react';
import { cn } from './utils';

// Define DataFreshness type locally to avoid import from entities layer
type DataFreshness = 'fresh' | 'stale' | 'offline' | 'error';

interface DataFreshnessIndicatorProps {
  freshness: DataFreshness;
  lastUpdated?: Date;
  className?: string;
}

const freshnessConfig = {
  fresh: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '●',
    label: 'Fresh data'
  },
  stale: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: '◐',
    label: 'Stale data'
  },
  offline: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: '○',
    label: 'Offline data'
  },
  error: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '✕',
    label: 'Error loading data'
  }
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export const DataFreshnessIndicator = forwardRef<HTMLDivElement, DataFreshnessIndicatorProps>(
  ({ freshness, lastUpdated, className }, ref) => {
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
      setIsClient(true);
      if (lastUpdated) {
        setTimeAgo(formatTimeAgo(lastUpdated));
        
        // Update every minute
        const interval = setInterval(() => {
          setTimeAgo(formatTimeAgo(lastUpdated));
        }, 60000);
        
        return () => clearInterval(interval);
      }
    }, [lastUpdated]);
    
    const config = freshnessConfig[freshness];
    
    // Show placeholder during SSR to prevent hydration mismatch
    if (!isClient) {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border',
            config.color,
            config.bgColor,
            config.borderColor,
            className
          )}
        >
          <span className="text-xs" aria-hidden="true">
            {config.icon}
          </span>
          <span className="font-medium">
            {config.label}
          </span>
        </div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border',
          config.color,
          config.bgColor,
          config.borderColor,
          className
        )}
        title={`${config.label}${lastUpdated ? ` - Updated ${timeAgo}` : ''}`}
      >
        <span className="text-xs" aria-hidden="true">
          {config.icon}
        </span>
        <span className="font-medium">
          {lastUpdated && timeAgo ? timeAgo : config.label}
        </span>
      </div>
    );
  }
);

DataFreshnessIndicator.displayName = 'DataFreshnessIndicator';