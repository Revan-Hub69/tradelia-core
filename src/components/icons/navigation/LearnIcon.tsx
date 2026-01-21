/*
 * LEARN ICON - Tradelia Signature Premium SVG
 *
 * Design: Libro aperto elegante + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Page flip effect on hover, bookmark glow on active
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type LearnIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const LearnIcon: React.FC<LearnIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Determine motion level
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Animation variants based on motion preference
  const getAnimationVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        initial: { scale: 1, rotateY: 0 },
        active: { scale: 1, rotateY: 0 },
        hover: { scale: 1, rotateY: 0 },
      };
    }

    if (effectiveMotion === 'reduced') {
      return {
        initial: { scale: 1, rotateY: 0 },
        active: { scale: 1.05, rotateY: 0 },
        hover: { scale: 1.05, rotateY: 0 },
      };
    }

    // Full motion - book opening effect
    return {
      initial: { scale: 1, rotateY: 0 },
      active: {
        scale: 1.05,
        rotateY: 5,
      },
      hover: {
        scale: 1.1,
        rotateY: 10,
      },
    };
  };

  const variants = getAnimationVariants();

  // Transition timing - simplified for TypeScript compatibility
  const transition
    = effectiveMotion === 'none'
      ? { duration: 0 }
      : effectiveMotion === 'reduced'
        ? { duration: 0.15 }
        : { duration: 0.3 };

  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate={isActive ? 'active' : 'initial'}
        whileHover="hover"
        transition={transition}
        style={{
          transformOrigin: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Pagina sinistra con page flip effect */}
        <motion.path
          d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
          animate={effectiveMotion === 'full'
            ? {
                opacity: [1, 0.8, 1],
              }
            : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Pagina destra con page flip effect */}
        <motion.path
          d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
          animate={effectiveMotion === 'full'
            ? {
                opacity: [1, 0.8, 1],
              }
            : {}}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />

        {/* Bookmark (solo quando active) */}
        {isActive && (
          <motion.path
            d="M12 3v7l2-2 2 2V3"
            fill="currentColor"
            animate={effectiveMotion === 'full'
              ? {
                  opacity: [0.6, 1, 0.6],
                }
              : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Sparkles quando active (solo in full motion) */}
        {isActive && effectiveMotion === 'full' && (
          <g className="learn-sparkles">
            <motion.circle
              cx="6"
              cy="8"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx="18"
              cy="10"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.7,
              }}
            />
            <motion.circle
              cx="12"
              cy="18"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.4,
              }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
