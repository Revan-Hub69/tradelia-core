# Readability & Contrast Audit Checklist v1

**Enterprise-grade checklist for dashboard + modals + drawer, dark mode**

Use this after technical audit, before final polish. This is material for product review enterprise, not theoretical discussion.

## Typography & Layout

- [ ] **Body text ≥ 16px (desktop)** — nessuna eccezione
- [ ] **Line-height ≥ 1.55 per testi > 2 righe**
- [ ] **Max-width testuale 60–72ch per contenuti lunghi**
- [ ] **Nessun paragrafo full-width > 1200px**
- [ ] **Titoli distinguibili per peso + size, non solo colore**

## Contrasti (reali, non solo WCAG)

- [ ] **Primary text ≥ 7:1**
- [ ] **Body text tra 4.5 e 5.5:1**
- [ ] **Secondary text ≥ 3.5:1** (mai "fantasma")
- [ ] **Disabled / meta ≥ 3:1**
- [ ] **Focus ring ≥ 3:1 e mai coperto**

## Dark Mode specifico

- [ ] **Nessun bianco puro (#fff)**
- [ ] **Secondary text non sotto #9FA6B2**
- [ ] **Divider visibili ma non dominanti**
- [ ] **Alert "educativi" ≠ alert "errore"** (colore + icona)

## Cognizione & Scansione

- [ ] **Ogni sezione risponde a "cosa devo fare?"**
- [ ] **Liste scansionabili** (spazio + gerarchia)
- [ ] **CTA descrive l'azione successiva** (non generica)
- [ ] **Stati ("da completare") esplicativi, non neutri**

## Target Size & Accessibility

- [ ] **Tutti gli elementi interattivi ≥ 24px desktop, 44px touch**
- [ ] **Focus non coperto da header sticky** (scroll-margin)
- [ ] **ESC chiude sempre i modal**
- [ ] **Focus trap nei drawer/modal**
- [ ] **Focus restore dopo chiusura**

## Motion & Performance

- [ ] **Durata: 160–220ms desktop, 220–280ms mobile**
- [ ] **Easing: ease-out (entrata), ease-in (uscita)**
- [ ] **Rispetta prefers-reduced-motion**
- [ ] **Scrim + blur controllato** (non riduce contrasto testo)

## Semantic Correctness

- [ ] **Info: blu con info icon**
- [ ] **Warning (educativo): amber con triangle-alert**
- [ ] **Danger (solo errori): rosso con octagon-alert**
- [ ] **Success: verde con check-circle**

## I18N Safety (Critical)

- [ ] **Nessuna chiave raw visibile in UI**
- [ ] **Tutti i messaggi di errore hanno fallback umano**
- [ ] **Errori di rete ≠ errori applicativi** (colore + messaggio)
- [ ] **Test automatico contro chiavi non risolte**

## Drawer Enterprise Behavior

- [ ] **Desktop: side sheet 420-520px, max 640px**
- [ ] **Mobile: modal bottom sheet con drag handle**
- [ ] **Page diventa inert quando modal** (aria-hidden="true")
- [ ] **Header sticky con scroll shadow**
- [ ] **Swipe to close su mobile**

## Micro-Copy Quality

- [ ] **"Da completare" → "Non iniziato" o "Fondamentale · ~3 min"**
- [ ] **"Ok, ho capito" → "Continua" o "Prosegui nel percorso"**
- [ ] **Alert educativi: linguaggio meno ansioso**
- [ ] **Descrizioni: orientamento concreto, non generico**

---

## Verdetto

**Se passi tutti i punti, la leggibilità è enterprise-grade.**

### Priority Levels:
- **P0 (Critical)**: I18N Safety, Focus accessibility, Target size
- **P1 (High)**: Contrasti, Typography, Semantic correctness
- **P2 (Medium)**: Motion, Micro-copy, Drawer behavior

### Testing Notes:
- Test su laptop 13" a luminosità media
- Test keyboard-only navigation
- Test screen reader (basic)
- Test in entrambe le modalità density
- Verifica su mobile touch targets

### Evidence Required:
- Screenshot before/after per contrasti
- Accessibility scan report (axe-core)
- Manual keyboard navigation test
- I18n key audit report

---

**Questo è materiale da product review enterprise, non da discussione teorica.**