'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { AnimatedCounter, FadeIn, SlideReveal } from '@/components/ui/scroll-animations';

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
 * Scroll cue component
 */
const ScrollCue = ({ t }: { t: (key: string) => string }) => (
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

export const Hero = () => {
  const t = useTranslations('Hero') as (key: string) => string;

  return (
    <>
      {/* HERO SECTION - Awareness */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text - FIRST on mobile, LEFT on desktop */}
            <div className="order-1">
              <SlideReveal>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                  {t('hero_title_part1')}
                  {' '}
                  <span className="relative inline-block text-primary">
                    {t('hero_title_part2')}
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
                {/* CTA Buttons - Premium positioning */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button asChild size="lg" className="h-12 px-6 text-base sm:h-14 sm:px-8 sm:text-lg">
                    <Link href="/onboarding">{t('cta_primary')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="default" className="h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base">
                    <Link href="#demo">{t('cta_secondary')}</Link>
                  </Button>
                </div>

                {/* Trust signals */}
                <p className="mt-4 text-sm text-muted-foreground">
                  {t('trust')}
                </p>

                {/* Soft CTA - touch area 44px */}
                <div className="mt-6 sm:mt-8">
                  <Link
                    href="#demo"
                    className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:text-base"
                  >
                    {t('soft_cta')}
                    <svg className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <ScrollCue t={t} />
              </FadeIn>
            </div>

            {/* Illustration - SECOND on mobile, RIGHT on desktop */}
            <FadeIn delay={300} direction="right" className="order-2 flex justify-center lg:justify-end">
              <HeroIllustration />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
};
