/*
 * HEADER NAVIGATION - Tablet Navigation (768px-1023px)
 *
 * Horizontal tab navigation for tablet breakpoint
 * Fills the navigation gap between mobile bottom nav and desktop sidebar
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { DynamicIcon, type IconName } from '@/components/icons';
import { getVisibleNavigationItems, trackNavigationEvent } from '@/data/navigation.config';
import { useNavigationState } from '@/hooks/useNavigationState';
import { Link, usePathname, useRouter } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type HeaderNavigationProps = {
  className?: string;
};

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ className }) => {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const navigationItems = getVisibleNavigationItems();

  return (
    <nav
      className={cn(
        // Responsive visibility - Only show on tablet
        'hidden md:block lg:hidden',
        'border-b border-border/20 glass-surface',
        'layout-header-nav', // Grid assignment for CLS prevention
        className,
      )}
      role="navigation"
      aria-label={t('nav_aria_secondary')}
    >
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center justify-center space-x-1 px-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
              || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <HeaderNavigationItem
                key={item.id}
                item={item}
                isActive={isActive}
                t={t}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// Header Navigation Item Component
type HeaderNavigationItemProps = {
  item: any;
  isActive: boolean;
  t: any;
};

const HeaderNavigationItem: React.FC<HeaderNavigationItemProps> = ({
  item,
  isActive,
  t,
}) => {
  const router = useRouter();
  const [visualState, setVisualState] = useState<'default' | 'pressed'>('default');
  const { uxState, canNavigate } = useNavigationState(
    item.href,
    item.id,
  );

  // Auto-reset pressed state
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

    // Simple programmatic navigation
    setVisualState('pressed');

    // Track navigation event
    trackNavigationEvent({
      action: 'nav_click',
      itemId: item.id,
      timestamp: Date.now(),
      metadata: { href: item.href, isOnline: true, isEnabled: true },
    });

    // Direct navigation using router
    try {
      router.push(item.href);
    } catch (error) {
      // Fallback handled by router
    }
  };

  return (
    <Link
      href={item.href}
      prefetch={item.isPriority && canNavigate}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-4 py-3 text-sm font-medium',
        'border-b-2 border-transparent transition-all duration-200',
        'tap-target press-depth focus-ring touch-optimized',
        'hover:bg-white/40 dark:hover:bg-white/5',
        {
          'border-primary text-primary bg-primary/5': isActive && canNavigate,
          'text-muted-foreground hover:text-foreground': !isActive && canNavigate,
          'text-muted-foreground/40 cursor-not-allowed': !canNavigate,
          'hover:border-primary/50': !isActive && canNavigate,
        },
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={!canNavigate}
    >
      <div className="relative">
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
      </div>

      <span className="font-medium">
        {t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
      </span>

      {/* Active indicator line */}
      {isActive && (
        <div
          className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
    </Link>
  );
};
