/**
 * Formatter Utilities - Tradelia 2026
 * 
 * Funzioni per la formattazione di dati seguendo i principi di chiarezza
 */

export interface FormatterOptions {
  locale?: string;
  currency?: string;
  precision?: number;
}

/**
 * Formatta i byte in formato leggibile
 * Utilizzato per il monitoraggio delle dimensioni dei bundle
 */
export function formatBytes(bytes: number, precision = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(precision))} ${sizes[i]}`;
}

/**
 * Formatta le date in formato italiano/inglese
 * Supporta i18n per dashboard multilingua
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions & { locale?: string } = {}
): string {
  const { locale = 'it-IT', ...formatOptions } = options;
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Data non valida';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...formatOptions,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Formatta i valori monetari
 * Utilizzato per visualizzare prezzi e costi in modo neutrale
 */
export function formatCurrency(
  amount: number,
  options: FormatterOptions = {}
): string {
  const { locale = 'it-IT', currency = 'EUR', precision = 2 } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(amount);
}

/**
 * Formatta le percentuali seguendo i principi Tradelia 2026
 * Evita percentuali inventate o non verificabili
 */
export function formatPercentage(
  value: number,
  options: { precision?: number; showSign?: boolean } = {}
): string {
  const { precision = 1, showSign = false } = options;
  const formatted = (value * 100).toFixed(precision);
  const sign = showSign && value > 0 ? '+' : '';
  
  return `${sign}${formatted}%`;
}

/**
 * Formatta i numeri grandi in formato compatto
 * Utilizzato per metriche e statistiche
 */
export function formatCompactNumber(
  value: number,
  options: { locale?: string; notation?: 'compact' | 'standard' } = {}
): string {
  const { locale = 'it-IT', notation = 'compact' } = options;
  
  return new Intl.NumberFormat(locale, {
    notation,
    compactDisplay: 'short',
  }).format(value);
}

/**
 * Formatta la durata in formato leggibile
 * Utilizzato per metriche di performance
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Formatta l'età dei dati per indicatori di freshness
 */
export function formatDataAge(timestamp: Date | string | number): string {
  const now = new Date();
  const dataTime = new Date(timestamp);
  const diffMs = now.getTime() - dataTime.getTime();
  
  if (diffMs < 60000) { // < 1 minuto
    return 'Appena aggiornato';
  }
  
  if (diffMs < 3600000) { // < 1 ora
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes} min fa`;
  }
  
  if (diffMs < 86400000) { // < 1 giorno
    const hours = Math.floor(diffMs / 3600000);
    return `${hours} ore fa`;
  }
  
  const days = Math.floor(diffMs / 86400000);
  return `${days} giorni fa`;
}