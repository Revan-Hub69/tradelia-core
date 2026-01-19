/*
 * DASHBOARD HEADER - Enterprise 2026
 *
 * Header composable con variants e slots
 * Supporta context-aware content e scroll behavior
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { useUserData } from '@/hooks/useUserData';
import { Logo } from '@/templates/Logo';
import { cn } from '@/utils/Helpers';

import { UserDropdown } from './UserDropdown';

export type HeaderVariant = 'home' | 'learn' | 'tools' | 'community' | 'profile';

export type HeaderAction = {
  labelKey: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

export type HeaderStatus = {
  type: 'streak' | 'focus' | 'next' | 'progress';
  value: number | string;
  labelKey?: string;
};

export type DashboardHeaderProps = {
  variant?: HeaderVariant;
  titleKey?: string;
  primaryAction?: HeaderAction;
  status?: HeaderStatus;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  className?: string;
  showScrollShadow?: boolean;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  titleKey,
  primaryAction,
  status,
  rightSlot,
  leftSlot,
  className,
  showScrollShadow = true,
}) => {
  const t = useTranslations('Dashboard');
  const tGeneral = useTranslations();
  const { userData, isLoading } = useUserData();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll shadow effect
  useEffect(() => {
    if (!showScrollShadow) {
      return;
    }

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollShadow]);

  // Status chip renderer
  const renderStatus = () => {
    if (!status) {
      return null;
    }

    const getStatusContent = () => {
      switch (status.type) {
        case 'streak': {
          return (
            <div className="flex items-center gap-1.5">
              <div className="size-2 animate-pulse rounded-full bg-accent" />
              <span className="text-sm font-medium">
                {status.value}
                {' '}
                {t('days')}
              </span>
            </div>
          );
        }
        case 'focus': {
          return (
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">
                {t('focus_mode_active')}
              </span>
            </div>
          );
        }
        case 'next': {
          return (
            <span className="text-sm font-medium">
              {status.labelKey ? t(status.labelKey as any) : status.value}
            </span>
          );
        }
        case 'progress': {
          return (
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${status.value}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {status.value}
                %
              </span>
            </div>
          );
        }
        default: {
          return null;
        }
      }
    };

    return (
      <div
        className={cn(
          'px-3 py-1.5 rounded-full glass-surface',
          'motion-fast hover-lift',
        )}
      >
        {getStatusContent()}
      </div>
    );
  };

  // Primary action renderer
  const renderPrimaryAction = () => {
    if (!primaryAction) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={primaryAction.onClick}
        className={cn(
          'px-4 py-2 rounded-xl font-medium text-sm',
          'press-depth touch-optimized focus-ring',
          'motion-fast',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90':
              primaryAction.variant !== 'secondary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80':
              primaryAction.variant === 'secondary',
          },
        )}
      >
        <div className="flex items-center gap-2">
          {primaryAction.icon}
          <span>{t(primaryAction.labelKey as any)}</span>
        </div>
      </button>
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 layer-header',
        'glass-header',
        'motion-base',
        // Scroll shadow
        hasScrolled && showScrollShadow && 'shadow-medium',
        className,
      )}
    >
      <div className="header-height mx-auto flex max-w-screen-xl items-center justify-between px-4">
        {/* Left Section - No logo on desktop when sidebar is visible */}
        <div className="flex items-center gap-4">
          {leftSlot || (
            <div className="md:hidden">
              <Logo size="sm" />
            </div>
          )}

          {/* Context Title */}
          {titleKey && (
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                {tGeneral(titleKey as any)}
              </h1>
            </div>
          )}
        </div>

        {/* Center Section - Status */}
        <div className="flex items-center justify-center">
          {renderStatus()}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Primary Action */}
          {renderPrimaryAction()}

          {/* Custom Right Slot */}
          {rightSlot}

          {/* User Dropdown */}
          <div className="flex items-center">
            {isLoading
              ? (
                  <div className="size-8 animate-pulse rounded-full bg-muted" />
                )
              : userData
                ? (
                    <UserDropdown
                      userName={userData.name || userData.email.split('@')[0] || 'User'}
                      userEmail={userData.email}
                    />
                  )
                : (
                    <div className="text-xs text-muted-foreground">
                      {t('not_authenticated')}
                    </div>
                  )}
          </div>
        </div>
      </div>
    </header>
  );
};
