# UI/UX Refactoring Plan 2026 - Challenge Cards & Drawer

## Problemi Identificati

### 1. **Challenge Cards - Visivi e Chiarezza**
- ❌ "Luccichio strano" - troppe animazioni e gradienti confusi
- ❌ Informazioni frammentate - non c'è gerarchia visiva chiara
- ❌ Non professionale - mancano linee guida di design 2026
- ❌ Poco innovativo - design generico senza personality

**Soluzione**: Redesign con design system coerente, gerarchia visiva chiara, minimalista ma raffinato

### 2. **Drawer - Informazioni Frammentate**
- ❌ Drawer con 7 tab ma informazioni poco comprensibili
- ❌ Sezioni caotiche senza flow logico
- ❌ Troppe informazioni ammassate
- ❌ Non responsive - non adatto a mobile

**Soluzione**: Reorganizzare in sezioni logiche, progressive disclosure, mobile-first

### 3. **Mobile Issues - Pulsanti Nascosti**
- ❌ Pulsanti "Avvia Challenge"/"Join Challenge" nascosti dietro nav bar
- ❌ EnrollmentButton non visibile su mobile
- ❌ OfferSelector nell'header - wrong concept
- ❌ Bottom sheet non accessibile correttamente

**Soluzione**: Sticky footer button, account size selector integrato nella card, responsive layout

### 4. **Bug Funzionali - Errore ID Mancante**
- ❌ Clicking "Avvia Challenge" → error: missing ID
- ❌ Probably in EnrollmentButton.tsx - missing offer_id context

**Soluzione**: Fix prop passing, ensure offer_id è sempre disponibile

### 5. **Design System - Non 2026 Standard**
- ❌ Non segue best practices 2026
- ❌ Colori inconsistenti
- ❌ Typography confusa
- ❌ Spacing irregolare

**Soluzione**: Implementare design tokens standardizzati, componenti reusable, color palette coerente

---

## Architettura Attuale

```
src/app/[locale]/(auth)/dashboard/challenges/page.tsx (pagina principale)
├── ProgramCard (card visualizzazione)
│   ├── OfferSelector (header selector - WRONG PLACE)
│   └── EnrollmentButton (pulsante iscrizione - HIDDEN ON MOBILE)
│
└── ProgramDrawer (drawer dettagli)
    ├── 7 Tab Sections
    │   ├── CompetitionRulesSection
    │   ├── RiskRulesSection
    │   ├── MarketsSection
    │   ├── PayoutSection
    │   ├── PermissionsSection
    │   └── ...
    └── EnrollmentButton (callback)
```

---

## Piano di Refactoring

### Phase 1: Fix Bug Funzionali (Priority 1)
- [ ] Analizzare EnrollmentButton.tsx - capire il flusso dei props
- [ ] Identificare dove manca offer_id
- [ ] Fixare il bug di ID mancante
- [ ] Testare iscrizione su FTMO Challenge

### Phase 2: Redesign Challenge Cards (Priority 2)
- [ ] Semplificare layout - rimuovere animazioni confuse
- [ ] Implementare clear visual hierarchy:
  - Title (prominente)
  - Key metrics (2-3 principali)
  - Account size selector (integrato)
  - Call-to-action button (sticky bottom on mobile)
- [ ] Design system tokens (colori, spacing, typography)
- [ ] Mobile-responsive layout

### Phase 3: Ristrutturare Drawer (Priority 2)
- [ ] Reorganizzare da 7 tabs a sezioni progressive
- [ ] Gerarchia logica:
  1. **Overview** (quick facts)
  2. **Rules** (profit targets, drawdowns)
  3. **Markets** (platforms, instruments)
  4. **Payouts** (profit split, frequency)
  5. **FAQ/Details** (collapsible)
- [ ] Mobile-first responsive
- [ ] Sticky header con close button

### Phase 4: Fix Mobile UX (Priority 2)
- [ ] Enrollment button: sticky footer on mobile
- [ ] Account size selector: move from header to card body
- [ ] Drawer: full viewport on mobile, side drawer on desktop
- [ ] Touch targets: min 44x44px

### Phase 5: Design System Coherence (Priority 3)
- [ ] Unified color palette
- [ ] Typography scale
- [ ] Spacing system
- [ ] Component library audit

---

## Implementation Order

1. **Fix EnrollmentButton bug** (10 min)
2. **ProgramCard redesign** (1-2 hours)
3. **Drawer restructure** (1-2 hours)
4. **Mobile fixes** (1 hour)
5. **Design tokens** (30 min)

---

## Design Principles 2026

✨ **Clarity** - Informazioni chiare e ben organizzate
✨ **Professional** - Design sofisticato, non "flashy"
✨ **Innovative** - Ma non a discapito dell'usabilità
✨ **Minimal** - Meno è più
✨ **Accessible** - WCAG AAA standard
✨ **Responsive** - Mobile-first approach
✨ **Performant** - Smooth animations, no jank
