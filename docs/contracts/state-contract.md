# State Contract - Tradelia 2026

> Ogni stato ha UN SOLO owner. Gli altri chiedono, non decidono.

---

## 1. Regola Fondamentale

```
Se violi ownership:
→ sidebar bloccata
→ modali che non chiudono
→ UI "posseduta da nessuno"
```

---

## 2. Ownership Map

### Sidebar State
```
Owner: DashboardLayout

DashboardLayout
  ├── state: isSidebarOpen
  ├── actions: setOpen(bool)
  │
  ├── DashboardHeader
  │     └── emette: onMenuClick → setOpen(true)
  │
  └── DashboardSidebar
        └── emette: onClose → setOpen(false)
```

**VIETATO**: Sidebar che gestisce il proprio `isOpen`

### Auth State
```
Owner: AuthProvider (context)

AuthProvider
  ├── state: user, isLoading, error
  ├── actions: signIn, signOut, refresh
  │
  ├── useAuth() → read-only access
  │
  └── Components
        └── chiamano actions, non modificano state
```

### Modal State
```
Owner: Component che apre il modal

ParentComponent
  ├── state: isModalOpen
  ├── actions: openModal, closeModal
  │
  └── Modal
        └── emette: onClose → closeModal()
```

### Theme State
```
Owner: ThemeProvider

ThemeProvider
  ├── state: theme ('light' | 'dark' | 'system')
  ├── actions: setTheme
  ├── persistence: localStorage
  │
  └── useTheme() → { theme, setTheme }
```

### Language State
```
Owner: next-intl (middleware + provider)

Middleware
  ├── detects locale from URL
  │
NextIntlClientProvider
  ├── provides translations
  │
  └── useTranslations() → read-only
```

---

## 3. Pattern Corretti

### ✅ Lifting State Up
```tsx
// Owner
function DashboardLayout() {
  const [isOpen, setOpen] = useState(false)
  
  return (
    <>
      <Header onMenuClick={() => setOpen(true)} />
      <Sidebar isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}

// Consumer - NON ha stato proprio
function Sidebar({ isOpen, onClose }) {
  if (!isOpen) return null
  return <aside>...</aside>
}
```

### ✅ Context per State Globale
```tsx
// Provider (owner)
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  
  const signIn = async () => { /* ... */ }
  const signOut = async () => { /* ... */ }
  
  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Consumer - read + actions, no direct state
function useAuth() {
  return useContext(AuthContext)
}
```

### ✅ Derived State
```tsx
// Stato derivato, non duplicato
function Dashboard() {
  const { user } = useAuth()
  
  // ✅ Derivato
  const isGuest = !user
  const userName = user?.name || 'Guest'
  
  // ❌ MAI duplicare
  // const [isGuest, setIsGuest] = useState(!user)
}
```

---

## 4. Anti-Pattern (VIETATI)

### ❌ Stato Duplicato
```tsx
// SBAGLIATO - stato duplicato
function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // ❌
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false) // ❌ duplicato!
}
```

### ❌ Prop Drilling Eccessivo
```tsx
// SBAGLIATO - 5+ livelli di props
<App>
  <Layout isOpen={isOpen} setOpen={setOpen}>
    <Main isOpen={isOpen} setOpen={setOpen}>
      <Content isOpen={isOpen} setOpen={setOpen}>
        <Widget isOpen={isOpen} setOpen={setOpen} />
```

**Soluzione**: Context o Zustand per stato condiviso profondo

### ❌ useEffect per Sync State
```tsx
// SBAGLIATO - sync manuale
useEffect(() => {
  if (externalState !== localState) {
    setLocalState(externalState) // ❌ loop risk
  }
}, [externalState])
```

**Soluzione**: Single source of truth

---

## 5. Quando Usare Cosa

| Scenario | Soluzione |
|----------|-----------|
| Stato locale UI (hover, focus) | `useState` nel componente |
| Stato condiviso 2-3 componenti | Lift state up |
| Stato globale (auth, theme) | Context |
| Stato complesso con actions | Zustand / Redux |
| Stato server | React Query / SWR |
| Stato URL | Next.js router |

---

## 6. Zustand (se necessario)

```tsx
// Store con ownership chiara
const useDashboardStore = create((set) => ({
  // State
  isSidebarOpen: false,
  
  // Actions (solo qui si modifica)
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}))

// Usage - components chiamano actions
function Header() {
  const openSidebar = useDashboardStore((s) => s.openSidebar)
  return <button onClick={openSidebar}>Menu</button>
}
```

---

## 7. Checklist Ownership

Prima di creare stato, chiediti:

- [ ] Chi è l'owner di questo stato?
- [ ] Esiste già altrove? (evita duplicati)
- [ ] Può essere derivato da altro stato?
- [ ] Quanti componenti lo usano?
- [ ] Deve persistere? (localStorage, URL, server)

---

## 8. Debug State Issues

Se qualcosa "non si chiude" o "resta bloccato":

1. **Trova l'owner** - chi ha `useState` o store?
2. **Verifica il flusso** - l'evento arriva all'owner?
3. **Check duplicati** - c'è stato duplicato?
4. **Console.log** - logga state changes nell'owner

```tsx
// Debug helper
useEffect(() => {
  console.log('[DashboardLayout] isSidebarOpen:', isSidebarOpen)
}, [isSidebarOpen])
```
