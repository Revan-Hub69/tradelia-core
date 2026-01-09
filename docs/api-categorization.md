# API Categorization - Tradelia Dashboard

## Current API Endpoints

### Trading Health Check
- **Endpoint**: `/api/trading/health`
- **Category**: `freshness-critical`
- **TTL**: 30s
- **Rationale**: System health affects trading decisions
- **UI Indicator**: Live status with timestamp

### Local Secrets Management
- **Endpoint**: `/api/trading/local/secrets`
- **Category**: `stale-allowed`
- **TTL**: 5min
- **Rationale**: Configuration data, not time-sensitive
- **UI Indicator**: Last updated timestamp

### Trading Launch
- **Endpoint**: `/api/trading/local/launch`
- **Category**: `freshness-critical`
- **TTL**: No cache
- **Rationale**: Action endpoint, must be real-time
- **UI Indicator**: Live action status

## Future API Endpoints (Planned)

### Real-time Price Data
- **Endpoint**: `/api/prices/{symbol}`
- **Category**: `freshness-critical`
- **TTL**: 30s max
- **Headers**: `X-Data-Category: freshness-critical`

### Historical Data
- **Endpoint**: `/api/history/{symbol}/{period}`
- **Category**: `static-snapshot`
- **TTL**: 24h
- **Headers**: `X-Data-Category: static-snapshot`

### User Preferences
- **Endpoint**: `/api/user/preferences`
- **Category**: `stale-allowed`
- **TTL**: 30min
- **Headers**: `X-Data-Category: stale-allowed`

### Dashboard Layout
- **Endpoint**: `/api/user/layout`
- **Category**: `stale-allowed`
- **TTL**: 15min
- **Headers**: `X-Data-Category: stale-allowed`

### Market Reports
- **Endpoint**: `/api/reports/daily/{date}`
- **Category**: `static-snapshot`
- **TTL**: 24h
- **Headers**: `X-Data-Category: static-snapshot`

### Risk Alerts
- **Endpoint**: `/api/alerts/active`
- **Category**: `freshness-critical`
- **TTL**: No cache
- **Headers**: `X-Data-Category: freshness-critical`

## Implementation Guidelines

### Header Requirements
All API responses MUST include:
```http
X-Data-Category: freshness-critical|stale-allowed|static-snapshot|immutable-asset
X-Data-TTL: <seconds>
X-Data-Source: <source-identifier>
Cache-Control: <appropriate-directive>
```

### Example Implementation
```typescript
// API Route Handler
export async function GET(request: Request) {
  const data = await fetchTradingHealth();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'X-Data-Category': 'freshness-critical',
      'X-Data-TTL': '30',
      'X-Data-Source': 'trading-engine',
      'Cache-Control': 'no-cache, must-revalidate'
    }
  });
}
```

### Client-side Usage
```typescript
// Fetch with category awareness
async function fetchWithCategory(url: string, category: string) {
  const response = await fetch(url, {
    headers: {
      'X-Data-Category': category
    }
  });
  
  const dataCategory = response.headers.get('X-Data-Category');
  const ttl = response.headers.get('X-Data-TTL');
  
  return {
    data: await response.json(),
    category: dataCategory,
    ttl: parseInt(ttl || '0'),
    timestamp: Date.now()
  };
}
```

## Compliance Checklist

- [ ] All endpoints declare data category
- [ ] TTL values are appropriate for category
- [ ] UI indicators match data category
- [ ] Service Worker respects categories
- [ ] Error handling follows category rules
- [ ] Monitoring tracks category compliance