/*
 * DASHBOARD HEADER - Enterprise 2026
 *
 * Header composable con variants e slots
 * Supporta context-aware content e scroll behavior
 *
 * MIGRATED: Using Signature Primitives v1
 * - UiSurface variant="header"
 * - UiButton for primary actions
 * - UiStatusChip for status indicators
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { UiButton, UiStatusChip, UiSurface } from '@/components/ui';
import { useUserData } from '@/hooks/useUserData';
import { Logo } from '@/templates/Logo';
import { cn } from '@/utils/Helpers';

import { LanguageSwitcherDashboard } from './LanguageSwitcherDashboard';
import { NotificationsBell } from './NotificationsBell';
import { ThemeSwitcher } from './ThemeSwitcher';
import { UserDropdown } from './UserDropdown';

export type HeaderAction = {
  label: string; // Already translated (no labelKey)
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

export type HeaderStatus = {
  type: 'streak' | 'focus' | 'next' | 'progress';
  value: number | string;
  label?: string; // Already translated (no labelKey)
};

export type DashboardHeaderProps = {
  titleKey?: string;
  primaryAction?: HeaderAction;
  status?: HeaderStatus;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  className?: string;
  showScrollShadow?: boolean;
  titleAs?: 'h1' | 'h2' | 'p'; // A11y: configurable heading level
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  titleKey,
  primaryAction,
  status,
  rightSlot,
  leftSlot,
  className,
  showScrollShadow = true,
  titleAs = 'h1', // Default h1, but configurable
}) => {
  const t = useTranslations('Dashboard');
  const tGeneral = useTranslations();
  const { userData, isLoading } = useUserData();
  const [hasScrolled, setHasScrolled] = useState(false);
  const rafRef = useRef<number>();

  // Scroll shadow effect with throttling via requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      return;
    }

    rafRef.current = requestAnimationFrame(() => {
      setHasScrolled(window.scrollY > 10);
      rafRef.current = undefined;
    });
  }, []);

  useEffect(() => {
    if (!showScrollShadow) {
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [showScrollShadow, handleScroll]);

  // Status chip renderer (migrated to UiStatusChip)
  const renderStatus = () => {
    if (!status) {
      return null;
    }

    switch (status.type) {
      case 'streak': {
        return (
          <UiStatusChip
            variant="streak"
            label={status.label || t('days')}
            value={status.value}
            dot
          />
        );
      }
      case 'focus': {
        return (
          <UiStatusChip
            variant="info"
            label={status.label || t('focus_mode_active')}
            dot
          />
        );
      }
      case 'next': {
        return (
          <UiStatusChip
            variant="info"
            label={status.label || String(status.value)}
          />
        );
      }
      case 'progress': {
        return (
          <UiStatusChip
            variant="progress"
            label={status.label || t('completed')}
            value={`${status.value}%`}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  // Primary action renderer (migrated to UiButton)
  const renderPrimaryAction = () => {
    if (!primaryAction) {
      return null;
    }

    return (
      <UiButton
        variant={primaryAction.variant === 'secondary' ? 'secondary' : 'primary'}
        size="sm"
        onClick={primaryAction.onClick}
      >
        {primaryAction.icon}
        <span>{primaryAction.label}</span>
      </UiButton>
    );
  };

  // Safe email fallback
  const getUserDisplayName = (): string => {
    if (!userData) {
      return t('not_authenticated');
    }
    if (userData.name) {
      return userData.name;
    }
    const safeEmail = userData.email ?? '';
    const parts = safeEmail.split('@');
    return safeEmail.includes('@') && parts[0] ? parts[0] : 'User';
  };

  // Dynamic title component
  const TitleComponent = titleAs;

  return (
    <UiSurface
      variant="header"
      className={cn(
        'sticky top-0 layer-header',
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
              <Logo size="sm" href="/dashboard" />
            </div>
          )}

          {/* Context Title */}
          {titleKey && (
            <div className="hidden sm:block">
              <TitleComponent className="text-lg font-semibold text-foreground">
                {tGeneral(titleKey as any)}
              </TitleComponent>
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

          {/* Notifications Bell */}
          <NotificationsBell />

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Language Switcher */}
          <LanguageSwitcherDashboard />

          {/* User Dropdown */}
          <div className="flex items-center">
            {isLoading
              ? (
                  <div className="size-8 animate-pulse rounded-full bg-muted" />
                )
              : userData
                ? (
                    <UserDropdown
                      userName={getUserDisplayName()}
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
    </UiSurface>
  );
};
