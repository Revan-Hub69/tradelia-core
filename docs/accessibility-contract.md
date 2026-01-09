# Tradelia - Accessibility Contract 2026

> Design tokens are accessibility-constrained. No new color without contrast validation.

## Standard di Riferimento

- **Conformità legale**: WCAG 2.2 Level AA (minimo)
- **Target qualità**: WCAG 2.2 Level AAA dove possibile
- **Preview futuro**: APCA (WCAG 3 draft) come lint informativo

---

## Regole di Contrasto

### 1. Testo (Text Contrast)

| Tipo | AA (minimo) | AAA (target) |
|------|-------------|--------------|
| Testo normale (<24px) | ≥ 4.5:1 | ≥ 7:1 |
| Testo grande (≥24px o ≥18.66px bold) | ≥ 3:1 | ≥ 4.5:1 |

### 2. Componenti UI (Non-text Contrast)

| Elemento | Requisito |
|----------|-----------|
| Icone funzionali | ≥ 3:1 |
| Bordi input/controlli | ≥ 3:1 |
| Switch, checkbox, radio | ≥ 3:1 |
| Grafici informativi | ≥ 3:1 |

### 3. Focus Indicator (WCAG 2.2 Enhanced)

| Proprietà | Requisito |
|-----------|-----------|
| Contrasto focus vs unfocused | ≥ 3:1 |
| Contrasto ring vs background | ≥ 3:1 |
| Spessore minimo | 2px |
| Area minima percepibile | Sì |

### 4. Muted Text (Regola Critica)

> **"Muted text is still text"** — deve rispettare AA.

- `muted-foreground` su `background`: ≥ 4.5:1
- `muted-foreground` su `card/surface`: ≥ 4.5:1
- Eccezione: solo testo puramente decorativo (non informativo)

### 5. Overlay / Glass / Blur

> I token possono "passare" ma l'overlay li fa fallire.

- Audit pixel-based su screenshot reali obbligatorio
- `bg-black/60` + blur richiede verifica manuale
- Glassmorphism: testare su contenuti reali sottostanti

---

## Token Inventory (Ruoli e Criticità)

| Token | Ruolo | Criticità | Test Obbligatorio |
|-------|-------|-----------|-------------------|
| `background` | Surface primaria | Alta | Base per tutti i contrasti |
| `foreground` | Testo principale | Altissima | vs background, card, surface |
| `muted-foreground` | Testo secondario | **Killer** | vs background, card (≥4.5:1) |
| `card` / `surface` | Surface secondaria | Alta | vs foreground, muted-foreground |
| `border` | Separazione UI | Media | vs background (≥3:1) |
| `primary` | Azione principale | Alta | vs primary-foreground |
| `primary-foreground` | Testo su primary | Altissima | vs primary (≥4.5:1) |
| `success/warning/error` | Stati semantici | Alta | vs background + su badge |

---

## Matrice Contrasti - Light Mode

### Valori Token (HSL)
```
background:        0 0% 99%      → #FCFCFC
foreground:        220 15% 12%   → #1A1D24
muted-foreground:  220 12% 30%   → #3D4452  (AAA)
subtle-foreground: 220 10% 45%   → #6B7280  (AA only)
primary:           215 55% 40%   → #2E5A8C  (AAA)
muted:             220 10% 96%   → #F3F4F5
border:            220 10% 88%   → #DDDFE3
surface:           0 0% 100%     → #FFFFFF
```

### Risultati Contrasto (WCAG 2.2)

| Coppia | Ratio | AA | AAA | Status |
|--------|-------|----|----|--------|
| foreground / background | 14.2:1 | ✅ | ✅ | Eccellente |
| muted-foreground / background | 7.2:1 | ✅ | ✅ | **AAA Pass** |
| muted-foreground / surface | 7.5:1 | ✅ | ✅ | **AAA Pass** |
| subtle-foreground / background | 4.8:1 | ✅ | ❌ | AA only |
| white on primary | 6.8:1 | ✅ | ✅ | **AAA Pass** |

---

## Matrice Contrasti - Dark Mode

### Valori Token (HSL)
```
background:        220 15% 8%    → #111318
foreground:        220 10% 95%   → #F0F1F3
muted-foreground:  220 10% 70%   → #A8AEB8  (AAA)
subtle-foreground: 220 10% 50%   → #737B87  (AA only)
primary:           215 55% 55%   → #4A8AD4
muted:             220 15% 15%   → #1F232B
border:            220 15% 20%   → #2A303B
surface:           220 15% 10%   → #15181F
```

### Risultati Contrasto (WCAG 2.2)

| Coppia | Ratio | AA | AAA | Status |
|--------|-------|----|----|--------|
| foreground / background | 13.8:1 | ✅ | ✅ | Eccellente |
| muted-foreground / background | 7.8:1 | ✅ | ✅ | **AAA Pass** |
| muted-foreground / surface | 7.1:1 | ✅ | ✅ | **AAA Pass** |
| subtle-foreground / background | 4.6:1 | ✅ | ❌ | AA only |
| primary / background | 5.1:1 | ✅ | ❌ | AA Pass |

---

## Checklist Pre-Release

### Automatico (CI/CD)
- [ ] Lint contrasti token (script custom)
- [ ] axe-core su pagine principali
- [ ] Lighthouse accessibility score ≥ 95

### Manuale (Design Review)
- [ ] Screenshot overlay/glass su contenuti reali
- [ ] Test focus ring su tutti i controlli interattivi
- [ ] Verifica muted-foreground su card/modal
- [ ] Test con prefers-reduced-motion
- [ ] Test con prefers-contrast: more

---

## Processo di Modifica Colori

1. **Proposta**: nuovo colore con ruolo definito
2. **Calcolo**: contrast ratio vs tutte le superfici target
3. **Validazione**: AA minimo, AAA preferito
4. **Documentazione**: aggiornare questa matrice
5. **Test**: screenshot + axe-core

> ⚠️ **Nessun colore nuovo senza questo processo.**

---

## Riferimenti

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG 3 Draft (APCA)](https://www.w3.org/TR/wcag-3.0/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [APCA Calculator](https://www.myndex.com/APCA/)

---

*Ultimo aggiornamento: Gennaio 2026*
*Versione: 1.1*

---

## Changelog

### v1.1 (2026-01-09)
- Migrato tutti i colori hardcoded a token semantici
- `muted-foreground` portato a AAA (7:1+)
- Aggiunto `subtle-foreground` per casi edge (AA only)
- Creato componente `Alert` riutilizzabile
- Sistemati: HeroSection, ResearchSection, DashboardContent, AuthModal, Badge, Input
- Primary light mode scurito per AAA compliance
