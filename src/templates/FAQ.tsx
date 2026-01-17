'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * Premium FAQ Component - Addresses common objections
 */
export const FAQ = () => {
  const t = useTranslations('FAQ' as any) as (key: string) => string;
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: t('question1'),
      answer: t('answer1'),
    },
    {
      question: t('question2'),
      answer: t('answer2'),
    },
    {
      question: t('question3'),
      answer: t('answer3'),
    },
    {
      question: t('question4'),
      answer: t('answer4'),
    },
    {
      question: t('question5'),
      answer: t('answer5'),
    },
    {
      question: t('question6'),
      answer: t('answer6'),
    },
  ];

  return (
    <section className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
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

        <StaggerChildren staggerDelay={100} className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-muted/30"
                aria-expanded={openItems.has(index)}
              >
                <span className="text-base font-semibold sm:text-lg">
                  {faq.question}
                </span>
                <svg
                  className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openItems.has(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-border/30 px-6 pb-6 pt-4">
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </StaggerChildren>

        {/* Premium CTA */}
        <FadeIn delay={600}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-primary">
                {t('cta_badge')}
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
