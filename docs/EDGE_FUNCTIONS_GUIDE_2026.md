# 🚀 Edge Functions - Guida Semplice 2026

**Data**: 25 Gennaio 2026  
**Status**: Non implementato (opzionale)  
**Tempo stimato**: 3 ore  
**ROI**: Medio-Alto

---

## 🎯 Cos'è Edge Computing?

### Analogia Semplice

Immagina di ordinare una pizza:

**Senza Edge** (Server Centrale):
- Tutte le pizze vengono da 1 pizzeria a Milano
- Utente a Tokyo ordina → pizza arriva da Milano (2 ore)
- Utente a New York ordina → pizza arriva da Milano (2 ore)

**Con Edge** (Server Distribuiti):
- Pizzerie in ogni città
- Utente a Tokyo ordina → pizza arriva da Tokyo (15 min)
- Utente a New York ordina → pizza arriva da New York (15 min)

**Edge = Il tuo codice gira sul server più vicino all'utente**

---

## 📊 Differenza Tecnica

### Server Tradizionale (Node.js)
```
User (Tokyo) → Internet → Server (Milano) → Database → Response
                ↑                                          ↓
                └──────────────── 800ms ─────────────────┘
```

### Edge Function
```
User (Tokyo) → Edge Server (Tokyo) → Database → Response
                ↑                                   ↓
                └────────── 200ms ─────────────────┘
```

**Risultato**: TTFB -75% (800ms → 200ms)

---

## 💻 Come Funziona in Next.js

### API Route Normale
```typescript
// app/api/user/profile/route.ts
export async function GET() {
  const data = await fetchFromSupabase();
  return Response.json(data);
}

// Gira su: 1 server centrale (es. Milano)
// TTFB: 800ms per utenti lontani
```

### API Route Edge
```typescript
// app/api/user/profile/route.ts
export const runtime = 'edge'; // ← QUESTA RIGA!

export async function GET() {
  const data = await fetchFromSupabase();
  return Response.json(data);
}

// Gira su: Server più vicino all'utente (es. Tokyo)
// TTFB: 200ms ovunque nel mondo
```

**Differenza**: 1 riga di codice, 75% più veloce

---

## ✅ Vantaggi

### 1. Performance
- **TTFB**: -50-70% (più veloce ovunque)
- **Cold Start**: -80% (avvio istantaneo)
- **Latency**: Minima (server vicino)

### 2. Scalabilità
- **Auto-scaling**: Vercel gestisce tutto
- **Global**: 100+ città nel mondo
- **Zero config**: Funziona automaticamente

### 3. Costi
- **Pay-per-use**: Paghi solo per le richieste
- **No idle**: Nessun server sempre acceso
- **Efficiente**: Meno risorse = meno costi

---

## ⚠️ Limitazioni

### 1. No Node.js APIs
```typescript
// ❌ NON FUNZIONA su Edge
import fs from 'fs';
import crypto from 'crypto';
import { exec } from 'child_process';

// ✅ FUNZIONA su Edge
import { headers } from 'next/headers';
fetch('https://api.example.com');
```

### 2. Timeout
- **Edge**: Max 30 secondi
- **Node.js**: Illimitato

### 3. Librerie
Alcune librerie non sono Edge-compatible:
- Librerie con `fs`, `crypto`, `child_process`
- Librerie con codice nativo (C/C++)
- Librerie vecchie non aggiornate

---

## 🎯 Nel Tuo Progetto

### Candidati per Edge ✅

**1. `/api/user/profile`**
- Operazione: Fetch da Supabase
- Tempo: ~200ms
- Edge-compatible: ✅ SÌ
- Beneficio: TTFB -70%

**2. `/api/user/progress`**
- Operazione: Fetch + Insert Supabase
- Tempo: ~300ms
- Edge-compatible: ✅ SÌ
- Beneficio: TTFB -65%

**3. `/api/lessons/complete`**
- Operazione: Update Supabase + validazione
- Tempo: ~250ms
- Edge-compatible: ✅ SÌ
- Beneficio: TTFB -70%

### Non Candidati ❌

**1. Route con File System**
- Operazione: Legge/scrive file
- Edge-compatible: ❌ NO (no `fs` module)

**2. Route con Heavy Computation**
- Operazione: > 30 secondi
- Edge-compatible: ❌ NO (timeout)

**3. Route con Librerie Native**
- Operazione: Usa librerie C/C++
- Edge-compatible: ❌ NO (no native code)

---

## 🛠️ Implementazione

### Step 1: Verifica Compatibilità

```typescript
// Controlla se usi Node.js APIs
import fs from 'fs'; // ❌ NO
import crypto from 'crypto'; // ❌ NO
import { exec } from 'child_process'; // ❌ NO

// Controlla timeout
async function handler() {
  await longOperation(); // > 30s? ❌ NO
}

// Controlla librerie
import someLibrary from 'some-library'; // Edge-compatible? 🤔
```

### Step 2: Aggiungi Runtime Edge

```typescript
// app/api/user/profile/route.ts
export const runtime = 'edge'; // ← Aggiungi questa riga

export async function GET(request: Request) {
  // Il tuo codice esistente
  const data = await fetchFromSupabase();
  return Response.json(data);
}
```

### Step 3: Testa

```bash
npm run build
# Verifica che non ci siano errori

npm run dev
# Testa l'API route
curl http://localhost:3000/api/user/profile
```

### Step 4: Deploy

```bash
git add .
git commit -m "feat: migrate API routes to Edge runtime"
git push
# Vercel deploya automaticamente
```

---

## 📊 Risultati Attesi

### Prima (Node.js)
```
User (Tokyo)    → TTFB: 800ms
User (New York) → TTFB: 600ms
User (London)   → TTFB: 400ms
User (Milano)   → TTFB: 50ms

Media: 462ms
```

### Dopo (Edge)
```
User (Tokyo)    → TTFB: 150ms
User (New York) → TTFB: 120ms
User (London)   → TTFB: 100ms
User (Milano)   → TTFB: 80ms

Media: 112ms (-76%)
```

---

## 🔍 Come Verificare

### 1. Chrome DevTools
```
Network tab → Click API request → Timing tab
- Waiting (TTFB): Dovrebbe essere < 200ms
```

### 2. Vercel Analytics
```
Dashboard → Functions → Edge Functions
- Vedi latency per regione
- Vedi cold start time
```

### 3. Lighthouse
```
npm run lighthouse
- TTFB dovrebbe migliorare
- Performance score dovrebbe aumentare
```

---

## 💡 Best Practices

### 1. Usa Edge per API Veloci
```typescript
// ✅ BUONO: Fetch veloce
export const runtime = 'edge';
export async function GET() {
  const data = await supabase.from('users').select('*');
  return Response.json(data);
}
```

### 2. Usa Node.js per Operazioni Pesanti
```typescript
// ✅ BUONO: Operazione pesante
// NO runtime = 'edge' (usa Node.js)
export async function POST() {
  const result = await heavyComputation(); // 5 minuti
  return Response.json(result);
}
```

### 3. Testa Sempre
```typescript
// ✅ BUONO: Testa prima di deployare
export const runtime = 'edge';

export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Edge function error:', error);
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}
```

---

## 🚀 Piano di Implementazione

### Fase 1: Preparazione (30 min)
1. Leggi questa guida
2. Identifica API routes candidati
3. Verifica compatibilità librerie

### Fase 2: Implementazione (1.5 ore)
1. Aggiungi `runtime = 'edge'` a 3 routes
2. Testa in locale (`npm run dev`)
3. Verifica che tutto funzioni

### Fase 3: Testing (30 min)
1. Build (`npm run build`)
2. Testa tutte le API routes
3. Verifica errori

### Fase 4: Deploy (30 min)
1. Commit + push
2. Verifica deploy Vercel
3. Testa in produzione
4. Monitora performance

**Totale**: 3 ore

---

## 📈 ROI Analysis

### Investimento
- Tempo: 3 ore
- Rischio: Basso (facile rollback)
- Costo: Zero (incluso in Vercel)

### Ritorno
- TTFB: -50-70% (800ms → 200ms)
- UX: Migliore (app più veloce)
- SEO: Migliore (Core Web Vitals)
- Scalabilità: Automatica

**ROI**: ✅ ALTO (3 ore → beneficio permanente)

---

## ❓ FAQ

### Q: Edge Functions costa di più?
**A**: No, stesso prezzo di Node.js su Vercel. Anzi, spesso costa meno (più efficiente).

### Q: Posso usare Supabase con Edge?
**A**: Sì! Supabase client è Edge-compatible.

### Q: Cosa succede se supero 30 secondi?
**A**: La funzione viene terminata. Usa Node.js per operazioni lunghe.

### Q: Posso fare rollback?
**A**: Sì, basta rimuovere `runtime = 'edge'` e ri-deployare.

### Q: Edge funziona in sviluppo locale?
**A**: Sì, Next.js simula Edge runtime in locale.

---

## 🎯 Conclusione

**Edge Functions = Performance globale con 1 riga di codice**

**Quando usare**:
- ✅ API routes veloci (< 30s)
- ✅ Fetch da database
- ✅ Validazione input
- ✅ Rate limiting
- ✅ Redirect/rewrite

**Quando NON usare**:
- ❌ File system operations
- ❌ Heavy computation (> 30s)
- ❌ Librerie non Edge-compatible

**Nel tuo progetto**:
- Candidati: 3 API routes
- Tempo: 3 ore
- Beneficio: TTFB -70%
- ROI: ✅ ALTO

---

**Status**: ⏭️ OPZIONALE  
**Priority**: P4 (Nice to have)  
**Recommendation**: Implementa se hai tempo, altrimenti va bene così

**Progetto già veloce senza Edge, ma Edge lo renderebbe ancora più veloce!** 🚀
