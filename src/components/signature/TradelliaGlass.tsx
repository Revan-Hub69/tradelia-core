'use client';

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/utils/Helpers';

/**
 * Tradelia Signature Glass Components
 *
 * Based on 2026 design trends:
 * - Liquid Glass with dynamic optical behaviors
 * - Anti-AI Crafting with micro-grain textures
 * - Signature brand elements for instant recognition
 */

type TradelliaGlassProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'modal' | 'card';
  intensity?: 'subtle' | 'medium' | 'strong';
  shape?: 'default' | 'pill' | 'notch' | 'cut';
  children?: React.ReactNode;
};

const TradelliaGlass = forwardRef<HTMLDivElement, TradelliaGlassProps>(
  ({ className, variant = 'primary', intensity = 'medium', shape = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glass foundation
          'relative overflow-hidden',
          'backdrop-blur-[20px] backdrop-saturate-[180%]',

          // Signature micro-grain texture (Anti-AI Crafting trend)
          'before:absolute before:inset-0 before:pointer-events-none',
          'before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)]',
          'before:bg-[length:20px_20px]',

          // Signature highlight line in brand color
          'after:absolute after:inset-x-0 after:top-0 after:h-px after:pointer-events-none',
          'after:bg-gradient-to-r after:from-transparent after:via-primary/20 after:to-transparent',

          // Variant-specific styles
          {
            // Primary - Hero elements, immediate attention
            'bg-white/10 border border-white/20 shadow-[0_12px_48px_rgba(29,78,216,0.15)]':
              variant === 'primary',

            // Secondary - Important but not primary
            'bg-white/8 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.08)]':
              variant === 'secondary',

            // Tertiary - Supporting elements
            'bg-white/5 border border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]':
              variant === 'tertiary',

            // Modal - Elevated surfaces
            'bg-white/12 border border-white/25 shadow-[0_24px_64px_rgba(0,0,0,0.2)]':
              variant === 'modal',

            // Card - Content containers
            'bg-white/8 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)]':
              variant === 'card',
          },

          // Intensity variations
          {
            'backdrop-blur-[12px]': intensity === 'subtle',
            'backdrop-blur-[20px]': intensity === 'medium',
            'backdrop-blur-[32px]': intensity === 'strong',
          },

          // Signature shapes
          {
            'rounded-xl': shape === 'default',
            'rounded-3xl': shape === 'pill',
            'rounded-2xl [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]':
              shape === 'notch',
            'rounded-xl before:absolute before:top-[-1px] before:right-[-1px] before:w-2 before:h-2 before:bg-background before:[clip-path:polygon(0_0,100%_100%,0_100%)]':
              shape === 'cut',
          },

          // Dark mode adaptations
          'dark:bg-slate-900/10 dark:border-white/10',
          'dark:shadow-[0_12px_48px_rgba(96,165,250,0.15)]',

          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TradelliaGlass.displayName = 'TradelliaGlass';

export { TradelliaGlass, type TradelliaGlassProps };