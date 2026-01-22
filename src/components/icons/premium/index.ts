/*
 * PREMIUM ICONS INDEX - Tradelia Signature 2026
 *
 * Icone premium con microinterazioni avanzate:
 * - Spring physics animations
 * - Haptic feedback
 * - Stato-aware animations
 * - Performance optimized
 */

import React from 'react';

// Base system
export { PremiumIconBase, useIconState, useIconSequence, ICON_TOKENS } from '../PremiumIconBase';
export type { PremiumIconProps, IconSize, IconWeight, IconState, MotionLevel } from '../PremiumIconBase';

// Premium icons
export { BellIconPremium } from './BellIconPremium';
export type { BellIconPremiumProps } from './BellIconPremium';

export { HomeIconPremium } from './HomeIconPremium';
export type { HomeIconPremiumProps } from './HomeIconPremium';

export { MoonIconPremium } from './MoonIconPremium';
export type { MoonIconPremiumProps } from './MoonIconPremium';

export { SunIconPremium } from './SunIconPremium';
export type { SunIconPremiumProps } from './SunIconPremium';

// Icon mapping per dynamic loading
export const PREMIUM_ICON_MAP = {
  BellIconPremium,
  HomeIconPremium,
  MoonIconPremium,
  SunIconPremium,
} as const;

export type PremiumIconName = keyof typeof PREMIUM_ICON_MAP;

// Dynamic premium icon component
export type DynamicPremiumIconProps = {
  name: PremiumIconName;
} & import('../PremiumIconBase').PremiumIconProps;

export const DynamicPremiumIcon: React.FC<DynamicPremiumIconProps> = ({ name, ...props }) => {
  const IconComponent = PREMIUM_ICON_MAP[name];
  return React.createElement(IconComponent, props);
};