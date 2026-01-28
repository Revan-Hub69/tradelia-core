/*
 * MOBILE MENU - Slide-out menu for mobile navigation
 *
 * Contains items removed from bottom nav:
 * - Help
 * - Language Switcher
 * - Theme Toggle
 * - Profile link
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect } from 'react';

import { LanguageSwitcherDashboard } from '@/components/dashboard/LanguageSwitcherDashboard';
import { ThemeSwitcher } from '@/components/dashboard/ThemeSwitcher';
import { DynamicIcon } from '@/components/icons';
import { useNavigationContext } from '@/components/navigation/useNavigationContext';
import { MOBILE_MENU_ITEMS } from '@/data/navigation.config';
import { cn } from '@/utils/Helpers';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('Dashboard') as any;
  const { closeOverlay } = useNavigationContext();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
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
            onClick={onClose}
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

        {/* Menu Content */}
        <div className="space-y-6 p-4">
          {/* Quick Settings */}
          <div className="space-y-3">
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

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('navigation')}
            </h3>
            <nav className="space-y-1">
              {MOBILE_MENU_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.href)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <DynamicIcon
                    name={item.iconName as any}
                    size={20}
                    variant="premium"
                  />
                  {t(item.labelKey.replace('Dashboard.', '') as 'nav_help')}
                </button>
              ))}
            </nav>
          </div>

          {/* Help Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('support')}
            </h3>
            <a
              href="/dashboard/help"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              {t('nav_help')}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t border-border p-4">
          <p className="text-center text-xs text-muted-foreground">
            {t('app_version', { version: '2026.1' })}
          </p>
        </div>
      </div>
    </>
  );
};
