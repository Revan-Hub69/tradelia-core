'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LiveRegion, useLiveRegion } from '@/components/accessibility/LiveRegion';
import { DynamicIcon, type IconName } from '@/components/icons';
import {
  getVisibleNavigationItems,
  type NavigationItem,
  type NavigationItemId,
} from '@/data/navigation.config';
// import { useLongPress, useQuickActions, type QuickAction } from '@/hooks/useLongPress';
// import { QuickActionsMenu } from './QuickActionsMenu';
import { useGesturePolicy, useHapticFeedback, useTouchOptimization } from '@/hooks/useGesturePolicy';
import { useNavigationState, usePendingAnnouncement } from '@/hooks/useNavigationState';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { Link, usePathname, useRouter } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type PWABottomNavigationProps = {
  className?: string;
};

export const PWABottomNavigation = ({ className }: PWABottomNavigationProps) => {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
  const { message, priority, announce } = useLiveRegion();
  const haptic = useHapticFeedback();
  // Apply gesture policy and touch optimizations
  const gestureRef = useGesturePolicy({
    preventPullToRefresh: true,
    preventOverscroll: true,
    preventSelection: true,
  });
  useTouchOptimization();
  useScrollRestoration();

  // Get navigation items from centralized config
  const navigationItems = getVisibleNavigationItems();

  // Calculate active index for sliding indicator
  useEffect(() => {
    const activeIdx = navigationItems.findIndex((item) => {
      if (item.href === '/dashboard') {
        return pathname === '/dashboard';
      }
      return pathname.startsWith(item.href);
    });
    setActiveIndex(activeIdx >= 0 ? activeIdx : 0);
  }, [pathname, navigationItems]);

  // Keyboard navigation handler with haptic feedback
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowLeft': {
        e.preventDefault();
        const prevIndex = index > 0 ? index - 1 : navigationItems.length - 1;
        setFocusedIndex(prevIndex);
        haptic.light();
        const prevItem = navigationItems[prevIndex];
        if (prevItem) {
          const labelKey = prevItem.labelKey.replace('Dashboard.', '');
          announce(t('nav_focus_moved', { item: t(labelKey as 'nav_home') }));
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        const nextIndex = index < navigationItems.length - 1 ? index + 1 : 0;
        setFocusedIndex(nextIndex);
        haptic.light();
        const nextItem = navigationItems[nextIndex];
        if (nextItem) {
          const labelKey = nextItem.labelKey.replace('Dashboard.', '');
          announce(t('nav_focus_moved', { item: t(labelKey as 'nav_home') }));
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        setFocusedIndex(0);
        haptic.medium();
        announce(t('nav_focus_first'));
        break;
      }
      case 'End': {
        e.preventDefault();
        setFocusedIndex(navigationItems.length - 1);
        haptic.medium();
        announce(t('nav_focus_last'));
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        haptic.medium();
        break;
      }
    }
  };

  return (
    <>
      <nav
        ref={(el) => {
          if (el && navRef.current !== el) {
            (navRef as any).current = el;
            // Apply gesture policy ref
            (gestureRef as any).current = el;
          }
        }}
        id="navigation"
        role="navigation"
        aria-label={t('nav_aria_primary')}
        className={cn(
          'fixed bottom-0 left-0 right-0 layer-nav',
          'glass-nav',
          'pb-safe-bottom',
          'touch-optimized',
          // Responsive visibility - Extended to lg for better tablet experience
          'lg:hidden', // Hide on desktop (1024px+), show on tablet
          className,
        )}
      >
        <div className="mx-auto max-w-screen-xl">
          <div className="nav-height relative flex items-center justify-around px-2">
            {/* Sliding Active Indicator */}
            <div
              className={cn(
                'absolute inset-y-2 bg-primary/10 rounded-xl',
                'motion-spring',
                'pointer-events-none',
              )}
              style={{
                width: `${100 / navigationItems.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
              aria-hidden="true"
            />

            {/* Navigation Items */}
            <ul
              className="flex w-full items-center justify-around"
              role="tablist"
              aria-orientation="horizontal"
            >
              {navigationItems.map((item, index) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  index={index}
                  isActive={
                    pathname === item.href
                    || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  }
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(-1)}
                  tabIndex={
                    focusedIndex === -1 ? (index === 0 ? 0 : -1) : focusedIndex === index ? 0 : -1
                  }
                  announce={announce}
                  haptic={haptic}
                />
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <LiveRegion message={message} priority={priority} />
    </>
  );
};

// Navigation Item with Long Press Support
type NavigationItemProps = {
  item: NavigationItem;
  index: number;
  isActive: boolean;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onFocus: () => void;
  onBlur: () => void;
  tabIndex: number;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  haptic: ReturnType<typeof useHapticFeedback>;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  index,
  isActive,
  onKeyDown,
  onFocus,
  onBlur,
  tabIndex,
  announce,
  haptic,
}) => {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { visualState, uxState, canNavigate } = useNavigationState(
    item.href,
    item.id as NavigationItemId,
  );
  const shouldAnnounce = usePendingAnnouncement(visualState === 'pending');

  // Temporarily disable quick actions
  // const getQuickActions = (): QuickAction[] => {
  //   switch (item.id) {
  //     case 'learn':
  //       return [
  //         {
  //           id: 'continue',
  //           labelKey: 'Dashboard.continue_learning',
  //           onClick: () => navigate(),
  //           variant: 'primary',
  //         },
  //       ];
  //     case 'profile':
  //       return [
  //         {
  //           id: 'badges',
  //           labelKey: 'Dashboard.view_badges',
  //           onClick: () => navigate(),
  //           variant: 'primary',
  //         },
  //       ];
  //     default:
  //       return [
  //         {
  //           id: 'open',
  //           labelKey: 'Dashboard.open_section',
  //           onClick: () => navigate(),
  //           variant: 'primary',
  //         },
  //       ];
  //   }
  // };

  // Temporarily disable quick actions
  // const { isOpen, position, openQuickActions, closeQuickActions } = useQuickActions(
  //   getQuickActions()
  // );

  // Temporarily disable long press to fix navigation
  // const longPressProps = useLongPress(
  //   () => {
  //     if (canNavigate) {
  //       // Create a synthetic event for openQuickActions
  //       const syntheticEvent = {
  //         currentTarget: {
  //           getBoundingClientRect: () => ({
  //             left: 0,
  //             top: 0,
  //             width: 44,
  //             height: 44,
  //           }),
  //         },
  //       } as React.TouchEvent | React.MouseEvent;

  //       openQuickActions(syntheticEvent);
  //       announce(t('Dashboard.quick_actions_opened'));
  //     }
  //   },
  //   {
  //     threshold: 500,
  //     onStart: () => haptic.light(),
  //     onFinish: () => haptic.medium(),
  //   },
  // );

  const longPressProps = { isLongPressing: false }; // Mock for now

  // const handleQuickAction = (action: QuickAction) => {
  //   action.onClick();
  //   announce(t('Dashboard.quick_action_executed'));
  // };

  return (
    <>
      <li className="flex-1" role="presentation">
        <Link
          href={item.href}
          prefetch={item.isPriority && canNavigate}
          role="tab"
          aria-selected={isActive}
          className={cn(
            'flex flex-col items-center justify-center',
            'min-w-0 flex-1 px-1 py-2 rounded-xl',
            'tap-target',
            'press-depth focus-ring',
            longPressProps.isLongPressing && 'scale-105 bg-primary/5',
            {
              'text-primary': isActive && canNavigate,
              'text-muted-foreground': !isActive && canNavigate,
              'text-muted-foreground/40': !canNavigate,
              'hover:text-foreground hover:bg-white/40 dark:hover:bg-white/10':
                !isActive && canNavigate,
            },
          )}
          tabIndex={tabIndex}
          onKeyDown={e => onKeyDown(e, index)}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={(e) => {
            e.preventDefault(); // Always prevent default

            if (!canNavigate) {
              // Show UX feedback for blocked/offline states
              if (uxState === 'blocked') {
                announce(t('nav_blocked'), 'assertive');
                haptic.error();
              } else if (uxState === 'offline') {
                announce(t('nav_offline'), 'assertive');
                haptic.error();
              }
              return;
            }

            // Check if we're already on the target page
            if (window.location.pathname === item.href) {
              return;
            }

            // Simple programmatic navigation
            announce(t('nav_navigating'));
            haptic.success();

            // Force navigation using window.location as fallback
            try {
              router.push(item.href);

              // Fallback: if router.push doesn't work, use window.location
              setTimeout(() => {
                if (window.location.pathname !== item.href) {
                  window.location.href = item.href;
                }
              }, 100);
            } catch (error) {
              window.location.href = item.href;
            }
          }}
          // {...longPressProps} // Temporarily disabled
          aria-label={t(item.ariaKey.replace('Dashboard.', '') as 'nav_home')}
          aria-current={isActive ? 'page' : undefined}
          aria-disabled={!canNavigate}
        >
          <div className="relative mb-1">
            <DynamicIcon
              name={item.iconName as IconName}
              size={20}
              className={cn(
                'motion-fast',
                isActive && 'scale-110',
                !canNavigate && 'opacity-40',
              )}
            />

            {visualState === 'pending' && (
              <div className="absolute -right-1 -top-1 size-2 animate-pulse rounded-full bg-primary" />
            )}

            {uxState === 'blocked' && (
              <div className="absolute -right-1 -top-1 size-2 rounded-full bg-warning" />
            )}

            {uxState === 'offline' && (
              <div className="absolute -right-1 -top-1 size-2 rounded-full bg-destructive" />
            )}

            {canNavigate && (
              <div className="absolute -bottom-1 -right-1 size-1 rounded-full bg-accent opacity-60" />
            )}
          </div>

          <span
            className={cn(
              'text-xs font-medium leading-none truncate',
              'min-w-[48px] text-center',
            )}
            style={{ lineHeight: '1.2' }}
          >
            {t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
          </span>

          {shouldAnnounce && (
            <span className="sr-only" aria-live="polite">
              {t('nav_loading')}
            </span>
          )}
        </Link>
      </li>

      {/* Temporarily disabled QuickActionsMenu */}
      {/* <QuickActionsMenu
        isOpen={isOpen}
        position={position}
        actions={getQuickActions()}
        onClose={closeQuickActions}
        onAction={handleQuickAction}
      /> */}
    </>
  );
};
