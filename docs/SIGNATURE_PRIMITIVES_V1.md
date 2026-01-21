# Signature Primitives v1 - Implementation Guide

**Data**: 21 Gennaio 2026  
**Status**: ✅ Implementato  
**Approccio**: Primitive hardened, non sistemi globali

---

## 🎯 REGOLA D'ORO (NON NEGOZIABILE)

❌ **NON integriamo "signature systems"**  
✅ **Integriamo Signature Primitives v1**

**Perché**:
- ✅ Mantiene SSR
- ✅ Mantiene modularità
- ✅ Mantiene performance
- ✅ Mantiene sanità mentale

**Se violi questa regola**:
- ❌ Rientra il caos
- ❌ Tornano side effects
- ❌ Next.js ti trascina tutto in client

---

## 🧱 CLASSIFICAZIONE SIGNATURE

### ❌ CATEGORIA A — DA BLOCCARE (NON ORA)

**Non entrano in dashboard adesso. Punto.**

- `IntelligentCalmUX` → side effects globali
- `BrandMemorySystem` → richiede event bus
- `TradeliaSignatureMoment` → milestone non esistono
- `SemanticLoadingStates` → incompleto
- `HapticVisualFeedback` → API instabile

⛔ **Non importarli nemmeno per sbaglio.**

---

### ⚠️ CATEGORIA B — DA SMONTARE (diventano primitive)

**Questi NON vanno usati così come sono, ma sono la materia prima.**

- `GlassSurface` → diventa `UiSurface`
- `GlassCard` → diventa `UiSurface variant="card"`
- `SignatureButton` → diventa `UiButton`
- `HapticCard` → diventa `UiNavItem` (se esiste)
- `SignatureMicroInteractions` → press feedback in `UiButton`

👉 **Li rifacciamo come primitive stabili.**

---

### ✅ CATEGORIA C — CREATO ORA (Signature Primitives v1)

**Queste sono le SOLE cose che entrano in dashboard adesso.**

---

## 🧩 LE 6 SIGNATURE PRIMITIVES (OBBLIGATORIE)

### 1️⃣ `<UiSurface />`

**Sostituisce**:
- `GlassSurface`
- `glass-header`
- `glass-surface`

**Props**:
```typescript
type UiSurfaceProps = {
  variant: 'header' | 'panel' | 'card';
  children: ReactNode;
  className?: string;
};
```

**Regole**:
- ✅ Solo CSS + tokens
- ✅ Zero JS
- ✅ Server-safe

**Usage**:
```tsx
// Header
<UiSurface variant="header">
  <nav>...</nav>
</UiSurface>

// Panel
<UiSurface variant="panel">
  <div>...</div>
</UiSurface>

// Card
<UiSurface variant="card">
  <article>...</article>
</UiSurface>
```

---

### 2️⃣ `<UiButton />`

**Sostituisce**:
- `SignatureButton`
- `press-depth`
- CTA header

**Props**:
```typescript
type UiButtonProps = {
  variant: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md';
  asChild?: boolean;
};
```

**Regole**:
- ✅ focus-visible
- ✅ aria compliant
- ✅ Zero side effects

**Usage**:
```tsx
// Primary CTA
<UiButton variant="primary">Riprendi</UiButton>

// Secondary
<UiButton variant="secondary">Annulla</UiButton>

// Ghost
<UiButton variant="ghost">Modifica</UiButton>

// As Link
<UiButton asChild>
  <Link href="/learn">Vai</Link>
</UiButton>
```

---

### 3️⃣ `<UiIconButton />`

**Per**:
- search
- bell
- help
- avatar trigger

**Props**:
```typescript
type UiIconButtonProps = {
  label: string; // aria-label (obbligatorio)
  icon: ReactNode;
  active?: boolean;
  badge?: boolean; // Notification dot
};
```

**Usage**:
```tsx
// Search
<UiIconButton label="Search" icon={<Search />} />

// Notifications with badge
<UiIconButton label="Notifications" icon={<Bell />} badge />

// Active state
<UiIconButton label="Menu" icon={<Menu />} active />
```

---

### 4️⃣ `<UiNavItem />`

**Unifica**:
- sidebar
- bottom nav
- header breadcrumbs

**Props**:
```typescript
type UiNavItemProps = {
  active?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  asChild?: boolean;
};
```

**Regole**:
- ✅ `aria-current="page"` per active
- ✅ focus-visible
- ✅ Zero side effects

**Usage**:
```tsx
// Sidebar
<UiNavItem active icon={<Home />}>
  Home
</UiNavItem>

// Bottom Nav
<UiNavItem icon={<Learn />}>
  Percorsi
</UiNavItem>

// As Link
<UiNavItem asChild>
  <Link href="/profile">Profilo</Link>
</UiNavItem>
```

---

### 5️⃣ `<UiPanel />`

**Sostituisce TUTTI i futuri**:
- Notification panel
- Help panel
- CommandPalette wrapper

**Props**:
```typescript
type UiPanelProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
};
```

**Regole**:
- ✅ focus trap (Radix Dialog)
- ✅ ESC to close
- ✅ aria-modal

**Usage**:
```tsx
// Notifications
<UiPanel 
  open={open} 
  onClose={close}
  title="Notifiche"
  description="Le tue notifiche recenti"
>
  <NotificationList />
</UiPanel>

// Help
<UiPanel open={open} onClose={close} title="Aiuto">
  <HelpContent />
</UiPanel>

// Command Palette
<UiPanel open={open} onClose={close}>
  <CommandPaletteContent />
</UiPanel>
```

---

### 6️⃣ `<UiStatusChip />`

**Sostituisce**:
- streak
- progress
- status header

**Props**:
```typescript
type UiStatusChipProps = {
  variant: 'info' | 'success' | 'warning' | 'streak' | 'progress';
  label: string;
  icon?: ReactNode;
  value?: string | number;
};
```

**Usage**:
```tsx
// Streak
<UiStatusChip 
  variant="streak" 
  label="giorni" 
  value={7}
  icon={<Flame />}
/>

// Progress
<UiStatusChip 
  variant="progress" 
  label="Completato" 
  value="75%"
/>

// Info
<UiStatusChip 
  variant="info" 
  label="Focus Mode"
/>
```

---

## 🏗️ DOVE SONO

```
src/components/ui/
├─ UiSurface.tsx       ✅ Creato
├─ UiButton.tsx        ✅ Creato
├─ UiIconButton.tsx    ✅ Creato
├─ UiNavItem.tsx       ✅ Creato
├─ UiPanel.tsx         ✅ Creato
├─ UiStatusChip.tsx    ✅ Creato
└─ index.ts            ✅ Creato
```

⚠️ **NON in `signature/`** → laboratorio / R&D  
⚠️ **NON in `dashboard/`** → componenti specifici

👉 **`ui/` = foundation layer**

---

## 🧭 INTEGRAZIONE NELLA DASHBOARD (SENZA RISCHI)

### Header

**Prima**:
```tsx
<header className="glass-header">
  <button className="press-depth">Riprendi</button>
  <div className="glass-surface">Status</div>
</header>
```

**Dopo**:
```tsx
<UiSurface variant="header">
  <UiButton variant="primary">Riprendi</UiButton>
  <UiStatusChip variant="streak" label="giorni" value={7} />
  <UiIconButton label="Search" icon={<Search />} />
  <UiIconButton label="Notifications" icon={<Bell />} badge />
  <UiIconButton label="Help" icon={<HelpCircle />} />
</UiSurface>
```

---

### Sidebar / BottomNav

**Prima**:
```tsx
<nav>
  <a className={isActive ? 'active' : ''}>
    <HomeIcon />
    Home
  </a>
</nav>
```

**Dopo**:
```tsx
<nav>
  <UiNavItem active icon={<Home />}>
    Home
  </UiNavItem>
  <UiNavItem icon={<BookOpen />}>
    Percorsi
  </UiNavItem>
  <UiNavItem icon={<TrendingUp />}>
    Progresso
  </UiNavItem>
</nav>
```

---

## 🚨 REGOLE DI SICUREZZA (DA RISPETTARE)

### ❌ Nessuna primitive deve usare `useEffect`
### ❌ Nessuna primitive deve leggere `window`
### ❌ Nessuna primitive deve gestire stato globale
### ❌ Nessuna primitive deve dipendere da context

**Se violi anche una sola di queste**:
- ❌ Non è una primitive → è un sistema → fuori dalla dashboard

---

## 🧠 COSA SUCCEDE DOPO (IMPORTANTISSIMO)

**Quando avrai**:
- backend notifiche
- eventi reali
- milestone vere

**ALLORA**:
- `IntelligentCalmUX` diventa wrapper di `UiPanel`
- `BrandMemorySystem` diventa observer dei context
- `TradeliaSignatureMoment` usa `UiSurface` + `UiStatusChip`

👉 **Non butti via nulla**  
👉 **Lo innesti sopra, non sotto**

---

## 🧨 VERDETTO FINALE (ONESTO)

### Se integri i signature così:

✔️ Mantieni l'architettura che hai appena costruito  
✔️ Eviti side effects  
✔️ Eviti clientification  
✔️ Dai IDENTITÀ VISIVA REALE  
✔️ Prepari il terreno per la "signature vera" dopo

### Se invece integri i signature come sono ora:

❌ Rompi tutto  
❌ Torni al caos  
❌ Next.js ti punisce

---

## 📋 MIGRATION CHECKLIST

### Phase 1: Header (Priority)

- [ ] `DashboardHeader.tsx` → usa `UiSurface variant="header"`
- [ ] Replace CTA buttons → `UiButton variant="primary"`
- [ ] Replace icon buttons → `UiIconButton`
- [ ] Replace status chips → `UiStatusChip`

### Phase 2: Navigation (Priority)

- [ ] `SidebarNavigation.tsx` → usa `UiNavItem`
- [ ] `PWABottomNavigationSimple.tsx` → usa `UiNavItem`
- [ ] Replace `glass-surface` → `UiSurface`

### Phase 3: Panels (Secondary)

- [ ] `CommandPalette.tsx` → wrappa con `UiPanel`
- [ ] Future notification panel → usa `UiPanel`
- [ ] Future help panel → usa `UiPanel`

### Phase 4: Cards (Secondary)

- [ ] `LearningPathCard.tsx` → usa `UiSurface variant="card"`
- [ ] `GamificationPanel.tsx` → usa `UiSurface variant="card"`

---

## 🎯 VALIDATION

### Test Checklist

- [ ] Header renderizza correttamente
- [ ] Navigation funziona (sidebar, bottom nav)
- [ ] Buttons hanno focus-visible
- [ ] NavItems hanno aria-current
- [ ] StatusChips mostrano valori corretti
- [ ] IconButtons hanno aria-label
- [ ] Panel ha focus trap
- [ ] ESC chiude panel
- [ ] No hydration errors
- [ ] No console errors

### Visual Regression

- [ ] Glass effects funzionano
- [ ] Press feedback funziona (CSS-only)
- [ ] Hover states corretti
- [ ] Active states corretti
- [ ] Dark mode funziona
- [ ] Responsive design mantiene coerenza

---

## 📚 RIFERIMENTI

### Documenti Correlati

- `docs/ARCHITECTURE_ALIGNMENT_2026.md` - Architettura dashboard
- `docs/AUDIT_VALIDATION_2026.md` - Audit validazione
- `.kiro/specs/navigation/semantic-utilities-migration.md` - Migration CSS

### Signature Components (Laboratorio)

- `src/components/signature/` - R&D components (NON usare direttamente)
- `src/components/signature/TradelliaGlass.tsx` - Base per UiSurface
- `src/components/signature/SignatureMicroInteractions.tsx` - Base per UiButton

---

## ⚠️ IMPORTANT NOTES

### 1. Server vs Client

**Server-safe** (no 'use client'):
- ✅ `UiSurface`
- ✅ `UiButton`
- ✅ `UiIconButton`
- ✅ `UiNavItem`
- ✅ `UiStatusChip`

**Client-only** ('use client'):
- ⚠️ `UiPanel` (usa Radix Dialog)

### 2. Dependencies

**Required**:
- `@radix-ui/react-dialog` (per UiPanel)
- `@radix-ui/react-slot` (per asChild pattern)
- `class-variance-authority` (per UiButton variants)
- `lucide-react` (per icons)

**Already installed**: ✅ (verificare package.json)

### 3. Import Pattern

```tsx
// ✅ CORRECT
import { UiButton, UiSurface, UiNavItem } from '@/components/ui';

// ❌ WRONG
import { GlassSurface } from '@/components/signature/GlassSurface';
import { SignatureButton } from '@/components/signature/SignatureMicroInteractions';
```

---

## 🎓 LESSONS LEARNED

### Cosa Ha Funzionato

1. **Primitive approach** → Evita side effects
2. **Server-safe** → Mantiene SSR
3. **CSS-only animations** → Performance
4. **Aria compliant** → Accessibility

### Cosa Evitare

1. ❌ Importare signature systems direttamente
2. ❌ Usare useEffect nelle primitive
3. ❌ Leggere window nelle primitive
4. ❌ Stato globale nelle primitive

### Best Practice

**Approccio**: Primitive → Systems → Features

**Non**: Systems → Features (salta primitive)

---

*Signature Primitives v1 implementato: 21 Gennaio 2026*  
*Approccio: Hardened primitives, non sistemi globali*  
*Principio: Foundation first, systems later*
