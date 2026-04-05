'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { AppConfig } from '@/utils/AppConfig';

// ==================== SOTA MATRIX CONFIG ====================
// EXACT DB ENUM MAPPING - NEVER CHANGE THESE VALUES
export const ASSET_GROUPS = [
  { id: 'forex', label: 'Forex' },
  { id: 'indices', label: 'Indici & Volatilità' },
  { id: 'equities', label: 'Azioni (Equities)' },
  { id: 'etf', label: 'ETF' },
  { id: 'commodities', label: 'Materie Prime' },
  { id: 'crypto', label: 'Crypto' },
];

// ALL TOP ASSETS - 90% OF RETAIL VOLUME COVERAGE
// Direct 1:1 mapping to underlying_group enum
export const ASSET_HIERARCHY = [
  // Forex
  {
    id: 'forex',
    label: 'Forex',
    children: [
      {
        id: 'fx_core',
        label: 'Major (Core)',
        assets: [
          { symbol: 'EURUSD', name: 'Euro / US Dollar' },
          { symbol: 'GBPUSD', name: 'British Pound / US Dollar' },
          { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen' },
          { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar' },
          { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar' },
        ]
      },
      {
        id: 'fx_cross',
        label: 'Cross',
        assets: [
          { symbol: 'EURGBP', name: 'Euro / British Pound' },
          { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen' },
        ]
      },
      {
        id: 'fx_exotic',
        label: 'Esotiche',
        assets: [
          { symbol: 'USDTRY', name: 'US Dollar / Turkish Lira' },
          { symbol: 'USDMXN', name: 'US Dollar / Mexican Peso' },
        ]
      }
    ]
  },
  // Indici
  {
    id: 'indices',
    label: 'Indici & Volatilità',
    children: [
      {
        id: 'index_us',
        label: 'Indici USA',
        assets: [
          { symbol: 'US500', name: 'S&P 500' },
          { symbol: 'US30', name: 'Dow Jones Industrial Average' },
          { symbol: 'NAS100', name: 'Nasdaq 100' },
        ]
      },
      {
        id: 'index_eu_core',
        label: 'Indici EU (No Tax)',
        assets: [
          { symbol: 'DAX40', name: 'DAX 40' },
        ]
      },
      {
        id: 'index_eu_tax',
        label: 'Indici EU (Tassati)',
        assets: [
          { symbol: 'FTSEMIB', name: 'FTSE MIB' },
          { symbol: 'IBEX35', name: 'IBEX 35' },
        ]
      },
      {
        id: 'index_asia',
        label: 'Indici Asiatici',
        assets: [
          { symbol: 'JPN225', name: 'Nikkei 225' },
        ]
      },
      {
        id: 'index_volatility',
        label: 'Volatilità (VIX)',
        assets: [
          { symbol: 'VIX', name: 'CBOE Volatility Index' },
        ]
      }
    ]
  },
  // Equities
  {
    id: 'equities',
    label: 'Azioni (Equities)',
    children: [
      {
        id: 'equity_us_large',
        label: 'USA Large Cap',
        assets: [
          { symbol: 'AAPL', name: 'Apple Inc.' },
          { symbol: 'MSFT', name: 'Microsoft Corporation' },
          { symbol: 'NVDA', name: 'NVIDIA Corporation' },
          { symbol: 'TSLA', name: 'Tesla Inc.' },
          { symbol: 'AMZN', name: 'Amazon.com Inc.' },
          { symbol: 'META', name: 'Meta Platforms Inc.' },
          { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        ]
      },
      {
        id: 'equity_us_small',
        label: 'USA Small Cap',
        assets: []
      },
      {
        id: 'equity_eu_ftt',
        label: 'Europa (Con FTT)',
        assets: [
          { symbol: 'ENI', name: 'ENI SpA' },
          { symbol: 'ISP', name: 'Intesa Sanpaolo' },
        ]
      },
      {
        id: 'equity_eu_core',
        label: 'Europa (No Tax)',
        assets: [
          { symbol: 'BMW', name: 'Bayerische Motoren Werke AG' },
          { symbol: 'SIE', name: 'Siemens AG' },
        ]
      },
      {
        id: 'equity_uk',
        label: 'UK (Londra)',
        assets: [
          { symbol: 'BP.', name: 'BP Plc' },
        ]
      }
    ]
  },
  // Commodities
  {
    id: 'commodities',
    label: 'Materie Prime',
    children: [
      {
        id: 'commodity_metal',
        label: 'Metalli (Spot)',
        assets: [
          { symbol: 'XAUUSD', name: 'Gold / US Dollar' },
          { symbol: 'XAGUSD', name: 'Silver / US Dollar' },
        ]
      },
      {
        id: 'commodity_energy',
        label: 'Energetiche',
        assets: [
          { symbol: 'WTI', name: 'West Texas Intermediate Crude Oil' },
          { symbol: 'BRENT', name: 'Brent Crude Oil' },
          { symbol: 'NATGAS', name: 'Natural Gas' },
        ]
      },
      {
        id: 'commodity_agri',
        label: 'Agricole',
        assets: [
          { symbol: 'WHEAT', name: 'Wheat Futures' },
          { symbol: 'COFFEE', name: 'Coffee C Futures' },
        ]
      }
    ]
  },
  // ETF
  {
    id: 'etf',
    label: 'ETF',
    children: [
      {
        id: 'etf_us_broad',
        label: 'Indici USA',
        assets: [
          { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
          { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
        ]
      },
      {
        id: 'etf_us_leveraged',
        label: 'Leva 2x/3x',
        assets: [
          { symbol: 'TQQQ', name: 'ProShares UltraPro QQQ' },
          { symbol: 'SQQQ', name: 'ProShares UltraPro Short QQQ' },
        ]
      },
      {
        id: 'etf_ucits',
        label: 'UCITS (Europa)',
        assets: [
          { symbol: 'CSPX', name: 'iShares Core S&P 500 UCITS ETF' },
        ]
      }
    ]
  },
  // Crypto
  {
    id: 'crypto',
    label: 'Crypto',
    children: [
      {
        id: 'crypto_major',
        label: 'Major',
        assets: [
          { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar' },
          { symbol: 'ETHUSD', name: 'Ethereum / US Dollar' },
        ]
      },
      {
        id: 'crypto_altcoin',
        label: 'Altcoins',
        assets: [
          { symbol: 'SOLUSD', name: 'Solana / US Dollar' },
          { symbol: 'DOGEUSD', name: 'Dogecoin / US Dollar' },
        ]
      }
    ]
  }
];

// Flatten for search
const flattenAssets = () => {
  const items: any[] = [];
  ASSET_HIERARCHY.forEach(group => {
    group.children.forEach(subgroup => {
      // Add subgroup as selectable item
      items.push({
        type: 'subgroup',
        id: subgroup.id,
        label: subgroup.label,
        group: group.id,
        underlying_group: subgroup.id
      });
      // Add individual assets
      subgroup.assets.forEach(asset => {
        items.push({
          type: 'asset',
          id: asset.symbol,
          symbol: asset.symbol,
          name: asset.name,
          label: `${asset.symbol} - ${asset.name}`,
          group: group.id,
          subgroup: subgroup.id,
          underlying_group: subgroup.id
        });
      });
    });
  });
  return items;
};

const ALL_SEARCH_ITEMS = flattenAssets();

export const HORIZONS = [
  { id: 'scalping', label: 'Scalping', holdingDays: 0, tradesPerDay: 15 },
  { id: 'intraday', label: 'Intraday', holdingDays: 0, tradesPerDay: 3 },
  { id: 'swing', label: 'Swing Trading', holdingDays: 4, tradesPerDay: 0.5 },
  { id: 'position', label: 'Position / Hold', holdingDays: 45, tradesPerDay: 0.05 },
];

export const STRATEGY_MAP: Record<string, { value: string; label: string }[]> = {
  scalping: [
    { value: 'order_flow', label: 'Order Flow / DOM' },
    { value: 'micro_momentum', label: 'Micro Momentum' },
    { value: 'news_reaction', label: 'News Reaction' },
  ],
  intraday: [
    { value: 'breakout', label: 'Breakout' },
    { value: 'vwap_bounce', label: 'VWAP Bounce' },
    { value: 'trend_following_day', label: 'Trend Following Intraday' },
  ],
  swing: [
    { value: 'trend_following', label: 'Trend Following' },
    { value: 'range_trading', label: 'Range / Channel Trading' },
    { value: 'mean_reversion', label: 'Mean Reversion' },
  ],
  position: [
    { value: 'macro_trend', label: 'Macro Trend Play' },
    { value: 'carry_trade', label: 'Carry Trade (Swap Yield)' },
    { value: 'value_investing', label: 'Value / Dividend Capture' },
  ],
};

const capitalRanges = [
  { key: 'tiny', min: 100, max: 300, label: '100 – 300' },
  { key: 'small', min: 300, max: 1000, label: '300 – 1.000' },
  { key: 'mid', min: 1000, max: 3000, label: '1.000 – 3.000' },
  { key: 'mid_plus', min: 3000, max: 7000, label: '3.000 – 7.000' },
  { key: 'large', min: 7000, max: 15000, label: '7.000 – 15.000' },
  { key: 'xlarge', min: 15000, max: 1_000_000, label: '> 15.000' },
] as const;

type CapitalRangeKey = (typeof capitalRanges)[number]['key'];

// ==================== INTERNAL TYPES ====================
type AssetGroupKey = (typeof ASSET_GROUPS)[number]['id'];
type HorizonKey = (typeof HORIZONS)[number]['id'];
type DriverWeights = { execution: number; holding: number; structure: number };
type AssetDefinition = {
  baseDrivers: DriverWeights;
};

// ==================== DRIVER BIAS MAP ====================
const assetDefs: Record<AssetGroupKey, AssetDefinition> = {
  forex: {
    baseDrivers: { execution: 50, holding: 30, structure: 20 },
  },
  indices: {
    baseDrivers: { execution: 56, holding: 24, structure: 20 },
  },
  equities: {
    baseDrivers: { execution: 28, holding: 16, structure: 56 },
  },
  etf: {
    baseDrivers: { execution: 22, holding: 22, structure: 56 },
  },
  commodities: {
    baseDrivers: { execution: 34, holding: 28, structure: 38 },
  },
  crypto: {
    baseDrivers: { execution: 40, holding: 36, structure: 24 },
  },
};

const horizonAdjustments: Record<HorizonKey, DriverWeights> = {
  scalping: { execution: 28, holding: -14, structure: -12 },
  intraday: { execution: 18, holding: -10, structure: -8 },
  swing:    { execution:  8, holding:   4, structure: -2 },
  position: { execution: -4, holding:  14, structure:  2 },
};

const getCapitalBias = (crk: CapitalRangeKey): DriverWeights => {
  switch (crk) {
    case 'tiny':  return { execution: -2, holding: 0,  structure: 10 };
    case 'small': return { execution: -1, holding: 0,  structure:  8 };
    case 'mid':   return { execution:  3, holding: 2,  structure: -2 };
    case 'mid_plus': return { execution: 5, holding: 3, structure: -5 };
    case 'large': return { execution:  8, holding: 4,  structure: -10 };
    case 'xlarge':return { execution: 10, holding: 5,  structure: -12 };
  }
};

const getLeverageBias = (on: boolean): DriverWeights =>
  on ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 };

const sumWeights = (...g: DriverWeights[]) =>
  g.reduce<DriverWeights>(
    (a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }),
    { execution: 0, holding: 0, structure: 0 },
  );

const groupColors: Record<AssetGroupKey, { bg: string; border: string; active: string }> = {
  forex:       { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   active: 'bg-amber-500' },
  indices:     { bg: 'bg-sky-500/10',     border: 'border-sky-500/30',     active: 'bg-sky-500' },
  equities:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', active: 'bg-emerald-500' },
  etf:         { bg: 'bg-teal-500/10',    border: 'border-teal-500/30',    active: 'bg-teal-500' },
  commodities: { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  active: 'bg-orange-500' },
  crypto:      { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  active: 'bg-violet-500' },
};

// ==================== FUZZY SEARCH CONFIG ====================
const fuseOptions = {
  keys: ['label', 'symbol', 'name'],
  threshold: 0.3,
  distance: 100,
};

// ==================== COMPONENT ====================
export const ScenarioSection = () => {
  const t = useTranslations('Scenario') as (key: string) => string;
  const currencyCode = AppConfig.defaultCurrency;

  const [selectedGroup, setSelectedGroup] = useState<AssetGroupKey>('forex');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(ALL_SEARCH_ITEMS[0]);
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonKey>('intraday');
  const [selectedStrategy, setSelectedStrategy] = useState('breakout');
  const [capitalRange, setCapitalRange] = useState<CapitalRangeKey>('mid');
  const [leverageOn, setLeverageOn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDef = assetDefs[selectedGroup];

  // Fuse.js search instance
  const fuse = useMemo(() => new Fuse(ALL_SEARCH_ITEMS, fuseOptions), []);
  
  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (searchQuery.length > 0) {
      return fuse.search(searchQuery).map(r => r.item);
    }
    // Show hierarchical structure when no search
    return ALL_SEARCH_ITEMS.filter(i => i.group === selectedGroup);
  }, [searchQuery, selectedGroup, fuse]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const available = STRATEGY_MAP[selectedHorizon] ?? [];
    if (!available.some(s => s.value === selectedStrategy)) {
      setSelectedStrategy(available[0]?.value ?? '');
    }
  }, [selectedHorizon, selectedStrategy]);

  const availableStrategies = STRATEGY_MAP[selectedHorizon] ?? [];
  const activeStrategy = availableStrategies.find(s => s.value === selectedStrategy) ?? availableStrategies[0];

  if (!activeStrategy) return null;

  const rawDrivers = sumWeights(
    currentDef!.baseDrivers,
    horizonAdjustments[selectedHorizon]!,
    getCapitalBias(capitalRange)!,
    getLeverageBias(leverageOn)!,
  );

  const executionRaw = Math.max(8, rawDrivers.execution);
  const holdingRaw   = Math.max(8, rawDrivers.holding);
  const structureRaw = Math.max(8, rawDrivers.structure);
  const total        = executionRaw + holdingRaw + structureRaw;
  const execPct      = Math.round((executionRaw / total) * 100);
  const holdPct      = Math.round((holdingRaw / total) * 100);
  const structPct    = 100 - execPct - holdPct;

  const drivers = [
    { key: 'execution', value: execPct, barClass: 'bg-sky-400' },
    { key: 'holding',   value: holdPct, barClass: 'bg-amber-400' },
    { key: 'structure', value: structPct, barClass: 'bg-emerald-400' },
  ] as const;

  const dominantDriver = [...drivers].sort((a, b) => b.value - a.value)[0]?.key ?? 'execution';
  const pressureScore = Math.min(99, Math.round((executionRaw + holdingRaw + structureRaw) / 3 + (leverageOn ? 8 : 0)));
  const firstAudit = t(`review_${dominantDriver}`);

  const capitalRead =
    capitalRange === 'large' || capitalRange === 'xlarge'
      ? t('read_capital_large')
      : capitalRange === 'mid' || capitalRange === 'mid_plus'
        ? t('read_capital_mid')
        : t('read_capital_small');

  const leverageRead = leverageOn ? t('read_leverage_on') : t('read_leverage_off');

  const engineReads = [
    t(`read_group_${selectedItem.underlying_group}`),
    t(`read_horizon_${selectedHorizon}`),
    t(`read_strategy_${activeStrategy.value}`),
    capitalRead,
    leverageRead,
  ];

  return (
    <section id="simulator" className="scroll-mt-32 border-t border-border/40 bg-gradient-to-b from-background to-muted/20 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28">
      <SectionContainer size="wide">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] xl:grid-cols-[0.42fr_0.58fr] lg:gap-6 xl:gap-8">
          {/* INPUT PANEL */}
          <div className="space-y-6">
            <div>
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
                {t('section_eyebrow')}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                {t('section_title')}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {t('section_intro')}
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-xl sm:p-5 lg:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
                {t('control_label')}
              </p>

              <div className="mt-5 space-y-5">
                {/* Asset Group */}
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('group_label')}</label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ASSET_GROUPS.map(group => {
                      const colors = groupColors[group.id];
                      const isActive = selectedGroup === group.id;
                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => {
                            setSelectedGroup(group.id);
                            setSearchQuery('');
                            // Select first item in new group
                            const firstItem = ALL_SEARCH_ITEMS.find(i => i.group === group.id);
                            if (firstItem) setSelectedItem(firstItem);
                          }}
                          className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 hover:scale-[1.02] ${
                            isActive
                              ? `${colors.border} ${colors.bg}`
                              : 'border-border/50 bg-muted/40 hover:border-border hover:bg-muted/60'
                          }`}
                        >
                          <span className={`block font-mono text-[10px] uppercase tracking-[0.12em] ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {group.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Asset Search Dropdown */}
                <div ref={dropdownRef}>
                  <label className="text-sm font-medium text-foreground/80">{t('asset_label')}</label>
                  <div className="mt-3 relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-primary/50 text-left flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold">{selectedItem.label}</p>
                        {selectedItem.type === 'asset' && (
                          <p className="text-xs text-muted-foreground">{selectedItem.name}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Search Input inside Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-2xl shadow-xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-border/50">
                          <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-border/50 bg-background px-4 py-2 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {filteredItems.map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setSelectedGroup(item.group);
                                setSearchQuery('');
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors ${
                                selectedItem.id === item.id ? 'bg-muted/40' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-mono font-semibold">
                                    {item.type === 'subgroup' ? (
                                      <span className="text-amber-500">📁 {item.label}</span>
                                    ) : (
                                      item.label
                                    )}
                                  </p>
                                  {item.type === 'asset' && (
                                    <p className="text-xs text-muted-foreground">{item.name}</p>
                                  )}
                                </div>
                                <div className="text-xs font-mono uppercase text-muted-foreground/60">
                                  {ASSET_GROUPS.find(g => g.id === item.group)?.label}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizon */}
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('horizon_label')}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {HORIZONS.map(h => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHorizon(h.id as HorizonKey)}
                        className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                          selectedHorizon === h.id
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy */}
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('strategy_label')}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableStrategies.map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setSelectedStrategy(s.value)}
                        className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                          selectedStrategy === s.value
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground/60">{t('strategy_hint')}</p>
                </div>

                {/* Capital + Leverage */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('capital_label')}</label>
                    <select
                      value={capitalRange}
                      onChange={e => setCapitalRange(e.target.value as CapitalRangeKey)}
                      className="mt-3 w-full rounded-2xl border border-border/50 bg-background px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                    >
                      {capitalRanges.map(r => (
                        <option key={r.key} value={r.key}>{r.label} EUR</option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-muted-foreground/60">{t('capital_hint')}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('leverage_label')}</label>
                    <button
                      type="button"
                      onClick={() => setLeverageOn(!leverageOn)}
                      className={`mt-3 flex h-12 w-full items-center justify-center rounded-2xl border text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                        leverageOn
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
                          : 'border-slate-600 bg-slate-800/50 text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {leverageOn ? (
                          <>
                            <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            {t('leverage_on')}
                          </>
                        ) : (
                          <>
                            <span className="size-2.5 rounded-full bg-slate-500" />
                            {t('leverage_off')}
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT CONSOLE */}
          <div className="rounded-[32px] border border-slate-800/80 bg-slate-950 p-5 shadow-2xl sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('console_label')}</p>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                {t('preview_ready')}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {selectedItem.label}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {HORIZONS.find(h => h.id === selectedHorizon)?.label}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {currencyCode} {capitalRanges.find(r => r.key === capitalRange)?.label}
              </span>
              <span className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${leverageOn ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                {leverageOn ? 'Leva ON' : 'Leva OFF'}
              </span>
            </div>

            {/* KPIs */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/[0.78] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('dominant_label')}</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-white">{t(`driver_${dominantDriver}`)}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/[0.78] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('score_label')}</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-white">{pressureScore}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{t('score_note')}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/[0.78] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('review_label')}</p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-100">{firstAudit}</p>
              </div>
            </div>

            {/* Pressure Map */}
            <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-900/[0.64] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('preview_label')}</p>
              <div className="mt-5 space-y-4">
                {drivers.map(d => (
                  <div key={d.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{t(`driver_${d.key}`)}</span>
                      <span className="font-mono text-xs">{d.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className={`h-2 rounded-full ${d.barClass}`} style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">{t(`insight_${selectedHorizon}`)}</p>
            </div>

            {/* Engine Reads */}
            <div className="mt-4 rounded-[24px] border border-slate-800 bg-slate-900/[0.58] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('engine_reads_label')}</p>
              <div className="mt-4 space-y-3">
                {engineReads.map(line => (
                  <div key={line} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-400" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">{t('preview_note')}</p>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};