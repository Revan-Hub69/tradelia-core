'use client';

import { BookOpen, Shield, Wallet } from 'lucide-react';

const modules = [
  {
    icon: BookOpen,
    title: 'Capire',
    desc: 'Cosa sono. Cosa non sono. Come funzionano.',
  },
  {
    icon: Shield,
    title: 'Proteggere',
    desc: 'Wallet, chiavi, errori da evitare.',
  },
  {
    icon: Wallet,
    title: 'Usare',
    desc: 'Quando ha senso. Quando no.',
  },
];

export const FreeIncludes = () => {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-current" />
            Sempre gratuito
          </span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Il percorso base
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tutto quello che serve sapere prima di qualsiasi decisione.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {modules.map(m => (
            <div
              key={m.title}
              className="rounded-xl border border-border p-5 transition-colors hover:border-primary/50"
            >
              <m.icon className="size-5 text-primary" strokeWidth={1.5} />
              <h3 className="mt-3 font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
