/*
 * TRADELIA ICONS INDEX - Enterprise 2026
 *
 * Barrel export per tutte le icone custom
 * Organizzate per categoria: navigation, interface, status
 */

import React from 'react';

import type { IconBaseProps } from './IconBase';
import { ChevronDownIcon } from './interface/ChevronDownIcon';
import { LogoutIcon } from './interface/LogoutIcon';
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
export { ChevronDownIcon } from './interface/ChevronDownIcon';
export { LogoutIcon } from './interface/LogoutIcon';
export { SettingsIcon } from './interface/SettingsIcon';

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
  ChevronDownIcon,
  LogoutIcon,
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
