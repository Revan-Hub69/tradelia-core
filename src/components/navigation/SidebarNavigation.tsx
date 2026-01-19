/*
 * SIDEBAR NAVIGATION - Desktop Navigation (1024px+)
 *
 * Collapsible sidebar navigation for desktop experience
 * Enterprise-level navigation with keyboard shortcuts and advanced features
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { Button } from '@/components/ui/button';
import { NavigationSkeleton } from '@/components/ui/skeleton';
import { DynamicIcon, type IconName } from '@/components/icons';
import { getVisibleNavigationItems, trackNavigationEvent } from '@/data/navigation.config';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useOptimizedNavigation } from '@/hooks/useOptimizedNavigation';
import { Logo } from '@/templates/Logo';

type SidebarNavigationProps = {
  className?: string;
  defaultCollapsed?: boolean;
};

// Sidebar Navigation Item Component
type SidebarNavigationItemProps = {
  item: any;
  isActive: boolean;
  isCollapsed: boolean;
  t: any;
};

const SidebarNavigationItem: React.FC<SidebarNavigationItemProps> = ({
  item,
  isActive,
  isCollapsed,
  t,
}) => {
  const { navigate, isPending, navigationTarget } = useOptimizedNavigation();
  const [visualState, setVisualState] = useState<'default' | 'pressed'>('default');
  const { uxState, canNavigate } = useNavigationState(
    item.href,
    item.id,
  );

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
    <Link
      href={item.href}
      prefetch={item.isPriority && canNavigate}
      onClick={handleClick}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2',
        'text-sm font-medium transition-all duration-300',
        'tap-target press-depth focus-ring touch-optimized nav-item-hover',
        {
          'bg-primary/10 text-primary shadow-sm': isActive && canNavigate,
          'text-muted-foreground hover:text-foreground': !isActive && canNavigate,
          'cursor-not-allowed text-muted-foreground/40': !canNavigate,
          'navigation-skeleton': isNavigating,
        },
        isCollapsed && 'justify-center px-2',
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={!canNavigate}
      title={isCollapsed ? tGeneral(item.labelKey) : undefined}
    >
      <div className="relative shrink-0">
        <DynamicIcon
          name={item.iconName as IconName}
          size={20}
          className={cn(
            'motion-fast',
            isActive && 'scale-110',
            !canNavigate && 'opacity-40',
          )}
        />

        {/* State indicators */}
        {uxState === 'blocked' && (
          <div className="absolute -right-1 -top-1 size-2 rounded-full bg-warning" />
        )}

        {uxState === 'offline' && (
          <div className="absolute -right-1 -top-1 size-2 rounded-full bg-destructive" />
        )}

        {/* Badge dot for notifications */}
        {canNavigate && item.badgeType === 'dot' && (
          <div className="absolute -right-1 -top-1 size-2 rounded-full bg-accent" />
        )}
      </div>

      {/* Label - Hidden when collapsed */}
      {!isCollapsed && <span className="truncate">{tGeneral(item.labelKey)}</span>}

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
      <aside
        className={cn(
          'hidden md:block',
          'layout-sidebar border-r border-border/20 glass-surface',
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
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        // Responsive visibility - Show on tablet and desktop (768px+)
        'hidden md:block',
        'layout-sidebar border-r border-border/20 glass-surface',
        'transition-all duration-300 ease-out',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
      role="navigation"
      aria-label={t('nav_aria_sidebar')}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border/20 p-4">
          {/* Logo - Full when expanded, icon-only when collapsed */}
          <div className="flex items-center rounded-lg p-1 hover-lift-subtle">
            {isCollapsed
              ? (
                  <Logo isTextHidden size="sm" />
                )
              : (
                  <Logo size="sm" />
                )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="size-8 p-0 hover-scale hover:bg-primary/10 dark:hover:bg-primary/10"
            aria-label={
              isCollapsed
                ? (t('expand_sidebar') as string)
                : (t('collapse_sidebar') as string)
            }
          >
            <DynamicIcon
              name="ChevronDownIcon"
              size={16}
              className={cn(
                'transition-transform duration-200',
                isCollapsed && 'rotate-180',
              )}
            />
          </Button>
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
                t={t}
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
    </aside>
  );
};