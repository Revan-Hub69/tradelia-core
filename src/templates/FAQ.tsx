'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

export const FAQ = () => {
  const t = useTranslations('FAQ') as (key: string) => string;
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

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
    { question: t('question1'), answer: t('answer1') },
    { question: t('question2'), answer: t('answer2') },
    { question: t('question3'), answer: t('answer3') },
    { question: t('question4'), answer: t('answer4') },
    { question: t('question5'), answer: t('answer5') },
    { question: t('question6'), answer: t('answer6') },
  ];

  return (
    <section
      id="faq"
      className="scroll-mt-32 border-t border-border/40 bg-muted/10 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
    >
      <SectionContainer size="content">
        <FadeIn>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground/55">
              FAQ
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {t('section_title')}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
              {t('section_subtitle')}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={100} className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-[24px] border border-border/50 bg-background transition-colors duration-200 hover:border-border/70"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleItem(index);
                  }
                }}
                className="flex w-full items-center justify-between gap-6 p-5 text-left transition-colors duration-200 hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:px-6"
                aria-expanded={openItems.has(index)}
              >
                <span className="text-base font-semibold leading-7 sm:text-lg">
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
                <div className="border-t border-border/30 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </StaggerChildren>

        <FadeIn delay={600}>
          <div className="mt-10 border-t border-border/40 pt-5 text-center">
            <p className="text-sm leading-7 text-muted-foreground">
              {t('cta_badge')}
            </p>
          </div>
        </FadeIn>
      </SectionContainer>
    </section>
  );
};
