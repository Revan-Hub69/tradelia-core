/**
 * Input Component - Tradelia 2026
 * 
 * Componente input accessibile con validazione e stati.
 * Segue i principi Tradelia 2026:
 * - Bordi visibili (border-2 border-border)
 * - Placeholder con contrasto sufficiente
 * - Focus ring visibile (WCAG AAA+)
 * - Stati error/success chiari
 */

import { forwardRef, useId } from 'react';
import { cn, focusRing, transitionSubtle } from './utils';
import type { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, helperText, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    
    const hasError = Boolean(error);
    const hasHelper = Boolean(helperText) && !hasError;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={id}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={id}
          className={cn(
            // Base styles
            'flex h-9 w-full rounded border-2 bg-background px-3 py-1.5 text-sm',
            transitionSubtle,
            focusRing,
            // Placeholder
            'placeholder:text-muted-foreground',
            // Default border
            'border-border',
            // Error state
            hasError && 'border-red-500 focus-visible:ring-red-500/60',
            // Success state
            success && 'border-green-600 focus-visible:ring-green-600/60',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50',
            // Custom classes
            className
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hasHelper ? helperId : undefined}
          {...props}
        />
        
        {hasError && (
          <p 
            id={errorId}
            className="text-xs font-medium text-red-600" 
            role="alert"
          >
            {error}
          </p>
        )}
        
        {hasHelper && (
          <p 
            id={helperId}
            className="text-xs text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
