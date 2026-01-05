// Configurazione i18n semplificata
export const locales = ['it', 'en', 'de', 'fr'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'it';

// Dizionario statico per evitare problemi di import
export const dictionary = {
  "nav": {
    "methodology": "Metodologia",
    "verify": "Verifica",
    "home": "Home"
  },
  "hero": {
    "title": "Verifica la coerenza tra il tuo obiettivo e lo strumento finanziario",
    "description": "Uno strumento di verifica neutrale che analizza la compatibilità tra i tuoi obiettivi di investimento e le caratteristiche degli strumenti finanziari disponibili.",
    "cta": "Avvia verifica"
  },
  "context": {
    "eyebrow": "Contesto",
    "title": "I portali di comparazione sono spesso remunerati tramite affiliazioni",
    "description1": "La maggior parte dei servizi di comparazione finanziaria riceve commissioni dai fornitori di prodotti. Questo può influenzare quali strumenti vengono promossi o come vengono presentati.",
    "description2": "Tradelia fornisce verifiche di coerenza basate su criteri oggettivi, senza affiliazioni commerciali con fornitori di prodotti finanziari."
  },
  "how": {
    "eyebrow": "Funzionamento",
    "title": "Tre passaggi per la verifica di coerenza",
    "step1": {
      "title": "1. Definizione obiettivo",
      "description": "Specifichi il tuo obiettivo di investimento: orizzonte temporale, tolleranza al rischio, importo disponibile e finalità dell'investimento."
    },
    "step2": {
      "title": "2. Analisi strumento",
      "description": "Inserisci le caratteristiche dello strumento finanziario che stai considerando: costi, liquidità, rischio, durata minima."
    },
    "step3": {
      "title": "3. Verifica coerenza",
      "description": "Il sistema confronta obiettivo e strumento, evidenziando eventuali incompatibilità secondo criteri di coerenza predefiniti."
    }
  },
  "examples": {
    "eyebrow": "Esempi",
    "title": "Incompatibilità comuni tra obiettivi e strumenti",
    "example1": "Obiettivo a breve termine (6 mesi) con strumento vincolato per 2 anni",
    "example2": "Bassa tolleranza al rischio con investimento in azioni singole",
    "example3": "Costi annuali superiori al 2% per investimenti a lungo termine",
    "badge": "Non coerente"
  },
  "methodology": {
    "eyebrow": "Metodologia",
    "title": "Criteri di verifica basati su standard accademici",
    "description1": "I criteri di coerenza utilizzati sono derivati da principi consolidati della teoria del portafoglio e dalle linee guida degli organismi di vigilanza europei (ESMA, Consob).",
    "description2": "Ogni verifica è tracciabile e basata su parametri oggettivi: non vengono utilizzate valutazioni soggettive o previsioni di mercato."
  },
  "limits": {
    "eyebrow": "Limiti",
    "title": "Cosa non facciamo",
    "limit1": "Non forniamo consigli di investimento personalizzati",
    "limit2": "Non prevediamo performance future degli strumenti",
    "limit3": "Non consideriamo la situazione fiscale individuale",
    "limit4": "Non sostituiamo la consulenza di un consulente qualificato"
  },
  "cta": {
    "title": "Verifica la coerenza del tuo strumento",
    "description": "Inizia la verifica di coerenza tra i tuoi obiettivi e lo strumento finanziario che stai considerando.",
    "button": "Avvia verifica"
  },
  "footer": {
    "copyright": "© 2026 Tradelia. Questo strumento fornisce verifiche di coerenza, non consigli di investimento.",
    "privacy": "Privacy",
    "disclaimer": "Disclaimer",
    "contacts": "Contatti"
  }
};

// Utility per validare locale
export const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};

// Metadata per SEO multilingua
export const localeMetadata = {
  it: {
    title: 'Tradelia - Verifica coerenza strumenti finanziari',
    description: 'Verifica la coerenza tra il tuo obiettivo e lo strumento finanziario.',
    lang: 'it',
    hreflang: 'it-IT',
  },
  en: {
    title: 'Tradelia - Verify financial instrument coherence',
    description: 'Verify the coherence between your objective and the financial instrument.',
    lang: 'en',
    hreflang: 'en-US',
  },
  de: {
    title: 'Tradelia - Kohärenz von Finanzinstrumenten prüfen',
    description: 'Prüfen Sie die Kohärenz zwischen Ihrem Ziel und dem Finanzinstrument.',
    lang: 'de',
    hreflang: 'de-DE',
  },
  fr: {
    title: 'Tradelia - Vérifier la cohérence des instruments financiers',
    description: 'Vérifiez la cohérence entre votre objectif et l\'instrument financier.',
    lang: 'fr',
    hreflang: 'fr-FR',
  },
};