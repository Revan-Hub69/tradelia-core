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

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

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
          'relative inline-flex size-9 items-center justify-center',
          'rounded-xl',
          'transition-all duration-200 ease-out',
          
          // Glass surface (from dashboard-ui.css)
          'bg-white/40 dark:bg-white/10',
          'hover:bg-white/60 dark:hover:bg-white/20',
          'border border-white/20 dark:border-white/10',
          'backdrop-blur-sm',
          
          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          
          // Active state
          'data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
          'data-[active=true]:border-primary/30',
          
          // Disabled
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Signature press feedback
          'active:scale-[0.95] active:transition-transform active:duration-75',
          
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
