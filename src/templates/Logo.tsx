'use client';

import { Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { AppConfig } from '@/utils/AppConfig';

type LogoProps = {
  isTextHidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  asChild?: boolean;
};

const SIZE_MAP = { sm: 36, md: 42, lg: 52 };

function DeltaMark({ px }: { px: number }) {
  // viewBox 48×52
  // top=(24,4) bl=(2,48) br=(46,48)
  // benchmark bar at y=32: left edge=16, right edge=32
  return (
    <svg
      width={px}
      height={Math.round(px * 52 / 48)}
      viewBox="0 0 48 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id="dlg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#07C99A" />
          <stop offset="100%" stopColor="#0594CC" />
        </linearGradient>
      </defs>
      {/* Delta outline */}
      <polygon
        points="24,4 2,48 46,48"
        stroke="url(#dlg)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner fill subtle */}
      <polygon points="24,4 2,48 46,48" fill="url(#dlg)" opacity="0.06" />
      {/* Benchmark bar — comparazione */}
      <line x1="16" y1="32" x2="32" y2="32" stroke="url(#dlg)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Top vertex dot */}
      <circle cx="24" cy="4" r="3.5" fill="#07C99A" />
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
  const fontSize = Math.round(px * 0.57);

  const content = (
    <div
      className={cn('group flex items-center', className)}
      style={{ gap: Math.round(px * 0.28) }}
    >
      <DeltaMark px={px} />
      {!isTextHidden && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, userSelect: 'none' }}>
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              letterSpacing: '-0.038em',
              color: 'currentColor',
              lineHeight: 1,
            }}
          >
            {AppConfig.name}
          </span>
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '8px',
              fontWeight: 400,
              letterSpacing: '0.22em',
              color: 'currentColor',
              opacity: 0.35,
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            Financial Tool
          </span>
        </div>
      )}
    </div>
  );

  if (href && !asChild) {
    return <Link href={href} aria-label={`${AppConfig.name} — home`}>{content}</Link>;
  }
  return content;
};

export const LogoIcon = () => <DeltaMark px={28} />;
