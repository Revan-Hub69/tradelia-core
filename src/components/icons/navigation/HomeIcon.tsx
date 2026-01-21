/*
 * HOME ICON - Tradelia Signature Premium SVG
 *
 * Design: Casa elegante con dettagli raffinati + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Door open effect on hover, window glow on active
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type HomeIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const HomeIcon: React.FC<HomeIconProps> = ({
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
        initial: { scale: 1 },
        active: { scale: 1 },
        hover: { scale: 1 },
      };
    }

    if (effectiveMotion === 'reduced') {
      return {
        initial: { scale: 1 },
        active: { scale: 1.05 },
        hover: { scale: 1.05 },
      };
    }

    // Full motion
    return {
      initial: { scale: 1 },
      active: {
        scale: 1.05,
      },
      hover: {
        scale: 1.1,
        y: -2,
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
        : { duration: 0.2 };

  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate={isActive ? 'active' : 'initial'}
        whileHover="hover"
        transition={transition}
        style={{ transformOrigin: 'center bottom' }}
      >
        {/* Casa con tetto */}
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />

        {/* Porta con dettaglio - subtle swing on hover */}
        <motion.path
          d="M9 22V12h6v10"
          animate={effectiveMotion === 'full'
            ? {
                scaleX: [1, 0.95, 1],
              }
            : {}}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left center' }}
        />

        {/* Maniglia porta - dettaglio premium con glow */}
        <motion.circle
          cx="13.5"
          cy="17"
          r="0.5"
          fill="currentColor"
          animate={isActive && effectiveMotion === 'full'
            ? {
                opacity: [0.6, 1, 0.6],
              }
            : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Finestra - dettaglio premium con light effect */}
        <motion.rect
          x="6"
          y="7"
          width="2"
          height="2"
          rx="0.5"
          animate={isActive && effectiveMotion === 'full'
            ? {
                opacity: [0.4, 0.8, 0.4],
              }
            : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Smoke from chimney (solo in full motion quando active) */}
        {isActive && effectiveMotion === 'full' && (
          <g className="chimney-smoke">
            <motion.circle
              cx="16"
              cy="4"
              r="0.5"
              animate={{
                y: [-5, -10],
                opacity: [0.6, 0],
                scale: [0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="17"
              cy="5"
              r="0.5"
              animate={{
                y: [-5, -10],
                opacity: [0.6, 0],
                scale: [0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
