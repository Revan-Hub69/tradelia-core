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
  return (
    <div className={cn(
      "rounded-lg border-2 border-border bg-background p-4 shadow-sm",
      "hover:border-primary/30 hover:bg-muted/20 hover:shadow-md hover:-translate-y-0.5",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="space-y-2">
        {/* Title */}
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        
        {/* Value */}
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {change && (
            <span className={cn(
              "text-sm font-semibold px-2 py-1 rounded-full",
              trend === 'positive' && "bg-green-50 text-green-700 border border-green-200",
              trend === 'negative' && "bg-red-50 text-red-700 border border-red-200", 
              trend === 'warning' && "bg-amber-50 text-amber-700 border border-amber-200",
              trend === 'neutral' && "bg-muted text-muted-foreground border border-border/50"
            )}>
              {change}
            </span>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-muted-foreground font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}