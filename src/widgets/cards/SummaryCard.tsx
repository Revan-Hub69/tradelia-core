/**
 * Summary Card Component - Tradelia 2026
 * 
 * Card per visualizzare metriche e KPI con trend
 * Segue i principi Tradelia 2026: verificabilità > opinione, neutralità > bias
 */

import { forwardRef } from 'react';
import { AdvancedCard } from './AdvancedCard';
import { cn } from '@/shared/ui/utils';
import type { SummaryCardData, BaseCardProps } from '@/entities/card';

interface SummaryCardProps extends Omit<BaseCardProps, 'type' | 'id' | 'title' | 'subtitle' | 'lastUpdated' | 'dataSource' | 'freshness'> {
  data: SummaryCardData;
}

function formatValue(value: string | number): string {
  if (typeof value === 'number') {
    // Format numbers with appropriate precision
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  }
  return value;
}

function formatPercentage(percentage: number): string {
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
}

export const SummaryCard = forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ data, ...props }, ref) => {
    const { value, change, trend } = data;
    
    // Prepare props, only including defined values
    const cardProps: any = {
      ref,
      ...props,
      type: "summary" as const,
      id: data.id,
      title: data.title,
    };
    
    if (data.subtitle !== undefined) cardProps.subtitle = data.subtitle;
    if (data.freshness !== undefined) cardProps.freshness = data.freshness;
    if (data.lastUpdated !== undefined) cardProps.lastUpdated = data.lastUpdated;
    if (data.dataSource !== undefined) cardProps.dataSource = data.dataSource;
    
    return (
      <AdvancedCard {...cardProps}>
        <div className="space-y-4">
          {/* Main value */}
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatValue(value)}
            </div>
            
            {/* Change indicator */}
            {change && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    change.direction === 'up' && 'text-green-600',
                    change.direction === 'down' && 'text-red-600',
                    change.direction === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change.direction === 'up' && '↗'}
                  {change.direction === 'down' && '↘'}
                  {change.direction === 'neutral' && '→'}
                  {formatPercentage(change.percentage)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({formatValue(change.value)})
                </span>
              </div>
            )}
          </div>

          {/* Mini trend chart */}
          {trend && trend.length > 1 && (
            <div className="h-12 flex items-end justify-between gap-1">
              {trend.map((point, index) => {
                const maxValue = Math.max(...trend.map(p => p.value));
                const minValue = Math.min(...trend.map(p => p.value));
                const range = maxValue - minValue;
                const height = range > 0 
                  ? ((point.value - minValue) / range) * 100 
                  : 50;
                
                return (
                  <div
                    key={index}
                    className="flex-1 bg-primary/20 rounded-sm"
                    style={{ height: `${Math.max(height, 10)}%` }}
                    title={`${point.date}: ${formatValue(point.value)}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </AdvancedCard>
    );
  }
);

SummaryCard.displayName = 'SummaryCard';