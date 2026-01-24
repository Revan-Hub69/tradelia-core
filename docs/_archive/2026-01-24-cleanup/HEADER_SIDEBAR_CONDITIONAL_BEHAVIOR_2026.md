# HEADER SIDEBAR CONDITIONAL BEHAVIOR - 2026

## PROBLEMA IDENTIFICATO

L'header si nascondeva sempre durante lo scroll, anche quando era presente la sidebar su tablet/desktop, creando un'esperienza utente inconsistente.

## SOLUZIONE IMPLEMENTATA

### LOGICA CONDIZIONALE
L'header ora si comporta diversamente in base alla presenza della sidebar:

**MOBILE (< 768px) - SENZA SIDEBAR:**
- ✅ Header si nasconde durante scroll down
- ✅ Header riappare durante scroll up
- ✅ Ottimizza spazio schermo limitato

**TABLET/DESKTOP (≥ 768px) - CON SIDEBAR:**
- ✅ Header rimane sempre fisso
- ✅ Non si nasconde mai durante scroll
- ✅ Mantiene consistenza con sidebar navigation

### IMPLEMENTAZIONE TECNICA

```typescript
// Sidebar detection for conditional hide behavior
const [hasSidebar, setHasSidebar] = useState(false);

useEffect(() => {
  const checkSidebar = () => {
    // Sidebar is present on tablet+ (768px+) based on layout structure
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setHasSidebar(mediaQuery.matches);
  };
  
  checkSidebar();
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  mediaQuery.addEventListener('change', checkSidebar);
  
  return () => mediaQuery.removeEventListener('change', checkSidebar);
}, []);

// Header should only hide on mobile (no sidebar), stay fixed on tablet/desktop (with sidebar)
const shouldHideOnScroll = hideOnScroll && !hasSidebar;
```

### BREAKPOINT ALIGNMENT
La logica è allineata con il layout esistente:
- Sidebar: `hidden md:block` (768px+)
- Header behavior: `min-width: 768px` detection

## BENEFICI UX

1. **Mobile First**: Massimizza spazio disponibile su schermi piccoli
2. **Desktop Consistency**: Header sempre visibile quando c'è sidebar
3. **Responsive Behavior**: Comportamento adattivo basato su viewport
4. **Performance**: Media query listener ottimizzato

## TESTING

- ✅ Mobile (< 768px): Header si nasconde/mostra durante scroll
- ✅ Tablet (≥ 768px): Header rimane fisso
- ✅ Desktop (≥ 768px): Header rimane fisso
- ✅ Resize window: Comportamento si adatta dinamicamente

---

**IMPLEMENTATO**: January 22, 2026  
**COMPATIBILITÀ**: Tutti i device e browser moderni  
**PERFORMANCE**: Nessun impatto negativo, media query ottimizzata