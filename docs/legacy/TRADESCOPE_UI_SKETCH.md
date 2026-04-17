# Tradelia TradeScope – UI Sketch Mobile-First

## Panoramica Architettura Pagina

```
┌─────────────────────────────────────────┐
│  [Navbar: Logo | Net Return | Exposure  │
│   | Flow | Methodology | Lang Switcher] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       HERO (Above Fold)         │    │
│  │                                 │    │
│  │  "Simula la tua strategia e     │    │
│  │   scopri i costi reali del      │    │
│  │   trading su qualsiasi asset"   │    │
│  │                                 │    │
│  │  [Avvia simulazione – Gratuito] │    │
│  │  "Strumento informativo ·       │    │
│  │   Basato su dati reali"        │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │   mini-line chart       │   │    │
│  │  │   (costo scenario)      │   │    │
│  │  └─────────────────────────┘   │    │
│  │  ETF €21 | CFD €57 | Futures€25│    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  STEP 1: DEFINISCI SCENARIO     │    │
│  │  ─────────────────────────────   │    │
│  │  [Dropdown: Seleziona Asset]    │    │
│  │  [Input: Capitale] [Slider: Leva]│    │
│  │                                 │    │
│  │  Orizzonte:                     │    │
│  │  [Scalping][Intraday][Multi][Lungo]│ │
│  │                                 │    │
│  │  Strategia:                     │    │
│  │  [Breakout][Momentum][Spiky]    │    │
│  │  [Pullback][Carry]              │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │  mini-bar: costo stimato│   │    │
│  │  └─────────────────────────┘   │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  STEP 2: ANALISI DATI REALI     │    │
│  │  ─────────────────────────────   │    │
│  │  "Il simulatore calcola costi   │    │
│  │   reali dai dati misurati..."   │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │  HEATMAP / RADAR CHART  │   │    │
│  │  │  X=strumenti, Y=efficienza│   │
│  │  │  verde=alta, rosso=bassa │   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  ┌─────────┐ ┌─────────┐       │    │
│  │  │ Broker A│ │ Broker B│       │    │
│  │  │ €25     │ │ €57     │       │    │
│  │  │ ★Alta   │ │ ★Media  │       │    │
│  │  └─────────┘ └─────────┘       │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  STEP 3: CONFRONTO E INSIGHT    │    │
│  │  ─────────────────────────────   │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │   STACKED BAR CHART    │   │    │
│  │  │  (costo per strumento) │   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │   LINE CHART           │   │    │
│  │  │  (capitale vs costi)   │   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │ TABELLA DINAMICA       │   │    │
│  │  │ Strum | Broker | Costo  │   │    │
│  │  │ ETF    | C     | €21    │   │    │
│  │  │ CFD    | B     | €57    │   │    │
│  │  │ Futur  | A     | €25    │   │    │
│  │  │ Opzion | D     | €49    │   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  ┌──┐ ┌──┐ ┌──┐                │    │
│  │  │🏆│ │2 │ │3 │ ← Top N cards  │    │
│  │  │ETF│ │Fut│ │Opt│                │    │
│  │  └──┘ └──┘ └──┘                │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  STRUMENTI A CONFRONTO         │    │
│  │  ─────────────────────────────   │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐   │    │
│  │  │    BUBBLE CHART        │   │    │
│  │  │  size=costo, color=effi │   │    │
│  │  └─────────────────────────┘   │    │
│  │                                 │    │
│  │  ETF     ████ basso costo      │    │
│  │  CFD     ██████ leva+spread   │    │
│  │  Futures ████ rollover         │    │
│  │  Opzioni █████ theta+comm     │    │
│  │                                 │    │
│  │  [sparkline] [sparkline]...  │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  PERCHÉ È DIVERSO              │    │
│  │  ─────────────────────────────   │    │
│  │                                 │    │
│  │  📊 Database costi reali       │    │
│  │  🏅 Classifiche oggettive      │    │
│  │  ⚖️ Confronto omogeneo         │    │
│  │  🔄 Aggiornamento costante     │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  FAQ + FOOTER                  │    │
│  │  ─────────────────────────────   │    │
│  │  Posso scegliere broker?       │    │
│  │  → No, seleziona top per scen │    │
│  │                                 │    │
│  │  [Newsletter]                  │    │
│  │  [Disclaimer]                  │    │
│  │  [Menu: Prod|Road|Blog|Cont]   │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Componenti UI – Specifiche Tecniche

### 1. Hero Section

```
┌──────────────────────────────────────┐
│  TITOLO H1                           │
│  font-size: 2.5rem (mobile)          │
│  font-size: 4rem (desktop)           │
│  font-weight: 700                    │
│  line-height: 1.2                    │
│  max-width: 600px                    │
├──────────────────────────────────────┤
│  SOTTOTITOLO                         │
│  font-size: 1rem (mobile)            │
│  font-size: 1.25rem (desktop)       │
│  color: text-muted                   │
│  max-width: 500px                    │
├──────────────────────────────────────┤
│  CTA BUTTON                          │
│  height: 48px (mobile)               │
│  height: 52px (desktop)              │
│  padding: 16px 32px                  │
│  background: primary                 │
│  text: "Avvia simulazione – Gratuito"│
│  border-radius: 12px                 │
├──────────────────────────────────────┤
│  HERO CHART (mini-line/area)         │
│  height: 120px (mobile)              │
│  height: 180px (desktop)             │
│  animation: fade-in 0.5s             │
│  data: costi stimati per asset       │
├──────────────────────────────────────┤
│  KPI STRIP                           │
│  display: flex                       │
│  gap: 16px                           │
│  items: ETF €21 | CFD €57 | Fut €25  │
│  font-size: 12px                     │
│  color: text-muted-foreground        │
└──────────────────────────────────────┘
```

### 2. Step 1: Definisci Scenario

```
┌──────────────────────────────────────┐
│  SECTION HEADER                      │
│  text: "Step 1 – Definisci scenario" │
│  badge: "1/3"                        │
├──────────────────────────────────────┤
│  ASSET DROPDOWN                      │
│  width: 100%                         │
│  search: enabled                     │
│  placeholder: "Seleziona asset..."   │
│  options: Azioni, ETF, Forex, Crypto │
├──────────────────────────────────────┤
│  CAPITALE + LEVA                    │
│  ┌────────────────┐ ┌─────────────┐  │
│  │ Capitale:      │ │ Leva:        │  │
│  │ [€10.000    ]  │ │ [====●===]  │  │
│  │ type: number   │ │ 1x - 30x    │  │
│  └────────────────┘ └─────────────┘  │
├──────────────────────────────────────┤
│  ORIZZONTE TEMPORALE (pill buttons) │
│  display: flex, gap: 8px, wrap        │
│  [Scalping] [Intraday] [Multi-day]  │
│  [Lungo termine]                    │
│  selected: bg-primary, text-white    │
├──────────────────────────────────────┤
│  STRATEGIA OPERATIVA                │
│  display: flex, gap: 8px, wrap        │
│  filtered-by: orizzonte selezionato  │
│  [Breakout] [Momentum] [Spiky]       │
│  [Pullback] [Carry/Income]           │
├──────────────────────────────────────┤
│  MINI-BAR PREVIEW                    │
│  height: 60px                        │
│  update: on-change input             │
│  label: "Costo stimato: €XX"         │
└──────────────────────────────────────┘
```

### 3. Step 2: Analisi Dati Reali

```
┌──────────────────────────────────────┐
│  SECTION HEADER                      │
│  text: "Step 2 – Analisi basata su   │
│         dati reali"                 │
│  badge: "2/3"                        │
├──────────────────────────────────────┤
│  INTRO TEXT                          │
│  "Il simulatore applica costi reali │
│   misurati e genera classifiche..." │
├──────────────────────────────────────┤
│  RADAR/HEATMAP CHART                 │
│  size: 280px x 280px (mobile)       │
│  size: 400px x 400px (desktop)      │
│  axes: 5 (ETF, CFD, Futures, Opt,  │
│         Cert)                        │
│  metrics: cost, efficiency, risk    │
│  colors: green→yellow→red           │
├──────────────────────────────────────┤
│  BROKER CARDS (horizontal scroll)   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  │ Broker A│ │ Broker B│ │ Broker C││
│  │ €25     │ │ €57     │ │ €31     ││
│  │ ★Alta   │ │ ★Media  │ │ ★Alta   ││
│  │ 120px   │ │ 120px   │ │ 120px   ││
│  └─────────┘ └─────────┘ └─────────┘│
│  scroll: horizontal, snap           │
└──────────────────────────────────────┘
```

### 4. Step 3: Confronto e Insight

```
┌──────────────────────────────────────┐
│  SECTION HEADER                      │
│  text: "Step 3 – Confronto e insight"│
│  badge: "3/3"                        │
├──────────────────────────────────────┤
│  STACKED BAR CHART                   │
│  height: 200px (mobile)              │
│  height: 280px (desktop)             │
│  bars: 5 (one per strumento)         │
│  segments: cost + net return         │
│  legend: below chart                │
├──────────────────────────────────────┤
│  LINE CHART (capitale vs costi)     │
│  height: 160px                       │
│  x-axis: capitale (0-100k)           │
│  y-axis: costi stimati               │
│  lines: per strumento                │
│  tooltip: on-hover                   │
├──────────────────────────────────────┤
│  TABELLA DINAMICA                    │
│  cols: Strumento | Broker | Costo   │
│       | Efficienza | Rank S | Rank B│
│  rows: 5 (ETF, CFD, Futures, Opt,  │
│         Cert)                        │
│  sort: enabled                       │
│  scroll: horizontal mobile          │
├──────────────────────────────────────┤
│  TOP N CARDS                         │
│  display: flex, gap: 12px            │
│  count: 3 (gold, silver, bronze)     │
│  content: strumento + costo + badge │
└──────────────────────────────────────┘
```

### 5. Strumenti a Confronto

```
┌──────────────────────────────────────┐
│  SECTION HEADER                      │
│  text: "Strumenti a confronto"       │
├──────────────────────────────────────┤
│  BUBBLE CHART                        │
│  size: 100% width, 240px height     │
│  x-axis: costo totale               │
│  y-axis: efficienza                 │
│  bubble-size: leverage              │
│  colors: gradient green→red          │
├──────────────────────────────────────┤
│  STRUMENT LIST                       │
│  ┌─────────────────────────────────┐│
│  │ ETF    │ ████ │ basso costo    ││
│  │        │ [sparkline]            ││
│  ├─────────────────────────────────┤│
│  │ CFD    │ ██████ │ leva+spread  ││
│  │        │ [sparkline]            ││
│  ├─────────────────────────────────┤│
│  │ Futur  │ ████ │ rollover       ││
│  │        │ [sparkline]            ││
│  └─────────────────────────────────┘│
└──────────────────────────────────────┘
```

### 6. Perché È Diverso

```
┌──────────────────────────────────────┐
│  SECTION HEADER                      │
│  text: "Perché TradeScope è diverso" │
├──────────────────────────────────────┤
│  FEATURE LIST                        │
│  ┌────────────────┐                 │
│  │ 📊 [icon]      │ Database costi  │
│  │   Database     │ reali misurati  │
│  └────────────────┘                 │
│  ┌────────────────┐                 │
│  │ 🏅 [icon]      │ Classifiche     │
│  │   Classifiche  │ oggettive      │
│  └────────────────┘                 │
│  ┌────────────────┐                 │
│  │ ⚖️ [icon]      │ Confronto      │
│  │   Confronto    │ omogeneo       │
│  └────────────────┘                 │
│  ┌────────────────┐                 │
│  │ 🔄 [icon]      │ Aggiornamento  │
│  │   Aggiornam.  │ costante       │
│  └────────────────┘                 │
└──────────────────────────────────────┘
```

### 7. FAQ + Footer

```
┌──────────────────────────────────────┐
│  FAQ ACCORDION                       │
│  ┌─────────────────────────────────┐│
│  │ ? Posso scegliere broker?       ││
│  │ ▼ No, seleziona top per scen   ││
│  ├─────────────────────────────────┤│
│  │ ? Quali asset posso simulare?  ││
│  │ ▼ Azioni, ETF, Forex, Crypto   ││
│  ├─────────────────────────────────┤│
│  │ ? I valori sono garantiti?     ││
│  │ ▼ No, stimati su dati reali   ││
│  └─────────────────────────────────┘│
├──────────────────────────────────────┤
│  FOOTER                              │
│  │ Tradelia – Simula i costi reali │
│  ├─────────────────────────────────┤
│  │ [Newsletter signup]            │
│  ├─────────────────────────────────┤
│  │ Prodotto | Roadmap | Blog |    │
│  │ Community | Contatto           │
│  ├─────────────────────────────────┤
│  │ Disclaimer rischio + Copyright │
└──────────────────────────────────────┘
```

---

## Specifiche Responsive

### Mobile (< 640px)
- Hero: full-width, stacked
- Step pills: 2x2 grid
- Charts: stacked, scroll-x
- Table: scroll-x
- Cards: 1 column

### Tablet (640px - 1024px)
- Hero: side-by-side text + chart
- Step pills: inline
- Charts: 2-column grid
- Cards: 2-column

### Desktop (> 1024px)
- Max-width container: 1280px
- Charts: full size
- Cards: 3-4 column grid

---

## Micro-Interazioni

| Componente | Interazione | Durata |
|------------|-------------|--------|
| Hero chart | fade-in animation | 0.5s |
| Pill buttons | scale on hover | 150ms |
| Input slider | real-time preview | - |
| Chart tooltips | fade-in on hover | 200ms |
| Table rows | highlight on hover | - |
| FAQ accordion | slide toggle | 300ms |
| Top N cards | bounce on appear | 400ms |

---

## Color Palette (da CSS variables)

- `--primary`: #0A0F1C (brand)
- `--primary-foreground`: #FFFFFF
- `--secondary`: #1E293B
- `--accent`: #3B82F6 (highlights)
- `--success`: #22C55E (alta efficienza)
- `--warning`: #EAB308 (media efficienza)
- `--danger`: #EF4444 (bassa efficienza)
- `--muted`: #64748B
- `--border`: #E2E8F0

---

## Font Stack

- Headings: `var(--font-heading)` - Inter/sans-serif
- Body: `var(--font-body)` - Inter/sans-serif
- Mono (data): `var(--font-mono)` - JetBrains Mono

---

## Prossimi Step

1. Implementare Hero con mini-line chart
2. Implementare Step 1 con form + mini-preview
3. Implementare Step 2 con radar + broker cards
4. Implementare Step 3 con stacked bar + table
5. Implementare Strumenti section
6. Implementare WhyDifferent + FAQ

---

*Documento generato per front-end developer*
*Ultimo aggiornamento: 2026-04-03*