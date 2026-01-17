'use client';

import { TrendingUp, Percent, AlertTriangle, Lock } from 'lucide-react';

const expansions = [
  {
    icon: TrendingUp,
    title: 'Investire',
    description: 'Orizzonte lungo termine, bias cognitivi, errori comuni',
    prerequisite: 'Base completato',
    risk: 'Medio-alto',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    icon: Percent,
    title: 'Rendite Passive',
    description: 'Staking, lending, i rischi che nessuno ti dice',
    prerequisite: 'Base completato',
    risk: 'Medio',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  {
    icon: AlertTriangle,
    title: 'Speculazione',
    description: 'Perché è difficile, non come guadagnare',
    prerequisite: 'Base + Investire',
    risk: 'Alto',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20 hover:border-red-500/40',
  },
];

export const Expansions = () => {
  return (
    <section className="border-t border-border/50 bg-muted/20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Espansioni</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Approfondimenti a pagamento
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sbloccabili solo dopo il Percorso Base. Pagamento unico, nessun abbonamento.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {expansions.map(exp => (
            <div
              key={exp.title}
              className={`group relative rounded-2xl border bg-card p-6 transition-colors ${exp.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div className={`inline-flex rounded-xl p-3 ${exp.bgColor}`}>
                  <exp.icon
                    className={`size-6 ${exp.color}`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <Lock className="size-3" />
                  Espansione
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold">{exp.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {exp.description}
              </p>

              <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
                <p>
                  <span className="text-foreground/70">Prerequisito:</span> {exp.prerequisite}
                </p>
                <p>
                  <span className="text-foreground/70">Rischio:</span>{' '}
                  <span className={exp.title === 'Speculazione' ? 'font-medium text-red-500' : ''}>
                    {exp.risk}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
