'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';

import { cn } from '@/utils/Helpers';

type NoResultsStateProps = {
  onBack?: () => void;
  className?: string;
};

export function NoResultsState({ onBack, className }: NoResultsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-[#27272a] p-4">
        <Search className="size-8 text-[#71717a]" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-[#fafafa]">
        Nessun risultato trovato
      </h3>
      <p className="mb-6 max-w-xs text-sm text-[#a1a1aa]">
        Prova a modificare i parametri di ricerca o seleziona un altro asset.
      </p>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-[#10b981] hover:bg-[#14b8a6]',
            'text-[#09090b] text-sm font-semibold',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]',
          )}
        >
          <ArrowLeft className="size-4" />
          Torna indietro
        </button>
      )}
    </motion.div>
  );
}
