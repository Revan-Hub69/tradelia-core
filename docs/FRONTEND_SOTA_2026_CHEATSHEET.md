# 🔹 SOTA 2026 Front-end Fintech Cheat Sheet

Guida completa per sviluppatori front-end - TradeScope Homepage

---

## 1️⃣ Tipografia e Gerarchia Visiva

```css
/* Font stack - usa le variabili CSS del progetto */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* H1 - Hero / Titolo principale */
h1 {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 2.5rem; /* mobile */
  line-height: 1.2;
}
@media (min-width: 640px) { h1 { font-size: 3rem; } }
@media (min-width: 1024px) { h1 { font-size: 3.5rem; } }

/* H2 - Step principali / sezioni */
h2 {
  font-weight: 600;
  font-size: 1.5rem;
}
@media (min-width: 640px) { h2 { font-size: 2rem; } }

/* H3 - Sottotitoli / card */
h3 {
  font-weight: 500;
  font-size: 1.25rem;
}

/* Body - Testo descrittivo */
p {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
}

/* Micro - Note legali, disclaimer */
.micro-text {
  font-weight: 300;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}
```

---

## 2️⃣ Color Palette / Semaforizzazione

```css
/* Variabili CSS - usa direttamente nel codice */
:root {
  /* Efficienza */
  --efficiency-high: #00B74A;    /* Verde brillante */
  --efficiency-medium: #FFB400;  /* Giallo soft */
  --efficiency-low: #FF3D00;     /* Rosso warning */
  
  /* Accenti */
  --accent: #2F80ED;            /* CTA primari */
  --accent-hover: #1A6ED8;       /* Hover state */
  
  /* Background */
  --bg-card: #FFFFFF;
  --bg-muted: #F8F9FA;
}
```

### Classi Tailwind utility

```html
<!-- Badge efficienza alta -->
<span class="bg-green-500/10 text-green-600 dark:text-green-400">
  Alta
</span>

<!-- Badge efficienza media -->
<span class="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
  Media
</span>

<!-- Badge efficienza bassa -->
<span class="bg-red-500/10 text-red-600 dark:text-red-400">
  Bassa
</span>

<!-- CTA primario -->
<button class="bg-primary text-primary-foreground hover:bg-primary/90">
  Avvia simulazione
</button>

<!-- CTA secondario -->
<button class="border border-input bg-background hover:bg-muted">
  Esplora
</button>
```

---

## 3️⃣ Layout e Grid

```css
/* Breakpoint standard */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Mobile-first spacing */
.space-y-4 { margin-bottom: 1rem; }
.space-y-8 { margin-bottom: 2rem; }
.space-y-12 { margin-bottom: 3rem; }
.space-y-16 { margin-bottom: 4rem; }
```

### Layout Pattern

```html
<!-- Grid 2 colonne (tablet+) -->
<div class="grid gap-8 lg:grid-cols-2">
  <div>Colonna 1</div>
  <div>Colonna 2</div>
</div>

<!-- Grid 4 colonne (desktop) -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>
```

---

## 4️⃣ Componenti Chiave

### Pill Buttons (Orizzonte/Strategia)

```html
<!-- Container -->
<div class="flex flex-wrap gap-2">
  <!-- Non selezionato -->
  <button class="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
    Intraday
  </button>
  
  <!-- Selezionato (attivo) -->
  <button class="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground transition-colors">
    Intraday
  </button>
</div>
```

### Card Broker/Strumento

```html
<div class="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4">
  <div class="flex items-center gap-3">
    <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold">
      1
    </span>
    <div>
      <p class="font-semibold">Broker A</p>
      <p class="text-sm text-muted-foreground">€25 stimato</p>
    </div>
  </div>
  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-600">
    Alta
  </span>
</div>
```

### Input con Slider

```html
<!-- Label + Input -->
<label class="text-sm font-medium">Capitale</label>
<input 
  type="number" 
  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
  min="1000" 
  max="10000000" 
  step="1000"
/>

<!-- Slider -->
<div class="flex items-center gap-2">
  <input 
    type="range" 
    class="flex h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
    min="1" 
    max="30"
    style="background: linear-gradient(to right, var(--primary) 50%, var(--muted) 50%)"
  />
  <span class="font-mono text-sm text-primary">15x</span>
</div>
```

### Mini Preview Bar Chart

```html
<div class="flex h-24 items-end justify-around gap-2">
  <div class="flex flex-col items-center gap-1">
    <div class="w-8 rounded-t-sm bg-primary/60" style="height: 35%"></div>
    <span class="text-xs text-muted-foreground">ETF</span>
    <span class="font-mono text-xs">€21</span>
  </div>
  <!-- Ripeti per ogni strumento -->
</div>
```

---

## 5️⃣ Grafici e Visualizzazioni

### SVG Chart Template

```html
<!-- Area chart container -->
<svg viewBox="0 0 400 120" className="h-auto w-full" aria-hidden="true">
  <!-- Grid lines -->
  <line x1="40" y1="110" x2="380" y2="110" stroke="currentColor" strokeOpacity="0.08" />
  
  <!-- Linea dati -->
  <polyline
    points="40,108 150,90 260,72 380,36"
    fill="none"
    stroke="#22C55E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
```

### Stacked Bar Chart

```html
<div class="flex items-center gap-3">
  <span class="w-16 text-xs font-medium">ETF</span>
  <div class="flex flex-1 items-center gap-1">
    <!-- Net return (primary) -->
    <div class="h-6 rounded-l-sm bg-primary/70" style="width: 79%"></div>
    <!-- Cost drag (red) -->
    <div class="h-6 rounded-r-sm bg-red-500/60" style="width: 21%"></div>
  </div>
</div>
```

### Radar Chart

```html
<svg viewBox="0 0 280 200" className="h-auto w-full">
  <!-- Cerchi di riferimento -->
  <circle cx="140" cy="100" r="70" fill="none" stroke="currentColor" strokeOpacity="0.08" />
  <circle cx="140" cy="100" r="35" fill="none" stroke="currentColor" strokeOpacity="0.08" />
  
  <!-- Poligono dati -->
  <polygon
    points="140,30 210,100 140,170 70,100"
    fill="currentColor"
    fillOpacity="0.15"
    stroke="var(--primary)"
    strokeWidth="2"
  />
</svg>
```

---

## 6️⃣ Input e Scenario (Step 1)

```html
<!-- Section con step indicator -->
<section class="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-4xl">
    <!-- Step badge -->
    <div class="mb-8 flex items-center gap-3">
      <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        1
      </span>
      <p class="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
        Step 1 di 3
      </p>
    </div>
    
    <!-- Contenuto form -->
    <h2 class="mb-6 text-xl font-semibold">Definisci il tuo scenario</h2>
    
    <!-- Campi input -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Input column -->
      <div class="flex flex-col gap-6">
        <!-- Capitale -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Capitale</label>
          <input type="number" class="..." />
        </div>
        
        <!-- Lever slider -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Leva</label>
            <span class="font-mono text-sm text-primary">15x</span>
          </div>
          <input type="range" class="..." />
        </div>
      </div>
      
      <!-- Preview column -->
      <div class="flex flex-col gap-4">
        <div class="rounded-lg border border-border/50 bg-card p-5">
          <!-- Mini bar chart -->
        </div>
        <button class="h-12 w-full bg-primary">Avvia simulazione</button>
      </div>
    </div>
  </div>
</section>
```

---

## 7️⃣ Best Practices SOTA 2026

### Micro-animazioni

```css
/* Transizioni smooth */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
}

.transition-all {
  transition-property: all;
  transition-duration: 300ms;
}

/* Hover scale */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Fade-in per tooltips */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 200ms ease-out;
}
```

### Accessibilità

```html
<!-- ARIA labels -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>

<!-- Focus states -->
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  CTA
</button>

<!-- Screen reader text -->
<span className="sr-only">Menu aperto</span>
```

### Responsive Patterns

```html
<!-- Mobile: stacked, Desktop: side-by-side -->
<div class="grid gap-8 lg:grid-cols-2">
  <!-- Contenuto -->
</div>

<!-- Horizontal scroll per tabelle -->
<div class="overflow-x-auto">
  <table>...</table>
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:flex">...</div>

<!-- Show on mobile, hide on desktop -->
<div class="flex md:hidden">...</div>
```

---

## Quick Reference Card

| Elemento | Classe Tailwind | Note |
|----------|-----------------|------|
| H1 Hero | `text-3xl font-bold` | Mobile-first |
| H2 Sezione | `text-xl font-semibold` | |
| Pill attiva | `bg-primary text-primary-foreground` | |
| Pill inattiva | `bg-muted text-muted-foreground` | |
| Badge verde | `bg-green-500/10 text-green-600` | |
| Badge giallo | `bg-yellow-500/10 text-yellow-600` | |
| Badge rosso | `bg-red-500/10 text-red-600` | |
| Card | `rounded-lg border border-border/50 bg-card p-5` | |
| Input | `h-10 rounded-md border border-input bg-background` | |
| Container | `mx-auto max-w-4xl px-4` | |

---

*Documento per team front-end - TradeScope 2026*
*Generato automaticamente - Non modificare manualmente*