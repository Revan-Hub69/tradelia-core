'use client';

import { useTranslations } from 'next-intl';

export const HowItWorks = () => {
  const t = useTranslations('HowItWorks') as any;

  const steps = [
    {
      num: '1',
      title: t('step1_title'),
      desc: t('step1_desc'),
    },
    {
      num: '2',
      title: t('step2_title'),
      desc: t('step2_desc'),
    },
    {
      num: '3',
      title: t('step3_title'),
      desc: t('step3_desc'),
    },
    {
      num: '4',
      title: t('step4_title'),
      desc: t('step4_desc'),
    },
  ];
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/30 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-lg font-bold sm:text-xl">{t('title')}</h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {steps.map(step => (
            <div key={step.num} className="text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground sm:size-12">
                {step.num}
              </span>
              <p className="mt-3 text-sm font-semibold">{step.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
