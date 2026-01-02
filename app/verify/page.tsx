export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sistema di verifica
            </p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Verifica la compatibilità
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Dichiara il tuo obiettivo e verifichiamo insieme se lo strumento che stai considerando è coerente con le tue necessità.
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/20 p-8">
            <p className="text-sm text-muted-foreground">
              Il sistema di verifica è in fase di sviluppo. Torna presto per iniziare la verifica.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
