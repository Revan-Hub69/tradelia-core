import * as React from 'react';

import { cn } from '@/utils/Helpers';

export type XPBadgeProps = {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
};

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);

export function XPBadge({ xp, size = 'md', showIcon = true, className }: XPBadgeProps) {
  const sizeClasses = {
    sm: 'gap-1 px-2 py-0.5 text-xs',
    md: 'gap-1.5 px-3 py-1 text-sm',
    lg: 'gap-2 px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  const formattedXP = xp.toLocaleString('it-IT');

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 font-semibold tabular-nums text-primary',
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && <BoltIcon className={iconSizes[size]} />}
      <span>{formattedXP}</span>
    </div>
  );
}
