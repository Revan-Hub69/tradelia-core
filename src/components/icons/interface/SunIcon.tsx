/*
 * SUN ICON - Tradelia Signature Premium SVG (Light Mode)
 *
 * Design: Sole elegante con raggi bilanciati + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: 180deg rotate on toggle, subtle glow on hover, scale pulse
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { IconBase, type IconBaseProps } from '../IconBase';

export type SunIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const SunIcon: React.FC<SunIconProps> = ({
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
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: 0, scale: 1 },
        hover: { rotate: 0, scale: 1 },
      };
    }

    if (effectiveMotion === 'reduced') {
      return {
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: isActive ? 180 : 0, scale: 1 },
        hover: { scale: 1.05 },
      };
    }

    // Full motion
    return {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: isActive ? 180 : 0,
        scale: 1,
      },
      hover: {
        scale: 1.1,
        rotate: isActive ? 195 : 15,
      },
    };
  };

  const variants = getAnimationVariants();

  // Transition timing based on motion preference
  const transition = {
    none: { duration: 0 },
    reduced: { duration: 0.15 },
    full: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1], // Custom easing for premium feel
    },
  }[effectiveMotion];

  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={transition}
        style={{ transformOrigin: 'center' }}
      >
        {/* Centro sole con glow effect */}
        <circle
          cx="12"
          cy="12"
          r="4"
          style={{
            filter: effectiveMotion === 'full' ? 'drop-shadow(0 0 2px currentColor)' : 'none',
          }}
        />

        {/* Raggi esterni - 8 direzioni con stagger animation */}
        <g>
          <motion.line
            x1="12"
            x2="12"
            y1="1"
            y2="3"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.line
            x1="12"
            x2="12"
            y1="21"
            y2="23"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.25,
            }}
          />
          <motion.line
            x1="4.22"
            x2="5.64"
            y1="4.22"
            y2="5.64"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          <motion.line
            x1="18.36"
            x2="19.78"
            y1="18.36"
            y2="19.78"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.75,
            }}
          />
          <motion.line
            x1="1"
            x2="3"
            y1="12"
            y2="12"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          />
          <motion.line
            x1="21"
            x2="23"
            y1="12"
            y2="12"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.25,
            }}
          />
          <motion.line
            x1="4.22"
            x2="5.64"
            y1="19.78"
            y2="18.36"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.5,
            }}
          />
          <motion.line
            x1="18.36"
            x2="19.78"
            y1="5.64"
            y2="4.22"
            animate={
              effectiveMotion === 'full'
                ? {
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.75,
            }}
          />
        </g>
      </motion.g>
    </IconBase>
  );
};
