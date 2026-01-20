'use client';

import Link from 'next/link';
import { useState } from 'react';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/utils/Helpers';

type Step = 'intro' | 'question' | 'result';

/**
 * Check icon SVG
 */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-emerald-500" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * X icon SVG
 */
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-red-500" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Warning icon SVG
 */
const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="mr-1.5 inline size-4 text-amber-500" aria-hidden="true">
    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MiniDemo = () => {
  const [step, setStep] = useState<Step>('intro');
  const [answer, setAnswer] = useState<string | null>(null);
  const isCorrect = answer === 'b';

  return (
    <section id="demo" className="border-y border-border bg-muted/40 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-md">
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Prova una lezione. Nessuna registrazione.
        </p>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {/* Progress */}
          <div className="h-1 bg-muted">
            <div
              className={cn(
                'h-full bg-primary transition-all duration-500',
                step === 'intro' && 'w-1/3',
                step === 'question' && 'w-2/3',
                step === 'result' && 'w-full',
              )}
            />
          </div>

          <div className="p-5 sm:p-6">
            {step === 'intro' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Lezione 1
                </p>
                <h3 className="mt-3 text-lg font-bold sm:text-xl">
                  &quot;Ho i Bitcoin nel wallet&quot;
                </h3>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  Frase comune. Ma nasconde un errore costoso.
                </p>
                <p className="mt-4 text-sm text-foreground sm:text-base">
                  Un wallet
                  {' '}
                  <strong>non contiene</strong>
                  {' '}
                  i tuoi Bitcoin. Contiene le
                  {' '}
                  <strong>chiavi</strong>
                  {' '}
                  per accedervi. I Bitcoin restano sulla blockchain.
                </p>
                <p className="mt-4 rounded-lg bg-amber-500/10 p-3 text-sm">
                  <WarningIcon />
                  Perdi le chiavi = perdi tutto. Per sempre.
                </p>
                <button
                  type="button"
                  onClick={() => setStep('question')}
                  className={buttonVariants({ className: 'mt-6 w-full' })}
                >
                  Verifica
                </button>
              </>
            )}

            {step === 'question' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Quiz
                </p>
                <h3 className="mt-3 text-lg font-bold sm:text-xl">
                  Cosa contiene un wallet?
                </h3>
                <div className="mt-5 space-y-2.5">
                  {[
                    { id: 'a', text: 'I tuoi Bitcoin' },
                    { id: 'b', text: 'Le chiavi per accedervi' },
                    { id: 'c', text: 'Una copia della blockchain' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setAnswer(opt.id);
                        setStep('result');
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-border p-3.5 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5 sm:p-4 sm:text-base"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border text-xs font-bold uppercase sm:size-8 sm:text-sm">
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 'result' && (
              <>
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-xl p-3.5 sm:p-4',
                    isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10',
                  )}
                >
                  {isCorrect ? <CheckIcon /> : <XIcon />}
                  <div>
                    <p className={cn('font-bold', isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                      {isCorrect ? 'Esatto!' : 'Non proprio'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Il wallet contiene le chiavi, non le crypto. Questo errore costa miliardi ogni anno.
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  Ogni lezione chiarisce un concetto che sembra ovvio ma non lo è.
                </p>
                <Link
                  href="/sign-up"
                  className={buttonVariants({ className: 'mt-5 w-full' })}
                >
                  Continua gratis
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep('intro');
                    setAnswer(null);
                  }}
                  className="mt-3 w-full py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Riprova
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
