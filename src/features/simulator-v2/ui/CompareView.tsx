'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  Sparkles,
  TrendingDown,
  Trophy,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { MockResult } from '../state/useSimulatorState';

type CompareViewProps = {
  results: MockResult[];
  onSelectBroker: (brokerId: string) => void;
  onBack: () => void;
  onClose: () => void;
};

export function CompareView({
  results,
  onSelectBroker,
  onBack,
  onClose,
}: CompareViewProps) {
  const winner = results.find(r => r.isWinner) || results[0];
  const others = results.filter(r => r.id !== winner?.id);

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="size-5 text-slate-400" />
        </button>

        <h2 className="font-semibold text-white">Risultati</h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <svg
            className="size-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Winner Block */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-slate-800 p-5"
          >
            {/* Glow effect */}
            <div className="absolute -right-20 -top-20 size-40 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
                  <Trophy className="size-3.5" />
                  #1 Best Choice
                </div>
                <Sparkles className="size-4 text-emerald-400" />
              </div>

              <h3 className="mb-1 text-2xl font-bold text-white">
                {winner.brokerName}
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                {winner.accountType}
{' '}
Account
              </p>

              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-emerald-400">
                  €
{winner.costPerMonth}
                </span>
                <span className="text-slate-400">/mese</span>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                <TrendingDown className="size-4" />
                <span>
€
{winner.costPerTrade}
{' '}
a trade
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-medium text-emerald-400">
                  Score
{' '}
{winner.score}
/100
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectBroker(winner.id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                Apri Conto
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Ranking Table */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            Altre opzioni
          </h4>

          {others.map((broker, idx) => (
            <motion.button
              key={broker.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectBroker(broker.id)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl',
                'bg-slate-800/50 border border-white/5',
                'hover:border-white/10 hover:bg-slate-800 transition-all',
              )}
            >
              {/* Rank */}
              <div className="flex size-8 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-300">
                {broker.rank}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {broker.brokerName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {broker.accountType}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>
€
{broker.costPerMonth}
/mese
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>
Score
{broker.score}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="size-4 text-slate-500" />
            </motion.button>
          ))}
        </div>

        {/* Info note */}
        <p className="px-4 text-center text-xs text-slate-500">
          I costi sono stimati in base ai tuoi parametri. Clicca su un broker
          per vedere il dettaglio completo.
        </p>
      </div>
    </div>
  );
}
