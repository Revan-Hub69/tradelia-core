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
// Import all signature icons
import {
  BellIcon,
  CalculatorIcon,
  ChallengesIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  CommunityIcon,
  DarkIcon,
  ExitIcon,
  ForumIcon,
  GlobeIcon,
  HelpIcon,
  HomeIcon,
  LearnIcon,
  LightIcon,
  LockIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  MoreVerticalIcon,
  MyChartsIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  SidebarToggleIcon,
  SignalsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  StarIcon,
  SunIcon,
  ToolsIcon,
  TrendingUpIcon,
  UserIcon,
  WarningIcon,
} from './unified';

// Re-export all icons
export {
  BellIcon,
  CalculatorIcon,
  ChallengesIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  CommunityIcon,
  DarkIcon,
  ExitIcon,
  ForumIcon,
  GlobeIcon,
  HelpIcon,
  HomeIcon,
  LearnIcon,
  LightIcon,
  LockIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  MoreVerticalIcon,
  MyChartsIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  SidebarToggleIcon,
  SignalsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  StarIcon,
  SunIcon,
  ToolsIcon,
  TrendingUpIcon,
  UserIcon,
  WarningIcon,
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

  // Challenge Dashboard icons
  ChallengesIcon,
  MyChartsIcon,
  SignalsIcon,

  // Utility icons
  LearnIcon,
  CalculatorIcon,
  ForumIcon,
  ProfileIcon,
  GlobeIcon,
  LockIcon,
  ExitIcon,
  MoreVerticalIcon,
  HelpIcon,
  MailIcon,

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
  // Risk & Alert icons
  WarningIcon,
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

// Dynamic icon component - Performance P1: Memoized
export const DynamicIcon = React.memo<DynamicIconProps>(
  ({ name, ...props }) => {
    const IconComponent = ICON_MAP[name];
    return <IconComponent {...props} />;
  },
  // Custom comparison: only re-render if name, size, variant, or isActive changes
  (prevProps, nextProps) => {
    return (
      prevProps.name === nextProps.name &&
      prevProps.size === nextProps.size &&
      prevProps.variant === nextProps.variant &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.className === nextProps.className
    );
  },
);
