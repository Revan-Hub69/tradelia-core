# 📚 Learning Path Drawer - Complete Redesign Specification

## 🎯 Obiettivo
Ridisegnare il drawer Learning Path con:
1. **Selezione iniziale**: Nazione + Livello tecnico
2. **3 Gruppi progressivi**: Fase 0 (libero) → Fase 1 (locked) → Approfondimenti (locked)
3. **Lista moduli** per gruppo selezionato
4. **Contenuto modulo** con tutte le chicche

---

## 🏗️ Architettura Informativa

### Livello 1: Selezione Iniziale (Setup)
```
┌─────────────────────────────────────────┐
│ LEARNING PATH                           │
│ Personalizza il tuo percorso            │
├─────────────────────────────────────────┤
│                                         │
│ 🌍 Seleziona Nazione                   │
│ [Dropdown: Italia, USA, UK, etc.]      │
│ → Per contenuti fiscali/legali locali  │
│                                         │
│ 🎓 Seleziona Livello Tecnico           │
│ ○ Noob (Principiante assoluto)        │
│ ○ Informato (Conosco le basi)         │
│ ○ Smart (Voglio approfondire)         │
│                                         │
│ [Salva e Continua →]                   │
└─────────────────────────────────────────┘
```

**Stato persistente**:
- Salvato in `userPreferences` (Supabase)
- Modificabile in qualsiasi momento (icona settings in header)
- Default: Italia, Noob

---

### Livello 2: Gruppi Moduli (3 card)
```
┌─────────────────────────────────────────┐
│ ← Indietro    LEARNING PATH    ⚙️       │
├─────────────────────────────────────────┤
│                                         │
│ 📚 FASE 0: FONDAMENTI                  │
│ Alfabetizzazione crypto                │
│ ✓ 8 moduli • ~45 min                   │
│ Progresso: ████████░░ 80%              │
│ [Continua →]                            │
│                                         │
│ 🔒 FASE 1: POSSEDERE CRYPTO            │
│ Custodia e sicurezza                   │
│ 7 moduli • ~40 min                     │
│ 🔓 Sblocca completando Fase 0          │
│                                         │
│ 🔒 APPROFONDIMENTI TECNICI              │
│ Per chi vuole andare più a fondo       │
│ 10 moduli • ~100 min                   │
│ 🔓 Sblocca completando Fase 1          │
│                                         │
└─────────────────────────────────────────┘
```

**Logica di sblocco**:
- Fase 0: Sempre libera
- Fase 1: Locked fino a 100% Fase 0
- Approfondimenti: Locked fino a 100% Fase 1

---

### Livello 3: Lista Moduli (del gruppo selezionato)
```
┌─────────────────────────────────────────┐
│ ← Fase 0    FONDAMENTI    ⚙️            │
├─────────────────────────────────────────┤
│ Completamento: ████████░░ 80% (6/8)    │
├─────────────────────────────────────────┤
│                                         │
│ ✓ 0.1 - Cosa sono le criptovalute     │
│   ~3 min • Completato                  │
│                                         │
│ ✓ 0.15 - A cosa servono                │
│   ~5 min • Completato                  │
│                                         │
│ ○ 0.3 - Come funziona la blockchain   │
│   ~5 min                               │
│   [Inizia →]                            │
│                                         │
│ 🔒 0.4 - Bitcoin ed Ethereum            │
│   ~7 min                               │
│   Completa 0.3 per sbloccare           │
│                                         │
│ ... (altri moduli)                     │
│                                         │
└─────────────────────────────────────────┘
```

**Logica di sblocco moduli**:
- Primo modulo: Sempre libero
- Moduli successivi: Locked fino a completamento precedente
- Eccezione: Approfondimenti tecnici tutti liberi (non sequenziali)

---

### Livello 4: Contenuto Modulo
```
┌─────────────────────────────────────────┐
│ ← Lista    0.3 - Blockchain    ⚙️       │
├─────────────────────────────────────────┤
│ Progresso: ██░░░░░░░░ 1/8               │
│ [‹ Prev] [Next ›]                       │
├─────────────────────────────────────────┤
│                                         │
│ [CONTENUTO MODULO CON TUTTE LE CHICCHE]│
│                                         │
│ - Drop cap primo paragrafo             │
│ - Decorative dividers                  │
│ - Animated sections                    │
│ - Reading time dinamico                │
│ - etc.                                 │
│                                         │
│ [Fai il test →]                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Design System

### Chicche da Mantenere (ModuleContent.tsx)
✅ **Tutte le chicche esistenti**:
1. Drop cap primo paragrafo
2. Decorative quote marks (hook)
3. Section numbers (1, 2, 3)
4. Decorative dividers
5. Animated checkmark on completion
6. Custom text selection highlight
7. Diamond divider at end
8. Reading time dinamico (word count)
9. Viewport-based animations
10. Comparison cards (Banca vs Crypto)
11. Callout semantici (info/warning/insight)
12. Takeaway finale

### Nuove Chicche da Aggiungere
🆕 **Per il drawer multi-livello**:
1. **Breadcrumb animato** in header (mostra percorso)
2. **Progress ring** per gruppi (circular progress)
3. **Unlock animation** quando sblocchi un gruppo
4. **Confetti** al completamento 100% di un gruppo
5. **Badge livello** (Noob/Informato/Smart) sempre visibile
6. **Tooltip contestuali** su locked items (perché è bloccato)
7. **Smooth transitions** tra livelli (slide-in/out)
8. **Skeleton loading** per contenuti moduli
9. **Swipe gestures** mobile (prev/next modulo)
10. **Keyboard shortcuts** (←/→ per navigare moduli)

---

## 🔧 Implementazione Tecnica

### Struttura File
```
src/widgets/learning-path-drawer/
├── index.ts
├── LearningPathDrawer.tsx          # Container principale
├── SetupView.tsx                   # Livello 1: Selezione
├── GroupsView.tsx                  # Livello 2: 3 Gruppi
├── ModulesListView.tsx             # Livello 3: Lista moduli
├── ModuleContentView.tsx           # Livello 4: Contenuto (usa ModuleContent.tsx)
├── components/
│   ├── ProgressRing.tsx            # Circular progress
│   ├── UnlockAnimation.tsx         # Animazione sblocco
│   ├── LevelBadge.tsx              # Badge Noob/Informato/Smart
│   ├── ModuleCard.tsx              # Card singolo modulo
│   └── GroupCard.tsx               # Card gruppo (Fase 0/1/Approfondimenti)
└── hooks/
    ├── useLearningPathState.ts     # State machine per navigazione
    ├── useModuleProgress.ts        # Progress tracking
    └── useUserPreferences.ts       # Nazione + Livello

```

### State Machine
```typescript
type DrawerView = 
  | 'setup'              // Livello 1: Selezione iniziale
  | 'groups'             // Livello 2: 3 Gruppi
  | 'modules-list'       // Livello 3: Lista moduli
  | 'module-content'     // Livello 4: Contenuto modulo

interface LearningPathState {
  view: DrawerView
  selectedGroup: 'phase0' | 'phase1' | 'technical' | null
  selectedModule: string | null
  userPreferences: {
    country: string
    level: 'noob' | 'informato' | 'smart'
  }
  progress: {
    phase0: number      // 0-100
    phase1: number      // 0-100
    technical: number   // 0-100
  }
}
```

### Logica di Sblocco
```typescript
function isGroupUnlocked(group: string, progress: Progress): boolean {
  switch (group) {
    case 'phase0':
      return true // Sempre libero
    case 'phase1':
      return progress.phase0 === 100
    case 'technical':
      return progress.phase1 === 100
    default:
      return false
  }
}

function isModuleUnlocked(
  moduleId: string, 
  modules: Module[], 
  completedModules: string[]
): boolean {
  const moduleIndex = modules.findIndex(m => m.id === moduleId)
  
  // Primo modulo sempre libero
  if (moduleIndex === 0) return true
  
  // Approfondimenti tecnici: tutti liberi
  if (moduleId.startsWith('t.')) return true
  
  // Altri: precedente deve essere completato
  const previousModule = modules[moduleIndex - 1]
  return completedModules.includes(previousModule.id)
}
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Drawer full-screen
- Swipe gestures per prev/next modulo
- Bottom sheet per selezione nazione/livello
- Touch targets ≥44px

### Desktop (≥ 768px)
- Drawer XL (come attuale)
- Keyboard shortcuts attivi
- Hover states su card
- Tooltip più dettagliati

---

## ♿ Accessibility

### WCAG 2.2 AA Compliance
✅ **Obbligatorio**:
1. **Focus trap** nel drawer
2. **Keyboard navigation** completa:
   - Tab: Naviga elementi
   - Enter/Space: Seleziona
   - Escape: Chiudi drawer / Torna indietro
   - Arrow keys: Naviga moduli (quando in lista)
3. **ARIA labels** su tutti gli elementi interattivi
4. **Screen reader** announcements per:
   - Cambio livello
   - Sblocco gruppo
   - Completamento modulo
5. **Color contrast** ≥4.5:1 per testo
6. **Focus visible** su tutti gli elementi

### Esempio ARIA
```tsx
<button
  onClick={() => selectGroup('phase1')}
  aria-label="Fase 1: Possedere Crypto, 7 moduli, 40 minuti stimati"
  aria-disabled={!isGroupUnlocked('phase1')}
  aria-describedby={!isGroupUnlocked('phase1') ? 'phase1-locked-reason' : undefined}
>
  <span id="phase1-locked-reason" className="sr-only">
    Completa Fase 0 per sbloccare
  </span>
</button>
```

---

## 🌍 Internazionalizzazione

### Traduzioni Richieste
```json
{
  "learningPath": {
    "setup": {
      "title": "Personalizza il tuo percorso",
      "country": {
        "label": "Seleziona Nazione",
        "description": "Per contenuti fiscali e legali locali"
      },
      "level": {
        "label": "Seleziona Livello Tecnico",
        "noob": "Principiante assoluto",
        "informato": "Conosco le basi",
        "smart": "Voglio approfondire"
      },
      "save": "Salva e Continua"
    },
    "groups": {
      "phase0": {
        "title": "Fase 0: Fondamenti",
        "description": "Alfabetizzazione crypto",
        "modules": "{count} moduli",
        "duration": "~{minutes} min"
      },
      "phase1": {
        "title": "Fase 1: {journeyName}",
        "locked": "Completa Fase 0 per sbloccare"
      },
      "technical": {
        "title": "Approfondimenti Tecnici",
        "description": "Per chi vuole andare più a fondo",
        "locked": "Completa Fase 1 per sbloccare"
      }
    },
    "modules": {
      "completed": "Completato",
      "locked": "Completa {previousModule} per sbloccare",
      "start": "Inizia",
      "continue": "Continua"
    }
  }
}
```

---

## 🚀 Performance

### Ottimizzazioni Obbligatorie
1. **Code splitting** per ogni view
2. **Lazy loading** contenuti moduli
3. **Memoization** per calcoli progress
4. **Virtual scrolling** se >50 moduli
5. **Skeleton loading** durante fetch
6. **Prefetch** modulo successivo

### Metriche Target
- **FCP** (First Contentful Paint): <1s
- **LCP** (Largest Contentful Paint): <2.5s
- **TTI** (Time to Interactive): <3s
- **CLS** (Cumulative Layout Shift): <0.1

---

## 🔐 Security

### Data Privacy
- **Nazione**: Salvata solo per contenuti locali, non condivisa
- **Livello**: Salvato per personalizzazione, non condiviso
- **Progress**: Criptato in Supabase
- **No tracking** di contenuti letti (solo completamento)

### Input Validation
```typescript
const ALLOWED_COUNTRIES = ['IT', 'US', 'UK', 'DE', 'FR', 'ES'] as const
const ALLOWED_LEVELS = ['noob', 'informato', 'smart'] as const

function validatePreferences(prefs: unknown): UserPreferences {
  // Zod schema validation
  return userPreferencesSchema.parse(prefs)
}
```

---

## 📊 Analytics (Privacy-First)

### Eventi da Tracciare (Anonimizzati)
```typescript
// ✅ OK - Aggregati, no PII
trackEvent('learning_path_group_completed', {
  group: 'phase0',
  duration_minutes: 45,
  level: 'noob' // Aggregato
})

// ❌ NO - Troppo granulare
trackEvent('module_read', {
  moduleId: '0.1',
  userId: 'xxx', // NO PII
  timestamp: Date.now()
})
```

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] State machine transitions
- [ ] Unlock logic
- [ ] Progress calculations
- [ ] Preferences validation

### Integration Tests
- [ ] Drawer navigation flow
- [ ] Module completion flow
- [ ] Unlock animations
- [ ] Persistence (Supabase)

### E2E Tests
- [ ] Complete journey (Setup → Module completion)
- [ ] Unlock flow (Phase 0 → Phase 1)
- [ ] Mobile gestures
- [ ] Keyboard navigation

### Accessibility Tests
- [ ] axe-core automated scan
- [ ] Screen reader testing (NVDA, JAWS)
- [ ] Keyboard-only navigation
- [ ] Color contrast validation

---

## 📝 Migration Plan

### Fase 1: Preparazione (1-2 giorni)
1. Creare nuova struttura file
2. Implementare state machine
3. Creare componenti base (senza contenuto)
4. Setup traduzioni

### Fase 2: Implementazione Core (3-4 giorni)
1. SetupView (selezione nazione/livello)
2. GroupsView (3 card con unlock logic)
3. ModulesListView (lista con progress)
4. Integrare ModuleContentView (riusa ModuleContent.tsx)

### Fase 3: Chicche & Polish (2-3 giorni)
1. Unlock animations
2. Progress rings
3. Confetti completamento
4. Swipe gestures mobile
5. Keyboard shortcuts

### Fase 4: Testing & Refinement (2 giorni)
1. Unit + Integration tests
2. Accessibility audit
3. Performance optimization
4. User testing

**Totale stimato**: 8-11 giorni

---

## ✅ Definition of Done

- [ ] Tutte le 4 view implementate e funzionanti
- [ ] Unlock logic corretto (Fase 0 → 1 → Technical)
- [ ] Tutte le chicche esistenti mantenute
- [ ] Nuove chicche implementate (almeno 7/10)
- [ ] WCAG 2.2 AA compliance verificato
- [ ] Performance metrics raggiunti
- [ ] Traduzioni complete (IT + EN)
- [ ] Tests coverage >80%
- [ ] Mobile + Desktop responsive
- [ ] Keyboard navigation completa
- [ ] Screen reader tested
- [ ] Code review approvato
- [ ] Documentazione aggiornata

---

## 🎯 Success Metrics

### Quantitativi
- **Completion rate Fase 0**: >70% (target)
- **Time to complete Fase 0**: <60 min (media)
- **Unlock rate Fase 1**: >50% (di chi completa Fase 0)
- **Bounce rate Setup**: <20%

### Qualitativi
- **User feedback**: "Capisco cosa devo fare" >90%
- **Accessibility score**: 100/100 (Lighthouse)
- **Performance score**: >90 (Lighthouse)
- **Zero CLS** (Cumulative Layout Shift)

---

*Documento completo - Pronto per implementazione*
*Versione: 1.0 - Data: 2026-01-14*
