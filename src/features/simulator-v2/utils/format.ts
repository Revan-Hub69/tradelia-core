/**
 * Number / currency formatters — single source of truth per il locale italiano.
 *
 * Uso Intl.NumberFormat con cache (getter lazy) per evitare creazione inutile
 * di istanze a ogni render.
 */

const LOCALE = 'it-IT';

const eurWhole = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const eur2 = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const num0 = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });

const num2 = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatta un importo in EUR con 2 decimali (€ 4,20). */
export function formatEUR(value: number): string {
  return eur2.format(value);
}

/** Formatta un importo in EUR arrotondato (€ 5.000). */
export function formatEURWhole(value: number): string {
  return eurWhole.format(value);
}

/** Numero intero con separatore migliaia locale (1.000). */
export function formatInt(value: number): string {
  return num0.format(value);
}

/** Numero con 2 decimali (4,20). */
export function formatNum2(value: number): string {
  return num2.format(value);
}
