/*
 * SIDEBAR NAVIGATION - Desktop Navigation (1024px+)
 *
 * Collapsible sidebar navigation for desktop experience
 * Enterprise-level navigation with keyboard shortcuts and advanced features
 *
 * MIGRATED: Using Signature Primitives v1
 * - UiNavItem for navigation items
 * - UiSurface for sidebar container
 * - UiIconButton for collapse button
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { CloseIcon, CommunityIcon, DynamicIcon, HomeIcon, LearnIcon, MenuIcon, ProfileIcon, ToolsIcon, type IconName } from '@/components/icons';
import { UiIconButton, UiNavItem, UiSurface } from '@/components/ui';
import { NavigationSkeleton } from '@/components/ui/skeleton';
import { getVisibleNavigationItems, trackNavigationEvent } from '@/data/navigation.config';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useOptimizedNavigation } from '@/hooks/useOptimizedNavigation';
import { Link, usePathname } from '@/libs/i18nNavigation';
import { Logo } from '@/templates/Logo';
import { cn } from '@/utils/Helpers';

type SidebarNavigationProps = {
  className?: string;
  defaultCollapsed?: boolean;
};

// Sidebar Navigation Item Component
type SidebarNavigationItemProps = {
  item: any;
  isActive: boolean;
  isCollapsed: boolean;
  tGeneral: any;
};

const SidebarNavigationItem: React.FC<SidebarNavigationItemProps> = ({
  item,
  isActive,
  isCollapsed,
  tGeneral,
}) => {
  const { navigate, isPending, navigationTarget } = useOptimizedNavigation();
  const [visualState, setVisualState] = useState<'default' | 'pressed'>('default');
  const { uxState, canNavigate } = useNavigationState(
    item.href,
    item.id,
  );
  const prefersReducedMotion = useReducedMotion();

  // Auto-reset pressed state with proper cleanup
  useEffect(() => {
    if (visualState === 'pressed') {
      const timer = setTimeout(() => setVisualState('default'), 150);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visualState]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Always prevent default

    if (!canNavigate) {
      return;
    }

    // Visual feedback
    setVisualState('pressed');

    // Track navigation event
    trackNavigationEvent({
      action: 'nav_click',
      itemId: item.id,
      timestamp: Date.now(),
      metadata: { href: item.href, isOnline: true, isEnabled: true },
    });

    // Optimized navigation with React 19 concurrent features
    navigate(item.href);
  };

  const isNavigating = isPending && navigationTarget === item.href;

  return (
    <UiNavItem
      asChild
      active={isActive && canNavigate}
      className={cn(
        'group relative',
        {
          'cursor-not-allowed opacity-40': !canNavigate,
          'navigation-skeleton': isNavigating,
        },
        isCollapsed && 'justify-center px-2',
      )}
    >
      <Link
        href={item.href}
        prefetch={item.isPriority && canNavigate}
        onClick={handleClick}
        className="flex w-full items-center gap-3"
        aria-disabled={!canNavigate}
        title={isCollapsed ? tGeneral(item.labelKey) : undefined}
      >
        {/* PREMIUM ACTIVE RAIL INDICATOR */}
        {isActive && canNavigate && (
          <motion.div
            layoutId="activeRail"
            className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-primary"
            transition={{
              type: 'tween',
              duration: prefersReducedMotion ? 0 : 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        )}
        {/* Icon with state indicators */}
        <div
          className={cn(
            'relative shrink-0',
            'transition-transform duration-150 ease-out',
            'group-hover:-translate-y-0.5',
            'motion-reduce:transform-none motion-reduce:transition-none',
          )}
        >
          {item.iconName === 'HomeIcon' && (
            <HomeIcon size={24} isActive={isActive} />
          )}
          {item.iconName === 'LearnIcon' && (
            <LearnIcon size={24} isActive={isActive} />
          )}
          {item.iconName === 'ToolsIcon' && (
            <ToolsIcon size={24} isActive={isActive} />
          )}
          {item.iconName === 'CommunityIcon' && (
            <CommunityIcon size={24} isActive={isActive} />
          )}
          {item.iconName === 'ProfileIcon' && (
            <ProfileIcon size={24} isActive={isActive} />
          )}
          {!['HomeIcon', 'LearnIcon', 'ToolsIcon', 'CommunityIcon', 'ProfileIcon'].includes(item.iconName) && (
            <DynamicIcon
              name={item.iconName as IconName}
              size={24}
              className={cn(
                'transition-colors duration-150',
                !canNavigate && 'opacity-40',
                isActive && 'text-primary'
              )}
            />
          )}

          {/* State indicators - PREMIUM */}
          {uxState === 'blocked' && (
            <div className="absolute -right-1 -top-1 size-3 rounded-full bg-warning ring-2 ring-background" />
          )}

          {uxState === 'offline' && (
            <div className="absolute -right-1 -top-1 size-3 rounded-full bg-destructive ring-2 ring-background" />
          )}

          {/* Badge dot for notifications */}
          {canNavigate && item.badgeType === 'dot' && (
            <div className="absolute -right-1 -top-1 size-3 rounded-full bg-accent ring-2 ring-background" />
          )}
        </div>

        {/* Label - Hidden when collapsed */}
        {!isCollapsed && <span className="flex-1 truncate">{tGeneral(item.labelKey)}</span>}

        {/* Keyboard shortcut hint */}
        {!isCollapsed && !isActive && canNavigate && (
          <span className="ml-auto text-xs text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
            Alt+
            {getVisibleNavigationItems().findIndex(nav => nav.id === item.id) + 1}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="pointer-events-none absolute left-full z-50 ml-2 rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {tGeneral(item.labelKey)}
          </div>
        )}
      </Link>
    </UiNavItem>
  );
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  className,
  defaultCollapsed = false,
}) => {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const tGeneral = useTranslations();
  const navigationItems = getVisibleNavigationItems();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for premium UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Update CSS custom property for dynamic grid layout
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width-current', isCollapsed ? '64px' : '256px');
  }, [isCollapsed]);

  if (isLoading) {
    return (
      <UiSurface
        variant="panel"
        className={cn(
          'hidden md:block',
          'layout-sidebar border-r border-border/20',
          'transition-all duration-300 ease-out',
          isCollapsed ? 'w-16' : 'w-64',
          className,
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/20 p-4">
            <div className="flex items-center">
              {isCollapsed
                ? (
                    <div className="size-6 animate-pulse rounded bg-muted" />
                  )
                : (
                    <div className="flex items-center gap-2">
                      <div className="size-6 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    </div>
                  )}
            </div>
            <div className="size-8 animate-pulse rounded bg-muted" />
          </div>
          <NavigationSkeleton isCollapsed={isCollapsed} />
        </div>
      </UiSurface>
    );
  }

  return (
    <UiSurface
      variant="panel"
      className={cn(
        // Responsive visibility - Show on tablet and desktop (768px+)
        'hidden md:block',
        'layout-sidebar border-r border-border/20',
        'transition-[width] duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
      style={{ transitionTimingFunction: 'var(--ease-tradelia-gentle)' }}
      role="navigation"
      aria-label={t('nav_aria_sidebar')}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border/20 p-4">
          {/* Logo - Full when expanded, icon-only when collapsed */}
          <div className="hover-lift-subtle flex items-center rounded-lg p-1">
            {isCollapsed
              ? (
                  <Logo isTextHidden size="sm" />
                )
              : (
                  <Logo size="sm" />
                )}
          </div>

          <UiIconButton
            label={
              isCollapsed
                ? (t('expand_sidebar') as string)
                : (t('collapse_sidebar') as string)
            }
            icon={isCollapsed
              ? <MenuIcon size={16} />
              : <CloseIcon size={16} />}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="size-9 hover:scale-[1.02]"
            aria-pressed={!isCollapsed}
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 p-4">
          {navigationItems.map((item) => {
            const isActive
              = pathname === item.href
                || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <SidebarNavigationItem
                key={item.id}
                item={item}
                isActive={isActive}
                isCollapsed={isCollapsed}
                tGeneral={tGeneral}
              />
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/20 p-4">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              <div className="mb-2 flex items-center gap-2">
                <div className="size-2 animate-pulse rounded-full bg-green-500" />
                <span>{t('online_status')}</span>
              </div>
              <div>{t('keyboard_shortcuts_hint')}</div>
            </div>
          )}
        </div>
      </div>
    </UiSurface>
  );
};
