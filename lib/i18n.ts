export const locales = ['it', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'it';

// Dizionari statici per evitare problemi di import
const dictionaries = {
  it: {
    "nav": {
      "methodology": "Metodologia",
      "verify": "Verifica",
      "home": "Home"
    },
    "hero": {
      "title": "TRADELIA",
      "subtitle": "Crypto ti incuriosiscono, ma non vuoi partire facendo errori evitabili?",
      "description": "In 60 secondi chiarisci cosa vuoi davvero fare e ottieni un check di coerenza decisionale basato su evidenze accademiche.",
      "cta": "Inizia dal tuo obiettivo"
    },
    "footer": {
      "copyright": "© 2026 Tradelia. Questo strumento fornisce verifiche di coerenza, non consigli di investimento.",
      "privacy": "Privacy",
      "disclaimer": "Disclaimer",
      "contacts": "Contatti"
    }
  },
  en: {
    "nav": {
      "methodology": "Methodology",
      "verify": "Verify", 
      "home": "Home"
    },
    "hero": {
      "title": "TRADELIA",
      "subtitle": "Curious about crypto, but don't want to start making avoidable mistakes?",
      "description": "In 60 seconds clarify what you really want to do and get a decision coherence check based on academic evidence.",
      "cta": "Start from your goal"
    },
    "footer": {
      "copyright": "© 2026 Tradelia. This tool provides coherence checks, not investment advice.",
      "privacy": "Privacy",
      "disclaimer": "Disclaimer", 
      "contacts": "Contacts"
    }
  }
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export const dictionary = dictionaries[defaultLocale];

export const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};

export const localeMetadata = {
  it: {
    title: 'Tradelia - Verifica coerenza crypto',
    description: 'Check di coerenza decisionale per crypto in 60 secondi.',
    lang: 'it',
    hreflang: 'it-IT',
  },
  en: {
    title: 'Tradelia - Verify crypto coherence',
    description: 'Decision coherence check for crypto in 60 seconds.',
    lang: 'en', 
    hreflang: 'en-US',
  },
};