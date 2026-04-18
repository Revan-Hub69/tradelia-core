/**
 * Interbank swap rates (prima del markup broker) per coppia forex.
 * Valori in €/standard lot/notte.
 *
 * Convenzione:
 * - `long`:  swap ricevuto (se positivo) o pagato (se negativo) tenendo long overnight
 * - `short`: swap ricevuto (se positivo) o pagato (se negativo) tenendo short overnight
 *
 * I valori riflettono i differenziali di tasso delle banche centrali a fine 2025:
 *   Fed 4.50% · ECB 2.25% · BoE 4.25% · BoJ 0.50% · SNB 1.25% · RBA 4.10%
 *
 * Formula teorica: size_std_lot × diff_tassi / 365 ≈ €/notte
 * Aggiustati per spread bid/ask tipico dell'interbank (short sempre meno in magnitudo del long).
 *
 * NOTA: sono dati indicativi, non real-time. Il motore ci somma il markup broker.
 */
export type SwapRate = {
  long: number;
  short: number;
};

export const INTERBANK_SWAP: Record<string, SwapRate> = {
  'EUR/USD': { long: -6.2, short: +4.5 },
  'GBP/USD': { long: -0.7, short: +0.2 },
  'USD/JPY': { long: +11.0, short: -12.8 },
  'GBP/JPY': { long: +10.3, short: -12.0 },
  'AUD/USD': { long: -1.1, short: +0.4 },
  'USD/CHF': { long: +9.0, short: -10.5 },
  'EUR/GBP': { long: -5.5, short: +3.8 },
  'EUR/JPY': { long: +4.8, short: -6.2 },
  'NZD/USD': { long: -1.5, short: +0.6 },
  'USD/CAD': { long: +1.5, short: -2.5 },
  'AUD/JPY': { long: +9.8, short: -11.0 },
  'CHF/JPY': { long: +7.8, short: -9.0 },
};

/**
 * Fallback per pair non in tabella: usa EUR/USD come proxy neutro.
 */
export function getInterbankSwap(pairSymbol: string | undefined): SwapRate {
  if (!pairSymbol) {
    return INTERBANK_SWAP['EUR/USD']!;
  }
  return INTERBANK_SWAP[pairSymbol] ?? INTERBANK_SWAP['EUR/USD']!;
}

export type TradingDirection = 'long' | 'short' | 'mixed';

/**
 * Calcola il COSTO swap €/lot/notte per una data coppia, direzione e markup broker.
 * Il risultato è firmato: positivo = costo effettivo, negativo = il trader incassa.
 */
export function computeSwapCostPerLotNight(
  pairSymbol: string | undefined,
  direction: TradingDirection,
  brokerMarkupPerLot: number,
): number {
  const swap = getInterbankSwap(pairSymbol);
  // Markup broker sempre peggiora entrambe le direzioni (valore positivo sottratto al ricevuto).
  const markup = Math.abs(brokerMarkupPerLot);
  const longNet = swap.long - markup;
  const shortNet = swap.short - markup;
  // Costo = -netto (se netto negativo, costo positivo; se netto positivo, costo negativo = income)
  const costLong = -longNet;
  const costShort = -shortNet;
  if (direction === 'long') {
    return costLong;
  }
  if (direction === 'short') {
    return costShort;
  }
  // mixed: media aritmetica dei costi (50/50 long-short)
  return (costLong + costShort) / 2;
}
