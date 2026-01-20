'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/utils/Helpers';

import { TradelliaGlass } from './TradelliaGlass';

type GlassSurfaceProps = {
  elevation?: 'low' | 'medium' | 'high';
  blur?: 'subtle' | 'medium' | 'strong';
  children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, elevation = 'medium', blur = 'medium', children, ...props }, ref) => {
    const variant = elevation === 'low' ? 'tertiary' : elevation === 'high' ? 'primary' : 'secondary';

    return (
      <TradelliaGlass
        ref={ref}
        variant={variant}
        intensity={blur}
        shape="default"
        className={cn(
          'relative',

          // Elevation-specific enhancements
          {
            'shadow-[0_2px_8px_rgba(0,0,0,0.04)]': elevation === 'low',
            'shadow-[0_8px_24px_rgba(0,0,0,0.12)]': elevation === 'medium',
            'shadow-[0_16px_48px_rgba(0,0,0,0.2)]': elevation === 'high',
          },

          className,
        )}
        {...props}
      >
        {children}
      </TradelliaGlass>
    );
  },
);

GlassSurface.displayName = 'GlassSurface';

export { GlassSurface, type GlassSurfaceProps };
