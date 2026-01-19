/*
 * DASHBOARD HEADER - Enterprise 2026
 * 
 * Header composable con variants e slots
 * Supporta context-aware content e scroll behavior
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/Helpers';
import { Logo } from '@/templates/Logo';
import { UserDropdown } from './UserDropdown';
import { useUserData } from '@/hooks/useUserData';

export type HeaderVariant = 'home' | 'learn' | 'tools' | 'community' | 'profile';

export interface HeaderAction {
  labelKey: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export interface HeaderStatus {
  type: 'streak' | 'focus' | 'next' | 'progress';
  value: number | string;
  labelKey?: string;
}

export interface DashboardHeaderProps {
  variant?: HeaderVariant;
  titleKey?: string;
  primaryAction?: HeaderAction;
  status?: HeaderStatus;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  className?: string;
  showScrollShadow?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  titleKey,
  primaryAction,
  status,
  rightSlot,
  leftSlot,
  className,
  showScrollShadow = true,
}) => {
  const t = useTranslations();
  const { userData, isLoading } = useUserData();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll shadow effect
  useEffect(() => {
    if (!showScrollShadow) return;

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollShadow]);

  // Status chip renderer
  const renderStatus = () => {
    if (!status) return null;

    const getStatusContent = () => {
      switch (status.type) {
        case 'streak':
          return (
            <div className="flex items-center gap-1.5">
              <div className="size-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {status.value} {t('Dashboard.days' as any)}
              </span>
            </div>
          );
        case 'focus':
          return (
            <div className="flex items-center gap-1.5">
              <div className="size-2 bg-primary rounded-full" />
              <span className="text-sm font-medium">
                {t('Dashboard.focus_mode_active' as any)}
              </span>
            </div>
          );
        case 'next':
          return (
            <span className="text-sm font-medium">
              {status.labelKey ? t(status.labelKey as any) : status.value}
            </span>
          );
        case 'progress':
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${status.value}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {status.value}%
              </span>
            </div>
          );
        default:
          return null;
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
    if (!primaryAction) return null;

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
      <div className="mx-auto flex header-height max-w-screen-xl items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {leftSlot || <Logo size="sm" />}

          {/* Context Title */}
          {titleKey && (
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                {t(titleKey as any)}
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
            {isLoading ? (
              <div className="size-8 animate-pulse rounded-full bg-muted" />
            ) : userData ? (
              <UserDropdown
                userName={userData.name || userData.email.split('@')[0] || 'Utente'}
                userEmail={userData.email}
              />
            ) : (
              <div className="text-xs text-muted-foreground">
                {t('Dashboard.not_authenticated' as any)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};