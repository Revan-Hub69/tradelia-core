// ============================================================
// UNDERLYING GROUPS — immutabile
// 14 gruppi suddivisi per asset class.
//
// AGGIORNAMENTO: aggiunto esmaLeverageCap (§ESMA RTS 2018)
//   - Il cap massimo ESMA per strumenti retail EU su questo gruppo.
//   - null = nessun cap regolamentare (crypto native, structured)
//   - Usato dal motore per clampare la leva effettiva e dal filtro
//     UI per mostrare solo i profili leva effettivamente disponibili.
// ============================================================

import type { UnderlyingId } from './underlyings';

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
  examples: string[];
  baseCurrency: string;
  typicalVolatilityPct: number;
  defaultUnderlyingId?: UnderlyingId;
  /**
   * Cap leva massima ESMA per trader retail EU su questo gruppo.
   * Fonte: ESMA Product Intervention Measures (2018), rinnovate annualmente.
   *
   * Forex:
   *   major (EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD) → 30:1
   *   minor (cross senza USD come prima valuta, es. EUR/GBP, EUR/JPY) → 20:1
   *   exotic (USD/TRY, USD/ZAR, ecc.) → 10:1
   * Indici principali (DAX, S&P500, FTSE, Nikkei, Dow) → 20:1
   * Indici minori e altri → 10:1
   * Azioni (singole) → 5:1
   * Commodities (oro) → 20:1, altri metalli → 10:1, altri → 10:1
   * Crypto CFD → 2:1
   *
   * null = nessun cap ESMA applicabile (es. crypto native exchange,
   *        strumenti strutturati SeDeX — regolati diversamente).
   */
  esmaLeverageCap: number | null;
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
    defaultUnderlyingId: 'eurusd',
    esmaLeverageCap: 30, // ESMA 2018 — major FX pairs
  },
  ug_fx_minor: {
    id: 'ug_fx_minor',
    label: 'Forex Minor',
    labelEn: 'Minor Pairs',
    assetClass: 'forex',
    examples: ['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/CHF', 'AUD/JPY'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 0.7,
    defaultUnderlyingId: 'eurgbp',
    esmaLeverageCap: 20, // ESMA 2018 — non-major FX pairs
  },
  ug_fx_exotic: {
    id: 'ug_fx_exotic',
    label: 'Forex Esotici',
    labelEn: 'Exotic Pairs',
    assetClass: 'forex',
    examples: ['USD/TRY', 'USD/ZAR', 'EUR/PLN', 'USD/MXN', 'USD/SGD'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.5,
    defaultUnderlyingId: 'usdtry',
    esmaLeverageCap: 10, // ESMA 2018 — exotic FX pairs
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
    esmaLeverageCap: 20, // S&P500, Dow, Nasdaq = indici principali ESMA
  },
  ug_idx_eu: {
    id: 'ug_idx_eu',
    label: 'Indici Europa',
    labelEn: 'European Indices',
    assetClass: 'indices',
    examples: ['DAX 40', 'Euro Stoxx 50', 'FTSE MIB', 'CAC 40', 'FTSE 100'],
    baseCurrency: 'EUR',
    typicalVolatilityPct: 1.1,
    esmaLeverageCap: 20, // DAX, FTSE100, CAC = indici principali ESMA
  },
  ug_idx_asia: {
    id: 'ug_idx_asia',
    label: 'Indici Asia',
    labelEn: 'Asian Indices',
    assetClass: 'indices',
    examples: ['Nikkei 225', 'Hang Seng', 'ASX 200', 'Kospi'],
    baseCurrency: 'JPY',
    typicalVolatilityPct: 1.2,
    esmaLeverageCap: 10, // indici minori ESMA
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
    esmaLeverageCap: 5, // azioni singole ESMA
  },
  ug_eq_eu_largecap: {
    id: 'ug_eq_eu_largecap',
    label: 'Azioni EU Large Cap',
    labelEn: 'EU Large Cap Stocks',
    assetClass: 'equities',
    examples: ['ASML', 'SAP', 'LVMH', 'Siemens', 'TotalEnergies', 'Nestlé'],
    baseCurrency: 'EUR',
    typicalVolatilityPct: 1.5,
    esmaLeverageCap: 5,
  },
  ug_eq_it: {
    id: 'ug_eq_it',
    label: 'Azioni Italia',
    labelEn: 'Italian Stocks',
    assetClass: 'equities',
    examples: ['ENI', 'Enel', 'Intesa SP', 'UniCredit', 'STMicro', 'Ferrari'],
    baseCurrency: 'EUR',
    typicalVolatilityPct: 1.6,
    esmaLeverageCap: 5,
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
    esmaLeverageCap: 20, // oro = 20:1 ESMA; altri metalli = 10:1 ma usiamo l'oro come riferimento
  },
  ug_cmd_metals_industrial: {
    id: 'ug_cmd_metals_industrial',
    label: 'Metalli Industriali',
    labelEn: 'Industrial Metals',
    assetClass: 'commodities',
    examples: ['Copper (HG)', 'Aluminium', 'Zinc', 'Nickel'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 1.4,
    esmaLeverageCap: 10, // commodities non-oro ESMA
  },
  ug_cmd_energy: {
    id: 'ug_cmd_energy',
    label: 'Energia',
    labelEn: 'Energy',
    assetClass: 'commodities',
    examples: ['WTI Crude Oil', 'Brent Crude', 'Natural Gas', 'RBOB Gasoline'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 2.5,
    esmaLeverageCap: 10,
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
    // CFD crypto retail EU → 2:1 ESMA.
    // Ma crypto native (exchange, perp) non hanno cap ESMA —
    // il motore differenzia per InstrumentType.category.
    // Usiamo 2 come cap conservativo per CFD; il motore bypassa
    // questo cap per crypto_spot/crypto_perp/crypto_futures.
    esmaLeverageCap: 2,
  },
  ug_crypto_altcoin: {
    id: 'ug_crypto_altcoin',
    label: 'Crypto Altcoin',
    labelEn: 'Altcoins',
    assetClass: 'crypto',
    examples: ['SOL', 'XRP', 'BNB', 'DOGE', 'ADA', 'AVAX', 'LINK'],
    baseCurrency: 'USD',
    typicalVolatilityPct: 6.0,
    esmaLeverageCap: 2,
  },
} as const;

export const UNDERLYING_GROUPS_BY_ASSET: Record<AssetClassId, UnderlyingGroupId[]> = {
  forex:       ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
  indices:     ['ug_idx_us', 'ug_idx_eu', 'ug_idx_asia'],
  equities:    ['ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it'],
  commodities: ['ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy'],
  crypto:      ['ug_crypto_major', 'ug_crypto_altcoin'],
};
