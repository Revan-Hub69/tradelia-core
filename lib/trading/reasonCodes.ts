export const REASON_CODES_VERSION = "reasons-v1" as const;

export enum ReasonCode {
  // Market/REST
  MARKET_RULES_MISSING = "MARKET_RULES_MISSING",
  MARKET_NOT_TRADING = "MARKET_NOT_TRADING",
  TICKER24H_MISSING = "TICKER24H_MISSING",
  BOOK_MISSING = "BOOK_MISSING",
  PRICE_MISSING = "PRICE_MISSING",
  QUOTE_VOLUME_LOW = "QUOTE_VOLUME_LOW",
  DATA_GAPS = "DATA_GAPS",
  FRESHNESS_STALE = "FRESHNESS_STALE",
  ATR_MISSING = "ATR_MISSING",
  REGIME_OUTPUT_INVALID = "REGIME_OUTPUT_INVALID",
  STABLECOIN_PAIR = "STABLECOIN_PAIR",
  LEVERAGED_TOKEN = "LEVERAGED_TOKEN",

  // WS
  WS_UNAVAILABLE = "WS_UNAVAILABLE",
  WS_STALE = "WS_STALE",
  WS_DEGRADED = "WS_DEGRADED",
  SPREAD_JITTER_HIGH = "SPREAD_JITTER_HIGH",
  IMPACT_HIGH = "IMPACT_HIGH",
  ACTIVITY_LOW = "ACTIVITY_LOW",
  WS_OK = "WS_OK",
  FALLBACK_REST = "FALLBACK_REST",

  // Spread
  SPREAD_OK = "SPREAD_OK",
  SPREAD_WIDE = "SPREAD_WIDE",
  SPREAD_TOO_WIDE = "SPREAD_TOO_WIDE",

  // Regime
  REGIME_TREND = "REGIME_TREND",
  REGIME_RANGE = "REGIME_RANGE",
  REGIME_TRANSITION = "REGIME_TRANSITION",
  STRESS_TRUE = "STRESS_TRUE",
  BIAS_BULL = "BIAS_BULL",
  BIAS_BEAR = "BIAS_BEAR",
  BIAS_NEUTRAL = "BIAS_NEUTRAL",

  // Match
  REGIME_MATCH_LONG = "REGIME_MATCH_LONG",
  REGIME_MATCH_SHORT = "REGIME_MATCH_SHORT",
  REGIME_MATCH_NONE = "REGIME_MATCH_NONE",

  // Vol fit
  ATR_TOO_LOW = "ATR_TOO_LOW",
  ATR_TOO_HIGH = "ATR_TOO_HIGH",
  ATR_OK = "ATR_OK",
}

export const ReasonText: Record<ReasonCode, string> = {
  [ReasonCode.MARKET_RULES_MISSING]: "Regole di mercato mancanti (tick/step/minNotional non disponibili).",
  [ReasonCode.MARKET_NOT_TRADING]: "Mercato non tradabile (status non attivo).",
  [ReasonCode.TICKER24H_MISSING]: "Dati ticker 24h mancanti.",
  [ReasonCode.BOOK_MISSING]: "Bid/ask mancanti.",
  [ReasonCode.PRICE_MISSING]: "Prezzo corrente mancante.",
  [ReasonCode.QUOTE_VOLUME_LOW]: "Liquidità bassa (quote volume 24h sotto soglia).",
  [ReasonCode.DATA_GAPS]: "Dati storici con gap (integrità ridotta).",
  [ReasonCode.FRESHNESS_STALE]: "Dati non freschi (oltre soglia).",
  [ReasonCode.ATR_MISSING]: "ATR/volatilità HTF non calcolabile (klines insufficienti).",
  [ReasonCode.REGIME_OUTPUT_INVALID]: "Output regime non valido (errore nel calcolo).",
  [ReasonCode.STABLECOIN_PAIR]: "Coppia stablecoin: non utile per setup direzionali.",
  [ReasonCode.LEVERAGED_TOKEN]: "Token leveraged (UP/DOWN/BULL/BEAR): escluso per rischio strutturale.",

  [ReasonCode.WS_UNAVAILABLE]: "WebSocket non disponibile: ranking degradato (fallback REST).",
  [ReasonCode.WS_STALE]: "WebSocket stale: feed non aggiornato di recente.",
  [ReasonCode.WS_DEGRADED]: "WebSocket degradato: aggiornamenti lenti/intermittenti.",
  [ReasonCode.SPREAD_JITTER_HIGH]: "Spread instabile (jitter elevato).",
  [ReasonCode.IMPACT_HIGH]: "Costo di esecuzione stimato alto (spread + instabilità).",
  [ReasonCode.ACTIVITY_LOW]: "Attività bassa nel feed (update rate ridotto).",
  [ReasonCode.WS_OK]: "WebSocket OK (feed stabile).",
  [ReasonCode.FALLBACK_REST]: "Valutazione basata su REST per assenza/degrado WS.",

  [ReasonCode.SPREAD_OK]: "Spread nel range ideale.",
  [ReasonCode.SPREAD_WIDE]: "Spread sopra la soglia consigliata.",
  [ReasonCode.SPREAD_TOO_WIDE]: "Spread troppo ampio per esecuzione efficiente.",

  [ReasonCode.REGIME_TREND]: "Regime HTF: Trend.",
  [ReasonCode.REGIME_RANGE]: "Regime HTF: Range.",
  [ReasonCode.REGIME_TRANSITION]: "Regime HTF: Transizione (instabile).",
  [ReasonCode.STRESS_TRUE]: "Stress attivo: rischio di whipsaw/spike.",
  [ReasonCode.BIAS_BULL]: "Bias direzionale: Bull.",
  [ReasonCode.BIAS_BEAR]: "Bias direzionale: Bear.",
  [ReasonCode.BIAS_NEUTRAL]: "Bias direzionale: Neutrale.",

  [ReasonCode.REGIME_MATCH_LONG]: "Match favorevole a ricerca setup LONG.",
  [ReasonCode.REGIME_MATCH_SHORT]: "Match favorevole a ricerca setup SHORT.",
  [ReasonCode.REGIME_MATCH_NONE]: "Match debole: non prioritaria per setup direzionali.",

  [ReasonCode.ATR_TOO_LOW]: "Volatilità troppo bassa (setup spesso poco efficienti).",
  [ReasonCode.ATR_TOO_HIGH]: "Volatilità troppo alta (rischio di spike/slippage).",
  [ReasonCode.ATR_OK]: "Volatilità nel range ideale.",
};

