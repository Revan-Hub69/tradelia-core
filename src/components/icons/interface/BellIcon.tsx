/*
 * BELL ICON - Tradelia Signature Premium SVG (Notifications)
 *
 * Design: Campana elegante con batacchio + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Ring animation (±15deg, 3 cycles) on new notification
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { IconBase, type IconBaseProps } from '../IconBase';

export type BellIconProps = IconBaseProps & {
  hasNewNotification?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
  onAnimationComplete?: () => void;
};

export const BellIcon: React.FC<BellIconProps> = ({
  hasNewNotification = false,
  motionPreference,
  onAnimationComplete,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Determine motion level
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');
  
  // Ring animation variants based on motion preference
  const getRingVariants = () => {
    if (effectiveMotion === 'none' || !hasNewNotification) {
      return {
        initial: { rotate: 0 },
        animate: { rotate: 0 },
        hover: { scale: 1 },
      };
    }
    
    if (effectiveMotion === 'reduced') {
      // Reduced motion: single subtle ring
      return {
        initial: { rotate: 0 },
        animate: { 
          rotate: [0, -5, 5, 0],
        },
        hover: { scale: 1.05 },
      };
    }
    
    // Full motion: 3 ring cycles with decreasing amplitude
    return {
      initial: { rotate: 0 },
      animate: { 
        rotate: [
          0, -15, 15, -15, 15, -10, 10, -10, 10, -5, 5, 0
        ],
      },
      hover: { 
        scale: 1.1,
        rotate: [0, -5, 5, 0],
      },
    };
  };
  
  const variants = getRingVariants();
  
  // Transition timing based on motion preference
  const getTransition = () => {
    if (effectiveMotion === 'none' || !hasNewNotification) {
      return { duration: 0 };
    }
    
    if (effectiveMotion === 'reduced') {
      return { 
        duration: 0.15, 
        ease: 'easeInOut',
        onComplete: onAnimationComplete,
      };
    }
    
    // Full motion: 500ms total for 3 ring cycles
    return {
      duration: 0.5,
      ease: 'easeInOut',
      onComplete: onAnimationComplete,
    };
  };
  
  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate={hasNewNotification ? 'animate' : 'initial'}
        whileHover="hover"
        transition={getTransition()}
        style={{ transformOrigin: '12px 8px' }} // Pivot point at bell top
      >
        {/* Campana principale */}
        <path 
          d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
          className="bell-body"
        />
        
        {/* Batacchio inferiore con swing animation */}
        <motion.path 
          d="M13.73 21a2 2 0 0 1-3.46 0"
          className="bell-clapper"
          animate={hasNewNotification && effectiveMotion === 'full' ? {
            rotate: [0, 10, -10, 10, -10, 5, -5, 0],
          } : {}}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '12px 17px' }}
        />
        
        {/* Onde sonore (solo in full motion con notifica) */}
        {hasNewNotification && effectiveMotion === 'full' && (
          <g className="bell-waves">
            <motion.path
              d="M20 8 Q22 8 23 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                pathLength: [0, 1, 1],
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            />
            <motion.path
              d="M4 8 Q2 8 1 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                pathLength: [0, 1, 1],
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
