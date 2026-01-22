/*
 * SUN ICON REFINED - Tradelia Signature 2026
 *
 * Icona Sun raffinata e leggiadra:
 * - Design solare elegante e minimalista
 * - Raggi proporzionati e simmetrici
 * - Animazione discreta solo su hover
 * - Geometria perfetta
 */

'use client';

import React from 'react';

import { RefinedIconBase, type RefinedIconProps } from './RefinedIconBase';

export type SunIconRefinedProps = Omit<RefinedIconProps, 'children'> & {
  isActive?: boolean;
  variant?: 'minimal' | 'elegant';
};

export const SunIconRefined: React.FC<SunIconRefinedProps> = ({
  isActive = false,
  variant = 'minimal',
  ...props
}) => {
  // Posizioni raggi ottimizzate per eleganza
  const rayPositions = [
    { x1: 12, y1: 1, x2: 12, y2: 3 },      // Top
    { x1: 21, y1: 12, x2: 19, y2: 12 },    // Right
    { x1: 12, y1: 23, x2: 12, y2: 21 },    // Bottom
    { x1: 3, y1: 12, x2: 5, y2: 12 },      // Left
    { x1: 18.36, y1: 5.64, x2: 17.07, y2: 6.93 },   // Top-right
    { x1: 18.36, y1: 18.36, x2: 17.07, y2: 17.07 }, // Bottom-right
    { x1: 5.64, y1: 18.36, x2: 6.93, y2: 17.07 },   // Bottom-left
    { x1: 5.64, y1: 5.64, x2: 6.93, y2: 6.93 },     // Top-left
  ];

  return (
    <RefinedIconBase
      {...props}
      state={isActive ? 'active' : props.state}
    >
      {/* Raggi solari eleganti */}
      {rayPositions.map((ray, index) => (
        <line
          key={index}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          strokeWidth={isActive ? 2.5 : 2}
          strokeLinecap="round"
          opacity={isActive ? 0.9 : 0.7}
        />
      ))}

      {/* Core solare */}
      <circle
        cx="12"
        cy="12"
        r="4"
        strokeWidth={isActive ? 2.5 : 2}
        opacity={isActive ? 1 : 0.9}
      />

      {/* Dettagli eleganti */}
      {variant === 'elegant' && (
        <>
          {/* Cerchio interno decorativo */}
          <circle
            cx="12"
            cy="12"
            r="2.5"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Highlight interno */}
          <circle
            cx="10.5"
            cy="10.5"
            r="1"
            fill="currentColor"
            opacity="0.2"
          />
        </>
      )}

      {/* Glow sottile per stato attivo */}
      {isActive && (
        <>
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.2"
            fill="none"
          />
          
          {/* Raggi esterni sottili */}
          {rayPositions.slice(0, 4).map((ray, index) => (
            <line
              key={`outer-${index}`}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.3"
              transform={`translate(${(ray.x2 - ray.x1) * 0.3}, ${(ray.y2 - ray.y1) * 0.3})`}
            />
          ))}
        </>
      )}
    </RefinedIconBase>
  );
};