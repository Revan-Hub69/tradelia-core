# Design Contract - Tradelia 2026

> Token non sono colori. Token sono ruoli semantici.

---

## 1. Token Semantici (OBBLIGATORI)

### Colori Testo
| Token | Uso | Contrasto |
|-------|-----|-----------|
| `foreground` | Testo principale | AAA (14:1+) |
| `muted-foreground` | Testo secondario | AAA (7:1+) |
| `subtle-foreground` | Testo terziario (timestamp, metadata) | AA (4.5:1) |

### Colori Stato
| Token | Uso |
|-------|-----|
| `success` | Positivo, completato, guadagno |
| `warning` | Attenzione, rischio moderato |
| `error` | Errore, perdita, azione distruttiva |
| `primary` | Azione principale, brand |

### Superfici
| Token | Uso |
|-------|-----|
| `background` | Sfondo pagina |
| `surface` | Card, pannelli |
| `surface-elevated` | Elementi sovrapposti |
| `muted` | Sfondo secondario |

### Bordi
| Token | Uso |
|-------|-----|
| `border` | Separatori, card borders |
| `border/50` | Bordi sottili |

---

## 2. Colori Hardcoded = VIETATI

❌ MAI usare:
```
text-gray-600, bg-blue-500, text-red-700, bg-green-50
```

✅ SEMPRE usare:
```
text-muted-foreground, bg-primary, text-error, alert-success
```

**Eccezione unica**: colori brand esterni (es. logo Google nei bottoni OAuth)

---

## 3. Contrasti WCAG 2.2

| Elemento | Minimo | Target |
|----------|--------|--------|
| Testo normale | 4.5:1 (AA) | 7:1 (AAA) |
| Testo grande (≥24px) | 3:1 (AA) | 4.5:1 (AAA) |
| UI non-testuale | 3:1 | 3:1 |
| Focus ring | 3:1 | 3:1 |

---

## 4. Focus States

```css
/* Standard focus - SEMPRE visibile */
*:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: primary;
  ring-offset: 2px;
}
```

Regole:
- Focus ring SEMPRE visibile (no `ring-primary/60`)
- Spessore minimo 2px
- Contrasto ≥ 3:1 contro background

---

## 5. Spacing System

Base: **8px**

| Nome | Valore | Uso |
|------|--------|-----|
| `space-1` | 4px | Micro gap |
| `space-2` | 8px | Gap interno |
| `space-3` | 12px | Gap elementi |
| `space-4` | 16px | Padding card |
| `space-6` | 24px | Sezioni |
| `space-8` | 32px | Sezioni grandi |

---

## 6. Tipografia

| Ruolo | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Display | 48-60px | 700 | 1.1 |
| H1 | 30-36px | 700 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 500 | 1.4 |

**Numeri**: sempre `font-variant-numeric: tabular-nums`

---

## 7. Transizioni

| Tipo | Durata | Easing |
|------|--------|--------|
| Colori (hover) | 150ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Transform | 150ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Overlay open | 200ms | ease-out |
| Overlay close | 150ms | ease-in |

**prefers-reduced-motion**: tutte le animazioni → 0ms

---

## 8. Shadows

| Nome | Uso |
|------|-----|
| `shadow-sm` | Card default |
| `shadow-md` | Card hover |
| `shadow-lg` | Dropdown, popover |
| `shadow-xl` | Modal |
| `shadow-2xl` | Sidebar overlay |

---

## 9. Z-Index Scale

| Layer | Z-Index | Uso |
|-------|---------|-----|
| Base | 0 | Contenuto normale |
| Dropdown | 10 | Menu dropdown |
| Sticky | 20 | Header sticky |
| Overlay | 40 | Backdrop |
| Modal | 50 | Modal, sidebar |
| Toast | 60 | Notifiche |
| Tooltip | 70 | Tooltip |

---

## 10. Griglia Dashboard

| Breakpoint | Colonne | Gutter |
|------------|---------|--------|
| Mobile (<640px) | 4 | 16px |
| Tablet (640-1024px) | 8 | 24px |
| Desktop (>1024px) | 12 | 24px |

---

## Checklist Pre-Commit

- [ ] Zero colori hardcoded
- [ ] Contrasti verificati (AA minimo)
- [ ] Focus visibile su tutti gli interattivi
- [ ] Spacing multiplo di 4px
- [ ] Transizioni con prefers-reduced-motion
