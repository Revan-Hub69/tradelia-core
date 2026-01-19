'use client';

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

  const handleNavigation = (href: string) => {
    if (pathname === href) {
      return;
    }
    
    // Simple, reliable navigation
    window.location.href = href;
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
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2',
                'min-h-[44px] tap-target',
                'text-xs font-medium',
                'transition-all duration-200',
                'touch-action-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                {
                  'text-primary': isActive,
                  'text-muted-foreground hover:text-foreground': !isActive,
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
                    'transition-transform duration-200',
                    isActive && 'scale-110',
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