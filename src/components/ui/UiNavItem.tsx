/**
 * UI NAV ITEM - Signature Primitive v2
 *
 * SOTA 2026:
 * - Hover: solo bg + color change, zero transform/scale
 * - Active: bg-primary/12 pill, nessuna barra verticale painted-edge
 * - aria-current="page" per active
 * - focus-visible
 */

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

export type UiNavItemProps = HTMLAttributes<HTMLElement> & {
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  asChild?: boolean;
};

const navItemBase = [
  'group relative flex items-center gap-3 px-3 py-2',
  'rounded-xl',
  'text-sm',
  'transition-colors duration-150 ease-out',
  'cursor-pointer select-none',
  // Inactive hover — solo colore, zero scale
  'text-muted-foreground hover:text-foreground hover:bg-foreground/6',
  // Active
  'data-[active=true]:bg-primary/12 data-[active=true]:text-foreground data-[active=true]:font-medium',
  // Press feedback — solo scale, no translate
  'active:scale-[0.98] active:transition-transform active:duration-75',
  // Focus
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
].join(' ');

export const UiNavItem = forwardRef<HTMLElement, UiNavItemProps>(
  ({ className, active = false, icon, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    if (asChild) {
      return (
        <Comp
          ref={ref as any}
          aria-current={active ? 'page' : undefined}
          data-active={active}
          className={cn(navItemBase, className)}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref as any}
        aria-current={active ? 'page' : undefined}
        data-active={active}
        className={cn(navItemBase, className)}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span
            className={cn(
              'shrink-0 transition-colors duration-150',
              active ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/80',
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="flex-1 truncate">
          {children}
        </span>
      </Comp>
    );
  },
);

UiNavItem.displayName = 'UiNavItem';
