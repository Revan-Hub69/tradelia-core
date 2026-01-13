/**
 * Educational Card - Tradelia 2026
 * 
 * Card per spiegazioni, metodologia e fonti
 * Focus su verificabilità e neutralità
 * Density-aware: responds to compact/comfortable mode (REQ 20.2)
 */

'use client';

import { cn } from '@/shared/ui/utils';
import { Button } from '@/shared/ui/Button';

interface EducationalCardProps {
  title: string;
  description: string;
  source?: string;
  learnMoreActionId?: string;
  className?: string;
}

export function EducationalCard({
  title,
  description,
  source,
  learnMoreActionId,
  className
}: EducationalCardProps) {
  const handleLearnMore = () => {
    if (learnMoreActionId) {
      // Handle learn more action based on ID - this runs client-side
      console.log('Learn more:', learnMoreActionId);
      // TODO: Implement actual learn more logic
    }
  };

  return (
    <div className={cn(
      "rounded-lg border-2 border-border/50 bg-background density-card shadow-sm",
      "hover:border-primary/30 hover:bg-muted/20 hover:shadow-md hover:-translate-y-0.5",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="density-gap flex flex-col">
        {/* Header with icon - density-aware spacing */}
        <div className="flex items-start density-gap">
          <div className="flex-shrink-0 mt-1 text-primary density-icon-box flex items-center justify-center">
            <svg className="density-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h4 className="text-base font-bold text-foreground">
              {title}
            </h4>
          </div>
        </div>

        {/* Description - density-aware text */}
        <p className="density-text-secondary text-muted-foreground leading-relaxed font-medium">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {source && (
            <p className="density-text-tertiary text-muted-foreground font-medium">
              Fonte: {source}
            </p>
          )}
          
          {learnMoreActionId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLearnMore}
              className="density-text-secondary h-auto p-2 text-primary hover:text-primary/80 font-medium min-h-[24px]"
            >
              Approfondisci →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}