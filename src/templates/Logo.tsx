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
 * Mark: doppio canale asimmetrico — evoca confronto, split, convergenza.
 * Due barre di altezza diversa collegate da un connettore orizzontale.
 * Monocromatico, usa currentColor — si adatta a light/dark senza override.
 *
 * Wordmark: peso 700, tracking stretto, nessun gradient — il mark porta il carattere visivo.
 */
export const Logo = ({
  isTextHidden = false,
  size = 'md',
  href,
  className,
  asChild = false,
}: LogoProps) => {
  const sizes = {
    sm: { icon: 'size-6', text: 'text-lg',  gap: 'gap-2'   },
    md: { icon: 'size-7', text: 'text-xl',  gap: 'gap-2.5' },
    lg: { icon: 'size-8', text: 'text-2xl', gap: 'gap-3'   },
  };

  const { icon, text, gap } = sizes[size];

  const content = (
    <div className={cn(`group flex items-center ${gap}`, className)}>
      {/* Mark: dual-bar comparison symbol */}
      <svg
        className={cn(icon, 'shrink-0')}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tradelia"
      >
        {/* Barra sinistra — altezza piena, colore primario */}
        <rect
          x="4"
          y="5"
          width="9"
          height="22"
          rx="2.5"
          className="fill-primary"
        />
        {/* Barra destra — altezza ridotta, tono muted */}
        <rect
          x="19"
          y="10"
          width="9"
          height="14"
          rx="2.5"
          className="fill-primary"
          opacity="0.38"
        />
        {/* Connettore orizzontale centrale */}
        <line
          x1="13"
          y1="16"
          x2="19"
          y2="16"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark — clean, nessun gradient */}
      {!isTextHidden && (
        <span className="relative flex items-center">
          <span
            className={cn(
              `font-bold tracking-tight leading-none ${text}`,
              'text-foreground'
            )}
          >
            {AppConfig.name}
          </span>
          {/* Underline animato all'hover */}
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
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
 * LogoIcon — solo mark, per favicon / avatar / spazi stretti
 */
export const LogoIcon = () => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Tradelia"
  >
    <rect x="4"  y="5"  width="9" height="22" rx="2.5" className="fill-primary" />
    <rect x="19" y="10" width="9" height="14" rx="2.5" className="fill-primary" opacity="0.38" />
    <line x1="13" y1="16" x2="19" y2="16" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
