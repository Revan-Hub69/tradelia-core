/**
 * Educational Card Component - Tradelia 2026
 * 
 * Card per contenuti educativi e informativi
 * Segue i principi Tradelia 2026: verificabilità > opinione, linguaggio accademico
 */

import { forwardRef } from 'react';
import { AdvancedCard } from './AdvancedCard';
import { cn } from '@/shared/ui/utils';
import type { EducationalCardData, BaseCardProps } from '@/entities/card';

interface EducationalCardProps extends Omit<BaseCardProps, 'type' | 'id' | 'title' | 'subtitle' | 'lastUpdated' | 'dataSource' | 'freshness'> {
  data: EducationalCardData;
}

export const EducationalCard = forwardRef<HTMLDivElement, EducationalCardProps>(
  ({ data, ...props }, ref) => {
    const { content } = data;
    
    // Prepare props, only including defined values
    const cardProps: any = {
      ref,
      ...props,
      type: "educational" as const,
      id: data.id,
      title: data.title,
      isExpandable: !!content.details,
    };
    
    if (data.subtitle !== undefined) cardProps.subtitle = data.subtitle;
    if (data.freshness !== undefined) cardProps.freshness = data.freshness;
    if (data.lastUpdated !== undefined) cardProps.lastUpdated = data.lastUpdated;
    if (data.dataSource !== undefined) cardProps.dataSource = data.dataSource;
    
    return (
      <AdvancedCard {...cardProps}>
        <div className="space-y-4">
          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            {content.summary}
          </div>

          {/* Details (expandable) */}
          {content.details && (
            <div className="text-sm text-muted-foreground border-t border-border/50 pt-4">
              {content.details}
            </div>
          )}

          {/* Links */}
          {content.links && content.links.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Riferimenti
              </h4>
              <ul className="space-y-1">
                {content.links.map((link, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'text-xs text-primary hover:text-primary/80',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1',
                        'transition-colors duration-150'
                      )}
                    >
                      {link.label}
                      {link.external && (
                        <span className="ml-1" aria-hidden="true">↗</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </AdvancedCard>
    );
  }
);

EducationalCard.displayName = 'EducationalCard';