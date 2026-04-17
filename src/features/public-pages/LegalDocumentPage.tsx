import { ShieldAlert, ShieldCheck } from 'lucide-react';

import { PublicShell } from './PublicShell';

type LegalSection = {
  id: string;
  number: string;
  title: string;
  body: string;
};

type LegalDocumentPageProps = {
  eyebrow: string;
  heading: string;
  lastUpdated: string;
  callout: string;
  footerNote: string;
  sections: LegalSection[];
  locale: string;
  variant: 'privacy' | 'disclaimer';
};

export const LegalDocumentPage = ({
  eyebrow,
  heading,
  lastUpdated,
  callout,
  footerNote,
  sections,
  locale,
  variant,
}: LegalDocumentPageProps) => {
  const Icon = variant === 'privacy' ? ShieldCheck : ShieldAlert;

  return (
    <PublicShell>
      <header className="mb-12 text-center">
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{heading}</h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">{lastUpdated}</p>
      </header>

      <section className="mb-10 flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5">
        <Icon className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" aria-hidden="true" />
        <p className="text-sm leading-7 text-foreground/80">{callout}</p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-1.5">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              {locale === 'it' ? 'Indice' : 'Contents'}
            </p>
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <span className="font-mono text-[10px] text-muted-foreground/60">{section.number}</span>
                <span className="line-clamp-2">{section.title}</span>
              </a>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {sections.map(section => (
            <section key={section.id} id={section.id} className="rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 id={`${section.id}-heading`} className="text-base font-semibold sm:text-lg">
                  {section.title}
                </h2>
                <span className="select-none font-mono text-xl font-semibold text-muted-foreground/25" aria-hidden="true">
                  {section.number}
                </span>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      <footer className="mt-12 border-t border-border/60 pt-6">
        <p className="text-xs leading-7 text-muted-foreground/80">{footerNote}</p>
      </footer>
    </PublicShell>
  );
};
