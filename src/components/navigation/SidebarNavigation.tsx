/*
 * SIDEBAR NAVIGATION - Premium Liquid Glass 2026
 *
 * Enhanced with Apple Liquid Glass design language and Tier-1 research:
 * - Liquid Glass material system (Apple 2026 standard)
 * - Internal toggle button with optimal spacing (Figma UI3 lesson learned)
 * - Premium spring physics animations
 * - Educational calm integration
 * - Enterprise-level accessibility
 *
 * RESEARCH SOURCES:
 * - Apple Liquid Glass Documentation 2026
 * - Figma UI3 Design Lessons (floating panels failure)
 * - Notion sidebar toggle positioning
 * - Stripe enterprise patterns
 *
 * PERFORMANCE OPTIMIZED:
 * - Selective Framer Motion imports
 * - CSS-based animations for simple cases
 * - GPU acceleration with will-change
 * - Educational timing integration
 */

'use client';

// PERFORMANCE: Selective Framer Motion imports
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { DynamicIcon, type IconName, SidebarToggleIcon } from '@/components/icons';
import { NavigationSkeleton } from '@/components/ui/skeleton';
import { UiNavItem } from '@/components/ui/UiNavItem';
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
        {/* PREMIUM ACTIVE RAIL INDICATOR - Optimized Motion */}
        {isActive && canNavigate && (
          <motion.div
            layoutId="activeRail"
            className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary"
            initial={false}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
          />
        )}

        {/* Icon with state indicators - CSS-based hover, Motion for complex animations */}
        <div
          className={cn(
            'relative shrink-0 transition-all duration-200 ease-out',
            'hover:scale-105 active:scale-95',
            isActive
              ? 'text-primary'
              : 'text-foreground/80 group-hover:text-foreground',
            !canNavigate && 'text-muted-foreground/40',
          )}
        >
          <DynamicIcon
            name={item.iconName as IconName}
            size={24}
            variant="premium"
            isActive={isActive}
            className={cn(
              'transition-colors duration-200',
              !canNavigate && 'opacity-60',
            )}
          />

          {/* State indicators - CSS animations for performance */}
          {uxState === 'blocked' && (
            <div className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full bg-warning ring-2 ring-background" />
          )}

          {uxState === 'offline' && (
            <div className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full bg-destructive ring-2 ring-background" />
          )}

          {/* Badge dot for notifications - CSS pulse */}
          {canNavigate && item.badgeType === 'dot' && (
            <div className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full bg-accent ring-2 ring-background" />
          )}
        </div>

        {/* Label - Hidden when collapsed */}
        {!isCollapsed && (
          <span
            className={cn(
              'flex-1 truncate text-muted-foreground transition-colors duration-200',
              'group-hover:text-foreground/90',
              isActive && canNavigate && 'text-foreground',
            )}
          >
            {tGeneral(item.labelKey)}
          </span>
        )}

        {/* Keyboard shortcut hint */}
        {!isCollapsed && !isActive && canNavigate && (
          <span className="ml-auto text-xs text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
            Alt+
            {getVisibleNavigationItems().findIndex(nav => nav.id === item.id) + 1}
          </span>
        )}

        {/* Tooltip for collapsed state - CSS only */}
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

  // Keyboard shortcut support - Cmd+\ (Tier-1 standard)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '\\') {
        event.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update CSS custom property for dynamic grid layout
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width-current', isCollapsed ? '64px' : '256px');
  }, [isCollapsed]);

  if (isLoading) {
    return (
      <motion.div
        className={cn(
          'hidden md:block',
          'fixed left-0 top-0 h-screen z-40',
          'glass-sidebar',
          'sidebar-premium-2026',
          isCollapsed ? 'collapsed' : 'expanded',
          className,
        )}
        initial={false}
        animate={{
          width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-col border-b border-border/20 p-4 gap-3">
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
            <div className={cn('flex', isCollapsed ? 'justify-center' : 'justify-end')}>
              <div className="size-9 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <NavigationSkeleton isCollapsed={isCollapsed} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        // Responsive visibility - Show on tablet and desktop (768px+)
        'hidden md:block',
        'fixed left-0 top-0 h-screen z-40',
        // Liquid Glass Material System - Apple 2026 Standard
        'glass-sidebar',
        // Premium Animation System
        'sidebar-premium-2026',
        isCollapsed ? 'collapsed' : 'expanded',
        className,
      )}
      initial={false}
      animate={{
        width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        duration: 0.4,
      }}
      role="navigation"
      aria-label={t('nav_aria_sidebar')}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header with Liquid Glass */}
        <div className="flex flex-col border-b border-border/20 p-4 min-h-[80px] gap-3">
          {/* Logo - Clickable to /dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center rounded-lg p-1 transition-all duration-200',
              'hover:bg-background/50 hover:scale-[1.02]',
              'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
              isCollapsed ? 'justify-center' : 'justify-start',
            )}
            title={isCollapsed ? 'Go to Dashboard' : undefined}
          >
            {isCollapsed
              ? (
                  <Logo isTextHidden size="sm" />
                )
              : (
                  <Logo size="sm" />
                )}
          </Link>

          {/* Toggle Button - Separated from logo */}
          <div className={cn(
            'flex',
            isCollapsed ? 'justify-center' : 'justify-end'
          )}>
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                // Liquid Glass Toggle Button
                'glass-toggle',
                'relative size-9 rounded-lg border',
                'flex items-center justify-center',
                // Educational Calm Integration
                'educational-hover educational-focus',
              )}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              aria-label={
                isCollapsed
                  ? (t('expand_sidebar') as string)
                  : (t('collapse_sidebar') as string)
              }
              aria-pressed={!isCollapsed}
            >
              <SidebarToggleIcon
                isExpanded={!isCollapsed}
                showAnimation
                size={16}
                variant="signature"
              />
            </motion.button>
          </div>
        </div>

        {/* Navigation Items with Staggered Animation */}
        <motion.nav
          className="flex-1 space-y-2 p-4"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {navigationItems.map((item, index) => {
            const isActive
              = pathname === item.href
                || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <SidebarNavigationItem
                  item={item}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                  tGeneral={tGeneral}
                />
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Sidebar Footer with Liquid Glass */}
        <motion.div
          className="border-t border-border/20 p-4"
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.3, delay: isCollapsed ? 0 : 0.2 }}
        >
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <div className="size-2 animate-pulse rounded-full bg-green-500" />
                <span>{t('online_status')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground/70">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">Cmd</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">\</kbd>
                <span>Toggle sidebar</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
