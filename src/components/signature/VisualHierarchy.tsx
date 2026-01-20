'use client';

import { cn } from '@/utils/Helpers';
import { forwardRef, type HTMLAttributes } from 'react';

/**
 * Tradelia Visual Hierarchy System
 * 
 * Consistent visual weight system for clear information hierarchy
 * Based on enterprise design principles and 2026 clarity trends
 */

interface VisualWeightProps extends HTMLAttributes<HTMLDivElement> {
  weight: 'primary' | 'secondary' | 'tertiary';
  interactive?: boolean;
  children?: React.ReactNode;
}

const VisualWeight = forwardRef<HTMLDivElement, VisualWeightProps>(
  ({ className, weight, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative transition-all duration-200',
          
          // Weight-specific styles
          {
            // Primary - Hero elements, immediate attention
            'weight-primary': weight === 'primary',
            
            // Secondary - Important but not primary
            'weight-secondary': weight === 'secondary',
            
            // Tertiary - Supporting elements
            'weight-tertiary': weight === 'tertiary',
          },
          
          // Interactive enhancements
          interactive && [
            'cursor-pointer',
            'hover:scale-[1.01] hover:brightness-105',
            'active:scale-[0.99] active:transition-transform active:duration-75',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          ],
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VisualWeight.displayName = 'VisualWeight';

/**
 * Pre-configured hierarchy components for common use cases
 */

const HeroBanner = forwardRef<HTMLDivElement, Omit<VisualWeightProps, 'weight'>>(
  ({ className, children, ...props }, ref) => (
    <VisualWeight
      ref={ref}
      weight="primary"
      className={cn('p-8 rounded-2xl', className)}
      {...props}
    >
      {children}
    </VisualWeight>
  )
);

HeroBanner.displayName = 'HeroBanner';

const ContentCard = forwardRef<HTMLDivElement, Omit<VisualWeightProps, 'weight'>>(
  ({ className, children, ...props }, ref) => (
    <VisualWeight
      ref={ref}
      weight="secondary"
      className={cn('p-6 rounded-xl', className)}
      {...props}
    >
      {children}
    </VisualWeight>
  )
);

ContentCard.displayName = 'ContentCard';

const SupportingElement = forwardRef<HTMLDivElement, Omit<VisualWeightProps, 'weight'>>(
  ({ className, children, ...props }, ref) => (
    <VisualWeight
      ref={ref}
      weight="tertiary"
      className={cn('p-4 rounded-lg', className)}
      {...props}
    >
      {children}
    </VisualWeight>
  )
);

SupportingElement.displayName = 'SupportingElement';

export { 
  VisualWeight, 
  HeroBanner, 
  ContentCard, 
  SupportingElement,
  type VisualWeightProps 
};