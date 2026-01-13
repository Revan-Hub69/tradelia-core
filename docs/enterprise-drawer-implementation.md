# Enterprise Drawer Implementation Guide

**Google/OpenAI/Binance-Level Standards per Tradelia**

Questa guida mostra come implementare i drawer enterprise nel progetto Tradelia seguendo gli standard più elevati del settore.

## 🎯 Obiettivi Raggiunti

### 1. Standard Accessibility (WCAG 2.2 AA+)
- ✅ Focus trap e restore
- ✅ ESC sempre chiude
- ✅ Focus Not Obscured (scroll-margin)
- ✅ role="dialog", aria-modal="true"
- ✅ Page diventa inert quando modal aperto

### 2. Contrasti Enterprise (Beyond WCAG)
- ✅ Primary text ≥ 7:1
- ✅ Body text 4.5-5.5:1  
- ✅ Secondary text ≥ 3.5:1
- ✅ Dark mode senza bianco puro
- ✅ Focus ring ≥ 3:1, spessore 2px+

### 3. Motion System Professionale
- ✅ 160-220ms desktop, 220-280ms mobile
- ✅ ease-out (entrata), ease-in (uscita)
- ✅ Scrim + blur controllato
- ✅ Sticky header con scroll shadow
- ✅ Rispetta prefers-reduced-motion

### 4. I18N Safety System
- ✅ Nessuna chiave raw in UI
- ✅ Fallback user-safe obbligatori
- ✅ Network status semanticamente corretto
- ✅ Dev-time guards per chiavi mancanti

## 🚀 Come Usare

### Drawer Base Enterprise

```tsx
import { DrawerEnterprise } from '@/shared/ui/DrawerEnterprise';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DrawerEnterprise
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Crypto in situazioni di emergenza"
      subtitle="Comprendi quando e come utilizzare le criptovalute"
      onCopyLink={() => {
        // Copy current URL with drawer state
        const url = `${window.location.href}?drawer=emergency-basics`;
        navigator.clipboard.writeText(url);
      }}
      footer={
        <div className="flex gap-3">
          <CTAEnterprise variant="primary">
            Prosegui nel percorso
          </CTAEnterprise>
          <CTAEnterprise variant="secondary">
            Rivedi contenuto
          </CTAEnterprise>
        </div>
      }
    >
      {/* Content */}
    </DrawerEnterprise>
  );
}
```

### Alert Semantici Corretti

```tsx
import { AlertEnterprise } from '@/shared/ui/DrawerEnterprise';

// ❌ SBAGLIATO - Network offline come "danger"
<AlertEnterprise
  type="danger"
  title="common.networkStatus.offline"
  message="common.networkStatus.offlineMessage"
/>

// ✅ CORRETTO - Network offline come "warning" con fallback
<AlertEnterprise
  type="warning"
  title="Connessione assente"
  message="Alcune funzioni potrebbero non essere disponibili. I tuoi dati non sono a rischio."
/>
```

### Progress States Chiari

```tsx
import { ProgressStateBadge } from '@/shared/ui/DrawerEnterprise';

// ❌ SBAGLIATO - Generico
<span>Da completare</span>

// ✅ CORRETTO - Specifico e utile
<ProgressStateBadge state="fundamental" timeEstimate="~3 min" />
<ProgressStateBadge state="not-started" />
<ProgressStateBadge state="completed" />
```

### Focus Chips con Gerarchia

```tsx
import { FocusChip } from '@/shared/ui/DrawerEnterprise';

<div className="flex flex-wrap gap-2">
  <FocusChip isPrimary>storia e contesto</FocusChip>
  <FocusChip>principi di funzionamento</FocusChip>
  <FocusChip>casi reali</FocusChip>
</div>
```

## 🎨 CSS Classes Disponibili

### Typography Enterprise
```css
.text-enterprise-primary    /* ≥7:1 - Titoli, dati chiave */
.text-enterprise-body       /* 4.5-5.5:1 - Contenuto principale */
.text-enterprise-secondary  /* ≥3.5:1 - Descrizioni, hint */
.text-enterprise-disabled   /* ≥3:1 - Stati disabilitati */
```

### Alert Components
```css
.alert-enterprise-info      /* Blu con info icon */
.alert-enterprise-warning   /* Amber con triangle-alert */
.alert-enterprise-danger    /* Rosso con octagon-alert (solo errori) */
.alert-enterprise-success   /* Verde con check-circle */
```

### Drawer Pattern
```css
.drawer-enterprise          /* Desktop: 420-520px, Mobile: bottom sheet */
.drawer-enterprise-header   /* Sticky header con scroll shadow */
.drawer-enterprise-content  /* Content con focus scroll-margin */
.drawer-list-item          /* List item ottimizzato per scanning */
```

### CTA Buttons
```css
.cta-enterprise-primary     /* Primary action, min 44px height */
.cta-enterprise-secondary   /* Secondary action, min 44px height */
```

### Progress & Focus
```css
.progress-state-not-started    /* "Non iniziato" badge */
.progress-state-fundamental    /* "Fondamentale" badge */
.progress-state-completed      /* "Completato" badge */

.focus-chip-primary           /* Primary focus chip */
.focus-chip-secondary         /* Secondary focus chips */
```

### Reading Optimization
```css
.reading-width               /* Max 65ch per leggibilità */
.reading-line-height         /* Line-height 1.6 */
.reading-paragraph-spacing   /* Spacing tra paragrafi */
```

## 🔧 Integrazione con Progetto Esistente

### 1. Sostituire PremiumDrawer

```tsx
// Prima (PremiumDrawer.tsx)
<PremiumDrawer isOpen={isOpen} onClose={onClose}>
  <div className="p-6">
    <h2>Titolo</h2>
    <p>Contenuto</p>
  </div>
</PremiumDrawer>

// Dopo (DrawerEnterprise)
<DrawerEnterprise
  isOpen={isOpen}
  onClose={onClose}
  title="Titolo"
  subtitle="Sottotitolo descrittivo"
  onCopyLink={handleCopyLink}
>
  <section>
    <h3>Sezione</h3>
    <DrawerListItem>Contenuto ottimizzato</DrawerListItem>
  </section>
</DrawerEnterprise>
```

### 2. Aggiornare Alert di Rete

```tsx
// Prima
{isOffline && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {t('common.networkStatus.offline')}
  </div>
)}

// Dopo
{isOffline && (
  <AlertEnterprise
    type="warning"
    title="Connessione assente"
    message="Alcune funzioni potrebbero non essere disponibili. I tuoi dati non sono a rischio."
  />
)}
```

### 3. Migliorare Stati di Progresso

```tsx
// Prima
<span className="text-gray-500">Da completare</span>

// Dopo
<ProgressStateBadge 
  state={getProgressState(item)} 
  timeEstimate={item.timeEstimate} 
/>
```

## 📋 Checklist di Implementazione

### Fase 1: Setup Base
- [ ] Importare DrawerEnterprise nel componente
- [ ] Sostituire drawer esistente
- [ ] Aggiungere title e subtitle descrittivi
- [ ] Implementare onCopyLink per deep linking

### Fase 2: Content Structure
- [ ] Organizzare contenuto in sezioni con H3
- [ ] Usare DrawerListItem per liste
- [ ] Aggiungere focus chips con gerarchia
- [ ] Implementare footer con CTA chiari

### Fase 3: Semantic Correctness
- [ ] Sostituire alert "danger" con "warning" per network
- [ ] Aggiornare progress states da generici a specifici
- [ ] Migliorare micro-copy dei CTA
- [ ] Verificare icon semantics (info/warning/danger/success)

### Fase 4: Accessibility Test
- [ ] Test keyboard-only navigation
- [ ] Verificare focus trap e restore
- [ ] Test ESC key per chiusura
- [ ] Verificare scroll-margin per focus
- [ ] Test screen reader (basic)

### Fase 5: Visual Polish
- [ ] Verificare contrasti con WebAIM Contrast Checker
- [ ] Test su laptop 13" a luminosità media
- [ ] Verificare target size ≥ 24px (44px touch)
- [ ] Test motion con prefers-reduced-motion
- [ ] Verificare scroll shadow su header

## 🎯 Risultato Finale

Seguendo questa implementazione otterrai:

1. **Trust**: Nessuna chiave i18n raw, messaggi sempre comprensibili
2. **Accessibility**: WCAG 2.2 AA+ compliance, keyboard navigation perfetta
3. **Readability**: Contrasti enterprise, typography ottimizzata
4. **UX**: Motion professionale, stati chiari, CTA guidanti
5. **Maintainability**: Componenti riusabili, pattern consistenti

**Questo è il livello Google/OpenAI/Binance per i drawer enterprise.**