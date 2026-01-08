/**
 * Card Component - Tradelia 2026
 * 
 * Componente card modulare con varianti e stati.
 * Segue i principi Tradelia 2026:
 * - Bordi definiti (border-2 border-border per default)
 * - Micro-interazioni sottili (translateY(-1px) su hover)
 * - Skeleton loading state
 */

import { forwardRef } from 'react';
import { cn, transitionSubtle } from './utils';
import type { CardProps } from './types';

const cardVariants = {
  default: 'border-2 border-border p-5',
  secondary: 'border border-border/50 p-4',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, loading = false, children, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded bg-background shadow-sm animate-pulse',
            cardVariants[variant],
            className
          )}
          aria-busy="true"
          aria-label="Loading..."
          {...props}
        >
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded bg-background shadow-sm',
          transitionSubtle,
          // Variant styles
          cardVariants[variant],
          // Interactive styles
          interactive && [
            'cursor-pointer',
            'hover:bg-muted/30 hover:-translate-y-px hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
          ],
          // Custom classes
          className
        )}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for structured card content
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-sm font-semibold text-foreground', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-muted-foreground mt-1', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 flex items-center gap-2', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
