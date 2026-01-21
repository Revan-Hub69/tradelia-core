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
  strokeWidth,
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

  const effectiveStrokeWidth = strokeWidth ?? 2;

  return (
    <IconBase strokeWidth={effectiveStrokeWidth} {...props}>
      <defs>
        <filter id="learn-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

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
        {/* Pagina sinistra */}
        <motion.path
          d="M4.5 6.5h5.8a3 3 0 0 1 3 3v9.5a2.3 2.3 0 0 0-2.3-2.3H4.5z"
          animate={effectiveMotion === 'full'
            ? {
                opacity: [1, 0.8, 1],
              }
            : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Pagina destra */}
        <motion.path
          d="M19.5 6.5h-5.8a3 3 0 0 0-3 3v9.5a2.3 2.3 0 0 1 2.3-2.3h6.5z"
          animate={effectiveMotion === 'full'
            ? {
                opacity: [1, 0.8, 1],
              }
            : {}}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />

        {/* Spine line */}
        <path
          d="M12 7.5v10"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Page lines */}
        <path d="M6.6 11h3.2" strokeWidth="1.5" opacity="0.6" />
        <path d="M14.2 11h3.2" strokeWidth="1.5" opacity="0.6" />

        {/* Bookmark (solo quando active) */}
        {isActive && (
          <motion.path
            d="M12 6.3v5.8l1.9-1.6 1.9 1.6V6.3"
            fill="currentColor"
            filter={effectiveMotion === 'full' ? 'url(#learn-glow)' : undefined}
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
