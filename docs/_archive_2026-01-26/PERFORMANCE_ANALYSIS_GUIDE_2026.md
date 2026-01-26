# GUIDA ANALISI PERFORMANCE DASHBOARD - 2026

**Data**: 24 Gennaio 2026  
**Problema**: Dashboard percepita come lenta  
**Obiettivo**: Identificare e risolvere i colli di bottiglia

---

## 🎯 QUICK START - Analisi Immediata

### Step 1: Chrome DevTools Performance (5 minuti)

1. **Apri la Dashboard** in Chrome
2. **Apri DevTools** (F12)
3. **Vai su Performance tab**
4. **Clicca Record** (cerchio rosso)
5. **Ricarica la pagina** (Ctrl+R)
6. **Aspetta 3-5 secondi**
7. **Stop recording**

**Cosa cercare**:
- 🔴 **Long Tasks** (barre gialle >50ms) - JavaScript che blocca
- 🔴 **Layout Shifts** (barre viola) - Elementi che si spostano
- 🔴 **Paint** (barre verdi) - Rendering lento
- 🔴 **Network** (waterfall) - Risorse che impiegano troppo tempo

---

## 📊 METODO 1: Chrome DevTools (Dettagliato)

### A. Performance Tab

```bash
# Procedura completa
1. Apri http://localhost:3000/dashboard
2. F12 → Performance tab
3. ⚙️ Settings:
   - ✅ Screenshots
   - ✅ Web Vitals
   - ✅ Memory
   - CPU: 4x slowdown (simula device lento)
4. 🔴 Record
5. Ctrl+R (reload)
6. Aspetta caricamento completo
7. ⏹️ Stop
```

**Analisi Report**:

#### 1. Main Thread (Thread Principale)
```
Cerca blocchi lunghi (>50ms):
- Scripting (giallo) → JavaScript lento
- Rendering (viola) → Layout/Paint costosi
- Painting (verde) → Disegno elementi lento
```

**Esempio problemi comuni**:
```
❌ Evaluate Script: 800ms → Bundle JS troppo grande
❌ Recalculate Style: 200ms → CSS troppo complesso
❌ Layout: 150ms → Troppi reflow
❌ Paint: 100ms → Elementi complessi da disegnare
```

#### 2. Network Waterfall
```
Cerca:
- 🔴 Risorse >1MB
- 🔴 Richieste >500ms
- 🔴 Blocking resources (rosso)
```

#### 3. Web Vitals
```
Target:
✅ LCP (Largest Contentful Paint): <2.5s
✅ FID (First Input Delay): <100ms
✅ CLS (Cumulative Layout Shift): <0.1
```

### B. Lighthouse Audit

```bash
# In DevTools
1. Lighthouse tab
2. Mode: Navigation
3. Device: Desktop/Mobile
4. Categories: Performance
5. ▶️ Analyze page load
```

**Metriche Chiave**:
```
Performance Score: Target >90

Metrics:
- First Contentful Paint: <1.8s
- Speed Index: <3.4s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.8s
- Total Blocking Time: <200ms
- Cumulative Layout Shift: <0.1
```

**Opportunities** (cosa ottimizzare):
- Eliminate render-blocking resources
- Reduce unused JavaScript
- Properly size images
- Minify CSS/JS
- Enable text compression

### C. Coverage Tab

```bash
# Trova codice non usato
1. DevTools → More tools → Coverage
2. 🔴 Start instrumenting
3. Ricarica pagina
4. Interagisci con dashboard
5. ⏹️ Stop

Risultato:
- Rosso = Codice NON usato (da rimuovere)
- Verde = Codice usato
```

**Target**: <30% codice non usato

### D. Memory Tab

```bash
# Trova memory leaks
1. DevTools → Memory tab
2. Heap snapshot
3. Take snapshot (prima)
4. Usa dashboard per 30 secondi
5. Take snapshot (dopo)
6. Confronta

Cerca:
- Detached DOM nodes (memory leak)
- Large arrays/objects
- Event listeners non rimossi
```

---

## 📊 METODO 2: React DevTools Profiler

### Installazione
```bash
# Chrome Extension
https://chrome.google.com/webstore/detail/react-developer-tools
```

### Utilizzo

```bash
1. Apri dashboard
2. F12 → Profiler tab (React DevTools)
3. ⚙️ Settings:
   - ✅ Record why each component rendered
   - ✅ Hide commits below 1ms
4. 🔴 Start profiling
5. Interagisci con dashboard
6. ⏹️ Stop profiling
```

**Analisi**:

#### Flame Graph
```
Mostra:
- Componenti lenti (barre larghe)
- Render inutili (componenti che si re-renderizzano senza motivo)
- Cascate di render (parent → child → child)
```

#### Ranked Chart
```
Ordina componenti per tempo di render:
1. DashboardHeader: 45ms ❌ LENTO
2. SidebarNavigation: 38ms ❌ LENTO
3. UserDropdown: 12ms ✅ OK
```

#### Component Details
```
Clicca su componente lento:
- Why did this render? → Props changed, State changed, Parent rendered
- Render duration: 45ms
- Self time: 12ms (tempo proprio)
- Child time: 33ms (tempo figli)
```

---

## 📊 METODO 3: Network Analysis

### Chrome DevTools Network Tab

```bash
1. F12 → Network tab
2. ⚙️ Disable cache
3. 🔄 Reload page
4. Ordina per Size (decrescente)
```

**Cosa cercare**:

#### JavaScript Bundles
```
❌ main.js: 2.5MB → TROPPO GRANDE
✅ main.js: 200KB → OK

Soluzioni:
- Code splitting
- Dynamic imports
- Tree shaking
```

#### CSS Files
```
❌ styles.css: 500KB → TROPPO GRANDE
✅ styles.css: 50KB → OK

Soluzioni:
- PurgeCSS
- Critical CSS inline
- Remove unused styles
```

#### Images
```
❌ hero.png: 5MB → TROPPO GRANDE
✅ hero.webp: 50KB → OK

Soluzioni:
- WebP format
- Lazy loading
- Responsive images
```

#### Fonts
```
❌ font.woff2: 500KB → TROPPO GRANDE
✅ font.woff2: 50KB → OK

Soluzioni:
- Subset fonts
- Preload critical fonts
- Font display: swap
```

---

## 🔍 METODO 4: Analisi Specifica Dashboard

### A. Verifica Componenti Pesanti

```bash
# Cerca import pesanti
cd tradelia
npm run build

# Output mostra bundle sizes:
Route (app)                              Size     First Load JS
┌ ○ /                                    5.04 kB        161 kB
├ ○ /[locale]/dashboard                  4.5 kB         165 kB  ← VERIFICA
```

### B. Analizza Bundle con Analyzer

```bash
# Installa analyzer
npm install --save-dev @next/bundle-analyzer

# Aggiungi a next.config.mjs (già presente)
# Esegui build con analisi
npm run build-stats

# Apre browser con visualizzazione bundle
```

**Cosa cercare**:
- 🔴 Librerie duplicate
- 🔴 Librerie pesanti non necessarie
- 🔴 Codice non tree-shaken

### C. Verifica Rendering

```tsx
// Aggiungi temporaneamente in DashboardHeader.tsx
useEffect(() => {
  console.log('🔄 DashboardHeader rendered');
  console.time('DashboardHeader mount');
  return () => {
    console.timeEnd('DashboardHeader mount');
  };
}, []);

// Verifica console:
// ❌ Se vedi molti "🔄 DashboardHeader rendered" → Troppi re-render
// ❌ Se "DashboardHeader mount" > 100ms → Componente lento
```

---

## 🎯 CHECKLIST PROBLEMI COMUNI DASHBOARD

### 1. JavaScript Troppo Pesante
```bash
# Verifica
npm run build

# Cerca:
❌ First Load JS > 200KB
❌ Route size > 50KB

# Soluzioni:
✅ Dynamic imports
✅ Code splitting
✅ Remove unused dependencies
```

### 2. CSS Troppo Pesante
```bash
# Verifica dimensione CSS
ls -lh .next/static/css/*.css

# Cerca:
❌ File CSS > 100KB

# Soluzioni:
✅ PurgeCSS (già configurato con Tailwind)
✅ Critical CSS inline
✅ Remove unused styles
```

### 3. Troppi Re-Render
```bash
# Usa React DevTools Profiler
# Cerca componenti che si re-renderizzano spesso

# Soluzioni:
✅ React.memo()
✅ useMemo()
✅ useCallback()
✅ Ottimizza context providers
```

### 4. Immagini Non Ottimizzate
```bash
# Verifica
Network tab → Filter: Img

# Cerca:
❌ Immagini > 500KB
❌ Formato PNG/JPG invece di WebP

# Soluzioni:
✅ Next.js Image component
✅ WebP format
✅ Lazy loading
```

### 5. Fonts Bloccanti
```bash
# Verifica
Network tab → Filter: Font

# Cerca:
❌ Font caricati in modo sincrono
❌ Font > 100KB

# Soluzioni:
✅ font-display: swap
✅ Preload critical fonts
✅ Subset fonts
```

---

## 🚀 QUICK FIXES (Applicabili Subito)

### Fix 1: Lazy Load Sidebar
```tsx
// src/components/dashboard/DashboardClient.tsx
import dynamic from 'next/dynamic';

const SidebarNavigation = dynamic(
  () => import('@/components/navigation/SidebarNavigation'),
  { ssr: false, loading: () => <SidebarSkeleton /> }
);
```

### Fix 2: Optimize Images
```tsx
// Usa Next.js Image invece di <img>
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Logo"
  priority // Solo per above-the-fold images
/>
```

### Fix 3: Reduce Bundle Size
```bash
# Rimuovi dipendenze non usate
npm uninstall <package-name>

# Verifica dipendenze duplicate
npm dedupe
```

### Fix 4: Enable Compression
```javascript
// next.config.mjs (già presente)
compress: true, // Gzip compression
```

### Fix 5: Optimize CSS
```bash
# Tailwind già configurato con purge
# Verifica che funzioni:
npm run build
# CSS dovrebbe essere < 50KB
```

---

## 📊 STRUMENTI ONLINE

### 1. WebPageTest
```
https://www.webpagetest.org/

1. Inserisci URL: http://localhost:3000/dashboard
2. Location: Closest to you
3. Browser: Chrome
4. Connection: Cable
5. Run Test

Risultati:
- Filmstrip view (caricamento visivo)
- Waterfall chart (risorse)
- Performance metrics
- Opportunities
```

### 2. PageSpeed Insights
```
https://pagespeed.web.dev/

1. Inserisci URL (solo production)
2. Analyze

Risultati:
- Performance score
- Core Web Vitals
- Opportunities
- Diagnostics
```

### 3. Lighthouse CI (Locale)
```bash
# Già configurato nel progetto
npm run lighthouse:local

# Output:
- Performance score
- Accessibility score
- Best practices score
- SEO score
```

---

## 🎯 PIANO D'AZIONE

### Fase 1: Diagnosi (15 minuti)
1. ✅ Chrome DevTools Performance recording
2. ✅ Lighthouse audit
3. ✅ React DevTools Profiler
4. ✅ Network tab analysis

### Fase 2: Identificazione (10 minuti)
Identifica i 3 problemi principali:
1. ___________________________
2. ___________________________
3. ___________________________

### Fase 3: Prioritizzazione
```
High Impact + Low Effort → Fix subito
High Impact + High Effort → Pianifica
Low Impact + Low Effort → Nice to have
Low Impact + High Effort → Ignora
```

### Fase 4: Implementazione
Applica fix in ordine di priorità

### Fase 5: Verifica
Ri-esegui analisi per confermare miglioramenti

---

## 📈 METRICHE TARGET

### Performance Scores
```
✅ Lighthouse Performance: >90
✅ First Contentful Paint: <1.8s
✅ Largest Contentful Paint: <2.5s
✅ Time to Interactive: <3.8s
✅ Total Blocking Time: <200ms
✅ Cumulative Layout Shift: <0.1
```

### Bundle Sizes
```
✅ First Load JS: <200KB
✅ Route JS: <50KB
✅ CSS: <50KB
✅ Total Page Weight: <500KB
```

### Runtime Performance
```
✅ Component render: <16ms (60fps)
✅ Re-renders: <5 per interaction
✅ Memory usage: <50MB
✅ No memory leaks
```

---

## 🔗 RISORSE

### Documentazione
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## ✅ PROSSIMI STEP

1. **Esegui analisi** seguendo Step 1 (Chrome DevTools)
2. **Condividi risultati** - Screenshot o metriche
3. **Identifico problemi specifici** basati sui dati
4. **Implemento fix mirati** per il tuo caso

**Inizia con**: Chrome DevTools Performance → Record → Reload → Analizza

Fammi sapere cosa trovi! 🚀
