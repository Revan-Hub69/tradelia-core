import { VerificationForm } from "./verification-form";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Verifica guidata
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Scelta guidata per il tuo obiettivo
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Questo check non suggerisce broker specifici. Verifica la coerenza tra
              il tuo obiettivo e il tipo di strumento che stai valutando.
            </p>
          </div>

          <VerificationForm />

          <div className="surface-card rounded-2xl p-6 text-sm text-muted-foreground">
            Materiale educativo e informativo. Non e consulenza finanziaria regolamentata.
          </div>
        </div>
      </main>
    </div>
  );
}
