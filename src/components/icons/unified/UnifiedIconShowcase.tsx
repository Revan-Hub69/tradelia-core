/*
 * UNIFIED ICON SHOWCASE - Tradelia Signature 2026
 *
 * Demo interattiva del sistema unificato di icone:
 * - Test di tutte le varianti e stati
 * - Controlli per motion level e size
 * - Showcase delle microinterazioni
 * - Performance monitoring
 */

'use client';

import React, { useState } from 'react';

import { UiButton } from '@/components/ui';

import type { IconSize, IconVariant } from './UnifiedIconSystem';
import { BellIcon, HomeIcon, MoonIcon, SunIcon } from './UnifiedIconSystem';

export const UnifiedIconShowcase: React.FC = () => {
  const [size, setSize] = useState<IconSize>(24);
  const [variant, setVariant] = useState<IconVariant>('premium');
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const sizes: IconSize[] = [16, 20, 24, 28, 32];
  const variants: IconVariant[] = ['minimal', 'standard', 'premium'];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Unified Icon System</h1>
        <p className="mt-2 text-muted-foreground">
          Sistema unificato di icone premium con microinterazioni raffinate
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        {/* Size Control */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Size</div>
          <div className="flex gap-2">
            {sizes.map(s => (
              <UiButton
                key={s}
                variant={size === s ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSize(s)}
              >
                {s}
                px
              </UiButton>
            ))}
          </div>
        </div>

        {/* Variant Control */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Variant</div>
          <div className="flex gap-2">
            {variants.map(v => (
              <UiButton
                key={v}
                variant={variant === v ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setVariant(v)}
                className="capitalize"
              >
                {v}
              </UiButton>
            ))}
          </div>
        </div>

        {/* Notification Control */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Notifications</div>
          <div className="flex gap-2">
            <UiButton
              variant={hasNotifications ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setHasNotifications(!hasNotifications)}
            >
              {hasNotifications ? 'On' : 'Off'}
            </UiButton>
            <UiButton
              variant="secondary"
              size="sm"
              onClick={() => setNotificationCount(prev => (prev + 1) % 100)}
              disabled={!hasNotifications}
            >
              Count:
              {' '}
              {notificationCount}
            </UiButton>
          </div>
        </div>

        {/* Theme Control */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Theme</div>
          <UiButton
            variant={isDarkTheme ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
          >
            {isDarkTheme ? 'Dark' : 'Light'}
          </UiButton>
        </div>
      </div>

      {/* Icon Showcase */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {/* Home Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Home Icon</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg border p-4">
              <HomeIcon
                size={size}
                variant={variant}
                isActive={false}
              />
            </div>
            <div className="rounded-lg border bg-primary/5 p-4">
              <HomeIcon
                size={size}
                variant={variant}
                isActive
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Default / Active
            </div>
          </div>
        </div>

        {/* Bell Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Bell Icon</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg border p-4">
              <BellIcon
                size={size}
                variant={variant}
                hasNotifications={false}
              />
            </div>
            <div className="rounded-lg border bg-primary/5 p-4">
              <BellIcon
                size={size}
                variant={variant}
                hasNotifications
                notificationCount={notificationCount}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              No Notifications / With Badge
            </div>
          </div>
        </div>

        {/* Sun Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Sun Icon</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg border p-4">
              <SunIcon
                size={size}
                variant={variant}
                isActive={false}
              />
            </div>
            <div className="rounded-lg border bg-primary/5 p-4">
              <SunIcon
                size={size}
                variant={variant}
                isActive
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Default / Active
            </div>
          </div>
        </div>

        {/* Moon Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Moon Icon</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg border p-4">
              <MoonIcon
                size={size}
                variant={variant}
                isActive={false}
                phase="crescent"
              />
            </div>
            <div className="rounded-lg border bg-primary/5 p-4">
              <MoonIcon
                size={size}
                variant={variant}
                isActive
                phase="crescent"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Default / Active
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4 rounded-lg border p-6">
        <h3 className="text-center font-semibold">Interactive Demo</h3>
        <div className="flex justify-center gap-8">
          <div className="space-y-2 text-center">
            <div className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <HomeIcon size={32} variant="premium" isActive />
            </div>
            <div className="text-sm text-muted-foreground">Hover me</div>
          </div>

          <div className="space-y-2 text-center">
            <div className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <BellIcon
                size={32}
                variant="premium"
                hasNotifications
                notificationCount={5}
              />
            </div>
            <div className="text-sm text-muted-foreground">Ring animation</div>
          </div>

          <div className="space-y-2 text-center">
            <div className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <SunIcon size={32} variant="premium" isActive />
            </div>
            <div className="text-sm text-muted-foreground">Glow effect</div>
          </div>

          <div className="space-y-2 text-center">
            <div className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <MoonIcon size={32} variant="premium" isActive phase="crescent" />
            </div>
            <div className="text-sm text-muted-foreground">Stars sparkle</div>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <div className="space-y-4 rounded-lg border bg-muted/20 p-6">
        <h3 className="font-semibold">Technical Information</h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <strong>Current Settings:</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>
                Size:
                {' '}
                {size}
                px
              </li>
              <li>
                Variant:
                {' '}
                {variant}
              </li>
              <li>
                Notifications:
                {' '}
                {hasNotifications ? 'Enabled' : 'Disabled'}
              </li>
              <li>
                Count:
                {' '}
                {notificationCount}
              </li>
            </ul>
          </div>
          <div>
            <strong>Features:</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>✅ Hardware acceleration</li>
              <li>✅ Motion preferences compliance</li>
              <li>✅ Accessibility support</li>
              <li>✅ Premium microinteractions</li>
              <li>✅ Performance optimized</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
