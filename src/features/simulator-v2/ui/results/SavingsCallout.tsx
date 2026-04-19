'use client';

import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

import { formatEURWhole } from '../../utils/format';
import { AnimatedCounter } from './AnimatedCounter';

type SavingsCalloutProps = {
  /** Risparmio mensile vs peggiore (€). */
  savingsPerMonth: number;
  /** Nome del broker peggiore per contesto. */
  worstBrokerName?: string;
};

/**
 * Banner risparmio: "Risparmi €X/anno vs peggiore" con contatore animato.
 * Crea un anchor emotivo sul valore della scelta.
 */
export function SavingsCallout({ savingsPerMonth, worstBrokerName }: SavingsCalloutProps) {
  const yearly = savingsPerMonth * 12;

  if (savingsPerMonth <= 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-emerald-500/[0.03] to-transparent p-3.5"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <TrendingDown className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Risparmio stimato
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            <AnimatedCounter
              value={yearly}
              duration={1.1}
              formatAction={v => formatEURWhole(v)}
              className="text-base font-bold text-emerald-600 dark:text-emerald-400"
            />
            <span className="ml-1 text-xs text-muted-foreground">/anno</span>
            {worstBrokerName && (
              <span className="ml-1 text-xs text-muted-foreground">
                vs
                {' '}
                {worstBrokerName}
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
