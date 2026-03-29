/*
 * MOBILE MENU - Slide-out menu for mobile navigation
 *
 * Complete mobile navigation hub with:
 * - All main navigation items (Challenges, My Challenges, Signals)
 * - Quick settings (Theme, Language)
 * - User account (Profile, Settings, Logout)
 * - Support (Help, Contact)
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect } from 'react';

import { LanguageSwitcherDashboard } from '@/components/dashboard/LanguageSwitcherDashboard';
import { ThemeSwitcher } from '@/components/dashboard/ThemeSwitcher';
import { DynamicIcon } from '@/components/icons';
import { useNavigationContext } from '@/components/navigation/useNavigationContext';
import { cn } from '@/utils/Helpers';

type MobileMenuProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

// Navigation items for mobile menu
const NAVIGATION_ITEMS = [
  {
    id: 'academy',
    labelKey: 'Dashboard.nav_academy',
    href: '/dashboard/academy',
    iconName: 'LearnIcon',
    badge: 'new' as const,
  },
  {
    id: 'fundamentals',
    labelKey: 'Dashboard.nav_fundamentals',
    href: '/dashboard/fundamentals',
    iconName: 'TrendingUpIcon',
  },
  {
    id: 'dca-simulator',
    labelKey: 'Dashboard.nav_dca_simulator',
    href: '/dashboard/dca-simulator',
    iconName: 'CalculatorIcon',
    badge: 'new' as const,
  },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onCloseAction }) => {
  const t = useTranslations('Dashboard') as any;
  const { closeOverlay } = useNavigationContext();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCloseAction();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCloseAction]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeOverlay(); // Close any existing overlay
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOverlay]);

  const handleNavigation = useCallback((href: string) => {
    window.location.href = href;
    onCloseAction();
  }, [onCloseAction]);

  const handleLogout = useCallback(() => {
    // TODO: Implement logout
    window.location.href = '/api/auth/signout';
    onCloseAction();
  }, [onCloseAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCloseAction}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-[100] h-full w-80 max-w-[85vw]',
          'bg-background border-l border-border',
          'shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('mobile_menu_title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">{t('mobile_menu_title')}</h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="rounded-lg p-2 transition-colors hover:bg-muted"
            aria-label={t('close')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Content - Scrollable */}
        <div className="h-[calc(100%-140px)] overflow-y-auto p-4">
          {/* Quick Settings */}
          <div className="mb-6 space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('settings')}
            </h3>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">{t('theme')}</span>
              <ThemeSwitcher />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">{t('language')}</span>
              <LanguageSwitcherDashboard />
            </div>
          </div>

          {/* Main Navigation */}
          <div className="mb-6 space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('navigation')}
            </h3>
            <nav className="space-y-1">
              {NAVIGATION_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.href)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <DynamicIcon
                      name={item.iconName as any}
                      size={20}
                      variant="premium"
                    />
                    {t(item.labelKey.replace('Dashboard.', '') as any)}
                  </div>
                  {item.badge && (
                    <span className="flex size-2 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Account Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('account')}
            </h3>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {t('app_version', { version: '2026.1' })}
            </p>
            <a
              href="/dashboard"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={onCloseAction}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {t('back_to_home')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
