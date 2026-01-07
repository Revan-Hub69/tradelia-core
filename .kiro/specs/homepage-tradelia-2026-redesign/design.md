# Design Document

## Overview

Ridisegno completo della homepage Tradelia per conformità totale ai principi 2026. Il design elimina tutte le violazioni attuali: architettura disorganizzata, colori saturi, copy eccitante, sistema multilingua rotto. Implementa un approccio sistematico basato su design system coerente, palette istituzionale desaturata e copy neutrale accademico.

## Architecture

### Homepage Structure (8 Sezioni Obbligatorie)

```
1. Hero Section
   ├── Statement neutrale (non slogan)
   ├── Descrizione concisa del servizio
   └── CTA discreto "Avvia verifica"

2. Context Section  
   ├── Eyebrow: "Contesto"
   ├── Problema affiliazioni portali comparazione
   └── Posizionamento neutrale Tradelia

3. How It Works Section
   ├── Eyebrow: "Funzionamento" 
   ├── 3 step concreti e verificabili
   └── Cards interattive numerate

4. Examples Section
   ├── Eyebrow: "Esempi"
   ├── Incompatibilità documentate
   └── Badge "Non coerente" desaturati

5. Methodology Section
   ├── Eyebrow: "Metodologia"
   ├── Fonti accademiche (ESMA, Consob)
   └── Criteri oggettivi tracciabili

6. Limits Section
   ├── Eyebrow: "Limiti"
   ├── Onestà intellettuale completa
   └── Lista cosa NON facciamo

7. CTA Section
   ├── Call to action finale discreto
   ├── Descrizione neutra del servizio
   └── Button primario senza pressione

8. Footer Section
   ├── Disclaimer metodologico
   ├── Note legali educative
   └── Contatti e privacy
```

### Layout System

- **Max-width**: 672px (max-w-2xl) per leggibilità ottimale
- **Padding**: px-6 sm:px-8 per margini consistenti  
- **Spacing**: section-lg/md/sm per ritmo verticale
- **Background**: Alternanza background/muted per separazione visiva

## Components and Interfaces

### Design System Components

#### 1. Typography System
```typescript
interface TypographyClasses {
  'headline-1': 'text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground';
  'headline-2': 'text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground';  
  'headline-3': 'text-base sm:text-lg font-medium text-foreground';
  'body-text': 'text-sm sm:text-base text-muted-foreground';
  'small-text': 'text-xs text-muted-foreground';
  'eyebrow-text': 'text-xs uppercase tracking-wide text-muted-foreground font-medium';
}
```

#### 2. Color System (CSS Variables)
```css
:root {
  --background: 0 0% 99%;           /* Bianco caldo istituzionale */
  --foreground: 220 15% 12%;        /* Grigio scuro blu per testo */
  --primary: 215 50% 45%;           /* Blu desaturato per accenti */
  --muted: 220 10% 96%;             /* Grigio chiaro per sfondi */
  --muted-foreground: 220 10% 40%;  /* Grigio medio per testo secondario */
  --border: 220 10% 88%;            /* Grigio sottile per bordi */
}
```

#### 3. Component Library
```typescript
interface ComponentSystem {
  Section: {
    variants: 'section-lg' | 'section-md' | 'section-sm';
    backgrounds: 'bg-background' | 'bg-muted/30';
    borders: 'border-t border-border/50';
  };
  
  Container: {
    maxWidth: 'max-w-2xl';
    padding: 'px-6 sm:px-8';
    center: 'mx-auto';
  };
  
  Card: {
    base: 'rounded border border-border/50 bg-background p-5';
    interactive: 'card-interactive'; // hover effects
    transitions: 'transition-all duration-150';
  };
  
  Button: {
    primary: 'bg-foreground text-background h-10 px-6';
    outline: 'border border-border bg-background text-foreground';
    hover: 'hover:bg-foreground/90';
  };
}
```

### Multilingua System Architecture

```typescript
interface TranslationSystem {
  structure: {
    'lib/dictionaries/': {
      'it.json': 'Traduzioni italiane complete';
      'en.json': 'Traduzioni inglesi complete';
    };
    'lib/i18n.ts': 'Sistema gestione lingue con fallback';
    'components/LanguageSelector.tsx': 'Selector lingua funzionante';
  };
  
  implementation: {
    fallback: 'italiano'; // lingua di default
    errorHandling: 'graceful degradation';
    keyStructure: 'nested object notation';
    changeMethod: 'client-side senza reload';
  };
}
```

## Data Models

### Homepage Content Model
```typescript
interface HomepageContent {
  hero: {
    title: string;           // "Verifica la coerenza tra obiettivi e strumenti crypto"
    description: string;     // Descrizione neutra del servizio
    cta: string;            // "Avvia verifica"
  };
  
  sections: {
    context: SectionContent;
    howItWorks: StepContent[];
    examples: ExampleContent[];
    methodology: SectionContent;
    limits: LimitContent[];
    finalCta: SectionContent;
    footer: DisclaimerContent;
  };
}

interface SectionContent {
  eyebrow: string;          // Una parola categoria
  headline: string;         // Statement principale
  body: string[];          // Paragrafi esplicativi
}

interface StepContent {
  number: number;           // 1, 2, 3
  title: string;           // Titolo step
  description: string;     // Spiegazione concreta
}
```

### Design System Tokens
```typescript
interface DesignTokens {
  colors: {
    background: 'hsl(0 0% 99%)';
    foreground: 'hsl(220 15% 12%)';
    muted: 'hsl(220 10% 96%)';
    mutedForeground: 'hsl(220 10% 40%)';
    border: 'hsl(220 10% 88%)';
  };
  
  spacing: {
    sectionLg: 'py-20 sm:py-32';
    sectionMd: 'py-16 sm:py-24';  
    sectionSm: 'py-12 sm:py-16';
  };
  
  typography: {
    letterSpacing: {
      h1: '-0.02em';
      h2: '-0.01em';
    };
  };
}
```

## Correctness Properties

*Una proprietà è una caratteristica o comportamento che dovrebbe essere vero in tutte le esecuzioni valide del sistema - essenzialmente, una dichiarazione formale su ciò che il sistema dovrebbe fare. Le proprietà servono come ponte tra specifiche leggibili dall'uomo e garanzie di correttezza verificabili dalla macchina.*

<function_calls>
<invoke name="prework">
<parameter name="featureName">homepage-tradelia-2026-redesign

### Property 1: Homepage Architecture Consistency
*Per qualsiasi* rendering della homepage, la struttura deve contenere esattamente 8 sezioni nell'ordine specificato: Hero, Context, How It Works, Examples, Methodology, Limits, CTA, Footer
**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8**

### Property 2: Design System Color Compliance  
*Per qualsiasi* elemento visivo della homepage, tutti i colori utilizzati devono derivare esclusivamente dalle CSS variables della palette istituzionale, senza colori hardcoded saturi
**Validates: Requirements 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 3: Typography System Consistency
*Per qualsiasi* elemento testuale, deve utilizzare le classi typography standardizzate (headline-1, headline-2, body-text, eyebrow-text) senza stili inline o classi non conformi
**Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 4: Copy Neutrality Compliance
*Per qualsiasi* contenuto testuale della homepage, non deve contenere frasi eccitanti, superlativi o linguaggio persuasivo dalla blacklist definita
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

### Property 5: Multilingua Completeness
*Per qualsiasi* chiave di traduzione utilizzata nell'interfaccia, deve esistere una traduzione corrispondente in tutte le lingue supportate (italiano, inglese)
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

### Property 6: Component System Conformity
*Per qualsiasi* componente UI utilizzato, deve rispettare le specifiche del design system (dimensioni, padding, transizioni, hover effects)
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

### Property 7: Accessibility Standards Compliance
*Per qualsiasi* elemento interattivo, deve rispettare WCAG AAA per contrasti, focus states e navigazione keyboard
**Validates: Requirements 7.2, 7.3, 7.4, 7.5**

### Property 8: Validation System Integrity
*Per qualsiasi* modifica al codice, il sistema di validazione deve verificare automaticamente conformità ai principi Tradelia 2026
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

## Error Handling

### Translation System Errors
- **Missing Translation Keys**: Fallback automatico a italiano con log warning
- **Invalid Language Code**: Default a italiano senza crash applicazione  
- **JSON Parse Errors**: Graceful degradation con messaggi di errore user-friendly

### Design System Violations
- **Invalid CSS Variables**: Build-time validation con errori specifici
- **Missing Component Props**: TypeScript strict mode per catch compile-time
- **Color Compliance**: Automated linting per identificare colori non conformi

### Performance Degradation
- **Slow Loading**: Lazy loading per sezioni non critiche
- **Large Bundle Size**: Code splitting automatico per ottimizzazione
- **Memory Leaks**: Cleanup automatico di event listeners e timers

## Testing Strategy

### Dual Testing Approach
- **Unit Tests**: Verificano esempi specifici, edge cases e condizioni di errore
- **Property Tests**: Verificano proprietà universali attraverso tutti gli input
- Entrambi sono complementari e necessari per copertura completa

### Property-Based Testing Configuration
- **Minimum 100 iterations** per property test (dovuto alla randomizzazione)
- **Tag format**: Feature: homepage-tradelia-2026-redesign, Property {number}: {property_text}
- Ogni property test deve referenziare la sua proprietà del design document

### Unit Testing Focus
- Esempi specifici che dimostrano comportamento corretto
- Punti di integrazione tra componenti  
- Edge cases e condizioni di errore
- Validazione conformità design system

### Property Testing Focus
- Proprietà universali che valgono per tutti gli input
- Copertura completa input attraverso randomizzazione
- Verifica automatica principi Tradelia 2026
- Validazione architettura e design system