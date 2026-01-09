# Dashboard Design Contract 2026 - Tradelia

> Mobile = controllo rapido, non analisi profonda.
> Desktop = analisi completa, decisioni informate.

---

## 1. I 4 Journey (NON sezioni)

| Journey | Icona | Scopo | Azione Primaria |
|---------|-------|-------|-----------------|
| **Emergenza** | 🛡️ | Liquidità immediata, protezione | "Verifica liquidità" |
| **Lungo termine** | 🌱 | Crescita stabile, DCA | "Aggiungi piano" |
| **Speculazione** | ⚡ | Trading attivo, opportunità | "Analizza segnale" |
| **Passivo** | ♻️ | Rendite automatiche, staking | "Calcola rendimento" |

Ogni journey ha:
- Sezioni locali diverse
- KPI specifici
- Azioni contestuali
- Risk profile diverso

---

## 2. Navigazione Mobile

### Bottom Navigation (SEMPRE visibile)
```
┌─────────────────────────────────────────┐
│  🛡️      🌱       ⚡       ♻️          │
│ Emerg.  Lungo   Spec.   Passivo        │
└─────────────────────────────────────────┘
```

Regole:
- 4 tab fissi, MAI cambiano
- Icona + label sempre
- Active state forte (bg-primary/10 + text-primary)
- NO badge rumorosi

### Top Bar (cambia per journey)
```
┌─────────────────────────────────────────┐
│ ≡  [Journey Name]        [Action] 👤   │
└─────────────────────────────────────────┘
```

Contiene:
- Hamburger → apre drawer sezioni
- Nome journey
- Azione primaria del journey
- Avatar/profilo

### Drawer Laterale (sezioni locali)
Slide from left, overlay scuro, ESC chiude.

**Contenuto cambia per journey:**

#### 🛡️ Emergenza
- Overview liquidità
- Asset liquidi
- Piano di uscita
- Storico prelievi

#### 🌱 Lungo termine
- Overview crescita
- Piani DCA attivi
- Proiezioni
- Ribilanciamento

#### ⚡ Speculazione
- Segnali attivi
- Posizioni aperte
- Analisi tecnica
- Storico trade

#### ♻️ Passivo
- Rendimenti attivi
- Staking positions
- Yield farming
- Proiezioni APY

---

## 3. Navigazione Desktop

### Sidebar Persistente (sinistra)
```
┌──────────────────┐
│ Logo             │
├──────────────────┤
│ 🛡️ Emergenza    │ ← Journey switcher
│ 🌱 Lungo termine │
│ ⚡ Speculazione  │
│ ♻️ Passivo      │
├──────────────────┤
│ Sezioni locali   │ ← Cambiano per journey
│ ...              │
├──────────────────┤
│ ⚙️ Settings     │
│ 👤 Profilo      │
│ 🚪 Logout       │
└──────────────────┘
```

Larghezza: 280px expanded, 64px collapsed

### Header Desktop
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Search/Command    [Notifiche] [Tema] [Profilo]  │
└─────────────────────────────────────────────────────┘
```

---

## 4. Layout Contenuto

### Griglia
- Desktop: 12 colonne, max-width 1440px
- Tablet: 8 colonne
- Mobile: 1 colonna (stack verticale)

### Spacing System (8px base)
| Token | Value | Uso |
|-------|-------|-----|
| `space-1` | 4px | Micro gaps |
| `space-2` | 8px | Inline elements |
| `space-3` | 12px | Card padding |
| `space-4` | 16px | Section gaps |
| `space-6` | 24px | Card gaps |
| `space-8` | 32px | Section separators |

---

## 5. KPI per Journey

### 🛡️ Emergenza
| KPI | Formato | Colore stato |
|-----|---------|--------------|
| Liquidità disponibile | €XX.XXX | success/warning/error |
| Tempo di prelievo | Xh / Xd | success/warning |
| Copertura mesi | X mesi | success/warning/error |

### 🌱 Lungo termine
| KPI | Formato | Colore stato |
|-----|---------|--------------|
| Valore totale | €XX.XXX | neutral |
| Performance YTD | +X.X% | success/error |
| Prossimo DCA | in X giorni | neutral |

### ⚡ Speculazione
| KPI | Formato | Colore stato |
|-----|---------|--------------|
| P&L giornaliero | +/-€XXX | success/error |
| Posizioni aperte | X | neutral |
| Win rate | XX% | success/warning/error |

### ♻️ Passivo
| KPI | Formato | Colore stato |
|-----|---------|--------------|
| Rendimento mensile | €XXX | success |
| APY medio | X.X% | neutral |
| Prossimo payout | in X giorni | neutral |

---

## 6. Card Structure

```
┌─────────────────────────────────────┐
│ [Icon] Title                   [⋮] │  ← Header
│ Subtitle / timeframe               │
├─────────────────────────────────────┤
│                                     │
│ Main content                        │  ← Body
│ (chart, table, value)               │
│                                     │
├─────────────────────────────────────┤
│ [Secondary]              [Primary]  │  ← Footer (optional)
└─────────────────────────────────────┘
```

Regole:
- Padding: 24px desktop, 16px mobile
- Border radius: 12px
- Border: 1px border-border/50
- Hover: solo se cliccabile

---

## 7. Stati Obbligatori

Ogni componente DEVE avere:

| Stato | Soluzione |
|-------|-----------|
| Loading | Skeleton che matcha layout finale |
| Empty | Messaggio + CTA |
| Error | Messaggio umano + Retry |
| Partial | Indicatore "dati parziali" |

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Bottom nav + drawer |
| Tablet | 768-1023px | Collapsed sidebar |
| Desktop | ≥ 1024px | Full sidebar |

---

## 9. Animazioni

| Elemento | Durata | Easing |
|----------|--------|--------|
| Sidebar open | 200ms | ease-out |
| Sidebar close | 150ms | ease-in |
| Card hover | 150ms | ease |
| Tab switch | 0ms | instant |
| Page transition | 200ms | ease-out |

`prefers-reduced-motion`: disabilita tutte le animazioni.

---

## 10. Checklist Pre-Release

- [ ] Bottom nav 4 tab (mobile)
- [ ] Drawer sezioni per journey
- [ ] Sidebar journey switcher (desktop)
- [ ] KPI con stato colore
- [ ] Card structure consistente
- [ ] Stati loading/empty/error
- [ ] Griglia 12 colonne
- [ ] Spacing 8px system
- [ ] Animazioni < 200ms
- [ ] prefers-reduced-motion
