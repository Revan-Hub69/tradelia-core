'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/card';

/**
 * User level selector
 */
const levels = [
  { id: 'beginner', label: 'Principiante', desc: 'Non so nulla di crypto' },
  { id: 'curious', label: 'Curioso', desc: 'Ho sentito parlarne' },
  { id: 'experienced', label: 'Esperto', desc: 'Conosco le basi' },
];

/**
 * Example explanations for different levels
 */
const explanations = {
  beginner: {
    title: 'Cos\'è una blockchain?',
    content: 'Immagina un quaderno condiviso tra migliaia di persone. Ogni volta che qualcuno scrive qualcosa, tutti gli altri controllano che sia corretto. Una volta scritto, non si può più cancellare. Questo è una blockchain: un registro sicuro e trasparente.',
    complexity: 'Linguaggio quotidiano, metafore semplici',
  },
  curious: {
    title: 'Cos\'è una blockchain?',
    content: 'Una blockchain è un database distribuito che mantiene un registro crescente di transazioni. Ogni "blocco" contiene un hash crittografico del blocco precedente, creando una catena immutabile. La decentralizzazione elimina la necessità di un\'autorità centrale.',
    complexity: 'Termini tecnici con spiegazioni',
  },
  experienced: {
    title: 'Cos\'è una blockchain?',
    content: 'Struttura dati distribuita basata su Merkle trees, consensus algorithms (PoW/PoS), e crittografia asimmetrica. Garantisce immutabilità tramite hash linking e Byzantine fault tolerance. Smart contracts permettono logica programmabile on-chain.',
    complexity: 'Terminologia tecnica avanzata',
  },
};

export const AdaptiveLanguage = () => {
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof explanations>('beginner');

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Linguaggio che si adatta a te
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stesso concetto, spiegato nel modo giusto per il tuo livello
          </p>
        </div>

        {/* Level Selector */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {levels.map(level => (
            <button
              key={level.id}
              type="button"
              onClick={() => setSelectedLevel(level.id as keyof typeof explanations)}
              className={`rounded-xl border px-4 py-3 text-left transition-all sm:px-6 ${
                selectedLevel === level.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="font-semibold">{level.label}</div>
              <div className="text-xs text-muted-foreground">{level.desc}</div>
            </button>
          ))}
        </div>

        {/* Explanation Card */}
        <Card className="mt-8 p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {explanations[selectedLevel].title}
            </h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {explanations[selectedLevel].complexity}
            </span>
          </div>

          <p className="leading-relaxed text-muted-foreground">
            {explanations[selectedLevel].content}
          </p>

          {/* Visual indicator */}
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tradelia rileva automaticamente il tuo livello e adatta ogni spiegazione
          </div>
        </Card>

        {/* How it works */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-primary" aria-hidden="true">
                <path d="M9 12l2 2 4-4" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="font-semibold">Quiz iniziale</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Valutiamo le tue conoscenze
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-primary" aria-hidden="true">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="font-semibold">Adattamento</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Ogni lezione al tuo livello
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-primary" aria-hidden="true">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="font-semibold">Evoluzione</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Cresce con le tue competenze
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
