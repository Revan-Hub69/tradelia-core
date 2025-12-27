export type HorizonSlug = "long-term" | "mid-term" | "short-term" | "intraday";

export type UnitSlug =
  | "principi-di-base"
  | "contesto-macro"
  | "diversificazione"
  | "piano-di-uscita"
  | "gestione-ritmo"
  | "analisi-scenario"
  | "liquidity-check"
  | "stops-dinamici";

export interface LearningUnit {
  slug: UnitSlug;
  title: string;
  summary: string;
  completion: number;
  error: string;
  rule: string;
  checklist: string[];
  example: string;
  sources: string[];
}

export interface PathOverview {
  slug: HorizonSlug;
  title: string;
  description: string;
  riskNote?: string;
  units: LearningUnit[];
}

export const pathOverviews: PathOverview[] = [
  {
    slug: "long-term",
    title: "Lungo termine",
    description:
      "Percorso orientato a preservare capitale e crescere in modo disciplinato su orizzonti pluriennali.",
    units: [
      {
        slug: "principi-di-base",
        title: "Principi di base",
        summary: "Allineare gli obiettivi finanziari con la tolleranza al rischio.",
        completion: 40,
        error: "Confondere orizzonte temporale con propensione al rischio individuale.",
        rule: "Separare bisogni di liquidità a breve da investimenti strategici a lungo orizzonte.",
        checklist: [
          "Definire bisogni di cassa nei prossimi 24 mesi.",
          "Vincolare solo capitale che può restare investito per almeno 5 anni.",
          "Documentare criteri di ribilanciamento annuale.",
        ],
        example:
          "Un portafoglio 60/40 viene mantenuto stabile, con ribilanciamento annuale che riduce l'esposizione azionaria dopo un rally prolungato.",
        sources: [
          "Bodie, Kane, Marcus - Investments",
          "Dimson, Marsh, Staunton - Triumph of the Optimists",
        ],
      },
      {
        slug: "diversificazione",
        title: "Diversificazione",
        summary: "Gestire correlazioni e rischi di concentrazione.",
        completion: 25,
        error:
          "Sovrappesare un singolo settore perché percepito come 'sicuro' senza analisi di correlazione.",
        rule: "Costruire esposizioni complementari tra asset azionari, obbligazionari e liquidità.",
        checklist: [
          "Mappare le prime 5 posizioni per peso e settore.",
          "Verificare correlazioni storiche a 3 anni tra asset principali.",
          "Fissare soglie massime per singolo emittente e area geografica.",
        ],
        example:
          "Ridurre un'esposizione eccessiva a titoli tecnologici reinvestendo parte in Treasury e strumenti indicizzati all'inflazione.",
        sources: ["Markowitz - Portfolio Selection", "Ilmanen - Expected Returns"],
      },
    ],
  },
  {
    slug: "mid-term",
    title: "Medio termine",
    description:
      "Percorso per orizzonti di 1-3 anni, con attenzione a scenari macro e gestione della volatilità intermedia.",
    units: [
      {
        slug: "contesto-macro",
        title: "Contesto macro",
        summary: "Integrare variabili macroeconomiche nel piano di investimento.",
        completion: 30,
        error: "Sovrastimare l'impatto di un singolo dato macro ignorando la tendenza di fondo.",
        rule: "Valutare scenari probabilistici e non previsioni puntuali su inflazione e tassi.",
        checklist: [
          "Raccogliere serie storiche di inflazione, tassi policy e PMI.",
          "Formulare due scenari alternativi con driver chiave e probabilità.",
          "Definire soglie di revisione del portafoglio legate a scenari macro.",
        ],
        example:
          "Se l'inflazione core resta sopra target per tre trimestri, aumentare la quota di strumenti indicizzati e ridurre duration obbligazionaria.",
        sources: ["Blanchard - Macroeconomics", "Clarida, Gali, Gertler - The Science of Monetary Policy"],
      },
      {
        slug: "analisi-scenario",
        title: "Analisi di scenario",
        summary: "Simulare shock di mercato per anticipare piani di difesa.",
        completion: 10,
        error: "Sottovalutare la velocità con cui gli spread di credito possono ampliarsi.",
        rule: "Costruire scenari di stress coerenti con la liquidità dei sottostanti.",
        checklist: [
          "Definire variazioni simultanee su tassi, spread e FX.",
          "Stimare impatto su NAV e requisiti di margine.",
          "Stabilire trigger di riduzione leva in base allo stress test.",
        ],
        example:
          "Uno scenario di rialzo tassi di 150 bps e ampliamento spread di 80 bps riduce il valore del portafoglio del 6%; il piano prevede riduzione leva a 0,5x.",
        sources: ["BIS - Stress Testing Principles", "Crouhy, Galai, Mark - Risk Management"],
      },
    ],
  },
  {
    slug: "short-term",
    title: "Breve termine",
    description:
      "Percorso per gestire finestre di investimento di alcuni mesi con disciplina di uscita e liquidità.",
    units: [
      {
        slug: "liquidity-check",
        title: "Verifica liquidità",
        summary: "Valutare profondità di mercato e costi impliciti.",
        completion: 50,
        error: "Entrare su strumenti sottili senza considerare il costo di impatto prezzo.",
        rule: "Operare solo su strumenti con volumi coerenti al proprio sizing e con spread verificati.",
        checklist: [
          "Controllare volumi medi e book di negoziazione.",
          "Stimare costo di uscita a diverse condizioni di mercato.",
          "Prevedere alternativa di liquidazione in più sessioni.",
        ],
        example:
          "Prima di assumere posizione su un ETF tematico con volumi ridotti, fissare un limite di dimensione pari al 20% del volume medio giornaliero.",
        sources: ["Harris - Trading and Exchanges", "Hasbrouck - Empirical Market Microstructure"],
      },
      {
        slug: "piano-di-uscita",
        title: "Piano di uscita",
        summary: "Definire ex ante soglie di uscita e revisione.",
        completion: 35,
        error: "Rinviare la chiusura di posizioni in perdita sperando in un rimbalzo repentino.",
        rule: "Stabilire livelli di take-profit e stop loss misurati sul rischio di portafoglio complessivo.",
        checklist: [
          "Fissare stop loss percentuali coerenti con la volatilità del titolo.",
          "Indicare condizioni di trailing stop e review settimanale.",
          "Documentare eccezioni ammesse e processo di approvazione.",
        ],
        example:
          "Su un titolo con volatilità annua del 25%, lo stop iniziale è posto al -6% e rivisto settimanalmente con trailing di 3%.",
        sources: ["Hendl and Pritsker - Liquidity Risk Measurement", "Reilly & Brown - Investment Analysis"],
      },
    ],
  },
  {
    slug: "intraday",
    title: "Intraday",
    description:
      "Percorso focalizzato su operatività giornaliera con elevato rischio esecutivo e decisionale.",
    riskNote:
      "Operatività intraday comporta perdita rapida del capitale: richiede limiti di rischio formalizzati e monitoraggio continuo.",
    units: [
      {
        slug: "gestione-ritmo",
        title: "Gestione del ritmo",
        summary: "Stabilire finestre di osservazione e pause obbligatorie.",
        completion: 15,
        error: "Aumentare la frequenza operativa dopo una perdita per recuperare velocemente.",
        rule: "Limitare numero di decisioni consecutive e introdurre pause di controllo.",
        checklist: [
          "Fissare massimo operazioni per fascia oraria.",
          "Introdurre pausa di 15 minuti dopo due stop consecutivi.",
          "Documentare valutazione post-sessione con metriche di disciplina.",
        ],
        example:
          "Dopo due esecuzioni chiuse in perdita, il piano blocca nuove operazioni per 30 minuti e richiede verifica dei livelli di rischio residuo.",
        sources: ["Kahneman - Thinking, Fast and Slow", "Barber & Odean - Trading is Hazardous to Your Wealth"],
      },
      {
        slug: "stops-dinamici",
        title: "Stops dinamici",
        summary: "Aggiornare rapidamente i limiti di perdita su base di volatilità intraday.",
        completion: 5,
        error: "Spostare gli stop più lontano dal prezzo per evitare l'uscita, aumentando l'esposizione.",
        rule: "Calcolare stop su volatilità realizzata e ridurre dimensione se la volatilità sale.",
        checklist: [
          "Calcolare range medio a 30 minuti per definire stop tecnici.",
          "Ridurre il size se il range supera del 30% la media.",
          "Archiviare motivazioni di ogni modifica agli stop.",
        ],
        example:
          "Su un cross FX con range medio di 15 pips, lo stop iniziale è 12 pips; se il range sale a 20 pips, il size viene dimezzato.",
        sources: ["Hull - Risk Management and Financial Institutions", "BIS - FX Global Code"],
      },
    ],
  },
];

export function getPathBySlug(slug: string) {
  return pathOverviews.find((path) => path.slug === slug);
}

export function getUnit(horizon: string, unitSlug: string) {
  const path = getPathBySlug(horizon);
  return path?.units.find((unit) => unit.slug === unitSlug);
}
