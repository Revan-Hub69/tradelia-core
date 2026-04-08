// ============================================================
// INSTRUMENT TYPES — immutabile (struttura)
// Definisce i tipi strumento disponibili per asset class.
// I parametri di costo specifici (spread, financing, ecc.)
// verranno aggiunti nel layer broker/cost — NON qui.
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';

// ── Categorie strumento ────────────────────────────────────
export type InstrumentCategory =
  | 'derivative_linear'      // CFD, Futures — P&L lineare, costi espliciti
  | 'derivative_structured'  // Turbo KO, Mini Future, Leva Fissa — costi impliciti/integrati
  | 'exchange_product'       // ETF, ETC, ETP — prodotti di borsa senza leva propria o con leva fissa
  | 'crypto_native';         // Spot, Perpetual, Futures datati su exchange crypto

// ── Modello di esecuzione ──────────────────────────────────
export type ExecutionModel =
  | 'clob'           // Central Limit Order Book — futures CME/Eurex, crypto OB
  | 'ecn_stp'        // ECN/STP — forex no-dealing desk, near-zero spread + commission
  | 'mm_internal'    // Market Maker interno (dealing desk) — CFD retail
  | 'issuer_priced'  // Prezzo fissato dall'emittente — certificati SeDeX
  | 'crypto_ob';     // Orderbook exchange crypto — spread variabile per liquidityTier

// ── Tier liquidità (rilevante per crypto e azioni) ─────────
export type LiquidityTier = 'high' | 'medium' | 'low';

// ── Struttura valuta ───────────────────────────────────────
export type CurrencyConversionRisk =
  | 'none'      // sottostante in EUR, conto EUR — nessuna conversione
  | 'usd_eur'   // sottostante in USD, conto EUR — conversione necessaria
  | 'other';    // JPY, GBP, CHF, ecc.

// ── Tipo strumento ─────────────────────────────────────────
export type InstrumentTypeId =
  // CFD
  | 'cfd_dd'          // CFD Dealing Desk (market maker interno)
  | 'cfd_ecn'         // CFD ECN/STP (no dealing desk)
  // Futures
  | 'futures_std'     // Futures standard (E-mini, FDAX, /GC, ecc.)
  | 'futures_micro'   // Micro Futures (MES, MGC, MCL, ecc.)
  // ETF/ETC leveraged
  | 'etf_leveraged'   // ETF UCITS a leva 2x/-1x/-2x
  | 'etc_leveraged'   // ETC a leva (commodity)
  | 'etc_physical'    // ETC fisico (no leva)
  // Certificati strutturati
  | 'turbo_ko'        // Turbo Certificate con KO istantaneo
  | 'mini_future'     // Mini Future Certificate open-end
  | 'leva_fissa'      // Certificato a Leva Fissa (rebasing giornaliero)
  // Crypto native
  | 'crypto_spot'     // Spot su exchange crypto
  | 'crypto_perp'     // Perpetual Futures (funding ogni 8h)
  | 'crypto_futures'  // Futures datati (quarterly)
  | 'crypto_cfd'      // CFD Crypto su broker retail (IG, Capital.com)
  | 'crypto_etp';     // ETP/ETN crypto su borsa (BTCE, ETHC)

export type InstrumentType = {
  id: InstrumentTypeId;
  label: string;
  labelEn: string;
  category: InstrumentCategory;
  executionModel: ExecutionModel;
  liquidityTier: LiquidityTier;
  currencyConversionRisk: CurrencyConversionRisk;
  hasOvernight: boolean;      // true → financing overnight rilevante
  hasRebasing: boolean;       // true → decay/rebasing giornaliero (ETF leva, leva fissa)
  hasFundingRate: boolean;    // true → funding rate periodico (crypto perp)
  hasKoRisk: boolean;         // true → rischio KO/liquidazione istantanea
  hasRollCost: boolean;       // true → costo roll a scadenza (futures)
  maxLeverageESMA: number | null; // null = no cap (crypto, non-EU regulated)
  availableForUGs: UnderlyingGroupId[]; // UG compatibili con questo strumento
  notes: string;              // note operative importanti per retail IT
};

export const INSTRUMENT_TYPES: Record<InstrumentTypeId, InstrumentType> = {

  // ── CFD ──────────────────────────────────────────────────
  cfd_dd: {
    id: 'cfd_dd',
    label: 'CFD Dealing Desk',
    labelEn: 'CFD (Dealing Desk)',
    category: 'derivative_linear',
    executionModel: 'mm_internal',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: true,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: 30,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
      'ug_crypto_major',
    ],
    notes: 'Spread allargato incluso nel prezzo. Zero commissioni esplicite. Slippage asimmetrico in volatilità.',
  },

  cfd_ecn: {
    id: 'cfd_ecn',
    label: 'CFD ECN/STP',
    labelEn: 'CFD (ECN/STP)',
    category: 'derivative_linear',
    executionModel: 'ecn_stp',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: true,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: 30,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Spread near-zero su major FX. Commissione per lotto. Esecuzione STP diretta su LP.',
  },

  // ── FUTURES ──────────────────────────────────────────────
  futures_std: {
    id: 'futures_std',
    label: 'Futures Standard',
    labelEn: 'Standard Futures',
    category: 'derivative_linear',
    executionModel: 'clob',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: true,
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
    ],
    notes: 'CLOB — esecuzione trasparente. Nessun financing overnight (costo nel prezzo futures). Roll trimestrale. Margin interest su capitale immobilizzato.',
  },

  futures_micro: {
    id: 'futures_micro',
    label: 'Micro Futures',
    labelEn: 'Micro Futures',
    category: 'derivative_linear',
    executionModel: 'clob',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: true,
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_idx_us', 'ug_idx_eu',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Stessa struttura dei futures std ma 1/10 del nozionale. Ideale per retail con capitale limitato. Commission proporzionalmente più alta su nozionale.',
  },

  // ── ETF / ETC ─────────────────────────────────────────────
  etf_leveraged: {
    id: 'etf_leveraged',
    label: 'ETF UCITS a Leva',
    labelEn: 'Leveraged UCITS ETF',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: true,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: null, // leva incorporata nel prodotto, non soggetta a cap ESMA
    availableForUGs: [
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap',
    ],
    notes: 'Leva 2x/-1x/-2x incorporata. TER annuo + rebasing/decay giornaliero crescente con volatilità. Nessun rischio KO ma azzeramento teorico possibile con -2x in gap estremo.',
  },

  etc_leveraged: {
    id: 'etc_leveraged',
    label: 'ETC a Leva',
    labelEn: 'Leveraged ETC',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: true,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
    ],
    notes: 'Come ETF leva ma su commodity. Esposizione sintetica tramite swap. Decay rilevante su energy (alta vol).',
  },

  etc_physical: {
    id: 'etc_physical',
    label: 'ETC Fisico',
    labelEn: 'Physical ETC',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_cmd_metals_precious',
    ],
    notes: 'Backed da metallo fisico (PHAU, SGLN). Nessuna leva. TER basso (~0.12–0.25%). Solo per esposizione direzionale senza leva.',
  },

  // ── CERTIFICATI STRUTTURATI ───────────────────────────────
  turbo_ko: {
    id: 'turbo_ko',
    label: 'Turbo Certificate (KO)',
    labelEn: 'Turbo KO Certificate',
    category: 'derivative_structured',
    executionModel: 'issuer_priced',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false, // finanziamento integrato nel livello di finanziamento
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: true,
    hasRollCost: false,
    maxLeverageESMA: null, // leva dinamica, non soggetta a cap ESMA su certificati
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor',
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'KO istantaneo al tocco del barrier. Spread emittente fisso. Finanziamento integrato nel prezzo (non visibile come overnight). Quotato su SeDeX. Zero comm su Fineco.',
  },

  mini_future: {
    id: 'mini_future',
    label: 'Mini Future Certificate',
    labelEn: 'Mini Future Certificate',
    category: 'derivative_structured',
    executionModel: 'issuer_priced',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false, // finanziamento accumulato nel prezzo open-end
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: true, // stop-loss level (non KO puro ma simile)
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_fx_major',
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Open-end senza scadenza. Stop-loss level integrato (non KO secco). Finanziamento si accumula nel financing level che si aggiorna periodicamente. Spread emittente.',
  },

  leva_fissa: {
    id: 'leva_fissa',
    label: 'Certificato Leva Fissa',
    labelEn: 'Fixed Leverage Certificate',
    category: 'derivative_structured',
    executionModel: 'issuer_priced',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: true, // rebasing giornaliero come ETF leva
    hasFundingRate: false,
    hasKoRisk: false, // no KO, ma azzeramento con drawdown estremo
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious',
    ],
    notes: 'Leva fissa 2x/3x/5x/-2x/-3x. Rebasing giornaliero identico agli ETF leva. Zero comm su Fineco (emittente diretto). Adatto a intraday/breve termine.',
  },

  // ── CRYPTO NATIVE ─────────────────────────────────────────
  crypto_spot: {
    id: 'crypto_spot',
    label: 'Crypto Spot',
    labelEn: 'Crypto Spot',
    category: 'crypto_native',
    executionModel: 'crypto_ob',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major', 'ug_crypto_altcoin'],
    notes: 'Fee maker/taker. Nessun financing. Spread variabile per liquidità. Conversione EUR→crypto. Withdrawal fee variabile.',
  },

  crypto_perp: {
    id: 'crypto_perp',
    label: 'Crypto Perpetual Futures',
    labelEn: 'Crypto Perpetual',
    category: 'crypto_native',
    executionModel: 'crypto_ob',
    liquidityTier: 'high',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: true, // ogni 8h
    hasKoRisk: true,      // liquidazione
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major', 'ug_crypto_altcoin'],
    notes: 'Funding rate ogni 8h (variabile, può essere negativo). Liquidazione automatica. Fee maker ~0% su MEXC. Leva fino a 100x (retail consigliato max 10x).',
  },

  crypto_futures: {
    id: 'crypto_futures',
    label: 'Crypto Futures Datati',
    labelEn: 'Crypto Dated Futures',
    category: 'crypto_native',
    executionModel: 'crypto_ob',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: false, // nessun funding — costo nel basis
    hasKoRisk: true,       // liquidazione
    hasRollCost: true,
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major'],
    notes: 'Scadenza trimestrale. Basis positivo/negativo riflette costo finanziamento. Roll a scadenza. Kraken e Deribit accessibili da IT.',
  },

  crypto_cfd: {
    id: 'crypto_cfd',
    label: 'CFD Crypto (broker retail)',
    labelEn: 'Crypto CFD',
    category: 'derivative_linear',
    executionModel: 'mm_internal',
    liquidityTier: 'high',
    currencyConversionRisk: 'none',
    hasOvernight: true,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: 2, // cap ESMA su crypto CFD
    availableForUGs: ['ug_crypto_major'],
    notes: 'Leva max 2:1 ESMA. Spread molto ampio rispetto a exchange native. Financing overnight alto. Solo per chi non vuole account su exchange crypto.',
  },

  crypto_etp: {
    id: 'crypto_etp',
    label: 'ETP/ETN Crypto (borsa)',
    labelEn: 'Crypto ETP/ETN',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'medium',
    currencyConversionRisk: 'usd_eur',
    hasOvernight: false,
    hasRebasing: false,
    hasFundingRate: false,
    hasKoRisk: false,
    hasRollCost: false,
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major'],
    notes: 'Quotati su Xetra/SIX (BTCE, ETHC, XBTC). Nessuna leva. TER ~0.98–1.5%. Accessibili da broker IT standard (Fineco, Directa, DEGIRO).',
  },
};

// ── Helper: strumenti disponibili per UG ──────────────────
export function getInstrumentsForUG(ugId: UnderlyingGroupId): InstrumentType[] {
  return Object.values(INSTRUMENT_TYPES).filter(inst =>
    inst.availableForUGs.includes(ugId)
  );
}
