/**
 * Warning Card Component - Tradelia 2026
 * 
 * Card per avvisi e alert con severità
 * Segue i principi Tradelia 2026: onestà intellettuale, chiarezza
 */

import { forwardRef } from 'react';
import { AdvancedCard } from './AdvancedCard';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/ui/utils';
import type { WarningCardData, BaseCardProps } from '@/entities/card';

interface WarningCardProps extends Omit<BaseCardProps, 'type' | 'id' | 'title' | 'subtitle' | 'lastUpdated' | 'dataSource' | 'freshness'> {
  data: WarningCardData;
}

const severityConfig = {
  low: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
    icon: 'ℹ',
    label: 'Informazione'
  },
  medium: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600',
    icon: '⚠',
    label: 'Attenzione'
  },
  high: {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    iconColor: 'text-orange-600',
    icon: '⚠',
    label: 'Importante'
  },
  critical: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
    icon: '⚠',
    label: 'Critico'
  }
};

export const WarningCard = forwardRef<HTMLDivElement, WarningCardProps>(
  ({ data, className, ...props }, ref) => {
    const { severity, message, actions } = data;
    const config = severityConfig[severity];
    
    return (
      <div
        ref={ref}
        data-card-id={data.id}
        data-card-type="warning"
        className={cn(
          // Base styles con colori di severità
          'rounded border-2 p-5 shadow-sm',
          config.bgColor,
          config.borderColor,
          className
        )}
        role="alert"
        aria-label={`${config.label}: ${data.title}`}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn('text-lg', config.iconColor)} aria-hidden="true">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-sm font-semibold', config.textColor)}>
              {data.title}
            </h3>
            {data.subtitle && (
              <p className={cn('text-xs mt-1', config.textColor, 'opacity-80')}>
                {data.subtitle}
              </p>
            )}
          </div>
          <span className={cn(
            'text-xs px-2 py-1 rounded border',
            config.bgColor,
            config.borderColor,
            config.textColor
          )}>
            {config.label}
          </span>
        </div>

        {/* Message */}
        <div className={cn('text-sm mb-4', config.textColor)}>
          {message}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className={cn(
                  'text-xs',
                  config.borderColor,
                  config.textColor,
                  'hover:bg-white/50'
                )}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Data source */}
        {data.dataSource && (
          <div className="mt-3 pt-3 border-t border-current/20">
            <p className={cn('text-xs', config.textColor, 'opacity-70')}>
              Fonte: {data.dataSource}
            </p>
          </div>
        )}
      </div>
    );
  }
);

WarningCard.displayName = 'WarningCard';