/**
 * Action Card - Tradelia 2026
 * 
 * Card per CTA, form e operazioni utente
 * Design discreto seguendo i principi Tradelia
 */

'use client';

import { cn } from '@/shared/ui/utils';
import { Button } from '@/shared/ui/Button';

interface ActionCardProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    actionId: string;
  };
  secondaryAction?: {
    label: string;
    actionId: string;
  };
  className?: string;
}

export function ActionCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  className
}: ActionCardProps) {
  
  const handleAction = (actionId: string) => {
    // Handle actions based on ID - this runs client-side
    switch (actionId) {
      case 'start-analysis':
        console.log('Avvia analisi');
        // TODO: Implement actual analysis logic
        break;
      case 'learn-more':
        console.log('Scopri di più');
        // TODO: Navigate to learn more page
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  return (
    <div className={cn(
      "rounded-lg border-2 border-border bg-background p-6 shadow-sm",
      "hover:border-primary/30 hover:bg-muted/20 hover:shadow-md hover:-translate-y-0.5",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="space-y-5">
        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => handleAction(primaryAction.actionId)}
            className="flex-1 h-11"
            size="lg"
          >
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={() => handleAction(secondaryAction.actionId)}
              className="flex-1 h-11"
              size="lg"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}