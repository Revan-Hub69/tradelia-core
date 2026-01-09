# State Ownership Map - Tradelia Dashboard

> **Principio**: Una sola Source of Truth per ogni tipo di stato.

## Overview

Questo documento definisce la responsabilità di ogni sistema di state management nel progetto Tradelia Dashboard. L'obiettivo è evitare duplicazioni e conflitti tra i diversi sistemi.

## Source of Truth Rules

### 1. React Query → Server State

**Responsabilità**: Dati che provengono dal server e devono essere sincronizzati.

| Tipo di Dato | Esempio | TTL | Strategia |
|--------------|---------|-----|-----------|
| User Profile | `/api/user/profile` | 5 min | staleWhileRevalidate |
| Dashboard Data | `/api/dashboard/*` | 30 sec | networkFirst |
| Reports | `/api/reports/*` | 24 ore | cacheFirst |
| Alerts | `/api/alerts` | 0 (realtime) | networkOnly |

**Configurazione Standard**:
```typescript
// src/shared/config/query-client.ts
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minuti
      gcTime: 30 * 60 * 1000,        // 30 minuti (garbage collection)
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
};
```

**Anti-Pattern**:
- ❌ Copiare dati da React Query in Zustand
- ❌ Usare useState per dati server
- ❌ Cache manuale in localStorage per API responses

---

### 2. Zustand → UI State & Preferences

**Responsabilità**: Stato dell'interfaccia utente e preferenze locali.

| Tipo di Stato | Store | Persistenza |
|---------------|-------|-------------|
| Sidebar state | `useSidebarStore` | localStorage |
| Theme preference | `useThemeStore` | localStorage |
| Command palette | `useCommandStore` | localStorage (history) |
| Modal state | `useModalStore` | No |
| Toast notifications | `useToastStore` | No |
| Layout preferences | `useLayoutStore` | localStorage |

**Struttura Store Standard**:
```typescript
// src/features/sidebar-state/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  state: 'expanded' | 'compact' | 'hidden';
  setState: (state: SidebarState['state']) => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      state: 'expanded',
      setState: (state) => set({ state }),
      toggle: () => {
        const current = get().state;
        const next = current === 'expanded' ? 'compact' : 
                    current === 'compact' ? 'hidden' : 'expanded';
        set({ state: next });
      },
    }),
    { name: 'tradelia-sidebar-state' }
  )
);
```

**Anti-Pattern**:
- ❌ Salvare dati server in Zustand
- ❌ Duplicare stato tra più store
- ❌ Store troppo grandi (split per feature)

---

### 3. IndexedDB → Persistence & Offline

**Responsabilità**: Persistenza locale per offline e draft data.

| Tipo di Dato | Database | Object Store | TTL |
|--------------|----------|--------------|-----|
| User preferences | `tradelia-db` | `preferences` | ∞ |
| Offline queue | `tradelia-db` | `offline-queue` | Until sync |
| Draft data | `tradelia-db` | `drafts` | 7 giorni |
| Cached assets | Service Worker | - | Vedi SW |

**Schema IndexedDB**:
```typescript
// src/shared/lib/indexed-db.ts
interface TradeliaDB {
  preferences: {
    key: string;
    value: unknown;
    updatedAt: string;
  };
  offlineQueue: {
    id: string;
    action: string;
    payload: unknown;
    createdAt: string;
    retries: number;
  };
  drafts: {
    id: string;
    type: string;
    data: unknown;
    createdAt: string;
    expiresAt: string;
  };
}
```

**Anti-Pattern**:
- ❌ Usare IndexedDB come cache API (usa Service Worker)
- ❌ Salvare dati sensibili senza encryption
- ❌ Duplicare dati già in React Query cache

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ useQuery()  │  │ useStore()  │  │ useState()  │              │
│  │ Server Data │  │  UI State   │  │ Local Only  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   REACT QUERY   │ │     ZUSTAND     │ │   COMPONENT     │
│                 │ │                 │ │                 │
│ • API responses │ │ • Sidebar state │ │ • Form inputs   │
│ • Server sync   │ │ • Theme         │ │ • Hover state   │
│ • Optimistic    │ │ • Modals        │ │ • Focus state   │
│   updates       │ │ • Preferences   │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│  SERVICE WORKER │ │   LOCALSTORAGE  │
│                 │ │                 │
│ • API cache     │ │ • Preferences   │
│ • Offline       │ │ • Theme         │
│ • Freshness     │ │ • Sidebar       │
└─────────────────┘ └─────────────────┘
         │
         ▼
┌─────────────────┐
│    INDEXEDDB    │
│                 │
│ • Offline queue │
│ • Draft data    │
│ • Large blobs   │
└─────────────────┘
```

---

## Decision Matrix

| Domanda | Risposta | Sistema |
|---------|----------|---------|
| Il dato viene dal server? | Sì | React Query |
| Il dato è UI-only? | Sì | Zustand o useState |
| Deve persistere tra sessioni? | Sì | Zustand + persist |
| È un dato grande (>5MB)? | Sì | IndexedDB |
| È una coda offline? | Sì | IndexedDB |
| È un draft/bozza? | Sì | IndexedDB |
| È stato di un singolo componente? | Sì | useState |
| È condiviso tra componenti? | Sì | Zustand |

---

## Naming Conventions

### Zustand Stores
```
use[Feature]Store
```
Esempi: `useSidebarStore`, `useThemeStore`, `useCommandStore`

### React Query Keys
```
[entity, action?, id?]
```
Esempi: `['user', 'profile']`, `['dashboard', 'alerts']`, `['report', id]`

### IndexedDB Object Stores
```
kebab-case
```
Esempi: `offline-queue`, `user-preferences`, `draft-reports`

---

## Migration Guide

### Da useState a Zustand
```typescript
// Prima (useState)
const [sidebarOpen, setSidebarOpen] = useState(true);

// Dopo (Zustand)
const { state, setState } = useSidebarStore();
```

### Da localStorage manuale a Zustand persist
```typescript
// Prima (manuale)
const theme = localStorage.getItem('theme');
localStorage.setItem('theme', newTheme);

// Dopo (Zustand persist)
const { theme, setTheme } = useThemeStore();
// Persistenza automatica
```

### Da cache manuale a React Query
```typescript
// Prima (manuale)
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);

// Dopo (React Query)
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: () => fetch('/api/data').then(r => r.json()),
});
```

---

## Checklist per Code Review

- [ ] I dati server usano React Query?
- [ ] Lo stato UI usa Zustand o useState?
- [ ] Non ci sono duplicazioni tra sistemi?
- [ ] Le preferenze persistono correttamente?
- [ ] I nomi seguono le convenzioni?
- [ ] Non ci sono anti-pattern?

---

## Riferimenti

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Data Freshness Contract](./data-freshness-contract.md)
