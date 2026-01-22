'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { CommunityIcon, DynamicIcon, HomeIcon, type IconName, LearnIcon, ProfileIcon, ToolsIcon } from '@/components/icons';
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
                'relative flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2',
                'min-h-[56px] tap-target',
                'text-xs font-medium',
                'touch-action-manipulation',
                {
                  'animate-pulse navigation-skeleton': isPending && navigationTarget === item.href,
                },
              )}
              onClick={() => handleNavigation(item.href)}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* PREMIUM ACTIVE PILL INDICATOR */}
              {isActive && (
                <motion.div
                  layoutId="mobileActivePill"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* PREMIUM ANIMATED ICON */}
              <motion.div
                className="relative z-10"
                whileTap={{ scale: [1, 0.9, 1.1, 1], y: [0, -3, 0] }}
                transition={{ duration: 0.3 }}
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
                      'transition-all duration-300',
                      isActive && 'text-primary',
                      isPending && navigationTarget === item.href && 'animate-pulse',
                    )}
                  />
                )}
              </motion.div>

              <span className="relative z-10 mt-1 truncate leading-tight">
                {t(item.labelKey.replace('Dashboard.', '') as 'nav_home')}
              </span>
            </UiNavItem>
          );
        })}
      </div>
    </UiSurface>
  );
};
