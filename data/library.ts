export interface LibraryEntry {
  slug: string;
  title: string;
  summary: string;
  definition: string;
  whenUseful: string[];
  whenMisleading: string[];
  sources: string[];
  aiNote: string;
}

export const libraryEntries: LibraryEntry[] = [
  {
    slug: "volatilita",
    title: "Volatilità",
    summary: "Misura della dispersione dei rendimenti e proxy di incertezza.",
    definition:
      "La volatilità annualizzata indica l'intensità media delle oscillazioni del prezzo; va interpretata rispetto all'orizzonte e alla liquidità dello strumento.",
    whenUseful: [
      "Calibrare la dimensione delle posizioni in base al rischio atteso.",
      "Confrontare strumenti alternativi con profili di rischio simili.",
      "Stabilire livelli di stop coerenti con la variabilità intrinseca.",
    ],
    whenMisleading: [
      "Assumere che una bassa volatilità storica implichi stabilità futura.",
      "Concludere che strumenti con volatilità simile abbiano lo stesso rischio di liquidità.",
      "Ignorare gli effetti di correlazioni dinamiche nei periodi di stress.",
    ],
    sources: [
      "Poon & Granger - Forecasting Volatility", "Hull - Options, Futures, and Other Derivatives",
    ],
    aiNote: "Placeholder: la sezione AI verrà arricchita con esempi di valutazione assistita.",
  },
  {
    slug: "trend",
    title: "Trend",
    summary: "Direzione prevalente dei prezzi su un intervallo definito.",
    definition:
      "Il trend descrive la pendenza generale di una serie di prezzi; va validato con regole di conferma e qualità del dato.",
    whenUseful: [
      "Stabilire criteri di ingresso graduale su movimenti consolidati.",
      "Definire trailing stop coerenti con la struttura di mercato.",
      "Coordinare segnali multi-timeframe per evitare conflitti operativi.",
    ],
    whenMisleading: [
      "Forzare letture di trend in mercati laterali con bassa liquidità.",
      "Trascurare l'effetto delle notizie programmate sulla continuità del trend.",
      "Confondere trend di breve con narrativa di lungo termine.",
    ],
    sources: ["Lo, Mamaysky, Wang - Foundations of Technical Analysis", "Murphy - Technical Analysis of the Financial Markets"],
    aiNote: "Placeholder: valutazione automatizzata della coerenza dei segnali in arrivo.",
  },
  {
    slug: "drawdown",
    title: "Drawdown",
    summary: "Massima perdita relativa da un picco precedente.",
    definition:
      "Il drawdown quantifica la profondità delle perdite rispetto a un massimo storico e riflette resilienza e recupero di un portafoglio.",
    whenUseful: [
      "Definire limiti di perdita tollerabili per singolo strumento o portafoglio.",
      "Valutare la coerenza tra strategia dichiarata e profilo di rischio osservato.",
      "Comunicare in modo trasparente le fasi di stress agli stakeholder.",
    ],
    whenMisleading: [
      "Valutare una strategia solo sul drawdown passato senza considerare nuova composizione.",
      "Ignorare la velocità di recupero dopo una perdita profonda.",
      "Confrontare drawdown su orizzonti temporali non omogenei.",
    ],
    sources: ["Calvet, Fisher - Multifractal Volatility", "Agarwal & Naik - Risks and Portfolio Decisions Involving Hedge Funds"],
    aiNote: "Placeholder: alert automatici su soglie di drawdown personalizzate.",
  },
];

export function getLibraryEntry(slug: string) {
  return libraryEntries.find((entry) => entry.slug === slug);
}
