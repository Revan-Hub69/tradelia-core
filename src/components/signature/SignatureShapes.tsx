'use client';

import { cn } from '@/utils/Helpers';
import { forwardRef, type HTMLAttributes } from 'react';

/**
 * Tradelia Signature Shapes System
 * 
 * Unique geometric treatments that create instant brand recognition
 * Based on 2026 trend: Signature brand elements for differentiation
 */

interface SignatureShapeProps extends HTMLAttributes<HTMLDivElement> {
  shape: 'pill' | 'notch' | 'cut';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent';
  children?: React.ReactNode;
}

const SignatureShape = forwardRef<HTMLDivElement, SignatureShapeProps>(
  ({ className, shape, size = 'md', variant = 'primary', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'transition-all duration-200 ease-out',
          
          // Base shape styles
          {
            // Tradelia Pill - Soft, approachable
            'rounded-3xl': shape === 'pill',
            
            // Tradelia Notch - Technical, precise
            'rounded-2xl [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]': 
              shape === 'notch',
            
            // Tradelia Cut - Modern, distinctive
            'rounded-xl': shape === 'cut',
          },
          
          // Size variants
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          
          // Variant colors
          {
            'bg-primary/10 text-primary border border-primary/20': variant === 'primary',
            'bg-secondary/10 text-secondary-foreground border border-secondary/20': variant === 'secondary',
            'bg-accent/10 text-accent-foreground border border-accent/20': variant === 'accent',
          },
          
          className
        )}
        {...props}
      >
        {/* Cut shape corner element */}
        {shape === 'cut' && (
          <div className="absolute -top-px -right-px w-2 h-2 bg-background [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        )}
        
        {children}
      </div>
    );
  }
);

SignatureShape.displayName = 'SignatureShape';

export { SignatureShape, type SignatureShapeProps };