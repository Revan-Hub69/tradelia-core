/**
 * Skeleton Component - Performance P0
 *
 * Loading placeholder to prevent CLS (Cumulative Layout Shift)
 * Reserves space while content loads
 *
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-full" />
 * <Skeleton className="h-4 w-3/4" />
 * ```
 */

import { cn } from '@/utils/Helpers';

type SkeletonProps = {
  className?: string;
  /**
   * Variant for different skeleton styles
   */
  variant?: 'default' | 'circular' | 'text';
};

export const Skeleton = ({ className, variant = 'default' }: SkeletonProps) => {
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
};

/**
 * Skeleton group for common loading patterns
 */
export const SkeletonCard = () => (
  <div className="space-y-3 rounded-xl border border-border p-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
};

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
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
);

/**
 * NavigationSkeleton - For sidebar navigation loading
 */
export const NavigationSkeleton = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
  <div className="space-y-2 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton variant="circular" className="size-8" />
        {!isCollapsed && <Skeleton className="h-4 flex-1" />}
      </div>
    ))}
  </div>
);
