/**
 * Educational Card - Tradelia 2026
 * 
 * Card per spiegazioni, metodologia e fonti
 * Focus su verificabilità e neutralità
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
      "rounded border border-border/50 bg-background p-4 shadow-sm",
      "hover:border-border hover:bg-muted/30 hover:translate-y-[-1px]",
      "transition-all duration-150 ease-out",
      className
    )}>
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground">
              {title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {source && (
            <p className="text-xs text-muted-foreground">
              Fonte: {source}
            </p>
          )}
          
          {learnMoreActionId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLearnMore}
              className="text-xs h-auto p-1 text-primary hover:text-primary/80"
            >
              Approfondisci →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}