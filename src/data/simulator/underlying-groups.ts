// ============================================================
// UNDERLYING GROUPS — immutabile
// 14 gruppi suddivisi per asset class
// ============================================================

export type AssetClassId =
  | 'forex'
  | 'indices'
  | 'equities'
  | 'commodities'
  | 'crypto';

export type UnderlyingGroupId =
  // Forex
  | 'ug_fx_major'
  | 'ug_fx_minor'
  | 'ug_fx_exotic'
  // Indices
  | 'ug_idx_us'
  | 'ug_idx_eu'
  | 'ug_idx_asia'
  // Equities
  | 'ug_eq_us_largecap'
  | 'ug_eq_eu_largecap'
  | 'ug_eq_it'
  // Commodities
  | 'ug_cmd_metals_precious'
  | 'ug_cmd_metals_industrial'
  | 'ug_cmd_energy'
  // Crypto
  | 'ug_crypto_major'
  | 'ug_crypto_altcoin';

export type UnderlyingGroup = {
  id: UnderlyingGroupId;
  label: string;
  labelEn: string;
  assetClass: AssetClassId;
  examples: string[];       // ticker/simboli rappresentativi
  baseCurrency: string;     // valuta nativa del sottostante
  typicalVolatilityPct: number; // volatilità giornaliera tipica %
};

export const UNDERLYING_GROUPS: Record<UnderlyingGroupId, UnderlyingGroup> = {
  // ── FOREX ──────────────────────────────────────────────────
  ug_fx_major: {
    id: 'ug_fx_major',
    label: 'Forex Major',
    labelEn: 'Major Pairs',
    assetClass: 'forex',
    examples: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 0.5,
  },
  ug_fx_minor: {
    id: 'ug_fx_minor',
    label: 'Forex Minor',
    labelEn: 'Minor Pairs',
    assetClass: 'forex',
    examples: ['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/CHF', 'AUD/JPY'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 0.7,
  },
  ug_fx_exotic: {
    id: 'ug_fx_exotic',
    label: 'Forex Esotici',
    labelEn: 'Exotic Pairs',
    assetClass: 'forex',
    examples: ['USD/TRY', 'USD/ZAR', 'EUR/PLN', 'USD/MXN', 'USD/SGD'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.5,
  },

  // ── INDICES ────────────────────────────────────────────────
  ug_idx_us: {
    id: 'ug_idx_us',
    label: 'Indici USA',
    labelEn: 'US Indices',
    assetClass: 'indices',
    examples: ['S&P 500', 'Nasdaq 100', 'Dow Jones', 'Russell 2000'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.0,
  },
  ug_idx_eu: {
    id: 'ug_idx_eu',
    label: 'Indici Europa',
    labelEn: 'European Indices',
    assetClass: 'indices',
    examples: ['DAX 40', 'Euro Stoxx 50', 'FTSE MIB', 'CAC 40', 'FTSE 100'],
    baseCurrency: 'EUR',
    typicalVolatilityPct: 1.1,
  },
  ug_idx_asia: {
    id: 'ug_idx_asia',
    label: 'Indici Asia',
    labelEn: 'Asian Indices',
    assetClass: 'indices',
    examples: ['Nikkei 225', 'Hang Seng', 'ASX 200', 'Kospi'],
    baseCurrency: 'JPY',
    typicalVolatilityPct: 1.2,
  },

  // ── EQUITIES ───────────────────────────────────────────────
  ug_eq_us_largecap: {
    id: 'ug_eq_us_largecap',
    label: 'Azioni USA Large Cap',
    labelEn: 'US Large Cap Stocks',
    assetClass: 'equities',
    examples: ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'TSLA', 'META', 'GOOGL'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.8,
  },
  ug_eq_eu_largecap: {
    id: 'ug_eq_eu_largecap',
    label: 'Azioni EU Large Cap',
    labelEn: 'EU Large Cap Stocks',
    assetClass: 'equities',
    examples: ['ASML', 'SAP', 'LVMH', 'Siemens', 'TotalEnergies', 'Nestlé'],
    baseCurrency: 'EUR',
    typicalVolatilityPct: 1.5,
  },
  ug_eq_it: {
    id: 'ug_eq_it',
    label: 'Azioni Italia',
    labelEn: 'Italian Stocks',
    assetClass: 'equities',
    examples: ['ENI', 'Enel', 'Intesa SP', 'UniCredit', 'STMicro', 'Ferrari'],
    baseCurrency: 'EUR',
    typicalVolatilityPct: 1.6,
  },

  // ── COMMODITIES ────────────────────────────────────────────
  ug_cmd_metals_precious: {
    id: 'ug_cmd_metals_precious',
    label: 'Metalli Preziosi',
    labelEn: 'Precious Metals',
    assetClass: 'commodities',
    examples: ['Gold (XAU)', 'Silver (XAG)', 'Platinum', 'Palladium'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.0,
  },
  ug_cmd_metals_industrial: {
    id: 'ug_cmd_metals_industrial',
    label: 'Metalli Industriali',
    labelEn: 'Industrial Metals',
    assetClass: 'commodities',
    examples: ['Copper (HG)', 'Aluminium', 'Zinc', 'Nickel'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.4,
  },
  ug_cmd_energy: {
    id: 'ug_cmd_energy',
    label: 'Energia',
    labelEn: 'Energy',
    assetClass: 'commodities',
    examples: ['WTI Crude Oil', 'Brent Crude', 'Natural Gas', 'RBOB Gasoline'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 2.5,
  },

  // ── CRYPTO ─────────────────────────────────────────────────
  ug_crypto_major: {
    id: 'ug_crypto_major',
    label: 'Crypto Major',
    labelEn: 'Major Crypto',
    assetClass: 'crypto',
    examples: ['BTC/USD', 'ETH/USD', 'BTC/USDT', 'ETH/USDT'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 3.5,
  },
  ug_crypto_altcoin: {
    id: 'ug_crypto_altcoin',
    label: 'Crypto Altcoin',
    labelEn: 'Altcoins',
    assetClass: 'crypto',
    examples: ['SOL', 'XRP', 'BNB', 'DOGE', 'ADA', 'AVAX', 'LINK'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 6.0,
  },
} as const;

export const UNDERLYING_GROUPS_BY_ASSET: Record<AssetClassId, UnderlyingGroupId[]> = {
  forex:       ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
  indices:     ['ug_idx_us', 'ug_idx_eu', 'ug_idx_asia'],
  equities:    ['ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it'],
  commodities: ['ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy'],
  crypto:      ['ug_crypto_major', 'ug_crypto_altcoin'],
};
