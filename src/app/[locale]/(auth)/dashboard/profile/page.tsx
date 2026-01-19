'use client';

import { useUserData } from '@/hooks/useUserData';

export default function ProfilePage() {
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Profilo</h1>
          <p className="text-muted-foreground">
            Gestisci il tuo account e le tue preferenze.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Informazioni Account</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{userData.email}</div>
            </div>
            {userData.name && (
              <div>
                <div className="text-sm text-muted-foreground">Nome</div>
                <div className="font-medium">{userData.name}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}