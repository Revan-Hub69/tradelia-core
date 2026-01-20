'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/utils/Helpers';
import { TradelliaGlass } from './TradelliaGlass';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'card' | 'modal';
  interactive?: boolean;
  children?: React.ReactNode;
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'card', interactive = false, children, ...props }, ref) => {
    return (
      <TradelliaGlass
        ref={ref}
        variant={variant}
        shape="default"
        className={cn(
          'p-6 transition-all duration-200',

          // Interactive states with signature micro-animations
          interactive && [
            'cursor-pointer',
            'hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(29,78,216,0.2)]',
            'active:scale-[0.98] active:transition-transform active:duration-75',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          ],

          className,
        )}
        {...props}
      >
        {children}
      </TradelliaGlass>
    );
  },
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, type GlassCardProps };