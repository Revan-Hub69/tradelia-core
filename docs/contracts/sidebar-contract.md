# Sidebar Contract - Tradelia 2026

> La sidebar NON è un menu. È un navigation system con stato, gerarchia e contesto.

---

## 1. Tipologia: Hybrid

```
Desktop (≥1024px): Persistent
Mobile (<1024px):  Overlay
```

Stesso contenuto, comportamento diverso.

---

## 2. Dimensioni

| Stato | Desktop | Mobile |
|-------|---------|--------|
| Expanded | 256px | 300px |
| Collapsed | 64px | N/A |

---

## 3. Struttura HTML

```
┌─────────────────────────────┐
│ Header                      │  ← position: sticky, top: 0
│  - Logo                     │
│  - Close button (mobile)    │
├─────────────────────────────┤
│                             │
│ User Card                   │  ← Opzionale
│  - Avatar                   │
│  - Nome                     │
│  - Stato (guest/verified)   │
│                             │
├─────────────────────────────┤
│                             │
│ Navigation                  │  ← overflow-y: auto
│  - Primary items            │
│  - Secondary items          │
│                             │
├─────────────────────────────┤
│ Preferences                 │  ← Theme, Language
├─────────────────────────────┤
│ Footer                      │  ← position: sticky, bottom: 0
│  - Logout                   │
└─────────────────────────────┘
```

---

## 4. State Ownership

```typescript
// Owner: DashboardLayout
const [isSidebarOpen, setIsSidebarOpen] = useState(false)

// Header emette evento
<Header onMenuClick={() => setIsSidebarOpen(true)} />

// Sidebar riceve props, emette onClose
<Sidebar 
  isOpen={isSidebarOpen} 
  onClose={() => setIsSidebarOpen(false)} 
/>
```

**VIETATO**: Sidebar con proprio `useState(isOpen)`

---

## 5. Comportamento Mobile (Overlay)

### Apertura
- [ ] Backdrop `bg-black/60 backdrop-blur-sm`
- [ ] Slide-in da sinistra (200ms)
- [ ] Body scroll lock
- [ ] Focus trap attivo

### Chiusura
- [ ] ESC chiude
- [ ] Click backdrop chiude
- [ ] Route change chiude
- [ ] Restore focus a menu button

### Accessibilità
```tsx
<div role="dialog" aria-modal="true" aria-label="Menu navigazione">
  <button aria-label="Chiudi menu" onClick={onClose}>
    <CloseIcon />
  </button>
</div>
```

---

## 6. Comportamento Desktop (Persistent)

### Default
- Sempre visibile
- Non overlay
- Contenuto principale con `margin-left: 256px`

### Collapsed (opzionale)
- Solo icone
- Tooltip su hover
- Stato persistito in localStorage
- Toggle button sempre visibile

---

## 7. Navigation Items

### Struttura
```tsx
interface NavItem {
  name: string      // Testo visibile
  href: string      // Route
  icon: Component   // Icona (sempre presente)
  badge?: number    // Notifiche (opzionale)
}
```

### Active State
```css
/* Item attivo */
.nav-item-active {
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
}

/* Accent stripe (opzionale) */
.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: hsl(var(--primary));
  border-radius: 0 2px 2px 0;
}
```

### Hover State
```css
.nav-item:hover {
  background: hsl(var(--muted) / 0.5);
}
```

**Regola**: Hover ≠ Active (devono essere distinguibili)

---

## 8. Icone

- Sempre presenti (icon + testo)
- Stroke coerente: 1.5-2px
- Size: 20px (nav items), 16px (actions)
- Stesso peso ottico

---

## 9. Animazioni

| Azione | Durata | Easing |
|--------|--------|--------|
| Open | 200ms | ease-out |
| Close | 150ms | ease-in |
| Collapse | 200ms | ease-in-out |
| Hover | 150ms | ease |

```css
@media (prefers-reduced-motion: reduce) {
  .sidebar { transition: none; }
}
```

---

## 10. Z-Index

```
Backdrop:  z-40
Sidebar:   z-50
Header:    z-60 (sopra sidebar per menu button)
```

---

## 11. Responsive Breakpoint

```typescript
// Breakpoint per switch behavior
const MOBILE_BREAKPOINT = 1024 // px

// Hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  return isMobile
}
```

---

## 12. Checklist Implementazione

### Mobile
- [ ] Overlay con backdrop
- [ ] ESC chiude
- [ ] Click fuori chiude
- [ ] Route change chiude
- [ ] Focus trap
- [ ] Scroll lock body
- [ ] Restore focus
- [ ] Animazione slide-in

### Desktop
- [ ] Persistente
- [ ] Collapse toggle (opzionale)
- [ ] Stato collapse in localStorage
- [ ] Tooltip in collapsed mode

### Entrambi
- [ ] Active state chiaro
- [ ] Hover distinguibile da active
- [ ] Icone coerenti
- [ ] Header/footer fixed
- [ ] Nav scrollabile
- [ ] Accessibilità (aria, role)
