/**
 * UI NAV ITEM - Signature Primitive v1
 *
 * Unifica: sidebar, bottom nav, header breadcrumbs
 * 
 * REGOLE:
 * - aria-current="page" per active
 * - focus-visible
 * - Zero side effects
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

/**
 * UiNavItem - Navigation item with consistent styling
 * 
 * Usage:
 * - Sidebar: <UiNavItem active icon={<HomeIcon />}>Home</UiNavItem>
 * - Bottom Nav: <UiNavItem active icon={<LearnIcon />}>Learn</UiNavItem>
 * - As Link: <UiNavItem asChild><Link href="...">Profile</Link></UiNavItem>
 */
export const UiNavItem = forwardRef<HTMLElement, UiNavItemProps>(
  ({ className, active = false, icon, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    
    // When asChild, we can't render icon/children as separate elements
    // The child (Link) must handle its own content
    if (asChild) {
      return (
        <Comp
          ref={ref as any}
          aria-current={active ? 'page' : undefined}
          data-active={active}
          className={cn(
            // Base styles
            'relative flex items-center gap-3 px-3 py-2',
            'rounded-xl',
            'transition-all duration-200 ease-out',
            'cursor-pointer',
            
            // Inactive state
            'text-muted-foreground',
            'hover:bg-primary/10 hover:text-foreground hover:scale-[1.02]',
            
            // Active state
            'data-[active=true]:bg-primary/15 data-[active=true]:text-primary',
            'data-[active=true]:font-medium',
            
            // Focus
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
            
            // Signature press feedback
            'active:scale-[0.98] active:transition-transform active:duration-75',
            
            className,
          )}
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
        className={cn(
          // Base styles
          'relative flex items-center gap-3 px-3 py-2',
          'rounded-xl',
          'transition-all duration-200 ease-out',
          'cursor-pointer',
          
          // Inactive state
          'text-muted-foreground',
          'hover:bg-primary/10 hover:text-foreground hover:scale-[1.02]',
          
          // Active state
          'data-[active=true]:bg-primary/15 data-[active=true]:text-primary',
          'data-[active=true]:font-medium',
          
          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          
          // Signature press feedback
          'active:scale-[0.98] active:transition-transform active:duration-75',
          
          className,
        )}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="flex-1">{children}</span>

        {/* Active indicator (visual only) */}
        {active && (
          <span
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            aria-hidden="true"
          />
        )}
      </Comp>
    );
  },
);

UiNavItem.displayName = 'UiNavItem';
