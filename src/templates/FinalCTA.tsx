'use client';

import { PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { FadeIn } from '@/components/ui/scroll-animations';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/ui/SectionContainer';

export const FinalCTA = () => {
  const t = useTranslations('FinalCTA') as (key: string) => string;

  return (
    <section className="border-t border-border/40 py-14 sm:py-16 lg:py-20 xl:py-24">
      <SectionContainer size="content">
        <FadeIn distance={24} duration={600}>
          {/* Shimmer border wrapper */}
          <div className="p-px rounded-[28px] bg-gradient-to-br from-primary/30 via-border/20 to-primary/10 shadow-lg">
            <div className="relative overflow-hidden rounded-[27px] bg-gradient-to-br from-primary/5 via-card to-primary/5 p-8 text-center sm:p-12 lg:p-16">

              {/* SVG grain overlay */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]"
              >
                <filter id="cta-noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#cta-noise)" />
              </svg>

              {/* Animated ambient blobs */}
              <div
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
                style={{ animation: 'ctaBlob1 8s ease-in-out infinite alternate' }}
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/7 blur-3xl"
                style={{ animation: 'ctaBlob2 10s ease-in-out infinite alternate' }}
              />

              <style>{`
                @keyframes ctaBlob1 {
                  from { transform: translate(0, 0) scale(1); }
                  to   { transform: translate(12px, -12px) scale(1.08); }
                }
                @keyframes ctaBlob2 {
                  from { transform: translate(0, 0) scale(1); }
                  to   { transform: translate(-10px, 10px) scale(1.06); }
                }
                @keyframes ctaPulse {
                  0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.25); }
                  50%       { box-shadow: 0 0 0 8px hsl(var(--primary) / 0); }
                }
              `}</style>

              {/* Content — staggered entrance */}
              <div className="relative">

                <FadeIn delay={0} duration={500} distance={16}>
                  <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:tracking-[0.24em]">
                    {t('eyebrow')}
                  </p>
                </FadeIn>

                <FadeIn delay={80} duration={600} distance={20}>
                  <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    {t('title')}
                  </h2>
                </FadeIn>

                <FadeIn delay={160} duration={600} distance={16}>
                  <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
                    {t('subtitle')}
                  </p>
                </FadeIn>

                <FadeIn delay={260} duration={600} distance={12}>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

                    {/* Primary — pulse ring + scale feedback */}
                    <Button
                      asChild
                      size="lg"
                      className="group h-12 rounded-full px-8 text-sm font-medium tracking-[0.1em] shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/35 active:scale-[0.97] sm:h-12 sm:font-mono sm:text-[11px] sm:uppercase sm:tracking-[0.16em]"
                      style={{ animation: 'ctaPulse 2.8s ease-in-out infinite' }}
                    >
                      <Link href="#simulator" className="flex items-center gap-2">
                        <PlayCircle className="size-4 transition-transform duration-300 group-hover:scale-110" />
                        {t('cta_primary')}
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-full px-8 text-sm font-medium tracking-[0.1em] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] sm:h-12 sm:font-mono sm:text-[11px] sm:uppercase sm:tracking-[0.16em]"
                    >
                      <Link href="#faq">{t('cta_secondary')}</Link>
                    </Button>
                  </div>
                </FadeIn>

                <FadeIn delay={340} duration={500} distance={8}>
                  <p className="mt-6 text-xs text-muted-foreground/50">
                    {t('note')}
                  </p>
                </FadeIn>

              </div>
            </div>
          </div>
        </FadeIn>
      </SectionContainer>
    </section>
  );
};
