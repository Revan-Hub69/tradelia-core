'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'warning' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

type PremiumButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
};

/**
 * PremiumButton — Tradelia Design System 2026
 *
 * Regole:
 * - Niente gradienti su pulsanti: colori solidi su token CSS
 * - Niente shine sweep, niente icon wobble, niente glow pulsante
 * - Unica animazione: scale(0.98) on tap per feedback tattile
 * - Hover: leggero scuro del bg (opacity 90%), shadow-md
 * - Loading: spinner centrato, content nascosto
 */

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md focus-visible:ring-primary/50',
  secondary:
    'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 hover:shadow-sm focus-visible:ring-primary/30',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/50',
  warning:
    'bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-md focus-visible:ring-warning/50',
  ghost:
    'bg-transparent text-foreground hover:bg-foreground/8 focus-visible:ring-primary/30',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm:  'h-8  px-3 py-1.5 text-sm  gap-1.5',
  md:  'h-10 px-4 py-2   text-sm  gap-2',
  lg:  'h-11 px-6 py-2.5 text-base gap-2',
  xl:  'h-14 px-8 py-4   text-base gap-2.5',
};

export const PremiumButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
}: PremiumButtonProps) => {
  return (
    <motion.button
      className={[
        'relative inline-flex items-center justify-center whitespace-nowrap',
        'rounded-lg font-medium',
        'ring-offset-background transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="size-4 rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
        </span>
      )}

      {/* Content */}
      <span
        className={[
          'inline-flex items-center',
          sizeClasses[size].includes('gap') ? '' : 'gap-2',
          loading ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        style={{ gap: 'inherit' }}
      >
        {icon && iconPosition === 'left' && (
          <span className="shrink-0 size-4 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="shrink-0 size-4 flex items-center justify-center">
            {icon}
          </span>
        )}
      </span>
    </motion.button>
  );
};
