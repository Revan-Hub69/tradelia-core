/*
 * REFINED ICONS INDEX - Tradelia Signature 2026
 *
 * Icone raffinate e leggiadre:
 * - Design minimalista ed elegante
 * - Animazioni discrete solo su interazione
 * - SVG ottimizzati e puliti
 * - Performance eccellenti
 */

import React from 'react';

import { BellIconRefined } from './BellIconRefined';
import { HomeIconRefined } from './HomeIconRefined';
import { MoonIconRefined } from './MoonIconRefined';
import { SunIconRefined } from './SunIconRefined';

// Base system
export { RefinedIconBase, useRefinedIconState, REFINED_TOKENS } from './RefinedIconBase';
export type { RefinedIconProps, RefinedIconSize, RefinedIconWeight, RefinedIconState } from './RefinedIconBase';

// Refined icons
export { BellIconRefined } from './BellIconRefined';
export type { BellIconRefinedProps } from './BellIconRefined';

export { HomeIconRefined } from './HomeIconRefined';
export type { HomeIconRefinedProps } from './HomeIconRefined';

export { MoonIconRefined } from './MoonIconRefined';
export type { MoonIconRefinedProps } from './MoonIconRefined';

export { SunIconRefined } from './SunIconRefined';
export type { SunIconRefinedProps } from './SunIconRefined';

// Icon mapping per dynamic loading
export const REFINED_ICON_MAP = {
  BellIconRefined,
  HomeIconRefined,
  MoonIconRefined,
  SunIconRefined,
} as const;

export type RefinedIconName = keyof typeof REFINED_ICON_MAP;

// Dynamic refined icon component
export type DynamicRefinedIconProps = {
  name: RefinedIconName;
} & import('./RefinedIconBase').RefinedIconProps;

export const DynamicRefinedIcon: React.FC<DynamicRefinedIconProps> = ({ name, ...props }) => {
  const IconComponent = REFINED_ICON_MAP[name];
  return React.createElement(IconComponent, props);
};