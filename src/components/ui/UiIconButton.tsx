/**
 * UI ICON BUTTON - Signature Primitive v1
 *
 * Per: search, bell, help, avatar trigger
 *
 * REGOLE:
 * - aria-label obbligatorio
 * - focus-visible
 * - Zero side effects
 */

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

export type UiIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // aria-label (obbligatorio)
  icon: ReactNode;
  active?: boolean;
  badge?: boolean; // Notification dot
};

/**
 * UiIconButton - Icon-only button with accessibility
 *
 * Usage:
 * - Search: <UiIconButton label="Search" icon={<SearchIcon />} />
 * - Notifications: <UiIconButton label="Notifications" icon={<BellIcon />} badge />
 * - Active state: <UiIconButton label="Menu" icon={<MenuIcon />} active />
 */
export const UiIconButton = forwardRef<HTMLButtonElement, UiIconButtonProps>(
  ({ className, label, icon, active = false, badge = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        data-active={active}
        className={cn(
          // Base styles
          'tradelia-icon-button',
          'relative inline-flex size-11 items-center justify-center',
          'rounded-xl',
          'motion-base',

          // Signature glass surface
          'bg-primary/10 dark:bg-primary/10',
          'hover:bg-primary/15 dark:hover:bg-primary/15',
          'border border-primary/20 hover:border-primary/30',
          'backdrop-blur-md',

          // Premium depth
          'shadow-[0_6px_18px_rgba(0,0,0,0.08)]',
          'hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]',

          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',

          // Active state
          'data-[active=true]:bg-primary/20 data-[active=true]:text-primary',
          'data-[active=true]:border-primary/40',

          // Disabled
          'disabled:pointer-events-none disabled:opacity-50',

          // Motion safety
          'motion-reduce:transition-none motion-reduce:transform-none',

          className,
        )}
        {...props}
      >
        {/* Icon */}
        <span className="relative z-10 flex items-center justify-center">
          {icon}
        </span>

        {/* Notification badge */}
        {badge && (
          <span
            className="absolute -right-1 -top-1 size-2 rounded-full bg-red-500"
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);

UiIconButton.displayName = 'UiIconButton';
