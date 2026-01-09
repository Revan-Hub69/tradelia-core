/**
 * Warning Card - Tradelia 2026
 * 
 * Card per errori, alert e notifiche critiche
 * Design neutrale senza allarmismo
 */

'use client';

import { cn } from '@/shared/ui/utils';
import { Button } from '@/shared/ui/Button';

interface WarningCardProps {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  source?: string;
  dismissActionId?: string;
  className?: string;
}

export function WarningCard({
  title,
  message,
  severity,
  source,
  dismissActionId,
  className
}: WarningCardProps) {
  const handleDismiss = () => {
    if (dismissActionId) {
      // Handle dismiss action based on ID - this runs client-side
      console.log('Dismiss warning:', dismissActionId);
      // TODO: Implement actual dismiss logic
    }
  };

  const severityStyles = {
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    warning: {
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    error: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      icon: 'text-red-600',
      iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  };

  const style = severityStyles[severity];

  return (
    <div className={cn(
      "rounded-lg border-2 bg-background p-5 shadow-sm",
      style.border,
      style.bg,
      "hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ease-out",
      className
    )}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("flex-shrink-0 mt-1", style.icon)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-base font-bold text-foreground">
              {title}
            </h4>
            {dismissActionId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground -mt-1"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {message}
          </p>
          
          {source && (
            <p className="text-xs text-muted-foreground font-medium">
              Fonte: {source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}