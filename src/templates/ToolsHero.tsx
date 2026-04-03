'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * Hero Illustration - Finance Tools SVG
 * Simple, clean visualization
 */
const HeroIllustration = () => (
  <svg
    viewBox="0 0 400 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-xs sm:max-w-sm"
    aria-hidden="true"
  >
    {/* Background circles */}
    <circle cx="200" cy="140" r="120" className="fill-primary/5" />
    <circle cx="200" cy="140" r="80" className="fill-primary/10" />

    {/* Central chart icon */}
    <rect x="160" y="100" width="80" height="60" rx="8" className="fill-card stroke-border" strokeWidth="1" />
    <path d="M175 140 L190 120 L205 130 L220 105 L235 115 L245 95" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="175" cy="140" r="3" className="fill-primary" />
    <circle cx="190" cy="120" r="3" className="fill-primary" />
    <circle cx="205" cy="130" r="3" className="fill-primary" />
    <circle cx="220" cy="105" r="3" className="fill-primary" />
    <circle cx="235" cy="115" r="3" className="fill-primary" />
    <circle cx="245" cy="95" r="3" className="fill-primary" />

    {/* Left card - Net Return */}
    <rect x="60" y="180" width="60" height="40" rx="6" className="fill-card stroke-border" strokeWidth="1" />
    <text x="90" y="205" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '10px', fontWeight: 500 }}>NET</text>
    <text x="90" y="215" textAnchor="middle" className="fill-primary" style={{ fontSize: '8px' }}>RETURN</text>

    {/* Right card - Flow */}
    <rect x="280" y="180" width="60" height="40" rx="6" className="fill-card stroke-border" strokeWidth="1" />
    <text x="310" y="205" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '10px', fontWeight: 500 }}>FLOW</text>
    <text x="310" y="215" textAnchor="middle" className="fill-accent" style={{ fontSize: '8px' }}>RADAR</text>

    {/* Top indicators */}
    <circle cx="140" cy="60" r="15" className="fill-primary/20" />
    <text x="140" y="65" textAnchor="middle" className="fill-primary" style={{ fontSize: '10px', fontWeight: 600 }}>▲</text>

    <circle cx="260" cy="60" r="15" className="fill-accent/20" />
    <text x="260" y="65" textAnchor="middle" className="fill-accent" style={{ fontSize: '10px', fontWeight: 600 }}>◆</text>
  </svg>
);

/**
 * ToolsHero - Finance 2026 style hero
 * Identity + immediate access to tools (no marketing fluff)
 */
export const ToolsHero = () => {
  const t = useTranslations('Tools') as (key: string) => string;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <HeroIllustration />
        </div>

        {/* Identity - Finance style, not marketing */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t('hero_title')}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t('hero_subtitle')}
        </p>

        {/* Immediate access to tools - 3 CTAs with hierarchy */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {/* Primary - Net Return (main tool) */}
          <Button asChild size="lg" className="h-12 px-6 text-base sm:h-14 sm:px-8">
            <Link href="#net-return">{t('cta_primary')}</Link>
          </Button>

          {/* Secondary - Exposure */}
          <Button asChild variant="outline" size="default" className="h-11 px-5">
            <Link href="#exposure">{t('cta_secondary')}</Link>
          </Button>

          {/* Tertiary - Flow */}
          <Button asChild variant="ghost" size="default" className="h-11 px-5 text-muted-foreground">
            <Link href="#flow">{t('cta_tertiary')}</Link>
          </Button>
        </div>

        {/* Trust - minimal, no signup friction */}
        <p className="mt-6 text-sm text-muted-foreground/80">
          {t('trust')}
        </p>
      </div>
    </section>
  );
};