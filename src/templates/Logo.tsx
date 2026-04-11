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

const TEXT_SIZE = {
  sm: '0.9375rem',
  md: '1.0625rem',
  lg: '1.25rem',
};

export const Logo = ({
  isTextHidden = false,
  size = 'md',
  href,
  className,
  asChild = false,
}: LogoProps) => {
  const content = (
    <div className={cn('group flex items-center', className)}>
      {!isTextHidden && (
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: TEXT_SIZE[size],
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: 'currentColor',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {AppConfig.name}
        </span>
      )}
    </div>
  );

  if (href && !asChild) {
    return <Link href={href} aria-label={`${AppConfig.name} — home`}>{content}</Link>;
  }

  return content;
};

export const LogoIcon = () => null;
