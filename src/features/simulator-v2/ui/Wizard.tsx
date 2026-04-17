'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Euro,
  Gauge,
  Hash,
  LineChart,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import type { SimulatorInput } from '../state/useSimulatorState';
import type { AssetId } from './AssetSelector';
import { PairSelector } from './PairSelector';

type WizardProps = {
  assetId: AssetId;
  onSubmit: (input: SimulatorInput) => void;
  onClose: () => void;
};

const CAPITAL_PRESETS = [1000, 2500, 5000, 10000, 25000, 50000];
const TRADES_PRESETS = [5, 10, 20, 50, 100];
const LOTS_PRESETS = [0.01, 0.05, 0.1, 0.5, 1, 2, 5];

export function Wizard({ assetId, onSubmit, onClose }: WizardProps) {
  const needsPair = assetId === 'forex';
  const [step, setStep] = useState(1);
  const [pairSymbol, setPairSymbol] = useState<string | null>(null);
  const [capital, setCapital] = useState<number>(5000);
  const [tradesPerMonth, setTradesPerMonth] = useState<number>(20);
  const [lotSize, setLotSize] = useState<number>(0.1);

  const totalSteps = needsPair ? 4 : 3;
  const pairStep = needsPair ? 1 : 0;
  const capitalStep = needsPair ? 2 : 1;
  const tradesStep = needsPair ? 3 : 2;
  const lotsStep = needsPair ? 4 : 3;

  const canAdvance
    = (step === pairStep && !!pairSymbol)
      || (step === capitalStep && capital > 0)
      || (step === tradesStep && tradesPerMonth > 0)
      || (step === lotsStep && lotSize > 0);

  const handleNext = () => {
    if (!canAdvance) {
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit({
        assetId,
        pairSymbol: pairSymbol ?? undefined,
        capital,
        tradesPerMonth,
        lotSize,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const assetLabels: Record<AssetId, string> = {
    forex: 'Forex',
    indices: 'Indici',
    equities: 'Azioni',
    commodities: 'Commodities',
    crypto: 'Crypto',
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <button
          onClick={step === 1 ? onClose : handleBack}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="size-5 text-slate-400" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {assetLabels[assetId]}
          </span>
          <span className="text-xs text-slate-500">
            Step
{' '}
{step}
{' '}
di
{' '}
{totalSteps}
          </span>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <span className="sr-only">Chiudi</span>
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

      {/* Progress */}
      <div className="flex gap-1 px-4 py-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < step ? 'bg-emerald-500' : 'bg-slate-700',
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {step === pairStep && needsPair && (
            <motion.div
              key="step-pair"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-3">
                  <LineChart className="size-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Quale coppia vuoi simulare?
                </h2>
                <p className="text-sm text-slate-400">
                  Seleziona la coppia forex su cui operare
                </p>
              </div>

              <PairSelector value={pairSymbol} onSelect={setPairSymbol} />
            </motion.div>
          )}

          {step === capitalStep && (
            <motion.div
              key="step-capital"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-3">
                  <Wallet className="size-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Quanto vuoi investire?
                </h2>
                <p className="text-sm text-slate-400">
                  Il capitale determina la tua capacità di trading
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <Euro className="size-5 text-slate-400" />
                  <input
                    type="number"
                    value={capital}
                    onChange={e => setCapital(Number(e.target.value))}
                    className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
                    min={100}
                    step={100}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {CAPITAL_PRESETS.map(preset => (
                    <button
                      key={preset}
                      onClick={() => setCapital(preset)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        capital === preset
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
                      )}
                    >
                      €
{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === tradesStep && (
            <motion.div
              key="step-trades"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-blue-500/10 p-3">
                  <TrendingUp className="size-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Quanti trade al mese?
                </h2>
                <p className="text-sm text-slate-400">
                  La frequenza influisce sui costi totali
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <Hash className="size-5 text-slate-400" />
                  <input
                    type="number"
                    value={tradesPerMonth}
                    onChange={e => setTradesPerMonth(Number(e.target.value))}
                    className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
                    min={1}
                    max={500}
                  />
                  <span className="text-sm text-slate-400">trade/mese</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {TRADES_PRESETS.map(preset => (
                    <button
                      key={preset}
                      onClick={() => setTradesPerMonth(preset)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        tradesPerMonth === preset
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === lotsStep && (
            <motion.div
              key="step-lots"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-violet-500/10 p-3">
                  <Gauge className="size-6 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Dimensione posizione?
                </h2>
                <p className="text-sm text-slate-400">
                  I lotti determinano l&apos;esposizione
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-medium text-slate-400">Lots</span>
                  <input
                    type="number"
                    value={lotSize}
                    onChange={e => setLotSize(Number(e.target.value))}
                    className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
                    min={0.01}
                    step={0.01}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {LOTS_PRESETS.map(preset => (
                    <button
                      key={preset}
                      onClick={() => setLotSize(preset)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        lotSize === preset
                          ? 'bg-violet-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-4">
                <h3 className="mb-3 text-sm font-medium text-emerald-400">
                  Riepilogo
                </h3>
                <div className="space-y-2 text-sm">
                  {pairSymbol && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Coppia</span>
                      <span className="font-mono font-medium text-white">
                        {pairSymbol}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Capitale</span>
                    <span className="font-medium text-white">
                      €
{capital.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trade/mese</span>
                    <span className="font-medium text-white">
                      {tradesPerMonth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensione</span>
                    <span className="font-medium text-white">
                      {lotSize}
{' '}
lots
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 font-semibold text-white transition-all hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-emerald-500 disabled:hover:to-teal-500"
        >
          {step === totalSteps ? (
            <>
              <Check className="size-5" />
              Calcola Risultati
            </>
          ) : (
            <>
              Continua
              <ArrowRight className="size-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
