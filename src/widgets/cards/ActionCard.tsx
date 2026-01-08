/**
 * Action Card Component - Tradelia 2026
 * 
 * Card per azioni e CTA discrete
 * Segue i principi Tradelia 2026: CTA discreto, no growth hacking
 */

import { forwardRef } from 'react';
import { AdvancedCard } from './AdvancedCard';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/ui/utils';
import type { ActionCardData, BaseCardProps } from '@/entities/card';

interface ActionCardProps extends Omit<BaseCardProps, 'type' | 'id' | 'title' | 'subtitle' | 'lastUpdated' | 'dataSource' | 'freshness'> {
  data: ActionCardData;
}

export const ActionCard = forwardRef<HTMLDivElement, ActionCardProps>(
  ({ data, ...props }, ref) => {
    const { actions } = data;
    
    // Prepare props, only including defined values
    const cardProps: any = {
      ref,
      ...props,
      type: "action" as const,
      id: data.id,
      title: data.title,
    };
    
    if (data.subtitle !== undefined) cardProps.subtitle = data.subtitle;
    if (data.freshness !== undefined) cardProps.freshness = data.freshness;
    if (data.lastUpdated !== undefined) cardProps.lastUpdated = data.lastUpdated;
    if (data.dataSource !== undefined) cardProps.dataSource = data.dataSource;
    
    return (
      <AdvancedCard {...cardProps}>
        <div className="space-y-3">
          {/* Actions */}
          <div className={cn(
            'flex gap-2',
            actions.length > 2 ? 'flex-col' : 'flex-row'
          )}>
            {actions.map((action) => {
              // Map action variants to Button variants
              const buttonVariant = action.variant === 'primary' ? 'default' : 
                                   action.variant === 'secondary' ? 'outline' : 
                                   'outline';
              
              return (
                <Button
                  key={action.id}
                  variant={buttonVariant}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.isLoading}
                  className={cn(
                    'flex-1',
                    // Tradelia 2026: CTA discreto, no colori aggressivi
                    action.variant === 'primary' && 'bg-foreground text-background hover:bg-foreground/90'
                  )}
                >
                  {action.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      <span>Elaborazione...</span>
                    </div>
                  ) : (
                    action.label
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </AdvancedCard>
    );
  }
);

ActionCard.displayName = 'ActionCard';