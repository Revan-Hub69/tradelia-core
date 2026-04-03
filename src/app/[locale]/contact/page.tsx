import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/forms/ContactForm';
import { ClockIcon, MailIcon } from '@/components/icons';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { LandingFooter } from '@/templates/LandingFooter';
import { Navbar } from '@/templates/Navbar';
import { AppConfig } from '@/utils/AppConfig';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Contact',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  const t = await getTranslations('Contact');
  const supportEmail = AppConfig.supportEmail;

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <SectionContainer size="content" className="py-16 sm:py-18 lg:py-20">
          {/* Header Section - Landing Style */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              {t('badge')}
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info Sidebar - Glass Effect */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Methods Card */}
                <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                  <h2 className="mb-6 text-lg font-semibold">
                    {t('contact_methods_title')}
                  </h2>
                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MailIcon size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{t('email_label')}</p>
                        <a
                          href={`mailto:${supportEmail}`}
                          className="mt-1 block truncate text-sm text-primary hover:underline"
                        >
                          {supportEmail}
                        </a>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <ClockIcon size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{t('response_time_label')}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t('response_time_value')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 text-sm font-semibold">{t('help_card_title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('help_card_description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form - Main Content */}
            <div className="lg:col-span-2">
              <ContactForm variant="landing" />
            </div>
          </div>
        </SectionContainer>
      </main>
      <LandingFooter />
    </>
  );
}
