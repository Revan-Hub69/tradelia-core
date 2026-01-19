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
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Connettiti con altri studenti e condividi il tuo percorso di apprendimento.
          </p>
        </div>

        {/* Referral System */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Sistema Referral</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Invita amici a Tradelia e aiutali nel loro percorso di apprendimento crypto.
            </p>
            
            {userData && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Il tuo link di invito:
                </div>
                <div className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">
                  https://tradelia.com/invite/{userData.id.slice(0, 8)}
                </div>
              </div>
            )}

            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              Sistema referral in sviluppo - Funzionalità complete disponibili presto
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Forum Discussioni</h3>
            <p className="text-muted-foreground mb-4">
              Discuti argomenti crypto con altri membri della community.
            </p>
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              In sviluppo
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Gruppi di Studio</h3>
            <p className="text-muted-foreground mb-4">
              Unisciti a gruppi di studio per apprendere insieme ad altri.
            </p>
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              In sviluppo
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
            <p className="text-muted-foreground mb-4">
              Connettiti con mentor esperti o diventa mentor per altri.
            </p>
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              In sviluppo
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Eventi Live</h3>
            <p className="text-muted-foreground mb-4">
              Partecipa a webinar e sessioni Q&A dal vivo.
            </p>
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              In sviluppo
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            Linee Guida Community
          </h3>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
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