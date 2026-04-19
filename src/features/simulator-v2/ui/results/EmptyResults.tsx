'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Pencil } from 'lucide-react';

type EmptyResultsProps = {
  capital: number;
  minCapitalRequired: number;
  onEditAction: () => void;
};

/**
 * Stato "nessun broker eligibile" — accade quando il capitale è troppo basso.
 */
export function EmptyResults({ capital, minCapitalRequired, onEditAction }: EmptyResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <AlertCircle className="size-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Nessun broker compatibile
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Il tuo capitale di
          {' '}
          <span className="font-semibold tabular-nums text-foreground">
            €
            {capital.toLocaleString('it-IT')}
          </span>
          {' '}
          è sotto il minimo richiesto (
          <span className="font-semibold tabular-nums text-foreground">
            €
            {minCapitalRequired.toLocaleString('it-IT')}
          </span>
          ).
        </p>
      </div>
      <button
        type="button"
        onClick={onEditAction}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Pencil className="size-3.5" />
        Modifica parametri
      </button>
    </motion.div>
  );
}
