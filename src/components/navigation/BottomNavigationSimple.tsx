/*
 * BOTTOM NAVIGATION - iOS 26 Capsule Design
 *
 * Enhanced with Apple iOS 26 design language:
 * - Capsule-shaped, inset from screen edges
 * - Floating effect with premium shadows
 * - Liquid Glass material system
 * - Haptic feedback on interactions
 * - Optimized for thumb reachability
 *
 * RESEARCH SOURCES:
 * - iOS 26 Tab Bar Design (Michael Tsai, 2026)
 * - Bottom Tab Bar Best Practices (Nick Babich, 2022)
 * - Mobile Navigation Deep Research 2026
 */

'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { DynamicIcon, type IconName } from '@/components/icons';
import { getVisibleNavigationItems } from '@/data/navigation.config';
import { useOptimizedNavigation } from '@/hooks/useOptimizedNavigation';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type BottomNavigationSimpleProps = {
  className?: string;
};

// Haptic feedback helper (Phase 2)
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10], // Navigation tap
      medium: [20], // Action button
      heavy: [30], // Primary action
    };
    navigator.vibrate(patterns[type]);
  }
};

export const BottomNavigationSimple: React.FC<BottomNavigationSimpleProps> = ({ className }) => {
  const pathname = usePathname();
  const t = useTranslations('Dashboard') as any;
  const navigationItems = getVisibleNavigationItems();
  const { navigate, isPending, navigationTarget } = useOptimizedNavigation();

  const handleNavigation = useCallback((href: string) => {
    if (pathname === href) {
      return;
    }

    // Haptic feedback on tap
    triggerHaptic('light');

    navigate(href);
  }, [pathname, navigate]);

  return (
    <nav
      className={cn(
        // iOS 26 Capsule Design
        'bottom-nav-capsule-2026',
        className,
      )}
      role="navigation"
      aria-label={t('nav_aria_primary')}
    >
      <div className="flex h-full items-center justify-around gap-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
            || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isLoading = isPending && navigationTarget === item.href;

          return (
            <button
              key={item.id}
              type="button"
              className="bottom-nav-item-2026"
              data-active={isActive}
              data-loading={isLoading}
              onClick={() => handleNavigation(item.href)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
            >
              {/* Icon */}
              <div className="bottom-nav-icon-2026">
                <DynamicIcon
                  name={item.iconName as IconName}
                  size={24}
                  variant="premium"
                  isActive={isActive}
                />
              </div>

              {/* Label */}
              <span className="bottom-nav-label-2026">
                {t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
