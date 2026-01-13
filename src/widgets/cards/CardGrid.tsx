/**
 * Card Grid - Tradelia 2026
 * 
 * Sistema di layout per organizzare le card della dashboard
 * con supporto per drag & drop e responsive design
 * Density-aware: responds to compact/comfortable mode (REQ 20.2)
 */

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/shared/ui/utils';

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

export function CardGrid({ children, className }: CardGridProps) {
  return (
    <div className={cn(
      "density-section-gap flex flex-col",
      className
    )}>
      {children}
    </div>
  );
}