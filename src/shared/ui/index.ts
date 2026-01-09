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
