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
          // Base glass foundation (from dashboard-ui.css)
          'relative overflow-hidden',
          'backdrop-blur-[20px] backdrop-saturate-[180%]',

          // Signature micro-grain texture (Anti-AI Crafting)
          'before:absolute before:inset-0 before:pointer-events-none',
          'before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)]',
          'before:bg-[length:20px_20px]',

          // Signature highlight line
          'after:absolute after:inset-x-0 after:top-0 after:h-px after:pointer-events-none',
          'after:bg-gradient-to-r after:from-transparent after:via-primary/20 after:to-transparent',

          // Variant-specific styles
          {
            // Header - Sticky navigation surfaces
            'bg-white/10 border-b border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.08)]':
              variant === 'header',

            // Panel - Elevated modal/dropdown surfaces
            'bg-white/12 border border-white/25 rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.2)]':
              variant === 'panel',

            // Card - Content containers
            'bg-white/8 border border-white/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]':
              variant === 'card',
          },

          // Dark mode adaptations
          'dark:bg-slate-900/10 dark:border-white/10',

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
