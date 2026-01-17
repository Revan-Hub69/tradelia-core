'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn, SlideReveal, StaggerChildren, AnimatedCounter } from '@/components/ui/scroll-animations';

/**
 * Hero Illustration - Crypto Community SVG
 * Ottimizzato per LCP, con speech bubbles testuali
 */
const HeroIllustration = () => (
  <svg
    viewBox="0 0 400 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-xs sm:max-w-sm lg:max-w-md"
    aria-hidden="true"
  >
    {/* Background circles */}
    <circle cx="200" cy="160" r="140" className="fill-primary/5" />
    <circle cx="200" cy="160" r="100" className="fill-primary/10" />

    {/* Central Bitcoin symbol */}
    <circle cx="200" cy="140" r="35" className="fill-primary" />
    <text
      x="200"
      y="150"
      textAnchor="middle"
      className="fill-primary-foreground"
      style={{ fontSize: '28px', fontWeight: 'bold' }}
    >
      ₿
    </text>

    {/* Person 1 - Left */}
    <g>
      <circle cx="80" cy="120" r="22" className="fill-secondary" />
      <circle cx="80" cy="120" r="18" className="fill-muted" />
      <circle cx="80" cy="115" r="8" className="fill-foreground/20" />
      <rect x="72" y="130" width="16" height="20" rx="4" className="fill-foreground/20" />
      <rect x="55" y="70" width="50" height="28" rx="8" className="fill-card stroke-border" strokeWidth="1" />
      <text x="80" y="88" textAnchor="middle" className="fill-primary" style={{ fontSize: '10px', fontWeight: 500 }}>ETH</text>
      <polygon points="75,98 85,98 80,106" className="fill-card" />
    </g>

    {/* Person 2 - Right */}
    <g>
      <circle cx="320" cy="130" r="22" className="fill-secondary" />
      <circle cx="320" cy="130" r="18" className="fill-muted" />
      <circle cx="320" cy="125" r="8" className="fill-foreground/20" />
      <rect x="312" y="140" width="16" height="20" rx="4" className="fill-foreground/20" />
      <rect x="295" y="80" width="50" height="28" rx="8" className="fill-card stroke-border" strokeWidth="1" />
      <text x="320" y="98" textAnchor="middle" className="fill-accent" style={{ fontSize: '10px', fontWeight: 500 }}>DeFi</text>
      <polygon points="315,108 325,108 320,116" className="fill-card" />
    </g>

    {/* Person 3 - Bottom Left */}
    <g>
      <circle cx="120" cy="240" r="20" className="fill-secondary" />
      <circle cx="120" cy="240" r="16" className="fill-muted" />
      <circle cx="120" cy="236" r="7" className="fill-foreground/20" />
      <rect x="113" y="248" width="14" height="18" rx="3" className="fill-foreground/20" />
      <rect x="95" y="195" width="50" height="26" rx="7" className="fill-card stroke-border" strokeWidth="1" />
      <text x="120" y="212" textAnchor="middle" className="fill-primary" style={{ fontSize: '9px', fontWeight: 500 }}>Staking</text>
      <polygon points="115,221 125,221 120,228" className="fill-card" />
    </g>

    {/* Person 4 - Bottom Right */}
    <g>
      <circle cx="280" cy="235" r="20" className="fill-secondary" />
      <circle cx="280" cy="235" r="16" className="fill-muted" />
      <circle cx="280" cy="231" r="7" className="fill-foreground/20" />
      <rect x="273" y="243" width="14" height="18" rx="3" className="fill-foreground/20" />
      <rect x="255" y="190" width="50" height="26" rx="7" className="fill-card stroke-border" strokeWidth="1" />
      <text x="280" y="207" textAnchor="middle" className="fill-accent" style={{ fontSize: '9px', fontWeight: 500 }}>NFT</text>
      <polygon points="275,216 285,216 280,223" className="fill-card" />
    </g>

    {/* Connection lines */}
    <line x1="100" y1="130" x2="165" y2="140" className="stroke-border" strokeWidth="1" strokeDasharray="4 2" />
    <line x1="235" y1="140" x2="300" y2="135" className="stroke-border" strokeWidth="1" strokeDasharray="4 2" />
    <line x1="135" y1="230" x2="175" y2="175" className="stroke-border" strokeWidth="1" strokeDasharray="4 2" />
    <line x1="225" y1="175" x2="265" y2="225" className="stroke-border" strokeWidth="1" strokeDasharray="4 2" />

    {/* Floating symbols */}
    <circle cx="150" cy="80" r="12" className="fill-accent/20" />
    <circle cx="250" cy="75" r="10" className="fill-primary/20" />
    <circle cx="340" cy="200" r="11" className="fill-accent/20" />
    <circle cx="60" cy="190" r="10" className="fill-primary/20" />
  </svg>
);

/**
 * Phone Mockup
 */
const PhoneMockup = () => (
  <div className="relative mx-auto w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[260px]">
    <div className="relative overflow-hidden rounded-[2rem] border-4 border-foreground/10 bg-card shadow-xl">
      <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground/10" />
      <div className="aspect-[9/19] bg-background p-3 pt-8 sm:p-4 sm:pt-9">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary sm:size-7">
              <span className="text-xs font-bold text-primary-foreground">T</span>
            </div>
            <span className="text-xs font-semibold">Lezione 3</span>
          </div>
          <div className="rounded-full bg-accent/20 px-1.5 py-0.5">
            <span className="text-[10px] font-medium text-accent">+15 XP</span>
          </div>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-3/5 rounded-full bg-primary" />
        </div>
        <div className="mb-3 rounded-lg border bg-card p-2.5 sm:p-3">
          <p className="mb-2 text-xs font-medium">Cos&apos;è la blockchain?</p>
          <div className="space-y-1.5">
            <div className="rounded-md border border-border bg-background p-2 text-[10px]">
              Un database centralizzato
            </div>
            <div className="rounded-md border-2 border-accent bg-accent/10 p-2 text-[10px] font-medium text-accent">
              ✓ Un registro distribuito
            </div>
            <div className="rounded-md border border-border bg-background p-2 text-[10px]">
              Una criptovaluta
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-2">
          <p className="text-[10px] text-muted-foreground">
            <span className="font-medium text-accent">Esatto!</span>
            {' '}
            Un registro distribuito e immutabile...
          </p>
        </div>
      </div>
    </div>
    <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-b from-primary/10 to-accent/10 opacity-40 blur-xl" />
  </div>
);

/**
 * Tradelia styled text (matching logo) - unused but kept for reference
 */
// const TradeliaText = ({ className = '' }: { className?: string }) => (
//   <span
//     className={`font-bold tracking-tight ${className}`}
//     style={{
//       background: 'linear-gradient(45deg, #64748B 50%, #1D4ED8 50%)',
//       WebkitBackgroundClip: 'text',
//       WebkitTextFillColor: 'transparent',
//       backgroundClip: 'text',
//     }}
//   >
//     Tradelia
//   </span>
// );

/**
 * Claim icons - SVG minimal
 */
const ClaimIcons = {
  solid: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 sm:size-6" aria-hidden="true">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" className="fill-primary" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" className="fill-primary/60" />
    </svg>
  ),
  time: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 sm:size-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" className="stroke-primary" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 3" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  level: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 sm:size-6" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h6" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export const Hero = () => {
  const t = useTranslations('Hero') as (key: string) => string;

  /**
   * Scroll cue component
   */
  const ScrollCue = () => (
    <div className="mt-10 flex flex-col items-center gap-2 sm:mt-12">
      <span className="text-sm text-muted-foreground">{t('scroll_cue')}</span>
      <svg
        className="size-5 animate-bounce text-muted-foreground sm:size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );

  const claims = [
    {
      icon: ClaimIcons.solid,
      title: t('claim1_title'),
      description: t('claim1_desc'),
    },
    {
      icon: ClaimIcons.time,
      title: t('claim2_title'),
      description: t('claim2_desc'),
    },
    {
      icon: ClaimIcons.level,
      title: t('claim3_title'),
      description: t('claim3_desc'),
    },
  ];

  return (
    <>
      {/* HERO SECTION 1 - Awareness */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text - FIRST on mobile, LEFT on desktop */}
            <div className="order-1">
              <SlideReveal>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                  Tutti intorno a te parlano di
                  {' '}
                  <span className="relative inline-block text-primary">
                    crypto
                    <span
                      className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary/50"
                      aria-hidden="true"
                    />
                  </span>
                </h1>
              </SlideReveal>

              <FadeIn delay={200}>
                <p className="mt-5 text-base text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl">
                  <AnimatedCounter end={560} suffix={` ${t('stats_text')}`} />
                  <br className="hidden sm:block" />
                  {' '}
                  {t('stats_subtitle')}
                </p>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="mt-4 text-sm text-muted-foreground/70">
                  <a
                    href="https://www.demandsage.com/crypto-adoption-statistics/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-muted-foreground"
                  >
                    {t('source_text')}
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </p>
              </FadeIn>

              <FadeIn delay={600}>
                {/* Soft CTA - touch area 44px */}
                <div className="mt-6 sm:mt-8">
                  <Link
                    href="#come-funziona"
                    className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:text-base"
                  >
                    {t('soft_cta')}
                    <svg className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <ScrollCue />
              </FadeIn>
            </div>

            {/* Illustration - SECOND on mobile, RIGHT on desktop */}
            <FadeIn delay={300} direction="right" className="order-2 flex justify-center lg:justify-end">
              <HeroIllustration />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* HERO SECTION 2 - CTA */}
      <section
        id="come-funziona"
        className="relative overflow-hidden border-t bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* CTA Content - FIRST on mobile */}
            <div className="order-1">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-4xl">
                {t('section2_title')}
              </h2>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="h-12 px-6 text-base sm:h-14 sm:px-8 sm:text-lg">
                  <Link href="/sign-up">{t('section2_cta_primary')}</Link>
                </Button>
                <Button asChild variant="outline" size="default" className="h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base">
                  <Link href="#demo">{t('section2_cta_secondary')}</Link>
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {t('section2_disclaimer')}
              </p>

              {/* Trust Badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-3 py-1.5">
                <svg viewBox="0 0 24 24" fill="none" className="size-4 text-accent" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-muted-foreground">{t('trust_badge')}</span>
              </div>

              {/* Claim Cards */}
              <StaggerChildren staggerDelay={100} className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {claims.map(claim => (
                  <Card key={claim.title} className="p-3 sm:p-4">
                    <div className="mb-2">{claim.icon}</div>
                    <h3 className="text-xs font-semibold leading-tight sm:text-sm">{claim.title}</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                      {claim.description}
                    </p>
                  </Card>
                ))}
              </StaggerChildren>
            </div>

            {/* Phone Mockup - SECOND on mobile, RIGHT on desktop */}
            <div className="order-2 flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
