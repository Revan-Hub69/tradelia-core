/*
 * MOON ICON PREMIUM - Tradelia Signature 2026
 *
 * Icona Moon con microinterazioni premium:
 * - Fasi lunari animate
 * - Glow notturno con particelle
 * - Crateri dettagliati con depth
 * - Transizione giorno/notte fluida
 */

'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

import { PremiumIconBase, type PremiumIconProps, ICON_TOKENS } from '../PremiumIconBase';

export type MoonIconPremiumProps = Omit<PremiumIconProps, 'children'> & {
  isActive?: boolean;
  phase?: 'new' | 'crescent' | 'half' | 'gibbous' | 'full';
  showStars?: boolean;
};

// Animation variants
const moonVariants: Variants = {
  default: { rotate: 0, scale: 1 },
  hover: { rotate: -5, scale: 1.05 },
  active: { rotate: -15, scale: 1.1 },
};

const craterVariants: Variants = {
  default: { scale: 1, opacity: 0.6 },
  hover: { scale: 1.1, opacity: 0.8 },
  active: { scale: 1.2, opacity: 1 },
};

const starVariants: Variants = {
  default: { scale: 0, opacity: 0 },
  active: { scale: 1, opacity: 1 },
};

export const MoonIconPremium: React.FC<MoonIconPremiumProps> = ({
  isActive = false,
  phase = 'crescent',
  showStars = true,
  motionLevel = 'full',
  ...props
}) => {
  const currentState = isActive ? 'active' : 'default';

  // Star positions around the moon
  const starPositions = [
    { x: 6, y: 4, size: 0.5, delay: 0 },
    { x: 18, y: 6, size: 0.3, delay: 0.2 },
    { x: 20, y: 16, size: 0.4, delay: 0.4 },
    { x: 4, y: 18, size: 0.3, delay: 0.6 },
    { x: 2, y: 10, size: 0.2, delay: 0.8 },
  ];

  // Get phase-specific path
  const getPhasePath = () => {
    switch (phase) {
      case 'new':
        return 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z';
      case 'crescent':
        return 'M12 2a10 10 0 0 0 0 20 8 8 0 0 1 0-16 8 8 0 0 1 0-4z';
      case 'half':
        return 'M12 2a10 10 0 0 1 0 20z';
      case 'gibbous':
        return 'M12 2a10 10 0 0 1 0 20 6 6 0 0 0 0-20z';
      case 'full':
        return 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z';
      default:
        return 'M12 2a10 10 0 0 0 0 20 8 8 0 0 1 0-16 8 8 0 0 1 0-4z';
    }
  };

  return (
    <PremiumIconBase
      {...props}
      motionLevel={motionLevel}
      state={currentState}
    >
      {/* Premium SVG Filters */}
      <defs>
        <filter id="moon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <radialGradient id="moon-gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </radialGradient>

        <filter id="crater-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Stars (only when active) */}
      {showStars && isActive && (
        <motion.g>
          {starPositions.map((star, index) => (
            <motion.g key={index}>
              {/* Star sparkle effect */}
              <motion.g
                variants={starVariants}
                animate={currentState}
                transition={{
                  ...ICON_TOKENS.springs.gentle,
                  delay: star.delay,
                }}
              >
                {/* Main star */}
                <motion.circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size}
                  fill="currentColor"
                  animate={motionLevel === 'full' 
                    ? {
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.3, 1],
                      }
                    : {}}
                  transition={{
                    duration: 2 + (index * 0.3),
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: star.delay,
                  }}
                />
                
                {/* Star cross sparkle */}
                <motion.g
                  animate={motionLevel === 'full' 
                    ? {
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }
                    : {}}
                  transition={{
                    duration: 1.5 + (index * 0.2),
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: star.delay + 0.5,
                  }}
                >
                  <line
                    x1={star.x - star.size * 2}
                    y1={star.y}
                    x2={star.x + star.size * 2}
                    y2={star.y}
                    stroke="currentColor"
                    strokeWidth="0.3"
                    opacity="0.6"
                  />
                  <line
                    x1={star.x}
                    y1={star.y - star.size * 2}
                    x2={star.x}
                    y2={star.y + star.size * 2}
                    stroke="currentColor"
                    strokeWidth="0.3"
                    opacity="0.6"
                  />
                </motion.g>
              </motion.g>
            </motion.g>
          ))}
        </motion.g>
      )}

      {/* Moon body */}
      <motion.g
        variants={moonVariants}
        animate={currentState}
        transition={ICON_TOKENS.springs.gentle}
        style={{ transformOrigin: '12px 12px' }}
      >
        {/* Main moon shape */}
        <motion.path
          d={getPhasePath()}
          fill="url(#moon-gradient)"
          stroke="currentColor"
          strokeWidth="1.5"
          filter={isActive ? 'url(#moon-glow)' : undefined}
          animate={motionLevel === 'full' 
            ? {
                opacity: [0.9, 1, 0.9],
              }
            : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Moon craters */}
        <motion.g>
          {/* Large crater */}
          <motion.circle
            cx="10"
            cy="8"
            r="1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
            variants={craterVariants}
            animate={currentState}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.1 }}
            filter="url(#crater-shadow)"
          />
          
          {/* Medium crater */}
          <motion.circle
            cx="14"
            cy="14"
            r="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
            variants={craterVariants}
            animate={currentState}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.2 }}
            filter="url(#crater-shadow)"
          />
          
          {/* Small craters */}
          <motion.circle
            cx="8"
            cy="16"
            r="0.5"
            fill="currentColor"
            opacity="0.2"
            variants={craterVariants}
            animate={currentState}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.3 }}
          />
          
          <motion.circle
            cx="16"
            cy="10"
            r="0.3"
            fill="currentColor"
            opacity="0.2"
            variants={craterVariants}
            animate={currentState}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.4 }}
          />
        </motion.g>

        {/* Moon highlight */}
        <motion.ellipse
          cx="10"
          cy="10"
          rx="2"
          ry="3"
          fill="currentColor"
          opacity="0.2"
          animate={motionLevel === 'full' 
            ? {
                opacity: [0.2, 0.4, 0.2],
              }
            : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.g>

      {/* Atmospheric glow particles (only when active) */}
      {isActive && motionLevel === 'full' && (
        <motion.g opacity="0.3">
          {[1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={8 + (i * 2)}
              cy={6 + (i * 1.5)}
              r={0.2 + (i * 0.1)}
              fill="currentColor"
              animate={{
                y: [0, -2, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.g>
      )}
    </PremiumIconBase>
  );
};