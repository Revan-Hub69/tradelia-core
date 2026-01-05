# SPEC: Homepage 10/10 Tradelia 2026

**Versione**: 2026.02  
**Status**: Draft  
**Priorità**: Critica  

## Obiettivo

Ricostruire completamente la homepage di Tradelia per raggiungere il punteggio 10/10 secondo i principi del Design & Copy Guide Tradelia 2026. La homepage attuale è valutata 4/10 a causa di violazioni gravi dei principi fondamentali.

## Problemi Attuali (4/10)

### 🔴 Critici
1. **Multilingua rotto**: `useLanguage()` e `t()` non funzionano
2. **Palette colori non conforme**: Usa gray-900, red-600, green-600 invece delle CSS variables Tradelia
3. **Architettura sbagliata**: Non segue le 8 sezioni nell'ordine prescritto
4. **Copy eccitante**: "Dashboard anti-errori crypto" viola il principio "Chiarezza > Persuasione"

### 🟡 Secondari
5. **Typography non conforme**: Non usa le classi headline-1, body-text, eyebrow-text
6. **Spacing inconsistente**: Non usa section-lg, section-md, section-sm
7. **Max-width sbagliato**: Usa max-w-4xl invece di max-w-2xl (672px)
8. **Componenti non conformi**: Card e Button non seguono il design system

## Requisiti Funzionali

### R1: Architettura Homepage Conforme
**Priorità**: Critica

La homepage DEVE seguire esattamente questa struttura in ordine:

1. **Hero** - Statement neutrale, CTA discreta
2. **Contesto** - Problema delle affiliazioni nei portali di comparazione
3. **Funzionamento** - 3 step concreti del processo di verifica
4. **Esempi** - Incompatibilità comuni documentate (senza numeri inventati)
5. **Metodologia** - Fonti accademiche verificabili (ESMA, Consob)
6. **Limiti** - Onestà intellettuale completa su cosa NON facciamo
7. **CTA** - Call to action finale discreto
8. **Footer** - Disclaimer metodologico

### R2: Sistema Multilingua Funzionante
**Priorità**: Critica

- Rimuovere dipendenza da `useLanguage()` rotto
- Implementare sistema i18n semplice e funzionante
- Supportare IT (default) e EN
- Usare le traduzioni esistenti in `lib/dictionaries/`

### R3: Design System Tradelia 2026
**Priorità**: Critica

#### Palette Colori
```css
/* OBBLIGATORIO - Usare solo queste CSS variables */
--background: 0 0% 99%;           /* Bianco caldo */
--foreground: 220 15% 12%;        /* Grigio scuro blu */
--primary: 215 50% 45%;           /* Blu desaturato istituzionale */
--muted: 220 10% 96%;             /* Grigio chiaro */
--muted-foreground: 220 10% 40%;  /* Grigio medio */
--border: 220 10% 88%;            /* Grigio sottile */
```

#### Typography
```tsx
/* OBBLIGATORIO - Usare solo queste classi */
h1: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground" + letterSpacing: -0.02em
h2: "text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground" + letterSpacing: -0.01em
h3: "text-base sm:text-lg font-medium text-foreground"
body: "text-sm sm:text-base text-muted-foreground"
eyebrow: "text-xs uppercase tracking-wide text-muted-foreground font-medium"
```

#### Spacing
```tsx
/* OBBLIGATORIO - Usare solo queste classi */
section-lg: "py-20 sm:py-32"
section-md: "py-16 sm:py-24"  
section-sm: "py-12 sm:py-16"
container: "max-w-2xl mx-auto px-6 sm:px-8"
```

### R4: Copy Neutrale e Accademico
**Priorità**: Critica

#### Trasformazioni Obbligatorie
```
❌ "Dashboard anti-errori crypto"
✅ "Verifica la coerenza tra obiettivi e strumenti crypto"

❌ "Inizia la verifica"  
✅ "Avvia verifica"

❌ "Pronto a verificare?"
✅ "Verifica la coerenza del tuo strumento"

❌ Qualsiasi linguaggio eccitante
✅ Terminologia neutra e accademica
```

#### Tone of Voice
- **Accademico**: Termini precisi, non colloquiali
- **Diretto**: Frasi brevi, no fluff
- **Neutrale**: Nessun entusiasmo forzato
- **Onesto**: Ammettere i limiti esplicitamente

## Requisiti Tecnici

### T1: Performance
- Transizioni: 150ms con easing cubic-bezier(0.4, 0, 0.2, 1)
- Rispettare prefers-reduced-motion
- Bundle size ottimizzato

### T2: Accessibilità WCAG AAA
- Contrasto 7:1 per testo principale (text-foreground)
- Contrasto 4.5:1 per testo secondario (text-muted-foreground)
- Focus states con ring-2 ring-foreground
- Semantic HTML corretto
- Keyboard navigation

### T3: Responsive Mobile-First
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch targets minimo 44px
- Max-width: max-w-2xl per leggibilità ottimale

## Implementazione

### Fase 1: Pulizia e Setup
1. Rimuovere dipendenze rotte (`useLanguage`, `HeroSection`, etc.)
2. Implementare CSS variables Tradelia nel globals.css
3. Creare componenti base conformi (Card, Button)

### Fase 2: Architettura
1. Implementare le 8 sezioni nell'ordine corretto
2. Applicare spacing e layout conformi
3. Implementare sistema i18n semplice

### Fase 3: Content e Copy
1. Riscrivere tutto il copy secondo i principi neutrali
2. Aggiungere eyebrow text a ogni sezione
3. Verificare che ogni affermazione sia tracciabile

### Fase 4: Design System
1. Applicare palette colori Tradelia
2. Implementare typography conforme
3. Aggiungere microinterazioni sottili

### Fase 5: Testing e Validazione
1. Test accessibilità WCAG AAA
2. Test responsive su tutti i breakpoints
3. Validazione copy secondo principi Tradelia

## Criteri di Accettazione

### ✅ Homepage 10/10 quando:
- [ ] Architettura: 8 sezioni nell'ordine esatto
- [ ] Multilingua: IT/EN funzionante senza errori
- [ ] Palette: Solo CSS variables Tradelia, zero colori hardcoded
- [ ] Typography: Solo classi conformi, contrasti WCAG AAA
- [ ] Copy: Zero linguaggio eccitante, tutto neutrale e verificabile
- [ ] Spacing: Solo section-lg/md/sm, max-w-2xl
- [ ] Componenti: Card e Button conformi al design system
- [ ] Performance: Transizioni 150ms, prefers-reduced-motion
- [ ] Accessibilità: WCAG AAA compliant
- [ ] Responsive: Mobile-first, touch targets 44px+

### ❌ Blockers Assoluti:
- Qualsiasi colore hardcoded (gray-900, red-600, etc.)
- Linguaggio eccitante o persuasivo nel copy
- Architettura diversa dalle 8 sezioni prescritte
- Typography non conforme al design system
- Multilingua non funzionante

## Note Implementative

### Regola d'Oro
> Se una frase aumenta l'eccitazione, è sbagliata. Se aumenta la chiarezza, è giusta.

### Principi Non Negoziabili
1. **Chiarezza > Persuasione**: Zero growth hacking
2. **Verificabilità > Opinione**: Ogni dato tracciabile
3. **Neutralità > Bias**: Palette desaturata, linguaggio accademico

### File da Modificare
- `app/page.tsx` - Homepage principale
- `app/globals.css` - CSS variables e classi Tradelia
- `components/UI.tsx` - Componenti base conformi
- `lib/i18n-simple.ts` - Sistema multilingua semplice (da creare)

## Definizione di "Done"

La homepage è considerata 10/10 quando un audit completo conferma:
- Zero violazioni dei principi Tradelia 2026
- Funzionalità multilingua perfetta
- Design system 100% conforme
- Copy neutrale e accademico
- Performance e accessibilità ottimali

**Tempo stimato**: 4-6 ore di sviluppo focalizzato
**Rischio**: Basso (architettura chiara, requisiti definiti)
**Impatto**: Critico (fondamenta dell'intera applicazione)