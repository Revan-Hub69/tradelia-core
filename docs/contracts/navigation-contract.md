# Navigation Contract - Tradelia 2026

## Breakpoint
- **md = 768px**
- `md+` (≥768px) = Desktop shell
- `<md` = Mobile app

## Componenti di Navigazione

### 1. DesktopSidebar
- **Visibilità**: `hidden md:flex`
- **Posizione**: `fixed top-0 left-0 bottom-0 w-64`
- **Contenuto**:
  - Logo
  - User card
  - Home link
  - Journey switcher (4 percorsi)
  - Settings
  - Theme/Language toggles
  - Logout

### 2. MobileBottomNav
- **Visibilità**: `md:hidden`
- **Posizione**: `fixed bottom-0 left-0 right-0 h-16`
- **Contenuto**: 5 tab (Home + 4 journey)

### 3. DashboardHeader
- **Posizione**: `fixed top-0 left-0 right-0 md:left-64`
- **Mobile**: Logo + notifiche
- **Desktop**: Search + notifiche + back to site

## Layout Offsets

### Desktop (md+)
```css
main { padding-left: 16rem; } /* md:pl-64 */
header { left: 16rem; }       /* md:left-64 */
```

### Mobile (<md)
```css
main { padding-bottom: 4rem; } /* pb-16 */
header { left: 0; }
```

## Navigation Model (2 livelli)

### Livello A: Journey Switch
- Emergency (Asset di emergenza)
- Long-term (Investimenti lungo termine)
- Speculation (Speculazione)
- Passive (Guadagni passivi)

### Livello B: Sections per Journey (template fisso)
1. Overview
2. Tools
3. AI Insights
4. Learn Path
5. History

## State Ownership
- `activeJourney`: derivato da URL pathname
- `mobileDrawerOpen`: DashboardLayout (futuro)
- DesktopSidebar: sempre visibile, no open/close state
- Route change: chiude drawer automaticamente

## Accessibilità
- `aria-current="page"` sul tab attivo
- Focus ring visibile su tutti i link
- Keyboard navigation supportata
