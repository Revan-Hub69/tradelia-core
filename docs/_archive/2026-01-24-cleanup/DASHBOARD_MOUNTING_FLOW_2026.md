# DASHBOARD MOUNTING FLOW 2026

## 1. AppConfig.ts - CONFIGURAZIONE GLOBALE

**File**: `src/utils/AppConfig.ts`

**Cosa contiene:**
```typescript
export const AppConfig = {
  name: 'Tradelia',
  locales: [{ id: 'it' }, { id: 'en' }],  // Lingue supportate
  defaultLocale: 'it',                     // Lingua default
  brand: { primaryColor, accentColor },    // Colori brand
  social: { twitter, github, discord },    // Social links
  legal: { companyName, email },           // Info legali
}

// Gamification
LEVEL_THRESHOLDS: { 1: 0, 2: 100, 3: 250, ... }  // XP per livello
LEVEL_NAMES: { 1: 'Curioso', 2: 'Esploratore', ... }  // Nomi livelli
```

**Usato da:**
- `LanguageSwitcherDashboard` - Lista lingue disponibili
- `XPProgressBar` - Calcolo livelli e XP
- `Footer` - Info legali e social
- `i18n` - Configurazione internazionalizzazione

---

## 2. FLUSSO DI MONTAGGIO DASHBOARD

### STEP 1: Root Layout (HTML Structure)
**File**: `src/app/layout.tsx`

```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {children}  // ← Qui entra il locale layout
      </body>
    </html>
  );
}
```

**Responsabilità:**
- Definisce `<html>`, `<head>`, `<body>` (UNICO posto)
- Importa `shared.css` (CSS globale)
- Skip links per accessibilità

---

### STEP 2: Locale Layout (i18n + Providers)
**File**: `src/app/[locale]/layout.tsx`

```typescript
export default function LocaleLayout({ children, params }) {
  return (
    <NextIntlClientProvider locale={params.locale}>
      <ThemeProvider>
        <UserDataProvider>  // ← React Query + Supabase
          {children}  // ← Qui entra l'auth layout
        </UserDataProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
```

**Responsabilità:**
- Internazionalizzazione (next-intl)
- Theme provider (next-themes)
- User data provider (React Query)
- NO html/head/body (già nel root)

---

### STEP 3: Auth Layout (Dashboard Structure)
**File**: `src/app/[locale]/(auth)/layout.tsx`

```typescript
export default function AuthLayout({ children }) {
  return (
    <>
      <DashboardShell>
        {children}  // ← Qui entra la dashboard page
      </DashboardShell>
    </>
  );
}
```

**Responsabilità:**
- Importa `dashboard.css` (CSS specifico dashboard)
- Wrappa con `DashboardShell`
- Protegge route autenticate (middleware)

---

### STEP 4: Dashboard Shell (Server Component)
**File**: `src/components/dashboard/DashboardShell.tsx`

```typescript
export function DashboardShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />  // Accessibilità
      <DashboardClient>
        {children}  // ← Qui entra il contenuto della page
      </DashboardClient>
    </div>
  );
}
```

**Responsabilità:**
- Server component (no interattività)
- Struttura base layout
- Delega interattività a DashboardClient

---

### STEP 5: Dashboard Client (Client Boundary)
**File**: `src/components/dashboard/DashboardClient.tsx`

```typescript
'use client';

export function DashboardClient({ children }) {
  return (
    <NavigationProvider>
      <DashboardContextProvider>
        {/* CSS Grid Layout */}
        <div className="grid md:grid-cols-[var(--sidebar-width)_1fr]">
          
          {/* Sidebar - Lazy loaded */}
          <Suspense fallback={null}>
            <SidebarNavigation />
          </Suspense>

          {/* Main Content */}
          <div className="flex flex-col">
            <DashboardHeader />  // ← HEADER QUI
            <main>{children}</main>  // ← CONTENUTO PAGE
          </div>
        </div>

        {/* Bottom Nav - Mobile */}
        <BottomNavigationSimple />
        
        {/* Command Palette */}
        <CommandPalette />
      </DashboardContextProvider>
    </NavigationProvider>
  );
}
```

**Responsabilità:**
- Client component (interattività)
- CSS Grid layout (sidebar + content)
- Navigation providers
- Lazy load componenti pesanti (framer-motion)

---

### STEP 6: Dashboard Header (User Data)
**File**: `src/components/dashboard/DashboardHeader.tsx`

```typescript
'use client';

export const DashboardHeader = () => {
  const { userData, isLoading } = useUserData();  // ← React Query
  
  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Title */}
        <Logo />
        
        {/* Center: Status */}
        <StatusChip />
        
        {/* Right: Controls + User */}
        <div className="flex gap-3">
          <ThemeSwitcher />
          <LanguageSwitcherDashboard />
          <NotificationsBell />
          <UserDropdown 
            userName={userData?.name}
            userEmail={userData?.email}
          />
        </div>
      </div>
    </header>
  );
}
```

**Responsabilità:**
- Mostra dati utente (da React Query)
- Sticky positioning (top: 0)
- Controlli tema/lingua/notifiche
- User dropdown con avatar

---

### STEP 7: User Data Provider (Data Fetching)
**File**: `src/providers/UserDataProvider.tsx`

```typescript
'use client';

const fetchUserData = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Fetch complete user data
  const response = await fetch(`/api/user/progress?t=${Date.now()}`);
  const data = await response.json();
  
  return {
    id: user.id,
    email: user.email,
    name: data.profile.name,
    progress: { ... }
  };
};

export const UserDataProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserDataProviderInner>
        {children}
      </UserDataProviderInner>
    </QueryClientProvider>
  );
};

const UserDataProviderInner = ({ children }) => {
  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
    staleTime: 0,  // No cache
    gcTime: 0,     // No garbage collection
  });
  
  return (
    <UserDataContext.Provider value={{ userData }}>
      {children}
    </UserDataContext.Provider>
  );
};
```

**Responsabilità:**
- Fetch dati utente da Supabase
- Fetch progress da `/api/user/progress`
- Cache con React Query (staleTime: 0)
- Provide dati a tutta l'app

---

### STEP 8: Dashboard Page (Content)
**File**: `src/app/[locale]/(auth)/dashboard/page.tsx`

```typescript
const DashboardIndexPage = async () => {
  const t = await getTranslations('Dashboard');
  const userId = 'user-123';
  
  // Preload critical data
  preloadDashboardData(userId);
  const { userData } = await getCriticalDashboardData(userId);
  
  return (
    <PageTransitionWrapper>
      <div className="max-w-screen-xl space-y-6">
        <h1>{t('welcome_title', { name: userData.name })}</h1>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <DashboardStatusCard userData={userData} />
          <DashboardStatsCard userId={userId} />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};
```

**Responsabilità:**
- Server component (SSR)
- Fetch dati critici server-side
- Render contenuto dashboard
- Suspense boundaries per dati secondari

---

## 3. ORDINE DI RENDERING

```
1. Root Layout (HTML)
   └─ shared.css loaded
   
2. Locale Layout (i18n + Providers)
   └─ NextIntlClientProvider
   └─ ThemeProvider
   └─ UserDataProvider (React Query starts)
   
3. Auth Layout
   └─ dashboard.css loaded
   
4. DashboardShell (Server)
   └─ SkipLinks
   
5. DashboardClient (Client boundary)
   └─ NavigationProvider
   └─ DashboardContextProvider
   └─ CSS Grid layout created
   
6. Sidebar (Lazy loaded)
   └─ framer-motion loaded
   
7. DashboardHeader
   └─ useUserData() hook called
   └─ React Query fetches data
   └─ UserDropdown renders with data
   
8. Main Content
   └─ Dashboard page renders
   └─ Components render with Suspense
   
9. Bottom Nav (Mobile)
   └─ Lazy loaded
   
10. Command Palette
    └─ Lazy loaded
```

---

## 4. PROBLEMI COMUNI

### A. Header mostra dati vecchi
**Causa**: React Query cache
**Fix**: `staleTime: 0` in UserDataProvider

### B. Header design sballato
**Causa**: CSS non caricato o conflitti
**Fix**: Verificare ordine import CSS, rimuovere duplicati

### C. Hydration mismatch
**Causa**: Server e client renderizzano HTML diverso
**Fix**: `suppressHydrationWarning` su elementi dinamici

### D. Performance lenta
**Causa**: Troppi componenti caricati subito
**Fix**: Lazy load con `dynamic()` e `Suspense`

---

## 5. CSS LOADING ORDER

```
1. shared.css (root layout)
   ├─ @tailwind base
   ├─ @tailwind components
   ├─ shared/tokens.css (--header-height, --sidebar-width)
   ├─ shared/animation-tokens.css
   ├─ shared/base.css
   └─ @tailwind utilities

2. dashboard.css (auth layout)
   ├─ @tailwind utilities
   ├─ glass-effects-tokens.css
   ├─ premium-spring-physics.css
   ├─ motion-tokens.css
   ├─ layer utilities (z-index)
   └─ dashboard-ui.css
```

---

## 6. DATA FLOW

```
User Login
  ↓
Supabase Auth
  ↓
UserDataProvider.fetchUserData()
  ↓
GET /api/user/progress
  ↓
Supabase Database Query
  ↓
React Query Cache (staleTime: 0)
  ↓
useUserData() hook
  ↓
DashboardHeader
  ↓
UserDropdown renders
```

---

## 7. DEBUGGING CHECKLIST

### Header non mostra utente corretto:
- [ ] Verificare che UserDataProvider wrappa l'app
- [ ] Verificare che staleTime: 0 in React Query
- [ ] Verificare che /api/user/progress ritorna dati corretti
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Pulire .next folder

### Header design sballato:
- [ ] Verificare che shared.css sia caricato
- [ ] Verificare che dashboard.css sia caricato
- [ ] Verificare che --header-height sia definito
- [ ] Verificare che non ci siano tokens.css duplicati
- [ ] Ispezionare elementi con DevTools

### Performance lenta:
- [ ] Verificare che Sidebar sia lazy loaded
- [ ] Verificare che BottomNav sia lazy loaded
- [ ] Verificare che CommandPalette sia lazy loaded
- [ ] Verificare che framer-motion non sia importato subito
- [ ] Ottimizzare query database

---

## CONCLUSIONE

Il montaggio della dashboard segue questo pattern:

1. **Root Layout**: HTML structure + shared CSS
2. **Locale Layout**: i18n + Providers (Theme, UserData)
3. **Auth Layout**: Dashboard CSS + DashboardShell
4. **DashboardClient**: CSS Grid + Navigation + Header
5. **DashboardHeader**: User data display
6. **Dashboard Page**: Content rendering

Ogni layer ha responsabilità specifiche e delega al layer successivo.
