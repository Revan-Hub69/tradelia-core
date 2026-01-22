/*
 * TRADELIA SIGNATURE ICONS INDEX 2026
 *
 * Sistema signature unificato - eliminati tutti i duplicati
 * Basato su ricerche approfondite Apple iOS 26 + Linear + Best Practices 2026
 * Memorabile, Professionale, Innovativo
 */

import React from 'react';

// Import signature icons first
import {
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  HomeIcon,
  MenuIcon,
  MoonIcon,
  SettingsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  SunIcon,
} from './unified';

import type {
  IconSize,
  IconState,
  IconVariant,
  SignatureIconProps,
} from './unified';

// Re-export signature icons
export {
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  HomeIcon,
  MenuIcon,
  MoonIcon,
  SettingsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  SunIcon,
};

export type {
  IconSize,
  IconState,
  IconVariant,
  SignatureIconProps,
};

// Legacy icons (keeping for compatibility)
export { IconBase, type IconBaseProps, type IconProps } from './IconBase';
export { AchievementIcon } from './AchievementIcon';
export { BadgeIcon } from './BadgeIcon';
export { StreakIcon } from './StreakIcon';
export { XPIcon } from './XPIcon';

// Temporary compatibility aliases (will be removed)
export const GlobeIcon = SettingsIcon; // Placeholder
export const LockIcon = SettingsIcon; // Placeholder
export const LogoutIcon = SettingsIcon; // Placeholder
export const MoreVerticalIcon = MenuIcon; // Placeholder

// Navigation icons (placeholders - to be created if needed)
export const CommunityIcon = HomeIcon; // Placeholder
export const LearnIcon = HomeIcon; // Placeholder
export const ProfileIcon = HomeIcon; // Placeholder
export const ToolsIcon = SettingsIcon; // Placeholder

// Icon mapping for dynamic loading (signature system)
export const ICON_MAP = {
  HomeIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  SettingsIcon,
  // Compatibility aliases
  GlobeIcon,
  LockIcon,
  LogoutIcon,
  MoreVerticalIcon,
  CommunityIcon,
  LearnIcon,
  ProfileIcon,
  ToolsIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;

// Dynamic icon component
export type DynamicIconProps = {
  name: IconName;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name];
  return <IconComponent {...props} />;
};