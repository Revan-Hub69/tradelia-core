/**
 * Summary Card - Tradelia 2026
 * 
 * Card per visualizzare metriche chiave e KPI
 * Design minimalista seguendo i principi Tradelia
 */

'use client';

import { cn } from '@/shared/ui/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'positive' | 'negative' | 'neutral' | 'warning';
  change?: string;
  className?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  trend = 'neutral', 
  change,
  className 
}: SummaryCardProps) {
  const trendColors = {
    positive: 'text-green-700',
    negative: 'text-red-700',
    neutral: 'text-muted-foreground',
    warning: 'text-amber-700'
  };

  return (
    <div className={cn(
      "rounded border-2 border-border bg-background p-4 shadow-sm",
      "hover:border-border hover:bg-muted/30 hover:translate-y-[-1px]",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="space-y-2">
        {/* Title */}
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        
        {/* Value */}
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {change && (
            <span className={cn(
              "text-xs font-medium",
              trendColors[trend]
            )}>
              {change}
            </span>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}