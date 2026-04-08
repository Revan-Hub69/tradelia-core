// ============================================================
// INSTRUMENT TYPES — immutabile (struttura + costStructure)
// Ogni strumento ha il proprio layer di costi modellato
// come variabili tipizzate. I valori numerici specifici
// per broker vengono nel layer brokers.ts.
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';

// ── Categorie strumento ──────────────────────────────────────
export type InstrumentCategory =
  | 'derivative_linear'      // CFD, Futures
  | 'derivative_structured'  // Turbo KO, Mini Future, Leva Fissa
  | 'exchange_product'       // ETF, ETC, ETP
  | 'crypto_native'          // Spot, Perpetual, Futures datati
  | 'spot_otc';              // Forex Spot OTC interbancario

// ── Modello di esecuzione ────────────────────────────────────
export type ExecutionModel =
  | 'clob'           // Central Limit Order Book
  | 'ecn_stp'        // ECN/STP — forex no-dealing desk
  | 'mm_internal'    // Market Maker interno (dealing desk)
  | 'issuer_priced'  // Prezzo fissato dall'emittente (certificati SeDeX)
  | 'crypto_ob'      // Orderbook exchange crypto
  | 'ecn_ndd';       // ECN puro NDD — spot FX interbancario (LMAX, Dukascopy)

// ── Tier liquidità ───────────────────────────────────────────
export type LiquidityTier = 'high' | 'medium' | 'low';

// ============================================================
// COST STRUCTURE — schema validato completo
// ============================================================
export type CostStructure = {

  // 1. SPREAD
  spreadType:
    | 'fixed_bps'
    | 'tick'
    | 'ob_variable'
    | 'issuer_fixed'
    | 'borsa_variable'
    | 'raw_ecn';      // Spot FX OTC — spread near-zero su LP interbancario

  // 2. COMMISSION
  commissionType:
    | 'none'
    | 'per_lot'
    | 'per_contract'
    | 'maker_taker'
    | 'per_trade_pct'
    | 'per_lot_ecn';  // Spot FX OTC — commission per lotto come ECN ma su spot

  // 3. OVERNIGHT / FINANCING
  overnightType:
    | 'none'
    | 'sofr_plus_markup'
    | 'euribor_plus_markup'
    | 'integrated_in_price'
    | 'tom_next_rollover';  // Spot FX OTC — rollover tom/next ogni giorno lavorativo

  // 4. REBASING / DECAY
  rebasingType:
    | 'none'
    | 'daily_lev_squared';
  leverageMultiplier: number | null;

  // 5. FUNDING RATE
  fundingType:
    | 'none'
    | 'every_8h_variable';
  fundingDirection:
    | 'none'
    | 'variable';

  // 6. ROLL COST
  rollType:
    | 'none'
    | 'quarterly'
    | 'at_expiry'
    | 'daily_tomnext';  // Spot FX OTC — roll giornaliero tom/next
  rollCostType:
    | 'none'
    | 'bid_ask_twice'
    | 'basis_dependent'
    | 'tomnext_rate';   // Spot FX OTC — costo dipende da differenziale tassi

  // 7. KO / LIQUIDATION RISK
  koType:
    | 'none'
    | 'instant_ko'
    | 'soft_stop_loss'
    | 'liquidation';
  koDistanceInput:
    | 'none'
    | 'static_pct'
    | 'dynamic_barrier'
    | 'leverage_based';

  // 8. FX CONVERSION
  underlyingCurrency: 'EUR' | 'USD' | 'JPY' | 'GBP' | 'CHF' | 'other';
  fxConversionType:
    | 'none'
    | 'on_trade'
    | 'on_pnl'
    | 'native';  // Spot FX OTC — il prodotto stesso è la coppia valutaria, nessuna conversione aggiuntiva

  // 9. TER ANNUO
  hasTER: boolean;
  terAnnualPct: number | null;

  // 10. MARGIN INTEREST
  marginInterestType:
    | 'none'
    | 'on_initial_margin'
    | 'on_full_notional';

  // 11. CRYPTO ONLY
  withdrawalFeeType:
    | 'none'
    | 'per_chain_variable';
  depositFeeType:
    | 'none'
    | 'fiat_to_crypto_pct';
};

// ============================================================
// INSTRUMENT TYPE — entità completa
// ============================================================
export type InstrumentTypeId =
  | 'spot_fx'
  | 'cfd_dd'
  | 'cfd_ecn'
  | 'futures_std'
  | 'futures_micro'
  | 'etf_leveraged'
  | 'etc_leveraged'
  | 'etc_physical'
  | 'turbo_ko'
  | 'mini_future'
  | 'leva_fissa'
  | 'crypto_spot'
  | 'crypto_perp'
  | 'crypto_futures'
  | 'crypto_cfd'
  | 'crypto_etp';

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
};

// ============================================================
// INSTRUMENT TYPES DATA
// ============================================================
export const INSTRUMENT_TYPES: Record<InstrumentTypeId, InstrumentType> = {

  // ── FOREX SPOT OTC ──────────────────────────────────────────
  spot_fx: {
    id: 'spot_fx',
    label: 'Forex Spot OTC',
    labelEn: 'FX Spot OTC',
    category: 'spot_otc',
    executionModel: 'ecn_ndd',
    liquidityTier: 'high',
    maxLeverageESMA: 30,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',
    ],
    notes: 'Mercato interbancario OTC puro. Spread near-zero su major con broker ECN NDD (LMAX, Dukascopy, Saxo). Commission per lotto esplicita. Rollover tom/next overnight — costo dipende dal differenziale tassi tra le due valute della coppia. Nessun KO strutturale. Leva max 30:1 ESMA su major.',
    costStructure: {
      spreadType: 'raw_ecn',
      commissionType: 'per_lot_ecn',
      overnightType: 'tom_next_rollover',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'daily_tomnext',
      rollCostType: 'tomnext_rate',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'native',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── CFD DEALING DESK ────────────────────────────────────────
  cfd_dd: {
    id: 'cfd_dd',
    label: 'CFD Dealing Desk',
    labelEn: 'CFD (Dealing Desk)',
    category: 'derivative_linear',
    executionModel: 'mm_internal',
    liquidityTier: 'high',
    maxLeverageESMA: 30,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',  // fix: aggiunto ug_fx_minor
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
      'ug_crypto_major',
    ],
    notes: 'Spread allargato incluso nel prezzo. Zero commissioni esplicite. Slippage asimmetrico in volatilità alta. Re-quote possibile su DD.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'none',
      overnightType: 'sofr_plus_markup',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_pnl',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── CFD ECN/STP ─────────────────────────────────────────────
  cfd_ecn: {
    id: 'cfd_ecn',
    label: 'CFD ECN/STP',
    labelEn: 'CFD (ECN/STP)',
    category: 'derivative_linear',
    executionModel: 'ecn_stp',
    liquidityTier: 'high',
    maxLeverageESMA: 30,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Spread near-zero su major FX. Commissione per lotto esplicita. Esecuzione STP diretta su LP. Nessun re-quote.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'per_lot',
      overnightType: 'sofr_plus_markup',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_pnl',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── FUTURES STANDARD ────────────────────────────────────────
  futures_std: {
    id: 'futures_std',
    label: 'Futures Standard',
    labelEn: 'Standard Futures',
    category: 'derivative_linear',
    executionModel: 'clob',
    liquidityTier: 'high',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
    ],
    notes: 'CLOB — esecuzione trasparente. Nessun financing overnight (costo nel basis futures). Roll trimestrale. Margin interest su capitale immobilizzato.',
    costStructure: {
      spreadType: 'tick',
      commissionType: 'per_contract',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'quarterly',
      rollCostType: 'bid_ask_twice',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'on_initial_margin',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── MICRO FUTURES ───────────────────────────────────────────
  futures_micro: {
    id: 'futures_micro',
    label: 'Micro Futures',
    labelEn: 'Micro Futures',
    category: 'derivative_linear',
    executionModel: 'clob',
    liquidityTier: 'high',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor',                          // fix: aggiunti FX (M6E, M6B, MJY CME)
      'ug_idx_us', 'ug_idx_eu',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: '1/10 del nozionale futures standard. Stessa struttura costi. Commission proporzionalmente più alta su nozionale. Ideale retail con capitale <10k. FX: M6E (€12.5k), M6B (£6.25k), MJY.',
    costStructure: {
      spreadType: 'tick',
      commissionType: 'per_contract',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'quarterly',
      rollCostType: 'bid_ask_twice',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'on_initial_margin',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── ETF UCITS A LEVA ────────────────────────────────────────
  etf_leveraged: {
    id: 'etf_leveraged',
    label: 'ETF UCITS a Leva',
    labelEn: 'Leveraged UCITS ETF',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap',
    ],
    notes: 'Leva 2x/-1x/-2x incorporata. TER annuo + rebasing giornaliero crescente con volatilità. Nessun KO. Azzeramento teorico possibile solo con gap estremo su -2x.',
    costStructure: {
      spreadType: 'borsa_variable',
      commissionType: 'per_trade_pct',
      overnightType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 2,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: true,
      terAnnualPct: 0.35,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── ETC A LEVA ──────────────────────────────────────────────
  etc_leveraged: {
    id: 'etc_leveraged',
    label: 'ETC a Leva',
    labelEn: 'Leveraged ETC',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
    ],
    notes: 'Esposizione sintetica tramite swap. Decay più alto su energy per volatilità elevata. TER mediamente più alto degli ETF equity.',
    costStructure: {
      spreadType: 'borsa_variable',
      commissionType: 'per_trade_pct',
      overnightType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 2,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: true,
      terAnnualPct: 0.50,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── ETC FISICO ──────────────────────────────────────────────
  etc_physical: {
    id: 'etc_physical',
    label: 'ETC Fisico',
    labelEn: 'Physical ETC',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'high',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_cmd_metals_precious',
    ],
    notes: 'Backed da metallo fisico (PHAU, SGLN). Nessuna leva. TER ~0.12–0.25%. Solo esposizione direzionale senza leva. Non per trading attivo ad alta frequenza.',
    costStructure: {
      spreadType: 'borsa_variable',
      commissionType: 'per_trade_pct',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: true,
      terAnnualPct: 0.15,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── TURBO KO CERTIFICATE ────────────────────────────────────
  turbo_ko: {
    id: 'turbo_ko',
    label: 'Turbo Certificate (KO)',
    labelEn: 'Turbo KO Certificate',
    category: 'derivative_structured',
    executionModel: 'issuer_priced',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor',
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'KO istantaneo al tocco del barrier — perdita totale del premio. Spread emittente fisso. Finanziamento integrato nel prezzo. Quotato SeDeX o OTC (IG Turbo24). Zero comm su Fineco.',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'none',
      overnightType: 'integrated_in_price',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'instant_ko',
      koDistanceInput: 'static_pct',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── MINI FUTURE CERTIFICATE ─────────────────────────────────
  mini_future: {
    id: 'mini_future',
    label: 'Mini Future Certificate',
    labelEn: 'Mini Future Certificate',
    category: 'derivative_structured',
    executionModel: 'issuer_priced',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_fx_major', 'ug_fx_minor',                          // fix: aggiunto ug_fx_minor
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Open-end senza scadenza. Stop-loss level con recupero parziale (non KO secco). Financing level aggiornato periodicamente. Spread emittente. SeDeX + broker strutturati (Saxo, Exante, Swissquote).',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'per_trade_pct',
      overnightType: 'integrated_in_price',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'soft_stop_loss',
      koDistanceInput: 'dynamic_barrier',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── CERTIFICATO LEVA FISSA ──────────────────────────────────
  leva_fissa: {
    id: 'leva_fissa',
    label: 'Certificato Leva Fissa',
    labelEn: 'Fixed Leverage Certificate',
    category: 'derivative_structured',
    executionModel: 'issuer_priced',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: [
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious',
    ],
    notes: 'Leva fissa 2x/3x/5x/-2x/-3x. Rebasing giornaliero identico agli ETF leva. Zero comm su Fineco. Adatto intraday/breve termine — decay penalizza multiday.',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'none',
      overnightType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 3,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── CRYPTO SPOT ─────────────────────────────────────────────
  crypto_spot: {
    id: 'crypto_spot',
    label: 'Crypto Spot',
    labelEn: 'Crypto Spot',
    category: 'crypto_native',
    executionModel: 'crypto_ob',
    liquidityTier: 'high',
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major', 'ug_crypto_altcoin'],
    notes: 'Fee maker/taker. Nessun financing. Spread variabile per liquidità. Conversione EUR→crypto al deposito. Withdrawal fee per chain.',
    costStructure: {
      spreadType: 'ob_variable',
      commissionType: 'maker_taker',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'per_chain_variable',
      depositFeeType: 'fiat_to_crypto_pct',
    },
  },

  // ── CRYPTO PERPETUAL ────────────────────────────────────────
  crypto_perp: {
    id: 'crypto_perp',
    label: 'Crypto Perpetual Futures',
    labelEn: 'Crypto Perpetual',
    category: 'crypto_native',
    executionModel: 'crypto_ob',
    liquidityTier: 'high',
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major', 'ug_crypto_altcoin'],
    notes: 'Funding rate ogni 8h variabile (può essere negativo). Liquidazione automatica per margin call. Fee maker ~0% su MEXC. Leva max consigliata retail: 10x.',
    costStructure: {
      spreadType: 'ob_variable',
      commissionType: 'maker_taker',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'every_8h_variable',
      fundingDirection: 'variable',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'liquidation',
      koDistanceInput: 'leverage_based',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'per_chain_variable',
      depositFeeType: 'fiat_to_crypto_pct',
    },
  },

  // ── CRYPTO FUTURES DATATI ───────────────────────────────────
  crypto_futures: {
    id: 'crypto_futures',
    label: 'Crypto Futures Datati',
    labelEn: 'Crypto Dated Futures',
    category: 'crypto_native',
    executionModel: 'crypto_ob',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major'],
    notes: 'Scadenza trimestrale. Basis riflette costo finanziamento (contango/backwardation). Roll a scadenza. Kraken e Deribit accessibili da IT. Nessun funding rate.',
    costStructure: {
      spreadType: 'ob_variable',
      commissionType: 'maker_taker',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'at_expiry',
      rollCostType: 'basis_dependent',
      koType: 'liquidation',
      koDistanceInput: 'leverage_based',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'per_chain_variable',
      depositFeeType: 'fiat_to_crypto_pct',
    },
  },

  // ── CFD CRYPTO (broker retail) ──────────────────────────────
  crypto_cfd: {
    id: 'crypto_cfd',
    label: 'CFD Crypto (broker retail)',
    labelEn: 'Crypto CFD',
    category: 'derivative_linear',
    executionModel: 'mm_internal',
    liquidityTier: 'high',
    maxLeverageESMA: 2,
    availableForUGs: ['ug_crypto_major'],
    notes: 'Leva max 2:1 ESMA. Spread molto ampio vs exchange native. Financing overnight elevato su crypto. Per chi non vuole account su exchange.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'none',
      overnightType: 'sofr_plus_markup',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_pnl',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },

  // ── ETP/ETN CRYPTO ──────────────────────────────────────────
  crypto_etp: {
    id: 'crypto_etp',
    label: 'ETP/ETN Crypto (borsa)',
    labelEn: 'Crypto ETP/ETN',
    category: 'exchange_product',
    executionModel: 'clob',
    liquidityTier: 'medium',
    maxLeverageESMA: null,
    availableForUGs: ['ug_crypto_major'],
    notes: 'Quotati su Xetra/SIX (BTCE, ETHC, XBTC). Nessuna leva. TER ~0.98–1.5%. Accessibili da broker IT standard (Fineco, Directa, DEGIRO). Non per trading attivo.',
    costStructure: {
      spreadType: 'borsa_variable',
      commissionType: 'per_trade_pct',
      overnightType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: true,
      terAnnualPct: 1.20,
      marginInterestType: 'none',
      withdrawalFeeType: 'none',
      depositFeeType: 'none',
    },
  },
};

// ── Helper: strumenti disponibili per UG ─────────────────────
export function getInstrumentsForUG(ugId: UnderlyingGroupId): InstrumentType[] {
  return Object.values(INSTRUMENT_TYPES).filter(inst =>
    inst.availableForUGs.includes(ugId)
  );
}
