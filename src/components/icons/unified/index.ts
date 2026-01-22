/*
 * TRADELIA SIGNATURE ICON SYSTEM 2026 - Exports
 *
 * Sistema signature di icone educative per piattaforma crypto
 * Basato su ricerche tier 1: Apple, Linear, IBM Design
 * 
 * CARATTERISTICHE:
 * - Grid 24x24px con stroke 2px uniforme
 * - Coordinate snap alla griglia 0.5px
 * - Oggetti appropriati per educazione crypto
 * - Zero Framer Motion, solo CSS transitions
 * - Colori design system (currentColor)
 */

export type {
  IconSize,
  IconState,
  IconVariant,
  SignatureIconProps,
} from './UnifiedIconSystem';
export {
  // Core icons
  BellIcon,
  ChevronDownIcon,
  CloseIcon,
  HomeIcon,
  MenuIcon,
  SettingsIcon,
  SIGNATURE_TOKENS,
  SignatureIconBase,
  
  // Theme icons (new clean versions)
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
  
  // Legacy aliases (for compatibility)
  SunIcon,
  MoonIcon,
  ToolsIcon,
  CommunityIcon,
  LogoutIcon,
} from './UnifiedIconSystem';
