import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { Navbar }        from '@/templates/Navbar';
import { LandingFooter } from '@/templates/LandingFooter';
import { SectionContainer } from '@/components/ui/SectionContainer';

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });
  return {
    title:       t('meta_title'),
    description: t('meta_description'),
    robots:      { index: true, follow: true },
  };
}

export default async function DisclaimerPage(
  props: { params: Promise<{ locale: string }> },
) {
  const { locale } = await props.params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });

  const sections = [
    { id: 'nature',    title: t('s1_title'), body: t('s1_body') },
    { id: 'mifid',     title: t('s2_title'), body: t('s2_body') },
    { id: 'accuracy',  title: t('s3_title'), body: t('s3_body') },
    { id: 'liability', title: t('s4_title'), body: t('s4_body') },
    { id: 'conflicts', title: t('s5_title'), body: t('s5_body') },
    { id: 'law',       title: t('s6_title'), body: t('s6_body') },
    { id: 'version',   title: t('s7_title'), body: t('s7_body') },
  ] as const;

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-slate-950 pt-20 pb-24">
        <SectionContainer size="narrow">

          {/* ── Header ── */}
          <div className="mb-12 border-b border-slate-800 pb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">
              {t('eyebrow')}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              {t('heading')}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {t('last_updated')}
            </p>
          </div>

          {/* ── Intro callout ── */}
          <div className="mb-10 rounded-2xl border border-amber-900/40 bg-amber-950/20 px-6 py-5">
            <p className="text-sm leading-7 text-amber-300/80">
              {t('intro_callout')}
            </p>
          </div>

          {/* ── Sections ── */}
          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`}>
                <h2
                  id={`${s.id}-heading`}
                  className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500"
                >
                  <span className="mr-2 text-slate-700">{String(i + 1).padStart(2, '0')}.</span>
                  {s.title}
                </h2>
                <p className="text-sm leading-8 text-slate-400">
                  {s.body}
                </p>
              </section>
            ))}
          </div>

          {/* ── Footer note ── */}
          <div className="mt-16 border-t border-slate-800 pt-8">
            <p className="text-xs leading-7 text-slate-600">
              {t('footer_note')}
            </p>
          </div>

        </SectionContainer>
      </main>
      <LandingFooter />
    </>
  );
}
