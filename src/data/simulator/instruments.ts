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
  | 'crypto_native';         // Spot, Perpetual, Futures datati

// ── Modello di esecuzione ────────────────────────────────────
export type ExecutionModel =
  | 'clob'           // Central Limit Order Book
  | 'ecn_stp'        // ECN/STP — forex no-dealing desk
  | 'mm_internal'    // Market Maker interno (dealing desk)
  | 'issuer_priced'  // Prezzo fissato dall'emittente (certificati SeDeX)
  | 'crypto_ob';     // Orderbook exchange crypto

// ── Tier liquidità ───────────────────────────────────────────
export type LiquidityTier = 'high' | 'medium' | 'low';

// ============================================================
// COST STRUCTURE — schema validato completo
// ============================================================
export type CostStructure = {

  // 1. SPREAD
  // Tipo di spread applicato all'eseguito
  spreadType:
    | 'fixed_bps'       // CFD DD — spread fisso in bps nel prezzo
    | 'tick'            // Futures — spread = 1 tick su CLOB
    | 'ob_variable'     // Crypto — spread variabile per liquidityTier
    | 'issuer_fixed'    // Certificati SeDeX — spread fisso emittente
    | 'borsa_variable'; // ETF/ETC — spread variabile su borsa

  // 2. COMMISSION
  // Struttura commissione esplicita per eseguito
  commissionType:
    | 'none'            // CFD DD, Turbo/LevFissa su Fineco
    | 'per_lot'         // CFD ECN — €/$ per lotto standard (100k)
    | 'per_contract'    // Futures — €/$ per contratto RT
    | 'maker_taker'     // Crypto — % separata maker vs taker
    | 'per_trade_pct';  // ETF/ETC — % sul nozionale per trade

  // 3. OVERNIGHT / FINANCING
  // Costo di detenzione notturna
  overnightType:
    | 'none'                  // Futures, ETF, ETC, Crypto native
    | 'sofr_plus_markup'      // CFD su sottostanti USD (indici USA, commodity, FX)
    | 'euribor_plus_markup'   // CFD su sottostanti EUR (indici EU, azioni EU)
    | 'integrated_in_price';  // Turbo KO, Mini Future — nel livello KO/financing

  // 4. REBASING / DECAY
  // Erosione strutturale da reset giornaliero della leva
  rebasingType:
    | 'none'
    | 'daily_lev_squared'; // ETF leva, ETC leva, Leva Fissa — formula (L²-L)/2 × σ²
  leverageMultiplier: number | null; // 2, 3, 5, -1, -2, -3 — null se non applicabile

  // 5. FUNDING RATE
  // Costo periodico su posizioni aperte (solo crypto perp)
  fundingType:
    | 'none'
    | 'every_8h_variable'; // Crypto Perp — pagato o ricevuto ogni 8h
  fundingDirection:
    | 'none'
    | 'variable'; // sempre variable a runtime — long/short × sentiment mercato

  // 6. ROLL COST
  // Costo di rinnovo posizione a scadenza
  rollType:
    | 'none'
    | 'quarterly'   // Futures CME/Eurex — roll ogni trimestre
    | 'at_expiry';  // Crypto Futures datati — roll a scadenza
  rollCostType:
    | 'none'
    | 'bid_ask_twice'    // Paghi spread 2x (chiudi vecchio + apri nuovo)
    | 'basis_dependent'; // Crypto — costo dipende da contango/backwardation

  // 7. KO / LIQUIDATION RISK
  // Rischio di chiusura forzata istantanea
  koType:
    | 'none'
    | 'instant_ko'      // Turbo KO — perdita totale del premio al tocco barrier
    | 'soft_stop_loss'  // Mini Future — stop-loss con recupero parziale residuo
    | 'liquidation';    // Crypto Perp/Futures — liquidazione automatica per margin
  koDistanceInput:
    | 'none'
    | 'static_pct'       // Turbo — distanza % fissa dal barrier al momento acquisto
    | 'dynamic_barrier'  // Mini Future — barrier si aggiorna con financing level
    | 'leverage_based';  // Crypto — funzione della leva (1/L - maintenance margin)

  // 8. FX CONVERSION
  // Costo di conversione valuta (conto sempre EUR per retail IT)
  underlyingCurrency: 'EUR' | 'USD' | 'JPY' | 'GBP' | 'CHF' | 'other';
  fxConversionType:
    | 'none'       // Sottostante EUR, conto EUR
    | 'on_trade'   // Conversione al momento dell'eseguito (futures CME, ETF su LSE)
    | 'on_pnl';    // Conversione solo sul P&L (alcuni broker CFD)

  // 9. TER ANNUO
  // Total Expense Ratio — solo ETF/ETC/ETP
  hasTER: boolean;
  terAnnualPct: number | null; // es. 0.35 ETF leva, 1.20 ETP crypto — null se N/A

  // 10. MARGIN INTEREST
  // Tasso applicato sul capitale immobilizzato come margin
  marginInterestType:
    | 'none'                // Prodotti senza margin (ETF, ETC, certificati)
    | 'on_initial_margin'   // Futures — tasso su margin iniziale immobilizzato
    | 'on_full_notional';   // Alcuni CFD — tasso sull'intero nozionale

  // 11. CRYPTO ONLY — deposit / withdrawal fees
  withdrawalFeeType:
    | 'none'
    | 'per_chain_variable'; // Fee fissa per rete blockchain (variabile per chain)
  depositFeeType:
    | 'none'
    | 'fiat_to_crypto_pct'; // % sulla conversione EUR → crypto al deposito
};

// ============================================================
// INSTRUMENT TYPE — entità completa
// ============================================================
export type InstrumentTypeId =
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
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
      'ug_crypto_major',
    ],
    notes: 'Spread allargato incluso nel prezzo. Zero commissioni esplicite. Slippage asimmetrico in volatilità alta. Re-quote possibile su DD.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'none',
      overnightType: 'sofr_plus_markup', // default USD — broker specifica quale tasso
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
      'ug_idx_us', 'ug_idx_eu',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: '1/10 del nozionale futures standard. Stessa struttura costi. Commission proporzionalmente più alta su nozionale. Ideale retail con capitale <10k.',
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
      leverageMultiplier: 2, // default — valore specifico per ETF dipende dal prodotto
      fundingType: 'none',
      fundingDirection: 'none',
      rollType: 'none',
      rollCostType: 'none',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'on_trade',
      hasTER: true,
      terAnnualPct: 0.35, // valore medio — range 0.20–0.75%
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
    notes: 'KO istantaneo al tocco del barrier — perdita totale del premio. Spread emittente fisso. Finanziamento integrato nel prezzo. Quotato SeDeX. Zero comm su Fineco.',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'none', // Fineco zero — altri broker applicano commission
      overnightType: 'integrated_in_price',
      rebasingType: 'none',
      leverageMultiplier: null, // leva dinamica — funzione distanza dal barrier
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
      'ug_fx_major',
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Open-end senza scadenza. Stop-loss level con recupero parziale (non KO secco). Financing level aggiornato periodicamente. Spread emittente.',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'per_trade_pct', // commission broker variabile
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
      commissionType: 'none', // zero su Fineco
      overnightType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 3, // default — range 2/3/5/-2/-3
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
