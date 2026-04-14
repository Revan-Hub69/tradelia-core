'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Globe, BarChart3, Coins, Building2, Wheat,
  Clock, Calendar, CalendarDays,
  ArrowRight, RotateCcw, TrendingDown, AlertTriangle, CheckCircle2, ChevronLeft, Zap, SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';
import {
  TRADES_PER_MONTH_STEPS, TRADES_DEFAULT, TRADES_PRESETS,
  ACCOUNT_SIZE_STEPS, ACCOUNT_SIZE_DEFAULT, ACCOUNT_PRESETS,
  RISK_PERCENT_STEPS,
  formatAccountSize, deriveNotional, snapToTradesStep, snapToAccountStep,
  type TradesPerMonthStep, type AccountSizeStep, type RiskPercentStep,
} from '@/data/simulator/trade-scales';

// ---------------------------------------------------------------------------
// DATA DOMAIN
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
  const rating = totalDragBps <= mid * 0.6 ? 'low' : totalDragBps >= mid * 1.4 ? 'high' : 'medium';
  const { primaryIssue, suggestion } = texts[horizonId];
  return { spreadBps: spread, swapPerDay, tradesPerMonth, notionale, totalDragBps, totalDragEur, rating, primaryIssue, suggestion };
}

// ---------------------------------------------------------------------------
// RATING
// ---------------------------------------------------------------------------

type RatingKey = 'low' | 'medium' | 'high';
const RATING_CONFIG: Record<RatingKey, { icon: React.ElementType; colorClass: string; bgClass: string; label: string }> = {
  low:    { icon: CheckCircle2,  colorClass: 'text-primary',      bgClass: 'bg-primary/10 border-primary/20',          label: 'Attrito basso'    },
  medium: { icon: AlertTriangle, colorClass: 'text-warning',      bgClass: 'bg-warning/10 border-warning/20',          label: 'Attrito moderato' },
  high:   { icon: TrendingDown,  colorClass: 'text-destructive',  bgClass: 'bg-destructive/10 border-destructive/20',  label: 'Attrito elevato'  },
};

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------

type SimulatorState = {
  category?:       CategoryId;
  ugId?:           UnderlyingGroupId;
  assetId?:        string;
  horizon?:        HorizonId;
  tradesPerMonth?: TradesPerMonthStep;
  accountSize?:    AccountSizeStep;
  riskPercent?:    RiskPercentStep;
};

// ---------------------------------------------------------------------------
// ANIMATIONS
// ---------------------------------------------------------------------------

const EASING = [0.16, 1, 0.3, 1] as [number, number, number, number];
const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };
const fade = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -12, scale: 0.99, position: 'absolute' as const },
};
const slideDown = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASING } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};
function revealVariant(delayMs: number) {
  return {
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: delayMs / 1000, duration: 0.38, ease: EASING } },
  };
}
const badgeReveal = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { delay: 0.06, duration: 0.42, ease: EASING } },
};
function statReveal(i: number) {
  return {
    initial: { opacity: 0, y: 8, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.20 + i * 0.055, duration: 0.32, ease: EASING } },
  };
}

// ---------------------------------------------------------------------------
// BOTTOM SHEET — SOTA 2026
// 100dvh, drag-to-dismiss, handle bar, backdrop blur, safe-area CTA
// ---------------------------------------------------------------------------

const DISMISS_THRESHOLD = 120; // px drag verso il basso per chiudere
const SHEET_RADIUS = '20px';   // top border radius

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

function BottomSheet({ open, onClose, children, footer, title }: BottomSheetProps) {
  const y = useMotionValue(0);
  const backdropOpacity = useTransform(y, [0, DISMISS_THRESHOLD * 1.5], [1, 0]);
  const sheetScale = useTransform(y, [0, DISMISS_THRESHOLD], [1, 0.98]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Blocca scroll body quando sheet è aperto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [open]);

  // Reset y quando sheet si apre
  useEffect(() => {
    if (open) animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 });
  }, [open, y]);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    const shouldDismiss = info.offset.y > DISMISS_THRESHOLD || info.velocity.y > 500;
    if (shouldDismiss) {
      animate(y, window.innerHeight, { duration: 0.28, ease: EASING }).then(onClose);
    } else {
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 40 });
    }
  }, [y, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — frosted glass iOS style */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ opacity: backdropOpacity }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40, mass: 0.9 }}
            style={{ y, scale: sheetScale, borderRadius: `${SHEET_RADIUS} ${SHEET_RADIUS} 0 0` }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.5 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background"
            style={{
              height: '92dvh',       // iOS HIG: large detent ≈ 92%, non 100%
              maxHeight: '92dvh',
              borderRadius: `${SHEET_RADIUS} ${SHEET_RADIUS} 0 0`,
              y,
              scale: sheetScale,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Simulatore'}
          >
            {/* Handle bar — iOS/Material3 spec: 4×32px centrata */}
            <div
              className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
              aria-hidden
            >
              <div className="h-1 w-8 rounded-full bg-border/60" />
            </div>

            {/* Header con titolo opzionale */}
            {title && (
              <div className="shrink-0 px-5 pb-2 pt-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/50 text-center">
                  {title}
                </p>
              </div>
            )}

            {/* Contenuto scrollabile — overscroll-behavior: contain evita scroll leak */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain px-5 py-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>

            {/* Footer sticky con safe-area-inset-bottom per notch iPhone */}
            {footer && (
              <div
                className="shrink-0 border-t border-border/40 bg-background/95 px-5 pt-3"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// HOOK — rilevamento mobile (solo client)
// ---------------------------------------------------------------------------

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function InteractiveSimulator() {
  const [step, setStep]         = useState<number>(0);
  const [sel,  setSel]          = useState<SimulatorState>({});
  const [forexSub, setForexSub] = useState<ForexSubgroup>('major');
  const [sheetOpen, setSheetOpen] = useState(false);

  const [tradesIdx,         setTradesIdx]         = useState(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
  const [accountIdx,        setAccountIdx]        = useState(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
  const [showTradesSlider,  setShowTradesSlider]  = useState(false);
  const [showAccountSlider, setShowAccountSlider] = useState(false);

  const isMobile = useIsMobile();
  const rootRef  = useRef<HTMLDivElement>(null);

  // Su desktop: scroll center allo step change
  useEffect(() => {
    if (isMobile || !rootRef.current) return;
    const id = setTimeout(() =>
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    , 60);
    return () => clearTimeout(id);
  }, [step, isMobile]);

  const tradesValue  = TRADES_PER_MONTH_STEPS[tradesIdx];
  const accountValue = ACCOUNT_SIZE_STEPS[accountIdx];

  const filteredUGs = sel.category ? UNDERLYING_GROUPS.filter(u => u.categoryId === sel.category) : [];

  const handleCategory = (id: CategoryId) => {
    setSel({ category: id });
    setForexSub('major');
    setStep(1);
    if (isMobile) setSheetOpen(true);
  };
  const handleForexAsset  = (a: ForexAsset)         => { setSel(p => ({ ...p, ugId: ASSET_TO_UG[a.id], assetId: a.id })); setStep(2); };
  const handleUG          = (id: UnderlyingGroupId) => { setSel(p => ({ ...p, ugId: id, assetId: undefined })); setStep(2); };
  const handleHorizon     = (id: HorizonId)         => { setSel(p => ({ ...p, horizon: id })); };

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
  const handleRisk = (r: RiskPercentStep) => { setSel(p => ({ ...p, riskPercent: r })); };
  const handleConfirmStep3 = () => {
    if (!sel.riskPercent) return;
    setSel(p => ({ ...p, accountSize: p.accountSize ?? accountValue }));
    setStep(4);
  };

  const navTo = (t: number) => {
    if (t >= step) return;
    setShowTradesSlider(false); setShowAccountSlider(false);
    if (t === 0) {
      setSel({}); setForexSub('major');
      setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
      setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
      if (isMobile) setSheetOpen(false);
    }
    if (t === 1) setSel(p => ({ category: p.category }));
    if (t === 2) { setSel(p => ({ category: p.category, ugId: p.ugId, assetId: p.assetId })); setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT)); }
    if (t === 3) setSel(p => ({ ...p, accountSize: undefined, riskPercent: undefined }));
    setStep(t);
  };

  const reset = () => {
    setSel({}); setForexSub('major');
    setTradesIdx(TRADES_PER_MONTH_STEPS.indexOf(TRADES_DEFAULT));
    setAccountIdx(ACCOUNT_SIZE_STEPS.indexOf(ACCOUNT_SIZE_DEFAULT));
    setShowTradesSlider(false); setShowAccountSlider(false);
    setSheetOpen(false);
    setStep(0);
  };

  const step2Ready = !!(sel.horizon && (sel.tradesPerMonth ?? tradesValue));
  const step3Ready = !!(sel.riskPercent);

  const notionale = sel.ugId && sel.riskPercent
    ? deriveNotional(sel.accountSize ?? accountValue, sel.riskPercent, sel.ugId)
    : null;

  const result: SimResult | null =
    step === 4 && sel.ugId && sel.horizon && sel.tradesPerMonth && notionale
      ? computeDrag(sel.ugId, sel.horizon, sel.tradesPerMonth, notionale)
      : null;

  const step1Crumb = sel.category === 'forex' && sel.assetId
    ? FOREX_ASSETS.find(a => a.id === sel.assetId)?.label ?? ''
    : UNDERLYING_GROUPS.find(u => u.id === sel.ugId)?.label ?? '';

  const PROMPTS = [
    'Cosa tradi principalmente?',
    sel.category === 'forex' ? 'Quale coppia vuoi analizzare?' : 'Qual è il sottogruppo?',
    'Come operi?',
    'Il tuo profilo operativo',
    null,
  ];

  // CTA da passare come footer del sheet
  const sheetFooter = step === 2 && step2Ready ? (
    <button onClick={handleConfirmStep2}
      className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      Continua <ArrowRight className="size-5" />
    </button>
  ) : step === 3 && step3Ready ? (
    <button onClick={handleConfirmStep3}
      className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      Vedi i risultati <ArrowRight className="size-5" />
    </button>
  ) : null;

  // Contenuto interno (condiviso tra sheet e inline)
  const stepContent = (
    <>
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <button key={i} onClick={() => navTo(i)} disabled={i >= step} aria-label={`Torna allo step ${i + 1}`}
            className={cn('h-2 rounded-full transition-all duration-300',
              i < step  ? 'w-8 bg-primary cursor-pointer hover:bg-primary/80'
              : i === step ? 'w-8 bg-primary/40' : 'w-4 bg-border/50',
            )} />
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/40">
          {step < 4 ? `${step + 1} / 4` : 'Risultato'}
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-5 min-h-[2rem]">
        <AnimatePresence mode="wait">
          {PROMPTS[step] && (
            <motion.p key={step} variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="text-lg font-semibold tracking-tight text-foreground">
              {PROMPTS[step]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Steps */}
      <motion.div layout="size" className="relative overflow-hidden">
        <AnimatePresence mode="wait">

          {/* STEP 1 forex */}
          {step === 1 && sel.category === 'forex' && (
            <motion.div key="s1-fx" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-5 w-full">
              <div className="flex gap-2">
                {FOREX_SUBGROUPS.map(sg => (
                  <button key={sg.id} onClick={() => setForexSub(sg.id)}
                    className={cn(
                      'flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border',
                      forexSub === sg.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background/60 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground',
                    )}>{sg.label}</button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={forexSub}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: EASING } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="grid grid-cols-3 gap-2.5">
                  {FOREX_ASSETS.filter(a => a.subgroup === forexSub).map(a => (
                    <AssetPill key={a.id} label={a.label} selected={sel.assetId === a.id} onClick={() => handleForexAsset(a)} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 1 other */}
          {step === 1 && sel.category !== 'forex' && (
            <motion.div key="s1-o" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-2.5 w-full">
              {filteredUGs.map(ug => (
                <UGCard key={ug.id} label={ug.label} desc={ug.desc} onClick={() => handleUG(ug.id)} />
              ))}
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-6 w-full">

              <ProfileSection label="Orizzonte tipico">
                <div className="grid grid-cols-3 gap-2.5">
                  {HORIZONS.map(h => (
                    <OptionCard key={h.id} icon={h.icon} title={h.label} description={h.desc}
                      selected={sel.horizon === h.id} onClick={() => handleHorizon(h.id)} />
                  ))}
                </div>
              </ProfileSection>

              <AnimatePresence>
                {sel.horizon && (
                  <motion.div key="trades-section" variants={slideDown} initial="initial" animate="animate" exit="exit">
                    <ProfileSection label="Trade al mese">
                      <div className="flex gap-2 flex-wrap">
                        {TRADES_PRESETS.map(p => (
                          <PresetPill key={p.value} label={p.label}
                            selected={sel.tradesPerMonth === p.value && !showTradesSlider}
                            onClick={() => handleTradesPreset(p.value)} />
                        ))}
                        <button onClick={() => { setShowTradesSlider(v => !v); setSel(p => ({ ...p, tradesPerMonth: undefined })); }}
                          className={cn('flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-xs font-medium transition-all duration-200 min-h-[44px]',
                            showTradesSlider ? 'border-primary/70 bg-primary/10 text-primary' : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
                          <SlidersHorizontal className="size-3" /> Altro
                        </button>
                      </div>
                      <AnimatePresence>
                        {showTradesSlider && (
                          <motion.div variants={slideDown} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-3 pt-2">
                            <div className="flex items-center gap-3">
                              <span className="w-16 rounded-xl border border-border/50 bg-background/60 px-2 py-2 text-center font-mono text-sm font-semibold tabular-nums text-foreground">{tradesValue}</span>
                              <span className="text-sm text-muted-foreground">trade / mese</span>
                              {tradesValue >= 200 && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="ml-auto flex items-center gap-1 rounded-full bg-warning/10 border border-warning/20 px-2.5 py-1 font-mono text-[10px] text-warning">
                                  <Zap className="size-3" /> Alta freq.
                                </motion.span>
                              )}
                            </div>
                            <input type="range" min={0} max={TRADES_PER_MONTH_STEPS.length - 1} step={1} value={tradesIdx}
                              onChange={e => { const idx = Number(e.target.value); setTradesIdx(idx); setSel(p => ({ ...p, tradesPerMonth: TRADES_PER_MONTH_STEPS[idx] })); }}
                              className="w-full accent-primary rounded-full cursor-pointer" style={{ height: '6px', touchAction: 'none' }} />
                            <div className="flex justify-between font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider">
                              <span>1</span><span>swing</span><span>intraday</span><span>scalping</span><span>500</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </ProfileSection>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA inline — visibile solo su desktop */}
              {!isMobile && step2Ready && (
                <motion.div variants={slideDown} initial="initial" animate="animate">
                  <button onClick={handleConfirmStep2}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Continua <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-6 w-full">

              <ProfileSection label="Capitale disponibile">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {ACCOUNT_PRESETS.map(p => (
                      <PresetPill key={p.value} label={p.label}
                        selected={sel.accountSize === p.value && !showAccountSlider}
                        onClick={() => handleAccountPreset(p.value)} />
                    ))}
                    <button onClick={() => { setShowAccountSlider(v => !v); setSel(p => ({ ...p, accountSize: undefined })); }}
                      className={cn('flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-xs font-medium transition-all duration-200 min-h-[44px]',
                        showAccountSlider ? 'border-primary/70 bg-primary/10 text-primary' : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
                      <SlidersHorizontal className="size-3" /> Altro
                    </button>
                  </div>
                  <AnimatePresence>
                    {showAccountSlider && (
                      <motion.div variants={slideDown} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-20 rounded-xl border border-border/50 bg-background/60 px-2 py-2 text-center font-mono text-sm font-semibold tabular-nums text-foreground">{formatAccountSize(accountValue)}</span>
                          <span className="text-sm text-muted-foreground">sul conto</span>
                        </div>
                        <input type="range" min={0} max={ACCOUNT_SIZE_STEPS.length - 1} step={1} value={accountIdx}
                          onChange={e => { const idx = Number(e.target.value); setAccountIdx(idx); setSel(p => ({ ...p, accountSize: ACCOUNT_SIZE_STEPS[idx] })); }}
                          className="w-full accent-primary rounded-full cursor-pointer" style={{ height: '6px', touchAction: 'none' }} />
                        <div className="flex justify-between font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider">
                          <span>50€</span><span>micro</span><span>retail</span><span>pro</span><span>500k+</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ProfileSection>

              <ProfileSection label="Rischio per trade">
                <div className="grid grid-cols-5 gap-2">
                  {RISK_PERCENT_STEPS.map(r => (
                    <button key={r} onClick={() => handleRisk(r)}
                      className={cn(
                        'rounded-xl border py-3.5 text-center font-mono text-sm font-semibold transition-all duration-200 min-h-[52px]',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        sel.riskPercent === r
                          ? 'border-primary/70 bg-primary/10 text-primary'
                          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}>{r}%</button>
                  ))}
                </div>
                <AnimatePresence>
                  {sel.riskPercent && sel.ugId && (
                    <motion.p key="notionale" variants={slideDown} initial="initial" animate="animate" exit="exit"
                      className="font-mono text-[11px] text-muted-foreground/50 mt-1.5">
                      ≈ {formatAccountSize(deriveNotional(sel.accountSize ?? accountValue, sel.riskPercent, sel.ugId))} notionale per trade
                    </motion.p>
                  )}
                </AnimatePresence>
              </ProfileSection>

              {/* CTA inline — solo desktop */}
              {!isMobile && step3Ready && (
                <motion.div variants={slideDown} initial="initial" animate="animate">
                  <button onClick={handleConfirmStep3}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Vedi i risultati <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && result && sel.ugId && sel.horizon && (
            <ResultView result={result} sel={sel} onReset={reset} />
          )}

        </AnimatePresence>
      </motion.div>

      {/* Breadcrumb */}
      {step > 0 && step < 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center gap-2 flex-wrap">
          {sel.category && (
            <button onClick={() => navTo(0)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary min-h-[36px]">
              <ChevronLeft className="size-3" />{CATEGORIES.find(c => c.id === sel.category)?.label}
            </button>
          )}
          {step > 1 && sel.ugId && (
            <><span className="text-muted-foreground/30 text-xs">/</span>
            <button onClick={() => navTo(1)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary min-h-[36px]">
              <ChevronLeft className="size-3" />{step1Crumb}
            </button></>
          )}
          {step > 2 && sel.horizon && (
            <><span className="text-muted-foreground/30 text-xs">/</span>
            <button onClick={() => navTo(2)}
              className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary min-h-[36px]">
              <ChevronLeft className="size-3" />{HORIZONS.find(h => h.id === sel.horizon)?.label}
              {sel.tradesPerMonth && <span className="opacity-50"> · {sel.tradesPerMonth}/mese</span>}
            </button></>
          )}
        </motion.div>
      )}
    </>
  );

  return (
    <>
      {/* STEP 0 — sempre inline (trigger su mobile, continua su desktop) */}
      <div ref={rootRef} className="relative w-full flex flex-col p-5 sm:p-6 xl:p-7">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="step0-inline" variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="flex flex-col gap-4">
              <p className="text-lg font-semibold tracking-tight text-foreground">
                Cosa tradi principalmente?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map(c => (
                  <OptionCard key={c.id} icon={c.icon} title={c.label} description={c.desc}
                    onClick={() => handleCategory(c.id)} />
                ))}
              </div>
            </motion.div>
          ) : (
            // Su desktop: tutto inline dopo step 0
            !isMobile && (
              <motion.div key="desktop-inline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full">
                {stepContent}
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Su mobile: se step > 0 e sheet è chiuso, mostra mini-riepilogo con tasto per riaprire */}
        {isMobile && step > 0 && !sheetOpen && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-between rounded-2xl border border-border/50 bg-background/60 px-4 py-3">
            <div className="flex items-center gap-2">
              {[sel.category && CATEGORIES.find(c => c.id === sel.category)?.label,
                step1Crumb || null,
                sel.horizon || null,
              ].filter(Boolean).map((s, i) => (
                <span key={i} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s}</span>
              ))}
            </div>
            <button onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 font-mono text-[11px] font-medium">
              Continua <ArrowRight className="size-3" />
            </button>
          </motion.div>
        )}
      </div>

      {/* BOTTOM SHEET — solo mobile, step 1+ */}
      {isMobile && (
        <BottomSheet
          open={sheetOpen}
          onClose={() => { setSheetOpen(false); }}
          footer={sheetFooter}
          title={PROMPTS[step] ?? undefined}
        >
          {stepContent}
        </BottomSheet>
      )}
    </>
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
    <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.15 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }} className="w-full space-y-3">

      <motion.div variants={badgeReveal} initial="initial" animate="animate"
        className={cn('flex items-center gap-3 rounded-2xl border px-4 py-4', cfg.bgClass)}>
        <Icon className={cn('size-5 shrink-0', cfg.colorClass)} />
        <div>
          <p className={cn('font-mono text-[11px] font-semibold uppercase tracking-[0.18em]', cfg.colorClass)}>{cfg.label}</p>
          <p className="text-xs text-muted-foreground/70">{result.primaryIssue}</p>
        </div>
        <div className="ml-auto text-right">
          <p className={cn('font-mono text-xl font-bold tabular-nums', cfg.colorClass)}>{result.totalDragBps} bps</p>
          <p className="font-mono text-xs text-muted-foreground/60 tabular-nums">≈ {result.totalDragEur}€/mese</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Spread/trade', value: `${result.spreadBps} bps`          },
          { label: 'Trade/mese',   value: `${result.tradesPerMonth}`          },
          { label: 'Notionale',    value: formatAccountSize(result.notionale) },
        ].map(({ label, value }, i) => (
          <motion.div key={label} variants={statReveal(i + 1)} initial="initial" animate="animate"
            className="rounded-2xl border border-border/50 bg-background/60 px-3 py-3 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">{label}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">{value}</p>
          </motion.div>
        ))}
      </div>

      <motion.p variants={revealVariant(300)} initial="initial" animate="animate"
        className="font-mono text-[10px] text-muted-foreground/50 text-center tracking-wide">
        {result.tradesPerMonth}/mese · {HORIZON_HOLDING[sel.horizon!]}gg · {result.spreadBps} bps/trade · {formatAccountSize(result.notionale)} notionale
      </motion.p>

      <motion.div variants={revealVariant(380)} initial="initial" animate="animate"
        className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3.5">
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Cosa fare: </span>{result.suggestion}
        </p>
      </motion.div>

      <motion.div variants={revealVariant(460)} initial="initial" animate="animate"
        className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {[CATEGORIES.find(c => c.id === sel.category)?.label, assetLabel, sel.horizon,
            sel.tradesPerMonth ? `${sel.tradesPerMonth} trade/mese` : null,
            sel.accountSize   ? formatAccountSize(sel.accountSize) : null,
            sel.riskPercent   ? `${sel.riskPercent}% rischio`      : null,
          ].filter(Boolean).map(s => (
            <span key={s} className="rounded-full border border-border/50 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{s}</span>
          ))}
        </div>
        <button onClick={onReset}
          className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground min-h-[36px]">
          <RotateCcw className="size-3" /> Ricomincia
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function OptionCard({ icon: Icon, title, description, onClick, selected = false }: {
  icon: React.ElementType; title: string; description: string; onClick: () => void; selected?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'group relative flex flex-col items-start justify-between p-4 text-left transition-all duration-200 border rounded-2xl min-h-[80px]',
        selected
          ? 'border-primary/70 bg-primary/10'
          : 'bg-background/60 border-border/50 hover:border-primary/60 hover:bg-accent/30 hover:shadow-md hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}>
      <Icon className={cn('mb-3 size-5 stroke-[1.5] transition-colors duration-200', selected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
      <div>
        <p className="text-sm font-semibold leading-5 text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-[10px] text-muted-foreground">{description}</p>}
      </div>
    </button>
  );
}

function AssetPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-3 text-center font-mono text-xs font-semibold tracking-wide transition-all duration-200 min-h-[48px]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-primary/70 bg-primary/10 text-primary'
          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5 hover:shadow-sm',
      )}>{label}</button>
  );
}

function UGCard({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'group flex items-center justify-between w-full px-4 py-4 text-left transition-all duration-200 min-h-[64px]',
        'bg-background/60 border border-border/50 rounded-2xl hover:border-primary/60 hover:bg-accent/30 hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-3" />
    </button>
  );
}

function ProfileSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">{label}</p>
      {children}
    </div>
  );
}

function PresetPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 font-mono text-sm font-semibold transition-all duration-200 min-h-[44px]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-primary/70 bg-primary/10 text-primary'
          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}>{label}</button>
  );
}
