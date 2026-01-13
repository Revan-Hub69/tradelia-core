/**
 * Action Card - Tradelia 2026
 * 
 * Card per CTA, form e operazioni utente
 * Design discreto seguendo i principi Tradelia
 * Density-aware: responds to compact/comfortable mode (REQ 20.2)
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
      "rounded-lg border-2 border-border bg-background density-card shadow-sm",
      "hover:border-primary/30 hover:bg-muted/20 hover:shadow-md hover:-translate-y-0.5",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="density-gap flex flex-col">
        {/* Content */}
        <div className="density-gap flex flex-col">
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="density-text-secondary text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions - min 24px target size */}
        <div className="flex flex-col sm:flex-row density-gap pt-1">
          <Button
            onClick={() => handleAction(primaryAction.actionId)}
            className="flex-1 min-h-[var(--density-row-height)]"
          >
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={() => handleAction(secondaryAction.actionId)}
              className="flex-1 min-h-[var(--density-row-height)]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}