'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  BarChart3,
  Coins,
  Building2,
  Zap,
  TrendingUp,
  Activity,
  Clock,
  Calendar,
  CalendarDays,
  Mountain,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';

// ---------------------------------------------------------------------------
// 1. DATA DOMAIN
// ---------------------------------------------------------------------------

const ASSETS = [
  { id: 'forex',    label: 'Forex',   icon: Globe,      desc: 'Major & Minor Pairs' },
  { id: 'indices',  label: 'Indici',  icon: BarChart3,  desc: 'Equity Indices' },
  { id: 'crypto',   label: 'Crypto',  icon: Coins,      desc: 'Digital Assets' },
  { id: 'equities', label: 'Azioni',  icon: Building2,  desc: 'Cash & CFD' },
] as const;

const STRATEGIES = [
  { id: 'momentum',       label: 'Momentum',       icon: TrendingUp, desc: 'Trend Following' },
  { id: 'breakout',       label: 'Breakout',        icon: Zap,        desc: 'Level Expansion' },
  { id: 'mean_reversion', label: 'Mean Reversion',  icon: Activity,   desc: 'Range Bound' },
] as const;

const HORIZONS = [
  { id: 'scalping',  label: 'Scalping',  icon: Clock,        desc: 'Minuti / Ore' },
  { id: 'intraday',  label: 'Intraday',  icon: Calendar,     desc: 'Chiusura in giornata' },
  { id: 'multiday',  label: 'Multiday',  icon: CalendarDays, desc: 'Da 2 a 5 giorni' },
  { id: 'position',  label: 'Position',  icon: Mountain,     desc: 'Settimane / Mesi' },
] as const;

// ---------------------------------------------------------------------------
// 2. TYPES
// ---------------------------------------------------------------------------

type SimulatorState = {
  asset?: string;
  strategy?: string;
  horizon?: string;
};

// ---------------------------------------------------------------------------
// 3. ANIMATION CONFIG
// ---------------------------------------------------------------------------

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const fade = {
  initial:  { opacity: 0, y: 20, scale: 0.98 },
  animate:  { opacity: 1, y: 0,  scale: 1 },
  exit:     { opacity: 0, y: -20, scale: 0.98, position: 'absolute' as const },
};

// ---------------------------------------------------------------------------
// 4. MAIN COMPONENT
// ---------------------------------------------------------------------------

export function InteractiveSimulator() {
  const [step, setStep]             = useState<number>(0);
  const [selections, setSelections] = useState<SimulatorState>({});

  const handleSelect = (key: keyof SimulatorState, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
    if (key === 'asset')    setStep(1);
    if (key === 'strategy') setStep(2);
    if (key === 'horizon')  setStep(3);
  };

  const navigateToStep = (target: number) => {
    if (target < step) setStep(target);
  };

  const PROMPTS = [
    'Cosa tradi principalmente?',
    'Qual è il tuo approccio?',
    'Che orizzonte temporale usi?',
    'Calcolo efficienza in corso…',
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[420px] flex flex-col items-center justify-center p-4">

      {/* Dynamic header */}
      <div className="mb-10 text-center h-16">
        <AnimatePresence mode="wait">
          <motion.h2
            key={step}
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={spring}
            className="text-3xl font-light tracking-tight text-foreground sm:text-4xl"
          >
            {PROMPTS[step]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* FSM content area */}
      <div className="w-full relative">
        <AnimatePresence mode="wait">

          {step === 0 && (
            <motion.div
              key="step-0"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
            >
              {ASSETS.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelect('asset', item.id)}
                />
              ))}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto"
            >
              {STRATEGIES.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelect('strategy', item.id)}
                />
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
            >
              {HORIZONS.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelect('horizon', item.id)}
                />
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="w-full flex flex-col items-center justify-center py-16"
            >
              <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6" />
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Calcolo attrito costi · {selections.asset} · {selections.strategy} · {selections.horizon}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Breadcrumb trail */}
      {step > 0 && step < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 flex items-center gap-2 flex-wrap justify-center"
        >
          {selections.asset && (
            <button
              onClick={() => navigateToStep(0)}
              className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
            >
              {selections.asset}
            </button>
          )}
          {step > 1 && <span className="text-muted-foreground/30">/</span>}
          {selections.strategy && (
            <button
              onClick={() => navigateToStep(1)}
              className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
            >
              {selections.strategy}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. OPTION CARD
// ---------------------------------------------------------------------------

function OptionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all duration-300 ease-out',
        'bg-card text-card-foreground border border-border rounded-2xl',
        'hover:border-primary hover:shadow-lg hover:-translate-y-1 hover:bg-accent/50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <div className="mb-4 p-3 rounded-xl bg-secondary/50 text-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-300">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-medium tracking-tight mb-1">{title}</h3>
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{description}</p>
    </button>
  );
}
