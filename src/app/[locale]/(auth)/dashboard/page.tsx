'use client';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { useUserData } from '@/hooks/useUserData';

const DashboardIndexPage = () => {
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Errore di autenticazione
          </h1>
          <p className="mt-2 text-muted-foreground">
            Non è stato possibile caricare i dati utente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <TitleBar
          title={`Benvenuto, ${userData.name}!`}
          description="Continua il tuo percorso di apprendimento crypto"
        />

        {/* Learning Path Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Il tuo percorso attuale</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{userData.progress.pathName}</h3>
                <p className="text-sm text-muted-foreground">
                  {userData.progress.completedLessons}
                  {' '}
                  di
                  {' '}
                  {userData.progress.totalLessons}
                  {' '}
                  lezioni completate
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {userData.progress.progressPercentage}
                  %
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${userData.progress.progressPercentage}%` }}
              />
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="button"
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {userData.progress.completedLessons === 0
                  ? 'Inizia il percorso'
                  : 'Continua a studiare'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.progress.completedLessons}
            </div>
            <div className="text-sm text-muted-foreground">Lezioni completate</div>
          </div>

          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.progress.totalLessons - userData.progress.completedLessons}
            </div>
            <div className="text-sm text-muted-foreground">Lezioni rimanenti</div>
          </div>

          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">1</div>
            <div className="text-sm text-muted-foreground">Percorso attivo</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Prossimi passi</h2>
          <div className="space-y-3">
            {userData.progress.completedLessons === 0
              ? (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>Inizia con la prima lezione: "Che cos'è Bitcoin?"</span>
                  </div>
                )
              : (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>Continua con la prossima lezione del percorso</span>
                  </div>
                )}

            <div className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
              <div className="size-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">
                Sblocca percorsi avanzati completando "Fondamenti Crypto"
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndexPage;