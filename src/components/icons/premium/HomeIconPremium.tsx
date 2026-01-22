/*
 * HOME ICON PREMIUM - Tradelia Signature 2026
 *
 * Icona Home con microinterazioni premium:
 * - Animazione "door opening" su hover
 * - Glow effect per stato attivo
 * - Spring physics per movimento naturale
 * - Dettagli architettonici premium
 */

'use client';

import { motion, type Variants } from 'framer-motion';
import React from 'react';

import { PremiumIconBase, type PremiumIconProps, ICON_TOKENS } from '../PremiumIconBase';

export type HomeIconPremiumProps = Omit<PremiumIconProps, 'children'> & {
  isActive?: boolean;
  showDetails?: boolean;
};

// Animation variants per elementi interni
const doorVariants: Variants = {
  default: { scaleX: 1, opacity: 0.8 },
  hover: { scaleX: 0.7, opacity: 1 },
  active: { scaleX: 0.5, opacity: 1 },
};

const windowVariants: Variants = {
  default: { opacity: 0.6, scale: 1 },
  hover: { opacity: 1, scale: 1.1 },
  active: { opacity: 1, scale: 1.2 },
};

const roofVariants: Variants = {
  default: { y: 0, rotate: 0 },
  hover: { y: -0.5, rotate: 0.5 },
  active: { y: -1, rotate: 1 },
};

export const HomeIconPremium: React.FC<HomeIconPremiumProps> = ({
  isActive = false,
  showDetails = true,
  motionLevel = 'full',
  ...props
}) => {
  return (
    <PremiumIconBase
      {...props}
      motionLevel={motionLevel}
      state={isActive ? 'active' : 'default'}
    >
      {/* Premium SVG Filters */}
      <defs>
        <filter id="home-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <linearGradient id="home-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Roof con animazione premium */}
      <motion.path
        d="M3 12l9-9 9 9"
        variants={roofVariants}
        transition={ICON_TOKENS.springs.bouncy}
        filter={isActive ? 'url(#home-glow)' : undefined}
        stroke={isActive ? 'url(#home-gradient)' : 'currentColor'}
      />

      {/* House structure */}
      <motion.path
        d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        variants={roofVariants}
        transition={ICON_TOKENS.springs.gentle}
        stroke={isActive ? 'url(#home-gradient)' : 'currentColor'}
      />

      {showDetails && (
        <>
          {/* Door con animazione "opening" */}
          <motion.rect
            x="9"
            y="16"
            width="6"
            height="5"
            variants={doorVariants}
            transition={ICON_TOKENS.springs.snappy}
            style={{ transformOrigin: 'left center' }}
            stroke="currentColor"
            fill="none"
          />

          {/* Door handle */}
          <motion.circle
            cx="13.5"
            cy="18.5"
            r="0.5"
            variants={windowVariants}
            transition={ICON_TOKENS.springs.gentle}
            fill="currentColor"
          />

          {/* Windows */}
          <motion.rect
            x="6"
            y="14"
            width="2"
            height="2"
            variants={windowVariants}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.1 }}
            stroke="currentColor"
            fill="none"
          />
          
          <motion.rect
            x="16"
            y="14"
            width="2"
            height="2"
            variants={windowVariants}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.2 }}
            stroke="currentColor"
            fill="none"
          />

          {/* Window crosses */}
          <motion.line
            x1="7"
            y1="14"
            x2="7"
            y2="16"
            variants={windowVariants}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.15 }}
          />
          <motion.line
            x1="6"
            y1="15"
            x2="8"
            y2="15"
            variants={windowVariants}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.15 }}
          />
          
          <motion.line
            x1="17"
            y1="14"
            x2="17"
            y2="16"
            variants={windowVariants}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.25 }}
          />
          <motion.line
            x1="16"
            y1="15"
            x2="18"
            y2="15"
            variants={windowVariants}
            transition={{ ...ICON_TOKENS.springs.gentle, delay: 0.25 }}
          />
        </>
      )}

      {/* Chimney con smoke animation per stato attivo */}
      {isActive && (
        <>
          <motion.rect
            x="16"
            y="8"
            width="2"
            height="4"
            stroke="currentColor"
            fill="none"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ICON_TOKENS.springs.gentle}
          />
          
          {/* Animated smoke */}
          <motion.g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={17 + (i * 0.3)}
                cy={6 - (i * 0.8)}
                r={0.5 + (i * 0.1)}
                fill="currentColor"
                opacity={0.3 - (i * 0.1)}
                animate={{
                  y: [-2, -4, -2],
                  x: [0, 1, -1, 0],
                  opacity: [0.3 - (i * 0.1), 0.1, 0.3 - (i * 0.1)],
                }}
                transition={{
                  duration: 2 + (i * 0.5),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.g>
        </>
      )}
    </PremiumIconBase>
  );
};