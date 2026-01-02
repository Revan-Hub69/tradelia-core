export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sistema di verifica
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Verifica di compatibilita
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Dichiara il tuo obiettivo e verifichiamo se lo strumento che stai
              valutando e coerente con le tue esigenze operative.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-8 text-left">
            <p className="text-sm font-semibold text-foreground">
              Accesso in apertura controllata
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Stiamo completando la fase di verifica interna. Apriremo l'accesso
              a piccoli gruppi per garantire qualita e chiarezza.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
