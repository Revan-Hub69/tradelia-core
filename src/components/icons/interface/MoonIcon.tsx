/*
 * MOON ICON - Tradelia Signature Premium SVG (Dark Mode)
 *
 * Design: Luna crescente elegante + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: 180deg rotation on toggle, subtle glow, scale pulse
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { IconBase, type IconBaseProps } from '../IconBase';

export type MoonIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const MoonIcon: React.FC<MoonIconProps> = ({
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
    reduced: { duration: 0.15, ease: 'easeOut' },
    full: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1],
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
        {/* Luna crescente con glow effect */}
        <motion.path 
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          className="moon-crescent"
          style={{
            filter: effectiveMotion === 'full' ? 'drop-shadow(0 0 3px currentColor)' : 'none',
          }}
          animate={effectiveMotion === 'full' ? {
            opacity: [1, 0.8, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Stelle decorative (solo in full motion) */}
        {effectiveMotion === 'full' && (
          <g className="stars">
            <motion.circle
              cx="8"
              cy="8"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx="16"
              cy="6"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.7,
              }}
            />
            <motion.circle
              cx="18"
              cy="16"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
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
