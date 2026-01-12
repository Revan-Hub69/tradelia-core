/**
 * Shared UI Components - Tradelia 2026
 * 
 * Componenti UI riutilizzabili che seguono i principi Tradelia 2026:
 * - Chiarezza > Persuasione
 * - Neutralità > Bias
 * - Accessibilità WCAG AAA+
 */

// Core components
export { Button } from './Button';
export { Input } from './Input';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export { Badge } from './Badge';
export { ThemeToggle } from './ThemeToggle';
export { DataFreshnessIndicator } from './DataFreshnessIndicator';

// State components (ux-contract compliant)
export { EmptyState } from './EmptyState';
export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonKPIGrid, 
  SkeletonTable, 
  SkeletonTableRow,
  SkeletonChart,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonDashboard 
} from './Skeleton';
export { 
  ErrorState, 
  ErrorCard, 
  InlineError, 
  NetworkError, 
  FullPageError 
} from './ErrorState';
export { 
  ToastProvider, 
  useToast 
} from './Toast';
export type { Toast, ToastVariant, ToastContextType } from './Toast';

// Form components
export { PasswordStrength, usePasswordStrength } from './PasswordStrength';

// Premium components
export { 
  PremiumDrawer, 
  InfoDrawer, 
  SuccessDrawer, 
  WarningDrawer, 
  ErrorDrawer 
} from './PremiumDrawer';
export { JourneyCard } from './JourneyCard';
export { GuestModeAlert } from './GuestModeAlert';

// Command Palette components (REQ 16)
export { CommandProvider, useCommandPalette, useRegisterCommand } from './CommandProvider';
export type { Command } from './CommandProvider';
export { CommandPalette } from './CommandPalette';
export { CommandPaletteWrapper } from './CommandPaletteWrapper';
export { KeyboardHelpModal } from './KeyboardHelpModal';

// Status Center components (REQ 19)
export { StatusCenter } from './StatusCenter';
export { SafeModeBanner } from './SafeModeBanner';
export { NetworkStatusIndicator, useNetworkStatus, NetworkStatus, NetworkStatusProvider } from './NetworkStatus';

// Utility functions
export { cn, focusRing, transitionSubtle, cardInteractive, supportsHover, prefersReducedMotion } from './utils';

// Types
export type { 
  ButtonProps, 
  InputProps, 
  CardProps, 
  BadgeProps, 
  Theme, 
  ThemeContextType, 
  Density,
  DensityContextType,
  A11yProps 
} from './types';
