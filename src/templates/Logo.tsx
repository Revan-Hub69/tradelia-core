'use client';

import Link from 'next/link';

import { AppConfig } from '@/utils/AppConfig';

type LogoProps = {
  isTextHidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
};

/**
 * Tradelia Logo - Memorabile
 *
 * Testo con gradient diagonale: blu in basso, grigio in alto
 * Effetto underline moderno all'hover
 */
export const Logo = ({ isTextHidden = false, size = 'md', href = '/' }: LogoProps) => {
  const sizes = {
    sm: { icon: 'size-6', text: 'text-lg', gap: 'gap-2' },
    md: { icon: 'size-7', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'size-8', text: 'text-2xl', gap: 'gap-3' },
  };

  const { icon, text, gap } = sizes[size];

  const content = (
    <div className={`group flex items-center ${gap}`}>
      {/* Icon: T stilizzata minimal */}
      <svg
        className={icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tradelia"
      >
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M8 11h16M16 11v12"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="22" cy="11" r="2" className="fill-accent" />
      </svg>

      {/* Wordmark con gradient diagonale */}
      {!isTextHidden && (
        <span className="relative">
          <span
            className={`font-bold tracking-tight ${text}`}
            style={{
              background: 'linear-gradient(135deg, #64748B 0%, #64748B 30%, #1D4ED8 70%, #1D4ED8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {AppConfig.name}
          </span>
          {/* Underline animato all'hover */}
          <span
            className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"
          />
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

/**
 * Logo Icon Only - per favicon
 */
export const LogoIcon = () => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="8" fill="#1D4ED8" />
    <path
      d="M8 11h16M16 11v12"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="22" cy="11" r="2" fill="#059669" />
  </svg>
);
