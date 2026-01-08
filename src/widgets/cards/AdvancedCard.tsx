/**
 * Advanced Card Component - Tradelia 2026
 * 
 * Card modulare avanzata con expand/collapse, drag & drop, e stati di errore
 * Segue i principi Tradelia 2026: chiarezza > persuasione, neutralità > bias
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

    // Loading skeleton
    if (isLoading) {
      return (
        <div
          ref={ref}
          data-card-id={id}
          className={cn(
            'rounded border-2 border-border bg-background p-5 shadow-sm animate-pulse',
            className
          )}
          aria-busy="true"
          aria-label="Caricamento dati..."
          {...props}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-1/3" />
              {freshness && (
                <div className="h-6 bg-muted rounded w-16" />
              )}
            </div>
            {subtitle && <div className="h-3 bg-muted rounded w-1/2" />}
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (isError) {
      return (
        <div
          ref={ref}
          data-card-id={id}
          className={cn(
            'rounded border-2 border-red-200 bg-red-50 p-5 shadow-sm',
            transitionSubtle,
            className
          )}
          role="alert"
          aria-label="Errore nel caricamento dei dati"
          {...props}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-red-800">
                Errore caricamento
              </h3>
              {freshness && (
                <DataFreshnessIndicator 
                  freshness="error" 
                  {...(lastUpdated && { lastUpdated })}
                />
              )}
            </div>
            <p className="text-xs text-red-700">
              {errorMessage || 'Impossibile caricare i dati richiesti'}
            </p>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100"
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
          // Base styles seguendo Tradelia 2026
          'rounded border-2 border-border bg-background p-5 shadow-sm',
          transitionSubtle,
          // Drag & drop styles
          isDraggable && [
            'cursor-grab active:cursor-grabbing',
            'hover:bg-muted/30 hover:-translate-y-px hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2'
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
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
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
            
            {/* Expand/collapse button */}
            {isExpandable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
                className={cn(
                  'p-1 rounded text-muted-foreground hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                  transitionSubtle
                )}
                aria-label={localExpanded ? 'Comprimi' : 'Espandi'}
              >
                <svg 
                  className={cn('w-4 h-4 transition-transform', localExpanded && 'rotate-180')}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            
            {/* Drag handle */}
            {isDraggable && (
              <div 
                className="p-1 text-muted-foreground cursor-grab active:cursor-grabbing"
                aria-hidden="true"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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

        {/* Data source attribution */}
        {dataSource && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Fonte: {dataSource}
            </p>
          </div>
        )}
      </div>
    );
  }
);

AdvancedCard.displayName = 'AdvancedCard';