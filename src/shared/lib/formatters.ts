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
 * 
 * @param bytes - The number of bytes to format
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted string like "1.5 MB"
 * 
 * @example
 * formatBytes(1536) // "1.5 KB"
 * formatBytes(1048576) // "1 MB"
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
 * 
 * @param date - Date to format (Date object, string, or timestamp)
 * @param options - Intl.DateTimeFormatOptions with optional locale
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // "13 gen 2026"
 * formatDate(new Date(), { locale: 'en-US' }) // "Jan 13, 2026"
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
 * 
 * @param amount - The amount to format
 * @param options - Formatting options (locale, currency, precision)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56) // "1.234,56 €"
 * formatCurrency(1234.56, { currency: 'USD', locale: 'en-US' }) // "$1,234.56"
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
 * 
 * @param value - The decimal value to format (0.5 = 50%)
 * @param options - Formatting options (precision, showSign)
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(0.156) // "15.6%"
 * formatPercentage(0.05, { showSign: true }) // "+5.0%"
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
 * 
 * @param value - The number to format
 * @param options - Formatting options (locale, notation)
 * @returns Formatted compact number string
 * 
 * @example
 * formatCompactNumber(1500) // "1,5K"
 * formatCompactNumber(1500000) // "1,5M"
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
 * 
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string
 * 
 * @example
 * formatDuration(500) // "500ms"
 * formatDuration(2500) // "2.5s"
 * formatDuration(125000) // "2m 5s"
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
 * 
 * @param timestamp - The timestamp to calculate age from
 * @returns Human-readable age string in Italian
 * 
 * @example
 * formatDataAge(Date.now() - 30000) // "Appena aggiornato"
 * formatDataAge(Date.now() - 3600000) // "1 ore fa"
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