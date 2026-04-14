'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Globe, BarChart3, Coins, Building2, Wheat,
  Clock, Calendar, CalendarDays,
  ArrowRight, RotateCcw, TrendingDown, AlertTriangle, CheckCircle2,
  ChevronLeft, Zap, SlidersHorizontal, X,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';
import {
  TRADES_PER_MONTH_STEPS, TRADES_DEFAULT, TRADES_PRESETS,
  ACCOUNT_SIZE_STEPS, ACCOUNT_SIZE_DEFAULT, ACCOUNT_PRESETS,
  RISK_PERCENT_STEPS,
  formatAccountSize, deriveNotional,
  type TradesPerMonthStep, type AccountSizeStep, type RiskPercentStep,
} from '@/data/simulator/trade-scales';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// COST MODEL
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// RATING
// ─────────────────────────────────────────────

const RATING_CONFIG = {
  low:    { icon: CheckCircle2,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50',  border: 'border-emerald-200 dark:border-emerald-800', label: 'Attrito basso'    },
  medium: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-950/50',      border: 'border-amber-200 dark:border-amber-800',    label: 'Attrito moderato' },
  high:   { icon: TrendingDown,  color: 'text-rose-600 dark:text-rose-400',      bg: 'bg-rose-50 dark:bg-rose-950/50',        border: 'border-rose-200 dark:border-rose-800',      label: 'Attrito elevato'  },
} as const;

// ─────────────────────────────────────────────
// STATE TYPE
// ─────────────────────────────────────────────

type SimulatorState = {
  category?:       CategoryId;
  ugId?:           UnderlyingGroupId;
  assetId?:        string;
  horizon?:        HorizonId;
  tradesPerMonth?: TradesPerMonthStep;
  accountSize?:    AccountSizeStep;
  riskPercent?:    RiskPercentStep;
};

// ─────────────────────────────────────────────
// MOTION CONSTANTS
// ─────────────────────────────────────────────

const E = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SP = { type: 'spring' as const, stiffness: 300, damping: 30 };

const stepFade = {
  initial:  { opacity: 0, y: 12, scale: 0.985 },
  animate:  { opacity: 1, y: 0,  scale: 1, transition: SP },
  exit:     { opacity: 0, y: -8, scale: 0.985, transition: { duration: 0.15 }, position: 'absolute' as const },
};
const slideDown = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: E } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.12 } },
};
const DISMISS_VEL = 500;
const DISMISS_Y   = 100;

// ─────────────────────────────────────────────
// HOOK: isMobile
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// BOTTOM SHEET — portalled to document.body
// Questo è l'unico modo affidabile per evitare
// z-index inheritance dal parent component.
// ─────────────────────────────────────────────

function BottomSheet({
  open, onClose, children, footer, label,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  label?: string;
}) {
  const y            = useMotionValue(0);
  const bgOpacity    = useTransform(y, [0, DISMISS_Y * 1.5], [1, 0]);
  const sheetScale   = useTransform(y, [0, DISMISS_Y],       [1, 0.98]);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow    = 'hidden';
      body.style.touchAction = 'none';
      animate(y, 0, { type: 'spring', stiffness: 420, damping: 42 });
    } else {
      body.style.overflow    = '';
      body.style.touchAction = '';
    }
    return () => { body.style.overflow = ''; body.style.touchAction = ''; };
  }, [open, y]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      if (info.offset.y > DISMISS_Y || info.velocity.y > DISMISS_VEL) {
        animate(y, window.innerHeight, { duration: 0.26, ease: E }).then(onClose);
      } else {
        animate(y, 0, { type: 'spring', stiffness: 420, damping: 42 });
      }
    },
    [y, onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — z-[9998] */}
          <motion.div
            key="sim-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ opacity: bgOpacity }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet — z-[9999] */}
          <motion.div
            key="sim-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.26, ease: E } }}
            transition={{ type: 'spring', stiffness: 380, damping: 40, mass: 0.85 }}
            style={{ y, scale: sheetScale }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.03, bottom: 0.45 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col bg-background rounded-t-[22px] shadow-2xl"
            style={{ y, scale: sheetScale, height: '92dvh', maxHeight: '92dvh' }}
            role="dialog"
            aria-modal="true"
            aria-label={label ?? 'Simulatore'}
          >
            {/* Drag handle + header row */}
            <div className="shrink-0 flex items-center px-5 pt-3 pb-3">
              {/* handle centrato */}
              <div className="absolute left-0 right-0 top-3 flex justify-center pointer-events-none">
                <div className="h-[5px] w-10 rounded-full bg-foreground/12" />
              </div>

              {/* label a sinistra */}
              {label && (
                <span className="font-mono text-[10px] uppercase tracking-[0.20em] text-muted-foreground/50 pt-2">
                  {label}
                </span>
              )}

              {/* X a destra */}
              <button
                onClick={onClose}
                aria-label="Chiudi"
                className="ml-auto mt-2 flex items-center justify-center size-8 rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>

            {/* Sticky footer CTA */}
            {footer && (
              <div
                className="shrink-0 px-5 pt-3 border-t border-border/20 bg-background/98 backdrop-blur-sm"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

export function InteractiveSimulator() {
  const [step,      setStep]      = useState(0);
  const [sel,       setSel]       = useState<SimulatorState>({});
  const [forexSub,  setForexSub]  = useState<ForexSubgroup>('major');
  const [sheetOpen, setSheetOpen] = useState(false);

  const [tradesIdx,         setTradesIdx]         = useState(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
  const [accountIdx,        setAccountIdx]        = useState(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
  const [showTradesSlider,  setShowTradesSlider]  = useState(false);
  const [showAccountSlider, setShowAccountSlider] = useState(false);

  const isMobile    = useIsMobile();
  const tradesValue  = TRADES_PER_MONTH_STEPS[tradesIdx];
  const accountValue = ACCOUNT_SIZE_STEPS[accountIdx];
  const filteredUGs  = sel.category ? UNDERLYING_GROUPS.filter(u => u.categoryId === sel.category) : [];

  // ── handlers ──────────────────────────────

  const handleCategory = (id: CategoryId) => {
    setSel({ category: id });
    setForexSub('major');
    setStep(1);
    if (isMobile) setSheetOpen(true);
  };

  const handleForexAsset = (a: ForexAsset) => {
    setSel(p => ({ ...p, ugId: ASSET_TO_UG[a.id], assetId: a.id }));
    setStep(2);
  };

  const handleUG = (id: UnderlyingGroupId) => {
    setSel(p => ({ ...p, ugId: id, assetId: undefined }));
    setStep(2);
  };

  const handleHorizon = (id: HorizonId) => setSel(p => ({ ...p, horizon: id }));

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

  const handleRisk = (r: RiskPercentStep) => setSel(p => ({ ...p, riskPercent: r }));

  const handleConfirmStep3 = () => {
    if (!sel.riskPercent) return;
    setSel(p => ({ ...p, accountSize: p.accountSize ?? accountValue }));
    setStep(4);
  };

  const navTo = (t: number) => {
    if (t >= step) return;
    setShowTradesSlider(false);
    setShowAccountSlider(false);
    if (t <= 0) {
      setSel({});
      setForexSub('major');
      setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
      setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
      // mobile: lo sheet rimane aperto — step0 viene mostrato dentro
    } else if (t === 1) {
      setSel(p => ({ category: p.category }));
    } else if (t === 2) {
      setSel(p => ({ category: p.category, ugId: p.ugId, assetId: p.assetId }));
      setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
    } else if (t === 3) {
      setSel(p => ({ ...p, accountSize: undefined, riskPercent: undefined }));
    }
    setStep(t);
  };

  // reset: non chiude lo sheet — step0 appare dentro lo sheet su mobile
  const reset = () => {
    setSel({});
    setForexSub('major');
    setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
    setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
    setShowTradesSlider(false);
    setShowAccountSlider(false);
    setStep(0);
    // sheetOpen invariato
  };

  // ── derived ───────────────────────────────

  const step2Ready = !!(sel.horizon && (sel.tradesPerMonth ?? tradesValue));
  const step3Ready = !!sel.riskPercent;

  const notionale = sel.ugId && sel.riskPercent
    ? deriveNotional(sel.accountSize ?? accountValue, sel.riskPercent, sel.ugId)
    : null;

  const result: SimResult | null =
    step === 4 && sel.ugId && sel.horizon && sel.tradesPerMonth && notionale
      ? computeDrag(sel.ugId, sel.horizon, sel.tradesPerMonth, notionale)
      : null;

  const step1Crumb =
    sel.category === 'forex' && sel.assetId
      ? (FOREX_ASSETS.find(a => a.id === sel.assetId)?.label ?? '')
      : (UNDERLYING_GROUPS.find(u => u.id === sel.ugId)?.label ?? '');

  const PROMPTS = [
    'Cosa tradi principalmente?',
    sel.category === 'forex' ? 'Quale coppia?' : 'Sottogruppo?',
    'Come operi?',
    'Profilo operativo',
    null,
  ] as const;

  // ── sheet footer CTA ──────────────────────

  const sheetFooter =
    step === 2 && step2Ready ? (
      <Btn full onClick={handleConfirmStep2}>Continua <ArrowRight className="size-[18px]" /></Btn>
    ) : step === 3 && step3Ready ? (
      <Btn full onClick={handleConfirmStep3}>Vedi i risultati <ArrowRight className="size-[18px]" /></Btn>
    ) : null;

  // ─────────────────────────────────────────
  // STEP CONTENT (shared mobile sheet + desktop inline)
  // ─────────────────────────────────────────

  const stepContent = (
    <div className="flex flex-col">

      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <button
            key={i}
            onClick={() => navTo(i)}
            disabled={i >= step}
            aria-label={`Step ${i + 1}`}
            className={cn(
              'h-[5px] rounded-full transition-all duration-300 focus:outline-none',
              i < step  ? 'bg-primary w-8 cursor-pointer' : '',
              i === step ? 'bg-primary/30 w-8' : '',
              i > step  ? 'bg-border/50 w-4' : '',
            )}
          />
        ))}
        <span className="ml-auto font-mono text-[10px] tracking-widest uppercase text-muted-foreground/40">
          {step < 4 ? `${step + 1} / 4` : 'Risultato'}
        </span>
      </div>

      {/* Prompt heading */}
      <div className="mb-4 h-7">
        <AnimatePresence mode="wait">
          {PROMPTS[step] && (
            <motion.p
              key={step}
              variants={stepFade}
              initial="initial" animate="animate" exit="exit"
              className="text-[16px] font-semibold tracking-tight text-foreground leading-7"
            >
              {PROMPTS[step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Step panels — min-h previene deformazione layout desktop */}
      <div className="relative min-h-[220px] w-full">
        <AnimatePresence mode="wait">

          {/* STEP 0 — nel sheet dopo reset */}
          {step === 0 && (
            <motion.div key="s0" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full grid grid-cols-2 gap-2.5">
              {CATEGORIES.map(c => (
                <OptionCard key={c.id} icon={c.icon} title={c.label} desc={c.desc}
                  onClick={() => handleCategory(c.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 1 forex */}
          {step === 1 && sel.category === 'forex' && (
            <motion.div key="s1-fx" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-4">
              {/* subgroup tabs */}
              <div className="flex gap-2">
                {FOREX_SUBGROUPS.map(sg => (
                  <button key={sg.id} onClick={() => setForexSub(sg.id)}
                    className={cn(
                      'flex-1 h-9 rounded-full text-[13px] font-semibold border transition-all duration-200',
                      forexSub === sg.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground',
                    )}>
                    {sg.label}
                  </button>
                ))}
              </div>
              {/* asset grid */}
              <AnimatePresence mode="wait">
                <motion.div key={forexSub}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: E } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="grid grid-cols-3 gap-2">
                  {FOREX_ASSETS.filter(a => a.subgroup === forexSub).map(a => (
                    <Pill key={a.id} selected={sel.assetId === a.id} onClick={() => handleForexAsset(a)}>
                      {a.label}
                    </Pill>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 1 other */}
          {step === 1 && sel.category !== 'forex' && (
            <motion.div key="s1-o" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-2">
              {filteredUGs.map(ug => (
                <UGRow key={ug.id} label={ug.label} desc={ug.desc} onClick={() => handleUG(ug.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-5">

              <Section label="Orizzonte tipico">
                <div className="grid grid-cols-3 gap-2">
                  {HORIZONS.map(h => (
                    <OptionCard key={h.id} icon={h.icon} title={h.label} desc={h.desc}
                      selected={sel.horizon === h.id} onClick={() => handleHorizon(h.id)} />
                  ))}
                </div>
              </Section>

              <AnimatePresence>
                {sel.horizon && (
                  <motion.div key="trades" variants={slideDown} initial="initial" animate="animate" exit="exit">
                    <Section label="Trade / mese">
                      <div className="flex flex-wrap gap-2">
                        {TRADES_PRESETS.map(p => (
                          <Pill key={p.value}
                            selected={sel.tradesPerMonth === p.value && !showTradesSlider}
                            onClick={() => handleTradesPreset(p.value)}>
                            {p.label}
                          </Pill>
                        ))}
                        <button
                          onClick={() => { setShowTradesSlider(v => !v); setSel(p => ({ ...p, tradesPerMonth: undefined })); }}
                          className={cn(
                            'inline-flex items-center gap-1.5 h-9 rounded-full border px-4 text-[12px] font-semibold transition-all duration-200',
                            showTradesSlider
                              ? 'border-primary bg-primary/8 text-primary'
                              : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                          )}>
                          <SlidersHorizontal className="size-3" /> Altro
                        </button>
                      </div>

                      <AnimatePresence>
                        {showTradesSlider && (
                          <motion.div variants={slideDown} initial="initial" animate="animate" exit="exit"
                            className="flex flex-col gap-2.5 pt-1.5">
                            <div className="flex items-center gap-3">
                              <span className="w-14 rounded-xl border border-border bg-muted/40 px-2 py-1.5 text-center font-mono text-[13px] font-bold tabular-nums">
                                {tradesValue}
                              </span>
                              <span className="text-[13px] text-muted-foreground">trade / mese</span>
                              {tradesValue >= 200 && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                                  <Zap className="size-3" /> Alta freq.
                                </motion.span>
                              )}
                            </div>
                            <input type="range"
                              min={0} max={TRADES_PER_MONTH_STEPS.length - 1} step={1} value={tradesIdx}
                              onChange={e => { const i = +e.target.value; setTradesIdx(i); setSel(p => ({ ...p, tradesPerMonth: TRADES_PER_MONTH_STEPS[i] })); }}
                              className="w-full accent-primary cursor-pointer"
                              style={{ height: '5px', touchAction: 'none' }}
                            />
                            <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground/35">
                              <span>1</span><span>swing</span><span>intraday</span><span>scalping</span><span>500</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Section>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA desktop-only */}
              {!isMobile && step2Ready && (
                <motion.div variants={slideDown} initial="initial" animate="animate">
                  <Btn full onClick={handleConfirmStep2}>Continua <ArrowRight className="size-4" /></Btn>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" variants={stepFade} initial="initial" animate="animate" exit="exit"
              className="w-full flex flex-col gap-5">

              <Section label="Capitale sul conto">
                <div className="flex flex-wrap gap-2">
                  {ACCOUNT_PRESETS.map(p => (
                    <Pill key={p.value}
                      selected={sel.accountSize === p.value && !showAccountSlider}
                      onClick={() => handleAccountPreset(p.value)}>
                      {p.label}
                    </Pill>
                  ))}
                  <button
                    onClick={() => { setShowAccountSlider(v => !v); setSel(p => ({ ...p, accountSize: undefined })); }}
                    className={cn(
                      'inline-flex items-center gap-1.5 h-9 rounded-full border px-4 text-[12px] font-semibold transition-all duration-200',
                      showAccountSlider
                        ? 'border-primary bg-primary/8 text-primary'
                        : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                    )}>
                    <SlidersHorizontal className="size-3" /> Altro
                  </button>
                </div>
                <AnimatePresence>
                  {showAccountSlider && (
                    <motion.div variants={slideDown} initial="initial" animate="animate" exit="exit"
                      className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3">
                        <span className="w-20 rounded-xl border border-border bg-muted/40 px-2 py-1.5 text-center font-mono text-[13px] font-bold tabular-nums">
                          {formatAccountSize(accountValue)}
                        </span>
                        <span className="text-[13px] text-muted-foreground">sul conto</span>
                      </div>
                      <input type="range"
                        min={0} max={ACCOUNT_SIZE_STEPS.length - 1} step={1} value={accountIdx}
                        onChange={e => { const i = +e.target.value; setAccountIdx(i); setSel(p => ({ ...p, accountSize: ACCOUNT_SIZE_STEPS[i] })); }}
                        className="w-full accent-primary cursor-pointer"
                        style={{ height: '5px', touchAction: 'none' }}
                      />
                      <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground/35">
                        <span>50€</span><span>micro</span><span>retail</span><span>pro</span><span>500k+</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Section>

              <Section label="Rischio per trade">
                <div className="grid grid-cols-5 gap-2">
                  {RISK_PERCENT_STEPS.map(r => (
                    <button key={r} onClick={() => handleRisk(r)}
                      className={cn(
                        'h-12 rounded-xl border text-[13px] font-bold font-mono transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        sel.riskPercent === r
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                      )}>
                      {r}%
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {sel.riskPercent && sel.ugId && (
                    <motion.p key="notionale" variants={slideDown} initial="initial" animate="animate" exit="exit"
                      className="font-mono text-[11px] text-muted-foreground/55 mt-1">
                      ≈ {formatAccountSize(deriveNotional(sel.accountSize ?? accountValue, sel.riskPercent, sel.ugId))} notionale / trade
                    </motion.p>
                  )}
                </AnimatePresence>
              </Section>

              {/* CTA desktop-only */}
              {!isMobile && step3Ready && (
                <motion.div variants={slideDown} initial="initial" animate="animate">
                  <Btn full onClick={handleConfirmStep3}>Vedi i risultati <ArrowRight className="size-4" /></Btn>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && result && sel.ugId && sel.horizon && (
            <ResultView result={result} sel={sel} onReset={reset} />
          )}

        </AnimatePresence>
      </div>

      {/* Breadcrumb nav */}
      {step > 0 && step < 4 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-5 flex items-center gap-1.5 flex-wrap"
        >
          {sel.category && (
            <Crumb onClick={() => navTo(0)}>
              {CATEGORIES.find(c => c.id === sel.category)?.label}
            </Crumb>
          )}
          {step > 1 && sel.ugId && (
            <><Slash /><Crumb onClick={() => navTo(1)}>{step1Crumb}</Crumb></>
          )}
          {step > 2 && sel.horizon && (
            <><Slash />
            <Crumb onClick={() => navTo(2)}>
              {HORIZONS.find(h => h.id === sel.horizon)?.label}
              {sel.tradesPerMonth && <span className="opacity-40"> · {sel.tradesPerMonth}/mo</span>}
            </Crumb></>
          )}
        </motion.div>
      )}
    </div>
  );

  // ─────────────────────────────────────────
  // RENDER
  // Desktop: tutto inline.
  // Mobile:  step0 inline, step1+ dentro bottom sheet portalled.
  // ─────────────────────────────────────────

  return (
    <div className="w-full px-4 py-5 sm:px-6 sm:py-6">

      {/* STEP 0 inline — sempre visibile (mobile e desktop) quando step === 0 */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0-inline" variants={stepFade} initial="initial" animate="animate" exit="exit"
            className="flex flex-col gap-3">
            <p className="text-[16px] font-semibold text-foreground tracking-tight">
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

        {/* DESKTOP: step 1-4 inline */}
        {!isMobile && step > 0 && (
          <motion.div key="desktop-steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {stepContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE: quando sheet è chiuso e step > 0, mostra mini pill per riaprire.
          Questo è un figlio normale del container, NON fixed/absolute,
          quindi non ha problemi di z-index col sheet che è portalled in body. */}
      {isMobile && step > 0 && !sheetOpen && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: E } }}
          className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3"
        >
          <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
            {([
              sel.category && CATEGORIES.find(c => c.id === sel.category)?.label,
              step1Crumb || undefined,
              sel.horizon && HORIZONS.find(h => h.id === sel.horizon)?.label,
            ] as (string | undefined)[]).filter(Boolean).map((s, i) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-wider text-foreground/60 truncate">
                {i > 0 && <span className="mr-1.5 text-muted-foreground/25">·</span>}
                {s}
              </span>
            ))}
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="shrink-0 inline-flex items-center gap-1.5 h-8 rounded-full bg-primary text-primary-foreground px-4 text-[12px] font-semibold hover:bg-primary/90 active:bg-primary/80 transition-colors"
          >
            Continua <ArrowRight className="size-3.5" />
          </button>
        </motion.div>
      )}

      {/* BOTTOM SHEET — portalled to document.body, z-[9999] */}
      {isMobile && (
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          footer={sheetFooter}
          label={step === 0 ? 'Simulatore' : (PROMPTS[step] ?? undefined)}
        >
          {stepContent}
        </BottomSheet>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULT VIEW
// ─────────────────────────────────────────────

function ResultView({ result, sel, onReset }: { result: SimResult; sel: SimulatorState; onReset: () => void }) {
  const cfg  = RATING_CONFIG[result.rating];
  const Icon = cfg.icon;
  const assetLabel =
    sel.assetId
      ? FOREX_ASSETS.find(a => a.id === sel.assetId)?.label
      : UNDERLYING_GROUPS.find(u => u.id === sel.ugId)?.label;

  return (
    <motion.div
      key="s4"
      initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="w-full flex flex-col gap-3"
    >
      {/* Rating card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { delay: 0.05, duration: 0.36, ease: E } }}
        className={cn('flex items-start gap-3 rounded-2xl border px-4 py-4', cfg.bg, cfg.border)}
      >
        <Icon className={cn('mt-0.5 size-[18px] shrink-0', cfg.color)} />
        <div className="flex-1 min-w-0">
          <p className={cn('font-mono text-[10px] font-bold uppercase tracking-[0.2em]', cfg.color)}>{cfg.label}</p>
          <p className="text-[13px] text-foreground/75 mt-1 leading-5">{result.primaryIssue}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn('font-mono text-xl font-bold tabular-nums', cfg.color)}>{result.totalDragBps} bps</p>
          <p className="font-mono text-[11px] text-muted-foreground tabular-nums mt-0.5">≈{result.totalDragEur}€/mese</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Spread/trade', value: `${result.spreadBps} bps`          },
          { label: 'Trade/mese',   value: `${result.tradesPerMonth}`          },
          { label: 'Notionale',    value: formatAccountSize(result.notionale) },
        ].map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.06, duration: 0.28, ease: E } }}
            className="rounded-2xl border border-border bg-muted/25 px-3 py-3 text-center"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/55">{label}</p>
            <p className="mt-1 font-mono text-[13px] font-bold text-foreground tabular-nums">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.32, duration: 0.3, ease: E } }}
        className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 px-4 py-3.5"
      >
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-[13px] leading-6 text-muted-foreground">
          <span className="font-semibold text-foreground">Cosa fare: </span>
          {result.suggestion}
        </p>
      </motion.div>

      {/* Tags + reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.44, duration: 0.28, ease: E } }}
        className="flex items-center justify-between gap-2 flex-wrap"
      >
        <div className="flex gap-1.5 flex-wrap">
          {[
            CATEGORIES.find(c => c.id === sel.category)?.label,
            assetLabel,
            sel.horizon,
            sel.tradesPerMonth ? `${sel.tradesPerMonth}/mo` : null,
            sel.riskPercent ? `${sel.riskPercent}%` : null,
          ].filter(Boolean).map(s => (
            <span key={s}
              className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
              {s}
            </span>
          ))}
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-transparent px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <RotateCcw className="size-3" /> Ricomincia
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────

function OptionCard({ icon: Icon, title, desc, onClick, selected = false }: {
  icon: React.ElementType; title: string; desc?: string; onClick: () => void; selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col items-start gap-2.5 p-4 rounded-2xl border text-left',
        'transition-all duration-200 min-h-[76px]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        selected
          ? 'border-primary bg-primary/8 shadow-sm'
          : 'border-border bg-transparent hover:border-foreground/25 hover:bg-muted/40 active:bg-muted/60',
      )}
    >
      <Icon className={cn(
        'size-[17px] stroke-[1.7] transition-colors duration-200',
        selected ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/70',
      )} />
      <div>
        <p className="text-[13px] font-semibold text-foreground leading-5">{title}</p>
        {desc && <p className="text-[10px] text-muted-foreground/65 mt-0.5 leading-4">{desc}</p>}
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
      className={cn(
        'inline-flex items-center justify-center h-9 rounded-full border px-4 font-mono text-[12px] font-bold tracking-wide',
        'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function UGRow({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl border border-border',
        'bg-transparent hover:border-foreground/25 hover:bg-muted/40 transition-all duration-200 text-left',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <div>
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground/65 mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="size-[15px] text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 ml-3" />
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/50 font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
}

function Btn({ children, onClick, full }: { children: React.ReactNode; onClick: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5',
        'bg-primary text-primary-foreground font-semibold text-[14px]',
        'hover:bg-primary/90 active:bg-primary/80 transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        full && 'w-full',
      )}
    >
      {children}
    </button>
  );
}

function Crumb({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-muted/50 border border-border/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-border transition-colors min-h-[32px]"
    >
      <ChevronLeft className="size-3 shrink-0" />
      {children}
    </button>
  );
}

function Slash() {
  return <span className="text-muted-foreground/25 text-xs select-none">/</span>;
}
