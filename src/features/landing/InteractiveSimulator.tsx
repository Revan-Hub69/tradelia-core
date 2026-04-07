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
  Layers,
  Wheat,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/utils/Helpers';

// ---------------------------------------------------------------------------
// 1. DATA DOMAIN
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'forex',       label: 'Forex',       icon: Globe,     desc: 'Major, Cross & Exotic' },
  { id: 'indices',     label: 'Indici',      icon: BarChart3, desc: 'US, EU, Asia & VIX'   },
  { id: 'equities',    label: 'Azioni',      icon: Building2, desc: 'US, EU, UK & ADR'      },
  { id: 'commodities', label: 'Commodity',   icon: Wheat,     desc: 'Metalli, Energia, Agri'},
  { id: 'etf',         label: 'ETF',         icon: Layers,    desc: 'US, UCITS & Leveraged' },
  { id: 'crypto',      label: 'Crypto',      icon: Coins,     desc: 'Major & Altcoin'       },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

// 22 underlying groups
const UNDERLYING_GROUPS = [
  // forex (3)
  { id: 'ug_fx_core',         categoryId: 'forex'       as CategoryId, label: 'Major (Core)',       desc: 'EUR/USD, GBP/USD, USD/JPY…' },
  { id: 'ug_fx_cross',        categoryId: 'forex'       as CategoryId, label: 'Cross',              desc: 'EUR/GBP, AUD/JPY, GBP/CHF…' },
  { id: 'ug_fx_exotic',       categoryId: 'forex'       as CategoryId, label: 'Esotico',            desc: 'USD/TRY, USD/ZAR, USD/MXN…' },
  // indices (5)
  { id: 'ug_index_us',        categoryId: 'indices'     as CategoryId, label: 'Indici US',          desc: 'S&P500, NQ100, DJIA…'       },
  { id: 'ug_index_eu_core',   categoryId: 'indices'     as CategoryId, label: 'EU (No Tax)',        desc: 'DAX, CAC40, FTSE MIB CFD…'  },
  { id: 'ug_index_eu_tax',    categoryId: 'indices'     as CategoryId, label: 'EU (FTT)',           desc: 'FTSE MIB futures — FTT 0.02%'},
  { id: 'ug_index_asia',      categoryId: 'indices'     as CategoryId, label: 'Asiatici',           desc: 'Nikkei, Hang Seng, ASX…'    },
  { id: 'ug_index_volatility',categoryId: 'indices'     as CategoryId, label: 'Volatilità (VIX)',   desc: 'VIX futures, UVXY, SVXY…'   },
  // equities (6)
  { id: 'ug_equity_us_large', categoryId: 'equities'   as CategoryId, label: 'US Large Cap',       desc: 'AAPL, MSFT, NVDA, SPY…'     },
  { id: 'ug_equity_us_small', categoryId: 'equities'   as CategoryId, label: 'US Small Cap',       desc: 'Russell 2000, micro cap…'   },
  { id: 'ug_equity_eu_ftt',   categoryId: 'equities'   as CategoryId, label: 'EU con FTT',         desc: 'Azioni IT/FR con Tobin tax' },
  { id: 'ug_equity_eu_core',  categoryId: 'equities'   as CategoryId, label: 'EU (No Tax)',        desc: 'DE, NL, CH — no FTT'        },
  { id: 'ug_equity_uk',       categoryId: 'equities'   as CategoryId, label: 'UK (Londra)',        desc: 'Stamp duty 0.5% su acquisto'},
  { id: 'ug_equity_adr',      categoryId: 'equities'   as CategoryId, label: 'ADR',                desc: 'Azioni estere su US exchanges'},
  // commodities (3)
  { id: 'ug_commodity_metal', categoryId: 'commodities'as CategoryId, label: 'Metalli (Spot)',     desc: 'Gold, Silver, Platinum…'    },
  { id: 'ug_commodity_energy',categoryId: 'commodities'as CategoryId, label: 'Energia',            desc: 'WTI, Brent, Nat Gas…'       },
  { id: 'ug_commodity_agri',  categoryId: 'commodities'as CategoryId, label: 'Agricoltura',        desc: 'Wheat, Corn, Soybean…'      },
  // etf (3)
  { id: 'ug_etf_us_broad',     categoryId: 'etf'       as CategoryId, label: 'US Broad Market',   desc: 'SPY, QQQ, IWM…'             },
  { id: 'ug_etf_us_leveraged', categoryId: 'etf'       as CategoryId, label: 'Leveraged 2x/3x',   desc: 'TQQQ, SOXL, UPRO…'         },
  { id: 'ug_etf_ucits',        categoryId: 'etf'       as CategoryId, label: 'UCITS (Europa)',     desc: 'iShares, Amundi, Xtrackers…'},
  // crypto (2)
  { id: 'ug_crypto_major',    categoryId: 'crypto'     as CategoryId, label: 'Major',              desc: 'BTC, ETH, SOL…'             },
  { id: 'ug_crypto_altcoin',  categoryId: 'crypto'     as CategoryId, label: 'Altcoin',            desc: 'Tutto il resto — high beta' },
] as const;

type UnderlyingGroupId = typeof UNDERLYING_GROUPS[number]['id'];

const STRATEGIES = [
  { id: 'momentum',       label: 'Momentum',       icon: TrendingUp,  desc: 'Trend Following'    },
  { id: 'breakout',       label: 'Breakout',        icon: Zap,         desc: 'Level Expansion'    },
  { id: 'mean_reversion', label: 'Mean Reversion',  icon: Activity,    desc: 'Range Bound'        },
] as const;

const HORIZONS = [
  { id: 'scalping',  label: 'Scalping',  icon: Clock,        desc: 'Minuti / Ore'          },
  { id: 'intraday',  label: 'Intraday',  icon: Calendar,     desc: 'Chiusura in giornata'  },
  { id: 'multiday',  label: 'Multiday',  icon: CalendarDays, desc: 'Da 2 a 5 giorni'       },
  { id: 'position',  label: 'Position',  icon: Mountain,     desc: 'Settimane / Mesi'      },
] as const;

type StrategyId = typeof STRATEGIES[number]['id'];
type HorizonId  = typeof HORIZONS[number]['id'];

// ---------------------------------------------------------------------------
// 2. COST MODEL
// ---------------------------------------------------------------------------

type SimResult = {
  spreadBps:   number;
  swapPerDay:  number;
  platformFee: number;
  totalDrag:   number;
  rating:      'low' | 'medium' | 'high';
  primaryIssue: string;
  suggestion:  string;
};

type CostTable = Record<UnderlyingGroupId, Record<StrategyId, Record<HorizonId, SimResult>>>;

/* Shorthand builder */
const r = (
  spreadBps: number, swapPerDay: number, platformFee: number, totalDrag: number,
  rating: SimResult['rating'], primaryIssue: string, suggestion: string,
): SimResult => ({ spreadBps, swapPerDay, platformFee, totalDrag, rating, primaryIssue, suggestion });

const COST_TABLE: CostTable = {
  // ── FOREX ────────────────────────────────────────────────────────────────
  ug_fx_core: {
    momentum: {
      scalping:  r(2,0,   0.01, 5,  'low',    'Spread bid/ask ripetuto',             'Broker ECN spread < 0.5 pip'),
      intraday:  r(2,0,   0.01, 4,  'low',    'Spread ampliato nelle ore news',      'Evita aperture in orari illiquidi'),
      multiday:  r(2,1.2, 0.01, 12, 'medium', 'Swap overnight si accumula',          'Considera futures su valute per multiday'),
      position:  r(2,1.2, 0.01, 38, 'high',   'Swap mangia i profitti',              'Futures o ETC valutari per position trading'),
    },
    breakout: {
      scalping:  r(2,0,   0.01, 6,  'low',    'Slippage in breakout reale',          'Controlla slippage del broker in volatilità'),
      intraday:  r(2,0,   0.01, 4,  'low',    'Falsi breakout aumentano i trade',    'Filtra breakout con volume'),
      multiday:  r(2,1.2, 0.01, 14, 'medium', 'Swap su posizioni overnight',         'Rollover su futures valutari'),
      position:  r(2,1.2, 0.01, 42, 'high',   'Swap settimanale distrugge edge',     'Futures su cambi — nessun swap'),
    },
    mean_reversion: {
      scalping:  r(3,0,   0.01, 7,  'medium', 'Alta frequenza moltiplica spread',    'Ridurre frequenza o usare conto PRO'),
      intraday:  r(2,0,   0.01, 5,  'low',    'Range trading efficiente sui major',  'Verifica spread nelle ore asiatiche'),
      multiday:  r(2,1.2, 0.01, 15, 'medium', 'Swap dannoso su mean rev lento',      'Usa orizzonte intraday per mean reversion'),
      position:  r(2,1.2, 0.01, 40, 'high',   'Swap + drawdown esteso = perdita',    'Mean rev non si sposa con position holding'),
    },
  },
  ug_fx_cross: {
    momentum: {
      scalping:  r(4,0,   0.01, 9,  'medium', 'Spread più largo sui cross',          'Usa ECN, evita cross illiquidi in scalping'),
      intraday:  r(4,0,   0.01, 8,  'medium', 'Spread variabile durante overlap',    'Opera negli overlap London/NY'),
      multiday:  r(4,1.5, 0.01, 18, 'medium', 'Spread + swap si sommano',            'Futures OTC o CFD con swap contenuto'),
      position:  r(4,1.5, 0.01, 45, 'high',   'Swap elevato su cross minori',        'Considera futures o ETC per esposizione lunga'),
    },
    breakout: {
      scalping:  r(5,0,   0.01, 11, 'medium', 'Spread ampio mangia breakout piccoli','Target minimo 3× lo spread'),
      intraday:  r(4,0,   0.01, 9,  'medium', 'Falsi breakout frequenti sui cross',  'Filtra con ATR e volume relativo'),
      multiday:  r(4,1.5, 0.01, 20, 'high',   'Swap overnight + spread = alto drag', 'Riduci leva su cross multiday'),
      position:  r(4,1.5, 0.01, 50, 'high',   'Swap distrugge edge su cross',        'Spot solo con capitale adeguato'),
    },
    mean_reversion: {
      scalping:  r(5,0,   0.01, 12, 'high',   'Spread troppo largo per scalping MR', 'Mean rev su cross funziona da H4 in su'),
      intraday:  r(4,0,   0.01, 9,  'medium', 'Range intraday spesso valido',        'Concentrati sugli overlap liquidi'),
      multiday:  r(4,1.5, 0.01, 19, 'medium', 'Swap + drawdown allungato',           'Orizzonte intraday più efficiente per MR'),
      position:  r(4,1.5, 0.01, 48, 'high',   'Swap + mean rev lenta = rischio alto','Evita mean rev a leva su cross minori'),
    },
  },
  ug_fx_exotic: {
    momentum: {
      scalping:  r(20,0,  0.02, 45, 'high',   'Spread esotici estremi in scalping',  'Esotici inadatti a scalping — usa swing'),
      intraday:  r(15,0,  0.02, 32, 'high',   'Spread >10 pip common su esotici',    'Target solo su movimenti news macro'),
      multiday:  r(15,3,  0.02, 55, 'high',   'Spread + swap esotici molto alti',    'Position sizing molto ridotto'),
      position:  r(15,3,  0.02, 90, 'high',   'Swap su esotici distrugge capital',   'ETF emerging market per esposizione lunga'),
    },
    breakout: {
      scalping:  r(20,0,  0.02, 48, 'high',   'Spread > target su ogni breakout',    'Esotici non adatti a scalping'),
      intraday:  r(15,0,  0.02, 35, 'high',   'Slippage incontrollabile in news',    'Opera solo su eventi macro importanti'),
      multiday:  r(15,3,  0.02, 58, 'high',   'Swap + spread = drag enorme',         'Massima attenzione a rollover'),
      position:  r(15,3,  0.02, 95, 'high',   'Strutturalmente non profittevole',    'ETF EM o obbligazioni EM come alternativa'),
    },
    mean_reversion: {
      scalping:  r(20,0,  0.02, 50, 'high',   'Spread troppo alto per qualsiasi MR', 'Esotici non sono mean-reverting su breve'),
      intraday:  r(15,0,  0.02, 36, 'high',   'Range intraday instabile',            'Solo su coppie con range giornaliero definito'),
      multiday:  r(15,3,  0.02, 60, 'high',   'Swap + MR lenta = perdita garantita', 'Usa spot con no-leverage'),
      position:  r(15,3,  0.02, 95, 'high',   'Impossibile fare MR con swap esotici','Evita esotici in position trading'),
    },
  },

  // ── INDICES ──────────────────────────────────────────────────────────────
  ug_index_us: {
    momentum: {
      scalping:  r(3,0,   0.02, 7,  'medium', 'CFD spread ampliato in volatilità',   'Usa E-mini o Micro futures per scalping'),
      intraday:  r(2,0,   0.02, 5,  'low',    'Spread CFD competitivo nelle ore US',  'Confronta CFD vs E-mini su costi totali'),
      multiday:  r(3,1.5, 0.02, 18, 'medium', 'Financing charge CFD overnight',       'Futures su indici eliminano financing'),
      position:  r(3,1.5, 0.02, 50, 'high',   'CFD financing distrugge position',     'ETF a leva o futures rolling'),
    },
    breakout: {
      scalping:  r(4,0,   0.02, 9,  'medium', 'Spread alto + slippage breakout',      'Micro futures per breakout su indici US'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Falsi breakout comuni su open US',     'Filtra con volumi futures, non CFD'),
      multiday:  r(3,1.5, 0.02, 20, 'high',   'Financing overnight elevato',          'Futures rolling mensile'),
      position:  r(3,1.5, 0.02, 55, 'high',   'Financing CFD > rendimento atteso',    'ETF o futures per exposure direzionale'),
    },
    mean_reversion: {
      scalping:  r(4,0,   0.02, 9,  'medium', 'Indici US tendono — MR rischiosa',     'Verifica regime di mercato prima'),
      intraday:  r(3,0,   0.02, 6,  'low',    'Range intraday predicibile su US',     'Orari: open US e close EU'),
      multiday:  r(3,1.5, 0.02, 19, 'medium', 'Trend può sovrastare mean reversion',  'Usa filtro di trend prima di entrare'),
      position:  r(3,1.5, 0.02, 48, 'high',   'Holding lungo + MR = mal mix',         'Strategia inadatta a position su indici'),
    },
  },
  ug_index_eu_core: {
    momentum: {
      scalping:  r(4,0,   0.02, 9,  'medium', 'Spread CFD EU più largo di US',        'Futures DAX o CAC per scalping efficiente'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Spread variabile open Londra',         'Opera nelle prime 2h di apertura EU'),
      multiday:  r(3,1.5, 0.02, 19, 'medium', 'Financing overnight CFD EU',           'Futures EU-listed, rollover pulito'),
      position:  r(3,1.5, 0.02, 52, 'high',   'CFD financing annulla edge',           'ETF UCITS senza leva per position'),
    },
    breakout: {
      scalping:  r(5,0,   0.02, 12, 'medium', 'Spread EU ampio su breakout',          'Futures micro DAX per breakout'),
      intraday:  r(4,0,   0.02, 9,  'medium', 'Falsi breakout su indici EU liquidi',  'Conferma con volume futures EU'),
      multiday:  r(3,1.5, 0.02, 21, 'high',   'Overnight financing elevato',          'Futures rolling su scadenza mensile'),
      position:  r(3,1.5, 0.02, 56, 'high',   'Financing > rendimento medio',         'ETF europei quotati in EUR'),
    },
    mean_reversion: {
      scalping:  r(5,0,   0.02, 12, 'medium', 'Spread alto mina frequenza MR',        'Ridurre frequenza, opera solo su H1+'),
      intraday:  r(3,0,   0.02, 7,  'low',    'Range intraday EU abbastanza stabile', 'Frankfurt open e 30min prima close EU'),
      multiday:  r(3,1.5, 0.02, 20, 'medium', 'Trend macro EU può rompere range',     'Stop trend-filter obbligatorio'),
      position:  r(3,1.5, 0.02, 50, 'high',   'MR + position su indici = rischioso',  'ETF inversi o opzioni per hedging'),
    },
  },
  ug_index_eu_tax: {
    momentum: {
      scalping:  r(5,0,   0.04, 18, 'high',   'FTT 0.02% ogni trade — devastante',   'FTSE MIB futures evitano FTT su frequente'),
      intraday:  r(4,0,   0.03, 12, 'high',   'FTT si somma a spread e commissioni', 'Valuta se edge > FTT accumulata'),
      multiday:  r(4,1.5, 0.03, 24, 'high',   'FTT + financing CFD double drag',     'Futures con scadenza mensile, nessuna FTT'),
      position:  r(4,1.5, 0.03, 58, 'high',   'FTT + swap + spread = edge azzerato', 'ETF senza leva o futures a scadenza'),
    },
    breakout: {
      scalping:  r(6,0,   0.04, 22, 'high',   'FTT ogni entrata distrugge scalping', 'Scalping incompatibile con FTT — evita'),
      intraday:  r(4,0,   0.03, 13, 'high',   'FTT riduce drasticamente R/R',        'Solo breakout con target > 3× FTT+spread'),
      multiday:  r(4,1.5, 0.03, 26, 'high',   'FTT + financing + swap cumulato',     'Futures FTSE MIB su Euronext'),
      position:  r(4,1.5, 0.03, 62, 'high',   'FTT moltiplica su ogni re-entry',     'ETF FTSE MIB senza leva per position'),
    },
    mean_reversion: {
      scalping:  r(6,0,   0.04, 24, 'high',   'MR + FTT + alta freq = perdita certa','Non scalping su mercati con FTT'),
      intraday:  r(4,0,   0.03, 13, 'high',   'Ogni range-trade tassato',            'Riduci fortemente la frequenza'),
      multiday:  r(4,1.5, 0.03, 25, 'high',   'FTT + mean rev lenta = alto costo',   'Orizzonte intraday più efficiente'),
      position:  r(4,1.5, 0.03, 60, 'high',   'FTT + holding + swap insostenibile',  'ETF o azioni cash senza leva'),
    },
  },
  ug_index_asia: {
    momentum: {
      scalping:  r(6,0,   0.02, 14, 'high',   'Sessioni asiatiche illiquide',         'Spread molto ampio fuori orario EU/US'),
      intraday:  r(5,0,   0.02, 11, 'medium', 'Spread più alto che su EU/US',         'Opera nelle 2h di open Tokyo'),
      multiday:  r(5,2.0, 0.02, 26, 'high',   'Financing + spread asiatico',          'ETF Nikkei/Hang Seng senza swap'),
      position:  r(5,2.0, 0.02, 62, 'high',   'Financing lungo su CFD asia',          'ETF UCITS o futures CME Nikkei'),
    },
    breakout: {
      scalping:  r(7,0,   0.02, 16, 'high',   'Spread enorme in sessione asiatica',   'Non scalping su indici asiatici'),
      intraday:  r(5,0,   0.02, 12, 'medium', 'Falsi breakout frequenti in Asia',     'Aspetta conferma con volumi Tokyo'),
      multiday:  r(5,2.0, 0.02, 28, 'high',   'Overnight financing elevato',          'Futures CME Nikkei per breakout'),
      position:  r(5,2.0, 0.02, 65, 'high',   'Cumulativo insostenibile',             'ETF Nikkei o Hang Seng in EUR'),
    },
    mean_reversion: {
      scalping:  r(7,0,   0.02, 18, 'high',   'Asia spread troppo ampio per MR',      'MR asiatica solo su H4 e superiore'),
      intraday:  r(5,0,   0.02, 12, 'medium', 'Range asiatico spesso valido',         'Nikkei range notturno può essere stabile'),
      multiday:  r(5,2.0, 0.02, 27, 'high',   'Range rotto da gap apertura EU/US',    'Stop su gap protezione obbligatoria'),
      position:  r(5,2.0, 0.02, 60, 'high',   'MR position su Asia — inadatto',       'ETF o obbligazioni EM come alternativa'),
    },
  },
  ug_index_volatility: {
    momentum: {
      scalping:  r(15,0,  0.05, 35, 'high',   'VIX futures spread elevatissimo',     'VIX non è scalp — troppo drag'),
      intraday:  r(12,0,  0.05, 28, 'high',   'VIX tende a 0 → non fare momentum',  'Momentum su VIX solo in spike >= 25'),
      multiday:  r(12,5,  0.05, 52, 'high',   'Contango VX futures erode posizione', 'SVXY (short VIX) per carry ma rischio gap'),
      position:  r(12,5,  0.05, 85, 'high',   'Contango destroy long VIX position',  'Long vol solo come hedge, non come trade'),
    },
    breakout: {
      scalping:  r(15,0,  0.05, 38, 'high',   'Spread VIX enorme su breakout',       'Non scalping su volatilità sintetica'),
      intraday:  r(12,0,  0.05, 30, 'high',   'VIX spike: slippage incontrollabile', 'Usa opzioni per exposure su spike VIX'),
      multiday:  r(12,5,  0.05, 55, 'high',   'Contango mangia breakout lunghi',     'Futures VX sul mese più vicino, size tiny'),
      position:  r(12,5,  0.05, 88, 'high',   'Rollover mensile del contango letale','Opzioni su VIX per position long vol'),
    },
    mean_reversion: {
      scalping:  r(15,0,  0.05, 40, 'high',   'Spread + IV crush = alto drag',       'Non scalping su VIX'),
      intraday:  r(12,0,  0.05, 30, 'high',   'MR su VIX funziona solo da estreme',  'Usa VIX > 30 come segnale entry short vol'),
      multiday:  r(12,5,  0.05, 54, 'high',   'Contango sfavorisce MR long',         'Short VIX solo con hedge opzioni'),
      position:  r(12,5,  0.05, 86, 'high',   'Long VIX position = perdita lenta',   'VIX non è un asset da tenere lungo'),
    },
  },

  // ── EQUITIES ─────────────────────────────────────────────────────────────
  ug_equity_us_large: {
    momentum: {
      scalping:  r(2,0,   0.02, 6,  'low',    'Commissioni per trade + spread',      'Broker zero-commission o DMA'),
      intraday:  r(2,0,   0.02, 5,  'low',    'Spread bid/ask ridotto su large cap',  'Opera solo su titoli volume > 5M/giorno'),
      multiday:  r(2,1.0, 0.02, 12, 'medium', 'CFD overnight charge su large cap',   'Azioni cash per multiday, non CFD'),
      position:  r(2,1.0, 0.02, 36, 'high',   'CFD financing annulla dividendi',     'Compra titoli cash, non CFD a leva'),
    },
    breakout: {
      scalping:  r(3,0,   0.02, 8,  'medium', 'Slippage su breakout pre-market',     'Limit orders vicino al breakout level'),
      intraday:  r(2,0,   0.02, 5,  'low',    'Breakout efficiente su US large cap',  'Attenzione a date di bilancio'),
      multiday:  r(2,1.0, 0.02, 13, 'medium', 'Gap overnight cancella breakout',     'Stop garantito o posizione ridotta'),
      position:  r(2,1.0, 0.02, 38, 'high',   'CFD cost + gap risk su position',     'ETF tematici per exposure direzionale'),
    },
    mean_reversion: {
      scalping:  r(2,0,   0.02, 6,  'low',    'MR su large cap: commissioni ok',     'Target per trade >= 3× spread'),
      intraday:  r(2,0,   0.02, 5,  'low',    'MR solida su blue chip liquide US',   'VWAP e open-range come riferimento range'),
      multiday:  r(2,1.0, 0.02, 13, 'medium', 'Notizie societarie rompono il range', 'Filtra per assenza di catalyst'),
      position:  r(2,1.0, 0.02, 35, 'high',   'MR long-term su azioni = alto rischio','Value investing, non MR a leva'),
    },
  },
  ug_equity_us_small: {
    momentum: {
      scalping:  r(8,0,   0.03, 20, 'high',   'Spread ampio e liquidità bassa',      'Small cap non adatte a scalping'),
      intraday:  r(6,0,   0.03, 14, 'medium', 'Volume variabile su small cap',       'Opera solo su giorni con catalyst noto'),
      multiday:  r(6,1.5, 0.03, 26, 'high',   'Spread + financing + gap risk',       'Size ridottissima, stop obbligatorio'),
      position:  r(6,1.5, 0.03, 58, 'high',   'Cumulativo insostenibile',            'ETF Russell 2000 per exposure small cap'),
    },
    breakout: {
      scalping:  r(10,0,  0.03, 24, 'high',   'Spread > target su ogni breakout',    'Non scalping su small cap'),
      intraday:  r(7,0,   0.03, 16, 'high',   'Breakout spesso falso su low float',  'Filtra con relative volume > 3×'),
      multiday:  r(6,1.5, 0.03, 28, 'high',   'Gap risk elevato overnight',          'Stop fisso obbligatorio'),
      position:  r(6,1.5, 0.03, 60, 'high',   'Strutturalmente rischioso',           'ETF o indice invece di singolo titolo'),
    },
    mean_reversion: {
      scalping:  r(10,0,  0.03, 25, 'high',   'Spread distrugge MR in scalping',     'Non scalping su small cap'),
      intraday:  r(7,0,   0.03, 17, 'high',   'Small cap non mean-reverting spesso',  'Solo su titoli con range storico definito'),
      multiday:  r(6,1.5, 0.03, 27, 'high',   'Gap e news catalyst rompono range',   'Filtra per assenza news e calendar'),
      position:  r(6,1.5, 0.03, 56, 'high',   'MR + position su small cap = pericoloso','ETF invece di single stock'),
    },
  },
  ug_equity_eu_ftt: {
    momentum: {
      scalping:  r(5,0,   0.04, 18, 'high',   'FTT + spread italiano/francese',      'Futures FTSE MIB per evitare FTT'),
      intraday:  r(4,0,   0.03, 12, 'high',   'FTT 0.1% su ogni acquisto',           'Edge deve superare FTT + spread'),
      multiday:  r(4,1.5, 0.03, 24, 'high',   'FTT + CFD financing double drag',     'Cash equities, niente leva'),
      position:  r(4,1.5, 0.03, 56, 'high',   'FTT + swap + spread uccide edge',     'ETF senza leva'),
    },
    breakout: {
      scalping:  r(6,0,   0.04, 22, 'high',   'FTT ogni entrata incompatibile',      'Scalping incompatibile con FTT'),
      intraday:  r(4,0,   0.03, 13, 'high',   'FTT riduce R/R drasticamente',        'Solo breakout con target ampio'),
      multiday:  r(4,1.5, 0.03, 26, 'high',   'FTT + overnight financing',           'Cash azioni senza CFD per multiday'),
      position:  r(4,1.5, 0.03, 60, 'high',   'FTT moltiplica su ogni re-entry',     'ETF MSCI Italy/France senza leva'),
    },
    mean_reversion: {
      scalping:  r(6,0,   0.04, 24, 'high',   'MR + FTT + alta freq = perdita',      'Non scalping su mercati FTT'),
      intraday:  r(4,0,   0.03, 13, 'high',   'Ogni range-trade tassato',            'Riduci fortemente la frequenza'),
      multiday:  r(4,1.5, 0.03, 25, 'high',   'FTT + mean rev lenta = alto costo',   'Orizzonte intraday più efficiente'),
      position:  r(4,1.5, 0.03, 58, 'high',   'FTT + holding = insostenibile',       'ETF o azioni cash senza leva'),
    },
  },
  ug_equity_eu_core: {
    momentum: {
      scalping:  r(3,0,   0.02, 8,  'medium', 'Spread EU leggermente più largo US',  'DMA broker o CFD con spread fisso'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Liquidità alta su DE/NL large cap',   'Opera nelle prime 2h apertura Xetra'),
      multiday:  r(3,1.2, 0.02, 16, 'medium', 'CFD overnight charge EU',             'Cash equity per multiday'),
      position:  r(3,1.2, 0.02, 40, 'high',   'CFD financing > dividend yield',      'Cash titoli, incassa dividendi'),
    },
    breakout: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'Spread + slippage breakout EU',       'Futures su singoli indici EU'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Breakout Xetra efficiente su DAX',    'Filtra con volume Xetra'),
      multiday:  r(3,1.2, 0.02, 18, 'medium', 'Gap overnight risk EU',               'Stop garantito o size ridotta'),
      position:  r(3,1.2, 0.02, 42, 'high',   'CFD financing erode position',        'Cash equity long per position'),
    },
    mean_reversion: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'Spread EU mina frequenza alta',       'Target >= 3× spread per trade'),
      intraday:  r(3,0,   0.02, 7,  'low',    'MR solida su EU blue chip',           'VWAP come riferimento range EU'),
      multiday:  r(3,1.2, 0.02, 17, 'medium', 'News EU rompono range multiday',      'Filtra per assenza catalyst'),
      position:  r(3,1.2, 0.02, 38, 'high',   'MR position EU = rischioso',          'Value investing più adatto'),
    },
  },
  ug_equity_uk: {
    momentum: {
      scalping:  r(4,0,   0.05, 14, 'high',   'Stamp Duty 0.5% su acquisto UK',      'CFD o spread betting esenti Stamp Duty'),
      intraday:  r(3,0,   0.03, 10, 'medium', 'Stamp Duty se azioni cash',           'CFD su UK equity per intraday'),
      multiday:  r(3,1.2, 0.03, 18, 'medium', 'Stamp Duty + CFD overnight charge',  'Spread betting UK: no Stamp, no CGT'),
      position:  r(3,1.2, 0.03, 42, 'high',   'Stamp Duty + financing accumulato',   'ISA o spread betting per position UK'),
    },
    breakout: {
      scalping:  r(5,0,   0.05, 16, 'high',   'Stamp Duty ogni acquisto scalp',      'Spread betting — niente stamp duty'),
      intraday:  r(4,0,   0.03, 11, 'medium', 'Stamp duty riduce R/R breakout',      'CFD UK equity esenta da Stamp'),
      multiday:  r(3,1.2, 0.03, 19, 'medium', 'Gap overnight + stamp accumulato',    'CFD con stop garantito'),
      position:  r(3,1.2, 0.03, 44, 'high',   'Stamp Duty + financing posizione',    'ETF FTSE100 UCITS per position'),
    },
    mean_reversion: {
      scalping:  r(5,0,   0.05, 18, 'high',   'Stamp Duty + MR alta freq = perdita', 'Non scalping su azioni UK cash'),
      intraday:  r(4,0,   0.03, 11, 'medium', 'MR UK ok se su liquid FTSE100',       'CFD per evitare Stamp Duty'),
      multiday:  r(3,1.2, 0.03, 19, 'medium', 'UK news rompono range multiday',      'Filtra per assenza news societarie'),
      position:  r(3,1.2, 0.03, 42, 'high',   'MR + position UK = rischioso',        'ETF FTSE100 senza leva'),
    },
  },
  ug_equity_adr: {
    momentum: {
      scalping:  r(5,0,   0.03, 12, 'medium', 'Spread ADR più largo di ordinario',   'Usa azione originale se accessibile'),
      intraday:  r(4,0,   0.03, 10, 'medium', 'Volume ADR spesso inferiore al titolo','Orari migliori: open NYSE'),
      multiday:  r(4,1.5, 0.03, 22, 'high',   'ADR fee annuale + CFD financing',     'Futures su mercato locale come alternativa'),
      position:  r(4,1.5, 0.03, 48, 'high',   'ADR fee + FX risk + financing',       'ETF mercato locale preferibile'),
    },
    breakout: {
      scalping:  r(6,0,   0.03, 15, 'high',   'Spread ADR distrugge target piccoli', 'Non scalping su ADR'),
      intraday:  r(4,0,   0.03, 11, 'medium', 'Breakout ADR segue il mercato locale','Controlla orario apertura mercato locale'),
      multiday:  r(4,1.5, 0.03, 24, 'high',   'Gap notturno quando il mercato locale è aperto','Stop garantito obbligatorio'),
      position:  r(4,1.5, 0.03, 50, 'high',   'ADR fee + FX drag accumulato',        'ETF paese o azioni locali'),
    },
    mean_reversion: {
      scalping:  r(6,0,   0.03, 17, 'high',   'MR + spread ADR = impossibile',       'Non scalping su ADR'),
      intraday:  r(4,0,   0.03, 11, 'medium', 'MR ADR funziona su liquid ADR',       'Solo ADR con volumi > 500K/giorno'),
      multiday:  r(4,1.5, 0.03, 23, 'high',   'Gap notizie da mercato locale',       'Filtra notizie mercato sottostante'),
      position:  r(4,1.5, 0.03, 46, 'high',   'ADR non ideale per position MR',      'ETF locale invece di ADR singolo'),
    },
  },

  // ── COMMODITIES ──────────────────────────────────────────────────────────
  ug_commodity_metal: {
    momentum: {
      scalping:  r(3,0,   0.02, 8,  'medium', 'Spread Gold Spot ok, Silver meno',    'Usa XAU/USD ECN per scalping metalli'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Spread variabile in ore US',          'Opera durante London-NY overlap'),
      multiday:  r(3,1.0, 0.02, 14, 'medium', 'Swap spot su metalli presente',       'Futures COMEX per niente swap'),
      position:  r(3,1.0, 0.02, 38, 'high',   'Swap spot oro/argento si accumula',   'ETC oro fisico (PHAU) per position'),
    },
    breakout: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'Spread metallic più ampio in news',   'Target >= 3× spread per breakout'),
      intraday:  r(3,0,   0.02, 8,  'medium', 'Falsi breakout in range compresso',   'Filtra con volume COMEX'),
      multiday:  r(3,1.0, 0.02, 16, 'medium', 'Swap overnight + gap risk',           'Futures COMEX rolling mensile'),
      position:  r(3,1.0, 0.02, 42, 'high',   'Swap si accumula su position',        'ETC fisico per holding lungo'),
    },
    mean_reversion: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'Metalli non sono mean-reverting breve','MR su metalli funziona da D1 in su'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Range intraday Gold abbastanza stabile','London open è punto di riferimento'),
      multiday:  r(3,1.0, 0.02, 15, 'medium', 'Trend macro rompe range multiday',    'Filtro trend obbligatorio'),
      position:  r(3,1.0, 0.02, 38, 'high',   'MR oro/argento position = rischioso', 'ETC senza leva preferito'),
    },
  },
  ug_commodity_energy: {
    momentum: {
      scalping:  r(8,0,   0.03, 20, 'high',   'WTI spread ampio + slippage storage', 'Futures CL (NYMEX) per scalping energia'),
      intraday:  r(6,0,   0.03, 14, 'medium', 'Spread variabile intorno a EIA report','Non operare 30min prima/dopo EIA'),
      multiday:  r(6,2.0, 0.03, 28, 'high',   'Contango futures petrolio erode leva', 'Futures rolling attento a contango'),
      position:  r(6,2.0, 0.03, 65, 'high',   'Contango + swap distrugge posizione',  'ETF energia o azioni settore oil'),
    },
    breakout: {
      scalping:  r(9,0,   0.03, 22, 'high',   'EIA/OPEC rende spread estremo',       'Non scalping su energia in giorni EIA'),
      intraday:  r(6,0,   0.03, 15, 'high',   'News OPEC causa slippage incontrollabile','Stop wide o non operare in news'),
      multiday:  r(6,2.0, 0.03, 30, 'high',   'Contango + futures rollover cost',    'Futures front month, size tiny'),
      position:  r(6,2.0, 0.03, 68, 'high',   'Contango distrugge posizione lunga',  'Azioni oil major (CVX, XOM) come alternativa'),
    },
    mean_reversion: {
      scalping:  r(9,0,   0.03, 24, 'high',   'Spread energia troppo ampio per MR',  'Non scalping su energia'),
      intraday:  r(6,0,   0.03, 15, 'high',   'MR su energia rotta da notizie supply','Solo in assenza di catalyst macro'),
      multiday:  r(6,2.0, 0.03, 29, 'high',   'Contango + MR lenta = perdita',       'MR su energia solo su timeframe lungo'),
      position:  r(6,2.0, 0.03, 66, 'high',   'Contango + position holding = rischioso','Azioni energy senza leva per esposizione'),
    },
  },
  ug_commodity_agri: {
    momentum: {
      scalping:  r(10,0,  0.03, 24, 'high',   'Spread agricolo molto ampio',         'Agricoltura non adatta a scalping'),
      intraday:  r(8,0,   0.03, 19, 'high',   'Stagionalità rompe momentum',         'Solo su breakout crop reports USDA'),
      multiday:  r(8,3.0, 0.03, 38, 'high',   'Contango agri + weather risk',        'Futures CBOT con size minima'),
      position:  r(8,3.0, 0.03, 78, 'high',   'Contango stagionale distrugge leva',  'ETF agri o azioni settore per position'),
    },
    breakout: {
      scalping:  r(12,0,  0.03, 28, 'high',   'Spread agri incompatibile con scalp', 'Non scalping su commodity agricole'),
      intraday:  r(9,0,   0.03, 22, 'high',   'Solo su crop reports USDA/WASDE',     'Breakout solo in giornate report'),
      multiday:  r(8,3.0, 0.03, 40, 'high',   'Weather e geopolitica = gap risk',    'Stop molto wide o niente leva'),
      position:  r(8,3.0, 0.03, 80, 'high',   'Contango + weather = alto drag',      'ETF agri per esposizione senza leva'),
    },
    mean_reversion: {
      scalping:  r(12,0,  0.03, 30, 'high',   'Spread + MR = perdita immediata',     'Non scalping su agri'),
      intraday:  r(9,0,   0.03, 22, 'high',   'Agri non mean-reverting su breve',    'MR agri solo su stagionale annuale'),
      multiday:  r(8,3.0, 0.03, 40, 'high',   'Stagionalità rompe range',            'Usa stagionalità come segnale, non MR'),
      position:  r(8,3.0, 0.03, 78, 'high',   'Position MR agri = non strutturato',  'ETF o fondi commodity gestiti'),
    },
  },

  // ── ETF ──────────────────────────────────────────────────────────────────
  ug_etf_us_broad: {
    momentum: {
      scalping:  r(1,0,   0.01, 3,  'low',    'Spread ETF broad market minimo',      'ETF US broad = ottimo per scalping light'),
      intraday:  r(1,0,   0.01, 3,  'low',    'Spread 0.01% su SPY, QQQ, IWM',      'Liquidità massima, costo minimo'),
      multiday:  r(1,0.5, 0.01, 8,  'low',    'Expense ratio annuale (0.03-0.09%)',  'ETF cash no leva = multiday ideale'),
      position:  r(1,0.5, 0.01, 16, 'low',    'Solo expense ratio, nessun swap',     'ETF cash è lo strumento ottimale'),
    },
    breakout: {
      scalping:  r(1,0,   0.01, 3,  'low',    'Spread minimo su ETF liquid',         'ETF liquid = breakout scalping ok'),
      intraday:  r(1,0,   0.01, 3,  'low',    'Breakout efficiente su SPY/QQQ',      'Volume massimo all'open NYSE'),
      multiday:  r(1,0.5, 0.01, 9,  'low',    'Expense ratio + rischio gap',         'ETF cash, nessuna leva su multiday'),
      position:  r(1,0.5, 0.01, 18, 'low',    'Expense ratio basso su position',     'ETF è il veicolo ideale per position'),
    },
    mean_reversion: {
      scalping:  r(1,0,   0.01, 3,  'low',    'MR su ETF broad: spread ok',          'ETF broad sono abbastanza mean-reverting'),
      intraday:  r(1,0,   0.01, 3,  'low',    'VWAP reversion su SPY/QQQ efficiente','Usa VWAP come ancora di MR'),
      multiday:  r(1,0.5, 0.01, 9,  'low',    'MR su ETF solida su intraday',        'Multiday MR rischiosa su trend mercato'),
      position:  r(1,0.5, 0.01, 17, 'low',    'Position MR su ETF broad = value inv','Logica value investing più che MR'),
    },
  },
  ug_etf_us_leveraged: {
    momentum: {
      scalping:  r(3,0,   0.02, 8,  'medium', 'Spread ETF leva più ampio di base',   'Volumi ok su TQQQ/SOXL in orario US'),
      intraday:  r(2,0,   0.02, 6,  'medium', 'Volatility drag su ETF 3× intraday',  'Tieni solo per sessione, non overnight'),
      multiday:  r(2,3.0, 0.02, 22, 'high',   'Volatility decay distrugge ETF leva', 'ETF leva solo intraday — mai overnight'),
      position:  r(2,3.0, 0.02, 75, 'high',   'Decay giornaliero = perdita certa',   'ETF leva non adatti a position holding'),
    },
    breakout: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'Spread + amplificazione leva',        'Breakout solo su sessione principale'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'Breakout amplificato su ETF 3×',      'Attenzione a IV crush in reverse'),
      multiday:  r(3,3.0, 0.02, 28, 'high',   'Decay overnight annulla breakout',    'Chiudi prima del close sempre'),
      position:  r(3,3.0, 0.02, 80, 'high',   'Strutturalmente inappropriato',       'Mai tenere ETF leva beyond 1 giorno'),
    },
    mean_reversion: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'ETF leva non sono mean-reverting',    'MR su ETF leva è controintuitivo'),
      intraday:  r(3,0,   0.02, 7,  'medium', 'MR su TQQQ intraday può funzionare', 'Solo su inversioni di breve nel trend'),
      multiday:  r(3,3.0, 0.02, 30, 'high',   'Decay + MR lenta = perdita certa',   'Non tenere ETF leva overnight'),
      position:  r(3,3.0, 0.02, 82, 'high',   'ETF leva non per position MR',        'Impossibile — decay giornaliero costante'),
    },
  },
  ug_etf_ucits: {
    momentum: {
      scalping:  r(4,0,   0.02, 10, 'medium', 'Spread UCITS più alto di ETF US',     'UCITS meno liquidi di SPY/QQQ'),
      intraday:  r(3,0,   0.02, 8,  'medium', 'Volume intraday UCITS limitato',      'Opera nelle ore peak di Borsa Italiana/Xetra'),
      multiday:  r(3,0.3, 0.02, 12, 'low',    'Expense ratio UCITS (0.07-0.3%)',     'ETF UCITS cash = multiday efficiente'),
      position:  r(3,0.3, 0.02, 20, 'low',    'Solo expense ratio UCITS annuo',      'ETF UCITS ideale per position in EUR'),
    },
    breakout: {
      scalping:  r(5,0,   0.02, 12, 'medium', 'Spread UCITS troppo largo per scalp', 'Non scalping su UCITS'),
      intraday:  r(4,0,   0.02, 9,  'medium', 'Breakout UCITS segue mercato US',     'Volume peak a open EU e NY'),
      multiday:  r(3,0.3, 0.02, 13, 'low',    'Gap risk EU su breakout overnight',   'ETF cash per multiday ok'),
      position:  r(3,0.3, 0.02, 22, 'low',    'ETF UCITS cash per position',         'Veicolo ideale per investitore EU'),
    },
    mean_reversion: {
      scalping:  r(5,0,   0.02, 12, 'medium', 'Spread UCITS mina MR scalping',       'Non scalping su UCITS'),
      intraday:  r(4,0,   0.02, 9,  'medium', 'MR UCITS funziona su blue chip EU',   'Opera nelle ore di liquidità EU'),
      multiday:  r(3,0.3, 0.02, 13, 'low',    'MR multiday UCITS accettabile',       'ETF UCITS tra i più adatti a MR swing'),
      position:  r(3,0.3, 0.02, 20, 'low',    'Position MR UCITS ok per investitore','ETF UCITS = veicolo ideale EU'),
    },
  },

  // ── CRYPTO ───────────────────────────────────────────────────────────────
  ug_crypto_major: {
    momentum: {
      scalping:  r(8,0,   0.04, 20, 'high',   'Fee taker + spread molto elevati',    'Maker orders su MEXC/Bybit fee 0'),
      intraday:  r(6,0,   0.04, 16, 'medium', 'Fee taker + spread variabile',        'Maker-only strategy o exchange con rebate'),
      multiday:  r(6,2.0, 0.04, 28, 'high',   'Funding rate perpetual ogni 8h',      'Monitora funding ogni 8h, chiudi se > 0.1%'),
      position:  r(6,2.0, 0.04, 70, 'high',   'Funding rate distrugge leva lunga',   'Spot o delta-neutral per holding lungo'),
    },
    breakout: {
      scalping:  r(10,0,  0.04, 25, 'high',   'Breakout falsi + spread altissimo',   'Filtra breakout con OI e volume on-chain'),
      intraday:  r(7,0,   0.04, 18, 'medium', 'Fee taker + liquidazioni casuali',    'Stop fisico e size contenuta'),
      multiday:  r(6,2.0, 0.04, 30, 'high',   'Funding + volatilità = incertezza',   'Usa spot BTC/ETH per breakout strutturale'),
      position:  r(6,2.0, 0.04, 75, 'high',   'Funding distrugge edge su leva',      'Spot only per breakout lungo periodo'),
    },
    mean_reversion: {
      scalping:  r(8,0,   0.04, 22, 'high',   'Crypto non è mean-reverting su scalp','MR su crypto funziona solo da H4+'),
      intraday:  r(6,0,   0.04, 16, 'medium', 'Range intraday instabile in crypto',  'Usa bande di volatilità storica'),
      multiday:  r(6,2.0, 0.04, 28, 'high',   'Funding rate + drawdown esteso',      'Spot + DCA per mean reversion lenta'),
      position:  r(6,2.0, 0.04, 72, 'high',   'Funding a leva + MR = perdita',       'Spot accumulation, nessuna leva'),
    },
  },
  ug_crypto_altcoin: {
    momentum: {
      scalping:  r(20,0,  0.06, 50, 'high',   'Spread altcoin estremo + fee alta',   'Altcoin incompatibili con scalping'),
      intraday:  r(15,0,  0.05, 38, 'high',   'Liquidità bassa, slippage enorme',    'Solo altcoin top-20 per intraday'),
      multiday:  r(15,3.0,0.05, 65, 'high',   'Funding + spread + liquidità bassa',  'Size tiny, stop molto largo'),
      position:  r(15,3.0,0.05, 110,'high',   'Funding distrugge posizione leva',    'Spot only, nessuna leva su altcoin'),
    },
    breakout: {
      scalping:  r(25,0,  0.06, 58, 'high',   'Spread > breakout target — evita',    'Altcoin non adatti a scalping'),
      intraday:  r(15,0,  0.05, 40, 'high',   'Breakout falso su altcoin frequent',  'Filtra con BTC dominance e OI'),
      multiday:  r(15,3.0,0.05, 68, 'high',   'Rug pull e news sudden su altcoin',   'Stop fisso, size minima obbligatoria'),
      position:  r(15,3.0,0.05, 115,'high',   'Funding + hold altcoin = rischioso',  'Spot accumulation con DCA'),
    },
    mean_reversion: {
      scalping:  r(25,0,  0.06, 60, 'high',   'Spread altcoin distrugge MR scalp',   'Non scalping su altcoin'),
      intraday:  r(15,0,  0.05, 40, 'high',   'Altcoin non mean-reverting su breve', 'MR altcoin solo su timeframe settimanale'),
      multiday:  r(15,3.0,0.05, 68, 'high',   'Funding + drawdown esteso altcoin',   'DCA spot senza leva'),
      position:  r(15,3.0,0.05, 112,'high',   'Position MR altcoin = perdita quasi certa','Spot only, pianifica exit in target'),
    },
  },
};

// ---------------------------------------------------------------------------
// 3. STATE TYPES & ANIMATION
// ---------------------------------------------------------------------------

type SimulatorState = {
  category?:  CategoryId;
  ugId?:      UnderlyingGroupId;
  strategy?:  StrategyId;
  horizon?:   HorizonId;
};

const spring = { type: 'spring' as const, stiffness: 280, damping: 28 };

const fade = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -12, scale: 0.99, position: 'absolute' as const },
};

// ---------------------------------------------------------------------------
// 4. MAIN COMPONENT
// ---------------------------------------------------------------------------

export function InteractiveSimulator() {
  const [step, setStep]             = useState<number>(0);
  const [selections, setSelections] = useState<SimulatorState>({});

  /* Filtered UGs for current category */
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

  const handleSelectStrategy = (id: StrategyId) => {
    setSelections(prev => ({ ...prev, strategy: id }));
    setStep(3);
  };

  const handleSelectHorizon = (id: HorizonId) => {
    setSelections(prev => ({ ...prev, horizon: id }));
    setStep(4);
  };

  const navigateToStep = (target: number) => {
    if (target < step) {
      if (target === 0) setSelections({});
      if (target === 1) setSelections(prev => ({ category: prev.category }));
      if (target === 2) setSelections(prev => ({ category: prev.category, ugId: prev.ugId }));
      if (target === 3) setSelections(prev => ({ category: prev.category, ugId: prev.ugId, strategy: prev.strategy }));
      setStep(target);
    }
  };

  const reset = () => { setSelections({}); setStep(0); };

  const result: SimResult | null =
    step === 4 && selections.ugId && selections.strategy && selections.horizon
      ? COST_TABLE[selections.ugId][selections.strategy][selections.horizon]
      : null;

  const PROMPTS = [
    'Cosa tradi principalmente?',
    'Qual è il sottogruppo?',
    'Qual è il tuo approccio?',
    'Che orizzonte temporale usi?',
    null,
  ];

  const ratingConfig = {
    low:    { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Attrito basso'    },
    medium: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20',    label: 'Attrito moderato' },
    high:   { icon: TrendingDown,  color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',         label: 'Attrito elevato'  },
  };

  const TOTAL_STEPS = 4;

  return (
    <div className="relative w-full flex flex-col p-5 sm:p-6 xl:p-7">

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

      {/* Prompt */}
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

      {/* Step content */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">

          {/* STEP 0 — 6 categories */}
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

          {/* STEP 1 — underlying groups (filtered) */}
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

          {/* STEP 2 — strategies */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-3 gap-3 w-full"
            >
              {STRATEGIES.map((item) => (
                <OptionCard
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  description={item.desc}
                  onClick={() => handleSelectStrategy(item.id)}
                />
              ))}
            </motion.div>
          )}

          {/* STEP 3 — horizons */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={fade} initial="initial" animate="animate" exit="exit" transition={spring}
              className="grid grid-cols-2 gap-3 w-full"
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

          {/* STEP 4 — result */}
          {step === 4 && result && (
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

              {/* Recap + reset */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {[selections.category, selections.ugId, selections.strategy, selections.horizon].map((s) => s && (
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
      {step > 0 && step < TOTAL_STEPS && (
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
          {step > 1 && selections.ugId && (
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
          {step > 2 && selections.strategy && (
            <>
              <span className="text-muted-foreground/30 text-xs">/</span>
              <button
                onClick={() => navigateToStep(2)}
                className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-secondary"
              >
                <ChevronLeft className="size-3" />
                {STRATEGIES.find(s => s.id === selections.strategy)?.label}
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
