# UX Contract - Tradelia 2026

> Se una feature non è usabile con tastiera, zoom 200%, e luce forte → è fragile.

---

## 1. Overlay (Sidebar, Modal, Drawer)

Ogni overlay è una mini-app. DEVE avere:

### Apertura
- [ ] Focus trap attivo
- [ ] Scroll body bloccato
- [ ] Backdrop cliccabile per chiudere
- [ ] Animazione < 200ms

### Chiusura
- [ ] ESC chiude SEMPRE
- [ ] Click fuori chiude
- [ ] Restore focus all'elemento che ha aperto
- [ ] Animazione < 150ms

### Accessibilità
- [ ] `role="dialog"` o `role="navigation"`
- [ ] `aria-modal="true"`
- [ ] `aria-label` descrittivo
- [ ] Tab cycle interno (focus trap)

---

## 2. Sidebar Specifica

### Desktop (≥1024px)
- Persistente, sempre visibile
- Collassabile (icon-only mode)
- Larghezza: 256px expanded, 64px collapsed
- Stato collapse persistito in localStorage

### Mobile (<1024px)
- Overlay con backdrop
- Larghezza: 300px
- Si chiude su route change
- Si chiude su click fuori

### Struttura Interna
```
┌─────────────────────────────┐
│ Header (logo)               │  ← FIXED, non scrolla
├─────────────────────────────┤
│                             │
│  Navigation                 │  ← SCROLLA
│   - Item attivo evidenziato │
│   - Icona + testo           │
│                             │
├─────────────────────────────┤
│ Footer (logout, settings)   │  ← FIXED, non scrolla
└─────────────────────────────┘
```

### Active State
- Background: `bg-primary/10`
- Testo: `text-primary`
- Accent stripe sinistra (opzionale)
- Contrasto ≥ 4.5:1

---

## 3. Form e Input

### Validazione
- Errori inline sotto il campo
- Colore: `text-error`
- Icona opzionale
- `role="alert"` per screen reader

### Stati
| Stato | Stile |
|-------|-------|
| Default | `border-border` |
| Focus | `ring-2 ring-primary` |
| Error | `border-error` |
| Disabled | `opacity-50 cursor-not-allowed` |

### Submit
- Disabilitato durante loading
- Spinner o testo "Caricamento..."
- No doppio submit

---

## 4. Stati Vuoti

Ogni lista/tabella DEVE avere empty state:

```tsx
// ✅ Corretto
{items.length === 0 ? (
  <EmptyState 
    icon={<BoxIcon />}
    title="Nessun elemento"
    description="Aggiungi il primo elemento per iniziare"
    action={<Button>Aggiungi</Button>}
  />
) : (
  <ItemList items={items} />
)}
```

---

## 5. Stati di Errore

### Errori di rete
- Messaggio umano, non stack trace
- Azione di retry
- Non bloccare tutta la UI

### Errori di validazione
- Inline, vicino al campo
- Specifici ("Email non valida" non "Errore")

### Errori fatali
- Pagina dedicata
- Link per tornare indietro
- Opzione di contatto supporto

---

## 6. Loading States

### Preferenze
1. **Skeleton** (preferito) - mantiene layout
2. **Spinner inline** - per azioni puntuali
3. **Spinner fullscreen** - MAI (blocca UI)

### Regole
- Skeleton deve matchare layout finale
- No layout shift al caricamento
- Timeout con fallback dopo 10s

---

## 7. Responsive Behavior

### Breakpoints
| Nome | Min Width | Uso |
|------|-----------|-----|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |

### Mobile First
- Progetta per mobile, poi espandi
- Touch target minimo: 44x44px
- No hover-only actions

---

## 8. Keyboard Navigation

### Tab Order
- Logico (top-to-bottom, left-to-right)
- Skip link per contenuto principale
- No tab trap (eccetto modal)

### Shortcuts
| Shortcut | Azione |
|----------|--------|
| `ESC` | Chiudi overlay |
| `Enter` | Conferma/Submit |
| `Space` | Toggle checkbox/button |
| `Arrow` | Naviga liste |

---

## 9. Feedback Utente

### Azioni
- Feedback immediato (< 100ms percepito)
- Conferma per azioni distruttive
- Toast per conferme asincrone

### Toast/Notifiche
- Posizione: top-right o bottom-right
- Auto-dismiss: 5s (info), manual (error)
- Max 3 visibili contemporaneamente

---

## 10. Performance Percepita

| Metrica | Target |
|---------|--------|
| First paint | < 1s |
| Interactive | < 3s |
| Sidebar open | < 150ms percepiti |
| Route change | < 300ms percepiti |

### Tecniche
- Skeleton durante fetch
- Optimistic updates
- Prefetch su hover link
- No blocking render

---

## Checklist Pre-Release

- [ ] Testato con solo tastiera
- [ ] Testato con zoom 200%
- [ ] Testato con prefers-reduced-motion
- [ ] Empty state per ogni lista
- [ ] Error state per ogni fetch
- [ ] Loading skeleton (no spinner fullscreen)
- [ ] ESC chiude tutti gli overlay
- [ ] Focus restore dopo overlay
