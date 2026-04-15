'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Globe, BarChart3, Coins, Building2, Wheat,
  Clock, Calendar, CalendarDays,
  ArrowRight, RotateCcw, TrendingDown, AlertTriangle, CheckCircle2,
  ChevronLeft, Zap, SlidersHorizontal, X,
  DollarSign, TrendingUp, Gauge,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';
import {
  TRADES_PER_MONTH_STEPS, TRADES_DEFAULT, TRADES_PRESETS,
  ACCOUNT_SIZE_STEPS, ACCOUNT_SIZE_DEFAULT, ACCOUNT_PRESETS,
  RISK_PERCENT_STEPS,
  formatAccountSize, deriveNotional, getTradeSizePills, getLotSizes, deriveTradeSizeAuto, lotsToMargin,
  type TradesPerMonthStep, type AccountSizeStep, type RiskPercentStep,
  type TradeSizeMode,
} from '@/data/simulator/trade-scales';

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'forex',       label: 'Forex',     icon: Globe,     desc: 'Major, Cross & Esotico' },
  { id: 'indices',     label: 'Indici',    icon: BarChart3, desc: 'US, EU & Asia'           },
  { id: 'equities',    label: 'Azioni',    icon: Building2, desc: 'US, EU & Asia Large Cap' },
  { id: 'commodities', label: 'Commodity', icon: Wheat,     desc: 'Metalli & Energia'       },
  { id: 'crypto',      label: 'Crypto',    icon: Coins,     desc: 'Major & Altcoin'         },
] as const;
type CategoryId = typeof CATEGORIES[number]['id'];

const SIZE_MODES: { id: TradeSizeMode; label: string; Icon: typeof DollarSign }[] = [
  { id: 'amount', label: 'Importo', Icon: DollarSign },
  { id: 'lots',  label: 'Lotti', Icon: TrendingUp },
  { id: 'auto',  label: 'Auto',  Icon: Gauge },
];

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
  { id: 'ug_crypto_altcoin',   categoryId: 'crypto'      as CategoryId, label: 'Altcoin',        desc: 'Tutto il resto — high beta'   },
] as const;
type UnderlyingGroupId = typeof UNDERLYING_GROUPS[number]['id'];

type ForexSubgroup = 'major' | 'cross' | 'exotic';
const FOREX_SUBGROUPS: { id: ForexSubgroup; label: string; ugId: UnderlyingGroupId }[] = [
  { id: 'major',  label: 'Major',   ugId: 'ug_fx_core'   },
  { id: 'cross',  label: 'Cross',   ugId: 'ug_fx_cross'  },
  { id: 'exotic', label: 'Esotico', ugId: 'ug_fx_exotic' },
];
type ForexAsset = { id: string; label: string; subgroup: ForexSubgroup };
const FOREX_ASSETS: ForexAsset[] = [
  { id: 'eurusd', label: 'EUR/USD', subgroup: 'major' },
  { id: 'gbpusd', label: 'GBP/USD', subgroup: 'major' },
  { id: 'usdjpy', label: 'USD/JPY', subgroup: 'major' },
  { id: 'usdchf', label: 'USD/CHF', subgroup: 'major' },
  { id: 'audusd', label: 'AUD/USD', subgroup: 'major' },
  { id: 'usdcad', label: 'USD/CAD', subgroup: 'major' },
  { id: 'nzdusd', label: 'NZD/USD', subgroup: 'major' },
  { id: 'eurgbp', label: 'EUR/GBP', subgroup: 'cross' },
  { id: 'eurjpy', label: 'EUR/JPY', subgroup: 'cross' },
  { id: 'gbpjpy', label: 'GBP/JPY', subgroup: 'cross' },
  { id: 'eurchf', label: 'EUR/CHF', subgroup: 'cross' },
  { id: 'audjpy', label: 'AUD/JPY', subgroup: 'cross' },
  { id: 'gbpchf', label: 'GBP/CHF', subgroup: 'cross' },
  { id: 'cadjpy', label: 'CAD/JPY', subgroup: 'cross' },
  { id: 'usdtry', label: 'USD/TRY', subgroup: 'exotic' },
  { id: 'usdmxn', label: 'USD/MXN', subgroup: 'exotic' },
  { id: 'usdzar', label: 'USD/ZAR', subgroup: 'exotic' },
  { id: 'eurtry', label: 'EUR/TRY', subgroup: 'exotic' },
  { id: 'usdsgd', label: 'USD/SGD', subgroup: 'exotic' },
  { id: 'usdhkd', label: 'USD/HKD', subgroup: 'exotic' },
];
const ASSET_TO_UG: Record<string, UnderlyingGroupId> = Object.fromEntries(
  FOREX_ASSETS.map(a => [a.id, FOREX_SUBGROUPS.find(s => s.id === a.subgroup)!.ugId]),
);

const HORIZONS = [
  { id: 'intraday', label: 'Intraday', icon: Clock,        desc: 'Chiudi in giornata' },
  { id: 'multiday', label: 'Multiday', icon: Calendar,     desc: '2–5 giorni'         },
  { id: 'swing',    label: 'Swing',    icon: CalendarDays, desc: 'Settimane / mesi'   },
] as const;
type HorizonId = typeof HORIZONS[number]['id'];
const HORIZON_HOLDING: Record<HorizonId, number> = { intraday: 0.3, multiday: 3.5, swing: 15 };

// ---------------------------------------------------------------------------
// COST MODEL
// ---------------------------------------------------------------------------

type SimResult = {
  spreadBps: number; swapPerDay: number;
  tradesPerMonth: number; notionale: number;
  totalDragBps: number; totalDragEur: number;
  rating: 'low' | 'medium' | 'high';
  primaryIssue: string; suggestion: string;
};

type UgTexts = Record<HorizonId, { primaryIssue: string; suggestion: string }>;
type UgParams = { spread: number; swapPerDay: number; thresholdLow: number; thresholdHigh: number; texts: UgTexts };

const UG_PARAMS: Record<UnderlyingGroupId, UgParams> = {
  ug_fx_core:          { spread: 2,  swapPerDay: 1.2, thresholdLow: 15, thresholdHigh: 40, texts: { intraday: { primaryIssue: 'Spread ampliato nelle ore news macro',         suggestion: 'Evita aperture 30min prima di dati CPI/NFP'         }, multiday: { primaryIssue: 'Swap overnight si accumula sui giorni',        suggestion: 'Considera futures su valute per multiday'             }, swing: { primaryIssue: 'Swap si accumula su settimane intere',          suggestion: 'Futures su valute o FX forward per swing'             } } },
  ug_fx_cross:         { spread: 4,  swapPerDay: 1.5, thresholdLow: 20, thresholdHigh: 50, texts: { intraday: { primaryIssue: 'Spread variabile durante overlap London/NY',    suggestion: 'Opera negli overlap London/NY per spread minimo'      }, multiday: { primaryIssue: 'Spread + swap si sommano sui giorni',          suggestion: 'CFD con swap contenuto o futures OTC'                 }, swing: { primaryIssue: 'Swap cross elevato su settimane',              suggestion: 'Riduci size, monitora swap settimanale'              } } },
  ug_fx_exotic:        { spread: 15, swapPerDay: 3.0, thresholdLow: 40, thresholdHigh: 70, texts: { intraday: { primaryIssue: 'Spread > 10 pip comune su esotici',              suggestion: 'Target solo su movimenti news macro rilevanti'        }, multiday: { primaryIssue: 'Spread + swap esotici molto alti',             suggestion: 'Position sizing molto ridotto, stop ampio'            }, swing: { primaryIssue: 'Swap esotico devastante su settimane',         suggestion: 'Solo spot, no CFD per swing su esotici'              } } },
  ug_index_us:         { spread: 3,  swapPerDay: 1.5, thresholdLow: 20, thresholdHigh: 45, texts: { intraday: { primaryIssue: 'Falsi breakout comuni su open NYSE',               suggestion: 'Filtra con volumi futures, non solo CFD'              }, multiday: { primaryIssue: 'Financing charge CFD overnight elevato',       suggestion: 'Futures su indici eliminano il financing'            }, swing: { primaryIssue: 'Financing CFD si accumula in settimane',       suggestion: 'ETF o futures per swing su indici US'                } } },
  ug_index_eu:         { spread: 4,  swapPerDay: 1.5, thresholdLow: 22, thresholdHigh: 48, texts: { intraday: { primaryIssue: 'Spread variabile a open Londra',                   suggestion: 'Opera nelle prime 2h di apertura EU'                 }, multiday: { primaryIssue: 'Financing overnight CFD EU accumulato',         suggestion: 'Futures EU-listed con rollover pulito'               }, swing: { primaryIssue: 'Financing CFD EU pesante su swing',             suggestion: 'Futures DAX/CAC o ETF per swing'                    } } },
  ug_index_asia:       { spread: 5,  swapPerDay: 2.0, thresholdLow: 25, thresholdHigh: 55, texts: { intraday: { primaryIssue: 'Spread più alto che su EU/US',                    suggestion: 'Opera nelle 2h di open Tokyo o Hong Kong'            }, multiday: { primaryIssue: 'Financing + spread asiatico accumulato',        suggestion: 'ETF Nikkei/Hang Seng senza swap'                    }, swing: { primaryIssue: 'Financing + FX risk su swing Asia',             suggestion: 'ETF hedgiato o futures locali'                      } } },
  ug_equity_us_large:  { spread: 2,  swapPerDay: 1.0, thresholdLow: 15, thresholdHigh: 40, texts: { intraday: { primaryIssue: 'Slippage su breakout pre-market e news',          suggestion: 'Opera solo su titoli volume > 5M/giorno'             }, multiday: { primaryIssue: 'CFD overnight charge + gap risk',              suggestion: 'Azioni cash per multiday, evita CFD a leva'          }, swing: { primaryIssue: 'Financing CFD lungo su swing equity',           suggestion: 'Cash equity, incassa anche dividendi'                } } },
  ug_equity_us_mid:    { spread: 5,  swapPerDay: 1.2, thresholdLow: 22, thresholdHigh: 48, texts: { intraday: { primaryIssue: 'Breakout valido solo con catalyst noto',           suggestion: 'Entra solo con earnings/news come trigger'           }, multiday: { primaryIssue: 'Gap overnight frequente su mid cap',            suggestion: 'Stop fisso obbligatorio, size ridotta'               }, swing: { primaryIssue: 'Gap risk e bassa liquidità su swing',           suggestion: 'Size piccola, stop ampio, solo cash equity'          } } },
  ug_equity_eu_large:  { spread: 3,  swapPerDay: 1.2, thresholdLow: 20, thresholdHigh: 45, texts: { intraday: { primaryIssue: 'Liquidità alta su DE/NL large cap',                suggestion: 'Opera nelle prime 2h apertura Xetra'                 }, multiday: { primaryIssue: 'CFD overnight charge EU accumulato',            suggestion: 'Cash equity per multiday, incassa dividendi'         }, swing: { primaryIssue: 'Financing CFD EU lungo su swing',               suggestion: 'Cash equity EU, dividendi coprono parte del costo'  } } },
  ug_equity_asia:      { spread: 6,  swapPerDay: 2.0, thresholdLow: 28, thresholdHigh: 58, texts: { intraday: { primaryIssue: 'Breakout segue catalyst locali PBOC/BOJ',        suggestion: 'Tokyo: 02:00-08:00 CET, HK: 03:30-09:00'           }, multiday: { primaryIssue: 'Overnight financing + gap valutario FX',        suggestion: 'ETF Nikkei/Hang Seng senza swap'                    }, swing: { primaryIssue: 'Financing + FX exposure su swing Asia',          suggestion: 'ETF hedgiato, evita CFD con leva'                   } } },
  ug_commodity_metal:  { spread: 3,  swapPerDay: 1.0, thresholdLow: 18, thresholdHigh: 42, texts: { intraday: { primaryIssue: 'Spread variabile in overlap London-NY',            suggestion: 'Opera durante London-NY overlap'                     }, multiday: { primaryIssue: 'Swap spot su metalli si accumula nei giorni',   suggestion: 'Futures COMEX per eliminare swap'                   }, swing: { primaryIssue: 'Swap spot metalli pesante su settimane',        suggestion: 'Futures COMEX rolling mensile'                      } } },
  ug_commodity_energy: { spread: 8,  swapPerDay: 2.0, thresholdLow: 30, thresholdHigh: 60, texts: { intraday: { primaryIssue: 'Spread variabile intorno a EIA/OPEC report',     suggestion: 'Non operare 30min prima/dopo report EIA'            }, multiday: { primaryIssue: 'Contango futures petrolio erode la leva',       suggestion: 'Futures rolling attento a contango'                 }, swing: { primaryIssue: 'Contango + rollover su swing energia',          suggestion: 'Valuta struttura futures prima di entrare'          } } },
  ug_crypto_major:     { spread: 6,  swapPerDay: 2.0, thresholdLow: 25, thresholdHigh: 55, texts: { intraday: { primaryIssue: 'Fee taker + spread variabile e liquidazioni',    suggestion: 'Maker-only strategy o exchange con rebate'          }, multiday: { primaryIssue: 'Funding rate perpetual ogni 8h si accumula',   suggestion: 'Monitora funding ogni 8h, chiudi se > 0.1%'         }, swing: { primaryIssue: 'Funding rate perpetual devasta lo swing',       suggestion: 'Spot only per swing crypto, no perp'                } } },
  ug_crypto_altcoin:   { spread: 18, swapPerDay: 3.0, thresholdLow: 45, thresholdHigh: 80, texts: { intraday: { primaryIssue: 'Liquidità bassa, slippage enorme su altcoin',    suggestion: 'Solo altcoin top-20 per intraday'                   }, multiday: { primaryIssue: 'Funding + spread + liquidità bassa accumulati',  suggestion: 'Size tiny, stop molto largo, spot only'             }, swing: { primaryIssue: 'Funding devastante + illiquidità su swing',     suggestion: 'Solo spot, size minima, stop larghissimo'           } } },
};

function computeDrag(ugId: UnderlyingGroupId, horizonId: HorizonId, tradesPerMonth: number, notionale: number): SimResult {
  const { spread, swapPerDay, thresholdLow, thresholdHigh, texts } = UG_PARAMS[ugId];
  const holdingDays  = HORIZON_HOLDING[horizonId];
  const spreadDrag   = spread * tradesPerMonth;
  const swapDrag     = swapPerDay * holdingDays * tradesPerMonth;
  const totalDragBps = Math.round(spreadDrag + swapDrag);
  const totalDragEur = Math.round((totalDragBps / 10_000) * notionale * tradesPerMonth);
  const mid    = (thresholdLow + thresholdHigh) / 2;
  const rating: SimResult['rating'] = totalDragBps <= mid * 0.6 ? 'low' : totalDragBps >= mid * 1.4 ? 'high' : 'medium';
  const { primaryIssue, suggestion } = texts[horizonId];
  return { spreadBps: spread, swapPerDay, tradesPerMonth, notionale, totalDragBps, totalDragEur, rating, primaryIssue, suggestion };
}

// ---------------------------------------------------------------------------
// RATING CONFIG
// ---------------------------------------------------------------------------

const RATING_CONFIG = {
  low:    { icon: CheckCircle2,  colorText: 'text-emerald-600 dark:text-emerald-400', colorBg: 'bg-emerald-500/8 dark:bg-emerald-500/10',  colorBorder: 'border-emerald-500/20 dark:border-emerald-500/25', colorDot: 'bg-emerald-500', label: 'Attrito basso'    },
  medium: { icon: AlertTriangle, colorText: 'text-amber-600 dark:text-amber-400',    colorBg: 'bg-amber-500/8 dark:bg-amber-500/10',      colorBorder: 'border-amber-500/20 dark:border-amber-500/25',    colorDot: 'bg-amber-500',   label: 'Attrito moderato' },
  high:   { icon: TrendingDown,  colorText: 'text-rose-600 dark:text-rose-400',      colorBg: 'bg-rose-500/8 dark:bg-rose-500/10',        colorBorder: 'border-rose-500/20 dark:border-rose-500/25',      colorDot: 'bg-rose-500',    label: 'Attrito elevato'  },
} as const;

// Position size suggestions based on account
function getPositionSuggestions(accountSize: number): { min: number; max: number; typical: number } {
  if (accountSize < 500) return { min: 10, max: 50, typical: 25 };
  if (accountSize < 2000) return { min: 25, max: 100, typical: 50 };
  if (accountSize < 5000) return { min: 50, max: 200, typical: 100 };
  if (accountSize < 10000) return { min: 100, max: 400, typical: 200 };
  if (accountSize < 25000) return { min: 200, max: 800, typical: 400 };
  return { min: Math.round(accountSize * 0.02), max: Math.round(accountSize * 0.06), typical: Math.round(accountSize * 0.04) };
}

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

type SimulatorState = {
  category?:      CategoryId;
  ugId?:          UnderlyingGroupId;
  assetId?:       string;
  horizon?:       HorizonId;
  tradesPerMonth?: TradesPerMonthStep;
  accountSize?:   AccountSizeStep;
  riskPercent?:  RiskPercentStep;
  sizeMode?:      TradeSizeMode;
  positionSize?: number;
  lotSize?:       number;
};

// ---------------------------------------------------------------------------
// MOTION CONSTANTS
// ---------------------------------------------------------------------------

// SOTA 2026: Natural spring physics for smooth animations
const EASE_OUT      = [0.25, 0.46, 0.45, 0.94] as [number,number,number,number];
const EASE_SPRING    = { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.85 };
const EASE_SPRING_FAST = { type: 'spring' as const, stiffness: 400, damping: 32, mass: 0.7 };
const EASE_FAST     = { duration: 0.14, ease: EASE_OUT };
const EASE_GLIDE    = { duration: 0.32, ease: [0.22, 0.65, 0.35, 0.95] };

// SOTA 2026: Directional step transitions - slide from direction of travel
const stepVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 30,
    scale: 0.98,
    filter: 'blur(2px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -30,
    scale: 0.98,
    filter: 'blur(2px)',
  }),
};

// Staggered children for list animations
const staggerChildren = (delay: number = 0.05) => ({
  transition: { staggerChildren: delay, delayChildren: 0.02 }
});

const stepFade = {
  initial:  { opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' },
  animate:  { opacity: 1, y: 0,  scale: 1, filter: 'blur(0px)', transition: { ...EASE_SPRING, delay: 0.02 } },
  exit:     { opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)', transition: { duration: 0.12, ease: 'easeOut' }, position: 'absolute' as const },
};

const slideUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { ...EASE_SPRING } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.10 } },
};

const DISMISS_VEL = 450;
const DISMISS_Y   = 80;

// ---------------------------------------------------------------------------
// HOOK: isMobile
// ---------------------------------------------------------------------------

function useIsMobile() {
  const [v, set] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    set(mq.matches);
    const h = (e: MediaQueryListEvent) => set(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return v;
}

// ---------------------------------------------------------------------------
// BOTTOM SHEET — portalled to document.body (solo iOS-grade)
// ---------------------------------------------------------------------------

function BottomSheet({
  open, onClose, children, footer, stepLabel, step = 0,
}: {
  open:       boolean;
  onClose:    () => void;
  children:   React.ReactNode;
  footer?:    React.ReactNode;
  stepLabel?: string;
  step?:      number;
}) {
  const y          = useMotionValue(0);
  
  // SOTA 2026: Smart height that adapts to content - not fixed
  // Use CSS calc with dvh for proper viewport calculation
  // Min ensures content is never cramped, max prevents too tall
  const baseHeight = {
    0: 58, // Category selection - 5 items
    1: 68, // Asset selection  
    2: 72, // Horizon + trades
    3: 78, // Account + risk
    4: 88, // Results - needs most space
  }[step] ?? 70;
  
  // Use height that adapts: more height for earlier steps with scroll, max for results
  const SHEIGHT = step >= 4 ? 88 : 90 - (step * 5); // 85 → 80 → 75 → 70
  
  // Backdrop va da 1 a 0 man mano che si trascina verso il basso
  const bgOpacity  = useTransform(y, [0, DISMISS_Y * 2], [1, 0]);
  // Sheet scala leggermente in basso durante il drag per feedback fisico
  const sheetScale = useTransform(y, [0, DISMISS_Y],     [1, 0.984]);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Blocca scroll del body quando lo sheet è aperto
  useEffect(() => {
    const body = document.body;
    if (open) {
      animate(y, 0, { type: 'spring', stiffness: 440, damping: 44 });
      body.style.overflow    = 'hidden';
      body.style.touchAction = 'none';
    } else {
      body.style.overflow    = '';
      body.style.touchAction = '';
    }
    return () => {
      body.style.overflow    = '';
      body.style.touchAction = '';
    };
  }, [open, y]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (info.offset.y > DISMISS_Y || info.velocity.y > DISMISS_VEL) {
        animate(y, window.innerHeight, { duration: 0.28, ease: EASE_OUT }).then(onClose);
      } else {
        animate(y, 0, { type: 'spring', stiffness: 440, damping: 44 });
      }
    },
    [y, onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── z-[9998] ──────────────────────────── */}
          <motion.div
            key="sim-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            transition={{ duration: 0.18 }}
            style={{ opacity: bgOpacity }}
            className="fixed inset-0 z-[9998]"
            style={{
              // @ts-ignore
              opacity: bgOpacity,
              background: 'radial-gradient(circle at 50% 120%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 60%, rgba(0,0,0,0.42) 100%)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
            onClick={onClose}
            aria-hidden
          />

          {/* ── Sheet ── z-[9999] ─────────────────────────────── */}
          <motion.div
            key="sim-sh"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.28, ease: EASE_OUT } }}
            transition={EASE_SPRING}
            style={{ y, scale: sheetScale }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.32 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-label={stepLabel ?? 'Simulatore'}
            className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col"
            style={{
              // @ts-ignore
              y,
              scale: sheetScale,
              /* ── SOTA 2026 Liquid Glass ── */
              background:            'var(--glass-material-bg, hsl(var(--background)))',
              backdropFilter:        'blur(var(--glass-material-blur, 28px)) saturate(var(--glass-material-saturate, 200%))',
              WebkitBackdropFilter:  'blur(var(--glass-material-blur, 28px)) saturate(var(--glass-material-saturate, 200%))',
              border:                '1px solid var(--glass-material-border, rgba(255,255,255,0.08))',
              borderBottom:          'none',
              borderTopLeftRadius:   '28px',
              borderTopRightRadius: '28px',
              /* SOTA 2026 Quintuple shadow + ambient */
              boxShadow: [
                '0 -24px 64px rgba(0,0,0,0.28)',
                '0 -12px 32px rgba(0,0,0,0.18)',
                '0 -6px 16px rgba(0,0,0,0.12)',
                '0 -2px 8px rgba(0,0,0,0.08)',
                '0 0 96px rgba(59,130,246,0.06)',
              ].join(', '),
              height:    `${SHEIGHT}dvh`,
              maxHeight: `${SHEIGHT}dvh`,
              /* GPU */
              transform:  'translateZ(0)',
              willChange: 'transform',
            }}
          >
            {/* ── Chrome: handle + header ─────────────────────── */}
            <SheetChrome stepLabel={stepLabel} onClose={onClose} />

            {/* ── Scrollable body ─────────────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{
                WebkitOverflowScrolling: 'touch',
                /* scrollbar sottilissima coerente col custom-scrollbar-2026.css */
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.12) transparent',
                paddingInline: '20px',
                paddingBottom: '12px',
                minHeight: step >= 4 ? '0px' : 'min(320px, 50dvh)',
              }}
            >
              {children}
            </div>

            {/* ── CTA footer ──────────────────────────────────── */}
            <AnimatePresence>
              {footer && (
                <motion.div
                  key="sh-footer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
                  exit={{ opacity: 0, y: 6, transition: { duration: 0.14 } }}
                  className="shrink-0"
                  style={{
                    padding: '14px 20px',
                    paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 22px)',
                    borderTop: '1px solid var(--glass-material-border, rgba(0,0,0,0.06))',
                    background: 'var(--glass-material-bg, hsl(var(--background)))',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  {footer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// SHEET CHROME — handle + label + close
// ---------------------------------------------------------------------------

function SheetChrome({ stepLabel, onClose }: { stepLabel?: string; onClose: () => void }) {
  return (
    <div
      className="shrink-0 flex items-center"
      style={{
        paddingInline: '24px',
        paddingTop:    '14px',
        paddingBottom: '6px',
        position:      'relative',
        minHeight:     '56px',
      }}
    >
      {/* SOTA 2026 Handle pill with glow */}
      <div
        aria-hidden
        style={{
          position:        'absolute',
          top:             '12px',
          left:            '50%',
          transform:       'translateX(-50%)',
          width:           '40px',
          height:         '5px',
          borderRadius:   '3px',
          background:    'currentColor',
          opacity:       0.22,
          pointerEvents: 'none',
          boxShadow:    '0 0 12px currentColor',
        }}
      />

      {/* Step label — sinistra, piccolo, monocromatico */}
      {stepLabel && (
        <span
          style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '10px',
            fontWeight:    600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'hsl(var(--muted-foreground))',
            opacity:       0.5,
            paddingTop:    '10px',
            userSelect:    'none',
          }}
        >
          {stepLabel}
        </span>
      )}

      {/* SOTA 2026 Close button — 44×44 touch target */}
      <button
        onClick={onClose}
        aria-label="Chiudi"
        style={{
          marginLeft:    'auto',
          marginTop:   '10px',
          display:     'flex',
          alignItems:  'center',
          justifyContent:'center',
          width:      '44px',
          height:     '44px',
          borderRadius:'50%',
          border:     '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)',
          color:     'rgba(255,255,255,0.65)',
          cursor:    'pointer',
          transition:'background 160ms ease, color 160ms ease, transform 120ms ease',
          flexShrink: 0,
          outline:   'none',
        }}
        onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.90)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
        onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
        onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
      >
        <X size={16} strokeWidth={2.2} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STEP CONTENT — condiviso tra mobile sheet e desktop inline
// ---------------------------------------------------------------------------

type StepContentProps = {
  step:                 number;
  sel:                  SimulatorState;
  forexSub:             ForexSubgroup;
  filteredUGs:          typeof UNDERLYING_GROUPS[number][];
  tradesIdx:            number;
  tradesValue:          TradesPerMonthStep;
  accountIdx:           number;
  accountValue:         AccountSizeStep;
  showTradesSlider:     boolean;
  showAccountSlider:    boolean;
  isMobile:             boolean;
  step2Ready:           boolean;
  step3Ready:           boolean;
  result:               SimResult | null;
  onCategory:           (id: CategoryId) => void;
  onForexAsset:         (a: ForexAsset) => void;
  onUG:                 (id: UnderlyingGroupId) => void;
  onHorizon:            (id: HorizonId) => void;
  onTradesPreset:       (v: TradesPerMonthStep) => void;
  onAccountPreset:      (v: AccountSizeStep) => void;
  onRisk:               (r: RiskPercentStep) => void;
  onConfirmStep2:       () => void;
  onConfirmStep3:       () => void;
  onReset:              () => void;
  onNavTo:              (t: number) => void;
  setForexSub:          (s: ForexSubgroup) => void;
  setShowTradesSlider:  React.Dispatch<React.SetStateAction<boolean>>;
  setShowAccountSlider: React.Dispatch<React.SetStateAction<boolean>>;
  setSel:               React.Dispatch<React.SetStateAction<SimulatorState>>;
  setTradesIdx:         React.Dispatch<React.SetStateAction<number>>;
  setAccountIdx:        React.Dispatch<React.SetStateAction<number>>;
};

function StepContent(p: StepContentProps) {
  const step1Crumb =
    p.sel.category === 'forex' && p.sel.assetId
      ? (FOREX_ASSETS.find(a => a.id === p.sel.assetId)?.label ?? '')
      : (UNDERLYING_GROUPS.find(u => u.id === p.sel.ugId)?.label ?? '');

  const PROMPTS = [
    'Cosa tradi principalmente?',
    p.sel.category === 'forex' ? 'Quale coppia?' : 'Sottogruppo?',
    'Come operi?',
    'Profilo operativo',
    null,
  ] as const;

  return (
    <div className="flex flex-col" style={{ paddingTop: '6px' }}>

      {/* ── Progress ──────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <button
            key={i}
            onClick={() => p.onNavTo(i)}
            disabled={i >= p.step}
            aria-label={`Step ${i + 1}`}
            style={{
              height:           '4px',
              borderRadius:     '2px',
              border:           'none',
              cursor:           i < p.step ? 'pointer' : 'default',
              transition:       'all 280ms cubic-bezier(0.25,0.46,0.45,0.94)',
              background:       i < p.step
                ? 'hsl(var(--primary))'
                : i === p.step
                ? 'hsl(var(--primary) / 0.28)'
                : 'hsl(var(--border) / 0.5)',
              width:            i <= p.step ? '28px' : '12px',
              flexShrink:       0,
              outline:          'none',
            }}
          />
        ))}
        <span
          style={{
            marginLeft:    'auto',
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '10px',
            fontWeight:    600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color:         'hsl(var(--muted-foreground))',
            opacity:       0.38,
          }}
        >
          {p.step < 4 ? `${p.step + 1}\u00a0/\u00a04` : 'Risultato'}
        </span>
      </div>

      {/* ── Prompt ────────────────────────────────────────── */}
      <div style={{ height: '28px', marginBottom: '16px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {PROMPTS[p.step] && (
            <motion.p
              key={p.step}
              variants={stepFade}
              initial="initial" animate="animate" exit="exit"
              style={{
                fontSize:      '16px',
                fontWeight:    600,
                letterSpacing: '-0.01em',
                lineHeight:    '28px',
                color:         'hsl(var(--foreground))',
                position:      'absolute',
                inset:         0,
              }}
            >
              {PROMPTS[p.step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Steps ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: '220px' }}>
        <AnimatePresence mode="wait">

          {/* STEP 0 */}
          {p.step === 0 && (
            <motion.div key="s0" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full grid grid-cols-2 gap-2.5">
              {CATEGORIES.map(c => (
                <OptionCard key={c.id} icon={c.icon} title={c.label} desc={c.desc}
                  onClick={() => p.onCategory(c.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 1 — forex */}
          {p.step === 1 && p.sel.category === 'forex' && (
            <motion.div key="s1-fx" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-4">
              <div className="flex gap-2">
                {FOREX_SUBGROUPS.map(sg => (
                  <SubTab key={sg.id} active={p.forexSub === sg.id} onClick={() => p.setForexSub(sg.id)}>
                    {sg.label}
                  </SubTab>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={p.forexSub}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0, transition: EASE_FAST }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="grid grid-cols-3 gap-2">
                  {FOREX_ASSETS.filter(a => a.subgroup === p.forexSub).map(a => (
                    <Pill key={a.id} selected={p.sel.assetId === a.id} onClick={() => p.onForexAsset(a)}>
                      {a.label}
                    </Pill>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 1 — altri */}
          {p.step === 1 && p.sel.category !== 'forex' && (
            <motion.div key="s1-o" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-2">
              {p.filteredUGs.map(ug => (
                <UGRow key={ug.id} label={ug.label} desc={ug.desc} onClick={() => p.onUG(ug.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 2 */}
          {p.step === 2 && (
            <motion.div key="s2" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-5">

              <SectionLabel>Orizzonte tipico</SectionLabel>
              <div className="grid grid-cols-3 gap-2">
                {HORIZONS.map(h => (
                  <OptionCard key={h.id} icon={h.icon} title={h.label} desc={h.desc}
                    selected={p.sel.horizon === h.id} onClick={() => p.onHorizon(h.id)} />
                ))}
              </div>

              <AnimatePresence>
                {p.sel.horizon && (
                  <motion.div key="trades-section" variants={slideUp} initial="initial" animate="animate" exit="exit"
                    className="flex flex-col gap-2.5">
                    <SectionLabel>Trade / mese</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {TRADES_PRESETS.map(pr => (
                        <Pill key={pr.value}
                          selected={p.sel.tradesPerMonth === pr.value && !p.showTradesSlider}
                          onClick={() => p.onTradesPreset(pr.value)}>
                          {pr.label}
                        </Pill>
                      ))}
                      <SliderToggle
                        active={p.showTradesSlider}
                        onClick={() => { p.setShowTradesSlider(v => !v); p.setSel(s => ({ ...s, tradesPerMonth: undefined })); }}
                      />
                    </div>
                    <AnimatePresence>
                      {p.showTradesSlider && (
                        <motion.div variants={slideUp} initial="initial" animate="animate" exit="exit"
                          className="flex flex-col gap-2.5">
                          <SliderDisplay value={String(p.tradesValue)} unit="trade / mese">
                            {p.tradesValue >= 200 && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px]"
                                style={{
                                  background: 'hsl(var(--warning, 45 100% 50%) / 0.1)',
                                  color: 'hsl(var(--warning, 45 100% 40%))',
                                  border: '1px solid hsl(var(--warning, 45 100% 50%) / 0.2)',
                                }}>
                                <Zap size={11} /> Alta freq.
                              </motion.span>
                            )}
                          </SliderDisplay>
                          <StepSlider
                            value={p.tradesIdx}
                            max={TRADES_PER_MONTH_STEPS.length - 1}
                            onChange={i => { p.setTradesIdx(i); p.setSel(s => ({ ...s, tradesPerMonth: TRADES_PER_MONTH_STEPS[i] })); }}
                          />
                          <SliderTicks labels={['1', 'swing', 'intraday', 'scalping', '500']} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {!p.isMobile && p.step2Ready && (
                <motion.div variants={slideUp} initial="initial" animate="animate">
                  <CtaButton onClick={p.onConfirmStep2}>Continua <ArrowRight size={16} /></CtaButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3 */}
          {p.step === 3 && (
            <motion.div key="s3" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-5">

              <div className="flex flex-col gap-2.5">
                <SectionLabel>Capitale sul conto</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {ACCOUNT_PRESETS.map(pr => (
                    <Pill key={pr.value}
                      selected={p.sel.accountSize === pr.value && !p.showAccountSlider}
                      onClick={() => p.onAccountPreset(pr.value)}>
                      {pr.label}
                    </Pill>
                  ))}
                  <SliderToggle
                    active={p.showAccountSlider}
                    onClick={() => { p.setShowAccountSlider(v => !v); p.setSel(s => ({ ...s, accountSize: undefined })); }}
                  />
                </div>
                <AnimatePresence>
                  {p.showAccountSlider && (
                    <motion.div variants={slideUp} initial="initial" animate="animate" exit="exit"
                      className="flex flex-col gap-2.5">
                      <SliderDisplay value={formatAccountSize(p.accountValue)} unit="sul conto" />
                      <StepSlider
                        value={p.accountIdx}
                        max={ACCOUNT_SIZE_STEPS.length - 1}
                        onChange={i => { p.setAccountIdx(i); p.setSel(s => ({ ...s, accountSize: ACCOUNT_SIZE_STEPS[i] })); }}
                      />
                      <SliderTicks labels={['50€', 'micro', 'retail', 'pro', '500k+']} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-2.5">
                <SectionLabel>Dimensione operazione</SectionLabel>
                <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', opacity: 0.6, marginTop: '-8px', marginBottom: '2px' }}>
                  Quanto è grande una singola operazione che apri?
                </p>
                <p style={{ fontSize: '9px', color: 'hsl(var(--muted-foreground))', opacity: 0.45, marginTop: '-4px', marginBottom: '4px' }}>
                  Serve per calcolare costi di spread e commissioni
                </p>
                
                {/* Size Mode Selector */}
                <div className="flex gap-2" style={{ marginBottom: '8px' }}>
                  {SIZE_MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => p.setSel(s => ({ ...s, sizeMode: mode.id }))}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: p.sel.sizeMode === mode.id
                          ? '1.5px solid hsl(var(--primary) / 0.7)'
                          : '1px solid hsl(var(--border))',
                        background: p.sel.sizeMode === mode.id
                          ? 'hsl(var(--primary) / 0.1)'
                          : 'transparent',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: p.sel.sizeMode === mode.id
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--foreground))',
                        cursor: 'pointer',
                        transition: 'all 180ms ease',
                      }}
                    >
                      <mode.Icon size={16} />
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>

                {/* Dynamic input based on mode */}
                {p.sel.sizeMode === 'amount' && p.sel.accountSize && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {getTradeSizePills(p.sel.accountSize).map(size => (
                      <button
                        key={size}
                        onClick={() => p.setSel(s => ({ ...s, positionSize: size }))}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid hsl(var(--border))',
                          background: p.sel.positionSize === size ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          fontSize: '13px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono, monospace)',
                          color: p.sel.positionSize === size ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                          cursor: 'pointer',
                        }}
                      >
                        {formatAccountSize(size)}
                      </button>
                    ))}
                  </div>
                )}
                
                {p.sel.sizeMode === 'lots' && p.sel.accountSize && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {getLotSizes(p.sel.accountSize, p.sel.ugId).map(lot => (
                      <button
                        key={lot}
                        onClick={() => p.setSel(s => ({ ...s, lotSize: lot, positionSize: lotsToMargin(lot, s.ugId) }))}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid hsl(var(--border))',
                          background: p.sel.lotSize === lot ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          fontSize: '13px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono, monospace)',
                          color: p.sel.lotSize === lot ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                          cursor: 'pointer',
                        }}
                      >
                        {lot} lot ({formatAccountSize(lotsToMargin(lot, p.sel.ugId))})
                      </button>
                    ))}
                  </div>
                )}

                {p.sel.sizeMode === 'auto' && p.sel.accountSize && (() => {
                  const auto = deriveTradeSizeAuto(p.sel.accountSize, p.sel.ugId);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        background: 'hsl(var(--primary) / 0.06)',
                        border: '1px solid hsl(var(--primary) / 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                          Margine stimato
                        </span>
                        <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', opacity: 0.6, textTransform: 'capitalize' }}>
                          {auto.profile}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '18px', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                          {formatAccountSize(auto.size)}
                        </span>
                        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}>
                          {auto.lotSize.toFixed(2)} lotti ({auto.leverage}×)
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Exposure display */}
                {p.sel.positionSize && p.sel.ugId && (
                  <motion.div key="notionale" variants={slideUp} initial="initial" animate="animate"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'hsl(var(--muted) / 0.08)',
                      border: '1px solid hsl(var(--border) / 0.3)',
                    }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'hsl(var(--foreground))',
                      letterSpacing: '0.02em',
                    }}>
                      Esposizione stimata
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'hsl(var(--primary))',
                    }}>
                      {formatAccountSize(p.sel.positionSize)}
                    </span>
                  </motion.div>
                )}
              </div>

              {!p.isMobile && p.step3Ready && (
                <motion.div variants={slideUp} initial="initial" animate="animate">
                  <CtaButton onClick={p.onConfirmStep3}>Vedi i risultati <ArrowRight size={16} /></CtaButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 4 */}
          {p.step === 4 && p.result && p.sel.ugId && p.sel.horizon && (
            <ResultView result={p.result} sel={p.sel} onReset={p.onReset} />
          )}

        </AnimatePresence>
      </div>

      {/* ── Breadcrumb ────────────────────────────────────── */}
      {p.step > 0 && p.step < 4 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 flex-wrap"
          style={{ marginTop: '20px' }}
        >
          {p.sel.category && (
            <Crumb onClick={() => p.onNavTo(0)}>
              {CATEGORIES.find(c => c.id === p.sel.category)?.label}
            </Crumb>
          )}
          {p.step > 1 && p.sel.ugId && (
            <><Slash /><Crumb onClick={() => p.onNavTo(1)}>{step1Crumb}</Crumb></>
          )}
          {p.step > 2 && p.sel.horizon && (
            <><Slash />
            <Crumb onClick={() => p.onNavTo(2)}>
              {HORIZONS.find(h => h.id === p.sel.horizon)?.label}
              {p.sel.tradesPerMonth && <span style={{ opacity: 0.38 }}>&nbsp;·&nbsp;{p.sel.tradesPerMonth}/mo</span>}
            </Crumb></>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------

export function InteractiveSimulator() {
  const [step,               setStep]               = useState(0);
  const [sel,                setSel]                = useState<SimulatorState>({});
  const [forexSub,           setForexSub]           = useState<ForexSubgroup>('major');
  const [sheetOpen,          setSheetOpen]          = useState(false);
  const [tradesIdx,          setTradesIdx]          = useState(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
  const [accountIdx,         setAccountIdx]         = useState(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
  const [showTradesSlider,   setShowTradesSlider]   = useState(false);
  const [showAccountSlider,  setShowAccountSlider]  = useState(false);
  const [direction,         setDirection]         = useState(0); // 1 = forward, -1 = back

  const isMobile     = useIsMobile();
  const tradesValue  = TRADES_PER_MONTH_STEPS[tradesIdx];
  const accountValue = ACCOUNT_SIZE_STEPS[accountIdx];
  const filteredUGs  = sel.category
    ? UNDERLYING_GROUPS.filter(u => u.categoryId === sel.category)
    : [];

  // ── handlers ──────────────────────────────────────────────

  // Scroll to center simulator in viewport on step change (desktop)
  const scrollToContent = () => {
    setTimeout(() => {
      // Get the simulator container
      const container = document.querySelector('.simulator-container');
      if (!container) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = rect.height;
      
      // Calculate center position
      const targetTop = window.scrollY + rect.top - (viewportHeight - containerHeight) / 2;
      
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
      
      // Also scroll sheet content to top if exists
      const scrollEl = document.querySelector('[data-sheet-content]');
      if (scrollEl) scrollEl.scrollTop = 0;
    }, 80);
  };

  const handleCategory = (id: CategoryId) => {
    setSel({ category: id });
    setForexSub('major');
    setDirection(1);
    setStep(1);
    scrollToContent();
    if (isMobile) setSheetOpen(true);
  };

  const handleForexAsset = (a: ForexAsset) => {
    setSel(p => ({ ...p, ugId: ASSET_TO_UG[a.id], assetId: a.id }));
    setDirection(1);
    setStep(2);
    scrollToContent();
  };

  const handleUG = (id: UnderlyingGroupId) => {
    setSel(p => ({ ...p, ugId: id, assetId: undefined }));
    setDirection(1);
    setStep(2);
    scrollToContent();
  };

  const handleHorizon    = (id: HorizonId)      => setSel(p => ({ ...p, horizon: id }));
  const handleRisk       = (r: RiskPercentStep) => setSel(p => ({ ...p, riskPercent: r }));

  const handleTradesPreset = (v: TradesPerMonthStep) => {
    setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(v));
    setSel(p => ({ ...p, tradesPerMonth: v }));
    setShowTradesSlider(false);
  };
  const handleAccountPreset = (v: AccountSizeStep) => {
    setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(v));
    setSel(p => ({ ...p, accountSize: v }));
    setShowAccountSlider(false);
  };

  const handleConfirmStep2 = () => {
    if (!sel.horizon) return;
    setSel(p => ({ ...p, tradesPerMonth: p.tradesPerMonth ?? tradesValue }));
    setStep(3);
  };
  const handleConfirmStep3 = () => {
    if (!sel.riskPercent) return;
    setSel(p => ({ ...p, accountSize: p.accountSize ?? accountValue }));
    setStep(4);
  };

  const navTo = (t: number) => {
    if (t >= step) return;
    setDirection(t < step ? -1 : 1);
    setShowTradesSlider(false);
    setShowAccountSlider(false);
    if (t <= 0) {
      setSel({}); setForexSub('major');
      setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
      setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
    } else if (t === 1) {
      setSel(p => ({ category: p.category }));
    } else if (t === 2) {
      setSel(p => ({ category: p.category, ugId: p.ugId, assetId: p.assetId }));
      setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
    } else if (t === 3) {
      setSel(p => ({ ...p, accountSize: undefined, riskPercent: undefined }));
    }
    setStep(t);
    scrollToContent();
  };

  const reset = () => {
    setSel({}); setForexSub('major');
    setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
    setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
    setShowTradesSlider(false); setShowAccountSlider(false);
    setStep(0);
    // sheetOpen invariato — step0 mostrato dentro lo sheet
  };

  // ── derived ───────────────────────────────────────────────

  const step2Ready  = !!(sel.horizon && (sel.tradesPerMonth ?? tradesValue));
  const step3Ready  = !!sel.riskPercent;
  const notionale   = sel.ugId && sel.riskPercent
    ? deriveNotional(sel.accountSize ?? accountValue, sel.riskPercent, sel.ugId)
    : null;
  const result: SimResult | null =
    step === 4 && sel.ugId && sel.horizon && sel.tradesPerMonth && notionale
      ? computeDrag(sel.ugId, sel.horizon, sel.tradesPerMonth, notionale)
      : null;

  const sheetFooter =
    step === 2 && step2Ready ? (
      <CtaButton full onClick={handleConfirmStep2}>Continua <ArrowRight size={16} /></CtaButton>
    ) : step === 3 && step3Ready ? (
      <CtaButton full onClick={handleConfirmStep3}>Vedi i risultati <ArrowRight size={16} /></CtaButton>
    ) : null;

  const STEP_PROMPTS = [
    'Cosa tradi principalmente?',
    sel.category === 'forex' ? 'Quale coppia?' : 'Sottogruppo?',
    'Come operi?',
    'Profilo operativo',
  ];

  const sharedProps: StepContentProps = {
    step, sel, forexSub, filteredUGs: filteredUGs as typeof UNDERLYING_GROUPS[number][],
    tradesIdx, tradesValue, accountIdx, accountValue,
    showTradesSlider, showAccountSlider,
    isMobile, step2Ready, step3Ready, result,
    onCategory: handleCategory, onForexAsset: handleForexAsset, onUG: handleUG,
    onHorizon: handleHorizon, onTradesPreset: handleTradesPreset,
    onAccountPreset: handleAccountPreset, onRisk: handleRisk,
    onConfirmStep2: handleConfirmStep2, onConfirmStep3: handleConfirmStep3,
    onReset: reset, onNavTo: navTo,
    setForexSub, setShowTradesSlider, setShowAccountSlider,
    setSel, setTradesIdx, setAccountIdx,
  };

  // ── render ────────────────────────────────────────────────

  return (
    <div className="w-full simulator-container" style={{ padding: '20px 16px 20px', maxWidth: '480px' }}>

      {/* Step 0 — sempre inline (mobile + desktop) */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0-inline" variants={stepFade} initial="initial" animate="animate" exit="exit"
            className="flex flex-col gap-3">
            <p style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', color: 'hsl(var(--foreground))' }}>
              Cosa tradi principalmente?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map(c => (
                <OptionCard key={c.id} icon={c.icon} title={c.label} desc={c.desc}
                  onClick={() => handleCategory(c.id)} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Desktop — step 1-4 inline */}
        {!isMobile && step > 0 && (
          <motion.div key="desktop-steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StepContent {...sharedProps} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile recap pill — visibile solo se sheet chiuso e step > 0 */}
      {isMobile && step > 0 && !sheetOpen && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
          className="flex items-center gap-3 mt-3"
          style={{
            borderRadius:    '16px',
            border:          '1px solid var(--glass-material-border, hsl(var(--border)))',
            background:      'hsl(var(--muted) / 0.3)',
            backdropFilter:  'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding:         '10px 14px',
          }}
        >
          <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
            {([
              sel.category && CATEGORIES.find(c => c.id === sel.category)?.label,
              step > 1 && (UNDERLYING_GROUPS.find(u => u.id === sel.ugId)?.label ||
                           FOREX_ASSETS.find(a => a.id === sel.assetId)?.label),
              step > 2 && sel.horizon && HORIZONS.find(h => h.id === sel.horizon)?.label,
            ] as (string | false | undefined)[]).filter(Boolean).map((s, i) => (
              <span key={i}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                  color: 'hsl(var(--foreground))', opacity: 0.55,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                }}>
                {i > 0 && <span style={{ opacity: 0.3, marginRight: '6px' }}>·</span>}
                {s}
              </span>
            ))}
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              height: '34px', borderRadius: '999px',
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none', cursor: 'pointer',
              padding: '0 14px',
              fontSize: '12px', fontWeight: 600,
              transition: 'opacity 140ms ease, transform 120ms ease',
            }}
            onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
            onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            Continua <ArrowRight size={13} />
          </button>
        </motion.div>
      )}

      {/* Bottom Sheet — portalled */}
      {isMobile && (
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          footer={sheetFooter}
          stepLabel={step < 4 ? STEP_PROMPTS[step] : undefined}
          step={step}
        >
          <StepContent {...sharedProps} />
        </BottomSheet>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RESULT VIEW
// ---------------------------------------------------------------------------

function ResultView({ result, sel, onReset }: { result: SimResult; sel: SimulatorState; onReset: () => void }) {
  const cfg  = RATING_CONFIG[result.rating];
  const Icon = cfg.icon;
  const assetLabel = sel.assetId
    ? FOREX_ASSETS.find(a => a.id === sel.assetId)?.label
    : UNDERLYING_GROUPS.find(u => u.id === sel.ugId)?.label;

  return (
    <motion.div key="s4"
      initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="w-full flex flex-col"
      style={{ gap: '10px' }}
    >
      {/* Rating card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { delay: 0.04, duration: 0.32, ease: EASE_OUT } }}
        className={cn('flex items-start gap-3 rounded-2xl border px-4 py-4', cfg.colorBg, cfg.colorBorder)}
      >
        {/* Dot + icon */}
        <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
          <div className={cn('size-2 rounded-full shrink-0', cfg.colorDot)} />
          <Icon size={16} className={cfg.colorText} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-mono text-[9px] font-bold uppercase tracking-[0.22em]', cfg.colorText)}>
            {cfg.label}
          </p>
          <p style={{ fontSize: '12px', color: 'hsl(var(--foreground) / 0.72)', lineHeight: '1.55', marginTop: '4px' }}>
            {result.primaryIssue}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn('font-mono text-[22px] font-bold tabular-nums leading-none', cfg.colorText)}>
            {result.totalDragBps}
            <span className="text-[11px] font-semibold ml-0.5 opacity-70">bps</span>
          </p>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
            ≈{result.totalDragEur}€/mese
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Spread/trade', value: `${result.spreadBps} bps`          },
          { label: 'Trade/mese',   value: `${result.tradesPerMonth}`          },
          { label: 'Notionale',    value: formatAccountSize(result.notionale) },
        ].map(({ label, value }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.16 + i * 0.06, duration: 0.24, ease: EASE_OUT } }}
            style={{
              borderRadius: '14px',
              border: '1px solid hsl(var(--border) / 0.7)',
              background: 'hsl(var(--muted) / 0.25)',
              padding: '10px 8px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'hsl(var(--muted-foreground))', opacity: 0.55 }}>{label}</p>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', fontWeight: 700, marginTop: '4px', color: 'hsl(var(--foreground))' }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.30, duration: 0.26, ease: EASE_OUT } }}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          borderRadius: '14px',
          border: '1px solid hsl(var(--border) / 0.6)',
          background: 'hsl(var(--muted) / 0.18)',
          padding: '12px 14px',
        }}
      >
        <ArrowRight size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'hsl(var(--primary))' }} />
        <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))' }}>
          <span style={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>Cosa fare: </span>
          {result.suggestion}
        </p>
      </motion.div>

      {/* Tags + reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.42, duration: 0.24, ease: EASE_OUT } }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            CATEGORIES.find(c => c.id === sel.category)?.label,
            assetLabel,
            sel.horizon,
            sel.tradesPerMonth ? `${sel.tradesPerMonth}/mo` : null,
            sel.riskPercent   ? `${sel.riskPercent}%`       : null,
          ].filter(Boolean).map(s => (
            <span key={s} style={{
              borderRadius: '999px',
              border: '1px solid hsl(var(--border) / 0.5)',
              background: 'hsl(var(--muted) / 0.3)',
              padding: '3px 10px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase' as const,
              color: 'hsl(var(--muted-foreground))',
            }}>{s}</span>
          ))}
        </div>
        <button onClick={onReset}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            borderRadius: '999px',
            border: '1px solid hsl(var(--border))',
            background: 'transparent',
            padding: '5px 12px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            color: 'hsl(var(--muted-foreground))',
            cursor: 'pointer',
            transition: 'color 150ms ease, border-color 150ms ease',
          }}
        >
          <RotateCcw size={11} /> Ricomincia
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// PRIMITIVES
// ---------------------------------------------------------------------------

function OptionCard({ icon: Icon, title, desc, onClick, selected = false }: {
  icon: React.ElementType; title: string; desc?: string; onClick: () => void; selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'flex-start',
        gap:            '12px',
        padding:        '18px',
        borderRadius:   '20px',
        border:         selected
          ? '1.5px solid hsl(var(--primary) / 0.7)'
          : '1px solid hsl(var(--border))',
        background:     selected
          ? 'hsl(var(--primary) / 0.12)'
          : 'transparent',
        textAlign:      'left',
        cursor:         'pointer',
        transition:     'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        minHeight:      '88px',
        outline:        'none',
        boxShadow:      selected
          ? '0 0 0 1px hsl(var(--primary) / 0.2), 0 4px 16px hsl(var(--primary) / 0.12)'
          : '0 2px 6px rgba(0,0,0,0.06), 0 0 0 hsl(var(--border) / 0)',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96) translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 0 1px hsl(var(--primary) / 0.2), 0 1px 4px hsl(var(--primary) / 0.08)'
          : '0 1px 2px rgba(0,0,0,0.04)';
      }}
      onPointerUp={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(-2px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 0 1px hsl(var(--primary) / 0.2), 0 4px 16px hsl(var(--primary) / 0.12)'
          : '0 8px 24px rgba(0,0,0,0.12), 0 0 0 hsl(var(--primary) / 0.15)';
      }}
      onPointerLeave={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 0 1px hsl(var(--primary) / 0.2), 0 4px 16px hsl(var(--primary) / 0.12)'
          : '0 2px 6px rgba(0,0,0,0.06)';
      }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1), 0 0 0 hsl(var(--primary) / 0.08)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 0 1px hsl(var(--primary) / 0.2), 0 4px 16px hsl(var(--primary) / 0.12)'
          : '0 2px 6px rgba(0,0,0,0.06)';
      }}
    >
      <Icon
        size={20}
        strokeWidth={1.8}
        style={{
          color: selected ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.45)',
          transition: 'color 160ms ease',
        }}
      />
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: '20px' }}>
          {title}
        </p>
        {desc && (
          <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', opacity: 0.7, marginTop: '3px', lineHeight: '15px' }}>
            {desc}
          </p>
        )}
      </div>
    </button>
  );
}

function Pill({ children, selected, onClick }: {
  children: React.ReactNode; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        height:        '44px',
        borderRadius:   '999px',
        border:        selected
          ? '1.5px solid hsl(var(--primary) / 0.65)'
          : '1px solid hsl(var(--border))',
        background:    selected ? 'hsl(var(--primary) / 0.12)' : 'transparent',
        padding:       '0 18px',
        fontFamily:   'var(--font-mono, monospace)',
        fontSize:     '13px',
        fontWeight:   700,
        letterSpacing:'0.03em',
        color:         selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        cursor:        'pointer',
        transition:    'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        outline:       'none',
        boxShadow:    selected ? '0 0 10px hsl(var(--primary) / 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)'; 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 6px hsl(var(--primary) / 0.08)' 
          : 'inset 0 1px 2px rgba(0,0,0,0.06)';
      }}
      onPointerUp={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 10px hsl(var(--primary) / 0.12)' 
          : '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onPointerLeave={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 10px hsl(var(--primary) / 0.12)' 
          : '0 1px 3px rgba(0,0,0,0.04)';
      }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--muted) / 0.15)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = selected ? 'hsl(var(--primary) / 0.12)' : 'transparent';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected 
          ? '0 0 10px hsl(var(--primary) / 0.12)' 
          : '0 1px 3px rgba(0,0,0,0.04)';
      }}
    >
      {children}
    </button>
  );
}

function SubTab({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        flex: 1, height: '40px', borderRadius: '999px', border: active ? '1.5px solid hsl(var(--primary) / 0.7)' : 'none',
        background:    active ? 'hsl(var(--primary) / 0.15)' : 'hsl(var(--muted) / 0.35)',
        color:         active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        fontSize:      '12px', fontWeight: 600,
        cursor:        'pointer',
        transition:    'background 180ms ease, color 180ms ease, transform 120ms ease, border 180ms ease',
        outline:       'none',
        boxShadow:    active ? '0 0 12px hsl(var(--primary) / 0.15)' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
      onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}

function UGRow({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        display:         'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        width:           '100%',
        padding:         '16px 18px',
        borderRadius:    '18px',
        border:          '1px solid hsl(var(--border))',
        background:      'transparent',
        textAlign:       'left',
        cursor:          'pointer',
        transition:      'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        outline:         'none',
        boxShadow:       '0 2px 6px rgba(0,0,0,0.05)',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.985)'; 
        (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--muted) / 0.25)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
      }}
      onPointerUp={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; 
        (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--muted) / 0.1)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
      }}
      onPointerLeave={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; 
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--muted) / 0.08)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08), 0 0 0 hsl(var(--primary) / 0.06)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--primary) / 0.4)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--border))';
      }}
    >
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: '20px' }}>{label}</p>
        <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', opacity: 0.7, marginTop: '3px', lineHeight: '15px' }}>{desc}</p>
      </div>
      <ArrowRight size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginLeft: '14px', opacity: 0.7, transition: 'opacity 160ms ease, transform 160ms ease' }} />
    </button>
  );
}

function RiskBtn({ value, selected, onClick }: { value: RiskPercentStep; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        height:        '52px',
        borderRadius:  '14px',
        border:       selected ? '2px solid hsl(var(--primary) / 0.75)' : '1px solid hsl(var(--border))',
        background:    selected ? 'hsl(var(--primary) / 0.15)' : 'transparent',
        fontFamily:  'var(--font-mono, monospace)',
        fontSize:    '14px', fontWeight: 700,
        color:       selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        cursor:      'pointer',
        transition:  'all 160ms ease',
        outline:     'none',
        boxShadow:   selected ? '0 0 14px hsl(var(--primary) / 0.18)' : 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)'; }}
      onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      {value}%
    </button>
  );
}

function SliderToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        display:        'inline-flex', alignItems: 'center', gap: '5px',
        height:         '36px', borderRadius: '999px',
        border:         active ? '1px solid hsl(var(--primary) / 0.5)' : '1px solid hsl(var(--border))',
        background:     active ? 'hsl(var(--primary) / 0.08)' : 'transparent',
        padding:        '0 13px',
        fontSize:       '11px', fontWeight: 600,
        color:          active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        cursor:         'pointer',
        transition:     'all 160ms ease',
        outline:        'none',
      }}
    >
      <SlidersHorizontal size={11} /> Altro
    </button>
  );
}

function SliderDisplay({ value, unit, children }: { value: string; unit: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{
        minWidth: '64px',
        borderRadius: '10px',
        border: '1px solid hsl(var(--border))',
        background: 'hsl(var(--muted) / 0.4)',
        padding: '6px 8px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '13px', fontWeight: 700,
        color: 'hsl(var(--foreground))',
      }}>
        {value}
      </span>
      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{unit}</span>
      {children}
    </div>
  );
}

function StepSlider({ value, max, onChange }: { value: number; max: number; onChange: (i: number) => void }) {
  return (
    <input type="range"
      min={0} max={max} step={1} value={value}
      onChange={e => onChange(+e.target.value)}
      style={{
        width:       '100%',
        height:      '4px',
        cursor:      'pointer',
        accentColor: 'hsl(var(--primary))',
        touchAction: 'none',
        outline:     'none',
      }}
    />
  );
}

function SliderTicks({ labels }: { labels: string[] }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {labels.map(l => (
        <span key={l} style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '9px', textTransform: 'uppercase' as const,
          letterSpacing: '0.12em',
          color: 'hsl(var(--muted-foreground))', opacity: 0.35,
        }}>{l}</span>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily:    'var(--font-mono, monospace)',
      fontSize:      '9px',
      fontWeight:    700,
      textTransform: 'uppercase',
      letterSpacing: '0.22em',
      color:         'hsl(var(--muted-foreground))',
      opacity:       0.45,
    }}>
      {children}
    </p>
  );
}

function CtaButton({ children, onClick, full }: { children: React.ReactNode; onClick: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:           'inline-flex',
        alignItems:        'center',
        justifyContent:    'center',
        gap:             '10px',
        width:            full ? '100%' : undefined,
        minHeight:        '52px',
        paddingInline:    '24px',
        borderRadius:     '16px',
        border:          'none',
        background:       'hsl(var(--primary))',
        color:            'hsl(var(--primary-foreground))',
        fontSize:         '15px',
        fontWeight:       600,
        letterSpacing:    '-0.01em',
        cursor:           'pointer',
        transition:       'transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease',
        outline:          'none',
        WebkitTapHighlightColor: 'transparent',
        /* SOTA 2026: Premium shadow + subtle gradient */
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.14)',
          '0 4px 16px hsl(var(--primary) / 0.28)',
          '0 1px 3px hsl(var(--primary) / 0.12)',
        ].join(', '),
      }}
      onPointerDown={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.965)'; 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px hsl(var(--primary) / 0.18)';
      }}
      onPointerUp={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 16px hsl(var(--primary) / 0.28), 0 1px 3px hsl(var(--primary) / 0.12)';
      }}
      onPointerLeave={e => { 
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; 
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 16px hsl(var(--primary) / 0.28), 0 1px 3px hsl(var(--primary) / 0.12)';
      }}
    >
      {children}
    </button>
  );
}

function Crumb({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        borderRadius: '999px',
        background: 'hsl(var(--muted) / 0.45)',
        border: '1px solid hsl(var(--border) / 0.6)',
        padding: '4px 10px',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase' as const,
        color: 'hsl(var(--muted-foreground))',
        cursor: 'pointer',
        minHeight: '30px',
        transition: 'color 150ms ease, border-color 150ms ease',
        outline: 'none',
      }}
    >
      <ChevronLeft size={11} />
      {children}
    </button>
  );
}

function Slash() {
  return <span style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.22, fontSize: '12px', userSelect: 'none' }}>/</span>;
}
