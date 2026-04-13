// ============================================================
// BROKER TYPES — Schema puro
// ============================================================

import type { AccountSizeId } from './account-sizes';
import type { LeverageProfileId } from './leverage-profiles';

export type BrokerId =
  // Forex / CFD ECN
  | 'ic_markets'
  | 'pepperstone'
  | 'tickmill'
  | 'admirals'
  | 'xm'
  // Spot FX OTC / ECN NDD
  | 'interactive_brokers'
  | 'dukascopy'
  | 'saxo_bank'
  | 'swissquote'
  // Futures + Multi-asset
  | 'exante'
  | 'mexem'
  | 'fineco'
  | 'directa'
  | 'lynx'
  // Certificati SeDeX
  | 'ig_markets'
  | 'iwbank'
  | 'webank'
  // Broker IT Azioni / ETF
  | 'degiro'
  | 'scalable_capital'
  | 'flatex'
  | 'trade_republic'
  // Crypto Exchange
  | 'mexc'
  | 'kraken'
  | 'bybit'
  | 'bitget'
  | 'okx'
  | 'deribit';

export type RegulationZone =
  | 'EU'
  | 'UK'
  | 'AU'
  | 'CH'
  | 'CY'
  | 'offshore'
  | 'US'
  | 'global';

export type PlatformType =
  | 'mt4'
  | 'mt5'
  | 'ctrader'
  | 'proprietary'
  | 'tws'
  | 'web'
  | 'api';

export type Broker = {
  id:               BrokerId;
  name:             string;
  logoSlug:         string;
  /**
   * URL istituzionale del broker (no UTM).
   * Usato come fallback se affiliateUrl è null.
   */
  website:          string;
  regulationZones:  RegulationZone[];
  accessibleFromIT: boolean;
  minDepositEUR:    number;
  platformTypes:    PlatformType[];
  notes:            string;

  // ── Affiliate ────────────────────────────────────────────────
  /**
   * URL affiliato con UTM/tracking. Se presente, la CTA card usa questo.
   * null = nessun accordo affiliazione → usa website.
   */
  affiliateUrl:     string | null;
  /**
   * true = mostrare disclaimer "Potremmo ricevere commissioni se apri un conto."
   * Impostare sempre coerentemente con affiliateUrl != null.
   */
  isAffiliate:      boolean;

  // ── ESMA Risk Disclaimer ────────────────────────────────────
  /**
   * Percentuale di conti retail che perde denaro, comunicata dal broker
   * nel disclaimer ESMA obbligatorio.
   * Es: 74 → "Il 74% dei conti degli investitori retail..."
   * null = dato non disponibile (mostrare disclaimer generico).
   */
  esmaRiskPct:      number | null;
  /**
   * Denominazione legale esatta del broker usata nel disclaimer ESMA.
   * Es: "Tickmill Europe Ltd"
   * null = usare name come fallback.
   */
  esmaLegalName:    string | null;
};

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
