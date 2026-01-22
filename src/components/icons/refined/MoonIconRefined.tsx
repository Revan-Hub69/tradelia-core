/*
 * MOON ICON REFINED - Tradelia Signature 2026
 *
 * Icona Moon raffinata e leggiadra:
 * - Design lunare elegante e poetico
 * - Forme morbide e organiche
 * - Dettagli sottili e raffinati
 * - Geometria armoniosa
 */

'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { RefinedIconBase, type RefinedIconProps, REFINED_TOKENS } from './RefinedIconBase';

export type MoonIconRefinedProps = Omit<RefinedIconProps, 'children'> & {
  isActive?: boolean;
  phase?: 'crescent' | 'half' | 'full';
  variant?: 'minimal' | 'elegant';
};

export const MoonIconRefined: React.FC<MoonIconRefinedProps> = ({
  isActive = false,
  phase = 'crescent',
  variant = 'minimal',
  ...props
}) => {
  // Stelle eleganti per variante raffinata
  const starPositions = [
    { x: 6, y: 4, size: 0.4 },
    { x: 18, y: 6, size: 0.3 },
    { x: 20, y: 16, size: 0.35 },
    { x: 4, y: 18, size: 0.25 },
  ];

  // Path della luna basato sulla fase
  const getMoonPath = () => {
    switch (phase) {
      case 'full':
        return 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z';
      case 'half':
        return 'M12 2a10 10 0 0 1 0 20z';
      case 'crescent':
      default:
        return 'M12 2a10 10 0 0 0 0 20 8 8 0 0 1 0-16 8 8 0 0 1 0-4z';
    }
  };

  return (
    <RefinedIconBase
      {...props}
      state={isActive ? 'active' : props.state}
    >
      {/* Stelle eleganti (solo se attiva e elegante) */}
      {isActive && variant === 'elegant' && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={REFINED_TOKENS.transitions.gentle}
        >
          {starPositions.map((star, index) => (
            <g key={index}>
              {/* Stella principale */}
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill="currentColor"
                opacity="0.6"
              />
              
              {/* Croce stellare sottile */}
              <g opacity="0.4">
                <line
                  x1={star.x - star.size * 1.5}
                  y1={star.y}
                  x2={star.x + star.size * 1.5}
                  y2={star.y}
                  strokeWidth="0.3"
                />
                <line
                  x1={star.x}
                  y1={star.y - star.size * 1.5}
                  x2={star.x}
                  y2={star.y + star.size * 1.5}
                  strokeWidth="0.3"
                />
              </g>
            </g>
          ))}
        </motion.g>
      )}

      {/* Luna principale */}
      <path
        d={getMoonPath()}
        strokeWidth={isActive ? 2.5 : 2}
        opacity={isActive ? 1 : 0.9}
      />

      {/* Dettagli lunari eleganti */}
      {variant === 'elegant' && (
        <>
          {/* Crateri sottili */}
          <circle
            cx="10"
            cy="8"
            r="1"
            strokeWidth="0.8"
            opacity="0.3"
          />
          
          <circle
            cx="14"
            cy="14"
            r="0.7"
            strokeWidth="0.8"
            opacity="0.25"
          />
          
          <circle
            cx="8"
            cy="16"
            r="0.4"
            fill="currentColor"
            opacity="0.2"
          />

          {/* Highlight lunare */}
          <ellipse
            cx="10"
            cy="10"
            rx="1.5"
            ry="2"
            fill="currentColor"
            opacity="0.15"
          />
        </>
      )}

      {/* Glow sottile per stato attivo */}
      {isActive && (
        <path
          d={getMoonPath()}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
          fill="none"
        />
      )}
    </RefinedIconBase>
  );
};