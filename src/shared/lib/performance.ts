/**
 * Performance Utilities - Tradelia 2026
 * 
 * Funzioni per l'ottimizzazione delle performance seguendo i budget definiti
 */

/**
 * Debounce function per ottimizzare le chiamate frequenti
 * Utilizzato per search, resize handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function per limitare la frequenza di esecuzione
 * Utilizzato per scroll handlers, mouse move, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Performance measurement utility
 * Utilizzato per monitorare le performance delle operazioni critiche
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  /**
   * Inizia la misurazione di un'operazione
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }
  
  /**
   * Termina la misurazione e restituisce la durata
   */
  end(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`Performance mark "${name}" not found`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.marks.delete(name);
    
    return duration;
  }
  
  /**
   * Misura una funzione asincrona
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      const duration = this.end(name);
      
      // Log performance se supera le soglie
      if (duration > 1000) {
        console.warn(`Slow operation "${name}": ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }
}

/**
 * Singleton instance del performance monitor
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Utility per il preloading delle risorse critiche
 */
export function preloadResource(href: string, as: string): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  document.head.appendChild(link);
}

/**
 * Verifica se il browser supporta le feature moderne
 */
export function getBrowserCapabilities() {
  if (typeof window === 'undefined') {
    return {
      supportsWebP: false,
      supportsIntersectionObserver: false,
      supportsServiceWorker: false,
    };
  }
  
  return {
    supportsWebP: (() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })(),
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsServiceWorker: 'serviceWorker' in navigator,
  };
}