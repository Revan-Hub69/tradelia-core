/**
 * Card Grid - Tradelia 2026
 * 
 * Sistema di layout per organizzare le card della dashboard
 * con supporto per drag & drop e responsive design
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
      "space-y-6",
      className
    )}>
      {children}
    </div>
  );
}