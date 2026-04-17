# 🔍 ANALISI GAP — Simulator V2 SOTA 2026
## Cosa manca per la produzione

---

## ✅ COMPLETATO

### Core Structure
- [x] AssetSelector (5 asset cards)
- [x] SimulatorLauncher (entry point)
- [x] SimulatorShell (state machine controller)
- [x] Wizard (3-step form)
- [x] CompareView (results + winner block)
- [x] DetailView (breakdown)
- [x] Drawer (desktop)
- [x] BottomSheet (mobile)
- [x] useSimulatorState (hook)
- [x] Integrazione homepage

---

## ❌ MANCANTE — Critical Path

### 1. 🎨 DESIGN SYSTEM INTEGRATION

#### Color Tokens SOTA 2026
```
Current:  slate-900, slate-800, white/10 borders
Needed:   #09090B bg-primary
          #18181B bg-card  
          #27272A bg-elevated
          #3F3F46 border-subtle
          #FAFAFA text-primary (NOT pure white)
          #A1A1AA text-secondary
          #71717A text-tertiary
```

**File da creare:**
- `src/features/simulator-v2/styles/tokens.css`
- Aggiornare tailwind.config.ts con colori SOTA

#### Typography System
```
Current:  Default Tailwind text sizes
Needed:   Inter with tabular-nums for data
          font-feature-settings: "tnum", "zero"
          Display: 48/56px, H1: 36/44px, etc.
```

---

### 2. ♿ ACCESSIBILITY (WCAG 2.1 AA)

#### Focus Management
- [ ] Focus trap in Drawer/BottomSheet
- [ ] Focus visible states (ring-2 ring-emerald-500)
- [ ] Skip links per sezioni
- [ ] Tab order logico

#### ARIA & Semantics
```tsx
// Manca in tutti i componenti:
role="dialog"
aria-modal="true"
aria-labelledby="dialog-title"
aria-describedby="dialog-desc"
aria-live="polite" per risultati
```

#### Reduced Motion
```tsx
// Manca supporto:
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
// Condizionale: disable animations se true
```

#### Screen Reader Support
- [ ] Annunci per cambio stato (wizard → results)
- [ ] Label per input numerici
- [ ] Descrizioni per icon buttons

---

### 3. ⏳ LOADING & SKELETON STATES

#### Components Needed
```tsx
// src/features/simulator-v2/ui/skeletons/
- AssetCardSkeleton.tsx      // 5 items stagger
- WizardStepSkeleton.tsx     // Input placeholders
- ResultCardSkeleton.tsx     // Broker row shimmer
- DetailViewSkeleton.tsx     // Full page skeleton
```

#### Implementation
```tsx
// Manca in CompareView quando results=null
if (!results) return <ResultsSkeleton count={5} />;

// Manca in DetailView quando broker loading
if (!broker) return <DetailSkeleton />;
```

---

### 4. 🚨 ERROR & EMPTY STATES

#### Error Boundaries
```tsx
// src/features/simulator-v2/ui/states/
- ErrorState.tsx           // Generic error
- NetworkError.tsx         // Connection lost
- NoResultsState.tsx       // Nessun broker compatibile
- ValidationError.tsx      // Input invalido
```

#### Scenarios
- [ ] Capitale < min requirement
- [ ] Nessun broker disponibile per asset
- [ ] Network error durante calcolo
- [ ] Invalid input (negative numbers)

---

### 5. 📊 DATA VISUALIZATION

#### Charts Needed
```tsx
// src/features/simulator-v2/ui/charts/
- CostBreakdownChart.tsx   // Doughnut/pie breakdown
- CostComparisonChart.tsx  // Bar chart confronto broker
- MonthlyProjectionChart.tsx // Line chart 12 mesi
```

#### Libraries
- `recharts` (già usato nel progetto?)
- o `@radix-ui/react-progress` per barre semplici

---

### 6. 🔔 TOAST & NOTIFICATIONS

#### Feedback System
```tsx
// src/features/simulator-v2/ui/feedback/
- ToastProvider.tsx
- SuccessToast.tsx    // "Simulazione completata"
- InfoToast.tsx       // "Dati aggiornati"
- ErrorToast.tsx      // "Errore di connessione"
```

---

### 7. 💡 TOOLTIPS & CONTEXTUAL HELP

#### Educational Content
```tsx
// src/features/simulator-v2/ui/help/
- Tooltip.tsx              // Radix tooltip base
- HelpIcon.tsx             // (i) icon con info
- CostExplainer.tsx        // "Come calcoliamo i costi"
- MarginExplainer.tsx      // Info margin requirement
```

#### Copy Needed
- [ ] Tooltip "Che cosa è lo spread?"
- [ ] Tooltip "Commissione round-turn"
- [ ] Tooltip "Slippage stimato"
- [ ] Info box "Come usare il simulatore"

---

### 8. 📱 MOBILE GESTURES AVANZATI

#### Missing Gestures
```tsx
// In BottomSheet.tsx:
- Pull velocity threshold (now: fixed 100px)
- Rubber-band effect oltre limit
- Scroll-to-dismiss (content scrollable)

// In CompareView:
- Swipe left/right tra broker cards
- Pull-to-refresh results
```

---

### 9. 🎭 MICRO-INTERACTIONS PREMIUM

#### Hover Effects
```css
/* Manca glow su CTAs */
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
}

/* Manca gradient border cards */
.card-premium::before {
  /* gradient border effect */
}

/* Manca shimmer su winner card */
@keyframes shimmer { ... }
```

#### Button States
```tsx
// Manca in tutti i button:
- Idle state
- Hover state (lift + glow)
- Active/Pressed state (scale 0.98)
- Loading state (spinner)
- Disabled state (opacity + cursor)
```

---

### 10. 🔒 SECURITY & PRIVACY

#### Data Handling
- [ ] No sensitive data in URL
- [ ] LocalStorage per draft? (opzionale)
- [ ] Clear data on close

#### Analytics
- [ ] Track: asset selezionato
- [ ] Track: wizard completato
- [ ] Track: broker cliccato
- [ ] Track: CTA "Apri Conto"

---

### 11. 🌐 I18N & LOCALIZATION

#### Missing
- [ ] Tutti i testi hardcoded in italiano
- [ ]next-intl integration
- [ ] Formattazione numeri locale (€1.234,56 vs €1,234.56)
- [ ] Currency detection da locale

---

### 12. 🔧 PERFORMANCE

#### Optimizations Needed
```tsx
// Code splitting
const SimulatorShell = dynamic(() => import('./SimulatorShell'), {
  ssr: false,
  loading: () => <LauncherSkeleton />
});

// Memoization
const MemoizedResultCard = React.memo(ResultCard);

// Virtualization (se lista lunga)
import { Virtuoso } from 'react-virtuoso';
```

---

### 13. 🧪 TESTING

#### Test Coverage Needed
```
src/features/simulator-v2/
├── __tests__/
│   ├── AssetSelector.test.tsx
│   ├── Wizard.test.tsx
│   ├── useSimulatorState.test.ts
│   └── integration.test.tsx
├── e2e/
│   └── simulator-flow.spec.ts
```

#### Scenarios
- [ ] User completa wizard → vede risultati
- [ ] User clicca broker → vede dettaglio
- [ ] User torna indietro → stato preservato
- [ ] User chiude → reopen wizard resettato

---

### 14. 📝 DOCUMENTATION

#### Missing Docs
- [ ] README.md per simulator-v2
- [ ] Component API documentation
- [ ] State machine diagram
- [ ] Design tokens reference

---

## 🎯 PRIORITÀ IMPLEMENTAZIONE

### P0 — Must Have (Bloccante per release)
1. Color tokens SOTA 2026 (#09090B, etc.)
2. Accessibility: focus states, aria-labels
3. Error states (no results, invalid input)
4. Tooltips educative

### P1 — High (Esperienza premium)
5. Skeleton loading states
6. Micro-interactions (hover glow, shimmer)
7. Data visualization charts
8. Reduced motion support

### P2 — Medium (Nice to have)
9. Toast notifications
10. Swipe gestures avanzati
11. i18n completo
12. Analytics tracking

### P3 — Low (Future)
13. E2E tests
14. Virtualization
15. Offline support

---

## 📊 Stima Complessità

| Area | Files | Difficulty | Time Est. |
|------|-------|------------|-----------|
| Design System | 3 | Medium | 4h |
| Accessibility | 8 | High | 6h |
| Loading States | 5 | Low | 3h |
| Error States | 4 | Medium | 4h |
| Data Viz | 3 | High | 8h |
| Micro-interactions | 6 | Medium | 4h |
| **TOTAL** | **29** | — | **~29h** |

---

## ✅ CHECKLIST RILASCIO

- [ ] Colors SOTA 2026 applicati
- [ ] WCAG AA compliance verificata
- [ ] Focus management funzionante
- [ ] Skeleton states implementati
- [ ] Error handling completo
- [ ] Mobile gestures fluidi
- [ ] Copy review italiano
- [ ] Performance audit < 3s load
- [ ] Cross-browser test (Chrome, Safari, Firefox)
- [ ] Mobile test (iOS Safari, Chrome Android)

---

*Analisi completata: Aprile 2026*
