/**
 * Detail Card Component - Tradelia 2026
 * 
 * Card per visualizzare informazioni dettagliate con sezioni
 * Segue i principi Tradelia 2026: chiarezza > persuasione
 */

import { forwardRef } from 'react';
import { AdvancedCard } from './AdvancedCard';
import { cn } from '@/shared/ui/utils';
import type { DetailCardData, BaseCardProps } from '@/entities/card';

interface DetailCardProps extends Omit<BaseCardProps, 'type' | 'id' | 'title' | 'subtitle' | 'lastUpdated' | 'dataSource' | 'freshness'> {
  data: DetailCardData;
}

export const DetailCard = forwardRef<HTMLDivElement, DetailCardProps>(
  ({ data, ...props }, ref) => {
    const { sections } = data;
    
    // Prepare props, only including defined values
    const cardProps: any = {
      ref,
      ...props,
      type: "detail" as const,
      id: data.id,
      title: data.title,
      isExpandable: true,
    };
    
    if (data.subtitle !== undefined) cardProps.subtitle = data.subtitle;
    if (data.freshness !== undefined) cardProps.freshness = data.freshness;
    if (data.lastUpdated !== undefined) cardProps.lastUpdated = data.lastUpdated;
    if (data.dataSource !== undefined) cardProps.dataSource = data.dataSource;
    
    return (
      <AdvancedCard {...cardProps}>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={cn(
                'space-y-2',
                index > 0 && 'pt-4 border-t border-border/50'
              )}
            >
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h4>
              <div className="text-sm text-muted-foreground">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </AdvancedCard>
    );
  }
);

DetailCard.displayName = 'DetailCard';