'use client';

import { ArrowRight } from 'lucide-react';
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
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-card to-primary/5 p-8 text-center shadow-lg sm:rounded-[28px] sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative">
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:tracking-[0.24em]">
                {t('eyebrow')}
              </p>

              <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {t('title')}
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
                {t('subtitle')}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="group h-12 rounded-full px-8 text-sm font-medium tracking-[0.1em] shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 sm:h-12 sm:font-mono sm:text-[11px] sm:uppercase sm:tracking-[0.16em]">
                  <Link href="#simulator" className="flex items-center gap-2">
                    {t('cta_primary')}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8 text-sm font-medium tracking-[0.1em] sm:h-12 sm:font-mono sm:text-[11px] sm:uppercase sm:tracking-[0.16em]">
                  <Link href="#faq">{t('cta_secondary')}</Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground/50">
                {t('note')}
              </p>
            </div>
          </div>
        </FadeIn>
      </SectionContainer>
    </section>
  );
};
