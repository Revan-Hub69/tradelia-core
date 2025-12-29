// Fear & Greed Index - Analisi educativa hardcoded
// Approccio Tradelia: educativo, preciso, antifuffa

export interface FearGreedBand {
  id: number
  range: string
  name: string
  textClass: string
  bgClass: string
  borderClass: string
  colorVar: string
  interpretation: string
  cognitiveRisk: string
  commonMistake: string
  correctUse: string
  guidedReflection: string
  methodologicalNote: string
}

export const FEAR_GREED_BANDS: FearGreedBand[] = [
  {
    id: 1,
    range: "0-25",
    name: "PAURA ESTREMA",
    textClass: "text-error",
    bgClass: "bg-error",
    borderClass: "border-error",
    colorVar: "error",
    interpretation: "Il mercato è dominato da panico e pessimismo diffuso. Gli investitori vendono spinti dalla paura, spesso prendendo decisioni affrettate per evitare ulteriori perdite.",
    cognitiveRisk: "Avversione alle perdite: si tende a vendere per evitare il dolore emotivo, non per ragioni strategiche.",
    commonMistake: "Pensare che 'paura estrema = momento perfetto per comprare'. La paura può durare mesi e i prezzi possono scendere ancora.",
    correctUse: "Usalo per chiederti: 'Sto vendendo per paura o per strategia?' Non per timing di mercato, ma per auto-consapevolezza.",
    guidedReflection: "Le mie decisioni sono guidate dalla paura del momento o da una strategia pianificata?",
    methodologicalNote: "I periodi di paura estrema possono durare mesi. Non indicano necessariamente che il mercato abbia toccato il fondo."
  },
  {
    id: 2,
    range: "26-45", 
    name: "PAURA",
    textClass: "text-warning",
    bgClass: "bg-warning",
    borderClass: "border-warning",
    colorVar: "warning",
    interpretation: "Il sentiment è negativo ma controllato. Prevalgono cautela e incertezza, con una tendenza a ridurre l'esposizione al rischio.",
    cognitiveRisk: "Bias di recenza: gli eventi negativi recenti influenzano troppo le decisioni, oscurando il quadro generale.",
    commonMistake: "Evitare completamente il mercato perché 'le cose vanno male'. La cautela è giusta, ma l'evitamento totale può far perdere opportunità.",
    correctUse: "Momento ideale per rivedere la tua strategia di rischio. Non per comprare o vendere, ma per valutare se la tua allocazione è ancora appropriata.",
    guidedReflection: "Sto riducendo i rischi per strategia o perché temo che la situazione possa peggiorare?",
    methodologicalNote: "La paura non è sempre sbagliata: a volte riflette rischi reali che meritano attenzione."
  },
  {
    id: 3,
    range: "46-55",
    name: "NEUTRALE",
    textClass: "text-muted-foreground",
    bgClass: "bg-muted-foreground",
    borderClass: "border-muted-foreground",
    colorVar: "muted-foreground",
    interpretation: "Il mercato è in equilibrio emotivo. Non prevalgono né paura né avidità, creando un ambiente relativamente razionale.",
    cognitiveRisk: "Eccesso di fiducia: si può sovrastimare la propria capacità di controllo quando tutto sembra calmo.",
    commonMistake: "Pensare che 'neutrale = sicuro' e aumentare l'esposizione. La calma può essere ingannevole e precedere movimenti bruschi.",
    correctUse: "Momento migliore per prendere decisioni ponderate. Usa questa fase per pianificare, non per rilassarti completamente.",
    guidedReflection: "Sto prendendo decisioni ponderate o mi sto cullando in una falsa sicurezza?",
    methodologicalNote: "I periodi neutrali sono spesso transitori. La calma può precedere movimenti significativi in entrambe le direzioni."
  },
  {
    id: 4,
    range: "56-75",
    name: "AVIDITÀ",
    textClass: "text-info",
    bgClass: "bg-info",
    borderClass: "border-info",
    colorVar: "info",
    interpretation: "Il mercato mostra ottimismo crescente. Aumentano la fiducia negli investimenti e la propensione ad assumere maggiori rischi.",
    cognitiveRisk: "Eccesso di ottimismo: si sottovalutano i rischi perché le cose stanno andando bene.",
    commonMistake: "Aumentare drasticamente l'esposizione perché 'il trend è positivo'. L'avidità può portare a sovraesposizione proprio prima di correzioni.",
    correctUse: "Momento per verificare se stai rispettando i tuoi limiti di rischio. Non per vendere tutto, ma per controllare che l'entusiasmo non ti stia facendo deviare dal piano.",
    guidedReflection: "Sto aumentando i rischi seguendo una strategia o per paura di perdere opportunità?",
    methodologicalNote: "L'avidità può alimentare trend positivi prolungati, ma rende il sistema più fragile a shock esterni."
  },
  {
    id: 5,
    range: "76-100",
    name: "AVIDITÀ ESTREMA",
    textClass: "text-success",
    bgClass: "bg-success",
    borderClass: "border-success",
    colorVar: "success",
    interpretation: "Il sentiment è dominato da euforia e ottimismo eccessivo. Prevalgono narrazioni semplicistiche e consenso diffuso sui rialzi.",
    cognitiveRisk: "Comportamento gregario: si seguono le decisioni della massa per paura di restare esclusi dalle opportunità.",
    commonMistake: "Entrare nel mercato proprio ora perché 'tutti stanno guadagnando'. L'avidità estrema spesso coincide con i picchi di prezzo.",
    correctUse: "Momento per la massima cautela e auto-riflessione. Chiediti se le tue decisioni sono basate su analisi o sull'euforia generale.",
    guidedReflection: "Le mie scelte si basano su analisi concrete o sull'entusiasmo generale del momento?",
    methodologicalNote: "L'avidità estrema non predice crolli immediati, ma segnala che il mercato è emotivamente sovraesposto."
  }
]

export function getFearGreedBand(value: number): FearGreedBand {
  if (value <= 25) return FEAR_GREED_BANDS[0]
  if (value <= 45) return FEAR_GREED_BANDS[1]
  if (value <= 55) return FEAR_GREED_BANDS[2]
  if (value <= 75) return FEAR_GREED_BANDS[3]
  return FEAR_GREED_BANDS[4]
}

// Definizione accademica dell'indicatore
export const FEAR_GREED_DEFINITION = {
  title: "Indice Paura & Avidità (Crypto)",
  subtitle: "Definizione accademica",
  definition: "L'Indice Paura & Avidità è uno strumento che misura le emozioni collettive degli investitori nel mercato delle criptovalute. Utilizza una scala da 0 (paura estrema) a 100 (avidità estrema) per quantificare il sentiment di mercato.",
  keyPoint: "Questo indicatore non valuta il valore reale degli asset, ma fotografa il clima emotivo degli investitori.",
  
  methodology: {
    title: "Come viene calcolato (Alternative.me)",
    description: "L'indice combina 6 fattori diversi, ognuno con un peso specifico nel calcolo finale:",
    factors: [
      "Volatilità (25%) — quanto il prezzo oscilla rispetto alla media storica",
      "Volume e slancio (25%) — intensità e direzione degli scambi", 
      "Social media (15%) — sentiment e coinvolgimento sui social",
      "Dominanza Bitcoin (10%) — variazioni nel peso di Bitcoin sul mercato",
      "Ricerche Google (10%) — interesse del pubblico generale",
      "Sondaggi (15%) — opinioni dirette degli investitori (quando disponibili)"
    ],
    source: "Dati forniti da Alternative.me (dal 2018)"
  },

  theoreticalBase: {
    title: "Fondamenti teorici (psicologia degli investimenti)",
    description: "L'indice si basa sui principi della finanza comportamentale, in particolare sulla Teoria del Prospetto, che spiega come le persone:",
    principles: [
      "temono le perdite più di quanto apprezzino i guadagni equivalenti",
      "prendono decisioni irrazionali quando sono sotto stress o in euforia", 
      "si fanno influenzare dal comportamento degli altri investitori"
    ],
    reference: "Studio di riferimento: Daniel Kahneman & Amos Tversky (1979) — Prospect Theory: An Analysis of Decision under Risk, Econometrica"
  }
}

// Metodo di lettura Tradelia
export const TRADELIA_METHOD = {
  title: "Come interpretiamo l'indice in Tradelia",
  principles: [
    "Misura le emozioni del mercato, non la qualità degli investimenti",
    "I valori estremi indicano possibili errori di valutazione collettivi",
    "È uno strumento di auto-riflessione, non di decisione operativa",
    "Va sempre considerato insieme al contesto di mercato e ai tuoi obiettivi"
  ],
  
  usage: {
    title: "Utilizzo pratico dell'indice",
    notUsedFor: [
      "decidere quando comprare",
      "decidere quando vendere", 
      "prevedere massimi e minimi di mercato"
    ],
    usedFor: [
      "riconoscere quando le tue decisioni potrebbero essere influenzate dalle emozioni",
      "ricordarti di mantenere la lucidità nei momenti estremi",
      "stimolare domande utili sul tuo comportamento di investitore"
    ],
    keyRule: "Principio fondamentale: più il sentiment è estremo, più è probabile che gli investitori commettano errori."
  },

  limitations: [
    "Non prevede i movimenti futuri dei prezzi",
    "Può restare su valori estremi per lunghi periodi", 
    "Riflette il passato, non anticipa il futuro",
    "Può essere influenzato da mode passeggere sui social media"
  ],

  warnings: [
    "Non è mai un segnale di acquisto o vendita",
    "I mercati possono restare irrazionali più a lungo di quanto tu possa permetterti",
    "A volte il sentiment collettivo ha ragione, altre volte no"
  ]
}