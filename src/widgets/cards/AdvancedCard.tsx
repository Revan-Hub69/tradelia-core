/**
 * Advanced Card Component - Tradelia 2026
 * 
 * Card modulare avanzata con expand/collapse, drag & drop, e stati di errore
 * Segue i principi Tradelia 2026: chiarezza > persuasione, neutralità > bias
 * Density-aware: responds to compact/comfortable mode (REQ 20.2)
 */

import { forwardRef, useState } from 'react';
import { cn, transitionSubtle } from '@/shared/ui/utils';
import { DataFreshnessIndicator } from '@/shared/ui/DataFreshnessIndicator';
import { Button } from '@/shared/ui/Button';
import type { BaseCardProps } from '@/entities/card';

export const AdvancedCard = forwardRef<HTMLDivElement, BaseCardProps>(
  ({ 
    id,
    type,
    title,
    subtitle,
    isLoading = false,
    isError = false,
    errorMessage,
    onRetry,
    isDraggable = false,
    isExpandable = false,
    isExpanded = false,
    onToggleExpand,
    freshness,
    lastUpdated,
    dataSource,
    children,
    className,
    ...props 
  }, ref) => {
    const [localExpanded, setLocalExpanded] = useState(isExpanded);
    
    const handleToggleExpand = () => {
      const newExpanded = !localExpanded;
      setLocalExpanded(newExpanded);
      onToggleExpand?.();
    };

    // Loading skeleton - density-aware
    if (isLoading) {
      return (
        <div
          ref={ref}
          data-card-id={id}
          className={cn(
            'rounded border-2 border-border bg-background density-card shadow-sm animate-pulse',
            className
          )}
          aria-busy="true"
          aria-label="Caricamento dati..."
          {...props}
        >
          <div className="density-gap flex flex-col">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-1/3" />
              {freshness && (
                <div className="h-6 bg-muted rounded w-16" />
              )}
            </div>
            {subtitle && <div className="h-3 bg-muted rounded w-1/2" />}
            <div className="density-gap flex flex-col">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      );
    }

    // Error state - density-aware
    if (isError) {
      return (
        <div
          ref={ref}
          data-card-id={id}
          className={cn(
            'rounded border-2 border-red-200 bg-red-50 density-card shadow-sm',
            transitionSubtle,
            className
          )}
          role="alert"
          aria-label="Errore nel caricamento dei dati"
          {...props}
        >
          <div className="density-gap flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="density-text-secondary font-semibold text-red-800">
                Errore caricamento
              </h3>
              {freshness && (
                <DataFreshnessIndicator 
                  freshness="error" 
                  {...(lastUpdated && { lastUpdated })}
                />
              )}
            </div>
            <p className="density-text-tertiary text-red-700">
              {errorMessage || 'Impossibile caricare i dati richiesti'}
            </p>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100 min-h-[24px]"
              >
                Riprova
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-card-id={id}
        data-card-type={type}
        className={cn(
          // Base styles seguendo Tradelia 2026 - density-aware padding
          'rounded border-2 border-border bg-background density-card shadow-sm',
          transitionSubtle,
          // Drag & drop styles with min 24px target
          isDraggable && [
            'cursor-grab active:cursor-grabbing',
            'hover:bg-muted/30 hover:-translate-y-px hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
            'min-h-[24px]'
          ],
          // Expandable styles
          isExpandable && 'cursor-pointer',
          className
        )}
        draggable={isDraggable}
        tabIndex={isDraggable || isExpandable ? 0 : undefined}
        role={isDraggable ? 'button' : undefined}
        aria-label={isDraggable ? `Trascina ${title}` : undefined}
        aria-expanded={isExpandable ? localExpanded : undefined}
        onClick={isExpandable ? handleToggleExpand : undefined}
        {...props}
      >
        {/* Header - density-aware spacing */}
        <div className="flex items-start justify-between mb-[var(--density-item-gap)]">
          <div className="flex-1 min-w-0">
            <h3 className="density-text-secondary font-semibold text-foreground truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="density-text-tertiary text-muted-foreground mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            {/* Data freshness indicator */}
            {freshness && (
              <DataFreshnessIndicator 
                freshness={freshness} 
                {...(lastUpdated && { lastUpdated })}
              />
            )}
            
            {/* Expand/collapse button - min 24px target */}
            {isExpandable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
                className={cn(
                  'p-1 rounded text-muted-foreground hover:text-foreground min-w-[24px] min-h-[24px] flex items-center justify-center',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                  transitionSubtle
                )}
                aria-label={localExpanded ? 'Comprimi' : 'Espandi'}
              >
                <svg 
                  className={cn('density-icon transition-transform', localExpanded && 'rotate-180')}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {/* Drag handle - min 24px target */}
            {isDraggable && (
              <div 
                className="p-1 text-muted-foreground cursor-grab active:cursor-grabbing min-w-[24px] min-h-[24px] flex items-center justify-center"
                aria-hidden="true"
              >
                <svg className="density-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div 
          className={cn(
            'overflow-hidden transition-all duration-300',
            isExpandable && !localExpanded && 'max-h-20',
            isExpandable && localExpanded && 'max-h-none'
          )}
        >
          {children}
        </div>

        {/* Data source attribution - density-aware */}
        {dataSource && (
          <div className="mt-[var(--density-item-gap)] pt-[var(--density-item-gap)] border-t border-border/50">
            <p className="density-text-tertiary text-muted-foreground">
              Fonte: {dataSource}
            </p>
          </div>
        )}
      </div>
    );
  }
);

AdvancedCard.displayName = 'AdvancedCard';