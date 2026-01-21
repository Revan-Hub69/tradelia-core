/*
 * TRADELIA ICONS INDEX - Enterprise 2026
 *
 * Barrel export per tutte le icone custom
 * Organizzate per categoria: navigation, interface, status
 */

import React from 'react';

import type { IconBaseProps } from './IconBase';
import { BellIcon } from './interface/BellIcon';
import { ChevronDownIcon } from './interface/ChevronDownIcon';
import { LockIcon } from './interface/LockIcon';
import { LogoutIcon } from './interface/LogoutIcon';
import { MoreVerticalIcon } from './interface/MoreVerticalIcon';
import { SettingsIcon } from './interface/SettingsIcon';
import { CommunityIcon } from './navigation/CommunityIcon';
// Import all icons for mapping
import { HomeIcon } from './navigation/HomeIcon';
import { LearnIcon } from './navigation/LearnIcon';
import { ProfileIcon } from './navigation/ProfileIcon';
import { ToolsIcon } from './navigation/ToolsIcon';

// Base component
export { IconBase, type IconBaseProps, type IconProps } from './IconBase';

// Navigation icons
export { CommunityIcon } from './navigation/CommunityIcon';
export { HomeIcon } from './navigation/HomeIcon';
export { LearnIcon } from './navigation/LearnIcon';
export { ProfileIcon } from './navigation/ProfileIcon';
export { ToolsIcon } from './navigation/ToolsIcon';

// Interface icons
export { BellIcon } from './interface/BellIcon';
export { ChevronDownIcon } from './interface/ChevronDownIcon';
export { GlobeIcon } from './interface/GlobeIcon';
export { LockIcon } from './interface/LockIcon';
export { LogoutIcon } from './interface/LogoutIcon';
export { MoonIcon } from './interface/MoonIcon';
export { MoreVerticalIcon } from './interface/MoreVerticalIcon';
export { SettingsIcon } from './interface/SettingsIcon';
export { SunIcon } from './interface/SunIcon';

// Status icons
export { AchievementIcon } from './AchievementIcon';
export { BadgeIcon } from './BadgeIcon';
export { StreakIcon } from './StreakIcon';
export { XPIcon } from './XPIcon';

// Icon mapping per dynamic loading
export const ICON_MAP = {
  HomeIcon,
  LearnIcon,
  ToolsIcon,
  CommunityIcon,
  ProfileIcon,
  BellIcon,
  ChevronDownIcon,
  LockIcon,
  LogoutIcon,
  MoreVerticalIcon,
  SettingsIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;

// Dynamic icon component
export type DynamicIconProps = {
  name: IconName;
} & IconBaseProps;

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name];
  return <IconComponent {...props} />;
};
