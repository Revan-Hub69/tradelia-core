// ============================================================
// UNDERLYINGS — singoli sottostanti selezionabili
// Usati nel frontend per la selezione granulare dell'asset
// e nel matcher per override dei costi per coppia.
//
// STATO POPOLAMENTO:
//   ✅ FOREX MAJOR   — completo (7 coppie)
//   ✅ FOREX MINOR   — completo (7 coppie)
//   ✅ FOREX EXOTIC  — completo (6 coppie)
//   ⏳ ALTRI ASSET   — TODO (indices, equities, commodities, crypto)
//
// NOTE CAMPI COSTI:
//   - I campi statici (typicalSpreadBps, marginRequirement, estimatedSlippage)
//     sono valori tipici che il motore usa come riferimento.
//   - I valori effettivi per broker specifico sono in InstrumentOffer (brokers.ts).
//   - I campi calcolati (totalCostPerTrade, overnightCost, marginUsed, rankingScore)
//     vengono calcolati dal motore a runtime, non sono hardcoded.
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';

// ── ID univoci per ogni sottostante ─────────────────────────
export type UnderlyingId =
  // Forex Major
  | 'eurusd'
  | 'gbpusd'
  | 'usdjpy'
  | 'usdchf'
  | 'audusd'
  | 'usdcad'
  | 'nzdusd'
  // Forex Minor
  | 'eurgbp'
  | 'eurjpy'
  | 'gbpjpy'
  | 'eurchf'
  | 'eurcad'
  | 'euraud'
  | 'audjpy'
  // Forex Exotic
  | 'usdtry'
  | 'usdmxn'
  | 'usdzar'
  | 'eurtry'
  | 'usdsgd'
  | 'usdhkd';

// ── Sessioni di liquidità attive ─────────────────────────────
export type TradingSession = 'london' | 'new_york' | 'tokyo' | 'sydney' | 'overlap_ln_ny';

// ── Carry direction ──────────────────────────────────────────
// 'positive_long'  → tenere long genera carry positivo (es. AUD/USD con RBA > Fed)
// 'negative_long'  → tenere long costa carry (es. EUR/USD con Fed > BCE)
// 'variable'       → dipende dal contesto tassi corrente
export type CarryDirection = 'positive_long' | 'negative_long' | 'variable';

// ── Futures contracts CME disponibili per coppia ─────────────
//
// Ticker CME ufficiali FX Futures:
//   micro = prefisso 'M'  (es. M6E = Euro Micro, 12.500 EUR)
//   mini  = prefisso 'E7' (es. E7  = Euro Mini,  62.500 EUR — non tutti i broker)
//   full  = standard      (es. 6E  = Euro Full,  125.000 EUR)
//
// Array vuoto → nessun futures CME dedicato per questa coppia
// (minor e exotic non hanno contratti CME liquidi dedicati)
export type CmeFxTicker = string; // es. 'M6E', '6E', 'E7', '6B', '6J', ...

// ── Entità sottostante ───────────────────────────────────────
export type Underlying = {
  id:                    UnderlyingId;
  symbol:                string;          // es. 'EUR/USD'
  label:                 string;          // es. 'Euro / Dollaro USA'
  labelEn:               string;
  groupId:               UnderlyingGroupId;

  // Caratteristiche di mercato
  baseCurrency:          string;          // valuta base (sinistra) — es. 'EUR'
  quoteCurrency:         string;          // valuta quotata (destra) — es. 'USD'
  typicalVolatilityPct:  number;          // volatilità giornaliera tipica %
  typicalSpreadBps:       number;          // spread mid-market tipico ECN in bps
  liquidityTier:         'tier1' | 'tier2' | 'tier3'; // tier1 = massima liquidità
  activeSessions:        TradingSession[];

  // Carry / overnight — swap in pip per notte (valori tipici per riferimento)
  carryDirection:        CarryDirection;
  carryNotes:            string;          // spiegazione del carry per l'utente

  // Swap overnight tipici (in pip per notte — riferimento, non valore broker)
  // Il motore calcola il costo effettivo: pipValue * lots * leverage * swapPips
  overnightLongPipsPerDay:    number;      // swap per posizione long (negativo = costo)
  overnightShortPipsPerDay:  number;      // swap per posizione short (negativo = costo)

  // Margin requirement (% del nozionale richiesto come margine)
  // Differisce per coppia: più volatile = margine maggiore
  marginRequirementPct:       number;

  // Slippage stimato in bps (valore tipico, il broker può essere diverso)
  estimatedSlippageBps:      number;

  // Lotto minimo (in unità del quote currency)
  minTradeSize:         number;

  // Leva massima ESMA per questo sottostante
  maxLeverageESMA:       number;

  /**
   * Ticker CME FX Futures disponibili per questa coppia.
   * Usato dal motore e dal frontend per:
   *   - determinare se il toggle CFD/Futures è abilitato
   *   - filtrare le offerte futures_std compatibili
   *   - mostrare i ticker all'utente nel pannello futures
   *
   * Array vuoto → futures non disponibili per questa coppia
   * (minor e exotic in genere non hanno contratti CME liquidi)
   *
   * Ordine convenzionale: [micro, mini?, full]
   *   micro = 'M' prefix (12.500 unità base tipico)
   *   mini  = 'E7' / 'M6B' dove disponibile (62.500 unità base)
   *   full  = ticker standard (125.000 unità base)
   */
  futuresContracts:     CmeFxTicker[];

  // Nota editoriale per il frontend
  notes:                 string;
};

// ============================================================
// UNDERLYINGS DATA
// ============================================================
export const UNDERLYINGS: Record<UnderlyingId, Underlying> = {

  // ── FOREX MAJOR ────────────────────────────────────────────

  eurusd: {
    id: 'eurusd',
    symbol: 'EUR/USD',
    label: 'Euro / Dollaro USA',
    labelEn: 'Euro / US Dollar',
    groupId: 'ug_fx_major',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    typicalVolatilityPct: 0.5,
    typicalSpreadBps: 1.0,
    liquidityTier: 'tier1',
    activeSessions: ['london', 'new_york', 'overlap_ln_ny'],
    carryDirection: 'negative_long',
    carryNotes: 'Long EUR/USD paga differenziale SOFR − EURIBOR (negativo per chi è long quando Fed > BCE). Carry tipicamente negativo per posizioni long.',
    overnightLongPipsPerDay: -0.5,    // swap long (negativo = costo)
    overnightShortPipsPerDay: -0.1,   // swap short (positivo = guadagno, ma qui quasi nullo)
    marginRequirementPct: 3.33,        // 1/30 di leva = 3.33%
    estimatedSlippageBps: 0.5,         // slippage tipico 0.5 bps
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: M6E (micro 12.500), E7 (mini 62.500), 6E (full 125.000)
    futuresContracts: ['M6E', 'E7', '6E'],
    notes: 'Coppia più liquida al mondo. Spread minimo, slippage quasi nullo in sessione London/NY. Default per Forex Major.',
  },

  gbpusd: {
    id: 'gbpusd',
    symbol: 'GBP/USD',
    label: 'Sterlina / Dollaro USA',
    labelEn: 'British Pound / US Dollar',
    groupId: 'ug_fx_major',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    typicalVolatilityPct: 0.6,
    typicalSpreadBps: 1.5,
    liquidityTier: 'tier1',
    activeSessions: ['london', 'new_york', 'overlap_ln_ny'],
    carryDirection: 'variable',
    carryNotes: 'Dipende da differenziale SONIA (BoE) − SOFR (Fed). Volatilità alta su dati UK macro e news BoE.',
    overnightLongPipsPerDay: -0.3,
    overnightShortPipsPerDay: -0.2,
    marginRequirementPct: 3.33,
    estimatedSlippageBps: 0.8,
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: M6B (micro 6.250 GBP), 6B (full 62.500 GBP)
    futuresContracts: ['M6B', '6B'],
    notes: 'Alta volatilità intraday. Spread leggermente più ampio di EUR/USD. Molto attiva in sessione London.',
  },

  usdjpy: {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    label: 'Dollaro USA / Yen Giapponese',
    labelEn: 'US Dollar / Japanese Yen',
    groupId: 'ug_fx_major',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    typicalVolatilityPct: 0.5,
    typicalSpreadBps: 1.0,
    liquidityTier: 'tier1',
    activeSessions: ['tokyo', 'london', 'new_york'],
    carryDirection: 'positive_long',
    carryNotes: 'Long USD/JPY riceve differenziale SOFR − TONAR. BoJ mantiene tassi quasi zero → carry fortemente positivo per chi è long. Classico carry trade.',
    overnightLongPipsPerDay: 1.5,        // carry positivo per long
    overnightShortPipsPerDay: -2.0,     // carry negativo per short
    marginRequirementPct: 3.33,
    estimatedSlippageBps: 0.5,
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: M6J (micro 1.250.000 JPY), 6J (full 12.500.000 JPY)
    futuresContracts: ['M6J', '6J'],
    notes: 'Unica major attiva anche in sessione Tokyo. Carry positivo rende interessante per swing/position. Attenzione a interventi BoJ.',
  },

  usdchf: {
    id: 'usdchf',
    symbol: 'USD/CHF',
    label: 'Dollaro USA / Franco Svizzero',
    labelEn: 'US Dollar / Swiss Franc',
    groupId: 'ug_fx_major',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    typicalVolatilityPct: 0.5,
    typicalSpreadBps: 1.5,
    liquidityTier: 'tier1',
    activeSessions: ['london', 'new_york', 'overlap_ln_ny'],
    carryDirection: 'positive_long',
    carryNotes: 'SNB mantiene tassi bassi → differenziale SOFR − SARON positivo per long USD/CHF. Carry moderatamente positivo.',
    overnightLongPipsPerDay: 0.8,
    overnightShortPipsPerDay: -1.2,
    marginRequirementPct: 3.33,
    estimatedSlippageBps: 0.8,
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: 6S (full 125.000 CHF) — nessun micro/mini liquido
    futuresContracts: ['6S'],
    notes: 'Valuta rifugio CHF — movimenti bruschi su risk-off. Correlazione inversa con EUR/USD.',
  },

  audusd: {
    id: 'audusd',
    symbol: 'AUD/USD',
    label: 'Dollaro Australiano / Dollaro USA',
    labelEn: 'Australian Dollar / US Dollar',
    groupId: 'ug_fx_major',
    baseCurrency: 'AUD',
    quoteCurrency: 'USD',
    typicalVolatilityPct: 0.6,
    typicalSpreadBps: 1.5,
    liquidityTier: 'tier1',
    activeSessions: ['sydney', 'tokyo', 'london'],
    carryDirection: 'variable',
    carryNotes: 'Dipende da RBA cash rate vs SOFR. Con RBA > Fed: carry positivo per long AUD/USD. Con Fed > RBA: negativo. Verifica tassi correnti.',
    overnightLongPipsPerDay: 0.2,
    overnightShortPipsPerDay: -0.5,
    marginRequirementPct: 3.33,
    estimatedSlippageBps: 0.8,
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: M6A (micro 10.000 AUD), 6A (full 100.000 AUD)
    futuresContracts: ['M6A', '6A'],
    notes: 'Commodity currency — correlata a prezzi metalli e risk appetite globale. Attiva in sessione Asia-Pacific.',
  },

  usdcad: {
    id: 'usdcad',
    symbol: 'USD/CAD',
    label: 'Dollaro USA / Dollaro Canadese',
    labelEn: 'US Dollar / Canadian Dollar',
    groupId: 'ug_fx_major',
    baseCurrency: 'USD',
    quoteCurrency: 'CAD',
    typicalVolatilityPct: 0.5,
    typicalSpreadBps: 2.0,
    liquidityTier: 'tier1',
    activeSessions: ['london', 'new_york', 'overlap_ln_ny'],
    carryDirection: 'variable',
    carryNotes: 'Differenziale SOFR − BoC policy rate. BoC e Fed spesso sincronizzati → carry ridotto. Correlata a WTI Crude.',
    overnightLongPipsPerDay: -0.1,
    overnightShortPipsPerDay: -0.2,
    marginRequirementPct: 3.33,
    estimatedSlippageBps: 1.0,
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: M6C (micro 10.000 CAD), 6C (full 100.000 CAD)
    futuresContracts: ['M6C', '6C'],
    notes: 'Fortemente correlata al prezzo del petrolio WTI. Spread leggermente più ampio vs EUR/USD.',
  },

  nzdusd: {
    id: 'nzdusd',
    symbol: 'NZD/USD',
    label: 'Dollaro Neozelandese / Dollaro USA',
    labelEn: 'New Zealand Dollar / US Dollar',
    groupId: 'ug_fx_major',
    baseCurrency: 'NZD',
    quoteCurrency: 'USD',
    typicalVolatilityPct: 0.6,
    typicalSpreadBps: 2.0,
    liquidityTier: 'tier1',
    activeSessions: ['sydney', 'tokyo', 'london'],
    carryDirection: 'variable',
    carryNotes: 'RBNZ cash rate vs SOFR. Simile ad AUD/USD per dinamiche carry. Minore liquidità vs AUD.',
    overnightLongPipsPerDay: 0.1,
    overnightShortPipsPerDay: -0.4,
    marginRequirementPct: 3.33,
    estimatedSlippageBps: 1.0,
    minTradeSize: 1000,
    maxLeverageESMA: 30,
    // CME: 6N (full 100.000 NZD) — nessun micro/mini liquido
    futuresContracts: ['6N'],
    notes: 'Simile a AUD/USD. Minore liquidità — spread leggermente più ampio. Mossa da dati economia NZ e risk sentiment.',
  },

  // ── FOREX MINOR ────────────────────────────────────────────
  // Nessuna minor ha contratti CME FX dedicati con liquidità retail adeguata.
  // futuresContracts: [] per tutte le minor.

  eurgbp: {
    id: 'eurgbp',
    symbol: 'EUR/GBP',
    label: 'Euro / Sterlina',
    labelEn: 'Euro / British Pound',
    groupId: 'ug_fx_minor',
    baseCurrency: 'EUR',
    quoteCurrency: 'GBP',
    typicalVolatilityPct: 0.35,
    typicalSpreadBps: 2.0,
    liquidityTier: 'tier1',
    activeSessions: ['london', 'overlap_ln_ny'],
    carryDirection: 'variable',
    carryNotes: 'EURIBOR vs SONIA. Dipende da politica BCE vs BoE. Range spesso compresso — bassa volatilità.',
    overnightLongPipsPerDay: -0.2,
    overnightShortPipsPerDay: -0.1,
    marginRequirementPct: 5.0,          // 1/20 di leva = 5%
    estimatedSlippageBps: 1.0,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: 'Default per Forex Minor. Bassa volatilità — range stretto tipico. Molto attiva in sessione London.',
  },

  eurjpy: {
    id: 'eurjpy',
    symbol: 'EUR/JPY',
    label: 'Euro / Yen Giapponese',
    labelEn: 'Euro / Japanese Yen',
    groupId: 'ug_fx_minor',
    baseCurrency: 'EUR',
    quoteCurrency: 'JPY',
    typicalVolatilityPct: 0.7,
    typicalSpreadBps: 2.0,
    liquidityTier: 'tier1',
    activeSessions: ['tokyo', 'london', 'overlap_ln_ny'],
    carryDirection: 'positive_long',
    carryNotes: 'Long EUR/JPY riceve EURIBOR − TONAR. Con BCE in rialzo e BoJ fermo → carry positivo interessante. Cross carry trade classico.',
    overnightLongPipsPerDay: 0.8,
    overnightShortPipsPerDay: -1.5,
    marginRequirementPct: 5.0,
    estimatedSlippageBps: 1.2,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: 'Alta volatilità tra le minor. Ottima per scalping in sessione Tokyo/London overlap. Carry positivo per long.',
  },

  gbpjpy: {
    id: 'gbpjpy',
    symbol: 'GBP/JPY',
    label: 'Sterlina / Yen Giapponese',
    labelEn: 'British Pound / Japanese Yen',
    groupId: 'ug_fx_minor',
    baseCurrency: 'GBP',
    quoteCurrency: 'JPY',
    typicalVolatilityPct: 0.85,
    typicalSpreadBps: 3.0,
    liquidityTier: 'tier2',
    activeSessions: ['tokyo', 'london', 'overlap_ln_ny'],
    carryDirection: 'positive_long',
    carryNotes: 'SONIA − TONAR → carry fortemente positivo per long GBP/JPY. Una delle coppie carry più popolari tra i trader retail.',
    overnightLongPipsPerDay: 2.0,
    overnightShortPipsPerDay: -2.5,
    marginRequirementPct: 5.0,
    estimatedSlippageBps: 2.0,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: '"The Beast" — volatilità altissima per una minor. Spread più ampio. Fortissimi movimenti su news BoJ/BoE. Non adatta a capital piccoli senza stop stretto.',
  },

  eurchf: {
    id: 'eurchf',
    symbol: 'EUR/CHF',
    label: 'Euro / Franco Svizzero',
    labelEn: 'Euro / Swiss Franc',
    groupId: 'ug_fx_minor',
    baseCurrency: 'EUR',
    quoteCurrency: 'CHF',
    typicalVolatilityPct: 0.3,
    typicalSpreadBps: 2.5,
    liquidityTier: 'tier2',
    activeSessions: ['london', 'overlap_ln_ny'],
    carryDirection: 'variable',
    carryNotes: 'EURIBOR vs SARON. Entrambe valute europee — differenziale contenuto. Movimenti bruschi su risk-off.',
    overnightLongPipsPerDay: -0.1,
    overnightShortPipsPerDay: -0.1,
    marginRequirementPct: 5.0,
    estimatedSlippageBps: 1.5,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: 'Bassa volatilità in condizioni normali. Rischio gap estremo su eventi geopolitici (flash crash Jan 2015).',
  },

  eurcad: {
    id: 'eurcad',
    symbol: 'EUR/CAD',
    label: 'Euro / Dollaro Canadese',
    labelEn: 'Euro / Canadian Dollar',
    groupId: 'ug_fx_minor',
    baseCurrency: 'EUR',
    quoteCurrency: 'CAD',
    typicalVolatilityPct: 0.6,
    typicalSpreadBps: 3.5,
    liquidityTier: 'tier2',
    activeSessions: ['london', 'new_york', 'overlap_ln_ny'],
    carryDirection: 'variable',
    carryNotes: 'EURIBOR vs BoC rate. Spread più ampio — meno liquida delle altre minor.',
    overnightLongPipsPerDay: -0.2,
    overnightShortPipsPerDay: -0.3,
    marginRequirementPct: 5.0,
    estimatedSlippageBps: 2.0,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: 'Spread relativamente ampio. Correlata indirettamente al petrolio tramite CAD.',
  },

  euraud: {
    id: 'euraud',
    symbol: 'EUR/AUD',
    label: 'Euro / Dollaro Australiano',
    labelEn: 'Euro / Australian Dollar',
    groupId: 'ug_fx_minor',
    baseCurrency: 'EUR',
    quoteCurrency: 'AUD',
    typicalVolatilityPct: 0.7,
    typicalSpreadBps: 3.5,
    liquidityTier: 'tier2',
    activeSessions: ['sydney', 'london', 'overlap_ln_ny'],
    carryDirection: 'variable',
    carryNotes: 'EURIBOR vs RBA cash rate. Dipende da ciclo tassi BCE/RBA.',
    overnightLongPipsPerDay: -0.3,
    overnightShortPipsPerDay: -0.2,
    marginRequirementPct: 5.0,
    estimatedSlippageBps: 2.0,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: 'Spread ampio. Attiva in Asia-Pacific per la componente AUD. Meno adatta a scalping.',
  },

  audjpy: {
    id: 'audjpy',
    symbol: 'AUD/JPY',
    label: 'Dollaro Australiano / Yen Giapponese',
    labelEn: 'Australian Dollar / Japanese Yen',
    groupId: 'ug_fx_minor',
    baseCurrency: 'AUD',
    quoteCurrency: 'JPY',
    typicalVolatilityPct: 0.75,
    typicalSpreadBps: 3.0,
    liquidityTier: 'tier2',
    activeSessions: ['sydney', 'tokyo', 'london'],
    carryDirection: 'positive_long',
    carryNotes: 'RBA cash rate − TONAR → carry molto positivo per long. Proxy di risk appetite globale — scende forte su risk-off.',
    overnightLongPipsPerDay: 1.5,
    overnightShortPipsPerDay: -2.0,
    marginRequirementPct: 5.0,
    estimatedSlippageBps: 2.0,
    minTradeSize: 1000,
    maxLeverageESMA: 20,
    futuresContracts: [],
    notes: 'Carry trade classico. Alta sensibilità a risk sentiment e prezzi commodity. Attiva in sessione Asia.',
  },

  // ── FOREX EXOTIC ───────────────────────────────────────────
  // Nessun exotic ha contratti CME FX retail liquidi.
  // futuresContracts: [] per tutti gli exotic.

  usdtry: {
    id: 'usdtry',
    symbol: 'USD/TRY',
    label: 'Dollaro USA / Lira Turca',
    labelEn: 'US Dollar / Turkish Lira',
    groupId: 'ug_fx_exotic',
    baseCurrency: 'USD',
    quoteCurrency: 'TRY',
    typicalVolatilityPct: 2.5,
    typicalSpreadBps: 50,
    liquidityTier: 'tier3',
    activeSessions: ['london', 'new_york'],
    carryDirection: 'negative_long',
    carryNotes: 'Long USD/TRY: SOFR − TCMB (tasso TCMB molto alto, >40%). Overnight short USD/TRY estremamente costoso. Solo operatività intraday consigliata.',
    overnightLongPipsPerDay: -15.0,
    overnightShortPipsPerDay: 8.0,
    marginRequirementPct: 10.0,
    estimatedSlippageBps: 25.0,
    minTradeSize: 1000,
    maxLeverageESMA: 10,
    futuresContracts: [],
    notes: 'Default per Forex Exotic. Spread ampio, overnight proibitivo per swing. Solo intraday.',
  },

  usdmxn: {
    id: 'usdmxn',
    symbol: 'USD/MXN',
    label: 'Dollaro USA / Peso Messicano',
    labelEn: 'US Dollar / Mexican Peso',
    groupId: 'ug_fx_exotic',
    baseCurrency: 'USD',
    quoteCurrency: 'MXN',
    typicalVolatilityPct: 1.8,
    typicalSpreadBps: 40,
    liquidityTier: 'tier3',
    activeSessions: ['new_york'],
    carryDirection: 'negative_long',
    carryNotes: 'Banxico mantiene tassi elevati (>10%) → overnight long USD/MXN molto costoso. Short USD/MXN (long MXN) genera carry positivo.',
    overnightLongPipsPerDay: -8.0,
    overnightShortPipsPerDay: 5.0,
    marginRequirementPct: 10.0,
    estimatedSlippageBps: 20.0,
    minTradeSize: 1000,
    maxLeverageESMA: 10,
    futuresContracts: [],
    notes: 'Più liquida di USD/TRY tra gli exotic. Mossa da politica Banxico, relazioni USA-Messico, prezzi petrolio.',
  },

  usdzar: {
    id: 'usdzar',
    symbol: 'USD/ZAR',
    label: 'Dollaro USA / Rand Sudafricano',
    labelEn: 'US Dollar / South African Rand',
    groupId: 'ug_fx_exotic',
    baseCurrency: 'USD',
    quoteCurrency: 'ZAR',
    typicalVolatilityPct: 2.0,
    typicalSpreadBps: 60,
    liquidityTier: 'tier3',
    activeSessions: ['london', 'new_york'],
    carryDirection: 'negative_long',
    carryNotes: 'SARB repo rate elevato → overnight long USD/ZAR costoso. Carry negativo per long.',
    overnightLongPipsPerDay: -10.0,
    overnightShortPipsPerDay: 6.0,
    marginRequirementPct: 10.0,
    estimatedSlippageBps: 30.0,
    minTradeSize: 1000,
    maxLeverageESMA: 10,
    futuresContracts: [],
    notes: 'Alta volatilità. Spread molto ampio. Correlata a prezzi oro e platinum. Rischio politico ZA.',
  },

  eurtry: {
    id: 'eurtry',
    symbol: 'EUR/TRY',
    label: 'Euro / Lira Turca',
    labelEn: 'Euro / Turkish Lira',
    groupId: 'ug_fx_exotic',
    baseCurrency: 'EUR',
    quoteCurrency: 'TRY',
    typicalVolatilityPct: 2.8,
    typicalSpreadBps: 60,
    liquidityTier: 'tier3',
    activeSessions: ['london'],
    carryDirection: 'negative_long',
    carryNotes: 'Simile a USD/TRY. Overnight estremamente costoso per long EUR/TRY. TCMB rate dominante.',
    overnightLongPipsPerDay: -18.0,
    overnightShortPipsPerDay: 10.0,
    marginRequirementPct: 10.0,
    estimatedSlippageBps: 30.0,
    minTradeSize: 1000,
    maxLeverageESMA: 10,
    futuresContracts: [],
    notes: 'Spread e overnight tra i più alti disponibili. Solo scalping con uscita intraday.',
  },

  usdsgd: {
    id: 'usdsgd',
    symbol: 'USD/SGD',
    label: 'Dollaro USA / Dollaro di Singapore',
    labelEn: 'US Dollar / Singapore Dollar',
    groupId: 'ug_fx_exotic',
    baseCurrency: 'USD',
    quoteCurrency: 'SGD',
    typicalVolatilityPct: 0.4,
    typicalSpreadBps: 25,
    liquidityTier: 'tier3',
    activeSessions: ['tokyo', 'london'],
    carryDirection: 'variable',
    carryNotes: 'MAS (Monetary Authority of Singapore) gestisce cambio vs basket — non tasso. Carry variabile e contenuto.',
    overnightLongPipsPerDay: 0.1,
    overnightShortPipsPerDay: -0.2,
    marginRequirementPct: 10.0,
    estimatedSlippageBps: 5.0,
    minTradeSize: 1000,
    maxLeverageESMA: 10,
    futuresContracts: [],
    notes: 'Meno volatile degli altri exotic. SGD gestita attivamente da MAS. Spread contenuto per un exotic.',
  },

  usdhkd: {
    id: 'usdhkd',
    symbol: 'USD/HKD',
    label: 'Dollaro USA / Dollaro di Hong Kong',
    labelEn: 'US Dollar / Hong Kong Dollar',
    groupId: 'ug_fx_exotic',
    baseCurrency: 'USD',
    quoteCurrency: 'HKD',
    typicalVolatilityPct: 0.05,
    typicalSpreadBps: 15,
    liquidityTier: 'tier2',
    activeSessions: ['tokyo', 'london', 'new_york'],
    carryDirection: 'variable',
    carryNotes: 'HKD ancorata a USD (currency board 7.75–7.85). Quasi nessun movimento. Carry quasi nullo.',
    overnightLongPipsPerDay: 0.0,
    overnightShortPipsPerDay: 0.0,
    marginRequirementPct: 10.0,
    estimatedSlippageBps: 2.0,
    minTradeSize: 1000,
    maxLeverageESMA: 10,
    futuresContracts: [],
    notes: 'Volatilità quasi nulla per il currency board. Usata per arbitraggio istituzionale, non per retail trading direzionale.',
  },
};

// ── Helper: underlying per gruppo ───────────────────────────
export function getUnderlyingsForGroup(groupId: UnderlyingGroupId): Underlying[] {
  return Object.values(UNDERLYINGS).filter(u => u.groupId === groupId);
}

// ── Helper: default underlying per gruppo FX ────────────────
export const FX_DEFAULT_UNDERLYING: Partial<Record<UnderlyingGroupId, UnderlyingId>> = {
  ug_fx_major:  'eurusd',
  ug_fx_minor:  'eurgbp',
  ug_fx_exotic: 'usdtry',
};

// ── Helper: underlying supporta futures ─────────────────────
// Usato dal frontend per abilitare/disabilitare il toggle CFD/Futures
export function hasFuturesContracts(underlyingId: UnderlyingId): boolean {
  return UNDERLYINGS[underlyingId].futuresContracts.length > 0;
}
