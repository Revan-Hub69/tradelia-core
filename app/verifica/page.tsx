import { VerificationForm } from "./verification-form";

type VerifyPageProps = {
  searchParams?: {
    objective?: string;
  };
};

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Verifica guidata
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Verifica di compatibilita
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              L'utente non e mai valutato. Lo strumento si. Questa verifica riduce
              errori strutturali prima di qualsiasi decisione.
            </p>
          </div>

          <VerificationForm initialObjective={searchParams?.objective} />

          <div className="surface-card rounded-2xl p-6 text-sm text-muted-foreground">
            Materiale educativo e informativo. Nessun consiglio operativo. Non e consulenza finanziaria regolamentata.
          </div>
        </div>
      </main>
    </div>
  );
}
