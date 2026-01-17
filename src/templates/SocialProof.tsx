'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * Premium Star Rating Component
 */
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={`star-${rating}-${i}`}
        className={`size-4 ${i < rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/**
 * Premium Avatar Component
 */
const Avatar = ({ name, role }: { name: string; role: string }) => (
  <div className="flex items-center gap-3">
    <div className="size-12 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
      <div className="flex size-full items-center justify-center text-sm font-semibold text-primary">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
    </div>
    <div>
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-sm text-muted-foreground">{role}</div>
    </div>
  </div>
);

export const SocialProof = () => {
  const t = useTranslations('SocialProof' as any) as (key: string) => string;

  const testimonials = [
    {
      name: t('testimonial1_name'),
      role: t('testimonial1_role'),
      content: t('testimonial1_content'),
      rating: 5,
    },
    {
      name: t('testimonial2_name'),
      role: t('testimonial2_role'),
      content: t('testimonial2_content'),
      rating: 5,
    },
    {
      name: t('testimonial3_name'),
      role: t('testimonial3_role'),
      content: t('testimonial3_content'),
      rating: 5,
    },
  ];

  return (
    <section className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-background px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t('section_title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {t('section_subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* Educational Principles Cards */}
        <FadeIn delay={200}>
          <div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Spaced Repetition */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 p-2">
                  <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Spaced Repetition</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Ripeti i concetti a intervalli crescenti per migliorare la memoria a lungo termine del 200%.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Fonte: Ebbinghaus (1885), ricerca neuroscientifica moderna
              </p>
            </div>

            {/* Active Recall */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-accent/10 p-2">
                  <svg className="size-full text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Active Recall</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Richiama attivamente le informazioni dalla memoria invece di rileggerle passivamente.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Fonte: Cognitive Research Journal, meta-analisi 2017
              </p>
            </div>

            {/* Microlearning */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-500/10 p-2">
                  <svg className="size-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Microlearning</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Contenuti di 3-5 minuti riducono il carico cognitivo e aumentano l'engagement del 50%.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Fonte: TalentLMS Study 2020, ricerca Phillips Consulting
              </p>
            </div>

            {/* Cognitive Load Theory */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-green-500/10 p-2">
                  <svg className="size-full text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Cognitive Load Theory</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Gestisce la quantità di informazioni per evitare sovraccarico mentale e migliorare l'apprendimento.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Fonte: John Sweller (1988), Educational Psychology Research
              </p>
            </div>

            {/* Dual Coding */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-purple-500/10 p-2">
                  <svg className="size-full text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Dual Coding</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Combina testo e immagini per attivare entrambi i canali di memoria e migliorare la comprensione.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Fonte: Allan Paivio (1971), teoria della doppia codifica
              </p>
            </div>

            {/* Interleaving */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-orange-500/10 p-2">
                  <svg className="size-full text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold">Interleaving</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Alterna diversi argomenti invece di studiarne uno alla volta per migliorare il transfer di conoscenza.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Fonte: Rohrer & Taylor (2007), Journal of Educational Psychology
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Strategic CTA after Educational Principles */}
        <FadeIn delay={400}>
          <div className="mt-12 text-center">
            <div className="mx-auto max-w-2xl">
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                Pronto a mettere in pratica questi principi?
              </h3>
              <p className="mt-3 text-muted-foreground">
                Accesso gratuito per i primi 1.000 utenti - poi €29/mese
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <Link href="/onboarding">Inizia gratis ora</Link>
                </Button>
                <Button asChild variant="outline" size="default" className="h-11 px-5 text-sm">
                  <Link href="#features">Vedi come funziona</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Testimonials Grid - Only show if testimonials exist */}
        {testimonials.some(t => t.content) && (
          <StaggerChildren
            staggerDelay={150}
            className="mt-16 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {testimonials.filter(t => t.content).map((testimonial, _index) => (
              <Card
                key={testimonial.name}
                className="group relative overflow-hidden border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  {/* Quote icon */}
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg className="size-5 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* Content */}
                  <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    "
                    {testimonial.content}
                    "
                  </blockquote>

                  {/* Author */}
                  <Avatar
                    name={testimonial.name}
                    role={testimonial.role}
                  />
                </div>
              </Card>
            ))}
          </StaggerChildren>
        )}

      </div>
    </section>
  );
};
