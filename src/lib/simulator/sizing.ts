// ============================================================
// SIZING v1.0 — Conversione UserInput → lotSize per l'engine
//
// Responsabilità:
//   - Riceve input utente in uno dei 3 linguaggi (%, lotti, esposizione)
//   - Converte in lotSize standard (unità engine)
//   - Applica clamp ESMA e minLotSize
//   - Espone deriveEngineInput() che produce un EngineInput completo
//
// NON è responsabilità di questo file:
//   - Calcolo costi (→ engine.ts)
//   - Ranking (→ recommend.ts)
//   - Swap / overnight (→ output only)
// ============================================================

import type { EngineInput }  from './engine';
import type { AssetClass }   from '@/components/simulatore/AssetSelector';
import type { UnderlyingId } from '@/data/simulator/underlyings';

// ── Costanti ──────────────────────────────────────────────────────────────
const LOT_SIZE = 100_000; // unità base per lot FX standard

// ESMA leverage caps per FX (retail)
const ESMA_LEVERAGE_FX: Record<string, number> = {
  major: 30,
  minor: 20,
  exotic: 20,
};

// ── Profili preset ────────────────────────────────────────────────────────
export type TradingProfile = 'scalper' | 'day_trader' | 'swing';

export type ProfilePreset = {
  /** Modalità sizing default del preset */
  sizingMode:        SizingMode;
  /** Valore default per il campo dimensione (in unità della modalità) */
  sizingValue:       number;
  /** Frequenza default in unità della modalità frequenza */
  freqValue:         number;
  /** Modalità frequenza default */
  freqMode:          FreqMode;
  /** Stop loss interno usato SOLO per conversione % → lotti — non esposto all'utente */
  _internalSlPips:   number;
};

export const PROFILE_PRESETS: Record<TradingProfile, ProfilePreset> = {
  scalper: {
    sizingMode:      'pct_capital',
    sizingValue:     0.5,   // 0.5% del capitale
    freqValue:       3,
    freqMode:        'per_day',
    _internalSlPips: 8,
  },
  day_trader: {
    sizingMode:      'pct_capital',
    sizingValue:     1.0,   // 1% del capitale
    freqValue:       1,
    freqMode:        'per_day',
    _internalSlPips: 20,
  },
  swing: {
    sizingMode:      'pct_capital',
    sizingValue:     1.0,   // 1% del capitale
    freqValue:       2,
    freqMode:        'per_week',
    _internalSlPips: 50,
  },
};

// ── Modalità input ────────────────────────────────────────────────────────
export type SizingMode = 'pct_capital' | 'lots' | 'exposure_eur';
export type FreqMode   = 'per_day' | 'per_week' | 'per_month';

// ── Conversione frequenza → trade/mese ───────────────────────────────────
export function toTradesPerMonth(value: number, mode: FreqMode): number {
  switch (mode) {
    case 'per_day':   return Math.round(value * 22);  // ~22 giorni trading/mese
    case 'per_week':  return Math.round(value * 4.33);
    case 'per_month': return Math.round(value);
  }
}

// ── Conversione sizing → lotSize ──────────────────────────────────────────
export type SizingParams = {
  mode:    SizingMode;
  value:   number;
  capital: number;
  /** Solo per mode='pct_capital' — SL interno del profilo, non esposto all'utente */
  internalSlPips?:    number;
  /** pip value in EUR per 1 lot standard — calcolato dalla coppia */
  pipValueEUR?:       number;
  /** minLotSize dell'offer — default 0.01 */
  minLotSize?:        number;
  /** Leverage ESMA massimo per questo underlying — default 30 (FX major) */
  esmaMaxLeverage?:   number;
};

export type SizingResult = {
  lotSize:     number;
  /** true se il valore è stato clampato da ESMA o minLot */
  clamped:     boolean;
  clampReason: 'esma' | 'min_lot' | null;
  /** Equivalenti nelle altre 2 modalità — per hint UI */
  equiv: {
    lots:         number;
    pctCapital:   number | null;  // null se non calcolabile senza SL
    exposureEUR:  number;
  };
};

export function deriveLotSize(params: SizingParams): SizingResult {
  const {
    mode,
    value,
    capital,
    internalSlPips,
    pipValueEUR       = 10,   // fallback pip value EUR/USD a ~1:1
    minLotSize        = 0.01,
    esmaMaxLeverage   = 30,
  } = params;

  let rawLots = 0;

  switch (mode) {
    case 'pct_capital': {
      // lots = (capital × riskPct) / (SL_pips × pipValue)
      const sl = internalSlPips ?? 20;
      const riskEUR = capital * (value / 100);
      rawLots = riskEUR / (sl * pipValueEUR);
      break;
    }
    case 'lots': {
      rawLots = value;
      break;
    }
    case 'exposure_eur': {
      // esposizione nozionale → lotti
      rawLots = value / LOT_SIZE;
      break;
    }
  }

  // Step al minLot
  const steps    = Math.round(rawLots / minLotSize);
  let lotSize    = +(steps * minLotSize).toFixed(2);

  let clamped     = false;
  let clampReason: 'esma' | 'min_lot' | null = null;

  // Clamp min
  if (lotSize < minLotSize) {
    lotSize     = minLotSize;
    clamped     = true;
    clampReason = 'min_lot';
  }

  // Clamp ESMA: exposure ≤ capital × leverage
  const maxLots = (capital * esmaMaxLeverage) / LOT_SIZE;
  if (lotSize > maxLots) {
    const maxSteps = Math.floor(maxLots / minLotSize);
    lotSize     = +(maxSteps * minLotSize).toFixed(2);
    clamped     = true;
    clampReason = 'esma';
  }

  const exposureEUR  = lotSize * LOT_SIZE;
  const pctCapital   = internalSlPips != null
    ? ((internalSlPips * pipValueEUR * lotSize) / capital) * 100
    : null;

  return {
    lotSize,
    clamped,
    clampReason,
    equiv: {
      lots:        lotSize,
      pctCapital,
      exposureEUR,
    },
  };
}

// ── Funzione principale: UserInput → EngineInput ──────────────────────────
export type UserInput = {
  assetClass:    AssetClass;
  underlyingId:  UnderlyingId;
  capital:       number;
  sizingMode:    SizingMode;
  sizingValue:   number;
  freqMode:      FreqMode;
  freqValue:     number;
  /** Profilo attivo — usato per _internalSlPips. null se nessun preset selezionato */
  activeProfile: TradingProfile | null;
};

export function deriveEngineInput(
  input: UserInput,
  options?: {
    pipValueEUR?:     number;
    minLotSize?:      number;
    esmaMaxLeverage?: number;
  },
): EngineInput & { sizingResult: SizingResult; tradesPerMonth: number } {
  const profile        = input.activeProfile ? PROFILE_PRESETS[input.activeProfile] : null;
  const internalSlPips = profile?._internalSlPips;

  const sizingResult = deriveLotSize({
    mode:           input.sizingMode,
    value:          input.sizingValue,
    capital:        input.capital,
    internalSlPips,
    pipValueEUR:    options?.pipValueEUR,
    minLotSize:     options?.minLotSize,
    esmaMaxLeverage: options?.esmaMaxLeverage,
  });

  const tradesPerMonth = toTradesPerMonth(input.freqValue, input.freqMode);

  return {
    assetClass:     input.assetClass,
    underlyingId:   input.underlyingId,
    capital:        input.capital,
    lotSize:        sizingResult.lotSize,
    tradesPerMonth,
    sizingResult,
  };
}
