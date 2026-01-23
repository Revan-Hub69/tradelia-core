/*
 * TRADELIA SIGNATURE ICONS INDEX 2026
 *
 * Sistema signature unificato - eliminati tutti i duplicati
 * Basato su ricerche approfondite Apple iOS 26 + Linear + Best Practices 2026
 * Memorabile, Professionale, Innovativo
 */

import React from 'react';

import type {
  IconSize,
  IconState,
  IconVariant,
  SignatureIconProps,
} from './unified';
// Import signature icons first
import {
  BellIcon,
  CalculatorIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  CommunityIcon,
  DarkIcon,
  ExitIcon,
  ForumIcon,
  GlobeIcon,
  HomeIcon,
  // Educational icons
  LearnIcon,
  // Theme icons (new clean versions)
  LightIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  MoreVerticalIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  SidebarToggleIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  StarIcon,
  // Legacy aliases (for compatibility)
  SunIcon,
  ToolsIcon,
  // New Phase 3A icons
  TrendingUpIcon,
  UserIcon,
} from './unified';

// Re-export signature icons
export {
  BellIcon,
  CalculatorIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  CommunityIcon,
  DarkIcon,
  ExitIcon,
  ForumIcon,
  GlobeIcon,
  HomeIcon,
  // Educational icons
  LearnIcon,
  // Theme icons (new clean versions)
  LightIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  MoreVerticalIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  SidebarToggleIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  StarIcon,
  // Legacy aliases (for compatibility)
  SunIcon,
  ToolsIcon,
  // New Phase 3A icons
  TrendingUpIcon,
  UserIcon,
};

export type {
  IconSize,
  IconState,
  IconVariant,
  SignatureIconProps,
};

// Icon mapping for dynamic loading (signature system)
export const ICON_MAP = {
  HomeIcon,
  BellIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  SettingsIcon,

  // Theme icons
  LightIcon,
  DarkIcon,

  // Educational icons
  LearnIcon,
  CalculatorIcon,
  ForumIcon,
  ProfileIcon,
  GlobeIcon,
  LockIcon,
  ExitIcon,
  MoreVerticalIcon,

  // New Phase 3A icons
  TrendingUpIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  SearchIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,

  // Legacy aliases
  SunIcon,
  MoonIcon,
  ToolsIcon,
  CommunityIcon,
  LogoutIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;

// Dynamic icon component
export type DynamicIconProps = {
  'name': IconName;
  'size'?: IconSize;
  'variant'?: IconVariant;
  'className'?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  'isActive'?: boolean;
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name];
  return <IconComponent {...props} />;
};
