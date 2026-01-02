export default function ContattiPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Contatti
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Parla con Tradelia
            </h1>
            <p className="text-base text-muted-foreground">
              Per domande sul metodo o sullo stato della verifica puoi scrivere a{" "}
              <a className="text-foreground" href="mailto:support@tradelia.org">
                support@tradelia.org
              </a>
              .
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Email</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              <a className="text-foreground" href="mailto:support@tradelia.org">
                support@tradelia.org
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
