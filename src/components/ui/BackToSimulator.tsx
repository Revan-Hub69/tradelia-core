'use client';

import { useTranslations } from 'next-intl';

import { ArrowUp } from 'lucide-react';

/**
 * Inline anchor that scrolls back to #simulator.
 * Intentionally minimal — no Button component, no border-radius pill weight.
 * Appears at the bottom of sections where the user has just absorbed
 * context and is ready to act.
 */
export const BackToSimulator = () => {
  const t = useTranslations('BackToSimulator') as (key: string) => string;

  return (
    <div className="mt-10 flex items-center justify-center border-t border-border/30 pt-8">
      <a
        href="#simulator"
        className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60 transition-colors duration-200 hover:text-foreground"
      >
        <span
          className="flex size-7 items-center justify-center rounded-full border border-border/50 bg-background transition-all duration-200 group-hover:border-border group-hover:shadow-sm"
        >
          <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </span>
        {t('label')}
      </a>
    </div>
  );
};
