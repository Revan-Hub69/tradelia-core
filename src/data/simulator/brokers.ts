// ============================================================
// BROKERS — schema completo
// Struttura: Broker → AccountType → InstrumentOffer
//
// Flusso matcher:
//   SimulatorState (ugId, horizonId, styleId, accountSize,
//                   positionSize, leverageProfile)
//       ↓
//   filterBrokers() → InstrumentOffer[] compatibili
//       ↓
//   scoreBroker()   → RankedResult[] ordinati per costo totale
// ============================================================

import type { UnderlyingGroupId }  from './underlying-groups';
import type { InstrumentTypeId }   from './instruments';
import type { HorizonId }          from './horizons';
import type { AccountSizeId }      from './account-sizes';
import type { LeverageProfileId }  from './leverage-profiles';

// ============================================================
// 1. BROKER — entità padre
// ============================================================

export type BrokerId =
  | 'ic_markets'
  | 'pepperstone'
  | 'interactive_brokers'
  | 'mexc'
  | 'kraken'
  | 'fineco'
  | 'directa';
  // ↑ aggiungere nuovi broker qui + in BROKERS record sotto

export type RegulationZone =
  | 'EU'       // CySEC, BaFin, CONSOB, AMF, ecc.
  | 'UK'       // FCA
  | 'AU'       // ASIC
  | 'offshore' // Seychelles, Vanuatu, ecc.
  | 'US'       // CFTC/NFA
  | 'global';  // exchange globale (Kraken, MEXC)

export type PlatformType =
  | 'mt4'
  | 'mt5'
  | 'ctrader'
  | 'proprietary' // piattaforma proprietaria web/app
  | 'tws'         // Interactive Brokers Trader Workstation
  | 'web'         // solo web
  | 'api';        // accesso API puro (exchange crypto)

export type Broker = {
  id:                 BrokerId;
  name:               string;
  logoSlug:           string;       // nome per Simple Icons CDN: simpleicons.org/{slug}
  website:            string;
  regulationZones:    RegulationZone[];
  accessibleFromIT:   boolean;      // false = bloccato per utenti IT (es. Binance futures)
  minDepositEUR:      number;       // deposito minimo stimato in EUR
  platformTypes:      PlatformType[];
  notes:              string;       // note operative rilevanti per utente IT
};

// ============================================================
// 2. ACCOUNT TYPE — entità figlia di Broker
// Un broker ha N conti con strutture costo diverse
// ============================================================

export type AccountTypeId = string;
// Convenzione: '{brokerId}_{slug}' — es. 'ic_markets_raw', 'fineco_standard'

export type AccountType = {
  id:                        AccountTypeId;
  brokerId:                  BrokerId;
  label:                     string;         // 'Raw Spread', 'Standard', 'Pro'...
  labelEn:                   string;
  accountCurrencies:         ('EUR' | 'USD' | 'GBP')[]; // valute conto disponibili
  minDepositEUR:             number;         // soglia minima per aprire questo conto
  compatibleAccountSizes:    AccountSizeId[];           // taglie conto realistiche
  compatibleLeverageProfiles: LeverageProfileId[];      // leva effettivamente disponibile
  notes:                     string;
};

// ============================================================
// 3. INSTRUMENT OFFER — cuore dei costi
// Ogni riga = uno strumento offerto da un AccountType specifico
// su uno o più UG, con tutti i parametri di costo reali
// ============================================================

export type InstrumentOffer = {

  // — Identità —————————————————————————————————————————————
  accountTypeId:    AccountTypeId;
  instrumentTypeId: InstrumentTypeId;
  ugIds:            UnderlyingGroupId[];  // UG coperti da questa offer

  // — Compatibilità operativa ———————————————————————————————
  compatibleHorizons:  HorizonId[];       // orizzonti supportati realisticamente
  minPositionEUR:      number;            // nozionale minimo per operare (filtro xs/sm)
  maxLeverageOffered:  number | null;     // leva max reale offerta (può essere < ESMA cap)

  // — SPREAD ————————————————————————————————————————————————
  // In bps (1 bps = 0.01%) sul nozionale
  spreadAvgBps:   number;       // media in condizioni normali
  spreadMinBps:   number;       // minimo in ore liquide
  spreadMaxBps:   number;       // massimo in news/alta volatilità
  spreadNotes:    string;

  // — COMMISSION ————————————————————————————————————————————
  commissionPerLotEUR:      number | null;  // EUR per lotto std 100k (CFD ECN)
  commissionPerContractEUR: number | null;  // EUR per contratto RT (futures)
  makerFeePct:              number | null;  // % sul nozionale (crypto maker)
  takerFeePct:              number | null;  // % sul nozionale (crypto taker)
  commissionNotes:          string;

  // — OVERNIGHT / FINANCING ————————————————————————————————
  // % annuo applicata sul nozionale della posizione
  overnightLongAnnualPct:   number | null;  // costo detenzione long overnight
  overnightShortAnnualPct:  number | null;  // costo detenzione short overnight
  overnightNotes:           string;         // es. 'SOFR + 2.5% su nozionale USD'

  // — FUNDING RATE (solo crypto perp) ———————————————————————
  fundingRateTypicalPct8h:  number | null;  // % per 8h in mercato neutro
  fundingRateMaxPct8h:      number | null;  // % per 8h in trend estremo
  fundingNotes:             string;

  // — REBASING / DECAY (ETF leva, cert leva fissa) ——————————
  rebasingLeverageMult:     number | null;  // moltiplicatore reale del prodotto (2, 3, -2...)
  rebasingNotes:            string;         // es. 'decay ~0.3%/giorno con vol 1.5%'

  // — ROLL COST (futures std/micro) —————————————————————————
  rollSpreadBps:            number | null;  // costo medio roll in bps (bid/ask 2x)
  rollFrequencyDays:        number | null;  // giorni tra roll (90 = trimestrale)
  rollNotes:                string;

  // — KO / LIQUIDATION RISK ————————————————————————————————
  koDistancePctTypical:     number | null;  // distanza % tipica da barrier/liquidazione
  koNotes:                  string;         // es. 'KO immediato al tocco — perdita totale premio'

  // — FX CONVERSION ————————————————————————————————————————
  // Applicato quando il sottostante è USD e il conto è EUR
  fxConversionBps:          number | null;  // costo conversione EUR↔USD in bps per trade

  // — TER ANNUO (ETF/ETC/ETP) ——————————————————————————————
  // Override rispetto al default in instruments.ts se il prodotto
  // specifico offerto dal broker ha TER diverso dalla media
  terAnnualPct:             number | null;

  // — DEPOSIT / WITHDRAWAL (solo crypto exchange) ——————————
  depositFiatPct:           number | null;  // % su conversione EUR→crypto al deposito
  withdrawalFeeUSD:         number | null;  // USD tipici per withdrawal on-chain (BTC mainnet)
  withdrawalFeeUSDCheap:    number | null;  // USD su rete cheap (Lightning, USDC-Polygon...)

  // — SLIPPAGE TIPICO ——————————————————————————————————————
  slippageAvgBps:           number | null;  // slippage medio in condizioni normali
  slippageNewsBps:          number | null;  // slippage attorno a eventi macro/news

  // — NOTE GENERALI —————————————————————————————————————————
  notes:                    string;
};

// ============================================================
// 4. RECORDS PRINCIPALI — da popolare broker per broker
// ============================================================

export const BROKERS: Record<BrokerId, Broker> = {} as Record<BrokerId, Broker>;
// TODO: popolare

export const ACCOUNT_TYPES: AccountType[] = [];
// TODO: popolare

export const INSTRUMENT_OFFERS: InstrumentOffer[] = [];
// TODO: popolare

// ============================================================
// 5. HELPER TYPES — output del matcher (da usare in ResultView)
// ============================================================

export type RankedResult = {
  rank:             number;
  broker:           Broker;
  accountType:      AccountType;
  offer:            InstrumentOffer;
  // Costi calcolati sul profilo utente specifico
  totalCostBps:     number;   // costo totale stimato in bps per sessione
  costBreakdown: {
    spreadBps:      number;
    commissionBps:  number;
    overnightBps:   number;
    fundingBps:     number;
    rebasingBps:    number;
    fxBps:          number;
    otherBps:       number;
  };
  warnings:         string[]; // es. 'KO risk elevato', 'Funding rate variabile'
  compatibilityFlags: {
    leverageOk:     boolean;
    accountSizeOk:  boolean;
    positionSizeOk: boolean;
    horizonOk:      boolean;
    accessibleIT:   boolean;
  };
};
