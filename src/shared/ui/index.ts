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

// Utility functions
export { cn, focusRing, transitionSubtle, cardInteractive, supportsHover, prefersReducedMotion } from './utils';

// Types
export type { ButtonProps, InputProps, CardProps, BadgeProps, Theme, ThemeContextType, A11yProps } from './types';
