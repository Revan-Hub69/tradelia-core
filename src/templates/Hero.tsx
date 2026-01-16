'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';

import { HeroIllustration } from './HeroIllustration';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t.rich('title', {
                important: chunks => (
                  <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    {chunks}
                  </span>
                ),
              })}
            </h1>

            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t('description')}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                className={buttonVariants({ size: 'lg' })}
                href="/sign-up"
              >
                {t('primary_button')}
              </Link>

              <Link
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
                href="#percorsi"
              >
                {t('secondary_button')}
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-xs text-muted-foreground/60">
              Contenuto educativo. Non costituisce consulenza finanziaria.
            </p>
          </div>

          {/* SVG Illustration */}
          <div className="flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </Section>
  );
};
