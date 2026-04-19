'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/Helpers';

type SkelProps = { className?: string };

function Skel({ className }: SkelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted/50',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className,
      )}
    />
  );
}

/**
 * Placeholder animato mostrato durante il calcolo (300-500ms).
 * Replica l'architettura di ResultsView: hero + 3 competitor cards + savings banner.
 */
export function ResultsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 p-4 sm:p-5"
      aria-busy="true"
      aria-label="Calcolo risultati in corso"
    >
      {/* Status row */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="size-3 rounded-full border-2 border-primary border-t-transparent"
        />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Analisi conti in corso…
        </span>
      </div>

      {/* Hero skeleton */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skel className="h-3 w-16" />
            <Skel className="h-5 w-40" />
            <Skel className="h-3 w-24" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skel className="h-8 w-24" />
            <Skel className="h-3 w-14" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Skel className="h-8 flex-1" />
          <Skel className="h-8 w-20" />
        </div>
      </div>

      {/* Savings callout skeleton */}
      <Skel className="h-16 rounded-xl" />

      {/* Competitor cards skeleton */}
      <div className="space-y-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 p-3"
          >
            <Skel className="size-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skel className="h-3 w-28" />
              <Skel className="h-2.5 w-20" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skel className="h-5 w-16" />
              <Skel className="h-2.5 w-12" />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>
        {`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}
      </style>
    </motion.div>
  );
}
