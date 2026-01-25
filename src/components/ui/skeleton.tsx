/**
 * Skeleton Component - Performance P0
 *
 * Loading placeholder to prevent CLS (Cumulative Layout Shift)
 * Reserves space while content loads
 *
 * Performance P1: Memoized to prevent unnecessary re-renders
 *
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-full" />
 * <Skeleton className="h-4 w-3/4" />
 * ```
 */

import React from 'react';

import { cn } from '@/utils/Helpers';

type SkeletonProps = {
  className?: string;
  /**
   * Variant for different skeleton styles
   */
  variant?: 'default' | 'circular' | 'text';
};

export const Skeleton = React.memo<SkeletonProps>(
  ({ className, variant = 'default' }) => {
    return (
      <div
        className={cn(
          'skeleton animate-pulse bg-muted',
          variant === 'circular' && 'rounded-full',
          variant === 'text' && 'h-4 rounded',
          variant === 'default' && 'rounded-lg',
          className,
        )}
        aria-hidden="true"
      />
    );
  },
  // Custom comparison: only re-render if className or variant changes
  (prevProps, nextProps) => {
    return (
      prevProps.className === nextProps.className &&
      prevProps.variant === nextProps.variant
    );
  },
);

/**
 * Skeleton group for common loading patterns - Performance P1: Memoized
 */
export const SkeletonCard = React.memo(() => (
  <div className="space-y-3 rounded-xl border border-border p-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonAvatar = React.memo<{ size?: 'sm' | 'md' | 'lg' }>(
  ({ size = 'md' }) => {
    const sizeClasses = {
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-12',
    };

    return <Skeleton variant="circular" className={sizeClasses[size]} />;
  },
  (prevProps, nextProps) => prevProps.size === nextProps.size,
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonText = React.memo<{ lines?: number }>(
  ({ lines = 3 }) => (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-4/5' : 'w-full',
          )}
        />
      ))}
    </div>
  ),
  (prevProps, nextProps) => prevProps.lines === nextProps.lines,
);

SkeletonText.displayName = 'SkeletonText';

/**
 * NavigationSkeleton - For sidebar navigation loading - Performance P1: Memoized
 */
export const NavigationSkeleton = React.memo<{ isCollapsed?: boolean }>(
  ({ isCollapsed = false }) => (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" className="size-8" />
          {!isCollapsed && <Skeleton className="h-4 flex-1" />}
        </div>
      ))}
    </div>
  ),
  (prevProps, nextProps) => prevProps.isCollapsed === nextProps.isCollapsed,
);

NavigationSkeleton.displayName = 'NavigationSkeleton';
