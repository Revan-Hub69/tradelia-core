'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type ToolCardProps = {
  variant: 'primary' | 'secondary';
  namespace: string;
  features: string[];
  ctaKey: string;
  href: string;
};

export const ToolCard = ({
  variant,
  namespace,
  features,
  ctaKey,
  href,
}: ToolCardProps) => {
  const t = useTranslations(namespace as never) as (key: string) => string;
  const isPrimary = variant === 'primary';

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-border/60 p-8 transition-all duration-150
        ${isPrimary ? 'bg-card shadow-sm' : 'bg-card/50'}
      `}
    >
      <div className="relative">
        {/* Title */}
        <h2 className="text-xl font-semibold tracking-tight">
          {t('title')}
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t('description')}
        </p>

        {/* Features */}
        <ul className="mt-6 space-y-2.5">
          {features.map((featureKey, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
              <span>{t(featureKey)}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8">
          <Button asChild size="lg" className="w-full">
            <Link href={href}>{t(ctaKey)}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
