/**
 * Badge Component - Tradelia 2026
 * 
 * Componente badge per tag e stati.
 * Segue i principi Tradelia 2026:
 * - Colori desaturati e istituzionali
 * - Contrasto sufficiente per leggibilità
 */

import { forwardRef } from 'react';
import { cn } from './utils';
import type { BadgeProps } from './types';

const badgeVariants = {
  default: 'bg-muted text-muted-foreground border border-border/50',
  success: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  default: 'px-3 py-1 text-xs',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center font-medium rounded-full',
          // Variant styles
          badgeVariants[variant],
          // Size styles
          badgeSizes[size],
          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
