// Homepage Content Constants - Centralized for maintainability

export const HOMEPAGE_CONTENT = {
  // Hero Section
  hero: {
    eyebrowLabel: {
      full: "Educazione Crypto Antifuffa",
      short: "Educazione Antifuffa"
    },
    title: "Il mondo crypto è pieno di hype e confusione",
    subtitle: {
      line1: "Paura, promesse, numeri fuori contesto.",
      line2: "È normale sentirsi disorientati."
    },
    description: "Tradelia è un sistema educativo che ti guida passo dopo passo, senza fretta, senza promesse, senza segnali.",
    cta: {
      primary: "Inizia dal primo passo",
      subtitle: "Nessuna registrazione • Nessuna decisione • Solo orientamento"
    }
  },

  // Why Exists Section
  whyExists: {
    title: "Se ti senti confuso, è normale",
    subtitle: "Nel mondo crypto l'hype rende difficile distinguere informazione da fuffa, anche quando le spiegazioni sembrano «chiare»",
    message: "Tradelia parte da qui: ridurre il rumore, non aggiungerne altro."
  },

  // What Is Tradelia Section
  whatIsTradelia: {
    title: "Cos'è Tradelia",
    subtitle: "Un sistema educativo che riduce il rumore crypto",
    whatWeDo: {
      title: "Tradelia fa questo:",
      items: [
        "Spiega concetti con esempi reali",
        "Mostra errori comuni senza giudizio", 
        "Ti dà regole pratiche di sicurezza"
      ]
    },
    whatWeDont: {
      title: "Tradelia NON fa questo:",
      items: [
        "Segnali di trading",
        "Promesse di guadagno",
        "Consigli \"compra/vendi\""
      ]
    },
    howItWorks: {
      title: "Come funziona",
      description: "Sempre con lo stesso schema: esempio reale → spiegazione → errore comune → regola di sicurezza",
      subtitle: "Pochi minuti alla volta • Un concetto alla volta • Nessuna decisione richiesta"
    }
  },

  // Final CTA Section
  finalCta: {
    title: "Da dove si inizia",
    description: "Dal punto più comune: come l'hype usa numeri e concetti fuori contesto.",
    cta: "Inizia dal primo passo"
  },

  // Footer
  footer: {
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/about", label: "Metodo" },
      { href: "/contact", label: "Contatti" }
    ],
    disclaimer: "Disclaimer: Tradelia è educativo. Non fornisce consulenza finanziaria né raccomandazioni operative. Serve a migliorare la comprensione e ridurre errori comuni nel mondo crypto.",
    copyright: "© 2025 Tradelia. Capire prima di credere. Capire prima di agire."
  }
} as const;

// Navigation Constants
export const NAVIGATION = {
  dashboard: "/dashboard/start"
} as const;