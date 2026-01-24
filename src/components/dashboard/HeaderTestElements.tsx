/*
 * HEADER TEST ELEMENTS - A/B Testing
 *
 * Versioni alternative degli elementi header con classi COMPLETAMENTE diverse
 * Per isolare se il problema è nelle classi CSS o nella logica React
 */

'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { GlobeIcon, MoonIcon, SunIcon } from '@/components/icons/unified/UnifiedIconSystem';

// ============================================================================
// TEST VERSION - ThemeSwitcher con classi DIVERSE
// ============================================================================

export const ThemeSwitcherTest = React.memo(() => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
        aria-hidden="true"
      >
        <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {isDark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </button>
  );
});

ThemeSwitcherTest.displayName = 'ThemeSwitcherTest';

// ============================================================================
// TEST VERSION - LanguageSwitcher con classi DIVERSE
// ============================================================================

export const LanguageSwitcherTest = React.memo(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
        aria-hidden="true"
      >
        <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Change language"
    >
      <GlobeIcon size={20} />
    </button>
  );
});

LanguageSwitcherTest.displayName = 'LanguageSwitcherTest';

// ============================================================================
// TEST VERSION - NotificationsBell con classi DIVERSE
// ============================================================================

export const NotificationsBellTest = React.memo(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
        aria-hidden="true"
      >
        <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Notifications"
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
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    </button>
  );
});

NotificationsBellTest.displayName = 'NotificationsBellTest';

// ============================================================================
// TEST VERSION - UserDropdown con classi DIVERSE
// ============================================================================

export const UserDropdownTest = React.memo<{
  userName: string;
  userEmail: string;
}>(({ userName, userEmail }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = userName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!mounted) {
    return (
      <div
        className="flex h-11 items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 dark:border-gray-700 dark:bg-gray-800"
        aria-hidden="true"
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="hidden sm:block">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex h-11 items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="User menu"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="hidden text-left sm:block">
        <div className="max-w-32 truncate text-sm font-medium">{userName}</div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
});

UserDropdownTest.displayName = 'UserDropdownTest';
