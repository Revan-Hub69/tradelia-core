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
  CommunityIcon,
  GlobeIcon,
  HomeIcon,
  LearnIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  MoreVerticalIcon,
  MoonIcon,
  ProfileIcon,
  SettingsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  SunIcon,
  ToolsIcon,
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
  CommunityIcon,
  GlobeIcon,
  HomeIcon,
  LearnIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  MoreVerticalIcon,
  MoonIcon,
  ProfileIcon,
  SettingsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  SunIcon,
  ToolsIcon,
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
