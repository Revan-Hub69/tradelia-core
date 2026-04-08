// ============================================================
// INSTRUMENT TYPES — immutabile (struttura + costStructure)
// Ogni strumento ha il proprio layer di costi modellato
// come variabili tipizzate. I valori numerici specifici
// per broker vengono nel layer brokers.ts (InstrumentOffer).
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
//
// Questo tipo descrive COME si calcola ogni componente di costo
// per ogni strumento. I valori numerici effettivi (quanto costa
// su un broker specifico) vivono in InstrumentOffer (brokers.ts).
//
// Campi aggiunti rispetto alla versione precedente:
//   - exchangeFeeType  (§6b) — fee exchange separata dalla commission broker
//   - financingRateType (§3b) — rate annuo implicito nei certificati strutturati
// ============================================================
export type CostStructure = {

  // ── 1. SPREAD ──────────────────────────────────────────────
  // Come si forma lo spread sul mercato/prodotto.
  // Il valore numerico (spreadAvgBps) è in InstrumentOffer.
  spreadType:
    | 'fixed_bps'       // CFD DD/ECN — spread fisso in bps sul nozionale
    | 'tick'            // Futures — spread minimo = 1 tick (strutturale del contratto)
    | 'ob_variable'     // Crypto OB / Spot FX ECN — spread variabile dall'orderbook
    | 'issuer_fixed'    // Certificati SeDeX — spread fisso fissato dall'emittente
    | 'borsa_variable'  // ETF/ETC/ETP — spread variabile su mercato regolamentato
    | 'raw_ecn';        // Spot FX OTC NDD — spread near-zero su LP interbancario

  // ── 2. COMMISSION BROKER ───────────────────────────────────
  // Commissione esplicita applicata dal broker.
  // Valori numerici: commissionPerLotEUR / commissionPerContractEUR /
  //                  makerFeePct / takerFeePct  in InstrumentOffer.
  commissionType:
    | 'none'            // CFD DD, Turbo KO Fineco, Leva Fissa — nessuna commission esplicita
    | 'per_lot'         // CFD ECN — commission per lotto standard (100k)
    | 'per_contract'    // Futures — commission per contratto (broker fee)
    | 'maker_taker'     // Crypto exchange — fee maker/taker separata
    | 'per_trade_pct'   // ETF/ETC/ETP, Mini Future — % sul controvalore
    | 'per_lot_ecn';    // Spot FX OTC — commission per lotto come ECN ma su spot

  // ── 3a. OVERNIGHT / FINANCING CFD & SPOT FX ────────────────
  // Costo di mantenimento posizione overnight su CFD e Spot FX.
  // Valori numerici: overnightLongAnnualPct / overnightShortAnnualPct
  //                  / tomNextLongPipsPerDay / tomNextShortPipsPerDay in InstrumentOffer.
  overnightType:
    | 'none'                // Futures (costo nel basis), ETF, Leva Fissa — nessun overnight
    | 'sofr_plus_markup'    // CFD — basato su SOFR (o EURIBOR) + markup broker
    | 'euribor_plus_markup' // CFD su asset EUR-denominated
    | 'integrated_in_price' // Certificati strutturati — non un costo esplicito ma nel pricing
    | 'tom_next_rollover';  // Spot FX OTC — rollover tom/next ogni giorno lavorativo (in pip)

  // ── 3b. FINANCING RATE CERTIFICATI ─────────────────────────
  // Tasso di finanziamento annuo implicito nel prezzo dei certificati
  // strutturati (Turbo KO, Mini Future). Distinto da overnightType
  // perché non è un addebito esplicito ma si riflette nel valore
  // del certificato giorno per giorno.
  // Valore numerico: financingRateAnnualPct in InstrumentOffer.
  financingRateType:
    | 'none'                  // tutti gli altri strumenti
    | 'issuer_rate_annual';   // Turbo KO, Mini Future — rate % annuo implicito nel prezzo

  // ── 4. REBASING / DECAY ────────────────────────────────────
  // Perdita strutturale da reset giornaliero della leva.
  // Valore numerico: leverageMultiplier in CostStructure (strutturale, non broker-specifico).
  rebasingType:
    | 'none'
    | 'daily_lev_squared';  // ETF leva, ETC leva, Leva Fissa — decay ∝ (leva² × vol²) / 2
  leverageMultiplier: number | null;

  // ── 5. FUNDING RATE ────────────────────────────────────────
  // Pagamento periodico per mantenere una posizione aperta (crypto perp).
  // Valori numerici: fundingRateTypicalPct8h / fundingRateMaxPct8h in InstrumentOffer.
  fundingType:
    | 'none'
    | 'every_8h_variable';  // Crypto perp — funding ogni 8h, può essere positivo o negativo
  fundingDirection:
    | 'none'
    | 'variable';           // Dipende dalla pressione long/short sul mercato

  // ── 6a. COMMISSION EXCHANGE (separata dalla commission broker) ──
  // Fee pagata direttamente all'exchange/clearing house, distinta
  // dalla commission broker. Rilevante per futures CME/Eurex.
  // Valore numerico: exchangeFeePerContractEUR in InstrumentOffer.
  exchangeFeeType:
    | 'none'              // CFD, Spot FX, Crypto — nessuna exchange fee separata
    | 'per_contract_cme'  // Futures CME — fee per contratto (exchange + NFA + regulatory)
    | 'per_contract_eurex'; // Futures Eurex — fee per contratto

  // ── 6b. ROLL COST ──────────────────────────────────────────
  // Costo di rolling da una scadenza alla successiva.
  // Valori numerici: rollSpreadBps / rollFrequencyDays /
  //                  rolloverCostPerContractEUR in InstrumentOffer.
  rollType:
    | 'none'
    | 'quarterly'         // Futures std/micro — roll IMM trimestrale
    | 'at_expiry'         // Crypto futures datati — roll a scadenza
    | 'daily_tomnext';    // Spot FX OTC — roll tom/next giornaliero
  rollCostType:
    | 'none'
    | 'bid_ask_twice'     // Futures — costo = spread bid/ask × 2 (chiudi + apri)
    | 'basis_dependent'   // Crypto futures — costo dipende dal basis contango/backwardation
    | 'tomnext_rate';     // Spot FX OTC — costo dipende da differenziale tassi delle due valute

  // ── 7. KO / LIQUIDATION RISK ──────────────────────────────
  // Meccanismo di chiusura forzata della posizione.
  // Valore numerico: koDistancePctTypical in InstrumentOffer.
  koType:
    | 'none'
    | 'instant_ko'        // Turbo KO — chiusura immediata al tocco del barrier, perdita totale premio
    | 'soft_stop_loss'    // Mini Future — stop-loss con recupero parziale del capitale residuo
    | 'liquidation';      // Crypto perp/futures — margin call automatica
  koDistanceInput:
    | 'none'
    | 'static_pct'        // Turbo KO — distanza fissa % dal prezzo
    | 'dynamic_barrier'   // Mini Future — barrier aggiornata periodicamente dall'emittente
    | 'leverage_based';   // Crypto — distanza dipende dalla leva scelta

  // ── 8. FX CONVERSION ──────────────────────────────────────
  // Costo di conversione valutaria sul P&L o sul trade.
  // Valore numerico: fxConversionBps in InstrumentOffer.
  underlyingCurrency: 'EUR' | 'USD' | 'JPY' | 'GBP' | 'CHF' | 'other';
  fxConversionType:
    | 'none'        // nessuna conversione
    | 'on_trade'    // conversione al momento del trade (ETF, Futures)
    | 'on_pnl'      // conversione solo sul P&L realizzato (CFD)
    | 'native';     // Spot FX OTC — il prodotto è già la coppia, nessuna conversione aggiuntiva

  // ── 9. TER ANNUO ──────────────────────────────────────────
  // Total Expense Ratio — rilevante solo per ETF/ETC/ETP.
  // Valore numerico: terAnnualPct in CostStructure (strutturale) e InstrumentOffer (per broker).
  hasTER: boolean;
  terAnnualPct: number | null;

  // ── 10. MARGIN INTEREST ───────────────────────────────────
  // Interesse sul margine/collaterale immobilizzato.
  // Rilevante per Futures (su initial margin) e Spot FX IB (su margin loan).
  // Valore numerico: marginInterestAnnualPct in InstrumentOffer.
  marginInterestType:
    | 'none'
    | 'on_initial_margin'  // Futures — interest annuo sull'initial margin bloccato
    | 'on_margin_loan';    // Spot FX IB — interest sul loan implicito nella posizione levered

  // ── 11. CRYPTO ONLY ───────────────────────────────────────
  // Fee specifiche degli exchange crypto.
  // Valori numerici: withdrawalFeeUSD / depositFiatPct in InstrumentOffer.
  withdrawalFeeType:
    | 'none'
    | 'per_chain_variable';   // Crypto — fee dipende dalla chain (ETH > BTC > USDT TRC20)
  depositFeeType:
    | 'none'
    | 'fiat_to_crypto_pct';   // Crypto — % sul deposito fiat→crypto
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
    notes: 'Mercato interbancario OTC puro. Spread near-zero su major con broker ECN NDD (LMAX, Dukascopy, Saxo, IB). Commission per lotto esplicita. Rollover tom/next overnight in pip — costo dipende dal differenziale tassi tra le due valute della coppia. Margin interest sul loan implicito nella posizione levered (IB). Leva max 30:1 ESMA su major.',
    costStructure: {
      spreadType: 'raw_ecn',
      commissionType: 'per_lot_ecn',
      overnightType: 'tom_next_rollover',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
      rollType: 'daily_tomnext',
      rollCostType: 'tomnext_rate',
      koType: 'none',
      koDistanceInput: 'none',
      underlyingCurrency: 'USD',
      fxConversionType: 'native',
      hasTER: false,
      terAnnualPct: null,
      marginInterestType: 'on_margin_loan',
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
      'ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic',
      'ug_idx_us', 'ug_idx_eu', 'ug_idx_asia',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_metals_industrial', 'ug_cmd_energy',
      'ug_crypto_major',
    ],
    notes: 'Spread allargato incluso nel prezzo, nessuna commission esplicita. Overnight su SOFR/EURIBOR + markup broker. Slippage asimmetrico in alta volatilità. Re-quote possibile.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'none',
      overnightType: 'sofr_plus_markup',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
    notes: 'Spread near-zero su major FX. Commission per lotto esplicita. Esecuzione STP diretta su LP. Overnight su SOFR + markup. Nessun re-quote.',
    costStructure: {
      spreadType: 'fixed_bps',
      commissionType: 'per_lot',
      overnightType: 'sofr_plus_markup',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
    notes: 'CLOB — esecuzione trasparente. Nessun financing overnight (costo nel basis). Commission broker + exchange fee CME/Eurex separata. Roll trimestrale IMM. Margin interest sul capitale immobilizzato come initial margin.',
    costStructure: {
      spreadType: 'tick',
      commissionType: 'per_contract',
      overnightType: 'none',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'per_contract_cme',
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
      'ug_fx_major', 'ug_fx_minor',
      'ug_idx_us', 'ug_idx_eu',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: '1/10 del nozionale futures standard. Stessa struttura costi. Commission + exchange fee proporzionalmente più alte su nozionale piccolo. FX: M6E (€12.5k), M6B (£6.25k), MJY.',
    costStructure: {
      spreadType: 'tick',
      commissionType: 'per_contract',
      overnightType: 'none',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'per_contract_cme',
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
    notes: 'Leva 2x/-1x/-2x incorporata. TER annuo + rebasing giornaliero. Nessun KO strutturale. Azzeramento teorico possibile solo con gap estremo su -2x.',
    costStructure: {
      spreadType: 'borsa_variable',
      commissionType: 'per_trade_pct',
      overnightType: 'none',
      financingRateType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 2,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
      financingRateType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 2,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
    notes: 'Backed da metallo fisico (PHAU, SGLN). Nessuna leva. TER ~0.12–0.25%. Solo esposizione direzionale senza leva.',
    costStructure: {
      spreadType: 'borsa_variable',
      commissionType: 'per_trade_pct',
      overnightType: 'none',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
    notes: 'KO istantaneo al tocco del barrier — perdita totale del premio. Spread emittente fisso. Financing rate annuo implicito nel prezzo (aggiorna il financing level ogni giorno). Zero comm su Fineco SeDeX. Quotato SeDeX o OTC (IG Turbo24).',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'none',
      overnightType: 'integrated_in_price',
      financingRateType: 'issuer_rate_annual',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
      'ug_fx_major', 'ug_fx_minor',
      'ug_idx_us', 'ug_idx_eu',
      'ug_eq_us_largecap', 'ug_eq_eu_largecap', 'ug_eq_it',
      'ug_cmd_metals_precious', 'ug_cmd_energy',
    ],
    notes: 'Open-end senza scadenza. Stop-loss level con recupero parziale (non KO secco). Financing level aggiornato periodicamente dall\'emittente. Financing rate annuo implicito nel prezzo. Spread emittente. SeDeX + broker strutturati.',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'per_trade_pct',
      overnightType: 'integrated_in_price',
      financingRateType: 'issuer_rate_annual',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
    notes: 'Leva fissa 2x/3x/5x/-2x/-3x. Rebasing giornaliero identico agli ETF leva. Nessun financing rate esplicito (struttura diversa da Turbo KO/Mini Future). Zero comm su Fineco. Decay penalizza multiday.',
    costStructure: {
      spreadType: 'issuer_fixed',
      commissionType: 'none',
      overnightType: 'none',
      financingRateType: 'none',
      rebasingType: 'daily_lev_squared',
      leverageMultiplier: 3,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
    notes: 'Funding rate ogni 8h variabile (può essere negativo). Liquidazione automatica per margin call. Maker fee ~0% su MEXC. Leva max consigliata retail: 10x.',
    costStructure: {
      spreadType: 'ob_variable',
      commissionType: 'maker_taker',
      overnightType: 'none',
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'every_8h_variable',
      fundingDirection: 'variable',
      exchangeFeeType: 'none',
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
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
      financingRateType: 'none',
      rebasingType: 'none',
      leverageMultiplier: null,
      fundingType: 'none',
      fundingDirection: 'none',
      exchangeFeeType: 'none',
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
