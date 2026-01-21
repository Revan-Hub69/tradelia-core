/**
 * UI STATUS CHIP - Signature Primitive v1
 *
 * Sostituisce: streak, progress, status header
 *
 * REGOLE:
 * - Solo CSS + tokens (NO hardcoded colors)
 * - Zero JS
 * - Server-safe
 *
 * USAGE:
 * - Dot indicator: <UiStatusChip variant="streak" label="days" value={7} dot />
 * - Icon: <UiStatusChip variant="info" label="Focus" icon={<Icon />} />
 * - Value only: <UiStatusChip variant="progress" label="Complete" value="75%" />
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

export type UiStatusChipVariant = 'info' | 'success' | 'warning' | 'streak' | 'progress';

export type UiStatusChipProps = HTMLAttributes<HTMLDivElement> & {
  variant?: UiStatusChipVariant;
  label: string;
  icon?: ReactNode;
  value?: string | number;
  dot?: boolean; // Semantic dot indicator (replaces hardcoded icon)
};

/**
 * UiStatusChip - Status indicator with glass surface
 *
 * Usage:
 * - Streak: <UiStatusChip variant="streak" label="days" value={7} dot />
 * - Progress: <UiStatusChip variant="progress" label="Complete" value="75%" />
 * - Info: <UiStatusChip variant="info" label="Focus Mode" dot />
 */
export const UiStatusChip = forwardRef<HTMLDivElement, UiStatusChipProps>(
  ({ className, variant = 'info', label, icon, value, dot = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-2 px-3 py-1.5',
          'rounded-full',
          'text-sm font-medium',
          'transition-all duration-200 ease-out',

          // Glass surface
          'bg-white/40 dark:bg-white/10',
          'border border-white/20 dark:border-white/10',
          'backdrop-blur-sm',

          // Hover lift (signature)
          'hover:scale-[1.02] hover:shadow-sm',

          // Variant-specific colors (semantic tokens)
          {
            'text-foreground': variant === 'info',
            'text-green-700 dark:text-green-300 border-green-500/30 bg-green-500/10': variant === 'success',
            'text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10': variant === 'warning',
            'text-orange-700 dark:text-orange-300 border-orange-500/30 bg-orange-500/10': variant === 'streak',
            'text-primary border-primary/30 bg-primary/10': variant === 'progress',
          },

          className,
        )}
        {...props}
      >
        {/* Semantic dot indicator */}
        {dot && (
          <span
            className={cn(
              'size-2 rounded-full flex-shrink-0',
              {
                'bg-foreground': variant === 'info',
                'bg-green-500 animate-pulse': variant === 'success',
                'bg-amber-500': variant === 'warning',
                'bg-orange-500 animate-pulse': variant === 'streak',
                'bg-primary': variant === 'progress',
              },
            )}
            aria-hidden="true"
          />
        )}

        {/* Custom icon (if provided) */}
        {icon && !dot && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Value */}
        {value && (
          <span className="font-semibold">
            {value}
          </span>
        )}

        {/* Label */}
        <span className={cn(value && 'text-xs opacity-80')}>
          {label}
        </span>
      </div>
    );
  },
);

UiStatusChip.displayName = 'UiStatusChip';
