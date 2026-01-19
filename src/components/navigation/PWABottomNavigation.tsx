'use client';

import { Home, BookOpen, Wrench, Users, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type PWABottomNavigationProps = {
  className?: string;
};

export const PWABottomNavigation = ({ className }: PWABottomNavigationProps) => {
  const pathname = usePathname();
  const t = useTranslations('Dashboard') as (key: string) => string;

  const navigationItems = [
    {
      id: 'home',
      label: t('nav_home'),
      href: '/dashboard',
      icon: Home,
    },
    {
      id: 'learn',
      label: t('nav_learn'),
      href: '/dashboard/learn',
      icon: BookOpen,
    },
    {
      id: 'tools',
      label: t('nav_tools'),
      href: '/dashboard/tools',
      icon: Wrench,
    },
    {
      id: 'people',
      label: t('nav_people'),
      href: '/dashboard/community',
      icon: Users,
    },
    {
      id: 'profile',
      label: t('nav_profile'),
      href: '/dashboard/profile',
      icon: User,
    },
  ];

  return (
    <nav
      className={cn(
        // Fixed positioning for PWA
        'fixed bottom-0 left-0 right-0 z-50',
        // Glassmorphism design
        'bg-white/95 dark:bg-slate-900/95',
        'backdrop-blur-2xl backdrop-saturate-150',
        'border-t border-white/20 dark:border-white/10',
        // iOS safe area support
        'pb-safe-bottom',
        // Shadow for depth
        'shadow-lg shadow-black/10 dark:shadow-black/30',
        className,
      )}
      aria-label="Navigazione principale"
    >
      <div className="mx-auto max-w-screen-xl">
        <div className="flex h-16 items-center justify-around px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
              || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  // Base styles
                  'flex flex-col items-center justify-center',
                  'min-w-0 flex-1 px-1 py-2',
                  'rounded-xl transition-all duration-200',
                  // Touch target (44px minimum)
                  'min-h-[44px]',
                  // Active state
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/10',
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'size-5 mb-1 transition-transform duration-200',
                    isActive && 'scale-110',
                  )}
                />
                <span className="text-xs font-medium leading-none truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};