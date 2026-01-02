import fs from "fs";
import path from "path";
import Link from "next/link";

type Content = {
  principi: {
    title: string;
    items: string[];
  };
  hero: {
    title: string;
    subtitleLines: string[];
    cta: string;
    microcopy: string;
  };
  accoglienza: string;
  preview: {
    title: string;
    subtitle: string;
    items: string[];
  };
  esempio: {
    title: string;
    objectiveLabel: string;
    objectiveValue: string;
    instrumentLabel: string;
    instrumentValue: string;
    outcomeLabel: string;
    outcomeValue: string;
    reasonLabel: string;
    reasonValue: string;
  };
  metodo: {
    title: string;
    body: string;
  };
  footer: {
    metodo: string;
    privacy: string;
    disclaimer: string;
    contatti: string;
  };
};

const previewIcons = [
  (
    <svg
      key="difficulty"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 10.5l2.5 2.5 4.5-5" />
    </svg>
  ),
  (
    <svg
      key="goal"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 17l5-5 4 4 7-7" />
      <path d="M20 10v6h-6" />
    </svg>
  ),
  (
    <svg
      key="tool"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  ),
];

function loadContent(): Content {
  const filePath = path.join(process.cwd(), "public", "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Content;
}

export default function HomePage() {
  const content = loadContent();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <main id="main-content" role="main" className="space-y-0">
        <section
          id="principi"
          className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          style={{ animationDelay: "0ms" }}
        >
          <div className="mx-auto max-w-5xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {content.principi.title}
            </p>
            <div className="surface-card rounded-2xl p-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {content.principi.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      className="mt-2 inline-block h-2 w-2 rounded-full bg-primary"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="verifica"
          className="section-reveal border-b border-border/60 px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <div className="space-y-6">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {content.hero.title}
              </h1>
              <div className="space-y-2 text-base text-muted-foreground">
                {content.hero.subtitleLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/verifica" className="btn-primary" aria-label="Inizia la verifica">
                  {content.hero.cta}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">{content.hero.microcopy}</p>
            </div>

            <div className="surface-card rounded-2xl p-6 text-sm text-muted-foreground">
              {content.accoglienza}
            </div>
          </div>
        </section>

        <section
          id="preview"
          className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          style={{ animationDelay: "160ms" }}
        >
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {content.preview.title}
              </p>
              <p className="text-sm text-muted-foreground">{content.preview.subtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {content.preview.items.map((item, index) => (
                <div
                  key={item}
                  className="surface-card surface-card-hover flex items-start gap-3 rounded-2xl p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary/80">
                    {previewIcons[index]}
                  </div>
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="esempio"
          className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          style={{ animationDelay: "240ms" }}
        >
          <div className="mx-auto max-w-5xl space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {content.esempio.title}
            </p>
            <div className="surface-card rounded-2xl p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {content.esempio.objectiveLabel}
                  </p>
                  <p className="text-sm text-foreground">{content.esempio.objectiveValue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {content.esempio.instrumentLabel}
                  </p>
                  <p className="text-sm text-foreground">{content.esempio.instrumentValue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {content.esempio.outcomeLabel}
                  </p>
                  <span className="status-risk inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                    {content.esempio.outcomeValue}
                  </span>
                </div>
              </div>
              <div className="mt-5 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {content.esempio.reasonLabel}
                </p>
                <p className="text-sm text-muted-foreground">{content.esempio.reasonValue}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="metodo"
          className="section-reveal px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          style={{ animationDelay: "320ms" }}
        >
          <div className="mx-auto max-w-5xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {content.metodo.title}
            </p>
            <p className="text-sm text-muted-foreground">{content.metodo.body}</p>
            <Link href="/metodo" className="link-underline text-sm font-semibold">
              Apri il documento completo
            </Link>
          </div>
        </section>
      </main>

      <footer className="section-reveal border-t border-border/60 bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <Link href="/metodo" className="link-internal link-underline font-medium">
              {content.footer.metodo}
            </Link>
            <Link href="/privacy" className="link-internal link-underline font-medium">
              {content.footer.privacy}
            </Link>
            <Link href="/disclaimer" className="link-internal link-underline font-medium">
              {content.footer.disclaimer}
            </Link>
            <Link href="/contatti" className="link-internal link-underline font-medium">
              {content.footer.contatti}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Materiale informativo ed educativo. Non e consulenza finanziaria regolamentata.
          </p>
        </div>
      </footer>
    </div>
  );
}
