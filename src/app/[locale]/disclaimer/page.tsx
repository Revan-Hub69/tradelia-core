import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { Navbar }           from '@/templates/Navbar';
import { LandingFooter }    from '@/templates/LandingFooter';
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

const SECTION_IDS = [
  'nature', 'mifid', 'accuracy', 'liability', 'conflicts', 'law', 'version',
] as const;

export default async function DisclaimerPage(
  props: { params: Promise<{ locale: string }> },
) {
  const { locale } = await props.params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });

  const sections = SECTION_IDS.map((id, i) => ({
    id,
    num:   String(i + 1).padStart(2, '0'),
    title: t(`s${i + 1}_title` as any),
    body:  t(`s${i + 1}_body`  as any),
  }));

  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen bg-slate-950 pt-20 pb-32">
        <SectionContainer size="wide">

          {/* ────── Page header ────── */}
          <div className="mb-14 mt-10 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
              {t('eyebrow')}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              {t('heading')}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              {t('last_updated')}
            </p>
          </div>

          {/* ────── Callout ────── */}
          <div className="mb-12 flex gap-4 rounded-2xl border border-amber-800/30 bg-amber-950/30 px-6 py-5">
            <span className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <p className="text-sm leading-7 text-amber-200/70">
              {t('intro_callout')}
            </p>
          </div>

          {/* ────── Two-column layout: TOC + content ────── */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr] lg:gap-16 xl:grid-cols-[220px_1fr]">

            {/* Sidebar TOC — sticky on desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-1">
                <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600">
                  Indice
                </p>
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-500 transition-colors hover:bg-slate-900 hover:text-slate-200"
                  >
                    <span className="font-mono text-[10px] text-slate-700">{s.num}</span>
                    <span>{s.title}</span>
                  </a>
                ))}
              </div>
            </aside>

            {/* Main content */}
            <div className="space-y-6">
              {sections.map(s => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-heading`}
                  className="group rounded-2xl border border-slate-800/60 bg-slate-900/50 p-7 sm:p-8 transition-colors hover:border-slate-700/60"
                >
                  {/* Section number — large ambient */}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h2
                      id={`${s.id}-heading`}
                      className="text-base font-semibold text-slate-100"
                    >
                      {s.title}
                    </h2>
                    <span
                      className="shrink-0 font-mono text-3xl font-bold leading-none text-slate-800 select-none"
                      aria-hidden="true"
                    >
                      {s.num}
                    </span>
                  </div>

                  <p className="text-sm leading-8 text-slate-400">
                    {s.body}
                  </p>
                </section>
              ))}
            </div>
          </div>

          {/* ────── Footer note ────── */}
          <div className="mt-16 border-t border-slate-800 pt-8">
            <p className="text-xs leading-7 text-slate-500">
              {t('footer_note')}
            </p>
          </div>

        </SectionContainer>
      </main>

      <LandingFooter />
    </>
  );
}
