/*
 * HEADER SKELETONS - SSR-Safe Placeholders
 *
 * Prevent hydration mismatch for client-only components
 * Based on 2026 best practices for next-themes + next-intl
 *
 * Pattern: Render skeleton during SSR, swap to real component after mount
 */

export const ThemeSwitcherSkeleton = () => (
  <div
    // eslint-disable-next-line tailwindcss/no-custom-classname
    className="header-premium-icon header-premium-button flex size-11 items-center justify-center rounded-xl"
    aria-hidden="true"
    role="presentation"
  >
    <div className="size-5 animate-pulse rounded-full bg-muted" />
  </div>
);

export const LanguageSwitcherSkeleton = () => (
  <div
    // eslint-disable-next-line tailwindcss/no-custom-classname
    className="header-premium-icon header-premium-button flex size-11 items-center justify-center rounded-xl"
    aria-hidden="true"
    role="presentation"
  >
    <div className="size-5 animate-pulse rounded-full bg-muted" />
  </div>
);

export const NotificationsBellSkeleton = () => (
  <div
    // eslint-disable-next-line tailwindcss/no-custom-classname
    className="header-premium-icon header-premium-button flex size-11 items-center justify-center rounded-xl"
    aria-hidden="true"
    role="presentation"
  >
    <div className="size-5 animate-pulse rounded-full bg-muted" />
  </div>
);

export const UserDropdownSkeleton = () => (
  <div
    // eslint-disable-next-line tailwindcss/no-custom-classname
    className="header-premium-icon header-premium-button flex h-11 items-center gap-3 rounded-xl px-3"
    aria-hidden="true"
    role="presentation"
  >
    {/* Avatar skeleton */}
    <div className="size-8 animate-pulse rounded-full bg-muted" />
    {/* Name skeleton - hidden on mobile */}
    <div className="hidden sm:block">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
    {/* Chevron skeleton */}
    <div className="size-4 animate-pulse rounded bg-muted" />
  </div>
);
