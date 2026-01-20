import * as React from 'react';

import { cn } from '@/utils/Helpers';

type ProgressProps = {
  value: number; // 0-100
  variant?: 'default' | 'accent' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, variant = 'accent', size = 'md', showLabel = false, ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    };

    const fillClasses = {
      default: 'bg-foreground',
      accent: 'bg-accent',
      primary: 'bg-primary',
    };

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        <div className={cn('w-full overflow-hidden rounded-full bg-secondary/50', sizeClasses[size])}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              fillClasses[variant],
            )}
            style={{ width: `${clampedValue}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        {showLabel && (
          <span className="mt-1 block text-xs text-muted-foreground">
            {clampedValue}
            %
          </span>
        )}
      </div>
    );
  },
);

Progress.displayName = 'Progress';

export { Progress };
