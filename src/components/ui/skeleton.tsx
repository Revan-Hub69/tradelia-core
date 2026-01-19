/*
 * SKELETON LOADING - Enterprise Premium 2026
 * 
 * Advanced skeleton states with spring physics and progressive loading
 * Based on Carbon Design System and Linear patterns
 */

'use client';

import React from 'react';
import { cn } from '@/utils/Helpers';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rectangular' | 'text' | 'navigation';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  animation = 'pulse',
  width,
  height,
  style,
  ...props
}) => {
  const baseClasses = cn(
    'bg-muted/60 dark:bg-muted/40',
    {
      'rounded-md': variant === 'default' || variant === 'rectangular',
      'rounded-full': variant === 'circular',
      'rounded-sm h-4': variant === 'text',
      'rounded-lg h-10': variant === 'navigation',
      'animate-pulse': animation === 'pulse',
      'animate-wave': animation === 'wave',
    },
    className,
  );

  const inlineStyles = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return <div className={baseClasses} style={inlineStyles} {...props} />;
};

// Navigation Skeleton - Specific for sidebar items
export const NavigationSkeleton: React.FC<{ isCollapsed?: boolean }> = ({ 
  isCollapsed = false 
}) => (
  <div className="space-y-2 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton variant="circular" width={20} height={20} />
        {!isCollapsed && <Skeleton variant="text" className="flex-1" />}
      </div>
    ))}
  </div>
);

// Dashboard Content Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    {/* Header skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 p-4 border rounded-lg">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  </div>
);