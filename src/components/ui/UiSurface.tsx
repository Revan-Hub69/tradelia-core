/**
 * UI SURFACE - Signature Primitive v1
 *
 * Sostituisce: GlassSurface, glass-header, glass-surface
 *
 * REGOLE:
 * - Solo CSS + tokens
 * - Zero JS
 * - Server-safe
 * - No useEffect, no window, no stato globale
 */

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/utils/Helpers';

export type UiSurfaceVariant = 'header' | 'panel' | 'card';

export type UiSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: UiSurfaceVariant;
  children?: React.ReactNode;
};

/**
 * UiSurface - Foundation glass surface component
 *
 * Usage:
 * - Header: <UiSurface variant="header">...</UiSurface>
 * - Panel: <UiSurface variant="panel">...</UiSurface>
 * - Card: <UiSurface variant="card">...</UiSurface>
 */
export const UiSurface = forwardRef<HTMLDivElement, UiSurfaceProps>(
  ({ className, variant = 'card', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          variant === 'header' && 'ui-glass-header',
          variant === 'panel' && 'ui-glass-panel',
          variant === 'card' && 'ui-glass-card',

          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

UiSurface.displayName = 'UiSurface';
