# HEADER COLOR VERIFICATION GUIDE 2026

**Data**: 24 Gennaio 2026  
**Scopo**: Verificare che i colori dell'header in produzione corrispondano ai valori CSS impostati

---

## QUICK START

### Metodo 1: Script Automatico (Consigliato)

1. **Apri la dashboard in produzione**: https://tradelia-core.vercel.app/dashboard
2. **Apri DevTools Console**: Premi `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. **Copia lo script**: Apri `scripts/capture-header-colors.js`
4. **Incolla nella console** e premi Invio
5. **Leggi il report** generato automaticamente

Lo script catturerà:
- ✅ Colori background header (RGB, HEX, HSL)
- ✅ Colori border e shadow
- ✅ Colori icone
- ✅ Colori dropdown (se aperti)
- ✅ Variabili CSS computed
- ✅ Contrast ratio (WCAG)
- ✅ Export JSON completo

### Metodo 2: Manuale (DevTools)

1. **Apri DevTools** (F12)
2. **Seleziona l'header**: Click destro sull'header → "Inspect"
3. **Vai al tab "Computed"**
4. **Cerca questi valori**:
   - `background-color`
   - `border-color`
   - `box-shadow`
   - `backdrop-filter`

---

## VALORI ATTESI

### Light Mode ☀️

#### Header Background
```css
/* Variabile CSS */
--glass-material-bg: rgba(252, 251, 248, 0.95);

/* Valori attesi */
RGB: rgba(252, 251, 248, 0.95)
HEX: #FCFBF8 (con 95% opacity)
HSL: hsl(40, 33%, 98%)
```

#### Header Border
```css
--glass-material-border: rgba(0, 0, 0, 0.06);

/* Valori attesi */
RGB: rgba(0, 0, 0, 0.06)
HEX: #000000 (con 6% opacity)
```

#### Header Icons
```css
/* Colore icone */
color: #334155; /* Slate 700 - Dark gray */

/* Hover */
background: rgba(51, 65, 85, 0.1); /* Slate 700 con 10% opacity */
```

#### Contrast Ratio
- **Minimo WCAG AA**: 4.5:1
- **Atteso**: 11.8:1 (AAA) ✅

---

### Dark Mode 🌙

#### Header Background (NUOVO - Layer 3)
```css
/* Variabile CSS */
--glass-material-bg: rgba(42, 47, 62, 0.95);

/* Valori attesi */
RGB: rgba(42, 47, 62, 0.95)
HEX: #2A2F3E (con 95% opacity)
HSL: hsl(218, 35%, 22%)
```

**IMPORTANTE**: Questo è il NUOVO valore (Layer 3 - Header/Navbar)
- **Prima era**: `rgba(28, 28, 30, 0.95)` (#1C1C1E - troppo scuro)
- **Ora è**: `rgba(42, 47, 62, 0.95)` (#2A2F3E - chiaramente elevato)

#### Header Border
```css
--glass-material-border: rgba(255, 255, 255, 0.1);

/* Valori attesi */
RGB: rgba(255, 255, 255, 0.1)
HEX: #FFFFFF (con 10% opacity)
```

#### Header Icons
```css
/* Colore icone */
color: #E2E8F0; /* Slate 200 - Light gray */

/* Hover */
background: rgba(226, 232, 240, 0.1); /* Slate 200 con 10% opacity */
```

#### Contrast Ratio
- **Minimo WCAG AA**: 4.5:1
- **Atteso**: 8.5:1 (AAA) ✅

---

## GERARCHIA LAYER DARK MODE

Verifica che i layer siano DISTINTI (non tutti neri):

```css
/* Layer 1: Background (più profondo) */
--background: hsl(222, 47%, 11%);  /* #171B26 */

/* Layer 2: Cards (elevato) */
--card: hsl(220, 40%, 17%);  /* #1E2330 */

/* Layer 3: Header/Navbar (chiaramente elevato) */
--glass-material-bg: rgba(42, 47, 62, 0.95);  /* #2A2F3E */

/* Layer 4: Dropdowns (massima elevazione) */
--popover: hsl(216, 30%, 26%);  /* #343A4D */
```

**Test Visivo**: Ogni layer dovrebbe essere visibilmente più chiaro del precedente.

---

## CHECKLIST VERIFICA

### ✅ Light Mode

- [ ] Header background è Soft Cream (#FCFBF8)
- [ ] Icone sono Dark Gray (#334155)
- [ ] Border è sottile e scuro (rgba(0,0,0,0.06))
- [ ] Backdrop filter è attivo (blur 20px)
- [ ] Contrast ratio ≥ 11:1 (AAA)
- [ ] Hover states funzionano (background rgba(51,65,85,0.1))

### ✅ Dark Mode

- [ ] Header background è #2A2F3E (NON #1C1C1E)
- [ ] Header è VISIBILMENTE più chiaro del background (#171B26)
- [ ] Header è VISIBILMENTE più scuro dei dropdown (#343A4D)
- [ ] Icone sono Light Gray (#E2E8F0)
- [ ] Border è sottile e chiaro (rgba(255,255,255,0.1))
- [ ] Backdrop filter è attivo (blur 20px)
- [ ] Contrast ratio ≥ 8:1 (AAA)
- [ ] Hover states funzionano (background rgba(226,232,240,0.1))

---

## TROUBLESHOOTING

### Problema: Header è tutto nero in dark mode

**Causa**: Variabile `--glass-material-bg` non aggiornata

**Soluzione**:
1. Verifica che `src/styles/shared/tokens.css` contenga:
   ```css
   .dark {
     --glass-material-bg: rgba(42, 47, 62, 0.95);
   }
   ```
2. Verifica che `header-premium-2026.css` usi la variabile:
   ```css
   .header-2026 {
     background-color: var(--glass-material-bg);
   }
   ```
3. Fai hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

---

### Problema: Colori non corrispondono

**Possibili cause**:
1. **Cache del browser**: Fai hard refresh
2. **Build non aggiornata**: Vercel potrebbe avere una build vecchia
3. **Stili inline**: Cerca `style="..."` nell'HTML dell'header
4. **CSS duplicati**: Verifica che non ci siano classi duplicate

**Debug**:
```javascript
// Console DevTools
const header = document.querySelector('header');
const styles = window.getComputedStyle(header);
console.log('Background:', styles.backgroundColor);
console.log('Backdrop:', styles.backdropFilter);
```

---

### Problema: Variabili CSS non definite

**Causa**: `tokens.css` non importato o importato dopo altri CSS

**Soluzione**:
1. Verifica che `dashboard.css` importi tokens PRIMA di tutto:
   ```css
   @import './shared/tokens.css'; /* DEVE essere PRIMO */
   @import './header-premium-2026.css';
   ```
2. Verifica che `layout.tsx` importi `dashboard.css`

---

## COME LEGGERE IL REPORT DELLO SCRIPT

### Sezione 1: Header Background
```
Background Color (RGB): rgba(42, 47, 62, 0.95)
Background Color (HEX): #2A2F3E
Background Color (HSL): hsl(218, 35%, 22%)
```
✅ **Verifica**: HEX deve essere `#2A2F3E` in dark mode, `#FCFBF8` in light mode

### Sezione 2: Borders & Shadows
```
Border Color (HEX): #FFFFFF (con opacity)
Box Shadow: 0 20px 40px rgba(0, 0, 0, 0.3), ...
```
✅ **Verifica**: Border deve essere visibile ma sottile

### Sezione 3: Header Icons
```
Icon 1 (header-icon):
  Background: #00000000 (transparent)
  Color: #E2E8F0
```
✅ **Verifica**: Color deve essere `#E2E8F0` (dark) o `#334155` (light)

### Sezione 4: CSS Variables
```
--glass-material-bg: rgba(42, 47, 62, 0.95)
--background: 222 47% 11%
--card: 220 40% 17%
--popover: 216 30% 26%
```
✅ **Verifica**: Ogni valore deve essere progressivamente più chiaro

### Sezione 5: Contrast Analysis
```
Contrast Ratio: 8.52:1
✅ WCAG AAA (7:1) - Excellent!
```
✅ **Verifica**: Deve essere ≥ 4.5:1 (AA) o meglio ≥ 7:1 (AAA)

---

## EXPORT RISULTATI

Lo script genera un JSON che puoi salvare:

```json
{
  "theme": "dark",
  "timestamp": "2026-01-24T...",
  "header": {
    "backgroundColor": {
      "rgb": "rgba(42, 47, 62, 0.95)",
      "hex": "#2A2F3E",
      "hsl": "hsl(218, 35%, 22%)"
    },
    ...
  },
  "contrast": {
    "ratio": "8.52",
    "wcagAA": true,
    "wcagAAA": true
  }
}
```

**Salva questo JSON** per confrontare light mode vs dark mode.

---

## CONFRONTO PRIMA/DOPO

### Dark Mode Header Background

| Aspetto | Prima (❌) | Dopo (✅) |
|---------|-----------|----------|
| **HEX** | #1C1C1E | #2A2F3E |
| **RGB** | rgba(28, 28, 30, 0.95) | rgba(42, 47, 62, 0.95) |
| **HSL** | hsl(240, 4%, 11%) | hsl(218, 35%, 22%) |
| **Lightness** | 11% | 22% |
| **Saturation** | 4% (quasi grigio) | 35% (blu visibile) |
| **Visibilità** | Indistinguibile dal background | Chiaramente elevato |

### Gerarchia Visiva

| Layer | Prima (❌) | Dopo (✅) |
|-------|-----------|----------|
| Background | #171B26 (11%) | #171B26 (11%) ✅ |
| Cards | #1C1C1E (11%) | #1E2330 (17%) ✅ |
| Header | #1C1C1E (11%) | #2A2F3E (22%) ✅ |
| Dropdowns | #1C1C1E (11%) | #343A4D (26%) ✅ |

**Problema Prima**: Tutti i layer erano ~11% lightness (indistinguibili)  
**Soluzione Dopo**: Layer progressivi 11% → 17% → 22% → 26% (chiari e distinti)

---

## NEXT STEPS

1. **Esegui lo script** in light mode
2. **Salva il JSON** risultante
3. **Cambia a dark mode** (toggle tema)
4. **Esegui lo script** di nuovo
5. **Confronta i due JSON**
6. **Verifica** che i valori corrispondano a quelli attesi sopra

Se i valori NON corrispondono:
- Controlla la sezione Troubleshooting
- Verifica che il commit `65f05d8` sia deployato su Vercel
- Fai hard refresh del browser
- Controlla che non ci siano stili inline

---

## RIFERIMENTI

- **Commit**: `65f05d8` - Implementazione layer separation
- **Research**: `docs/research/DROPDOWN_DIMENSIONS_DARK_MODE_TIER1_2026.md`
- **CSS Files**:
  - `src/styles/shared/tokens.css` - Variabili colori
  - `src/styles/header-premium-2026.css` - Stili header
  - `src/styles/dashboard.css` - Import order

---

**Buona verifica! 🎨**
