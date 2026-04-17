'use client';

import { useTranslations } from 'next-intl';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SectionContainer } from '@/components/ui/SectionContainer';

const faqItems = [1, 2, 3, 4, 5, 6] as const;

export const FaqModule = () => {
  const t = useTranslations('FAQ') as (key: string) => string;

  return (
    <section className="bg-background py-16 lg:py-20">
      <SectionContainer size="content">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t('section_eyebrow')}</p>
        <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">{t('section_title')}</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">{t('section_subtitle')}</p>

        <Accordion type="single" collapsible className="mt-8">
          {faqItems.map(item => (
            <AccordionItem key={item} value={`item-${item}`}>
              <AccordionTrigger className="text-base">{t(`question${item}`)}</AccordionTrigger>
              <AccordionContent>{t(`answer${item}`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionContainer>
    </section>
  );
};
