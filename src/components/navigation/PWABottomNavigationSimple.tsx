'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { DynamicIcon, type IconName } from '@/components/icons';
import { getVisibleNavigationItems } from '@/data/navigation.config';

type PWABottomNavigationSimpleProps = {
  className?: string;
};

export const PWABottomNavigationSimple: React.FC<PWABottomNavigationSimpleProps> = ({ className }) => {
  const pathname = usePathname();
  const t = useTranslations();
  const navigationItems = getVisibleNavigationItems();
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  const handleNavigation = (href: string, itemId: string) => {
    if (pathname === href) {
      return;
    }
    
    // Set loading state for premium feedback
    setIsNavigating(itemId);
    
    // Simple, reliable navigation with loading feedback
    setTimeout(() => {
      window.location.href = href;
    }, 150); // Small delay for visual feedback
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'md:hidden', // Hide on tablet+ (768px+)
        'bg-white/95 dark:bg-slate-900/95',
        'backdrop-blur-2xl backdrop-saturate-150',
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
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.href, item.id)}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2',
                'min-h-[44px] tap-target',
                'text-xs font-medium',
                'transition-all duration-300 motion-spring-premium',
                'touch-action-manipulation press-depth',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                {
                  'text-primary': isActive,
                  'text-muted-foreground hover:text-foreground hover-glow': !isActive,
                  'animate-pulse': isNavigating === item.id,
                },
              )}
              aria-label={t(item.labelKey as any)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative mb-1">
                <DynamicIcon
                  name={item.iconName as IconName}
                  size={20}
                  className={cn(
                    'transition-transform duration-300 motion-spring',
                    isActive && 'scale-110',
                    isNavigating === item.id && 'animate-pulse',
                  )}
                />
              </div>

              <span className="truncate leading-tight">
                {t(item.labelKey as any)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};