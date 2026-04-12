// ============================================================
// INSTRUMENT TYPES — immutabile
//
// V1 SCOPE: FX only
//   FX_CFD    → cfd_dd, cfd_ecn
//   FX_SPOT   → spot_fx
//   FX_FUTURES → futures_std (con contractSize micro/mini/full)
//
// RIMOSSI per v1 (non modellabili con dati pubblici affidabili):
//   turbo_ko, mini_future, leva_fissa,
//   etf_leveraged, etc_leveraged, etc_physical,
//   crypto_spot, crypto_perp, crypto_futures, crypto_cfd, crypto_etp,
//   futures_micro (merged in futures_std via contractSize)
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';

export type InstrumentCategory =
  | 'derivative_linear'
  | 'spot_otc';

export type ExecutionModel =
  | 'clob'
  | 'ecn_stp'
  | 'mm_internal'
  | 'ecn_ndd';

export type LiquidityTier = 'high' | 'medium' | 'low';

/**
 * Dimensione contratto per futures.
 * Il motore usa questo per derivare:
 *   - tick value
 *   - margine richiesto
 *   - capitale minimo consigliato
 *
 * Valori CME per FX futures:
 *   full  → EUR/USD = 125.000 EUR, margin ~2.500 EUR
 *   mini  → EUR/USD =  62.500 EUR, margin ~1.250 EUR  (non tutti i broker)
 *   micro → EUR/USD =  12.500 EUR, margin ~   250 EUR
 *
 * null = non applicabile (CFD, Spot FX)
 */
export type FuturesContractSize = 'micro' | 'mini' | 'full' | null;

export type CostStructure = {
  spreadType:
    | 'fixed_bps'
    | 'tick'
    | 'ob_variable'
    | 'raw_ecn';

  commissionType:
    | 'none'
    | 'per_lot'
    | 'per_contract'
    | 'per_lot_ecn';

  overnightType:
    | 'none'
    | 'sofr_plus_markup'
    | 'euribor_plus_markup'
    | 'tom_next_rollover';

  /**
   * exchangeFeeType: fee pagata all’exchange/clearing separata dalla commission broker.
   * Rilevante per futures CME/Eurex.
   */
  exchangeFeeType:
    | 'none'
    | 'per_contract_cme'
    | 'per_contract_eurex';

  rollType:
    | 'none'
    | 'quarterly'
    | 'daily_tomnext';

  rollCostType:
    | 'none'
    | 'bid_ask_twice'
    | 'tomnext_rate';

  fxConversionType:
    | 'none'
    | 'on_trade'
    | 'on_pnl'
    | 'native';

  marginInterestType:
    | 'none'
    | 'on_initial_margin'
    | 'on_margin_loan';

  underlyingCurrency: 'EUR' | 'USD' | 'JPY' | 'GBP' | 'CHF' | 'other';
};

export type InstrumentTypeId =
  | 'spot_fx'
  | 'cfd_dd'
  | 'cfd_ecn'
  | 'futures_std';

export type InstrumentType = {
  id: InstrumentTypeId;
  label: string;
  labelEn: string;
  category: InstrumentCategory;
  executionModel: ExecutionModel;
  liquidityTier: LiquidityTier;
  maxLeverageESMA: number | null;
  availableForUGs: UnderlyingGroupId[];
  notes: string;
  costStructure: CostStructure;
  /**
   * Taglie contratto disponibili.
   * - null → non applicabile (CFD, Spot)
   * - array → taglie supportate in linea di principio;
   *   la disponibilità effettiva per broker è in InstrumentOffer.availableContractSizes
   */
  availableContractSizes: FuturesContractSize[] | null;
};

export const INSTRUMENT_TYPES: Record<InstrumentTypeId, InstrumentType> = {

  // ── FOREX SPOT OTC ───────────────────────────────────────────────
  spot_fx: {
    id: 'spot_fx',
    label: 'Forex Spot OTC',
    labelEn: 'FX Spot OTC',
    category: 'spot_otc',
    executionModel: 'ecn_ndd',
    liquidityTier: 'high',
    maxLeverageESMA: 30,
    availableForUGs: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    availableContractSizes: null,
    notes: 'Mercato interbancario OTC puro. Spread near-zero su major con broker ECN NDD (LMAX, Dukascopy, Saxo, IB). Commission per lotto esplicita. Rollover tom/next overnight in pip. Leva max 30:1 ESMA su major.',
    costStructure: {
      spreadType: 'raw_ecn',
      commissionType: 'per_lot_ecn',
      overnightType: 'tom_next_rollover',
      exchangeFeeType: 'none',
      rollType: 'daily_tomnext',
      rollCostType: 'tomnext_rate',
      underlyingCurrency: 'USD',
      fxConversionType: 'native',
      marginInterestType: 'on_margin_loan',
    },
  },

  // ── CFD DEALING DESK ─────────────────────────────────────────────
  cfd_dd: {
    id: 'cfd_dd',
    label: 'CFD Dealing Desk',
    labelEn: 'CFD (Dealing Desk)',
    category: 'derivative_linear',
    executionModel: 'mm_internal',
    liquidityTier: 'high',
    maxLeverageESMA: 30,
    availableForUGs: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    availableContractSizes: null,
    notes: 'Spread allargato incluso nel prezzo, nessuna commission esplicita. Overnight su SOFR/EURIBOR + markup broker. Slippage asimmetrico possibile in alta volatilità.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'none',
      overnightType: 'sofr_plus_markup',
      exchangeFeeType: 'none',
      rollType: 'none',
      rollCostType: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_pnl',
      marginInterestType: 'none',
    },
  },

  // ── CFD ECN/STP ────────────────────────────────────────────────
  cfd_ecn: {
    id: 'cfd_ecn',
    label: 'CFD ECN/STP',
    labelEn: 'CFD (ECN/STP)',
    category: 'derivative_linear',
    executionModel: 'ecn_stp',
    liquidityTier: 'high',
    maxLeverageESMA: 30,
    availableForUGs: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    availableContractSizes: null,
    notes: 'Spread near-zero su major FX. Commission per lotto esplicita. Esecuzione STP diretta su LP. Overnight su SOFR + markup. Nessun re-quote.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'per_lot',
      overnightType: 'sofr_plus_markup',
      exchangeFeeType: 'none',
      rollType: 'none',
      rollCostType: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_pnl',
      marginInterestType: 'none',
    },
  },

  // ── FX FUTURES (micro + mini + full) ──────────────────────────────
  //
  // Un solo tipo strumento. La taglia (micro/mini/full) è un parametro
  // dell’offerta broker (InstrumentOffer.availableContractSizes) e
  // dell’input utente — NON un tipo strumento separato.
  //
  // Il motore seleziona la taglia adatta al capitale utente:
  //   < 2.000€  → solo micro
  //   2k–10k€  → micro + mini
  //   > 10k€   → tutte le taglie
  futures_std: {
    id: 'futures_std',
    label: 'FX Futures',
    labelEn: 'FX Futures',
    category: 'derivative_linear',
    executionModel: 'clob',
    liquidityTier: 'high',
    maxLeverageESMA: null, // nessun cap ESMA — leva implicita nel margin CME
    availableForUGs: ['ug_fx_major', 'ug_fx_minor'],
    availableContractSizes: ['micro', 'mini', 'full'],
    notes: 'CLOB — esecuzione trasparente su CME. Nessun overnight esplicito (costo nel basis). Commission broker + exchange fee CME separata. Roll trimestrale IMM. Taglia contratto: micro (12.5k EUR), mini (62.5k EUR), full (125k EUR). Il motore sceglie la taglia in base al capitale.',
    costStructure: {
      spreadType: 'tick',
      commissionType: 'per_contract',
      overnightType: 'none',
      exchangeFeeType: 'per_contract_cme',
      rollType: 'quarterly',
      rollCostType: 'bid_ask_twice',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      marginInterestType: 'on_initial_margin',
    },
  },

};
