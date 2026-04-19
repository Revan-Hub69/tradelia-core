/**
 * Broker data model V2 — schema completo per scheda conto Tradelia.
 *
 * Principi:
 * - Account-centric (un broker ha 1+ account, ogni account ha dataset proprio)
 * - Entità legale = quella dove l'utente si iscrive tramite signupUrl (D6)
 * - Swap = solo markup broker, mai tasso lordo (principio Tradelia)
 * - Tracciabilità fonti: campi "morbidi" con {value, source, measuredAt}
 * - Additive: estende BrokerAccount esistente via campi opzionali
 */

import type { AssetId } from './assets';

// ─── Tracciabilità fonte dati ────────────────────────────────────────────

export type DataSource =
  | 'broker-official'      // sito ufficiale broker
  | 'mifid-rts28'          // report esecuzione MiFID II
  | 'mifid-rts27'          // report liquidità pre-trade MiFID II
  | 'myfxbook'             // dati community verificati
  | 'earnforex'            // review indipendente
  | 'regulator-db'         // registro regolatore (CySEC/FCA/ecc)
  | 'brokerchooser'        // editoriale
  | 'manual'               // inserito manualmente
  | 'estimate';            // stima interna, da validare

export type DataPoint<T> = {
  value: T;
  source: DataSource;
  sourceUrl?: string;
  /** Mese di rilevazione, formato 'YYYY-MM'. */
  measuredAt?: string;
};

// ─── Entità legale e compliance ──────────────────────────────────────────

export type RegulatorCode =
  | 'CySEC' | 'FCA' | 'BaFin' | 'CONSOB' | 'AMF' | 'CNMV'
  | 'ASIC' | 'FINMA' | 'FSA-Seychelles' | 'FSA-SVG' | 'FSCA'
  | 'CFTC-NFA' | 'MAS' | 'JFSA' | 'KNF';

export type BrokerEntity = {
  /** Nome legale dell'entità dove l'utente apre il conto (es. 'Tickmill Europe Ltd'). */
  legalName: string;
  jurisdictionCity: string;      // 'Limassol'
  jurisdictionCountry: string;   // 'Cyprus'
  regulator: RegulatorCode;
  licenseNumber: string;         // '278/15'
  /** URL pubblico di verifica sul registro del regolatore. */
  regulatorCheckUrl?: string;
  /** Importo protezione investitori (€). Es. CySEC ICF = 20000. */
  investorCompensationEur: number;
  /** Protezione saldo negativo (obbligo ESMA retail). */
  negativeBalanceProtection: boolean;
  /** Segregazione fondi cliente (account separati da operatività broker). */
  segregatedFunds: boolean;
  segregationBankName?: string;  // 'Barclays'
};

// ─── Gruppo / Company ────────────────────────────────────────────────────

export type BrokerCompany = {
  brandName: string;             // 'Tickmill'
  /** Holding/gruppo proprietario (se applicabile). */
  groupName?: string;
  foundedYear: number;
  publiclyListed: boolean;
  /** Borsa di quotazione (se listed). */
  listedOn?: string;             // 'LSE', 'ASX'
};

// ─── Soglie di trading per account ───────────────────────────────────────

export type AccountTrading = {
  minDepositEur: number;
  minLotSize: number;            // 0.01
  maxLotSize?: number;           // 60 (Tickmill Pro)
  minOrderNotionalEur?: number;  // es. €100 su azioni CFD
  maxLeverageRetail: number;     // 30 (ESMA majors)
  marginCallLevelPct: number;    // 100 = margin call
  stopOutLevelPct: number;       // 50 = chiusura forzata
};

// ─── Fees accessori per account ──────────────────────────────────────────

export type DepositMethodFee = {
  bankWireEur?: number;          // 0 = gratis
  cardPct?: number;              // 0.015 = 1.5%
  ewalletPct?: number;
};

export type WithdrawalMethodFee = DepositMethodFee & {
  /** Alcuni broker offrono N prelievi/mese gratis. */
  firstPerMonthFree?: boolean;
};

export type AccountFees = {
  /** Commissione minima per ordine (rara ma presente). */
  minCommissionPerOrderEur?: number;
  /** % applicata quando conto EUR opera su strumenti non-EUR. */
  fxConversionPct?: number;
  /** Fee inattività. */
  inactivityFeeEurPerMonth?: number;
  inactivityAfterMonths?: number;
  deposit: DepositMethodFee;
  withdrawal: WithdrawalMethodFee;
  /** Funding overnight CFD (% annuo su notional, diverso dallo swap forex €/lot). */
  cfdFundingAnnualPct?: {
    indices?: number;
    stocks?: number;
    crypto?: number;
  };
  /** Guaranteed Stop Loss (feature news trading). */
  gslAvailable: boolean;
  gslPremiumPct?: number;
  /** Giorno triple swap forex. */
  tripleSwapDay?: 'wednesday' | 'friday';
};

// ─── Feature account ─────────────────────────────────────────────────────

export type AccountFeatures = {
  swapFree: boolean;              // Islamic
  hedgingAllowed: boolean;
  scalpingAllowed: boolean;
  eaAllowed: boolean;
  copyTradingAvailable: boolean;
  demoAccountAvailable: boolean;
};

// ─── Policy esecuzione ───────────────────────────────────────────────────

export type ExecutionPolicies = {
  /** Restrizioni news trading (min prima/dopo news); undefined = allowed. */
  newsTradingRestrictionMin?: number;
  /** VPS disponibile. */
  vps?: {
    freeWithDepositEur?: number;
    freeWithVolumeLotsPerMonth?: number;
    paidCostEurPerMonth?: number;
  };
};

// ─── Qualità esecuzione (dati rilevati) ──────────────────────────────────

export type ExecutionType = 'ECN' | 'STP' | 'NDD' | 'DMA' | 'MM' | 'Hybrid';

export type ExecutionQualityV2 = {
  type: ExecutionType;
  serverLocations?: string[];     // ['LD4 Equinix', 'NY4 Equinix']
  avgExecutionMs?: DataPoint<number>;
  priceImprovementRate?: DataPoint<number>;   // 0.0 - 1.0
  avgSlippagePips?: DataPoint<number>;        // negativo = a sfavore
  rejectionRate?: DataPoint<number>;          // 0.0 - 1.0
  requotePolicy?: 'no-requote' | 'requote' | 'reject-on-slip';
  publishesExecutionStats: boolean;
  executionStatsUrl?: string;
};

// ─── Strumento (blocco 3: multi-asset) ───────────────────────────────────

export type InstrumentCost = {
  symbol: string;                 // 'EURUSD', 'XAUUSD', 'SPX500'
  assetClass: AssetId;
  /** Display label (es. 'EUR/USD', 'Oro'). */
  label: string;
  /** Spread medio in pip (forex) o punti (indici/commodity). */
  spreadAvg: number;
  /** Valore unit: quanto vale 1 pip/punto × 1 lot. Usato per conversione in €. */
  unitValuePerLotEur: number;
  /** Commissione round-turn €/lot. */
  commissionEurPerLotRoundTrip: number;
  /** Swap markup broker €/lot/notte (negativo long o short). */
  swapMarkupPerLotLongEur?: number;
  swapMarkupPerLotShortEur?: number;
  /** Data rilevazione dati spread. */
  lastMeasuredAt?: string;
};

// ─── Tipo unione finale (aggiunte additive al BrokerAccount esistente) ───

export type BrokerAccountV2Additions = {
  entity?: BrokerEntity;
  company?: BrokerCompany;
  accountTrading?: AccountTrading;
  accountFees?: AccountFees;
  features?: AccountFeatures;
  execution?: ExecutionQualityV2;
  executionPolicies?: ExecutionPolicies;
  /** Array strumenti con dati misurati (blocco 3). */
  instruments?: InstrumentCost[];
};
