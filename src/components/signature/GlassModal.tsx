'use client';

import { cn } from '@/utils/Helpers';
import { forwardRef, type HTMLAttributes } from 'react';
import { TradelliaGlass } from './TradelliaGlass';

interface GlassModalProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
}

const GlassModal = forwardRef<HTMLDivElement, GlassModalProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    return (
      <TradelliaGlass
        ref={ref}
        variant="modal"
        intensity="strong"
        shape="default"
        className={cn(
          'relative mx-auto my-8',
          
          // Size variants
          {
            'max-w-sm': size === 'sm',
            'max-w-md': size === 'md', 
            'max-w-lg': size === 'lg',
            'max-w-2xl': size === 'xl',
          },
          
          // Modal-specific styling
          'animate-in fade-in-0 zoom-in-95 duration-200',
          
          className
        )}
        {...props}
      >
        {children}
      </TradelliaGlass>
    );
  }
);

GlassModal.displayName = 'GlassModal';

export { GlassModal, type GlassModalProps };