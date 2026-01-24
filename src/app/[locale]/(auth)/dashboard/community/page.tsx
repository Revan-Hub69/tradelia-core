'use client';

import { useUserData } from '@/hooks/useUserData';

export default function CommunityPage() {
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="container-safe container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Connettiti con altri studenti e condividi il tuo percorso di apprendimento.
          </p>
        </div>

        {/* Referral System */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Sistema Referral</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Invita amici a Tradelia e aiutali nel loro percorso di apprendimento crypto.
            </p>

            {userData && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <div className="mb-2 text-sm text-blue-800 dark:text-blue-200">
                  Il tuo link di invito:
                </div>
                <div className="rounded border bg-white p-2 font-mono text-sm dark:bg-slate-800">
                  <div className="break-anywhere select-all">
                    https://tradelia.com/invite/
                    {userData.id.slice(0, 8)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const link = `https://tradelia.com/invite/${userData.id.slice(0, 8)}`;
                    navigator.clipboard.writeText(link);
                  }}
                  className="mt-2 rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Copia Link
                </button>
              </div>
            )}

            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              Sistema referral in sviluppo - Funzionalità complete disponibili presto
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Forum Discussioni</h3>
            <p className="mb-4 text-muted-foreground">
              Discuti argomenti crypto con altri membri della community.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Gruppi di Studio</h3>
            <p className="mb-4 text-muted-foreground">
              Unisciti a gruppi di studio per apprendere insieme ad altri.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Mentorship</h3>
            <p className="mb-4 text-muted-foreground">
              Connettiti con mentor esperti o diventa mentor per altri.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Eventi Live</h3>
            <p className="mb-4 text-muted-foreground">
              Partecipa a webinar e sessioni Q&A dal vivo.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
          <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
            Linee Guida Community
          </h3>
          <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
            <li>• Rispetta tutti i membri della community</li>
            <li>• Condividi conoscenze, non consigli di investimento</li>
            <li>• Niente spam o promozioni non autorizzate</li>
            <li>• Mantieni le discussioni costruttive e educative</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
