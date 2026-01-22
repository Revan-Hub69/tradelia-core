/*
 * PREMIUM ICON SHOWCASE - Tradelia Signature 2026
 *
 * Showcase delle icone premium con tutte le microinterazioni:
 * - Dimostra spring physics
 * - Stati interattivi
 * - Haptic feedback
 * - Motion preferences
 */

'use client';

import React, { useState } from 'react';

import type { IconSize, IconState, MotionLevel } from '../PremiumIconBase';
import { BellIconPremium, HomeIconPremium, MoonIconPremium, SunIconPremium } from './index';

export const PremiumIconShowcase: React.FC = () => {
  const [motionLevel, setMotionLevel] = useState<MotionLevel>('full');
  const [iconSize, setIconSize] = useState<IconSize>(24);
  const [bellNotifications, setBellNotifications] = useState(3);
  const [isThemeDark, setIsThemeDark] = useState(false);

  const iconStates: IconState[] = ['default', 'hover', 'active', 'pressed', 'disabled'];

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">Premium Icons Showcase</h2>
        <p className="text-muted-foreground">
          Icone premium con microinterazioni avanzate e spring physics
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="motion-select" className="text-sm font-medium">Motion:</label>
          <select
            id="motion-select"
            value={motionLevel}
            onChange={e => setMotionLevel(e.target.value as MotionLevel)}
            className="rounded border px-2 py-1"
          >
            <option value="none">None</option>
            <option value="reduced">Reduced</option>
            <option value="full">Full</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="size-select" className="text-sm font-medium">Size:</label>
          <select
            id="size-select"
            value={iconSize}
            onChange={e => setIconSize(Number(e.target.value) as IconSize)}
            className="rounded border px-2 py-1"
          >
            <option value={16}>16px</option>
            <option value={20}>20px</option>
            <option value={24}>24px</option>
            <option value={28}>28px</option>
            <option value={32}>32px</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="notifications-input" className="text-sm font-medium">Bell Notifications:</label>
          <input
            id="notifications-input"
            type="number"
            min="0"
            max="99"
            value={bellNotifications}
            onChange={e => setBellNotifications(Number(e.target.value))}
            className="w-16 rounded border px-2 py-1"
          />
        </div>
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

        {/* Home Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Home Icon</h3>
          <div className="flex justify-center">
            <HomeIconPremium
              size={iconSize}
              motionLevel={motionLevel}
              isActive
              showDetails
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Door opening animation, architectural details, smoke effect
          </p>
        </div>

        {/* Bell Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Bell Icon</h3>
          <div className="flex justify-center">
            <BellIconPremium
              size={iconSize}
              motionLevel={motionLevel}
              hasNotifications={bellNotifications > 0}
              notificationCount={bellNotifications}
              isRinging={bellNotifications > 0}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Ring animation, notification badge, sound waves
          </p>
        </div>

        {/* Sun Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Sun Icon</h3>
          <div className="flex justify-center">
            <SunIconPremium
              size={iconSize}
              motionLevel={motionLevel}
              isActive={!isThemeDark}
              intensity="high"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Rotating rays, pulsing core, heat waves
          </p>
        </div>

        {/* Moon Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Moon Icon</h3>
          <div className="flex justify-center">
            <MoonIconPremium
              size={iconSize}
              motionLevel={motionLevel}
              isActive={isThemeDark}
              phase="crescent"
              showStars
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Lunar phases, twinkling stars, atmospheric glow
          </p>
        </div>
      </div>

      {/* State Demonstration */}
      <div className="space-y-4">
        <h3 className="text-center text-lg font-semibold">Icon States</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {iconStates.map(state => (
            <div key={state} className="space-y-2 text-center">
              <div className="flex justify-center">
                <HomeIconPremium
                  size={24}
                  motionLevel={motionLevel}
                  state={state}
                />
              </div>
              <p className="text-xs capitalize">{state}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">Interactive Demo</h3>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsThemeDark(!isThemeDark)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isThemeDark
              ? <SunIconPremium size={20} motionLevel={motionLevel} />
              : <MoonIconPremium size={20} motionLevel={motionLevel} />}
            Toggle Theme
          </button>

          <button
            type="button"
            onClick={() => setBellNotifications(prev => prev > 0 ? 0 : 5)}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/90"
          >
            <BellIconPremium
              size={20}
              motionLevel={motionLevel}
              hasNotifications={bellNotifications > 0}
              notificationCount={bellNotifications}
            />
            Toggle Notifications
          </button>
        </div>
      </div>

      {/* Technical Info */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        <h4 className="mb-2 font-semibold">Technical Features:</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Spring physics animations con Framer Motion</li>
          <li>• Hardware acceleration (transform-gpu, will-change)</li>
          <li>• Haptic feedback integration</li>
          <li>• Motion preferences compliance</li>
          <li>• Accessibility compliant (ARIA, focus states)</li>
          <li>• Performance optimized (60fps animations)</li>
          <li>• Design tokens per consistenza</li>
          <li>• State-aware microinterazioni</li>
        </ul>
      </div>
    </div>
  );
};