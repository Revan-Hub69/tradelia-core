'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'ghost';
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
  glow?: boolean;
  pulse?: boolean;
};

const variants = {
  primary: {
    bg: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    text: 'text-white',
    border: 'border-transparent',
    shadow: 'shadow-lg hover:shadow-xl',
    glow: '#3B82F6',
  },
  secondary: {
    bg: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600',
    text: 'text-gray-900 dark:text-white',
    border: 'border-gray-300 dark:border-gray-600',
    shadow: 'shadow-md hover:shadow-lg',
    glow: '#6B7280',
  },
  success: {
    bg: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    text: 'text-white',
    border: 'border-transparent',
    shadow: 'shadow-lg hover:shadow-xl',
    glow: '#10B981',
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    text: 'text-white',
    border: 'border-transparent',
    shadow: 'shadow-lg hover:shadow-xl',
    glow: '#F59E0B',
  },
  ghost: {
    bg: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
    border: 'border-transparent',
    shadow: 'shadow-none hover:shadow-md',
    glow: '#6B7280',
  },
};

const sizes = {
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    height: 'h-8',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    height: 'h-10',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-base',
    height: 'h-12',
  },
  xl: {
    padding: 'px-8 py-4',
    text: 'text-lg',
    height: 'h-14',
  },
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
  glow = false,
  pulse = false,
}: PremiumButtonProps) => {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: disabled ? 1 : 1.02,
      transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    },
    tap: {
      scale: disabled ? 1 : 0.98,
      transition: { duration: 0.1 },
    },
  };

  const glowVariants = {
    animate: glow
      ? {
          boxShadow: [
            `0 0 0 0 ${variantStyles.glow}00`,
            `0 0 0 8px ${variantStyles.glow}20`,
            `0 0 0 0 ${variantStyles.glow}00`,
          ],
        }
      : {},
  };

  const pulseVariants = {
    animate: pulse
      ? {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        }
      : {},
  };

  return (
    <div className="relative inline-block">
      {/* Glow Effect */}
      {glow && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-30 blur-lg"
          style={{ backgroundColor: variantStyles.glow }}
          variants={glowVariants}
          animate="animate"
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Main Button */}
      <motion.button
        className={`
          relative inline-flex items-center justify-center
          ${sizeStyles.padding} ${sizeStyles.text} ${sizeStyles.height}
          ${variantStyles.bg} ${variantStyles.text} ${variantStyles.shadow}
          border ${variantStyles.border}
          overflow-hidden rounded-xl
          font-semibold transition-all
          duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
          focus:ring-offset-2 disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {/* Loading Spinner */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="size-5 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}
          transition={{ duration: 0.2 }}
        >
          {icon && iconPosition === 'left' && (
            <motion.span
              className="shrink-0"
              animate={{ rotate: disabled ? 0 : [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {icon}
            </motion.span>
          )}

          <span className="font-semibold">{children}</span>

          {icon && iconPosition === 'right' && (
            <motion.span
              className="shrink-0"
              animate={{ rotate: disabled ? 0 : [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {icon}
            </motion.span>
          )}
        </motion.div>

        {/* Shine Effect */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'linear',
            }}
          />
        )}

        {/* Pulse Animation */}
        {pulse && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ backgroundColor: variantStyles.glow }}
            variants={pulseVariants}
            animate="animate"
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
};
