# 🎨 DESIGN SYSTEM SOTA 2026 — Ricerca Avanzata
## Piattaforma Istituzionale ma Innovativa

---

## 🖤 1. COLOR SYSTEM — Dark First

### Base Neutrals (The New Standard)
| Token | Hex | Uso |
|-------|-----|-----|
| `bg-primary` | `#09090B` | Background principale (NOT pure black) |
| `bg-card` | `#18181B` | Cards, moduli |
| `bg-elevated` | `#27272A` | Hover stati, dropdown |
| `border-subtle` | `#3F3F46` | Bordi, separatori |
| `text-primary` | `#FAFAFA` | Testo principale (NOT pure white) |
| `text-secondary` | `#A1A1AA` | Label, descrizioni |
| `text-tertiary` | `#71717A` | Placeholder, disabled |

**Ratio contrasto:**
- Primary text: 15.4:1 (WCAG AAA)
- Secondary: 7.2:1 (WCAG AA)
- Tertiary: 4.6:1 (WCAG AA)

### Brand Gradients (Fintech/Trading)
```
Primary CTA: #10B981 → #14B8A6 (Emerald→Teal)
Innovation:  #8B5CF6 → #06B6D4 (Violet→Cyan)
Success:     #22C55E → #10B981 (Green gradient)
Warning:     #F59E0B → #F97316 (Amber→Orange)
Danger:      #EF4444 → #DC2626 (Red)
```

### Atmospheric Glows (Ambient)
```css
/* Hero background glow */
radial-gradient(400px circle at 20% 50%, 
  rgba(139, 92, 246, 0.05), 
  transparent 60%);
  
/* Card hover glow */
box-shadow: 0 0 40px rgba(16, 185, 129, 0.1);
```

---

## 🔤 2. TYPOGRAPHY — Humanist + Geometric

### Font Pairing SOTA 2026
| Ruolo | Font | Peso | Uso |
|-------|------|------|-----|
| **Display** | `Inter` o `Instrument Sans` | 600-700 | Headlines, numeri |
| **Body** | `Inter` | 400-500 | Testo, UI |
| **Accent** | `JetBrains Mono` | 500 | Codice, dati |

### Scale System
```
Display:   48px/56px  (3rem)     — Hero headlines
H1:        36px/44px  (2.25rem) — Section titles  
H2:        28px/36px  (1.75rem) — Card headers
H3:        20px/28px  (1.25rem) — Subsection
Body:      16px/24px  (1rem)     — Default text
Small:     14px/20px  (0.875rem) — Labels
Tiny:      12px/16px  (0.75rem)  — Captions
```

### Numeric Display (Trading-specific)
```
Tabular nums: font-variant-numeric: tabular-nums;
Tracking:     letter-spacing: -0.02em;
Font:         font-feature-settings: "tnum", "zero";
```

---

## ✨ 3. MOTION — Purposeful Transitions

### Easing Functions
```
Standard:   cubic-bezier(0.4, 0, 0.2, 1)  — UI transitions
Enter:      cubic-bezier(0, 0, 0.2, 1)   — Modal/sheet open
Exit:       cubic-bezier(0.4, 0, 1, 1)   — Modal/sheet close
Bounce:     cubic-bezier(0.34, 1.56, 0.64, 1) — Playful elements
Spring:     type: "spring", stiffness: 300, damping: 30
```

### Duration Scale
```
Micro:      100-150ms — Button hovers, toggles
Fast:       200ms     — Cards, tooltips
Medium:     300ms     — Drawers, sheets
Slow:       400-500ms — Page transitions, hero
```

### Framer Motion Patterns
```tsx
// Sheet/Drawer slide
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={{ type: "spring", damping: 30, stiffness: 300 }}

// Stagger children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// Viewport reveal
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
```

---

## 🎯 4. MICRO-INTERACTIONS

### Button Hover Effects
```css
/* Gradient shift + glow */
.btn-primary:hover {
  background: linear-gradient(135deg, #10B981, #14B8A6);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

/* Iridescent shimmer (premium CTAs) */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.btn-glow {
  background: linear-gradient(
    90deg, 
    #10B981, #14B8A6, #10B981
  );
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
}
```

### Card Interactions
```
Rest:     transform: scale(1); box-shadow: none;
Hover:    transform: scale(1.02) translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
Active:   transform: scale(0.98);
Duration: 200ms ease-out
```

### Focus States (Accessibility)
```css
/* Ring glow, no outline */
:focus-visible {
  outline: none;
  ring: 2px solid #10B981;
  ring-offset: 2px;
  ring-offset-color: #09090B;
}
```

---

## 🧊 5. DEPTH & SPATIAL DESIGN

### Elevation System
| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Base layer |
| 1 | `0 1px 2px rgba(0,0,0,0.2)` | Cards at rest |
| 2 | `0 4px 12px rgba(0,0,0,0.25)` | Hover cards |
| 3 | `0 12px 40px rgba(0,0,0,0.4)` | Modals, drawers |
| 4 | `0 24px 60px rgba(0,0,0,0.5)` | Full-screen overlays |

### Gradient Overlays (Atmospheric)
```css
/* Card gradient border effect */
.card-premium {
  position: relative;
  background: #18181B;
}
.card-premium::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #10B981, #8B5CF6);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, 
                linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

---

## 🏛️ 6. INSTITUTIONAL INNOVATION PRINCIPLES

### Color Psychology (Fintech)
| Color | Association | Usage |
|-------|-------------|-------|
| **Emerald/Green** | Growth, stability, profit | CTAs, success states, primary brand |
| **Blue** | Trust, reliability, security | Links, info, secondary actions |
| **Violet** | Innovation, premium, future | Accents, badges, highlights |
| **Amber/Gold** | Wealth, value, premium tier | VIP features, upgrades |
| **Red (sparingly)** | Loss, danger, warning | Errors, negative P&L |

### Trust Signals (Visual)
1. **Microcopy warmth** — "Il tuo capitale è protetto" vs "Funds secured"
2. **Transparent overlays** — "Come calcoliamo i costi" tooltips
3. **Stability in motion** — Transizioni smooth, mai abrupt
4. **Data density** — Numeri tabular, allineamento rigoroso
5. **Professional gradients** — Mai rainbow, solo brand colors

---

## 📱 7. RESPONSIVE CONSIDERATIONS

### Mobile-First
- Touch targets: min 44×44px
- Sheet height: 90vh with handle
- Swipe gestures: pan threshold 100px
- Reduced motion: `prefers-reduced-motion` support

### Desktop Enhancements
- Hover states enabled
- Cursor interactions (pointer vs default)
- Larger data tables
- Split-pane layouts

---

## 🎨 8. COMPONENT TOKENS

```json
{
  "colors": {
    "bg": {
      "primary": "#09090B",
      "card": "#18181B", 
      "elevated": "#27272A",
      "overlay": "rgba(0,0,0,0.6)"
    },
    "text": {
      "primary": "#FAFAFA",
      "secondary": "#A1A1AA",
      "tertiary": "#71717A",
      "disabled": "#52525B"
    },
    "brand": {
      "primary": "#10B981",
      "primary-light": "#14B8A6",
      "accent": "#8B5CF6"
    }
  },
  "radius": {
    "sm": "6px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px"
  },
  "shadows": {
    "card": "0 4px 12px rgba(0,0,0,0.25)",
    "elevated": "0 12px 40px rgba(0,0,0,0.4)",
    "glow": "0 0 40px rgba(16,185,129,0.15)"
  }
}
```

---

## 📚 Fonti Ricerca

1. **Recursion Software** — "The Modern Color Palette: UI/UX Color Trends That Define 2026"
   - #09090B è il nuovo nero
   - Gradient systems, not accents
   - Dark mode as default

2. **Jolicia Type** — "Color Forecast 2026"
   - Neo Earth Tones
   - Future Neutrals
   - Energetic Contrast Accents

3. **Eleken** — "Modern Fintech Design Guide 2026"
   - Motion with purpose
   - Accessibility as trust signal
   - Microcopy builds confidence

4. **Muzli** — "Dark Mode Design Systems 2026"
   - WCAG compliance
   - Visual hierarchy through depth

---

## ✅ Checklist Implementazione

- [ ] Dark mode default (#09090B base)
- [ ] Emerald→Teal brand gradient
- [ ] Inter font family
- [ ] Spring animations (damping 30)
- [ ] Glow effects on CTAs
- [ ] Tabular numbers for data
- [ ] 44px touch targets
- [ ] prefers-reduced-motion support
- [ ] WCAG AA contrast ratios
- [ ] Atmospheric background glows

---

*Ricerca condotta: Aprile 2026*
*Per: Tradelia Platform — Institutional Trading*
