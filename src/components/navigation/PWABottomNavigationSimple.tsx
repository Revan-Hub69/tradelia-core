'use client';

import { useTranslations } from 'next-intl';

import { DynamicIcon, type IconName } from '@/components/icons';
import { UiNavItem, UiSurface } from '@/components/ui';
import { getVisibleNavigationItems } from '@/data/navigation.config';
import { useOptimizedNavigation } from '@/hooks/useOptimizedNavigation';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type PWABottomNavigationSimpleProps = {
  className?: string;
};

export const PWABottomNavigationSimple: React.FC<PWABottomNavigationSimpleProps> = ({ className }) => {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const navigationItems = getVisibleNavigationItems();
  const { navigate, isPending, navigationTarget } = useOptimizedNavigation();

  const handleNavigation = (href: string) => {
    if (pathname === href) {
      return;
    }

    navigate(href);
  };

  return (
    <UiSurface
      variant="panel"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'md:hidden', // Hide on tablet+ (768px+)
        'border-t border-white/20 dark:border-white/10',
        'shadow-lg shadow-black/10 dark:shadow-black/30',
        'pb-safe-bottom',
        className,
      )}
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
            || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <UiNavItem
              key={item.id}
              active={isActive}
              icon={
                <DynamicIcon
                  name={item.iconName as IconName}
                  size={20}
                  className={cn(
                    'transition-transform duration-300 motion-spring',
                    isPending && navigationTarget === item.href && 'animate-pulse',
                  )}
                />
              }
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2',
                'min-h-[44px] tap-target',
                'text-xs font-medium',
                'touch-action-manipulation',
                {
                  'animate-pulse navigation-skeleton': isPending && navigationTarget === item.href,
                },
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <span className="truncate leading-tight">
                {t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
              </span>
            </UiNavItem>
          );
        })}
      </div>
    </UiSurface>
  );
};
