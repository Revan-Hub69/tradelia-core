# Test Links - Tradelia

## Link Correnti nel Codice

### Navbar (templates/Navbar.tsx)
- **Sign In**: `/sign-in` ✅
- **Sign Up**: `/sign-up` ✅

### Hero (templates/Hero.tsx)  
- **CTA Primary**: `/lesson-0` ✅
- **CTA Secondary**: `#demo` ✅

### Altri Componenti Aggiornati
- **SocialProof.tsx**: `/lesson-0` ✅
- **Footer.tsx**: `/lesson-0` ✅
- **FinalCTA.tsx**: `/lesson-0` ✅
- **Sign-in page**: `/sign-up` ✅

## Test da Fare

1. Vai su `http://localhost:3000/en/`
2. **Cancella cache browser** (Ctrl+Shift+R)
3. Clicca **"Start Free"** nella navbar (in alto a destra)
4. Dovrebbe andare a `/en/sign-up`

5. Torna alla home
6. Clicca **"Start free"** nel hero (pulsante grande blu)
7. Dovrebbe andare a `/en/lesson-0`

## Se Ancora Va su Onboarding

Significa che c'è un altro link nascosto o cache persistente.
Prova modalità incognito del browser.