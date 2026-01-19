/*
 * TRADELIA ICONS INDEX - Enterprise 2026
 * 
 * Barrel export per tutte le icone custom
 * Organizzate per categoria: navigation, interface, status
 */

import React from 'react';

// Base component
export { IconBase, type IconBaseProps, type IconProps } from './IconBase';

// Navigation icons
export { HomeIcon } from './navigation/HomeIcon';
export { LearnIcon } from './navigation/LearnIcon';
export { ToolsIcon } from './navigation/ToolsIcon';
export { CommunityIcon } from './navigation/CommunityIcon';
export { ProfileIcon } from './navigation/ProfileIcon';

// Interface icons
export { ChevronDownIcon } from './interface/ChevronDownIcon';
export { LogoutIcon } from './interface/LogoutIcon';
export { SettingsIcon } from './interface/SettingsIcon';

// Status icons
export { StreakIcon } from './StreakIcon';
export { XPIcon } from './XPIcon';
export { BadgeIcon } from './BadgeIcon';
export { AchievementIcon } from './AchievementIcon';

// Import all icons for mapping
import { HomeIcon } from './navigation/HomeIcon';
import { LearnIcon } from './navigation/LearnIcon';
import { ToolsIcon } from './navigation/ToolsIcon';
import { CommunityIcon } from './navigation/CommunityIcon';
import { ProfileIcon } from './navigation/ProfileIcon';
import { ChevronDownIcon } from './interface/ChevronDownIcon';
import { LogoutIcon } from './interface/LogoutIcon';
import { SettingsIcon } from './interface/SettingsIcon';
import { type IconBaseProps } from './IconBase';

// Icon mapping per dynamic loading
export const ICON_MAP = {
  HomeIcon: HomeIcon,
  LearnIcon: LearnIcon,
  ToolsIcon: ToolsIcon,
  CommunityIcon: CommunityIcon,
  ProfileIcon: ProfileIcon,
  ChevronDownIcon: ChevronDownIcon,
  LogoutIcon: LogoutIcon,
  SettingsIcon: SettingsIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;

// Dynamic icon component
export interface DynamicIconProps extends IconBaseProps {
  name: IconName;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name];
  return <IconComponent {...props} />;
};