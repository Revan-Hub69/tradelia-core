'use client';

import React from 'react';
import { Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type LogoProps = {
  isTextHidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  asChild?: boolean;
};

const SIZE_MAP = {
  sm: 24,
  md: 28,
  lg: 34,
};

function TDMark({ size }: { size: number }) {
  const gradId = `tdg_${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#07E0B0" />
          <stop offset="100%" stopColor="#0594CC" />
        </linearGradient>
      </defs>
      {/* Asse X */}
      <line x1="8" y1="58" x2="64" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.18" />
      {/* Asse Y */}
      <line x1="8" y1="58" x2="8" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.18" />
      {/* Area fill */}
      <polygon points="8,58 18,48 28,52 40,36 54,24 64,14 64,58" fill={`url(#${gradId})`} opacity="0.07" />
      {/* Sparkline */}
      <polyline
        points="8,58 18,48 28,52 40,36 54,24 64,14"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot terminale */}
      <circle cx="64" cy="14" r="5" fill="#07E0B0" />
      <circle cx="64" cy="14" r="9.5" fill="none" stroke="#07E0B0" strokeWidth="1.5" opacity="0.32" />
    </svg>
  );
}

export const Logo = ({
  isTextHidden = false,
  size = 'md',
  href,
  className,
  asChild = false,
}: LogoProps) => {
  const px = SIZE_MAP[size];
  const fontSize = Math.round(px * 0.54);

  const content = (
    <div className={cn('group flex items-center', className)} style={{ gap: Math.round(px * 0.35) }}>
      <TDMark size={px} />
      {!isTextHidden && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', userSelect: 'none' }}>
          <span
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: 'currentColor',
              lineHeight: 1,
            }}
          >
            tradelia
          </span>
          <div
            style={{
              marginTop: '3px',
              width: `${Math.round(fontSize * 1.2)}px`,
              height: '2px',
              borderRadius: '1px',
              background: 'linear-gradient(90deg, #07E0B0, #0594CC)',
            }}
          />
        </div>
      )}
    </div>
  );

  if (href && !asChild) {
    return <Link href={href} aria-label="Tradelia — home">{content}</Link>;
  }

  return content;
};

/**
 * LogoIcon — mark only, per favicon / avatar
 */
export const LogoIcon = () => <TDMark size={32} />;
