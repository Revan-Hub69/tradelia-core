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
  ArrowRight,
  RotateCcw,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
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
// 2. COST ENGINE (deterministic estimates)
// ---------------------------------------------------------------------------

type AssetId    = typeof ASSETS[number]['id'];
type StrategyId = typeof STRATEGIES[number]['id'];
type HorizonId  = typeof HORIZONS[number]['id'];

type SimResult = {
  spreadBps:   number;  // basis points
  swapPerDay:  number;  // bps per overnight
  platformFee: number;  // % of notional
  totalDrag:   number;  // total drag per round-trip in bps
  rating:      'low' | 'medium' | 'high';
  primaryIssue: string;
  suggestion:  string;
};

const COST_TABLE: Record<AssetId, Record<StrategyId, Record<HorizonId, SimResult>>> = {
  forex: {
    momentum: {
      scalping:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.01, totalDrag: 5,  rating: 'low',    primaryIssue: 'Spread bid/ask ripetuto', suggestion: 'Cerca broker ECN con spread < 0.5 pip' },
      intraday:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.01, totalDrag: 4,  rating: 'low',    primaryIssue: 'Spread nella fase news', suggestion: 'Evita aperture in orari illiquidi' },
      multiday:  { spreadBps: 2,  swapPerDay: 1.2, platformFee: 0.01, totalDrag: 12, rating: 'medium', primaryIssue: 'Swap overnight accumula', suggestion: 'Considera futures su valute per multiday' },
      position:  { spreadBps: 2,  swapPerDay: 1.2, platformFee: 0.01, totalDrag: 38, rating: 'high',   primaryIssue: 'Swap mangia i profitti', suggestion: 'Futures o ETC valutari per position trading' },
    },
    breakout: {
      scalping:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.01, totalDrag: 6,  rating: 'low',    primaryIssue: 'Slippage in breakout reale', suggestion: 'Controlla lo slippage del broker in volatilità' },
      intraday:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.01, totalDrag: 4,  rating: 'low',    primaryIssue: 'Falsi breakout aumentano i trade', suggestion: 'Filtra breakout con volume' },
      multiday:  { spreadBps: 2,  swapPerDay: 1.2, platformFee: 0.01, totalDrag: 14, rating: 'medium', primaryIssue: 'Swap su posizioni overnight', suggestion: 'Rollover costi su futures' },
      position:  { spreadBps: 2,  swapPerDay: 1.2, platformFee: 0.01, totalDrag: 42, rating: 'high',   primaryIssue: 'Swap settimanale distrugge edge', suggestion: 'Futures su cambi — nessun swap' },
    },
    mean_reversion: {
      scalping:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.01, totalDrag: 7,  rating: 'medium', primaryIssue: 'Alta frequenza moltiplica spread', suggestion: 'Ridurre frequenza o usare conto PRO' },
      intraday:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.01, totalDrag: 5,  rating: 'low',    primaryIssue: 'Range trading efficiente', suggestion: 'Verifica spread nelle ore asiatiche' },
      multiday:  { spreadBps: 2,  swapPerDay: 1.2, platformFee: 0.01, totalDrag: 15, rating: 'medium', primaryIssue: 'Swap dannoso su mean reversion lento', suggestion: 'Usa orizzonte intraday per mean reversion' },
      position:  { spreadBps: 2,  swapPerDay: 1.2, platformFee: 0.01, totalDrag: 40, rating: 'high',   primaryIssue: 'Swap + drawdown esteso = perdita certa', suggestion: 'Mean reversion non si sposa con position holding' },
    },
  },
  indices: {
    momentum: {
      scalping:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 7,  rating: 'medium', primaryIssue: 'CFD spread ampliati in volatilità', suggestion: 'Usa futures E-mini per scalping indici' },
      intraday:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 6,  rating: 'low',    primaryIssue: 'Spread CFD variabile', suggestion: 'Confronta CFD vs futures su costi totali' },
      multiday:  { spreadBps: 3,  swapPerDay: 1.5, platformFee: 0.02, totalDrag: 18, rating: 'medium', primaryIssue: 'Financing charge CFD overnight', suggestion: 'Futures sugli indici eliminano il financing' },
      position:  { spreadBps: 3,  swapPerDay: 1.5, platformFee: 0.02, totalDrag: 50, rating: 'high',   primaryIssue: 'CFD financing distrugge position trades', suggestion: 'ETF a leva o futures per esposizione lunga' },
    },
    breakout: {
      scalping:  { spreadBps: 4,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 9,  rating: 'medium', primaryIssue: 'Spread alto + slippage breakout', suggestion: 'Futures micro per breakout su indici' },
      intraday:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 7,  rating: 'medium', primaryIssue: 'Falsi breakout su indici comuni', suggestion: 'Filtra con volumi futures, non CFD' },
      multiday:  { spreadBps: 3,  swapPerDay: 1.5, platformFee: 0.02, totalDrag: 20, rating: 'high',   primaryIssue: 'Financing overnight elevato', suggestion: 'Futures rolling mensilmente' },
      position:  { spreadBps: 3,  swapPerDay: 1.5, platformFee: 0.02, totalDrag: 55, rating: 'high',   primaryIssue: 'Financing CFD > rendimento atteso', suggestion: 'ETF o futures per investimento direzionale' },
    },
    mean_reversion: {
      scalping:  { spreadBps: 4,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 9,  rating: 'medium', primaryIssue: 'Indici tendono — mean rev rischiosa', suggestion: 'Verifica regime di mercato prima di operare' },
      intraday:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 6,  rating: 'low',    primaryIssue: 'Range intraday abbastanza predicibile', suggestion: 'Orari migliori: open europeo e open USA' },
      multiday:  { spreadBps: 3,  swapPerDay: 1.5, platformFee: 0.02, totalDrag: 19, rating: 'medium', primaryIssue: 'Trend può sovrastare mean reversion', suggestion: 'Usa filtro di trend prima di entrare' },
      position:  { spreadBps: 3,  swapPerDay: 1.5, platformFee: 0.02, totalDrag: 48, rating: 'high',   primaryIssue: 'Holding lungo + mean rev = mal mix', suggestion: 'Strategia inadatta a position trading su indici' },
    },
  },
  crypto: {
    momentum: {
      scalping:  { spreadBps: 8,  swapPerDay: 0,   platformFee: 0.04, totalDrag: 20, rating: 'high',   primaryIssue: 'Spread + fee taker molto elevati', suggestion: 'Usa maker orders su exchange fee 0 (MEXC, Bybit)' },
      intraday:  { spreadBps: 6,  swapPerDay: 0,   platformFee: 0.04, totalDrag: 16, rating: 'medium', primaryIssue: 'Fee taker + spread variabile', suggestion: 'Maker-only strategy o exchange con rebate' },
      multiday:  { spreadBps: 6,  swapPerDay: 2.0, platformFee: 0.04, totalDrag: 28, rating: 'high',   primaryIssue: 'Funding rate perpetual spesso negativo', suggestion: 'Monitora funding ogni 8h, chiudi se > 0.1%' },
      position:  { spreadBps: 6,  swapPerDay: 2.0, platformFee: 0.04, totalDrag: 70, rating: 'high',   primaryIssue: 'Funding rate distrugge leva su position', suggestion: 'Spot o delta-neutral per holding lungo' },
    },
    breakout: {
      scalping:  { spreadBps: 10, swapPerDay: 0,   platformFee: 0.04, totalDrag: 25, rating: 'high',   primaryIssue: 'Breakout falsi + spread altissimo', suggestion: 'Filtra breakout con OI e volume on-chain' },
      intraday:  { spreadBps: 7,  swapPerDay: 0,   platformFee: 0.04, totalDrag: 18, rating: 'medium', primaryIssue: 'Fee taker + liquidazioni casuali', suggestion: 'Stop loss fisico e size contenuta' },
      multiday:  { spreadBps: 6,  swapPerDay: 2.0, platformFee: 0.04, totalDrag: 30, rating: 'high',   primaryIssue: 'Funding + volatilità = ampia incertezza', suggestion: 'Usa spot BTC/ETH per breakout strutturale' },
      position:  { spreadBps: 6,  swapPerDay: 2.0, platformFee: 0.04, totalDrag: 75, rating: 'high',   primaryIssue: 'Funding distrugge ogni edge su leva', suggestion: 'Spot only per breakout di lungo periodo' },
    },
    mean_reversion: {
      scalping:  { spreadBps: 8,  swapPerDay: 0,   platformFee: 0.04, totalDrag: 22, rating: 'high',   primaryIssue: 'Crypto non è mean-reverting su scalping', suggestion: 'Mean rev su crypto funziona solo su timeframe H4+' },
      intraday:  { spreadBps: 6,  swapPerDay: 0,   platformFee: 0.04, totalDrag: 16, rating: 'medium', primaryIssue: 'Range intraday instabile in crypto', suggestion: 'Usa bande di volatilità storica per range' },
      multiday:  { spreadBps: 6,  swapPerDay: 2.0, platformFee: 0.04, totalDrag: 28, rating: 'high',   primaryIssue: 'Funding rate + drawdown esteso', suggestion: 'Preferisci spot + DCA per mean reversion lenta' },
      position:  { spreadBps: 6,  swapPerDay: 2.0, platformFee: 0.04, totalDrag: 72, rating: 'high',   primaryIssue: 'Impossibile fare mean rev con funding a leva', suggestion: 'Spot accumulation, nessuna leva' },
    },
  },
  equities: {
    momentum: {
      scalping:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.03, totalDrag: 8,  rating: 'medium', primaryIssue: 'Commissioni per trade + spread', suggestion: 'Broker zero-commission o piattaforma DMA' },
      intraday:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 5,  rating: 'low',    primaryIssue: 'Spread bid/ask su liquidità bassa', suggestion: 'Opera solo su titoli con alto volume medio' },
      multiday:  { spreadBps: 2,  swapPerDay: 1.0, platformFee: 0.02, totalDrag: 12, rating: 'medium', primaryIssue: 'CFD overnight charge elevato', suggestion: 'Azioni cash per multiday, non CFD' },
      position:  { spreadBps: 2,  swapPerDay: 1.0, platformFee: 0.02, totalDrag: 36, rating: 'high',   primaryIssue: 'CFD financing annulla dividendi', suggestion: 'Compra titoli cash, non CFD a leva' },
    },
    breakout: {
      scalping:  { spreadBps: 4,  swapPerDay: 0,   platformFee: 0.03, totalDrag: 10, rating: 'medium', primaryIssue: 'Slippage in breakout pre-market', suggestion: 'Usa ordini limit in prossimità del breakout level' },
      intraday:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 6,  rating: 'low',    primaryIssue: 'Breakout durante earning season', suggestion: 'Attenzione a date di bilancio' },
      multiday:  { spreadBps: 2,  swapPerDay: 1.0, platformFee: 0.02, totalDrag: 14, rating: 'medium', primaryIssue: 'Gap overnight cancella breakout', suggestion: 'Stop garantito o posizione ridotta' },
      position:  { spreadBps: 2,  swapPerDay: 1.0, platformFee: 0.02, totalDrag: 38, rating: 'high',   primaryIssue: 'CFD cost + gap risk su position', suggestion: 'ETF tematici per exposure direzionale' },
    },
    mean_reversion: {
      scalping:  { spreadBps: 3,  swapPerDay: 0,   platformFee: 0.03, totalDrag: 8,  rating: 'medium', primaryIssue: 'Commissioni riducono profitto per trade', suggestion: 'Target per trade almeno 3× lo spread' },
      intraday:  { spreadBps: 2,  swapPerDay: 0,   platformFee: 0.02, totalDrag: 5,  rating: 'low',    primaryIssue: 'Mean rev solida su blue chip liquide', suggestion: 'VWAP e open-range come riferimento range' },
      multiday:  { spreadBps: 2,  swapPerDay: 1.0, platformFee: 0.02, totalDrag: 13, rating: 'medium', primaryIssue: 'Notizie societarie rompono il range', suggestion: 'Filtra per assenza di catalyst prima di entrare' },
      position:  { spreadBps: 2,  swapPerDay: 1.0, platformFee: 0.02, totalDrag: 35, rating: 'high',   primaryIssue: 'Mean rev long-term su azioni = alto rischio', suggestion: 'Value investing, non mean reversion a leva' },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. TYPES
// ---------------------------------------------------------------------------

type SimulatorState = {
  asset?:    AssetId;
  strategy?: StrategyId;
  horizon?:  HorizonId;
};

// ---------------------------------------------------------------------------
// 4. ANIMATION CONFIG
// ---------------------------------------------------------------------------

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const fade = {
  initial:  { opacity: 0, y: 16, scale: 0.99 },
  animate:  { opacity: 1, y: 0,  scale: 1 },
  exit:     { opacity: 0, y: -12, scale: 0.99, position: 'absolute' as const },
};

// ---------------------------------------------------------------------------
// 5. MAIN COMPONENT
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

  const reset = () => {
    setSelections({});
    setStep(0);
  };

  const result: SimResult | null =
    step === 3 && selections.asset && selections.strategy && selections.horizon
      ? COST_TABLE[selections.asset][selections.strategy][selections.horizon]
      : null;

  const PROMPTS = [
    'Cosa tradi principalmente?',
    'Qual è il tuo approccio?',
    'Che orizzonte temporale usi?',
    null,
  ];

  const ratingConfig = {
    low:    { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Attrito basso' },
    medium: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20',    label: 'Attrito moderato' },
    high:   { icon: TrendingDown,  color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',         label: 'Attrito elevato' },
  };

  return (
    <div className="relative w-full flex flex-col p-5 sm:p-6 xl:p-7">

      {/* Progress dots */}
      <div className="mb-6 flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <button
            key={i}
            onClick={() => navigateToStep(i)}
            disabled={i >= step}
            aria-label={`Torna allo step ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i < step
                ? 'w-8 bg-primary cursor-pointer hover:bg-primary/80'
                : i === step
                  ? 'w-8 bg-primary/40'
                  : 'w-4 bg-border/50',
            )}
          />
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/40">
          {step < 3 ? `${step + 1} / 3` : 'Risultato'}
        </span>
      </div>

      {/* Dynamic prompt */}
      <div className="mb-5 h-10">
        <AnimatePresence mode="wait">
          {PROMPTS[step] && (
            <motion.p
              key={step}
              variants={fade}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={spring}
              className="text-base font-medium tracking-tight text-foreground sm:text-lg"
            >
              {PROMPTS[step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Step content */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">

          {step === 0 && (
            <motion.div
              key="step-0"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-2 gap-3 w-full"
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
              className="grid grid-cols-3 gap-3 w-full"
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
              className="grid grid-cols-2 gap-3 w-full"
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

          {step === 3 && result && (
            <motion.div
              key="step-3"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="w-full space-y-4"
            >
              {/* Rating badge */}
              <div className={cn('flex items-center gap-3 rounded-2xl border px-4 py-3', ratingConfig[result.rating].bg)}>
                {(() => {
                  const Icon = ratingConfig[result.rating].icon;
                  return <Icon className={cn('size-5 shrink-0', ratingConfig[result.rating].color)} />;
                })()}
                <div>
                  <p className={cn('font-mono text-[11px] font-semibold uppercase tracking-[0.18em]', ratingConfig[result.rating].color)}>
                    {ratingConfig[result.rating].label}
                  </p>
                  <p className="text-xs text-muted-foreground/70">{result.primaryIssue}</p>
                </div>
                <span className={cn('ml-auto font-mono text-xl font-bold', ratingConfig[result.rating].color)}>
                  {result.totalDrag} bps
                </span>
              </div>

              {/* Cost breakdown */}
              <div className="grid grid-cols-3 gap-2">
                <CostStat label="Spread" value={`${result.spreadBps} bps`} />
                <CostStat label="Swap/giorno" value={result.swapPerDay > 0 ? `${result.swapPerDay} bps` : '—'} />
                <CostStat label="Platform fee" value={`${result.platformFee}%`} />
              </div>

              {/* Suggestion */}
              <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Cosa fare: </span>
                  {result.suggestion}
                </p>
              </div>

              {/* Selections recap */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {[selections.asset, selections.strategy, selections.horizon].map((s) => s && (
                    <span key={s} className="rounded-full border border-border/50 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="size-3" />
                  Ricomincia
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Breadcrumb trail */}
      {step > 0 && step < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 flex items-center gap-2 flex-wrap"
        >
          {selections.asset && (
            <button
              onClick={() => navigateToStep(0)}
              className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
            >
              {selections.asset}
            </button>
          )}
          {step > 1 && <span className="text-muted-foreground/30 text-xs">/</span>}
          {selections.strategy && (
            <button
              onClick={() => navigateToStep(1)}
              className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
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
// 6. SUB-COMPONENTS
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
        'group relative flex flex-col items-start justify-between p-4 sm:p-5 text-left transition-all duration-200',
        'bg-background/60 text-card-foreground border border-border/50 rounded-2xl',
        'hover:border-primary/60 hover:bg-accent/30 hover:shadow-md hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <Icon className="mb-3 size-5 stroke-[1.5] text-muted-foreground group-hover:text-primary transition-colors duration-200" />
      <div>
        <p className="text-sm font-medium leading-5 text-foreground">{title}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

function CostStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/60 px-3 py-3 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">{value}</p>
    </div>
  );
}
