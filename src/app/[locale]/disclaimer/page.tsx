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

      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <SectionContainer size="content" className="py-16 sm:py-18 lg:py-20">

          {/* ── Page header ── */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              {t('eyebrow')}
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {t('heading')}
            </h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground">
              {t('last_updated')}
            </p>
          </div>

          {/* ── Callout ── */}
          <div className="mb-10 flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-5 py-4">
            <span className="mt-0.5 shrink-0 text-warning" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <p className="text-sm leading-7 text-foreground/70">
              {t('intro_callout')}
            </p>
          </div>

          {/* ── Two-column: TOC + sections ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr] lg:gap-12">

            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-1">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                  {locale === 'it' ? 'Indice' : 'Contents'}
                </p>
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground/40">{s.num}</span>
                    <span>{s.title}</span>
                  </a>
                ))}
              </div>
            </aside>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map(s => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-heading`}
                  className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h2
                      id={`${s.id}-heading`}
                      className="text-base font-semibold"
                    >
                      {s.title}
                    </h2>
                    <span
                      className="shrink-0 font-mono text-2xl font-bold leading-none text-muted-foreground/20 select-none"
                      aria-hidden="true"
                    >
                      {s.num}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {s.body}
                  </p>
                </section>
              ))}
            </div>
          </div>

          {/* ── Footer note ── */}
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-xs leading-7 text-muted-foreground/70">
              {t('footer_note')}
            </p>
          </div>

        </SectionContainer>
      </main>

      <LandingFooter />
    </>
  );
}
