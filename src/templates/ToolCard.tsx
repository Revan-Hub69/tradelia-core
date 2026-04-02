'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * ToolCard - Reusable card for tools with primary/secondary variants
 */
interface ToolCardProps {
  variant: 'primary' | 'secondary';
  namespace: string;
  features: string[];
  ctaKey: string;
  href: string;
}

export const ToolCard = ({
  variant,
  namespace,
  features,
  ctaKey,
  href,
}: ToolCardProps) => {
  const t = useTranslations(namespace) as (key: string) => string;
  const commonT = useTranslations('Common') as (key: string) => string;

  const isPrimary = variant === 'primary';

  // Get CTA text - try namespace first, fallback to common
  const getCtaText = () => {
    try {
      return t(ctaKey);
    } catch {
      return commonT(ctaKey);
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-border/60 p-6 transition-all duration-150
        hover:border-border hover:-translate-y-0.5
        ${isPrimary ? 'bg-card shadow-lg' : 'bg-card/50'}
      `}
    >
      {/* Subtle gradient for primary */}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative">
        {/* Title */}
        <h3 className={`font-semibold tracking-tight ${isPrimary ? 'text-xl' : 'text-lg'}`}>
          {t('title')}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t('description')}
        </p>

        {/* Features */}
        <ul className="mt-4 space-y-2">
          {features.map((featureKey, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 size-1.5 rounded-full bg-primary/60 shrink-0" />
              <span>{t(featureKey)}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-6">
          {isPrimary ? (
            <Button asChild size="lg" className="w-full">
              <Link href={href}>{getCtaText()}</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full">
              <Link href={href}>{getCtaText()}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * NetReturnCard - Primary tool (70% visual weight)
 */
export const NetReturnCard = () => (
  <ToolCard
    variant="primary"
    namespace="NetReturn"
    features={['feature1', 'feature2', 'feature3']}
    ctaKey="cta"
    href="/tools/net-return"
  />
);

/**
 * SecondaryTools - Grid of Exposure + Flow
 */
export const SecondaryTools = () => (
  <div className="grid gap-6 sm:grid-cols-2">
    <ToolCard
      variant="secondary"
      namespace="Exposure"
      features={['feature1', 'feature2', 'feature3']}
      ctaKey="cta"
      href="/tools/exposure"
    />
    <ToolCard
      variant="secondary"
      namespace="Flow"
      features={['feature1', 'feature2', 'feature3']}
      ctaKey="cta_waitlist"
      href="/tools/flow"
    />
  </div>
);