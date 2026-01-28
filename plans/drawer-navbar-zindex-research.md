# Research Tier 1: Drawer/Navbar Z-Index Conflicts

## Problem Analysis

### Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Z-INDEX HIERARCHY                         │
├─────────────────────────────────────────────────────────────┤
│  z-[9999]  │ SkipLinks (accessibility)                       │
│  z-[151]   │ MobileFullscreenMenu / MobileDropdownPopover    │
│  z-[150]   │ Backdrop for mobile menus                       │
│  z-[101]   │ OfferSelector Bottom Sheet                      │
│  z-[100]   │ Bottom Navigation (bottom-nav-capsule-2026)     │
│  z-[100]   │ OfferSelector Backdrop                          │
│  z-[70]    │ MobileDropdownDialog                            │
│  z-[70]    │ UiSurface Panel                                 │
│  z-50      │ ProgramDrawer                                   │
│  z-50      │ EnrollmentButton Modal                          │
│  z-50      │ ChallengeFilters                                │
│  z-50      │ ChallengeComparison                             │
│  z-50      │ PostRedirectBanner                              │
│  z-50      │ ContextMenu                                     │
│  z-40      │ LessonFooter (fixed bottom)                     │
│  z-40      │ SidebarNavigation                               │
│  z-[40]    │ EnrollmentBanner                                │
│  z-10      │ Various sticky headers                          │
└─────────────────────────────────────────────────────────────┘
```

### The Problem

1. **ProgramDrawer** usa `z-50` per il drawer e il backdrop
2. **BottomNavigation** usa `z-[100]` (variabile CSS `--bottom-nav-z: 100`)
3. **OfferSelector** usa `z-[100]` per backdrop e `z-[101]` per il bottom sheet

Quando il drawer si apre:
- Il backdrop a z-50 oscura il contenuto
- Ma la bottom navigation a z-100 rimane visibile SOPRA il backdrop
- I pulsanti del drawer (footer) sono a z-50, quindi compaiono SOTTO la bottom nav

## Tier 1 Research: Best Practices

### Pattern 1: Modal/Drawer Stacking Context (Apple, Google, Airbnb)

```
Approccio: Il drawer/modale deve sempre essere sopra TUTTO

Soluzione:
- Drawer backdrop: z-[200]
- Drawer content: z-[201]
- Bottom nav: rimane a z-100 ma viene nascosta quando drawer è aperto
```

### Pattern 2: Body Scroll Lock + Bottom Nav Hide (Twitter, Instagram)

```
Quando un drawer/modale si apre:
1. Blocca lo scroll del body
2. Nascondi la bottom navigation
3. Mostra il drawer a z-50 (sufficiente se bottom nav è nascosta)
```

### Pattern 3: CSS Custom Properties per Z-Index Scale

```css
:root {
  /* Z-Index Scale - Tier 1 Architecture */
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-nav: 30;
  --z-drawer: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
  --z-toast: 80;
  --z-overlay: 90;
}
```

## Recommended Solution

### Option A: Hide Bottom Nav When Drawer Opens (Recommended)

**Pros:**
- Più pulito visivamente
- Pattern usato da Twitter, Instagram
- Non richiede cambiamenti massivi agli z-index

**Implementation:**
```tsx
// In DashboardClient o NavigationProvider
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

// BottomNavigationSimple
<nav className={cn('bottom-nav-capsule-2026', isDrawerOpen && 'hidden')} />
```

### Option B: Increase Drawer Z-Index Above Bottom Nav

**Pros:**
- Semplice da implementare
- Non richiede logica di stato

**Cons:**
- Bottom nav rimane visibile sopra il backdrop (strano visivamente)
- Può creare confusione UX

**Implementation:**
```css
/* ProgramDrawer */
.drawer-backdrop { z-index: 110; }
.drawer-content { z-index: 111; }
```

### Option C: CSS Custom Properties Architecture (Best Long-term)

**Implementation:**
```css
:root {
  --z-bottom-nav: 100;
  --z-drawer-backdrop: 110;
  --z-drawer-content: 111;
  --z-modal-backdrop: 120;
  --z-modal-content: 121;
}
```

## Decision

**Raccomandazione: Option A + Option C**

1. **Short-term:** Nascondere la bottom nav quando il drawer è aperto
2. **Long-term:** Implementare CSS custom properties per z-index scale

## Implementation Plan

### Phase 1: Hide Bottom Nav (Immediate)
- [ ] Aggiungere stato `isDrawerOpen` in NavigationProvider
- [ ] Passare stato a BottomNavigationSimple
- [ ] Aggiungere classe `hidden` quando drawer è aperto

### Phase 2: Z-Index Architecture (Future)
- [ ] Definire CSS custom properties per z-index
- [ ] Refactor tutti i componenti per usare le variabili
- [ ] Documentare la z-index scale

## Files to Modify

1. `src/components/navigation/NavigationProvider.tsx` - Aggiungere stato drawer
2. `src/components/navigation/BottomNavigationSimple.tsx` - Conditionally hide
3. `src/components/dashboard/challenges/ProgramDrawer.tsx` - Notificare stato
4. `src/components/dashboard/challenges/OfferSelector.tsx` - Notificare stato
