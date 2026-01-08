/**
 * Button Component - Tradelia 2026
 * 
 * Componente button accessibile con varianti e micro-interazioni.
 * Segue i principi Tradelia 2026:
 * - Transizioni 150ms con cubic-bezier(0.4, 0, 0.2, 1)
 * - Focus ring visibile (WCAG AAA+)
 * - Supporto per prefers-reduced-motion
 */

import { forwardRef } from 'react';
import { cn, focusRing, transitionSubtle } from './utils';
import type { ButtonProps } from './types';

const buttonVariants = {
  default: 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]',
  outline: 'border-2 border-border bg-background text-foreground hover:bg-muted/30 hover:-translate-y-px',
  ghost: 'bg-transparent text-foreground hover:bg-muted/50',
};

const buttonSizes = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 px-3 py-1.5 text-xs',
  lg: 'h-10 px-6 py-2 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded font-medium',
          transitionSubtle,
          focusRing,
          // Variant styles
          buttonVariants[variant],
          // Size styles
          buttonSizes[size],
          // Disabled styles
          isDisabled && 'pointer-events-none opacity-50',
          // Custom classes
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
