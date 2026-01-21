/*
 * GLOBE ICON - Tradelia Signature Premium SVG (Language Switcher)
 *
 * Design: Globo con meridiani e paralleli + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle 15deg rotation on hover, continuous slow spin
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { IconBase, type IconBaseProps } from '../IconBase';

export type GlobeIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const GlobeIcon: React.FC<GlobeIconProps> = ({
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
        initial: { rotateY: 0, scale: 1 },
        animate: { rotateY: 0, scale: 1 },
        hover: { rotateY: 0, scale: 1 },
      };
    }
    
    if (effectiveMotion === 'reduced') {
      return {
        initial: { rotateY: 0, scale: 1 },
        animate: { rotateY: 0, scale: 1 },
        hover: { scale: 1.05 },
      };
    }
    
    // Full motion - continuous slow rotation
    return {
      initial: { rotateY: 0, scale: 1 },
      animate: { 
        rotateY: 360,
        scale: 1,
      },
      hover: { 
        scale: 1.1,
        rotateY: 15,
      },
    };
  };
  
  const variants = getAnimationVariants();
  
  // Transition timing based on motion preference
  const getTransition = () => {
    if (effectiveMotion === 'none') {
      return { duration: 0 };
    }
    
    if (effectiveMotion === 'reduced') {
      return { duration: 0.15, ease: 'easeOut' };
    }
    
    // Full motion - continuous rotation
    return {
      rotateY: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
      scale: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    };
  };
  
  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={getTransition()}
        style={{ 
          transformOrigin: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Cerchio esterno */}
        <circle 
          cx="12" 
          cy="12" 
          r="10"
          className="globe-outer"
        />
        
        {/* Paralleli (linee orizzontali) con opacity animation */}
        <motion.line 
          x1="2" 
          y1="12" 
          x2="22" 
          y2="12"
          className="globe-equator"
          animate={effectiveMotion === 'full' ? {
            opacity: [0.6, 1, 0.6],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Meridiani (linee verticali) */}
        <motion.path 
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
          className="globe-meridians"
          animate={effectiveMotion === 'full' ? {
            opacity: [1, 0.7, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
        />
        
        {/* Punti decorativi (continenti stilizzati - solo in full motion) */}
        {effectiveMotion === 'full' && (
          <g className="globe-continents">
            <motion.circle
              cx="8"
              cy="10"
              r="1"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx="16"
              cy="9"
              r="1.2"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1.3,
              }}
            />
            <motion.circle
              cx="14"
              cy="15"
              r="0.8"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2.6,
              }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
