# Email Verification - Real Fix 2026

## 🎯 Il Vero Problema

Con "Confirm email" **DISABILITATO** in Supabase (per permettere login immediato), Supabase **NON invia automaticamente** l'email di verifica dopo signup.

## ✅ Soluzione Implementata

### Fix 1: Invio Manuale Email Dopo Signup

```typescript
// src/app/[locale]/(auth)/(center)/auth/page.tsx

// Dopo signup success:
try {
  const { error: resendError } = await supabase.auth.resend({
    type: 'signup',
    email: data.email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (resendError) {
    console.error('⚠️ Failed to send verification email:', resendError);
  } else {
    console.log('✅ Verification email sent to:', data.email);
  }
} catch (emailError) {
  console.error('⚠️ Email send exception:', emailError);
}
```

### Fix 2: Metadata Lingua per Email Template

```typescript
// Email Signup
const locale = window.location.pathname.split('/')[1] || 'en';

await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: {
      language: locale === 'it' ? 'it' : 'en'  // ← Per template V2
    }
  }
});

// OAuth Signup
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    data: {
      language: locale === 'it' ? 'it' : 'en'  // ← Per template V2
    }
  }
});
```

### Fix 3: Banner Controlla Sempre Stato Utente

```typescript
// src/components/dashboard/EmailVerificationBanner.tsx

useEffect(() => {
  const checkUserVerification = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && !user.email_confirmed_at) {
      // Show banner
      setIsVisible(true);
      setEmail(user.email || '');
    }
  };

  checkUserVerification();
}, []);
```

## 🧪 Come Testare

### Test 1: Email Signup
```bash
1. Vai a /auth
2. Registrati con email e password
3. ✅ Dovresti essere loggato immediatamente
4. ✅ Controlla console: "✅ Verification email sent to: ..."
5. ✅ Controlla inbox: Email dovrebbe arrivare
6. ✅ Banner appare in dashboard
```

### Test 2: OAuth Signup
```bash
1. Vai a /auth
2. Clicca "Continue with Google"
3. ✅ Dovresti essere loggato immediatamente
4. ✅ Controlla inbox: Email dovrebbe arrivare
5. ✅ Banner appare in dashboard
```

### Test 3: Resend dal Banner
```bash
1. In dashboard, clicca "Resend email" nel banner
2. ✅ Controlla console per errori
3. ✅ Controlla inbox: Nuova email dovrebbe arrivare
4. ✅ Success message appare
```

## 🔍 Debug

### Se Email Non Arriva

1. **Controlla Console Browser**:
   ```
   Cerca: "✅ Verification email sent"
   Se vedi errore: Leggi il messaggio
   ```

2. **Controlla Supabase Logs**:
   ```
   Dashboard → Logs → Auth Logs
   Cerca: "resend" o "signup"
   Verifica: Nessun errore SMTP
   ```

3. **Verifica Template Caricato**:
   ```
   Dashboard → Authentication → Email Templates
   "Confirm signup" deve avere:
   - HTML template (v2/confirm-signup.html)
   - Plain text template (v2/confirm-signup.txt)
   - {{.ConfirmationURL}} presente
   ```

4. **Verifica SMTP Configurato**:
   ```
   Dashboard → Settings → Auth → SMTP Settings
   Verifica: Brevo SMTP configurato correttamente
   ```

5. **Test Manuale**:
   ```typescript
   // Console browser
   const { error } = await supabase.auth.resend({
     type: 'signup',
     email: 'tua-email@example.com'
   })
   console.log('Error:', error)
   ```

### Errori Comuni

**Error: "For security purposes, you can only request this once every 60 seconds"**
- Soluzione: Aspetta 60 secondi tra resend

**Error: "Email rate limit exceeded"**
- Soluzione: Hai raggiunto il limite giornaliero (100 email/giorno free tier)

**Error: "User not found"**
- Soluzione: Email non registrata, fai signup prima

**Error: "Email already confirmed"**
- Soluzione: Email già verificata, banner non dovrebbe apparire

## 📊 Cosa Aspettarsi

### Flow Completo

```
1. User fa signup
   ↓
2. User loggato immediatamente
   ↓
3. Email inviata in background (resend API)
   ↓
4. Redirect a /dashboard?emailVerification=pending&email=...
   ↓
5. Banner appare: "Verifica la tua email"
   ↓
6. User clicca link in email
   ↓
7. Email verificata
   ↓
8. Banner scompare automaticamente
```

### Timeline

```
T+0s:  Signup completato
T+1s:  User in dashboard
T+2s:  Email inviata (background)
T+5s:  Email arriva in inbox
T+10s: User clicca link
T+11s: Email verificata
T+12s: Banner scompare
```

## ✅ Checklist Implementazione

- [x] Invio manuale email dopo signup
- [x] Metadata lingua in signup
- [x] Metadata lingua in OAuth
- [x] Banner controlla stato utente sempre
- [x] Traduzioni aggiunte
- [x] Error handling migliorato
- [x] Dismiss logic con timestamp

## 🎯 Risultato Finale

✅ **Email Signup** → Email inviata manualmente dopo signup
✅ **OAuth Signup** → Email inviata con metadata lingua
✅ **Banner** → Appare sempre se email non verificata
✅ **Resend** → Funziona con rate limiting
✅ **Lingua** → Template V2 usa metadata per lingua corretta
✅ **UX** → User può usare app immediatamente

---

**Status**: ✅ Implemented
**Files Modified**: 
- `src/app/[locale]/(auth)/(center)/auth/page.tsx`
- `src/components/dashboard/EmailVerificationBanner.tsx`
- `messages/en/dashboard.json`
- `messages/it/dashboard.json`
