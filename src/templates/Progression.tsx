'use client';

import { Lock } from 'lucide-react';

export const Progression = () => {
  return (
    <section className="border-y border-border bg-muted/40 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-sm text-center">
        <h2 className="text-xl font-bold sm:text-2xl">Un passo alla volta</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Niente scorciatoie. Prima le basi, poi il resto.
        </p>

        <div className="mt-8 space-y-3 text-left">
          {/* Active */}
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Percorso Base</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Attivo
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">0%</p>
          </div>

          {/* Locked */}
          <div className="rounded-xl border border-border bg-card/50 p-4 opacity-50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">Espansioni</span>
              <Lock className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Completa il base per sbloccare
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
