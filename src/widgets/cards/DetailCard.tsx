/**
 * Detail Card - Tradelia 2026
 * 
 * Card per informazioni approfondite, tabelle e liste
 * Con indicatori di freschezza dati e fonti
 * Density-aware: responds to compact/comfortable mode (REQ 20.2)
 */

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/shared/ui/utils';
import { DataFreshnessIndicator } from '@/shared/ui/DataFreshnessIndicator';

interface DetailCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  lastUpdated?: Date;
  dataSource?: string;
  isLoading?: boolean;
  className?: string;
}

export function DetailCard({
  title,
  subtitle,
  children,
  lastUpdated,
  dataSource,
  isLoading = false,
  className
}: DetailCardProps) {
  if (isLoading) {
    return (
      <div className={cn(
        "rounded border-2 border-border bg-background density-card shadow-sm",
        className
      )}>
        <div className="animate-pulse density-gap flex flex-col">
          <div className="density-gap flex flex-col">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="density-gap flex flex-col">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border-2 border-border bg-background density-card shadow-sm",
      "hover:border-primary/30 hover:bg-muted/20 hover:shadow-md hover:-translate-y-0.5",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="density-gap flex flex-col">
        {/* Header */}
        <div className="density-gap flex flex-col">
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="density-text-secondary text-muted-foreground font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          {children}
        </div>

        {/* Data Freshness */}
        {lastUpdated && (
          <div className="pt-[var(--density-item-gap)] border-t border-border/50">
            <DataFreshnessIndicator
              freshness="fresh"
              lastUpdated={lastUpdated}
            />
            {dataSource && (
              <p className="density-text-tertiary text-muted-foreground mt-2 font-medium">
                Fonte: {dataSource}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}