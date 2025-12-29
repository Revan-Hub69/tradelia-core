// Homepage Content Constants - Centralized for maintainability

export const HOMEPAGE_CONTENT = {
  // Hero Section - Audit 2025: più corto, più definito, meno carico cognitivo
  hero: {
    eyebrowLabel: {
      full: "Educazione crypto, senza fuffa",
      short: "Educazione crypto"
    },
    title: "Educazione crypto, senza fuffa",
    subtitle: {
      line1: "Il mercato crypto è rumoroso.",
      line2: "Tradelia ti aiuta a capire cosa stai guardando, senza promesse e senza segnali."
    },
    description: "Educativo • Graduale • Nessuna decisione richiesta",
    cta: {
      primary: "Inizia dal primo passo",
      secondary: "Come funziona →",
      subtitle: "Nessuna registrazione. Nessuna decisione. Solo orientamento iniziale."
    }
  },

  // Why Exists Section - Audit: sposta colpa dal lettore al sistema
  whyExists: {
    title: "Se ti senti confuso, non è un problema tuo",
    subtitle: "Nel mondo crypto, numeri e spiegazioni vengono spesso presentati fuori contesto, rendendo difficile capire cosa è informazione e cosa è fuffa.",
    message: "Tradelia parte da qui: ridurre il rumore, non aggiungerne altro."
  },

  // What Is Tradelia Section - Audit: più istituzionale, introduce bias senza jargon
  whatIsTradelia: {
    title: "Cos'è Tradelia",
    subtitle: "Un sistema educativo che aiuta a leggere i dati crypto senza distorsioni cognitive",
    whatWeDo: {
      title: "Tradelia fa",
      items: [
        "Spiega concetti con esempi reali",
        "Mostra errori comuni, senza giudizio", 
        "Fornisce regole pratiche di sicurezza"
      ]
    },
    whatWeDont: {
      title: "Tradelia NON fa",
      items: [
        "Segnali di trading",
        "Promesse di guadagno",
        "Consigli \"compra / vendi\""
      ]
    },
    howItWorks: {
      title: "Come funziona",
      description: "Sempre con lo stesso schema:",
      schema: "Esempio reale → Spiegazione → Errore comune → Regola di sicurezza",
      subtitle: "Pochi minuti alla volta. Un concetto alla volta. Nessuna decisione richiesta."
    }
  },

  // Final CTA Section - Audit: più concreto per l'ultimo click
  finalCta: {
    title: "Da dove si inizia",
    description: "Dal punto più comune: imparare a leggere numeri e concetti spesso usati fuori contesto dall'hype crypto.",
    cta: "Inizia dal primo passo"
  },

  // Footer - Audit: correzioni minime
  footer: {
    links: [
      { href: "/dashboard/start", label: "Inizia Qui" },
      { href: "/dashboard/metodo", label: "Metodo e fonti" },
      { href: "/about", label: "Il progetto" },
      { href: "/privacy", label: "Privacy" }
    ],
    disclaimer: "Tradelia è un progetto educativo. Non fornisce consulenza finanziaria né raccomandazioni operative. Il suo scopo è migliorare la comprensione e ridurre errori comuni nel mondo crypto.",
    copyright: "© 2025 Tradelia. Capire prima di credere. Capire prima di agire."
  }
} as const;

// Navigation Constants
export const NAVIGATION = {
  dashboard: "/dashboard/start",
  mainCta: "/dashboard/start"
} as const;