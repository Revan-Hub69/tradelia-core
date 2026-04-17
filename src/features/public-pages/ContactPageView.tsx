import { Clock3, Mail } from 'lucide-react';
import type { getTranslations } from 'next-intl/server';

import { ContactForm } from '@/components/forms/ContactForm';
import { AppConfig } from '@/utils/AppConfig';

import { PublicShell } from './PublicShell';

type ContactTranslator = Awaited<ReturnType<typeof getTranslations>>;

type ContactPageViewProps = {
  t: ContactTranslator;
};

export const ContactPageView = ({ t }: ContactPageViewProps) => {
  const supportEmail = AppConfig.supportEmail;

  return (
    <PublicShell containerSize="wide">
      <header className="mb-12 text-center">
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {t('badge')}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{t('description')}</p>
      </header>

      <div className="grid gap-7 lg:grid-cols-[320px_1fr] lg:items-start">
        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-border/60 bg-card/60 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/80">{t('contact_methods_title')}</h2>

            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('email_label')}</p>
                  <a href={`mailto:${supportEmail}`} className="mt-1 block text-sm font-medium text-foreground hover:text-primary">
                    {supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background">
                  <Clock3 className="size-4 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t('response_time_label')}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{t('response_time_value')}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-5">
            <p className="text-sm font-semibold">{t('help_card_title')}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{t('help_card_description')}</p>
          </section>
        </aside>

        <section className="rounded-3xl border border-border/70 bg-card/60 p-4 shadow-sm sm:p-6">
          <ContactForm variant="landing" />
        </section>
      </div>
    </PublicShell>
  );
};
