/**
 * I18N Safety System - Enterprise Grade
 * 
 * Prevents raw translation keys from appearing in UI
 * Provides user-safe fallbacks for all translation failures
 * 
 * REQ-I18N-01: Trust & Accessibility
 * - No raw keys visible to users
 * - All error messages have human fallbacks
 * - Network errors ≠ application errors
 */

import { useTranslations } from 'next-intl';

/**
 * Safe translation hook for React components
 * This is the primary way to use translations safely
 */
export function useSafeTranslations() {
  const t = useTranslations();
  
  return (key: string, fallback: string, params?: Record<string, string | number>) => {
    try {
      const value = t(key, params);
      
      // Check if translation failed (returns the key itself)
      if (value === key || value.startsWith(key.split('.')[0] + '.')) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Missing i18n key: ${key}, using fallback: ${fallback}`);
        }
        return fallback;
      }
      
      return value;
    } catch {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`I18n error for key ${key}, using fallback: ${fallback}`);
      }
      return fallback;
    }
  };
}

/**
 * Network status translations with semantic correctness
 * These are NOT danger states - they're informational
 */
export const networkStatusTranslations = {
  offline: {
    title: 'Connessione assente',
    message: 'Alcune funzioni potrebbero non essere disponibili. I tuoi dati non sono a rischio.',
    retry: 'Riprova',
    // Semantic: warning (amber), not danger (red)
    severity: 'warning' as const,
    icon: 'triangle-alert' as const
  },
  unstable: {
    title: 'Connessione instabile',
    message: 'La connessione è intermittente. Salvataggio automatico attivo.',
    retry: 'Verifica connessione',
    severity: 'warning' as const,
    icon: 'triangle-alert' as const
  },
  error: {
    title: 'Errore di connessione',
    message: 'Impossibile connettersi al server. Riprova tra qualche istante.',
    retry: 'Riprova',
    severity: 'danger' as const,
    icon: 'octagon-alert' as const
  }
} as const;

/**
 * Progress state translations with clarity
 * Replace generic "Da completare" with specific states
 */
export const progressStateTranslations = {
  notStarted: {
    label: 'Non iniziato',
    description: 'Clicca per iniziare questo modulo'
  },
  fundamental: {
    label: 'Fondamentale',
    description: 'Contenuto essenziale per la comprensione',
    timeEstimate: '~3 min'
  },
  inProgress: {
    label: 'In corso',
    description: 'Hai iniziato questo modulo'
  },
  completed: {
    label: 'Completato',
    description: 'Modulo completato con successo'
  }
} as const;

/**
 * CTA translations that guide user action
 * Replace generic "Ok, ho capito" with specific next steps
 */
export const ctaTranslations = {
  continue: 'Continua',
  proceedToNext: 'Prosegui nel percorso',
  goToNextStep: 'Vai al prossimo passo',
  startModule: 'Inizia modulo',
  reviewContent: 'Rivedi contenuto',
  backToDashboard: 'Torna alla dashboard'
} as const;

/**
 * Educational alert translations
 * Reduce anxiety, increase comprehension
 */
export const educationalAlertTranslations = {
  contextWarning: {
    title: 'Importante da sapere',
    message: 'Se usata fuori contesto, può creare più problemi che benefici.',
    severity: 'warning' as const,
    icon: 'triangle-alert' as const
  },
  riskAwareness: {
    title: 'Considera i rischi',
    message: 'Valuta attentamente la tua situazione prima di procedere.',
    severity: 'warning' as const,
    icon: 'info' as const
  }
} as const;

/**
 * Development-time guard against raw keys
 * Only runs in development mode
 */
export function devGuardRawKeys(renderedContent: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const rawKeyPattern = /\b(common|error|network|auth|dashboard)\.\w+/g;
    const matches = renderedContent.match(rawKeyPattern);
    
    if (matches) {
      console.warn('🚨 Raw i18n keys detected in UI:', matches);
      console.warn('This violates REQ-I18N-01. Add fallbacks to all t() calls.');
    }
  }
}

/**
 * Build-time test helper
 * Can be used in tests to ensure no raw keys in snapshots
 */
export function testNoRawKeys(snapshot: string): boolean {
  const rawKeyPattern = /\b(common|error|network|auth|dashboard)\.\w+/g;
  return !rawKeyPattern.test(snapshot);
}