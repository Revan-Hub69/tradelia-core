'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  BarChart3,
  Coins,
  Building2,
  Zap,
  TrendingUp,
  Layers,
  Wheat,
  Clock,
  Calendar,
  CalendarDays,
  ArrowRight,
  RotateCcw,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';

// ---------------------------------------------------------------------------
// 1. DATA DOMAIN
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'forex',       label: 'Forex',       icon: Globe,     desc: 'Major, Cross & Esotico'  },
  { id: 'indices',     label: 'Indici',      icon: BarChart3, desc: 'US, EU & Asia'            },
  { id: 'equities',    label: 'Azioni',      icon: Building2, desc: 'US, EU & Asia Large Cap'  },
  { id: 'commodities', label: 'Commodity',   icon: Wheat,     desc: 'Metalli & Energia'        },
  { id: 'etf',         label: 'ETF',         icon: Layers,    desc: 'US, UCITS & Leveraged'    },
  { id: 'crypto',      label: 'Crypto',      icon: Coins,     desc: 'Major & Altcoin'          },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

const UNDERLYING_GROUPS = [
  // forex (3)
  { id: 'ug_fx_core',          categoryId: 'forex'       as CategoryId, label: 'Major',            desc: 'EUR/USD, GBP/USD, USD/JPY...'  },
  { id: 'ug_fx_cross',         categoryId: 'forex'       as CategoryId, label: 'Cross',             desc: 'EUR/GBP, AUD/JPY, GBP/CHF...'  },
  { id: 'ug_fx_exotic',        categoryId: 'forex'       as CategoryId, label: 'Esotico',           desc: 'USD/TRY, USD/ZAR, USD/MXN...'  },
  // indices (3)
  { id: 'ug_index_us',         categoryId: 'indices'     as CategoryId, label: 'US',                desc: 'S&P500, NQ100, DJIA...'         },
  { id: 'ug_index_eu',         categoryId: 'indices'     as CategoryId, label: 'EU',                desc: 'DAX, CAC40, FTSE MIB...'        },
  { id: 'ug_index_asia',       categoryId: 'indices'     as CategoryId, label: 'Asia',              desc: 'Nikkei, Hang Seng, ASX...'      },
  // equities (4)
  { id: 'ug_equity_us_large',  categoryId: 'equities'    as CategoryId, label: 'US Large Cap',      desc: 'AAPL, MSFT, NVDA, SPY...'       },
  { id: 'ug_equity_us_mid',    categoryId: 'equities'    as CategoryId, label: 'US Mid Cap',        desc: 'S&P 400, MDY, titoli $1-10B...' },
  { id: 'ug_equity_eu_large',  categoryId: 'equities'    as CategoryId, label: 'EU Large Cap',      desc: 'SAP, ASML, Nestle, BNP...'      },
  { id: 'ug_equity_asia',      categoryId: 'equities'    as CategoryId, label: 'Asia Large Cap',    desc: 'Toyota, Samsung, Alibaba...'    },
  // commodities (2)
  { id: 'ug_commodity_metal',  categoryId: 'commodities' as CategoryId, label: 'Metalli',           desc: 'Gold, Silver, Platinum...'      },
  { id: 'ug_commodity_energy', categoryId: 'commodities' as CategoryId, label: 'Energia',           desc: 'WTI, Brent, Nat Gas...'         },
  // etf (3)
  { id: 'ug_etf_us_broad',     categoryId: 'etf'         as CategoryId, label: 'US Broad Market',   desc: 'SPY, QQQ, IWM...'               },
  { id: 'ug_etf_us_leveraged', categoryId: 'etf'         as CategoryId, label: 'Leveraged 2x/3x',   desc: 'TQQQ, SOXL, UPRO...'           },
  { id: 'ug_etf_ucits',        categoryId: 'etf'         as CategoryId, label: 'UCITS Europa',      desc: 'iShares, Amundi, Xtrackers...'  },
  // crypto (2)
  { id: 'ug_crypto_major',     categoryId: 'crypto'      as CategoryId, label: 'Major',             desc: 'BTC, ETH, SOL...'               },
  { id: 'ug_crypto_altcoin',   categoryId: 'crypto'      as CategoryId, label: 'Altcoin',           desc: 'Tutto il resto -- high beta'    },
] as const;

type UnderlyingGroupId = typeof UNDERLYING_GROUPS[number]['id'];

const HORIZONS = [
  { id: 'scalping',  label: 'Scalping',  icon: Clock,        desc: 'Minuti / Ore'         },
  { id: 'intraday',  label: 'Intraday',  icon: Calendar,     desc: 'Chiusura in giornata' },
  { id: 'multiday',  label: 'Multiday',  icon: CalendarDays, desc: 'Da 2 a 5 giorni'      },
] as const;

type HorizonId = typeof HORIZONS[number]['id'];

const STYLES = [
  { id: 'selective', label: 'Selettivo',       icon: Target,     desc: 'Pochi setup, alta qualita',       freq: 2  },
  { id: 'active',    label: 'Attivo',           icon: TrendingUp, desc: 'Setup multipli, segue momentum', freq: 7  },
  { id: 'high_freq', label: 'Alta frequenza',   icon: Zap,        desc: 'Scalping continuo',               freq: 20 },
] as const;

type StyleId = typeof STYLES[number]['id'];

// ---------------------------------------------------------------------------
// 2. COST MODEL
// ---------------------------------------------------------------------------

type SimResult = {
  spreadBps:    number;
  swapPerDay:   number;
  platformFee:  number;
  totalDrag:    number;
  rating:       'low' | 'medium' | 'high';
  primaryIssue: string;
  suggestion:   string;
};

const HORIZON_PARAMS: Record<HorizonId, { holdingDays: number; holdingFactor: number }> = {
  scalping: { holdingDays: 0.02, holdingFactor: 0.1 },
  intraday: { holdingDays: 0.3,  holdingFactor: 0.4 },
  multiday: { holdingDays: 3.5,  holdingFactor: 1.0 },
};

type UgTexts = Record<HorizonId, { primaryIssue: string; suggestion: string }>;

type UgParams = {
  spread:        number;
  swapPerDay:    number;
  platformFee:   number;
  thresholdLow:  number;
  thresholdHigh: number;
  texts:         UgTexts;
};

const UG_PARAMS: Record<UnderlyingGroupId, UgParams> = {
  ug_fx_core: {
    spread: 2, swapPerDay: 1.2, platformFee: 0.01, thresholdLow: 15, thresholdHigh: 40,
    texts: {
      scalping: { primaryIssue: 'Spread bid/ask ripetuto ad alta frequenza', suggestion: 'Broker ECN spread < 0.5 pip, evita orari illiquidi' },
      intraday: { primaryIssue: 'Spread ampliato nelle ore news macro',       suggestion: 'Evita aperture 30min prima di dati CPI/NFP' },
      multiday: { primaryIssue: 'Swap overnight si accumula sui giorni',      suggestion: 'Considera futures su valute per multiday' },
    },
  },
  ug_fx_cross: {
    spread: 4, swapPerDay: 1.5, platformFee: 0.01, thresholdLow: 20, thresholdHigh: 50,
    texts: {
      scalping: { primaryIssue: 'Spread piu largo sui cross riduce edge',     suggestion: 'Usa ECN, evita cross illiquidi in scalping' },
      intraday: { primaryIssue: 'Spread variabile durante overlap London/NY', suggestion: 'Opera negli overlap London/NY per spread minimo' },
      multiday: { primaryIssue: 'Spread + swap si sommano sui giorni',        suggestion: 'CFD con swap contenuto o futures OTC' },
    },
  },
  ug_fx_exotic: {
    spread: 15, swapPerDay: 3.0, platformFee: 0.02, thresholdLow: 40, thresholdHigh: 70,
    texts: {
      scalping: { primaryIssue: 'Spread esotici estremi in scalping',         suggestion: 'Esotici inadatti a scalping -- usa swing' },
      intraday: { primaryIssue: 'Spread > 10 pip comune su esotici',          suggestion: 'Target solo su movimenti news macro rilevanti' },
      multiday: { primaryIssue: 'Spread + swap esotici molto alti',           suggestion: 'Position sizing molto ridotto, stop ampio' },
    },
  },
  ug_index_us: {
    spread: 3, swapPerDay: 1.5, platformFee: 0.02, thresholdLow: 20, thresholdHigh: 45,
    texts: {
      scalping: { primaryIssue: 'CFD spread ampliato in volatilita alta',     suggestion: 'Usa E-mini o Micro futures per scalping' },
      intraday: { primaryIssue: 'Falsi breakout comuni su open NYSE',         suggestion: 'Filtra con volumi futures, non solo CFD' },
      multiday: { primaryIssue: 'Financing charge CFD overnight elevato',     suggestion: 'Futures su indici eliminano il financing' },
    },
  },
  ug_index_eu: {
    spread: 4, swapPerDay: 1.5, platformFee: 0.02, thresholdLow: 22, thresholdHigh: 48,
    texts: {
      scalping: { primaryIssue: 'Spread CFD EU piu largo rispetto agli US',   suggestion: 'Futures micro DAX o CAC per scalping efficiente' },
      intraday: { primaryIssue: 'Spread variabile a open Londra',              suggestion: 'Opera nelle prime 2h di apertura EU' },
      multiday: { primaryIssue: 'Financing overnight CFD EU accumulato',       suggestion: 'Futures EU-listed con rollover pulito' },
    },
  },
  ug_index_asia: {
    spread: 5, swapPerDay: 2.0, platformFee: 0.02, thresholdLow: 25, thresholdHigh: 55,
    texts: {
      scalping: { primaryIssue: 'Sessioni asiatiche illiquide fuori orario',   suggestion: 'Spread molto ampio fuori orario EU/US' },
      intraday: { primaryIssue: 'Spread piu alto che su EU/US',                suggestion: 'Opera nelle 2h di open Tokyo o Hong Kong' },
      multiday: { primaryIssue: 'Financing + spread asiatico accumulato',      suggestion: 'ETF Nikkei/Hang Seng senza swap' },
    },
  },
  ug_equity_us_large: {
    spread: 2, swapPerDay: 1.0, platformFee: 0.02, thresholdLow: 15, thresholdHigh: 40,
    texts: {
      scalping: { primaryIssue: 'Commissioni per trade moltiplicano su scalp', suggestion: 'Broker zero-commission o DMA per ridurre drag' },
      intraday: { primaryIssue: 'Slippage su breakout pre-market e news',      suggestion: 'Opera solo su titoli volume > 5M/giorno' },
      multiday: { primaryIssue: 'CFD overnight charge + gap risk',             suggestion: 'Azioni cash per multiday, evita CFD a leva' },
    },
  },
  ug_equity_us_mid: {
    spread: 5, swapPerDay: 1.2, platformFee: 0.02, thresholdLow: 22, thresholdHigh: 48,
    texts: {
      scalping: { primaryIssue: 'Spread piu largo su mid cap in scalping',     suggestion: 'Opera solo su titoli volume > 1M/giorno' },
      intraday: { primaryIssue: 'Breakout valido solo con catalyst noto',       suggestion: 'Entra solo con earnings/news come trigger' },
      multiday: { primaryIssue: 'Gap overnight frequente su mid cap',           suggestion: 'Stop fisso obbligatorio, size ridotta' },
    },
  },
  ug_equity_eu_large: {
    spread: 3, swapPerDay: 1.2, platformFee: 0.02, thresholdLow: 20, thresholdHigh: 45,
    texts: {
      scalping: { primaryIssue: 'Spread EU leggermente piu largo degli US',    suggestion: 'DMA broker o CFD con spread fisso' },
      intraday: { primaryIssue: 'Liquidita alta su DE/NL large cap',            suggestion: 'Opera nelle prime 2h apertura Xetra' },
      multiday: { primaryIssue: 'CFD overnight charge EU accumulato',           suggestion: 'Cash equity per multiday, incassa dividendi' },
    },
  },
  ug_equity_asia: {
    spread: 6, swapPerDay: 2.0, platformFee: 0.03, thresholdLow: 28, thresholdHigh: 58,
    texts: {
      scalping: { primaryIssue: 'Spread asiatico ampio + sessioni ridotte',    suggestion: 'Opera solo durante orario Tokyo/HK' },
      intraday: { primaryIssue: 'Breakout segue catalyst locali PBOC/BOJ',     suggestion: 'Tokyo: 02:00-08:00 CET, HK: 03:30-09:00' },
      multiday: { primaryIssue: 'Overnight financing + gap valutario FX',      suggestion: 'ETF Nikkei/Hang Seng senza swap' },
    },
  },
  ug_commodity_metal: {
    spread: 3, swapPerDay: 1.0, platformFee: 0.02, thresholdLow: 18, thresholdHigh: 42,
    texts: {
      scalping: { primaryIssue: 'Spread Gold Spot ok, Silver piu volatile',    suggestion: 'Usa XAU/USD ECN per scalping metalli' },
      intraday: { primaryIssue: 'Spread variabile in overlap London-NY',        suggestion: 'Opera durante London-NY overlap' },
      multiday: { primaryIssue: 'Swap spot su metalli si accumula nei giorni',  suggestion: 'Futures COMEX per eliminare swap' },
    },
  },
  ug_commodity_energy: {
    spread: 8, swapPerDay: 2.0, platformFee: 0.03, thresholdLow: 30, thresholdHigh: 60,
    texts: {
      scalping: { primaryIssue: 'WTI spread ampio + slippage su EIA report',   suggestion: 'Futures CL (NYMEX) per scalping energia' },
      intraday: { primaryIssue: 'Spread variabile intorno a EIA/OPEC report',   suggestion: 'Non operare 30min prima/dopo report EIA' },
      multiday: { primaryIssue: 'Contango futures petrolio erode la leva',      suggestion: 'Futures rolling attento a contango' },
    },
  },
  ug_etf_us_broad: {
    spread: 1, swapPerDay: 0.5, platformFee: 0.01, thresholdLow: 10, thresholdHigh: 30,
    texts: {
      scalping: { primaryIssue: 'Spread ETF broad market minimo su SPY/QQQ',   suggestion: 'ETF US broad ideale per scalping leggero' },
      intraday: { primaryIssue: 'Liquidita massima, spread 0.01% su SPY',      suggestion: 'Volume massimo a open NYSE' },
      multiday: { primaryIssue: 'Solo expense ratio annuale 0.03-0.09%',       suggestion: 'ETF cash senza leva, multiday ideale' },
    },
  },
  ug_etf_us_leveraged: {
    spread: 3, swapPerDay: 3.0, platformFee: 0.02, thresholdLow: 20, thresholdHigh: 50,
    texts: {
      scalping: { primaryIssue: 'Spread ETF leva piu ampio del sottostante',   suggestion: 'Volumi ok su TQQQ/SOXL in orario US' },
      intraday: { primaryIssue: 'Volatility drag su ETF 3x si accumula',       suggestion: 'Tieni solo per sessione, non overnight' },
      multiday: { primaryIssue: 'Volatility decay distrugge ETF leva',         suggestion: 'ETF leva solo intraday -- mai overnight' },
    },
  },
  ug_etf_ucits: {
    spread: 4, swapPerDay: 0.3, platformFee: 0.02, thresholdLow: 18, thresholdHigh: 40,
    texts: {
      scalping: { primaryIssue: 'Spread UCITS piu alto degli ETF US',          suggestion: 'UCITS meno liquidi di SPY/QQQ' },
      intraday: { primaryIssue: 'Volume intraday UCITS limitato in EU',         suggestion: 'Opera nelle ore peak di Borsa Italiana/Xetra' },
      multiday: { primaryIssue: 'Expense ratio UCITS 0.07-0.3% annuo',         suggestion: 'ETF UCITS cash, multiday efficiente in EUR' },
    },
  },
  ug_crypto_major: {
    spread: 6, swapPerDay: 2.0, platformFee: 0.04, thresholdLow: 25, thresholdHigh: 55,
    texts: {
      scalping: { primaryIssue: 'Fee taker + spread molto elevati su crypto',   suggestion: 'Maker orders su MEXC/Bybit per fee zero' },
      intraday: { primaryIssue: 'Fee taker + spread variabile e liquidazioni',   suggestion: 'Maker-only strategy o exchange con rebate' },
      multiday: { primaryIssue: 'Funding rate perpetual ogni 8h si accumula',   suggestion: 'Monitora funding ogni 8h, chiudi se > 0.1%' },
    },
  },
  ug_crypto_altcoin: {
    spread: 18, swapPerDay: 3.0, platformFee: 0.06, thresholdLow: 45, thresholdHigh: 80,
    texts: {
      scalping: { primaryIssue: 'Spread altcoin estremo + fee alta su scalp',   suggestion: 'Altcoin incompatibili con scalping' },
      intraday: { primaryIssue: 'Liquidita bassa, slippage enorme su altcoin',  suggestion: 'Solo altcoin top-20 per intraday' },
      multiday: { primaryIssue: 'Funding + spread + liquidita bassa accumulati', suggestion: 'Size tiny, stop molto largo, spot only' },
    },
  },
};

function computeDrag(
  ugId: UnderlyingGroupId,
  horizonId: HorizonId,
  styleFreq: number,
): SimResult {
  const { spread, swapPerDay, platformFee, thresholdLow, thresholdHigh, texts } = UG_PARAMS[ugId];
  const { holdingDays, holdingFactor } = HORIZON_PARAMS[horizonId];

  const spreadDrag = spread * styleFreq * holdingFactor;
  const swapDrag   = swapPerDay * holdingDays;
  const totalDrag  = Math.round(spreadDrag + swapDrag + platformFee * 100);
  const rating     = totalDrag <= thresholdLow ? 'low' : totalDrag >= thresholdHigh ? 'high' : 'medium';
  const { primaryIssue, suggestion } = texts[horizonId];

  return { spreadBps: spread, swapPerDay, platformFee, totalDrag, rating, primaryIssue, suggestion };
}

// ---------------------------------------------------------------------------
// 3. STATE TYPES & ANIMATION
// ---------------------------------------------------------------------------

type SimulatorState = {
  category?: CategoryId;
  ugId?:     UnderlyingGroupId;
  horizon?:  HorizonId;
  style?:    StyleId;
};

// Step 'computing' is the transient loader phase between step 3 and step 4
type StepValue = 0 | 1 | 2 | 3 | 'computing' | 4;

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const fade = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -12, scale: 0.99, position: 'absolute' as const },
};

// ---------------------------------------------------------------------------
// 3b. COMPUTING LOADER COMPONENT
// ---------------------------------------------------------------------------

const COMPUTE_PHASES = [
  'Lettura parametri',
  'Calcolo attrito',
  'Elaborazione risultato',
] as const;

// Total duration: 900ms split across 3 phases (~300ms each)
const PHASE_DURATION = 300;

function ComputingLoader() {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    if (phase >= COMPUTE_PHASES.length - 1) return;
    const t = setTimeout(() => setPhase(p => p + 1), PHASE_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <motion.div
      key="step-computing"
      variants={fade}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={spring}
      className="w-full flex flex-col gap-5 py-2"
    >
      {/* Segmented track */}
      <div className="flex gap-1.5 w-full">
        {COMPUTE_PHASES.map((_, i) => (
          <div
            key={i}
            className="relative flex-1 h-[3px] rounded-full overflow-hidden bg-border/40"
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: i <= phase ? '100%' : '0%' }}
              transition={
                i === phase
                  ? { duration: PHASE_DURATION / 1000, ease: [0.16, 1, 0.3, 1] }
                  : i < phase
                  ? { duration: 0 }
                  : { duration: 0 }
              }
            />
          </div>
        ))}
      </div>

      {/* Phase label */}
      <div className="h-5 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 text-center absolute inset-x-0"
          >
            {COMPUTE_PHASES[phase]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Skeleton preview — mirrors the result layout, fades out as phase advances */}
      <motion.div
        className="space-y-3"
        animate={{ opacity: phase === 0 ? 0.35 : phase === 1 ? 0.6 : 0.85 }}
        transition={{ duration: 0.25 }}
      >
        {/* Rating badge skeleton */}
        <div className="h-[58px] rounded-2xl bg-muted/40 animate-pulse" />
        {/* Cost stats skeleton */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[58px] rounded-2xl bg-muted/30 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        {/* Suggestion skeleton */}
        <div className="h-[52px] rounded-2xl bg-muted/25 animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 4. MAIN COMPONENT
// ---------------------------------------------------------------------------

export function InteractiveSimulator() {
  const [step, setStep]             = useState<StepValue>(0);
  const [selections, setSelections] = useState<SimulatorState>({});
  const computeTimerRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (computeTimerRef.current) clearTimeout(computeTimerRef.current);
    };
  }, []);

  const filteredUGs = selections.category
    ? UNDERLYING_GROUPS.filter(ug => ug.categoryId === selections.category)
    : [];

  const handleSelectCategory = (id: CategoryId) => {
    setSelections({ category: id });
    setStep(1);
  };

  const handleSelectUG = (id: UnderlyingGroupId) => {
    setSelections(prev => ({ ...prev, ugId: id }));
    setStep(2);
  };

  const handleSelectHorizon = (id: HorizonId) => {
    setSelections(prev => ({ ...prev, horizon: id }));
    setStep(3);
  };

  // Style selection triggers the computing loader before revealing the result
  const handleSelectStyle = (id: StyleId) => {
    setSelections(prev => ({ ...prev, style: id }));
    setStep('computing');
    // Total loader duration: 3 phases × 300ms = 900ms
    computeTimerRef.current = setTimeout(() => setStep(4), COMPUTE_PHASES.length * PHASE_DURATION);
  };

  const navigateToStep = (target: number) => {
    // Cancel any in-flight compute timer when navigating back
    if (computeTimerRef.current) {
      clearTimeout(computeTimerRef.current);
      computeTimerRef.current = null;
    }
    const numericStep = step === 'computing' ? 3 : step;
    if (target < numericStep) {
      if (target === 0) setSelections({});
      if (target === 1) setSelections(prev => ({ category: prev.category }));
      if (target === 2) setSelections(prev => ({ category: prev.category, ugId: prev.ugId }));
      if (target === 3) setSelections(prev => ({ category: prev.category, ugId: prev.ugId, horizon: prev.horizon }));
      setStep(target as StepValue);
    }
  };

  const reset = () => {
    if (computeTimerRef.current) {
      clearTimeout(computeTimerRef.current);
      computeTimerRef.current = null;
    }
    setSelections({});
    setStep(0);
  };

  const selectedStyle = STYLES.find(s => s.id === selections.style);

  const result: SimResult | null =
    step === 4 && selections.ugId && selections.horizon && selectedStyle
      ? computeDrag(selections.ugId, selections.horizon, selectedStyle.freq)
      : null;

  const PROMPTS: Record<StepValue, string | null> = {
    0: 'Cosa tradi principalmente?',
    1: 'Qual e il sottogruppo?',
    2: 'Che orizzonte temporale usi?',
    3: 'Con che frequenza operi?',
    computing: 'Analisi in corso...',
    4: null,
  };

  const ratingConfig = {
    low:    { icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Attrito basso'    },
    medium: { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',    label: 'Attrito moderato' },
    high:   { icon: TrendingDown,  color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',         label: 'Attrito elevato'  },
  };

  const TOTAL_STEPS = 4;
  const numericStep = step === 'computing' ? 3 : step;

  return (
    <div className="relative w-full flex flex-col p-5 sm:p-6 xl:p-7">

      {/* Progress dots */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            key={i}
            onClick={() => navigateToStep(i)}
            disabled={i >= numericStep}
            aria-label={`Torna allo step ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i < numericStep
                ? 'w-8 bg-primary cursor-pointer hover:bg-primary/80'
                : i === numericStep
                  ? 'w-8 bg-primary/40'
                  : 'w-4 bg-border/50',
            )}
          />
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/40">
          {step === 'computing'
            ? `4 / ${TOTAL_STEPS}`
            : step < TOTAL_STEPS
            ? `${(step as number) + 1} / ${TOTAL_STEPS}`
            : 'Risultato'}
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-5 h-10">
        <AnimatePresence mode="wait">
          {PROMPTS[step] && (
            <motion.p
              key={step}
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className={cn(
                'text-base font-medium tracking-tight text-foreground sm:text-lg',
                step === 'computing' && 'text-muted-foreground',
              )}
            >
              {PROMPTS[step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Step content */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">

          {/* STEP 0 -- 6 categories */}
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full"
            >
              {CATEGORIES.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelectCategory(item.id)}
                />
              ))}
            </motion.div>
          )}

          {/* STEP 1 -- underlying groups (filtered) */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-2 w-full"
            >
              {filteredUGs.map((ug) => (
                <UGCard
                  key={ug.id}
                  label={ug.label}
                  desc={ug.desc}
                  onClick={() => handleSelectUG(ug.id)}
                />
              ))}
            </motion.div>
          )}

          {/* STEP 2 -- horizons */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-3 gap-3 w-full"
            >
              {HORIZONS.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelectHorizon(item.id)}
                />
              ))}
            </motion.div>
          )}

          {/* STEP 3 -- styles */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-3 gap-3 w-full"
            >
              {STYLES.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelectStyle(item.id)}
                />
              ))}
            </motion.div>
          )}

          {/* STEP computing -- loader between step 3 and step 4 */}
          {step === 'computing' && <ComputingLoader />}

          {/* STEP 4 -- result */}
          {step === 4 && result && selections.ugId && selections.horizon && selectedStyle && (
            <motion.div
              key="step-4"
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
                <CostStat label="Spread"      value={`${result.spreadBps} bps`} />
                <CostStat label="Swap/giorno" value={result.swapPerDay > 0 ? `${result.swapPerDay} bps` : '--'} />
                <CostStat label="Platform fee" value={`${result.platformFee}%`} />
              </div>

              {/* Formula note */}
              <p className="font-mono text-[10px] text-muted-foreground/50 text-center tracking-wide">
                {selectedStyle.freq} trade/sessione &middot; {HORIZON_PARAMS[selections.horizon].holdingDays}gg holding &middot; spread {result.spreadBps}bps
              </p>

              {/* Suggestion */}
              <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">Cosa fare: </span>
                  {result.suggestion}
                </p>
              </div>

              {/* Recap + reset */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {[selections.category, selections.ugId, selections.horizon, selections.style].map((s) => s && (
                    <span key={s} className="rounded-full border border-border/50 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {s.replace('ug_', '').replace(/_/g, ' ')}
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
      {numericStep > 0 && step !== 'computing' && step < TOTAL_STEPS && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 flex items-center gap-2 flex-wrap"
        >
          {selections.category && (
            <button
              onClick={() => navigateToStep(0)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
            >
              <ChevronLeft className="size-3" />
              {CATEGORIES.find(c => c.id === selections.category)?.label}
            </button>
          )}
          {numericStep > 1 && selections.ugId && (
            <>
              <span className="text-muted-foreground/30 text-xs">/</span>
              <button
                onClick={() => navigateToStep(1)}
                className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
              >
                <ChevronLeft className="size-3" />
                {UNDERLYING_GROUPS.find(u => u.id === selections.ugId)?.label}
              </button>
            </>
          )}
          {numericStep > 2 && selections.horizon && (
            <>
              <span className="text-muted-foreground/30 text-xs">/</span>
              <button
                onClick={() => navigateToStep(2)}
                className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
              >
                <ChevronLeft className="size-3" />
                {HORIZONS.find(h => h.id === selections.horizon)?.label}
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. SUB-COMPONENTS
// ---------------------------------------------------------------------------

function OptionCard({
  icon: Icon, title, description, onClick,
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

function UGCard({
  label, desc, onClick,
}: {
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between w-full px-4 py-3 text-left transition-all duration-200',
        'bg-background/60 border border-border/50 rounded-2xl',
        'hover:border-primary/60 hover:bg-accent/30 hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
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
