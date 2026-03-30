/**
 * ABOUT SECTION - Program Drawer
 * Enterprise component 2026 - NO EMOJI
 */

import { useTranslations } from 'next-intl';
import React from 'react';

import { sanitizeText } from '@/lib/sanitize';

import { CheckCircleIcon, InfoIcon } from '@/components/icons/unified';
import { SectionHeader } from './SectionHeader';

type Program = {
  description?: string | null;
  best_for?: string | null;
  pros?: string[];
  cons?: string[];
};

type AboutSectionProps = {
  program: Program;
};

export const AboutSection = React.memo(({ program }: AboutSectionProps) => {
  const t = useTranslations('Challenges') as any;

  const hasContent =
    program.description || program.best_for || program.pros || program.cons;

  if (!hasContent) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        icon={<InfoIcon size={20} />}
        title={t('drawer.sections.aboutChallenge')}
        iconColor="primary"
      />

      <div className="space-y-4">
        {/* Description */}
        {program.description && (
          <div>
            <p className="leading-relaxed text-foreground">
              {sanitizeText(program.description)}
            </p>
          </div>
        )}

        {/* Best For */}
        {program.best_for && (
          <div>
            <div className="mb-2 text-sm font-bold text-muted-foreground">
              {t('drawer.sections.bestFor').toUpperCase()}
            </div>
            <p className="leading-relaxed text-foreground">{sanitizeText(program.best_for)}</p>
          </div>
        )}

        {/* Pros & Cons */}
        {(program.pros || program.cons) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pros */}
            {program.pros && program.pros.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                  <CheckCircleIcon size={16} />
                  {t('drawer.sections.pros')}
                </h4>
                <ul className="space-y-2">
                  {program.pros.map(pro => (
                    <li key={pro} className="flex gap-2 text-sm">
                      <span className="mt-0.5 text-green-600 dark:text-green-400">•</span>
                      <span>{sanitizeText(pro)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {program.cons && program.cons.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400">
                  <InfoIcon size={16} />
                  {t('drawer.sections.cons')}
                </h4>
                <ul className="space-y-2">
                  {program.cons.map(con => (
                    <li key={con} className="flex gap-2 text-sm">
                      <span className="mt-0.5 text-orange-600 dark:text-orange-400">•</span>
                      <span>{sanitizeText(con)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
});
