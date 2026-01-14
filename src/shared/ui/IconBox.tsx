/**
 * IconBox Component - Tradelia 2026
 * 
 * Container premium per icone con gradient background e glow effect.
 * Supporta animazione scale on parent hover per interattività.
 * 
 * @requirements 2.2, 3.3, 4.2, 6.2 - Icon con gradient background e glow
 */

import { type ReactNode } from 'react';
import { cn } from './utils';

export type IconBoxColor = 'primary' | 'success' | 'warning' | 'error';
export type IconBoxSize = 'sm' | 'md' | 'lg';

export interface IconBoxProps {
  /** Icona da renderizzare */
  icon: ReactNode;
  /** Colore del gradient e glow */
  color: IconBoxColor;
  /** Dimensione del box: sm (40px), md (44px), lg (48px) */
  size?: IconBoxSize;
  /** Abilita animazione scale on parent hover */
  animated?: boolean;
  /** Classi CSS aggiuntive */
  className?: string;
}

const COLOR_STYLES: Record<IconBoxColor, { bg: string; glow: string }> = {
  primary: {
    bg: 'from-primary-500 to-primary-600',
    glow: 'shadow-lg shadow-primary-500/25',
  },
  success: {
    bg: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-lg shadow-emerald-500/25',
  },
  warning: {
    bg: 'from-amber-500 to-amber-600',
    glow: 'shadow-lg shadow-amber-500/25',
  },
  error: {
    bg: 'from-red-500 to-red-600',
    glow: 'shadow-lg shadow-red-500/25',
  },
};

const SIZE_CLASSES: Record<IconBoxSize, string> = {
  sm: 'w-10 h-10', // 40px
  md: 'w-11 h-11', // 44px
  lg: 'w-12 h-12', // 48px
};

/**
 * IconBox - Container premium per icone
 * 
 * Usato per icone in card, header e navigation con stile coerente.
 * Il parent deve avere classe 'group' per abilitare hover animation.
 */
export function IconBox({
  icon,
  color,
  size = 'md',
  animated = true,
  className = '',
}: IconBoxProps) {
  const colorStyle = COLOR_STYLES[color];

  return (
    <div
      className={cn(
        // Base styles
        SIZE_CLASSES[size],
        'rounded-xl flex items-center justify-center flex-shrink-0',
        // Gradient background
        'bg-gradient-to-br',
        colorStyle.bg,
        // Glow effect
        colorStyle.glow,
        // Animation on parent hover
        animated && 'transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl',
        className
      )}
    >
      <div className="text-white [&>svg]:w-6 [&>svg]:h-6">
        {icon}
      </div>
    </div>
  );
}

IconBox.displayName = 'IconBox';
