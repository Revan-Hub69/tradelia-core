'use client';

import { Link } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

type LogoProps = {
  isTextHidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  asChild?: boolean;
};

/**
 * Tradelia Logo
 *
 * Wordmark con gradient diagonale sharp 45°
 * Usa le CSS var del tema — light e dark corretti automaticamente.
 */
export const Logo = ({ isTextHidden = false, size = 'md', href, className, asChild = false }: LogoProps) => {
  const sizes = {
    sm: { icon: 'size-6', text: 'text-lg', gap: 'gap-2' },
    md: { icon: 'size-7', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'size-8', text: 'text-2xl', gap: 'gap-3' },
  };

  const { icon, text, gap } = sizes[size];

  const content = (
    <div className={cn(`group flex items-center ${gap}`, className)}>
      {/* Icon: T stilizzata minimal */}
      <svg
        className={cn(icon, 'shrink-0')}
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
        {/* Accent dot — usa fill-primary/60 invece di fill-accent per coerenza palette */}
        <circle cx="22" cy="11" r="2" className="fill-white/60" />
      </svg>

      {/* Wordmark con gradient diagonale SHARP 45° — colori dal tema */}
      {!isTextHidden && (
        <span className="relative flex items-center">
          <span
            className={cn(`font-bold tracking-tight leading-none ${text}`)}
            style={{
              background:
                'linear-gradient(45deg, hsl(var(--foreground)) 50%, hsl(var(--primary)) 50%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {AppConfig.name}
          </span>
          {/* Underline animato all'hover */}
          <span
            className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-300 group-hover:w-full"
          />
        </span>
      )}
    </div>
  );

  if (href && !asChild) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

/**
 * Logo Icon Only — per favicon / avatar
 */
export const LogoIcon = () => (
  <svg
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
    <circle cx="22" cy="11" r="2" className="fill-white/60" />
  </svg>
);
