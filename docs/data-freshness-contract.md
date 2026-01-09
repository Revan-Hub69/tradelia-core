# Data Freshness Contract - Tradelia Dashboard

## Overview

Questo documento definisce le categorie di freshness per tutti i dati utilizzati nella Tradelia Dashboard, stabilendo policy di caching esplicite e regole di invalidazione per garantire la coerenza e l'affidabilità delle informazioni finanziarie.

**Principio Guida**: "I dati freshness-critical non devono mai essere stale. I dati stale-allowed devono mostrare chiaramente il loro stato di aggiornamento."

## Data Categories

### 1. Immutable Assets
**Definizione**: Risorse statiche che non cambiano mai una volta create.

**Esempi**:
- Static images, fonts, icons
- Compiled JS/CSS with hash (e.g., `main-abc123.js`)
- Versioned documentation
- Historical snapshots with timestamp

**Policy**:
- **Caching**: Cache-first, long TTL (1 year)
- **Invalidation**: Hash-based busting only
- **UI Indicator**: None required (immutable)
- **Service Worker**: Aggressive caching with hash validation

### 2. Freshness-Critical
**Definizione**: Dati che devono essere sempre aggiornati per decisioni finanziarie critiche.

**Esempi**:
- Real-time crypto prices
- Risk alerts and warnings
- System status and availability
- User authentication status
- Market volatility indicators

**Policy**:
- **Caching**: Network-first, no cache or very short TTL (30s max)
- **Invalidation**: Immediate on data change
- **UI Indicator**: Always show "live" status with timestamp
- **Service Worker**: Bypass cache, direct network requests
- **Fallback**: Show clear "offline" or "stale data" warning

### 3. Stale-Allowed
**Definizione**: Dati che possono essere temporaneamente obsoleti senza compromettere la sicurezza.

**Esempi**:
- Historical price data (>1 day old)
- User preferences and dashboard layout
- Educational content and research papers
- Non-critical notifications
- Analytics and usage statistics

**Policy**:
- **Caching**: Stale-while-revalidate, medium TTL (5-30min)
- **Invalidation**: Background refresh with graceful updates
- **UI Indicator**: Show "last updated" timestamp
- **Service Worker**: Serve stale while fetching fresh
- **Fallback**: Continue with stale data, show age

### 4. Static Snapshots
**Definizione**: Dati che sono statici per design e cambiano solo a intervalli predefiniti.

**Esempi**:
- Daily market reports
- Weekly analysis summaries
- Monthly portfolio reviews
- Archived research data
- Regulatory updates

**Policy**:
- **Caching**: Cache-first with validation, long TTL (24h)
- **Invalidation**: Scheduled refresh at known intervals
- **UI Indicator**: Show snapshot date and next update time
- **Service Worker**: Cache-first with periodic validation
- **Fallback**: Serve cached version with age warning

## Implementation Rules

### API Endpoint Classification
Tutti gli endpoint API DEVONO dichiarare la loro categoria di freshness tramite header HTTP:

```http
X-Data-Category: freshness-critical
X-Data-TTL: 30
X-Data-Source: real-time-feed
```

### UI Freshness Indicators
La UI DEVE mostrare indicatori appropriati per ogni categoria:

```tsx
// Freshness-Critical
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
  <span className="text-xs text-muted-foreground">Live • {timestamp}</span>
</div>

// Stale-Allowed
<div className="flex items-center gap-2">
  <ClockIcon className="w-3 h-3 text-muted-foreground" />
  <span className="text-xs text-muted-foreground">Updated {timeAgo}</span>
</div>

// Static Snapshots
<div className="flex items-center gap-2">
  <CalendarIcon className="w-3 h-3 text-muted-foreground" />
  <span className="text-xs text-muted-foreground">Snapshot: {date}</span>
</div>
```

### Service Worker Compliance
Il Service Worker DEVE rispettare le policy di categoria:

```javascript
// Route by data category
if (request.headers.get('X-Data-Category') === 'freshness-critical') {
  return networkFirstStrategy(request);
} else if (request.headers.get('X-Data-Category') === 'stale-allowed') {
  return staleWhileRevalidateStrategy(request);
}
```

### Error Handling
Ogni categoria ha regole specifiche per la gestione degli errori:

- **Freshness-Critical**: Mostra errore immediato, non servire dati stale
- **Stale-Allowed**: Servi dati stale con warning chiaro
- **Static Snapshots**: Servi ultima versione cached con disclaimer
- **Immutable Assets**: Fallback a CDN o versione precedente

## Anti-Patterns da Evitare

❌ **Mixing Categories**: Non mescolare categorie diverse in un singolo endpoint
❌ **Silent Staleness**: Non servire dati stale senza indicatori UI
❌ **Aggressive Caching**: Non cachare dati freshness-critical
❌ **Missing Indicators**: Non omettere timestamp su dati time-sensitive
❌ **Inconsistent TTL**: Non usare TTL diversi per la stessa categoria

## Monitoring & Compliance

### Metriche da Tracciare
- Percentuale di richieste freshness-critical servite da cache (deve essere 0%)
- Tempo medio di staleness per dati stale-allowed
- Frequenza di cache miss per static snapshots
- Errori di freshness indicator mancanti

### Alerting
- Alert se dati freshness-critical vengono serviti da cache
- Warning se dati stale-allowed superano TTL massimo
- Notification se static snapshots non vengono aggiornati nei tempi previsti

## Esempi Pratici

### Crypto Price Feed
```typescript
// Freshness-Critical
const priceData = await fetch('/api/prices/btc', {
  headers: { 'X-Data-Category': 'freshness-critical' }
});
```

### User Dashboard Layout
```typescript
// Stale-Allowed
const layoutConfig = await fetch('/api/user/layout', {
  headers: { 'X-Data-Category': 'stale-allowed' }
});
```

### Daily Market Report
```typescript
// Static Snapshot
const marketReport = await fetch('/api/reports/daily/2024-01-07', {
  headers: { 'X-Data-Category': 'static-snapshot' }
});
```

---

**Documento approvato**: [Data da completare]
**Prossima revisione**: [Data da completare]
**Owner**: Lead Developer
**Stakeholders**: Performance Engineer, Security Engineer, Product Team