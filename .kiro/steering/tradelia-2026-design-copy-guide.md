# Tradelia 2026 - Design & Copy Guide

**Versione**: 2026.02 - Tradelia non convince. Tradelia chiarifica.

**Definizione**: Dashboard dinamica che evita gli errori nel mondo crypto.

## Principi Fondamentali

### 1. Chiarezza > Persuasione
- Se una frase aumenta l'eccitazione, è sbagliata
- Se aumenta la chiarezza, è giusta
- Nessun growth hacking, nessun funnel manipolativo

### 2. Verificabilità > Opinione
- Ogni affermazione deve essere tracciabile a fonte pubblica
- Nessun dato inventato o stimato
- Nessuna previsione, nessuna promessa

### 3. Neutralità > Bias
- Colori desaturati, palette istituzionale
- Linguaggio neutrale e accademico
- Focus su comprensione, non su azione

## Architettura della Homepage

### Sezioni (in ordine)

1. **Hero** - Statement chiaro (non slogan), CTA discreta
2. **Contesto** - Perché esiste questo strumento, il problema reale
3. **Funzionamento** - Come funziona concretamente (3 step)
4. **Esempi** - Incompatibilità comuni senza numeri inventati
5. **Metodologia** - Fonti e processo di verifica
6. **Limiti** - Cosa non facciamo (onestà intellettuale)
7. **CTA** - Call to action finale, discreto
8. **Footer** - Disclaimer legale

### Spacing & Layout

- **Sezioni grandi**: `section-lg` (py-20 sm:py-32)
- **Sezioni medie**: `section-md` (py-16 sm:py-24)
- **Sezioni piccole**: `section-sm` (py-12 sm:py-16)
- **Padding orizzontale**: px-6 sm:px-8
- **Max-width**: max-w-2xl (672px) - contenuto stretto per leggibilità
- **Bordi**: border-border/50 per separare sezioni
- **Background**: Alternare background e muted/30 per ritmo visivo

## Tipografia

### Headline (h1, h2)
- **h1**: text-3xl sm:text-4xl lg:text-5xl font-bold, letter-spacing: -0.02em
- **h2**: text-xl sm:text-2xl lg:text-3xl font-semibold, letter-spacing: -0.01em
- **h3**: text-base sm:text-lg font-medium
- **Colore**: text-foreground per tutti (NO primary sui titoli)

### Body
- **Paragrafi**: text-sm sm:text-base text-muted-foreground
- **Small**: text-xs text-muted-foreground
- **Eyebrow**: text-xs uppercase tracking-wide text-muted-foreground (NO tracking-wider)

### Contrasto
- **Primario**: text-foreground (7:1 contrast - WCAG AAA)
- **Secondario**: text-muted-foreground (4.5:1 contrast - WCAG AA)

## Palette Colori

### Light Mode
```css
--background: 0 0% 99%;           /* Bianco caldo */
--foreground: 220 15% 12%;        /* Grigio scuro blu */
--primary: 215 50% 45%;           /* Blu desaturato istituzionale */
--muted: 220 10% 96%;             /* Grigio chiaro */
--muted-foreground: 220 10% 40%;  /* Grigio medio (buon contrasto) */
--border: 220 10% 88%;            /* Grigio sottile */
```

### Dark Mode
```css
--background: 220 15% 8%;
--foreground: 220 10% 95%;
--primary: 215 55% 55%;
--muted: 220 15% 15%;
--muted-foreground: 220 10% 60%;
--border: 220 15% 20%;
```

## Componenti

### Card/Box
```tsx
<div className="rounded border border-border/50 bg-background p-5 card-interactive">
  {/* content */}
</div>
```

### List Item
```tsx
<li className="flex items-start gap-3">
  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
  <span className="text-sm text-muted-foreground">{item}</span>
</li>
```

### Button
- **Primary**: `<Button>` - bg-foreground text-background (nero su bianco)
- **Secondary**: `<Button variant="outline">` - border only
- **Size**: `size="lg"` per CTA principale (h-10 px-6)

### Eyebrow
```tsx
<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
  Sezione
</p>
```

### Badge/Tag
```tsx
<span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
  Non coerente
</span>
```

## Copy Guidelines

### Tone of Voice
- **Accademico**: Termini precisi, non colloquiali
- **Diretto**: Frasi brevi, no fluff
- **Neutrale**: Nessun entusiasmo forzato
- **Onesto**: Ammettere i limiti

### Struttura Sezione
1. **Eyebrow**: Categoria/contesto (una parola)
2. **Headline**: Affermazione principale (statement, non domanda)
3. **Body**: Spiegazione concisa
4. **CTA**: Solo se necessario, discreto

### Esempi di Copy

❌ "La compatibilità non è un'opinione. È una verifica."
✅ "Dashboard dinamica che evita gli errori nel mondo crypto."

❌ "73% dei trader retail sceglie strumenti incompatibili"
✅ "I portali di comparazione sono spesso remunerati tramite affiliazioni."

❌ "Pronto a verificare?"
✅ "Verifica la coerenza del tuo strumento"

❌ "Inizia la verifica"
✅ "Avvia verifica"

❌ "Dashboard anti-errori crypto"
✅ "Dashboard dinamica che evita gli errori nel mondo crypto"

## Microinterazioni

### Transizioni
- Durata: 150ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Classe: `transition-subtle`

### Card Hover
```css
.card-interactive:hover {
  border-color: var(--border);
  background: hsl(var(--muted) / 0.3);
  transform: translateY(-1px);
}
```

### Link Interno
```css
.link-internal:hover {
  color: hsl(var(--primary));
}
```

### Animazioni
- **NO**: Bounce, pulse, float, glow, slide-in aggressivi
- **SÌ**: Fade-in sottile (150ms), translateY(-1px) su hover
- **Rispetto**: prefers-reduced-motion

## Accessibilità

- **Contrast**: WCAG AAA (7:1) per testo principale
- **Focus**: 2px outline con offset
- **Semantic HTML**: Heading hierarchy corretta
- **Keyboard**: Tab order logico
- **Motion**: Rispetta prefers-reduced-motion

## Responsive

- **Mobile-first**: Progettare per mobile prima
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Touch**: Minimo 44px per target interattivi
- **Max-width**: max-w-2xl per contenuto (leggibilità ottimale)

## Header

- Altezza: h-14 (56px)
- Logo: 24x24px, minimal
- Nav: Solo 2 link (Metodologia, Verifica)
- Max-width: max-w-2xl (allineato al contenuto)

## Checklist per Nuove Sezioni

- [ ] Eyebrow (una parola)
- [ ] Headline (statement, non domanda)
- [ ] Body (max 2-3 paragrafi)
- [ ] Spacing coerente (section-sm/md/lg)
- [ ] Colori coerenti (border-border/50, bg-muted/30)
- [ ] Nessun dato inventato
- [ ] Fonti verificabili se citati dati
- [ ] Responsive testato
- [ ] Accessibilità verificata

## Regola d'Oro

> Se una frase aumenta l'eccitazione, è sbagliata. Se aumenta la chiarezza, è giusta.

> Se un dato non è verificabile, non lo includiamo.

> Se un design element attira l'attenzione su sé stesso invece che sul contenuto, è sbagliato.
