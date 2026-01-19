/*
 * SIDEBAR NAVIGATION - Desktop Navigation (1024px+)
 * 
 * Collapsible sidebar navigation for desktop experience
 * Enterprise-level navigation with keyboard shortcuts and advanced features
 */

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { DynamicIcon, type IconName } from '@/components/icons';
import { getVisibleNavigationItems } from '@/data/navigation.config';
import { useNavigationState } from '@/hooks/useNavigationState';
import { Logo } from '@/templates/Logo';
import { Button } from '@/components/ui/button';

type SidebarNavigationProps = {
  className?: string;
  defaultCollapsed?: boolean;
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  className,
  defaultCollapsed = false 
}) => {
  const pathname = usePathname();
  const t = useTranslations();
  const navigationItems = getVisibleNavigationItems();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <aside 
      className={cn(
        // Responsive visibility - Only show on desktop
        'hidden lg:block',
        'layout-sidebar border-r border-border/20 glass-surface',
        'transition-all duration-300 ease-out',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
      role="navigation"
      aria-label={t('Dashboard.nav_aria_sidebar' as any)}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          {!isCollapsed && (
            <Logo size="sm" />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="size-8 p-0 hover:bg-white/60 dark:hover:bg-white/10"
            aria-label={isCollapsed ? t('Dashboard.expand_sidebar' as any) : t('Dashboard.collapse_sidebar' as any)}
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
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

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
        <div className="p-4 border-t border-border/20">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                <span>{t('Dashboard.online_status' as any)}</span>
              </div>
              <div>
                {t('Dashboard.keyboard_shortcuts_hint' as any)}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// Sidebar Navigation Item Component
interface SidebarNavigationItemProps {
  item: any;
  isActive: boolean;
  isCollapsed: boolean;
  t: any;
}

const SidebarNavigationItem: React.FC<SidebarNavigationItemProps> = ({
  item,
  isActive,
  isCollapsed,
  t,
}) => {
  const { visualState, uxState, navigate, canNavigate } = useNavigationState(
    item.href,
    item.id
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canNavigate) {
      navigate();
    }
  };

  return (
    <Link
      href={item.href}
      prefetch={item.isPriority && canNavigate}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg',
        'text-sm font-medium transition-all duration-200',
        'tap-target press-depth focus-ring touch-optimized',
        'group relative',
        {
          'bg-primary/10 text-primary shadow-sm': isActive && canNavigate,
          'text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-white/10': 
            !isActive && canNavigate,
          'text-muted-foreground/40 cursor-not-allowed': !canNavigate,
        },
        isCollapsed && 'justify-center px-2',
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={!canNavigate}
      title={isCollapsed ? t(item.labelKey as any) : undefined}
    >
      <div className="relative flex-shrink-0">
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
        {visualState === 'pending' && (
          <div className="absolute -top-1 -right-1 size-2 bg-primary rounded-full animate-pulse" />
        )}

        {uxState === 'blocked' && (
          <div className="absolute -top-1 -right-1 size-2 bg-warning rounded-full" />
        )}

        {uxState === 'offline' && (
          <div className="absolute -top-1 -right-1 size-2 bg-destructive rounded-full" />
        )}

        {/* Badge dot for notifications */}
        {canNavigate && item.badgeType === 'dot' && (
          <div className="absolute -top-1 -right-1 size-2 bg-accent rounded-full" />
        )}
      </div>

      {/* Label - Hidden when collapsed */}
      {!isCollapsed && (
        <span className="truncate">
          {t(item.labelKey as any)}
        </span>
      )}

      {/* Keyboard shortcut hint */}
      {!isCollapsed && !isActive && canNavigate && (
        <span className="ml-auto text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
          Alt+{getVisibleNavigationItems().findIndex((nav) => nav.id === item.id) + 1}
        </span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {t(item.labelKey as any)}
        </div>
      )}
    </Link>
  );
};