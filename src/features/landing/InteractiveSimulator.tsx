'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  BarChart3,
  Coins,
  Building2,
  Zap,
  TrendingUp,
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
  Sprout,
  Wallet,
  BadgeEuro,
  Landmark,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';
import {
  ACCOUNT_SIZES,
  ACCOUNT_SIZE_IDS,
  type AccountSizeId,
} from '@/data/simulator/account-sizes';
import {
  LEVERAGE_PROFILES,
  LEVERAGE_PROFILE_IDS,
  type LeverageProfileId,
} from '@/data/simulator/leverage-profiles';

const LUCIDE_ICON_MAP: Record<string, React.ElementType> = {
  Sprout, Wallet, BadgeEuro, TrendingUp, Landmark,
  ShieldCheck, Zap, Flame,
};

// ---------------------------------------------------------------------------
// 1. DATA DOMAIN
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'forex',       label: 'Forex',     icon: Globe,     desc: 'Major, Cross & Esotico' },
  { id: 'indices',     label: 'Indici',    icon: BarChart3, desc: 'US, EU & Asia'           },
  { id: 'equities',    label: 'Azioni',    icon: Building2, desc: 'US, EU & Asia Large Cap' },
  { id: 'commodities', label: 'Commodity', icon: Wheat,     desc: 'Metalli & Energia'       },
  { id: 'crypto',      label: 'Crypto',    icon: Coins,     desc: 'Major & Altcoin'         },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

const UNDERLYING_GROUPS = [
  { id: 'ug_fx_core',          categoryId: 'forex'       as CategoryId, label: 'Major',         desc: 'EUR/USD, GBP/USD, USD/JPY...' },
  { id: 'ug_fx_cross',         categoryId: 'forex'       as CategoryId, label: 'Cross',          desc: 'EUR/GBP, AUD/JPY, GBP/CHF...' },
  { id: 'ug_fx_exotic',        categoryId: 'forex'       as CategoryId, label: 'Esotico',        desc: 'USD/TRY, USD/ZAR, USD/MXN...' },
  { id: 'ug_index_us',         categoryId: 'indices'     as CategoryId, label: 'US',             desc: 'S&P500, NQ100, DJIA...'       },
  { id: 'ug_index_eu',         categoryId: 'indices'     as CategoryId, label: 'EU',             desc: 'DAX, CAC40, FTSE MIB...'      },
  { id: 'ug_index_asia',       categoryId: 'indices'     as CategoryId, label: 'Asia',           desc: 'Nikkei, Hang Seng, ASX...'    },
  { id: 'ug_equity_us_large',  categoryId: 'equities'    as CategoryId, label: 'US Large Cap',   desc: 'AAPL, MSFT, NVDA...'          },
  { id: 'ug_equity_us_mid',    categoryId: 'equities'    as CategoryId, label: 'US Mid Cap',     desc: 'S&P 400, titoli $1-10B...'    },
  { id: 'ug_equity_eu_large',  categoryId: 'equities'    as CategoryId, label: 'EU Large Cap',   desc: 'SAP, ASML, Nestle, BNP...'    },
  { id: 'ug_equity_asia',      categoryId: 'equities'    as CategoryId, label: 'Asia Large Cap', desc: 'Toyota, Samsung, Alibaba...'  },
  { id: 'ug_commodity_metal',  categoryId: 'commodities' as CategoryId, label: 'Metalli',        desc: 'Gold, Silver, Platinum...'    },
  { id: 'ug_commodity_energy', categoryId: 'commodities' as CategoryId, label: 'Energia',        desc: 'WTI, Brent, Nat Gas...'       },
  { id: 'ug_crypto_major',     categoryId: 'crypto'      as CategoryId, label: 'Major',          desc: 'BTC, ETH, SOL...'             },
  { id: 'ug_crypto_altcoin',   categoryId: 'crypto'      as CategoryId, label: 'Altcoin',        desc: 'Tutto il resto -- high beta'  },
] as const;

type UnderlyingGroupId = typeof UNDERLYING_GROUPS[number]['id'];

// ---------------------------------------------------------------------------
// FOREX ASSET SELECTOR — pill filter + asset grid
// ---------------------------------------------------------------------------

type ForexSubgroup = 'major' | 'cross' | 'exotic';

const FOREX_SUBGROUPS: { id: ForexSubgroup; label: string; ugId: UnderlyingGroupId }[] = [
  { id: 'major',  label: 'Major',   ugId: 'ug_fx_core'   },
  { id: 'cross',  label: 'Cross',   ugId: 'ug_fx_cross'  },
  { id: 'exotic', label: 'Esotico', ugId: 'ug_fx_exotic' },
];

type ForexAsset = { id: string; label: string; subgroup: ForexSubgroup };

const FOREX_ASSETS: ForexAsset[] = [
  // Major
  { id: 'eurusd', label: 'EUR/USD', subgroup: 'major' },
  { id: 'gbpusd', label: 'GBP/USD', subgroup: 'major' },
  { id: 'usdjpy', label: 'USD/JPY', subgroup: 'major' },
  { id: 'usdchf', label: 'USD/CHF', subgroup: 'major' },
  { id: 'audusd', label: 'AUD/USD', subgroup: 'major' },
  { id: 'usdcad', label: 'USD/CAD', subgroup: 'major' },
  { id: 'nzdusd', label: 'NZD/USD', subgroup: 'major' },
  // Cross
  { id: 'eurgbp', label: 'EUR/GBP', subgroup: 'cross' },
  { id: 'eurjpy', label: 'EUR/JPY', subgroup: 'cross' },
  { id: 'gbpjpy', label: 'GBP/JPY', subgroup: 'cross' },
  { id: 'eurchf', label: 'EUR/CHF', subgroup: 'cross' },
  { id: 'audjpy', label: 'AUD/JPY', subgroup: 'cross' },
  { id: 'gbpchf', label: 'GBP/CHF', subgroup: 'cross' },
  { id: 'cadjpy', label: 'CAD/JPY', subgroup: 'cross' },
  // Exotic
  { id: 'usdtry', label: 'USD/TRY', subgroup: 'exotic' },
  { id: 'usdmxn', label: 'USD/MXN', subgroup: 'exotic' },
  { id: 'usdzar', label: 'USD/ZAR', subgroup: 'exotic' },
  { id: 'eurtry', label: 'EUR/TRY', subgroup: 'exotic' },
  { id: 'usdsgd', label: 'USD/SGD', subgroup: 'exotic' },
  { id: 'usdhkd', label: 'USD/HKD', subgroup: 'exotic' },
];

// Map asset → ugId per computeDrag
const ASSET_TO_UG: Record<string, UnderlyingGroupId> = Object.fromEntries(
  FOREX_ASSETS.map(a => [a.id, FOREX_SUBGROUPS.find(s => s.id === a.subgroup)!.ugId]),
);

const HORIZONS = [
  { id: 'scalping',  label: 'Scalping',  icon: Clock,        desc: 'Minuti / Ore'         },
  { id: 'intraday',  label: 'Intraday',  icon: Calendar,     desc: 'Chiusura in giornata' },
  { id: 'multiday',  label: 'Multiday',  icon: CalendarDays, desc: 'Da 2 a 5 giorni'      },
] as const;

type HorizonId = typeof HORIZONS[number]['id'];

const STYLES = [
  {
    id: 'selective',
    label: 'Selettivo',
    icon: Target,
    freq: 2,
    desc: {
      scalping: '1–3 trade/ora · alta selettività',
      intraday: '1–3 setup/giornata · alta qualità',
      multiday: '1–2 posizioni · massima selezione',
    } as Record<HorizonId, string>,
  },
  {
    id: 'active',
    label: 'Attivo',
    icon: TrendingUp,
    freq: 7,
    desc: {
      scalping: '5–10 trade/ora · segue momentum',
      intraday: '4–8 setup/giornata · multi-setup',
      multiday: '3–6 posizioni · basket attivo',
    } as Record<HorizonId, string>,
  },
  {
    id: 'high_freq',
    label: 'Alta frequenza',
    icon: Zap,
    freq: 20,
    desc: {
      scalping: '20+ trade/ora · scalping continuo',
      intraday: '15–25 trade/giornata · alta frequenza',
      multiday: '',
    } as Record<HorizonId, string>,
  },
] as const;

type StyleId = typeof STYLES[number]['id'];

function filteredStyles(horizonId: HorizonId) {
  if (horizonId === 'multiday') return STYLES.filter(s => s.id !== 'high_freq');
  return STYLES;
}

const STYLE_PROMPT: Record<HorizonId, string> = {
  scalping: 'Quanti trade fai per ora?',
  intraday: 'Quanti setup apri in giornata?',
  multiday: 'Quante posizioni tieni aperte?',
};

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
      intraday: { primaryIssue: 'Spread variabile intorno a EIA/OPEC report',  suggestion: 'Non operare 30min prima/dopo report EIA' },
      multiday: { primaryIssue: 'Contango futures petrolio erode la leva',     suggestion: 'Futures rolling attento a contango' },
    },
  },
  ug_crypto_major: {
    spread: 6, swapPerDay: 2.0, platformFee: 0.04, thresholdLow: 25, thresholdHigh: 55,
    texts: {
      scalping: { primaryIssue: 'Fee taker + spread molto elevati su crypto',  suggestion: 'Maker orders su MEXC/Bybit per fee zero' },
      intraday: { primaryIssue: 'Fee taker + spread variabile e liquidazioni',  suggestion: 'Maker-only strategy o exchange con rebate' },
      multiday: { primaryIssue: 'Funding rate perpetual ogni 8h si accumula',  suggestion: 'Monitora funding ogni 8h, chiudi se > 0.1%' },
    },
  },
  ug_crypto_altcoin: {
    spread: 18, swapPerDay: 3.0, platformFee: 0.06, thresholdLow: 45, thresholdHigh: 80,
    texts: {
      scalping: { primaryIssue: 'Spread altcoin estremo + fee alta su scalp',   suggestion: 'Altcoin incompatibili con scalping' },
      intraday: { primaryIssue: 'Liquidita bassa, slippage enorme su altcoin',  suggestion: 'Solo altcoin top-20 per intraday' },
      multiday: { primaryIssue: 'Funding + spread + liquidita bassa accumulati',suggestion: 'Size tiny, stop molto largo, spot only' },
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
// 3. RATING CONFIG — usa CSS tokens, non Tailwind hardcoded
// ---------------------------------------------------------------------------

type RatingKey = 'low' | 'medium' | 'high';

const RATING_CONFIG: Record<RatingKey, {
  icon:       React.ElementType;
  colorClass: string;
  bgClass:    string;
  label:      string;
}> = {
  low: {
    icon:       CheckCircle2,
    colorClass: 'text-primary',
    bgClass:    'bg-primary/10 border-primary/20',
    label:      'Attrito basso',
  },
  medium: {
    icon:       AlertTriangle,
    colorClass: 'text-warning',
    bgClass:    'bg-warning/10 border-warning/20',
    label:      'Attrito moderato',
  },
  high: {
    icon:       TrendingDown,
    colorClass: 'text-destructive',
    bgClass:    'bg-destructive/10 border-destructive/20',
    label:      'Attrito elevato',
  },
};

// ---------------------------------------------------------------------------
// 4. STATE & ANIMATION
// ---------------------------------------------------------------------------

type SimulatorState = {
  category?:     CategoryId;
  ugId?:         UnderlyingGroupId;
  assetId?:      string;
  horizon?:      HorizonId;
  style?:        StyleId;
  accountSize?:  AccountSizeId;
  leverage?:     LeverageProfileId;
};

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const fade = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -12, scale: 0.99, position: 'absolute' as const },
};

const slideDown = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

function revealVariant(delayMs: number) {
  return {
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: delayMs / 1000, duration: 0.38, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
    },
  };
}

const badgeReveal = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
  animate: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { delay: 0.06, duration: 0.42, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
};

function statReveal(i: number) {
  return {
    initial: { opacity: 0, y: 8, scale: 0.97 },
    animate: {
      opacity: 1, y: 0, scale: 1,
      transition: { delay: 0.20 + i * 0.055, duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
    },
  };
}

// ---------------------------------------------------------------------------
// 5. MAIN COMPONENT
// ---------------------------------------------------------------------------

export function InteractiveSimulator() {
  const [step, setStep]             = useState<number>(0);
  const [selections, setSelections] = useState<SimulatorState>({});
  const [forexSubgroup, setForexSubgroup] = useState<ForexSubgroup>('major');

  // Autoscroll: keeps the simulator card in view on every step transition
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!rootRef.current) return;
    // Small delay to let framer-motion start the transition first
    const id = setTimeout(() => {
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
    return () => clearTimeout(id);
  }, [step]);

  const filteredUGs = selections.category
    ? UNDERLYING_GROUPS.filter(ug => ug.categoryId === selections.category)
    : [];

  const availableStyles = selections.horizon ? filteredStyles(selections.horizon) : [];

  const handleSelectCategory = (id: CategoryId) => {
    setSelections({ category: id });
    setForexSubgroup('major');
    setStep(1);
  };

  const handleSelectForexAsset = (asset: ForexAsset) => {
    const ugId = ASSET_TO_UG[asset.id];
    setSelections(prev => ({ ...prev, ugId, assetId: asset.id }));
    setStep(2);
  };

  const handleSelectUG = (id: UnderlyingGroupId) => {
    setSelections(prev => ({ ...prev, ugId: id, assetId: undefined }));
    setStep(2);
  };

  const handleSelectHorizon      = (id: HorizonId)         => { setSelections(prev => ({ ...prev, horizon: id, style: undefined })); };
  const handleSelectStyle        = (id: StyleId)           => { setSelections(prev => ({ ...prev, style: id })); setStep(3); };
  const handleSelectAccountSize  = (id: AccountSizeId)     => { setSelections(prev => ({ ...prev, accountSize: id })); };
  const handleSelectLeverage     = (id: LeverageProfileId) => { setSelections(prev => ({ ...prev, leverage: id })); };
  const handleConfirmProfile     = () => { if (step4Ready) setStep(4); };

  const navigateToStep = (target: number) => {
    if (target >= step) return;
    if (target === 0) { setSelections({}); setForexSubgroup('major'); }
    if (target === 1) setSelections(prev => ({ category: prev.category }));
    if (target === 2) setSelections(prev => ({ category: prev.category, ugId: prev.ugId, assetId: prev.assetId, horizon: undefined, style: undefined }));
    if (target === 3) setSelections(prev => ({ ...prev, accountSize: undefined, leverage: undefined }));
    setStep(target);
  };

  const reset = () => { setSelections({}); setForexSubgroup('major'); setStep(0); };

  const selectedStyle = STYLES.find(s => s.id === selections.style);
  const step4Ready    = !!(selections.accountSize && selections.leverage);

  const result: SimResult | null =
    step === 4 && selections.ugId && selections.horizon && selectedStyle
      ? computeDrag(selections.ugId, selections.horizon, selectedStyle.freq)
      : null;

  const step1BreadcrumbLabel = selections.category === 'forex' && selections.assetId
    ? FOREX_ASSETS.find(a => a.id === selections.assetId)?.label ?? ''
    : UNDERLYING_GROUPS.find(u => u.id === selections.ugId)?.label ?? '';

  const PROMPTS: (string | null)[] = [
    'Cosa tradi principalmente?',
    selections.category === 'forex' ? 'Quale coppia vuoi analizzare?' : 'Qual è il sottogruppo?',
    'Come operi?',
    'Il tuo profilo operativo',
    null,
  ];

  const TOTAL_STEPS = 4;

  return (
    <div ref={rootRef} className="relative w-full flex flex-col p-5 sm:p-6 xl:p-7">

      {/* Progress dots */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
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
          {step < TOTAL_STEPS ? `${step + 1} / ${TOTAL_STEPS}` : 'Risultato'}
        </span>
      </div>

      {/* Prompt header */}
      <div className="mb-5 h-10">
        <AnimatePresence mode="wait">
          {PROMPTS[step] && (
            <motion.p
              key={step}
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="text-base font-medium tracking-tight text-foreground sm:text-lg"
            >
              {PROMPTS[step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.div layout="size" className="relative overflow-hidden min-h-[300px] sm:min-h-[340px] xl:min-h-[320px]">
        <AnimatePresence mode="wait">

          {/* STEP 0 — category */}
          {step === 0 && (
            <motion.div key="step-0" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full">
              {CATEGORIES.map(item => (
                <OptionCard key={item.id} icon={item.icon} title={item.label} description={item.desc} onClick={() => handleSelectCategory(item.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 1 — forex: asset selector */}
          {step === 1 && selections.category === 'forex' && (
            <motion.div key="step-1-forex" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-5 w-full">

              {/* Pill filter subgroup */}
              <div className="flex gap-1.5">
                {FOREX_SUBGROUPS.map(sg => (
                  <button
                    key={sg.id}
                    onClick={() => setForexSubgroup(sg.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                      forexSubgroup === sg.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background/60 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground',
                    )}
                  >
                    {sg.label}
                  </button>
                ))}
              </div>

              {/* Asset grid — gap-5 from pills above gives breathing room */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={forexSubgroup}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                >
                  {FOREX_ASSETS.filter(a => a.subgroup === forexSubgroup).map(asset => (
                    <AssetPill
                      key={asset.id}
                      label={asset.label}
                      selected={selections.assetId === asset.id}
                      onClick={() => handleSelectForexAsset(asset)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {step === 1 && selections.category !== 'forex' && (
            <motion.div key="step-1-other" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-2 w-full">
              {filteredUGs.map(ug => (
                <UGCard key={ug.id} label={ug.label} desc={ug.desc} onClick={() => handleSelectUG(ug.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 2 — orizzonte + stile */}
          {step === 2 && (
            <motion.div key="step-2" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-4 w-full">

              <ProfileSection label="Orizzonte temporale">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {HORIZONS.map(item => (
                    <OptionCard
                      key={item.id} icon={item.icon} title={item.label} description={item.desc}
                      selected={selections.horizon === item.id}
                      onClick={() => handleSelectHorizon(item.id)}
                    />
                  ))}
                </div>
              </ProfileSection>

              <AnimatePresence>
                {selections.horizon && (
                  <motion.div key={`styles-${selections.horizon}`} variants={slideDown} initial="initial" animate="animate" exit="exit">
                    <ProfileSection label={STYLE_PROMPT[selections.horizon]}>
                      <div className={cn(
                        'grid gap-2 sm:gap-3',
                        availableStyles.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3',
                      )}>
                        {availableStyles.map(item => (
                          <OptionCard
                            key={item.id} icon={item.icon} title={item.label}
                            description={item.desc[selections.horizon!]}
                            selected={selections.style === item.id}
                            onClick={() => handleSelectStyle(item.id as StyleId)}
                          />
                        ))}
                      </div>
                    </ProfileSection>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 3 — profilo operativo */}
          {step === 3 && (
            <motion.div key="step-3" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-5 w-full">

              <ProfileSection label="Dimensione conto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCOUNT_SIZE_IDS.map(id => {
                    const item = ACCOUNT_SIZES[id];
                    const Icon = LUCIDE_ICON_MAP[item.icon] ?? Wallet;
                    return <ProfileChip key={id} icon={Icon} label={item.label} selected={selections.accountSize === id} onClick={() => handleSelectAccountSize(id)} />;
                  })}
                </div>
              </ProfileSection>

              <AnimatePresence>
                {selections.accountSize && (
                  <motion.div key="leverage" variants={slideDown} initial="initial" animate="animate" exit="exit">
                    <ProfileSection label="Leva utilizzata">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {LEVERAGE_PROFILE_IDS.map(id => {
                          const item = LEVERAGE_PROFILES[id];
                          const Icon = LUCIDE_ICON_MAP[item.icon] ?? ShieldCheck;
                          return <ProfileChip key={id} icon={Icon} label={item.label} selected={selections.leverage === id} onClick={() => handleSelectLeverage(id)} />;
                        })}
                      </div>
                    </ProfileSection>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step4Ready && (
                  <motion.div key="cta" variants={slideDown} initial="initial" animate="animate" exit="exit">
                    <button
                      onClick={handleConfirmProfile}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-3 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Vedi i risultati <ArrowRight className="size-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 4 — Risultato */}
          {step === 4 && result && selections.ugId && selections.horizon && selectedStyle && (
            <ResultView
              result={result}
              selections={selections}
              selectedStyle={selectedStyle}
              onReset={reset}
            />
          )}

        </AnimatePresence>
      </motion.div>

      {/* Breadcrumb */}
      {step > 0 && step < TOTAL_STEPS && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex items-center gap-2 flex-wrap">
          {selections.category && (
            <button onClick={() => navigateToStep(0)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary">
              <ChevronLeft className="size-3" />{CATEGORIES.find(c => c.id === selections.category)?.label}
            </button>
          )}
          {step > 1 && selections.ugId && (
            <><span className="text-muted-foreground/30 text-xs">/</span>
            <button onClick={() => navigateToStep(1)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary">
              <ChevronLeft className="size-3" />{step1BreadcrumbLabel}
            </button></>
          )}
          {step > 2 && selections.horizon && (
            <><span className="text-muted-foreground/30 text-xs">/</span>
            <button onClick={() => navigateToStep(2)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary">
              <ChevronLeft className="size-3" />{HORIZONS.find(h => h.id === selections.horizon)?.label}
              {selections.style && <span className="opacity-50">· {STYLES.find(s => s.id === selections.style)?.label}</span>}
            </button></>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. RESULT VIEW
// ---------------------------------------------------------------------------

function ResultView({
  result, selections, selectedStyle, onReset,
}: {
  result:        SimResult;
  selections:    SimulatorState;
  selectedStyle: typeof STYLES[number];
  onReset:       () => void;
}) {
  const cfg = RATING_CONFIG[result.rating];
  const Icon = cfg.icon;

  const assetLabel = selections.assetId
    ? FOREX_ASSETS.find(a => a.id === selections.assetId)?.label
    : UNDERLYING_GROUPS.find(u => u.id === selections.ugId)?.label;

  return (
    <motion.div key="step-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.15 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="w-full space-y-3">

      {/* Rating badge */}
      <motion.div variants={badgeReveal} initial="initial" animate="animate"
        className={cn('flex items-center gap-3 rounded-2xl border px-4 py-3', cfg.bgClass)}>
        <Icon className={cn('size-5 shrink-0', cfg.colorClass)} />
        <div>
          <p className={cn('font-mono text-[11px] font-semibold uppercase tracking-[0.18em]', cfg.colorClass)}>
            {cfg.label}
          </p>
          <p className="text-xs text-muted-foreground/70">{result.primaryIssue}</p>
        </div>
        <span className={cn('ml-auto font-mono text-xl font-bold tabular-nums', cfg.colorClass)}>
          {result.totalDrag} bps
        </span>
      </motion.div>

      {/* Profilo recap chips */}
      <motion.div variants={statReveal(0)} initial="initial" animate="animate" className="flex flex-wrap gap-1.5">
        {[
          selections.accountSize  ? ACCOUNT_SIZES[selections.accountSize].label   : null,
          selections.leverage     ? LEVERAGE_PROFILES[selections.leverage].label  : null,
        ].filter(Boolean).map(label => (
          <span key={label}
            className="rounded-full border border-border/50 bg-background px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
        ))}
      </motion.div>

      {/* Cost breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Spread',       value: `${result.spreadBps} bps` },
          { label: 'Swap/giorno',  value: result.swapPerDay > 0 ? `${result.swapPerDay} bps` : '--' },
          { label: 'Platform fee', value: `${result.platformFee}%` },
        ].map(({ label, value }, i) => (
          <motion.div key={label} variants={statReveal(i + 1)} initial="initial" animate="animate"
            className="rounded-2xl border border-border/50 bg-background/60 px-3 py-3 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">{label}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Formula line */}
      <motion.p variants={revealVariant(300)} initial="initial" animate="animate"
        className="font-mono text-[10px] text-muted-foreground/50 text-center tracking-wide">
        {selectedStyle.freq} trade/sessione · {HORIZON_PARAMS[selections.horizon!].holdingDays}gg holding · spread {result.spreadBps}bps
      </motion.p>

      {/* Suggestion */}
      <motion.div variants={revealVariant(380)} initial="initial" animate="animate"
        className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3">
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Cosa fare: </span>
          {result.suggestion}
        </p>
      </motion.div>

      {/* Tags + reset */}
      <motion.div variants={revealVariant(460)} initial="initial" animate="animate"
        className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[
            CATEGORIES.find(c => c.id === selections.category)?.label,
            assetLabel,
            selections.horizon,
            selections.style,
          ].filter(Boolean).map(s => (
            <span key={s}
              className="rounded-full border border-border/50 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
        <button onClick={onReset}
          className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
          <RotateCcw className="size-3" /> Ricomincia
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 7. SUB-COMPONENTS
// ---------------------------------------------------------------------------

function OptionCard({
  icon: Icon, title, description, onClick, selected = false,
}: {
  icon: React.ElementType; title: string; description: string;
  onClick: () => void; selected?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'group relative flex flex-col items-start justify-between p-3 sm:p-4 text-left transition-all duration-200 border rounded-2xl',
        selected
          ? 'border-primary/70 bg-primary/10 text-foreground'
          : 'bg-background/60 text-card-foreground border-border/50 hover:border-primary/60 hover:bg-accent/30 hover:shadow-md hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}>
      <Icon className={cn('mb-2 size-4 stroke-[1.5] transition-colors duration-200', selected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
      <div>
        <p className="text-sm font-medium leading-5 text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-[10px] text-muted-foreground hidden sm:block">{description}</p>}
      </div>
    </button>
  );
}

function AssetPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-2.5 text-center font-mono text-xs font-semibold tracking-wide transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-primary/70 bg-primary/10 text-primary'
          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5 hover:shadow-sm',
      )}
    >
      {label}
    </button>
  );
}

function UGCard({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'group flex items-center justify-between w-full px-4 py-3 text-left transition-all duration-200',
        'bg-background/60 border border-border/50 rounded-2xl',
        'hover:border-primary/60 hover:bg-accent/30 hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
    </button>
  );
}

function ProfileSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">{label}</p>
      {children}
    </div>
  );
}

function ProfileChip({
  icon: Icon, label, selected, onClick,
}: { icon: React.ElementType; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-primary/70 bg-primary/10 text-foreground'
          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}>
      <Icon className={cn('size-3.5 shrink-0 transition-colors', selected ? 'text-primary' : 'text-muted-foreground/60')} />
      <span className="text-xs font-medium leading-tight">{label}</span>
    </button>
  );
}
