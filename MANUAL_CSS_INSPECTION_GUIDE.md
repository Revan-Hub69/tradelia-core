# 🔍 GUIDA MANUALE ISPEZIONE CSS - HEADER & MENU

## 🎯 OBIETTIVO

Capire **esattamente** quali CSS vengono applicati agli elementi di menu e header per identificare le cause delle sovrapposizioni.

## 🛠️ STRUMENTI DISPONIBILI

### **1. CSS Inspector Tool**
```bash
# Apri il tool di ispezione
start css-inspector-header-menu.html
```

### **2. Live Inspector Bookmarklet**
1. Copia il contenuto di `css-live-inspector.js`
2. Crea un bookmarklet nel browser
3. Usalo sulla dashboard per ispezione in tempo reale

### **3. DevTools Manual Inspection**
- F12 → Elements → Computed styles
- F12 → Elements → Styles (per vedere le regole applicate)

## 📋 CHECKLIST ISPEZIONE MANUALE

### **STEP 1: IDENTIFICA GLI ELEMENTI HEADER**

Sulla dashboard (`http://localhost:3000/dashboard`), identifica:

```
✅ Header principale (DashboardHeader)
✅ Bottoni header (tema, notifiche, user dropdown)  
✅ Logo/brand area
✅ Navigation items
```

**Per ogni elemento, annota**:
- Tag HTML (`<header>`, `<button>`, `<div>`)
- Classi CSS applicate
- Z-index calcolato
- Position (static, relative, fixed, absolute)
- Transform applicati

### **STEP 2: IDENTIFICA GLI ELEMENTI MENU/DROPDOWN**

Apri i dropdown e identifica:

```
✅ Dropdown user (angolo alto destro)
✅ Dropdown tema/lingua
✅ Menu contestuali
✅ Tooltip
```

**Per ogni menu, annota**:
- Contenitore del menu
- Z-index del contenitore
- Position del contenitore  
- Backdrop/overlay se presente
- Portal container (per Radix UI)

### **STEP 3: ANALISI CSS DETTAGLIATA**

Per ogni elemento problematico:

#### **A. CSS COMPUTATO**
```
- z-index: [valore]
- position: [static|relative|absolute|fixed]
- transform: [valore]
- opacity: [valore]
- visibility: [visible|hidden]
- display: [valore]
```

#### **B. REGOLE CSS APPLICATE**
```
- Da quale file CSS viene la regola?
- Quale selettore ha la precedenza?
- Ci sono !important che sovrascrivono?
- Ci sono utility Tailwind in conflitto?
```

#### **C. STACKING CONTEXT**
```
- L'elemento crea un nuovo stacking context?
- Qual è il parent stacking context?
- Ci sono transform/opacity che creano context?
```

## 🔧 PROCEDURA STEP-BY-STEP

### **1. SETUP INIZIALE**

```bash
# Avvia il server
npm run dev

# Apri il CSS inspector in una finestra separata
start css-inspector-header-menu.html
```

### **2. ISPEZIONE HEADER**

1. **Vai su** `http://localhost:3000/dashboard`
2. **Nel CSS inspector**, clicca "🎯 Inspect Header"
3. **Annota i risultati**:
   ```
   Header Element 1:
   - Selector: [quale]
   - Z-index: [valore]
   - Position: [valore]
   - Classes: [lista completa]
   ```

### **3. ISPEZIONE MENU**

1. **Apri un dropdown** (es. user dropdown)
2. **Nel CSS inspector**, clicca "📋 Inspect Menus"
3. **Annota**:
   ```
   Menu Element 1:
   - Selector: [quale]
   - Z-index: [valore]
   - Visibility: [valore]
   - Data attributes: [Radix UI attributes]
   ```

### **4. ISPEZIONE TOOLTIP**

1. **Hover su un bottone** header per mostrare tooltip
2. **Nel CSS inspector**, clicca "💬 Inspect Tooltips"
3. **Annota**:
   ```
   Tooltip Element 1:
   - Z-index: [valore]
   - Position: [valore]
   - Pointer-events: [valore]
   ```

### **5. ANALISI CONFLITTI**

Confronta i z-index trovati:

```
GERARCHIA ATTUALE:
- Header: z-index [valore trovato]
- Dropdown: z-index [valore trovato]  
- Tooltip: z-index [valore trovato]

GERARCHIA ATTESA:
- Header: 40 (layer-header)
- Dropdown: 60 (layer-popover)
- Tooltip: 80 (layer-toast)
```

## 🐛 COSA CERCARE

### **PROBLEMI COMUNI**

1. **Z-index hardcodato**:
   ```css
   /* PROBLEMA */
   .elemento { z-index: 9999; }
   .elemento { z-index: 100; }
   
   /* CORRETTO */
   .elemento { z-index: var(--z-popover); }
   ```

2. **Stacking context non previsto**:
   ```css
   /* Questi creano stacking context */
   transform: translateX(0);
   opacity: 0.99;
   filter: blur(0);
   ```

3. **Utility Tailwind in conflitto**:
   ```html
   <!-- PROBLEMA: z-50 hardcodato -->
   <div class="z-50 layer-popover">
   
   <!-- CORRETTO: solo design token -->
   <div class="layer-popover">
   ```

4. **CSS !important**:
   ```css
   /* PROBLEMA */
   .utility { z-index: 50 !important; }
   ```

## 📊 TEMPLATE REPORT

Usa questo template per documentare i risultati:

```markdown
# CSS INSPECTION REPORT

## HEADER ELEMENTS
- **Element 1**: [tag] - z-index: [valore] - classes: [lista]
- **Element 2**: [tag] - z-index: [valore] - classes: [lista]

## MENU ELEMENTS  
- **Menu 1**: [tag] - z-index: [valore] - visibility: [valore]
- **Menu 2**: [tag] - z-index: [valore] - visibility: [valore]

## TOOLTIP ELEMENTS
- **Tooltip 1**: [tag] - z-index: [valore] - pointer-events: [valore]

## PROBLEMI IDENTIFICATI
1. [Descrizione problema 1]
2. [Descrizione problema 2]

## SOLUZIONI PROPOSTE
1. [Soluzione 1]
2. [Soluzione 2]
```

## 🎯 RISULTATO ATTESO

Dopo l'ispezione manuale, dovresti avere:

1. **Lista completa** di tutti gli elementi header/menu
2. **Z-index effettivi** di ogni elemento
3. **Regole CSS** che causano i conflitti
4. **Piano d'azione** specifico per ogni problema

Questo approccio manuale ci darà la **visibilità completa** su cosa sta succedendo nel CSS, invece di fare fix "al buio". 🎯