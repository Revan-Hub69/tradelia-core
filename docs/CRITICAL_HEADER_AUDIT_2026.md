# CRITICAL HEADER AUDIT 2026

**Date**: January 24, 2026  
**Status**: 🔴 CRITICAL - Sistema header completamente rotto  
**Priority**: P0 (Blocca produzione)

---

## EXECUTIVE SUMMARY

Il sistema header ha **problemi critici** che impediscono il funzionamento corretto:
1. Classi CSS usate ma non definite
2. Sintassi CSS invalida (@extend in vanilla CSS)
3. Naming inconsistente (header-icon vs header-premium-icon)
4. Duplicazioni e conflitti

---

## PROBLEMI CRITICI (P0)

### 1. Classi CSS NON DEFINITE

**File**: `src/components/dashboard/DashboardHeader.tsx`

```tsx
// LINEA 307 - CLASSE NON ESISTE
className={cn(
  'header-2026',  // ❌ NON DEFINITA in nessun CSS
  showScrollShadow && isScrolled && 'header-scrolled',  // ❌ NON DEFINITA
  isAtScrollEdge && 'header-compact-edge',  // ❌ NON DEFINITA
)}

// LINEA 326 - CLASSE NON ESISTE
className={cn(
  compactMode ? 'header-height-compact' : 'header-height',  // ❌ header-height-compact NON DEFINITA
)}

// LINEA 249 - CLASSE NON ESISTE
'header-icon header-icon-tertiary',  // ❌ header-icon-tertiary NON DEFINITA
```

**Impatto**: Header non ha stili, posizionamento rotto, effetti invisibili

---

### 2. @extend in CSS Vanilla (ERRORE SINTASSI)

**File**: `src/styles/header-premium-2026.css` (linea 156)

```css
.header-icon {
  /* Redirect to new class */
  @extend .header-premium-icon;  /* ❌ ERRORE - @extend è SASS/SCSS */
}
```

**File**: `src/styles/dropdown-premium-2026.css` (linea 95)

```css
.glass-dropdown {
  @extend .dropdown-premium-container;  /* ❌ ERRORE */
}
```

**Impatto**: CSS non valido, classi legacy non funzionano

---

### 3. Naming Inconsistente

| Componente | Usa | Definito Come | Status |
|------------|-----|---------------|--------|
| NotificationsBell | `.header-icon` | `.header-premium-icon` | ❌ Mismatch |
| UserDropdown | `.header-icon` | `.header-premium-icon` | ❌ Mismatch |
| ThemeSwitcher | `.header-icon` | `.header-premium-icon` | ❌ Mismatch |
| LanguageSwitcher | `.header-icon` | `.header-premium-icon` | ❌ Mismatch |
| DashboardHeader | `.header-2026` | NON ESISTE | ❌ Missing |

---

### 4. .glass-button NON DEFINITO

**Usato in**:
- `NotificationsBell.tsx` (linea 131)
- `UserDropdown.tsx` (linea 203, 308)
- `ThemeSwitcher.tsx` (linea 80)
- `LanguageSwitcherDashboard.tsx` (linea 166)

**Definito in**: NESSUN FILE

**Impatto**: Nessun effetto glass sui button

---

## DUPLICAZIONI E CONFLITTI

### 1. Header Height Definitions

```css
/* header-premium-2026.css */
--header-height: 64px;
.header-height { height: var(--header-height); }

/* shared/tokens.css */
/* NOTE: --header-height defined in header-system.css (Single Source of Truth) */
/* ❌ CONFLITTO: quale è la source of truth? */
```

### 2. Glass Header Definitions

```css
/* header-premium-2026.css */
.glass-header { ... }

/* dashboard.css */
/* .glass-header removed - defined in glass-effects-tokens.css */
/* ❌ CONFLITTO: dove è definito davvero? */
```

---

## ROOT CAUSE ANALYSIS

### Problema Principale
Durante il refactor Phase 1-3 abbiamo:
1. Rinominato file CSS (`header-system.css` → `header-premium-2026.css`)
2. Creato nuove classi (`header-premium-icon`)
3. MA non aggiornato i componenti che usano le classi vecchie
4. Aggiunto classi nei componenti che non esistono nei CSS

### Perché è Successo
- Refactor fatto in 3 fasi separate
- Nessun audit finale di verifica
- Componenti e CSS modificati in momenti diversi
- Mancanza di single source of truth

---

## SOLUZIONE ENTERPRISE

### Phase 1: Definire TUTTE le classi mancanti (P0)

**File**: `src/styles/header-premium-2026.css`

Aggiungere:
```css
/* Header container variants */
.header-2026 {
  @apply sticky top-0 z-50;
  @apply border-b border-border/10;
  @apply glass-header;
}

.header-scrolled {
  box-shadow: var(--header-glass-shadow);
}

.header-compact-edge {
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
}

.header-height-compact {
  height: 48px;
}

/* Icon hierarchy classes */
.header-icon-primary {
  opacity: var(--header-icon-primary-opacity);
}

.header-icon-secondary {
  opacity: var(--header-icon-secondary-opacity);
}

.header-icon-tertiary {
  opacity: var(--header-icon-tertiary-opacity);
}

/* Glass button for header icons */
.glass-button {
  @apply relative inline-flex items-center justify-center;
  @apply rounded-xl;
  @apply transition-all duration-200;
  @apply hover:bg-accent/10;
  @apply focus-visible:ring-2 focus-visible:ring-ring;
}
```

---

### Phase 2: Rimuovere @extend (sostituire con duplicazione)

**File**: `src/styles/header-premium-2026.css`

```css
/* PRIMA (ERRORE) */
.header-icon {
  @extend .header-premium-icon;
}

/* DOPO (CORRETTO) */
.header-icon {
  /* Legacy support - duplicate rules */
  position: relative;
  opacity: var(--header-icon-primary-opacity);
  transform: translateZ(0);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

### Phase 3: Unificare naming (decidere UNA convenzione)

**Opzione A**: Usare `header-premium-*` ovunque
- Aggiornare tutti i componenti
- Rimuovere classi legacy

**Opzione B**: Usare `header-*` ovunque (più semplice)
- Rinominare nel CSS
- Componenti già corretti

**RACCOMANDAZIONE**: Opzione B (meno breaking changes)

---

### Phase 4: Single Source of Truth

**File**: `src/config/header.ts` (NUOVO)

```typescript
export const HEADER_CONFIG = {
  height: {
    desktop: 64,
    mobile: 56,
    compact: 48,
  },
  zIndex: 50,
  classes: {
    container: 'header-2026',
    scrolled: 'header-scrolled',
    compact: 'header-compact-edge',
    icon: 'header-icon',
    button: 'glass-button',
  },
} as const;
```

Usare in componenti:
```tsx
import { HEADER_CONFIG } from '@/config/header';

<header className={HEADER_CONFIG.classes.container}>
```

---

## SEQUENZA DI FIX (ORDINE CORRETTO)

### Step 1: Fix CSS (P0 - 15 min)
1. Aggiungere classi mancanti in `header-premium-2026.css`
2. Rimuovere @extend, duplicare regole
3. Definire `.glass-button`

### Step 2: Verificare Build (P0 - 5 min)
1. `npm run build`
2. Verificare nessun errore CSS
3. Verificare classi generate in output

### Step 3: Test Visivo (P1 - 10 min)
1. Aprire dashboard
2. Verificare header visibile
3. Verificare scroll behavior
4. Verificare effetti premium

### Step 4: Cleanup (P2 - 20 min)
1. Rimuovere commenti obsoleti
2. Unificare naming
3. Creare config file
4. Documentare

---

## METRICHE DI SUCCESSO

### Before (Attuale)
- ❌ 5 classi usate ma non definite
- ❌ 2 errori sintassi CSS (@extend)
- ❌ 4 componenti con naming inconsistente
- ❌ 1 classe usata in 5 posti ma non definita (.glass-button)
- ❌ Build passa MA stili non applicati

### After (Target)
- ✅ 0 classi mancanti
- ✅ 0 errori sintassi
- ✅ Naming consistente
- ✅ Single source of truth
- ✅ Build passa E stili applicati

---

## NEXT STEPS

1. **IMMEDIATE** (ora): Fix classi mancanti in CSS
2. **IMMEDIATE** (ora): Rimuovere @extend
3. **SHORT TERM** (oggi): Test visivo completo
4. **MEDIUM TERM** (domani): Unificare naming
5. **LONG TERM** (settimana): Config file + documentazione

---

**Status**: 🔴 CRITICAL  
**Owner**: Kiro AI  
**ETA Fix**: 30 minuti  
**Risk**: HIGH (produzione bloccata)

---

**Signed**: Kiro AI Assistant  
**Date**: January 24, 2026  
**Version**: 2026.1.24-critical
