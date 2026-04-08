// ============================================================
// BROKERS — dati reali per asset class
// Struttura: Broker → AccountType → InstrumentOffer
//
// Flusso matcher:
//   SimulatorState (ugId, horizonId, styleId, accountSize,
//                   positionSize, leverageProfile)
//       ↓
//   filterBrokers() → InstrumentOffer[] compatibili
//       ↓
//   scoreBroker()   → RankedResult[] ordinati per costo totale
//
// STATO POPOLAMENTO:
//   ✅ FOREX — completo
//   ⏳ INDICI / COMMODITIES — TODO
//   ⏳ FUTURES CME/EUREX — TODO
//   ⏳ AZIONI — TODO
//   ⏳ ETF/CERT — TODO
//   ⏳ CRYPTO — TODO
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
  // ── FOREX / CFD ECN ──────────────────────────────────────
  | 'ic_markets'
  | 'pepperstone'
  | 'tickmill'
  | 'admirals'
  | 'xm'
  // ── SPOT FX OTC / ECN NDD ────────────────────────────────
  | 'interactive_brokers'
  | 'dukascopy'
  | 'saxo_bank'
  | 'swissquote'
  // ── FUTURES + MULTI-ASSET ─────────────────────────────────
  | 'exante'
  | 'mexem'
  | 'fineco'
  | 'directa'
  | 'lynx'
  // ── CERTIFICATI SEDEX ────────────────────────────────────
  | 'ig_markets'
  | 'iwbank'
  | 'webank'
  // ── BROKER IT AZIONI / ETF ───────────────────────────────
  | 'degiro'
  | 'scalable_capital'
  | 'flatex'
  | 'trade_republic'
  // ── CRYPTO EXCHANGE ──────────────────────────────────────
  | 'mexc'
  | 'kraken'
  | 'bybit'
  | 'bitget'
  | 'okx'
  | 'deribit';

export type RegulationZone =
  | 'EU'       // CySEC, BaFin, CONSOB, AMF, ecc.
  | 'UK'       // FCA
  | 'AU'       // ASIC
  | 'CH'       // FINMA
  | 'CY'       // CySEC (Cipro)
  | 'offshore' // Seychelles, Vanuatu, ecc.
  | 'US'       // CFTC/NFA
  | 'global';  // exchange globale (Kraken, MEXC)

export type PlatformType =
  | 'mt4'
  | 'mt5'
  | 'ctrader'
  | 'proprietary'
  | 'tws'         // Interactive Brokers Trader Workstation
  | 'web'
  | 'api';

export type Broker = {
  id:               BrokerId;
  name:             string;
  logoSlug:         string;
  website:          string;
  regulationZones:  RegulationZone[];
  accessibleFromIT: boolean;
  minDepositEUR:    number;
  platformTypes:    PlatformType[];
  notes:            string;
};

export const BROKERS: Record<BrokerId, Broker> = {

  // ── FOREX / CFD ECN ──────────────────────────────────────

  ic_markets: {
    id: 'ic_markets',
    name: 'IC Markets EU',
    logoSlug: 'icmarkets',
    website: 'https://www.icmarkets.eu',
    regulationZones: ['EU', 'CY', 'AU'],
    accessibleFromIT: true,
    minDepositEUR: 200,
    platformTypes: ['mt4', 'mt5', 'ctrader'],
    notes: 'ECN di riferimento per scalping FX. Raw Spread: spread ~0.1 pip EUR/USD + $7 RT. Entità EU (CySEC) pienamente accessibile da IT. Server Equinix NY4.',
  },

  pepperstone: {
    id: 'pepperstone',
    name: 'Pepperstone EU',
    logoSlug: 'pepperstone',
    website: 'https://pepperstone.com/it',
    regulationZones: ['EU', 'CY', 'UK', 'AU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['mt4', 'mt5', 'ctrader'],
    notes: 'ECN/STP competitivo. Razor: spread 0.1 pip EUR/USD + $7 RT (MT4/5) o $6 RT (cTrader). Nessun deposito minimo. CySEC EU.',
  },

  tickmill: {
    id: 'tickmill',
    name: 'Tickmill EU',
    logoSlug: 'tickmill',
    website: 'https://www.tickmill.com/it',
    regulationZones: ['EU', 'CY', 'UK'],
    accessibleFromIT: true,
    minDepositEUR: 100,
    platformTypes: ['mt4', 'mt5'],
    notes: 'Raw: spread 0.1 pip EUR/USD + $6 RT. Commissioni tra le più basse del settore ECN. BestInClass Commissions & Fees 2026 (ForexBrokers.com).',
  },

  admirals: {
    id: 'admirals',
    name: 'Admirals (Admiral Markets)',
    logoSlug: 'admiralmarkets',
    website: 'https://admirals.com/it',
    regulationZones: ['EU', 'CY', 'UK', 'AU'],
    accessibleFromIT: true,
    minDepositEUR: 100,
    platformTypes: ['mt4', 'mt5'],
    notes: 'Zero.MT5: spread 0.0 pip + $6 RT. Overnight swap elevato su FX (-8.42 pip EUR/USD). Currency conversion 0.3% su asset non in valuta conto.',
  },

  xm: {
    id: 'xm',
    name: 'XM Global',
    logoSlug: 'xm',
    website: 'https://www.xm.com/it',
    regulationZones: ['EU', 'CY'],
    accessibleFromIT: true,
    minDepositEUR: 5,
    platformTypes: ['mt4', 'mt5'],
    notes: 'Ultra Low: spread da 0.6 pip no commission. Zero: spread 0.0 pip + commission. Broker retail/DD. Buono per account piccoli.',
  },

  // ── SPOT FX OTC / ECN NDD ────────────────────────────────

  interactive_brokers: {
    id: 'interactive_brokers',
    name: 'Interactive Brokers',
    logoSlug: 'interactivebrokers',
    website: 'https://www.interactivebrokers.co.uk/it',
    regulationZones: ['EU', 'UK', 'US'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['tws', 'web', 'api'],
    notes: 'ECN NDD puro su Spot FX interbancario (17 LP). Commission 0.08–0.20 bps × nozionale, min $2/ordine. Spread 0.1 pip su major. Multi-asset: futures CME/Eurex, azioni, ETF. Migliore per account professionali.',
  },

  dukascopy: {
    id: 'dukascopy',
    name: 'Dukascopy Bank',
    logoSlug: 'dukascopy',
    website: 'https://www.dukascopy.com',
    regulationZones: ['CH', 'EU'],
    accessibleFromIT: true,
    minDepositEUR: 100,
    platformTypes: ['proprietary', 'api'],
    notes: 'ECN NDD puro SWFX (Swiss FX Marketplace). Spread 0.1 pip EUR/USD. Commission $7/lot RT (JForex), scende a $1/lot con volume. Banca svizzera FINMA. Ideale per spot FX puro.',
  },

  saxo_bank: {
    id: 'saxo_bank',
    name: 'Saxo Bank',
    logoSlug: 'saxo',
    website: 'https://www.home.saxo/it-it',
    regulationZones: ['EU', 'UK'],
    accessibleFromIT: true,
    minDepositEUR: 2000,
    platformTypes: ['proprietary', 'api'],
    notes: 'Spot FX: spread raw ECN + markup +/-0.75% tom/next (Classic) / 0.60% (Platinum) / 0.50% (VIP). Multi-asset completo: futures, certificati, ETF. Soglia accesso più alta.',
  },

  swissquote: {
    id: 'swissquote',
    name: 'Swissquote',
    logoSlug: 'swissquote',
    website: 'https://www.swissquote.com/it',
    regulationZones: ['CH', 'EU'],
    accessibleFromIT: true,
    minDepositEUR: 1000,
    platformTypes: ['mt4', 'mt5', 'proprietary'],
    notes: 'ECN: spread 0.3 pip EUR/USD + $2.50/lot. Standard: spread 1.7 pip no commission. Banca FINMA. Inactivity fee $10/mese. Ottimo per multi-asset IT.',
  },

  // ── FUTURES + MULTI-ASSET ─────────────────────────────────

  exante: {
    id: 'exante',
    name: 'EXANTE',
    logoSlug: 'exante',
    website: 'https://exante.eu/it',
    regulationZones: ['EU', 'CY'],
    accessibleFromIT: true,
    minDepositEUR: 10000,
    platformTypes: ['proprietary', 'api'],
    notes: 'DMA broker multi-asset. Futures: $1.5/contratto. Forex: 2 bps commission + spread. 600k+ strumenti. Overnight variabile su FX/short. Soglia minima alta. API Python disponibile.',
  },

  mexem: {
    id: 'mexem',
    name: 'MEXEM',
    logoSlug: 'mexem',
    website: 'https://www.mexem.com/it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['tws', 'web', 'api'],
    notes: 'Reseller EU autorizzato di Interactive Brokers. Stessa struttura commission IB. Ideale per trader IT che vogliono accesso IB con supporto in italiano.',
  },

  fineco: {
    id: 'fineco',
    name: 'FinecoBank',
    logoSlug: 'fineco',
    website: 'https://finecobank.com',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['proprietary', 'web'],
    notes: 'Broker IT nativo (Gruppo UniCredit). Turbo KO + Leva Fissa SeDeX zero commission. Futures Eurex + CME. Commissioni azionarie più alte vs IB. Integrazione bancaria piena.',
  },

  directa: {
    id: 'directa',
    name: 'Directa SIM',
    logoSlug: 'directa',
    website: 'https://www.directa.it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['proprietary', 'web', 'api'],
    notes: 'SIM italiana. Specializzata mercato IT (Borsa Italiana, SeDeX, ETFplus). Futures Eurex + CME. API Darwin disponibile.',
  },

  lynx: {
    id: 'lynx',
    name: 'LYNX Broker',
    logoSlug: 'lynx',
    website: 'https://www.lynxbroker.it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 3000,
    platformTypes: ['tws', 'web', 'api'],
    notes: 'Reseller EU di Interactive Brokers (come MEXEM). Stessa struttura commission IB. Supporto in italiano. Buono per futures e azioni multi-mercato.',
  },

  // ── CERTIFICATI SEDEX / TURBO OTC ─────────────────────────

  ig_markets: {
    id: 'ig_markets',
    name: 'IG Markets',
    logoSlug: 'ig',
    website: 'https://www.ig.com/it',
    regulationZones: ['EU', 'UK'],
    accessibleFromIT: true,
    minDepositEUR: 250,
    platformTypes: ['proprietary', 'web', 'api'],
    notes: 'Turbo24: prodotti KO OTC propri (non SeDeX), quotazione 24h. CFD su indici/FX/commodity. Spread incluso nel prezzo emittente. FCA + entità EU.',
  },

  iwbank: {
    id: 'iwbank',
    name: 'IWBank',
    logoSlug: 'iwbank',
    website: 'https://www.iwbank.it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['proprietary', 'web'],
    notes: 'Banca IT (Gruppo UBI/BPER). Accesso SeDeX per Turbo KO e Mini Future. Commissioni standard IT.',
  },

  webank: {
    id: 'webank',
    name: 'Webank',
    logoSlug: 'webank',
    website: 'https://www.webank.it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web'],
    notes: 'Banca IT (Gruppo BPM). Accesso SeDeX. Commissioni simili IWBank.',
  },

  // ── BROKER IT AZIONI / ETF ───────────────────────────────

  degiro: {
    id: 'degiro',
    name: 'DEGIRO',
    logoSlug: 'degiro',
    website: 'https://www.degiro.it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'ETF gratuiti selezionati. Azioni EU/US low-cost. No futures, no CFD. Ottimo per buy & hold e ETF trading.',
  },

  scalable_capital: {
    id: 'scalable_capital',
    name: 'Scalable Capital',
    logoSlug: 'scalablecapital',
    website: 'https://it.scalable.capital',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web'],
    notes: 'ETF gratuiti su piano broker (€2.99/mese). No futures, no CFD. Buono per investimento passivo non trading attivo.',
  },

  flatex: {
    id: 'flatex',
    name: 'Flatex',
    logoSlug: 'flatex',
    website: 'https://www.flatex.it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web'],
    notes: 'Broker tedesco BaFin. ETF e azioni low-cost su mercati EU. Commissioni fisse. No CFD/futures.',
  },

  trade_republic: {
    id: 'trade_republic',
    name: 'Trade Republic',
    logoSlug: 'traderepublic',
    website: 'https://traderepublic.com/it-it',
    regulationZones: ['EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web'],
    notes: '€1/trade flat. ETF, azioni, crypto. No futures. Adatto retail, non per trading attivo ad alta frequenza.',
  },

  // ── CRYPTO EXCHANGE ──────────────────────────────────────

  mexc: {
    id: 'mexc',
    name: 'MEXC',
    logoSlug: 'mexc',
    website: 'https://www.mexc.com',
    regulationZones: ['global'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'Perp maker fee 0%. Taker 0.01%. Accessibile da IT. Ampia copertura altcoin. Exchange non regolamentato EU — rischio controparte da considerare.',
  },

  kraken: {
    id: 'kraken',
    name: 'Kraken Pro',
    logoSlug: 'kraken',
    website: 'https://pro.kraken.com',
    regulationZones: ['global', 'EU'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'Futures datati BTC/ETH accessibili da IT. Maker 0.02% / Taker 0.05%. Regolamentato in più giurisdizioni. Ottimo per crypto futures datati.',
  },

  bybit: {
    id: 'bybit',
    name: 'Bybit',
    logoSlug: 'bybit',
    website: 'https://www.bybit.com',
    regulationZones: ['global'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'Perp + spot. Maker 0.02% / Taker 0.055%. Accessibile da IT. Volume alto su BTC/ETH perp.',
  },

  bitget: {
    id: 'bitget',
    name: 'Bitget',
    logoSlug: 'bitget',
    website: 'https://www.bitget.com',
    regulationZones: ['global'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'Maker fee bassa su futures perp. Accessibile da IT. Buona liquidità su major crypto.',
  },

  okx: {
    id: 'okx',
    name: 'OKX',
    logoSlug: 'okx',
    website: 'https://www.okx.com',
    regulationZones: ['global'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'Exchange tier-1. Maker 0.02% / Taker 0.05%. Perp, futures datati, spot, options. Accessibile da IT.',
  },

  deribit: {
    id: 'deribit',
    name: 'Deribit',
    logoSlug: 'deribit',
    website: 'https://www.deribit.com',
    regulationZones: ['global'],
    accessibleFromIT: true,
    minDepositEUR: 0,
    platformTypes: ['web', 'api'],
    notes: 'Dominante per options BTC/ETH. Futures datati. Maker -0.01% (rebate) / Taker 0.05%. Accessibile da IT. Solo crypto.',
  },
};

// ============================================================
// 2. ACCOUNT TYPE
// ============================================================

export type AccountTypeId = string;

export type AccountType = {
  id:                         AccountTypeId;
  brokerId:                   BrokerId;
  label:                      string;
  labelEn:                    string;
  accountCurrencies:          ('EUR' | 'USD' | 'GBP')[];
  minDepositEUR:              number;
  compatibleAccountSizes:     AccountSizeId[];
  compatibleLeverageProfiles: LeverageProfileId[];
  notes:                      string;
};

export const ACCOUNT_TYPES: AccountType[] = [

  // ── IC MARKETS ───────────────────────────────────────────
  {
    id: 'ic_markets_raw',
    brokerId: 'ic_markets',
    label: 'Raw Spread',
    labelEn: 'Raw Spread',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 200,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'MT4/5 + cTrader. Commission €6.50 RT / $7 RT per lotto std. Spread medio EUR/USD 0.1 pip.',
  },
  {
    id: 'ic_markets_standard',
    brokerId: 'ic_markets',
    label: 'Standard',
    labelEn: 'Standard',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 200,
    compatibleAccountSizes: ['xs', 'sm', 'md'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'No commission. Spread markup +0.8 pip su raw. EUR/USD avg ~0.9 pip.',
  },

  // ── PEPPERSTONE ──────────────────────────────────────────
  {
    id: 'pepperstone_razor_mt',
    brokerId: 'pepperstone',
    label: 'Razor (MT4/MT5)',
    labelEn: 'Razor MT4/5',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Commission $3.50/lotto/lato = $7 RT. Spread EUR/USD avg 0.1 pip.',
  },
  {
    id: 'pepperstone_razor_ct',
    brokerId: 'pepperstone',
    label: 'Razor (cTrader)',
    labelEn: 'Razor cTrader',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Commission $3/lotto/lato = $6 RT su cTrader. Spread EUR/USD avg 0.1 pip.',
  },
  {
    id: 'pepperstone_standard',
    brokerId: 'pepperstone',
    label: 'Standard',
    labelEn: 'Standard',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['xs', 'sm', 'md'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'No commission. Spread EUR/USD avg 1.1 pip.',
  },

  // ── TICKMILL ─────────────────────────────────────────────
  {
    id: 'tickmill_raw',
    brokerId: 'tickmill',
    label: 'Raw',
    labelEn: 'Raw',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 100,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Commission $3/lato = $6 RT. Spread EUR/USD avg 0.1 pip. All-in cost ~0.70 pip equiv. Best-in-class commissioni 2026.',
  },
  {
    id: 'tickmill_classic',
    brokerId: 'tickmill',
    label: 'Classic',
    labelEn: 'Classic',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 100,
    compatibleAccountSizes: ['xs', 'sm'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'No commission. Spread EUR/USD avg 1.6–1.7 pip.',
  },

  // ── ADMIRALS ─────────────────────────────────────────────
  {
    id: 'admirals_zero',
    brokerId: 'admirals',
    label: 'Zero.MT5',
    labelEn: 'Zero',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 100,
    compatibleAccountSizes: ['sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Commission $3/lotto/lato = $6 RT. Spread 0.0 pip. Overnight swap elevato: -8.42 pip EUR/USD long.',
  },

  // ── XM ───────────────────────────────────────────────────
  {
    id: 'xm_ultra_low',
    brokerId: 'xm',
    label: 'Ultra Low',
    labelEn: 'Ultra Low',
    accountCurrencies: ['EUR', 'USD'],
    minDepositEUR: 5,
    compatibleAccountSizes: ['xs', 'sm', 'md'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'No commission. Spread EUR/USD da 0.6 pip. Dealing Desk. Buono per retail piccolo.',
  },
  {
    id: 'xm_zero',
    brokerId: 'xm',
    label: 'XM Zero',
    labelEn: 'Zero',
    accountCurrencies: ['EUR', 'USD'],
    minDepositEUR: 5,
    compatibleAccountSizes: ['xs', 'sm', 'md'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'Spread 0 pip + commission (da verificare su sito). Dealing Desk.',
  },

  // ── INTERACTIVE BROKERS ──────────────────────────────────
  {
    id: 'ib_tiered',
    brokerId: 'interactive_brokers',
    label: 'Tiered (IBRK Pro)',
    labelEn: 'Tiered',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Commission 0.08–0.20 bps × nozionale, min $2/ordine. Pass-through spread interbancario raw. 17 LP. Tier basato su volume mensile.',
  },

  // ── DUKASCOPY ────────────────────────────────────────────
  {
    id: 'dukascopy_jforex',
    brokerId: 'dukascopy',
    label: 'JForex ECN',
    labelEn: 'JForex ECN',
    accountCurrencies: ['EUR', 'USD', 'CHF'],
    minDepositEUR: 100,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Commission $7/lot RT base, scende a $1 con volume. Spread 0.1 pip EUR/USD. SWFX book interbancario trasparente.',
  },

  // ── SAXO BANK ────────────────────────────────────────────
  {
    id: 'saxo_classic',
    brokerId: 'saxo_bank',
    label: 'Classic',
    labelEn: 'Classic',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 2000,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Markup tom/next +/-0.75% annuo. Multi-asset completo. Spread FX variabile ECN-like.',
  },

  // ── SWISSQUOTE ───────────────────────────────────────────
  {
    id: 'swissquote_ecn',
    brokerId: 'swissquote',
    label: 'ECN',
    labelEn: 'ECN',
    accountCurrencies: ['EUR', 'USD', 'CHF'],
    minDepositEUR: 1000,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Spread avg 0.3 pip EUR/USD + $2.50/lot commission. Banca FINMA. Inactivity $10/mese.',
  },

  // ── EXANTE ───────────────────────────────────────────────
  {
    id: 'exante_universal',
    brokerId: 'exante',
    label: 'Universal Account',
    labelEn: 'Universal',
    accountCurrencies: ['EUR', 'USD', 'GBP'],
    minDepositEUR: 10000,
    compatibleAccountSizes: ['md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'DMA. Forex: 2 bps commission + spread. Futures: $1.5/contratto. 600k+ strumenti. Soglia alta.',
  },

  // ── MEXEM ────────────────────────────────────────────────
  {
    id: 'mexem_standard',
    brokerId: 'mexem',
    label: 'Standard (IBKR reseller)',
    labelEn: 'Standard',
    accountCurrencies: ['EUR', 'USD'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['sm', 'md', 'lg', 'xl'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Stessa struttura commission IBKR. Supporto IT. Futures CME/Eurex accessibili.',
  },

  // ── FINECO ───────────────────────────────────────────────
  {
    id: 'fineco_trading',
    brokerId: 'fineco',
    label: 'Conto Trading',
    labelEn: 'Trading Account',
    accountCurrencies: ['EUR'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['xs', 'sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'Turbo KO + Leva Fissa: zero commission su SeDeX. Futures: commissioni standard. CFD forex disponibile ma costi più alti vs ECN puro.',
  },

  // ── DIRECTA ──────────────────────────────────────────────
  {
    id: 'directa_trading',
    brokerId: 'directa',
    label: 'Conto Trading',
    labelEn: 'Trading Account',
    accountCurrencies: ['EUR'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['xs', 'sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'SIM IT. Futures Eurex/CME + SeDeX. API Darwin. Buona per trading algoritmico IT.',
  },

  // ── IG MARKETS ───────────────────────────────────────────
  {
    id: 'ig_standard',
    brokerId: 'ig_markets',
    label: 'Standard (Turbo24 + CFD)',
    labelEn: 'Standard',
    accountCurrencies: ['EUR', 'GBP'],
    minDepositEUR: 250,
    compatibleAccountSizes: ['xs', 'sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium'],
    notes: 'Turbo24 OTC su FX/indici/commodity. CFD su crypto max 2:1 ESMA. Spread incluso nel prodotto.',
  },

  // ── CRYPTO EXCHANGES ─────────────────────────────────────
  {
    id: 'mexc_futures',
    brokerId: 'mexc',
    label: 'Futures Account',
    labelEn: 'Futures',
    accountCurrencies: ['USD'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['xs', 'sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Maker fee 0% su perp. Taker 0.01%. Funding rate ogni 8h variabile.',
  },
  {
    id: 'kraken_futures',
    brokerId: 'kraken',
    label: 'Kraken Pro Futures',
    labelEn: 'Futures',
    accountCurrencies: ['USD', 'EUR'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['xs', 'sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Futures datati BTC/ETH. Maker 0.02% / Taker 0.05%.',
  },
  {
    id: 'bybit_unified',
    brokerId: 'bybit',
    label: 'Unified Account',
    labelEn: 'Unified',
    accountCurrencies: ['USD'],
    minDepositEUR: 0,
    compatibleAccountSizes: ['xs', 'sm', 'md', 'lg'],
    compatibleLeverageProfiles: ['low', 'medium', 'high'],
    notes: 'Perp + spot unificati. Maker 0.02% / Taker 0.055%.',
  },
];

// ============================================================
// 3. INSTRUMENT OFFERS — FOREX (completo)
// Nota spread: 1 pip EUR/USD = 10 bps sul nozionale 100k
// Nota commission: $7 RT su 100k = 7 bps
// ============================================================

export type InstrumentOffer = {
  accountTypeId:            AccountTypeId;
  instrumentTypeId:         InstrumentTypeId;
  ugIds:                    UnderlyingGroupId[];
  compatibleHorizons:       HorizonId[];
  minPositionEUR:           number;
  maxLeverageOffered:       number | null;
  spreadAvgBps:             number;
  spreadMinBps:             number;
  spreadMaxBps:             number;
  spreadNotes:              string;
  commissionPerLotEUR:      number | null;
  commissionPerContractEUR: number | null;
  makerFeePct:              number | null;
  takerFeePct:              number | null;
  commissionNotes:          string;
  overnightLongAnnualPct:   number | null;
  overnightShortAnnualPct:  number | null;
  overnightNotes:           string;
  fundingRateTypicalPct8h:  number | null;
  fundingRateMaxPct8h:      number | null;
  fundingNotes:             string;
  rebasingLeverageMult:     number | null;
  rebasingNotes:            string;
  rollSpreadBps:            number | null;
  rollFrequencyDays:        number | null;
  rollNotes:                string;
  koDistancePctTypical:     number | null;
  koNotes:                  string;
  fxConversionBps:          number | null;
  terAnnualPct:             number | null;
  depositFiatPct:           number | null;
  withdrawalFeeUSD:         number | null;
  withdrawalFeeUSDCheap:    number | null;
  slippageAvgBps:           number | null;
  slippageNewsBps:          number | null;
  notes:                    string;
};

export const INSTRUMENT_OFFERS: InstrumentOffer[] = [

  // ===========================================================
  // ██████  FOREX — CFD ECN
  // ===========================================================

  // ── IC Markets Raw — cfd_ecn — FX major/minor/exotic ──────
  {
    accountTypeId: 'ic_markets_raw',
    instrumentTypeId: 'cfd_ecn',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    // EUR/USD avg 0.1 pip = 1 bps. Min 0 pip (0 bps), max 3 pip news (30 bps)
    spreadAvgBps: 1,
    spreadMinBps: 0,
    spreadMaxBps: 30,
    spreadNotes: 'EUR/USD avg 0.1 pip. Si allarga su news NFP/FOMC fino a 3+ pip.',
    // $7 RT = €6.50 RT per lotto 100k. In bps: 6.50/100k = 6.5 bps
    commissionPerLotEUR: 6.50,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '€6.50 RT per lotto std (100k). $0.07 RT per micro lotto.',
    // SOFR (4.3% 2025) + markup broker ~2.5% = ~6.8% long annuo su USD nozionale
    overnightLongAnnualPct: 6.8,
    overnightShortAnnualPct: -1.5,
    overnightNotes: 'Tom/next swap basato su differenziale tassi coppia. SOFR + markup ~2.5%.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 10,
    notes: 'Riferimento ECN IT per FX scalping. Costo all-in EUR/USD ~7.5 bps RT in condizioni normali.',
  },

  // ── IC Markets Standard — cfd_dd — FX ────────────────────
  {
    accountTypeId: 'ic_markets_standard',
    instrumentTypeId: 'cfd_dd',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    // avg 0.9 pip = 9 bps. Min 0.8 pip. Max 4 pip news.
    spreadAvgBps: 9,
    spreadMinBps: 8,
    spreadMaxBps: 40,
    spreadNotes: 'EUR/USD avg ~0.9 pip (markup +0.8 su raw).',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'Nessuna commission. Costo nel markup spread.',
    overnightLongAnnualPct: 6.8,
    overnightShortAnnualPct: -1.5,
    overnightNotes: 'Stesso calcolo swap Raw.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 1,
    slippageNewsBps: 15,
    notes: 'Buono per swing trading con capital < €5k. Costo all-in ~9 bps. Non ottimale per scalping.',
  },

  // ── Pepperstone Razor MT — cfd_ecn ───────────────────────
  {
    accountTypeId: 'pepperstone_razor_mt',
    instrumentTypeId: 'cfd_ecn',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    spreadAvgBps: 1,
    spreadMinBps: 0,
    spreadMaxBps: 30,
    spreadNotes: 'EUR/USD avg 0.1 pip. Equivalente a IC Markets Raw.',
    commissionPerLotEUR: 6.50,  // $7 RT ≈ €6.50
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$7 RT per lotto std su MT4/5. Stesso costo IC Markets Raw.',
    overnightLongAnnualPct: 6.8,
    overnightShortAnnualPct: -1.5,
    overnightNotes: 'Tom/next swap differenziale tassi.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 10,
    notes: 'Identico a IC Markets Raw su MT. Preferire cTrader per commission leggermente inferiori.',
  },

  // ── Pepperstone Razor cTrader — cfd_ecn ──────────────────
  {
    accountTypeId: 'pepperstone_razor_ct',
    instrumentTypeId: 'cfd_ecn',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    spreadAvgBps: 1,
    spreadMinBps: 0,
    spreadMaxBps: 30,
    spreadNotes: 'EUR/USD avg 0.1 pip su cTrader.',
    commissionPerLotEUR: 5.55,  // $6 RT ≈ €5.55
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$6 RT per lotto std su cTrader. Leggermente meno di MT.',
    overnightLongAnnualPct: 6.8,
    overnightShortAnnualPct: -1.5,
    overnightNotes: 'Tom/next swap differenziale tassi.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 10,
    notes: 'Migliore opzione Pepperstone per FX attivo. Commission $1/lot meno di MT. cTrader più trasparente.',
  },

  // ── Tickmill Raw — cfd_ecn ────────────────────────────────
  {
    accountTypeId: 'tickmill_raw',
    instrumentTypeId: 'cfd_ecn',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    spreadAvgBps: 1,
    spreadMinBps: 0,
    spreadMaxBps: 25,
    spreadNotes: 'EUR/USD avg 0.1 pip.',
    // $6 RT ≈ €5.55 — leggermente meno di IC/Pepperstone MT
    commissionPerLotEUR: 5.55,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$6 RT per lotto std. Best-in-class commissioni FX 2026.',
    overnightLongAnnualPct: 6.5,
    overnightShortAnnualPct: -1.2,
    overnightNotes: 'Swap competitivo rispetto ad altri ECN.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 10,
    notes: 'Miglior costo all-in tra ECN standard. All-in ~0.70 pip equiv EUR/USD. Ideale scalping.',
  },

  // ── Admirals Zero — cfd_ecn ───────────────────────────────
  {
    accountTypeId: 'admirals_zero',
    instrumentTypeId: 'cfd_ecn',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    spreadAvgBps: 0,
    spreadMinBps: 0,
    spreadMaxBps: 20,
    spreadNotes: 'Spread 0.0 pip EUR/USD in condizioni normali.',
    commissionPerLotEUR: 5.55,  // $6 RT ≈ €5.55
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$6 RT per lotto std.',
    // Overnight molto alto: -8.42 pip long EUR/USD ≈ -8.42 * 10 = -84.2 USD/lotto/giorno
    // Su 100k nozionale: ~30.7% annuo — molto penalizzante su swing
    overnightLongAnnualPct: 30.7,
    overnightShortAnnualPct: -5.0,
    overnightNotes: 'ATTENZIONE: swap long EUR/USD molto alto (-8.42 pip/giorno). Solo per intraday/scalping.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 12,
    notes: 'Competitivo per intraday/scalping. Overnight elevato penalizza fortemente posizioni swing.',
  },

  // ===========================================================
  // ██████  FOREX — SPOT FX OTC (ECN NDD)
  // ===========================================================

  // ── Interactive Brokers — spot_fx ─────────────────────────
  {
    accountTypeId: 'ib_tiered',
    instrumentTypeId: 'spot_fx',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['scalp', 'intraday', 'swing', 'position'],
    minPositionEUR: 25000, // min $25k per ordine standard IB Spot FX
    maxLeverageOffered: 20,
    // Spread interbancario raw: 0.1 pip = 1 bps su EUR/USD
    spreadAvgBps: 1,
    spreadMinBps: 0.5,
    spreadMaxBps: 15,
    spreadNotes: 'Pass-through interbancario raw. EUR/USD spread da 0.1 pip. 17 LP in pool.',
    // 0.20 bps × 100k = $20 per ordine. Min $2. In EUR: ~18.5
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: 0.0002,  // 0.20 bps × nozionale, tier 1
    takerFeePct: 0.0002,
    commissionNotes: '0.08–0.20 bps × nozionale per ordine. Min $2/ordine (Tier I). Tier basato su volume mensile USD.',
    // IB: overnight su FX con leva = margin loan interest (~5.8% EUR Tier I 2025)
    overnightLongAnnualPct: 5.8,
    overnightShortAnnualPct: -0.5,
    overnightNotes: 'Margin loan rate su posizione levered. IBKR benchmark rate + markup tier.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 1,   // tom/next daily: ~1 bps su EUR/USD in condizioni normali
    rollFrequencyDays: 1,
    rollNotes: 'Tom/next rollover giornaliero automatico. Costo dipende dal differenziale tassi EUR/USD (~1 bps tipico).',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 0,  // il prodotto è la coppia FX — nessuna conversione aggiuntiva
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.2,
    slippageNewsBps: 5,
    notes: 'Spread + commission totale ~3 bps RT su EUR/USD. Minimo posizione alta ($25k). Ottimale per trader con capitale ≥ €50k.',
  },

  // ── Dukascopy JForex — spot_fx ────────────────────────────
  {
    accountTypeId: 'dukascopy_jforex',
    instrumentTypeId: 'spot_fx',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    spreadAvgBps: 1,
    spreadMinBps: 0.5,
    spreadMaxBps: 15,
    spreadNotes: 'SWFX ECN: spread raw 0.1 pip EUR/USD. Liquidità interbancaria multi-partecipante.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    // Base $7/lot RT, scende a $1 con volume. Media trader retail: ~$5 RT ≈ €4.65
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$7/lot RT base. Decresce a $1/lot con volume. Commission ridotta per trader attivi.',
    overnightLongAnnualPct: 6.5,
    overnightShortAnnualPct: -1.0,
    overnightNotes: 'Tom/next swap. Dukascopy applica markup contenuto rispetto a media broker.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 1,
    rollFrequencyDays: 1,
    rollNotes: 'Tom/next giornaliero automatico su SWFX.',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 0,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.3,
    slippageNewsBps: 5,
    notes: 'ECN NDD puro in banca svizzera FINMA. Ideale per chi vuole trasparenza massima su Spot FX.',
  },

  // ── Saxo Classic — spot_fx ────────────────────────────────
  {
    accountTypeId: 'saxo_classic',
    instrumentTypeId: 'spot_fx',
    ugIds: ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'],
    compatibleHorizons: ['intraday', 'swing', 'position'],
    minPositionEUR: 10000,
    maxLeverageOffered: 30,
    spreadAvgBps: 2,
    spreadMinBps: 1,
    spreadMaxBps: 20,
    spreadNotes: 'Spread ECN-like variabile. EUR/USD ~0.2 pip avg Classic.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'Commission inclusa nello spread per Classic. No fee esplicita separata.',
    // Tom/next markup +/-0.75% annuo su Classic (da Saxo rates Nov 2025)
    overnightLongAnnualPct: 7.5,
    overnightShortAnnualPct: -2.0,
    overnightNotes: 'Tom/next: markup +/-0.75% annuo (Classic). Financing P&L: ±2.00% annuo su nozionale.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 1,
    rollFrequencyDays: 1,
    rollNotes: 'Tom/next giornaliero. Due componenti: swap points + financing P&L.',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 0,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 8,
    notes: 'Multi-asset completo. Spot FX non il punto di forza — Saxo più competitivo su futures e certificati.',
  },

  // ── Swissquote ECN — spot_fx ──────────────────────────────
  {
    accountTypeId: 'swissquote_ecn',
    instrumentTypeId: 'spot_fx',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['intraday', 'swing'],
    minPositionEUR: 1000,
    maxLeverageOffered: 30,
    // 0.3 pip avg ECN = 3 bps
    spreadAvgBps: 3,
    spreadMinBps: 1,
    spreadMaxBps: 20,
    spreadNotes: 'EUR/USD avg 0.3 pip su conto ECN.',
    commissionPerLotEUR: 2.30,  // $2.50/lot ≈ €2.30
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$2.50/lot commission su conto ECN. Standard: no commission + spread 1.7 pip.',
    overnightLongAnnualPct: 7.0,
    overnightShortAnnualPct: -1.5,
    overnightNotes: 'Tom/next swap. Inactivity fee $10/mese se inattivo.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 1,
    rollFrequencyDays: 1,
    rollNotes: 'Tom/next giornaliero.',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 0,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0.5,
    slippageNewsBps: 8,
    notes: 'Banca FINMA. Costo all-in ECN ~6 bps RT. Meno competitivo di IC/Tickmill ma più sicuro/regolamentato.',
  },

  // ===========================================================
  // ██████  FOREX — FUTURES STD / MICRO (via IB/Exante/Fineco)
  // ===========================================================

  // ── Interactive Brokers — futures_std FX ─────────────────
  {
    accountTypeId: 'ib_tiered',
    instrumentTypeId: 'futures_std',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['intraday', 'swing', 'position'],
    minPositionEUR: 12500,  // 6E = €125k nozionale, micro M6E = €12.5k
    maxLeverageOffered: null,
    // CME FX futures: bid/ask 0.5 tick = 0.5 pip = 5 bps su 100k
    spreadAvgBps: 5,
    spreadMinBps: 2,
    spreadMaxBps: 15,
    spreadNotes: 'CME CLOB. 6E EUR/USD: avg 0.5–1 tick spread. Molto liquido in sessione US.',
    commissionPerLotEUR: null,
    // IB futures: ~$0.85/contratto/lato = $1.70 RT ≈ €1.55 RT
    commissionPerContractEUR: 1.55,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '~$1.70 RT per contratto (IB tiered). Include exchange fee CME.',
    // No overnight su futures (costo nel basis)
    overnightLongAnnualPct: null,
    overnightShortAnnualPct: null,
    overnightNotes: 'No financing overnight. Costo tassi implicito nel basis futures vs spot.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 5,
    rollFrequencyDays: 90,
    rollNotes: 'Roll trimestrale IMM (Mar/Giu/Set/Dic). Costo roll bid/ask 2x ≈ 5 bps.',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 1,
    slippageNewsBps: 8,
    notes: '6E: nozionale €125k — troppo grande per retail. Usare M6E (micro €12.5k) su IB.',
  },

  // ── Interactive Brokers — futures_micro FX ────────────────
  {
    accountTypeId: 'ib_tiered',
    instrumentTypeId: 'futures_micro',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 1250,  // M6E = €12.5k nozionale, ma commission relativa alta su piccolo
    maxLeverageOffered: null,
    spreadAvgBps: 5,
    spreadMinBps: 2,
    spreadMaxBps: 20,
    spreadNotes: 'M6E (€12.5k), M6B (£6.25k), MJY. Spread 0.5–1 tick avg. Meno liquido di 6E std.',
    commissionPerLotEUR: null,
    // IB micro FX futures: ~$0.47/contratto/lato = $0.94 RT ≈ €0.87
    commissionPerContractEUR: 0.87,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '~$0.94 RT per contratto micro. Commission proporzionalmente alta su nozionale €12.5k.',
    overnightLongAnnualPct: null,
    overnightShortAnnualPct: null,
    overnightNotes: 'No financing overnight su futures.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 5,
    rollFrequencyDays: 90,
    rollNotes: 'Roll trimestrale. Stessa finestra 6E std.',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 1,
    slippageNewsBps: 10,
    notes: 'Ideale per retail con capitale 5–30k. Commission RT €0.87 su nozionale €12.5k = ~7 bps — competitivo vs CFD ECN.',
  },

  // ── Exante — futures_std FX ───────────────────────────────
  {
    accountTypeId: 'exante_universal',
    instrumentTypeId: 'futures_std',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['intraday', 'swing', 'position'],
    minPositionEUR: 12500,
    maxLeverageOffered: null,
    spreadAvgBps: 5,
    spreadMinBps: 2,
    spreadMaxBps: 15,
    spreadNotes: 'CME CLOB DMA. Stesso mercato di IB.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: 1.40,  // $1.5/contratto ≈ €1.40
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: '$1.5/contratto lato su futures. Incluso clearing. DMA puro.',
    overnightLongAnnualPct: null,
    overnightShortAnnualPct: null,
    overnightNotes: 'No financing su futures.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: 5,
    rollFrequencyDays: 90,
    rollNotes: 'Roll trimestrale.',
    koDistancePctTypical: null,
    koNotes: '',
    fxConversionBps: 30,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 1,
    slippageNewsBps: 8,
    notes: 'DMA broker professionale. Commission leggermente inferiore a IB su singolo contratto. Soglia deposito alta.',
  },

  // ===========================================================
  // ██████  FOREX — TURBO KO (SeDeX + OTC)
  // ===========================================================

  // ── Fineco — turbo_ko — FX ────────────────────────────────
  {
    accountTypeId: 'fineco_trading',
    instrumentTypeId: 'turbo_ko',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 100,
    maxLeverageOffered: 50,  // leva implicita nel prodotto, non limitata ESMA su certificati
    // Spread emittente su SeDeX: ~10–15 bps tipico per FX major
    spreadAvgBps: 12,
    spreadMinBps: 8,
    spreadMaxBps: 30,
    spreadNotes: 'Spread emittente fisso (SocGen, BNP, HSBC). EUR/USD turbo: ~10–15 bps tipico.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'ZERO commission su SeDeX con Fineco. Solo spread emittente.',
    // Finanziamento integrato nel prezzo: ~4–6% annuo sul nozionale finanziato
    overnightLongAnnualPct: 5.5,
    overnightShortAnnualPct: null,
    overnightNotes: 'Financing integrato nel prezzo del certificato. ~4–6% annuo sul leverage portion.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: 'Open-end: nessun roll. Barriera KO aggiornata periodicamente dall'emittente.',
    // KO a tocco del barrier — perdita totale del premio
    koDistancePctTypical: 2.5,
    koNotes: 'KO istantaneo al tocco barriera. Perdita totale premio pagato. Distanza tipica FX: 2–5%.',
    fxConversionBps: 20,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0,  // prezzo fisso emittente — no slippage
    slippageNewsBps: 0,
    notes: 'ZERO commission Fineco su SeDeX è il vantaggio chiave. Ideale per intraday/scalping con capitale piccolo (€100+). Rischio KO va gestito.',
  },

  // ── Directa — turbo_ko — FX ───────────────────────────────
  {
    accountTypeId: 'directa_trading',
    instrumentTypeId: 'turbo_ko',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 100,
    maxLeverageOffered: 50,
    spreadAvgBps: 12,
    spreadMinBps: 8,
    spreadMaxBps: 30,
    spreadNotes: 'Stesso spread emittente SeDeX. Prodotti identici a Fineco.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'Commission Directa su SeDeX: dipende da piano tariffario. Generalmente ~€1.5–3/trade.',
    overnightLongAnnualPct: 5.5,
    overnightShortAnnualPct: null,
    overnightNotes: 'Stesso financing integrato emittente.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: 2.5,
    koNotes: 'KO istantaneo. Stesso meccanismo Fineco.',
    fxConversionBps: 20,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0,
    slippageNewsBps: 0,
    notes: 'Simile a Fineco su SeDeX ma con commission Directa. Fineco preferibile per zero-commission.',
  },

  // ── IG Markets Turbo24 — turbo_ko — FX ───────────────────
  {
    accountTypeId: 'ig_standard',
    instrumentTypeId: 'turbo_ko',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['scalp', 'intraday', 'swing'],
    minPositionEUR: 50,
    maxLeverageOffered: 100,  // leva implicita Turbo24 può essere molto alta
    // Spread IG Turbo24 su FX: ~8–15 bps tipico
    spreadAvgBps: 12,
    spreadMinBps: 6,
    spreadMaxBps: 30,
    spreadNotes: 'Spread IG come emittente OTC. EUR/USD Turbo24: ~1–1.5 pip tipico.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'Nessuna commission esplicita. Costo tutto nello spread emittente.',
    overnightLongAnnualPct: 5.5,
    overnightShortAnnualPct: null,
    overnightNotes: 'Financing integrato prezzo. Quotazione 24h differenzia da SeDeX.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: 2.0,
    koNotes: 'KO istantaneo OTC. Quotazione 24h — KO anche fuori orario SeDeX.',
    fxConversionBps: 20,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0,
    slippageNewsBps: 0,
    notes: 'Vantaggio: trading 24h (anche weekend su alcuni sottostanti). Svantaggio: OTC IG — no trasparenza SeDeX.',
  },

  // ===========================================================
  // ██████  FOREX — MINI FUTURE (SeDeX)
  // ===========================================================

  // ── Fineco — mini_future — FX ─────────────────────────────
  {
    accountTypeId: 'fineco_trading',
    instrumentTypeId: 'mini_future',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['intraday', 'swing', 'position'],
    minPositionEUR: 100,
    maxLeverageOffered: 30,
    // Mini Future: spread emittente leggermente più stretto di Turbo KO
    spreadAvgBps: 10,
    spreadMinBps: 6,
    spreadMaxBps: 25,
    spreadNotes: 'Spread emittente SeDeX. Mini Future leggermente più stretto di Turbo KO.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'ZERO commission Fineco su SeDeX.',
    overnightLongAnnualPct: 5.5,
    overnightShortAnnualPct: null,
    overnightNotes: 'Financing integrato. Stop-loss level aggiornato periodicamente dall'emittente.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: 'Open-end. Nessun roll.',
    // Mini Future: stop-loss con recupero parziale (non KO secco)
    koDistancePctTypical: 3.0,
    koNotes: 'Stop-loss level con recupero parziale. Diverso da KO secco — residuo rimborsato.',
    fxConversionBps: 20,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0,
    slippageNewsBps: 0,
    notes: 'Open-end senza scadenza. Più adatto a swing/position vs Turbo KO. Stop-loss con recupero parziale meno rischioso.',
  },

  // ── Saxo Bank — mini_future — FX ─────────────────────────
  {
    accountTypeId: 'saxo_classic',
    instrumentTypeId: 'mini_future',
    ugIds: ['ug_fx_major', 'ug_fx_minor'],
    compatibleHorizons: ['intraday', 'swing', 'position'],
    minPositionEUR: 2000,
    maxLeverageOffered: 30,
    spreadAvgBps: 12,
    spreadMinBps: 8,
    spreadMaxBps: 25,
    spreadNotes: 'Saxo: accesso SeDeX + prodotti emittenti propri. Spread simile.',
    commissionPerLotEUR: null,
    commissionPerContractEUR: null,
    makerFeePct: null,
    takerFeePct: null,
    commissionNotes: 'Commission Saxo su certificati: min €5/trade.',
    overnightLongAnnualPct: 5.5,
    overnightShortAnnualPct: null,
    overnightNotes: 'Financing integrato emittente.',
    fundingRateTypicalPct8h: null,
    fundingRateMaxPct8h: null,
    fundingNotes: '',
    rebasingLeverageMult: null,
    rebasingNotes: '',
    rollSpreadBps: null,
    rollFrequencyDays: null,
    rollNotes: '',
    koDistancePctTypical: 3.0,
    koNotes: 'Stop-loss level con recupero parziale.',
    fxConversionBps: 20,
    terAnnualPct: null,
    depositFiatPct: null,
    withdrawalFeeUSD: null,
    withdrawalFeeUSDCheap: null,
    slippageAvgBps: 0,
    slippageNewsBps: 0,
    notes: 'Saxo: più costoso di Fineco (commission min €5). Utile se già cliente Saxo per altri strumenti.',
  },
];

// ============================================================
// 5. HELPER TYPES — output del matcher
// ============================================================

export type RankedResult = {
  rank:         number;
  broker:       Broker;
  accountType:  AccountType;
  offer:        InstrumentOffer;
  totalCostBps: number;
  costBreakdown: {
    spreadBps:     number;
    commissionBps: number;
    overnightBps:  number;
    fundingBps:    number;
    rebasingBps:   number;
    fxBps:         number;
    otherBps:      number;
  };
  warnings:    string[];
  compatibilityFlags: {
    leverageOk:     boolean;
    accountSizeOk:  boolean;
    positionSizeOk: boolean;
    horizonOk:      boolean;
    accessibleIT:   boolean;
  };
};
