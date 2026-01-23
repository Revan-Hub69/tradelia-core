'use client';

import { useTranslations } from 'next-intl';

import { DynamicIcon, type IconName } from '@/components/icons';
import { UiNavItem } from '@/components/ui/UiNavItem';
import { UiSurface } from '@/components/ui/UiSurface';
import { getVisibleNavigationItems } from '@/data/navigation.config';
import { useOptimizedNavigation } from '@/hooks/useOptimizedNavigation';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type BottomNavigationSimpleProps = {
  className?: string;
};

export const BottomNavigationSimple: React.FC<BottomNavigationSimpleProps> = ({ className }) => {
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
        'fixed bottom-0 left-0 right-0 layer-nav',
        'md:hidden', // Hide on tablet+ (768px+)
        'border-t border-white/20 dark:border-white/10',
        'shadow-lg shadow-black/10 dark:shadow-black/30',
        'pb-safe-bottom',
        // Prevent text selection on navigation buttons
        'select-none',
        className,
      )}
      role="navigation"
      aria-label={t('nav_aria_primary')}
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
            || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <UiNavItem
              key={item.id}
              active={isActive}
              className={cn(
                'nav-item tap-target', // Add navigation classes
                'relative flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2',
                'min-h-[56px]',
                'text-xs font-medium',
                'touch-action-manipulation',
                // Prevent text selection
                'select-none',
                // CSS-based active indicator instead of Framer Motion
                'before:absolute before:inset-0 before:rounded-2xl before:bg-primary/10 before:opacity-0 before:transition-opacity before:duration-200',
                isActive && 'before:opacity-100',
                {
                  'animate-pulse navigation-skeleton': isPending && navigationTarget === item.href,
                },
              )}
              onClick={() => handleNavigation(item.href)}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* OPTIMIZED ICON - CSS transforms instead of Framer Motion */}
              <div
                className={cn(
                  'relative z-10 transition-all duration-200 ease-out',
                  'active:scale-90 active:-translate-y-1',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/80 group-hover:text-foreground',
                )}
              >
                <DynamicIcon
                  name={item.iconName as IconName}
                  size={24}
                  variant="premium"
                  isActive={isActive}
                  className={cn(
                    'transition-all duration-200',
                    isPending && navigationTarget === item.href && 'animate-pulse',
                  )}
                />
              </div>

              <span
                className={cn(
                  'relative z-10 mt-1 truncate leading-tight text-muted-foreground transition-colors duration-200',
                  'group-hover:text-foreground/90',
                  'select-none', // Prevent text selection
                  isActive && 'text-foreground',
                )}
              >
                {t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
              </span>
            </UiNavItem>
          );
        })}
      </div>
    </UiSurface>
  );
};