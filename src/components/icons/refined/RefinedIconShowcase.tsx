/*
 * REFINED ICON SHOWCASE - Tradelia Signature 2026
 *
 * Showcase delle icone raffinate e leggiadre:
 * - Design minimalista ed elegante
 * - Animazioni discrete solo su interazione
 * - Varianti minimal e elegant
 * - Performance ottimizzate
 */

'use client';

import React, { useState } from 'react';

import type { RefinedIconSize, RefinedIconState } from './RefinedIconBase';
import { BellIconRefined, HomeIconRefined, MoonIconRefined, SunIconRefined } from './index';

export const RefinedIconShowcase: React.FC = () => {
  const [iconSize, setIconSize] = useState<RefinedIconSize>(24);
  const [bellNotifications, setBellNotifications] = useState(3);
  const [isThemeDark, setIsThemeDark] = useState(false);
  const [variant, setVariant] = useState<'minimal' | 'elegant'>('elegant');

  const iconStates: RefinedIconState[] = ['default', 'hover', 'active', 'disabled'];

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">Refined Icons Showcase</h2>
        <p className="text-muted-foreground">
          Icone raffinate e leggiadre con design minimalista ed elegante
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="size-select" className="text-sm font-medium">Size:</label>
          <select
            id="size-select"
            value={iconSize}
            onChange={e => setIconSize(Number(e.target.value) as RefinedIconSize)}
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
          <label htmlFor="variant-select" className="text-sm font-medium">Variant:</label>
          <select
            id="variant-select"
            value={variant}
            onChange={e => setVariant(e.target.value as 'minimal' | 'elegant')}
            className="rounded border px-2 py-1"
          >
            <option value="minimal">Minimal</option>
            <option value="elegant">Elegant</option>
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
            <HomeIconRefined
              size={iconSize}
              isActive
              variant={variant}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Casa elegante con dettagli architettonici raffinati
          </p>
        </div>

        {/* Bell Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Bell Icon</h3>
          <div className="flex justify-center">
            <BellIconRefined
              size={iconSize}
              hasNotifications={bellNotifications > 0}
              notificationCount={bellNotifications}
              variant={variant}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Campana discreta con badge elegante
          </p>
        </div>

        {/* Sun Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Sun Icon</h3>
          <div className="flex justify-center">
            <SunIconRefined
              size={iconSize}
              isActive={!isThemeDark}
              variant={variant}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sole geometrico con raggi simmetrici
          </p>
        </div>

        {/* Moon Icon */}
        <div className="space-y-4 text-center">
          <h3 className="font-semibold">Moon Icon</h3>
          <div className="flex justify-center">
            <MoonIconRefined
              size={iconSize}
              isActive={isThemeDark}
              phase="crescent"
              variant={variant}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Luna poetica con stelle discrete
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
                <HomeIconRefined
                  size={24}
                  state={state}
                  variant={variant}
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
              ? <SunIconRefined size={20} variant={variant} />
              : <MoonIconRefined size={20} variant={variant} />}
            Toggle Theme
          </button>

          <button
            type="button"
            onClick={() => setBellNotifications(prev => prev > 0 ? 0 : 5)}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/90"
          >
            <BellIconRefined
              size={20}
              hasNotifications={bellNotifications > 0}
              notificationCount={bellNotifications}
              variant={variant}
            />
            Toggle Notifications
          </button>
        </div>
      </div>

      {/* Long Press Instructions */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950/20">
        <h4 className="mb-2 font-semibold">Long Press Instructions:</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            • <strong>Mobile/Touch:</strong> Long press works normally ✅
          </li>
          <li>
            • <strong>Desktop:</strong> Long press disabled to prevent accidents
          </li>
          <li>
            • <strong>Desktop testing:</strong> Hold Ctrl/Alt/Shift + click for long press
          </li>
          <li>
            • <strong>Icons:</strong> Discrete animations only on interaction
          </li>
          <li>
            • <strong>Design:</strong> Refined, elegant, minimal aesthetic
          </li>
        </ul>
      </div>

      {/* Technical Info */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        <h4 className="mb-2 font-semibold">Refined Features:</h4>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Design minimalista ed elegante</li>
          <li>• Animazioni discrete solo su interazione</li>
          <li>• SVG ottimizzati per performance</li>
          <li>• Varianti minimal e elegant</li>
          <li>• Accessibility compliant</li>
          <li>• Motion preferences rispettate</li>
          <li>• Geometrie perfette e proporzionate</li>
          <li>• Palette colori armoniosa</li>
        </ul>
      </div>
    </div>
  );
};