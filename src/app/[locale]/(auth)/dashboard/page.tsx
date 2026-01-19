'use client';

import { useUserData } from '@/hooks/useUserData';

const DashboardIndexPage = () => {
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
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
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">
            Benvenuto, {userData.name || userData.email.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Il tuo percorso di apprendimento crypto inizia qui.
          </p>
        </div>

        {/* Current Status */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Stato Attuale</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Percorso</div>
              <div className="font-medium">{userData.progress.pathName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Progresso</div>
              <div className="font-medium">
                {userData.progress.completedLessons} di {userData.progress.totalLessons} lezioni
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${userData.progress.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Prossimi Passi</h2>
          {userData.progress.completedLessons === 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Non hai ancora iniziato il percorso fondamentale.
              </p>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Inizia con la prima lezione: "Introduzione alle Criptovalute"
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Continua il tuo percorso di apprendimento.
              </p>
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
                <div className="font-medium text-green-900 dark:text-green-100">
                  Continua con la prossima lezione
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardIndexPage;