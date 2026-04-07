'use client';

import { motion } from 'framer-motion';

import { InteractiveSimulator } from '@/features/landing/InteractiveSimulator';

/**
 * Hero — Tradelia landing.
 * Minimal headline, simulator inline. No CTAs, no buttons, no copy fluff.
 */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-12 sm:px-6 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20">
      <div className="mx-auto max-w-5xl flex flex-col items-center text-center">

        {/* Wordmark */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50"
        >
          tradelia
        </motion.p>

        {/* Headline — one line, no decoration */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          Quanto ti costa davvero tradare?
        </motion.h1>

        {/* Sub — one sentence max */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
          className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
        >
          Seleziona il tuo profilo e scopri l'attrito reale sui tuoi trade.
        </motion.p>

      </div>

      {/* Simulator — directly below, no scroll, no gating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="mt-14"
      >
        <InteractiveSimulator />
      </motion.div>
    </section>
  );
};
