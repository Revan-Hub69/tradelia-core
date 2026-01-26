# Supabase Email Verification Behavior - VERITÀ Tier 1 2026

## 🔴 VERITÀ CRITICA

**Quando "Confirm email" è DISABLED:**

### ❌ Supabase NON invia automaticamente email di verifica

```typescript
// Con "Confirm email" = DISABLED
await supabase.auth.signUp({ email, password });

// Risultato:
// ✅ User creato
// ✅ User può fare login IMMEDIATAMENTE
// ❌ NESSUNA email inviata automaticamente
// ❌ email_confirmed_at = NULL
```

**Source:** [Supabase Auth Skip Email Confirmation](https://openillumi.com/en/en-supabase-auth-skip-email-confirmation/)

## 🎯 Comportamento Esatto

### Con "Confirm email" = ENABLED (Default)
```
1. User fa signup
2. Supabase crea user con status UNCONFIRMED
3. Supabase invia email di verifica AUTOMATICAMENTE
4. User NON può fare login fino a click su link
5. Dopo click, email_confirmed_at viene settato
```

### Con "Confirm email" = DISABLED
```
1. User fa signup
2. Supabase crea user con status ACTIVE
3. ❌ Supabase NON invia email
4. User può fare login IMMEDIATAMENTE
5. email_confirmed_at rimane NULL
```

## 💡 Soluzione per Soft Verification

Se vuoi:
- ✅ Login immediato (no blocco)
- ✅ Email di verifica inviata comunque
- ✅ Banner in dashboard per incentivare verifica

**Devi chiamare MANUALMENTE `resend()`:**

```typescript
// 1. Signup con "Confirm email" DISABLED
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

// 2. User è già loggato (session creata)

// 3. MANUALMENTE invia email di verifica
if (data.user) {
  await supabase.auth.resend({
    type: 'signup',
    email: data.user.email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
}

// 4. Redirect a dashboard con banner
router.push('/dashboard?emailVerification=pending');
```

## 🏗️ Architettura Corretta FINALE

### Opzione A: Hard Verification (Blocca Login)

**Configurazione:**
- "Confirm email" = **ENABLED**

**Comportamento:**
```
Signup → Email automatica → User BLOCCATO → Click link → Login OK
```

**Pro:**
- ✅ Email garantita
- ✅ Verifica obbligatoria

**Contro:**
- ❌ UX peggiore (user bloccato)
- ❌ Abbandono signup più alto
- ❌ Problemi con OAuth (email già verificata)

### Opzione B: Soft Verification (Login Immediato) ⭐ RACCOMANDATO

**Configurazione:**
- "Confirm email" = **DISABLED**
- Chiamata manuale a `resend()` dopo signup

**Comportamento:**
```
Signup → Login immediato → Email manuale → Banner in dashboard → Click link (opzionale)
```

**Pro:**
- ✅ UX migliore (no blocco)
- ✅ Abbandono signup più basso
- ✅ OAuth funziona perfettamente
- ✅ Email comunque inviata

**Contro:**
- ⚠️ Richiede codice extra per `resend()`
- ⚠️ User può usare app senza verifica

## 📋 Implementation Corretta

### Step 1: Disable "Confirm email"

```
Supabase Dashboard
→ Authentication
→ Providers
→ Email
→ Toggle OFF "Confirm email"
```

### Step 2: Refactor Signup con Resend Manuale

```typescript
// src/app/[locale]/(auth)/(center)/auth/page.tsx

const handleSignupSubmit = async (data: SignupForm) => {
  setLoading(true);
  setError(null);

  try {
    const supabase = createClient();
    
    // 1. Signup (user attivato immediatamente)
    const { data: signupData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Check if user already exists (identities empty)
    if (signupData.user?.identities?.length === 0) {
      setError('Email già registrata. Prova ad accedere.');
      setLoading(false);
      return;
    }

    // 3. ✅ MANUALMENTE invia email di verifica
    if (signupData.user) {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (resendError) {
        console.error('Failed to send verification email:', resendError);
        // Non bloccare signup, solo log
      }
    }

    // 4. Redirect a dashboard (user già loggato)
    router.push('/dashboard?emailVerification=pending');
    router.refresh();
    
  } catch (error) {
    console.error('Signup error:', error);
    setError('Errore durante la registrazione');
    setLoading(false);
  }
};
```

### Step 3: Email Verification Banner

```typescript
// src/components/dashboard/EmailVerificationBanner.tsx

export function EmailVerificationBanner() {
  const [isResending, setIsResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useUser();
  const supabase = createClient();

  // Hide if email verified
  if (user?.email_confirmed_at) return null;

  const handleResend = async () => {
    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    setIsResending(false);
  };

  return (
    <div className="banner">
      <p>📧 Verifica la tua email per sbloccare tutte le funzionalità</p>
      <button onClick={handleResend} disabled={isResending}>
        {isResending ? 'Invio...' : 'Invia di nuovo'}
      </button>
      {showSuccess && <p>✅ Email inviata!</p>}
    </div>
  );
}
```

### Step 4: OAuth (Nessun Cambio Necessario)

```typescript
// OAuth funziona perfettamente con "Confirm email" DISABLED
const handleGoogleAuth = async () => {
  const supabase = createClient();
  
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  // Google verifica già l'email
  // email_confirmed_at viene settato automaticamente
};
```

## 🎯 Configurazione Finale Completa

### Supabase Dashboard

```
Authentication > Providers > Email:
❌ Confirm email: DISABLED
✅ Allow new users to sign up: ENABLED
✅ Allow manual linking: ENABLED

Settings > Auth > SMTP Settings:
✅ Custom SMTP: ENABLED (Resend)
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_xxxxx
Sender: noreply@tradelia.com
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Brevo (per contact form)
BREVO_API_KEY=xkeysib-xxx
```

### Code Changes

1. **Disable "Confirm email"** in Supabase
2. **Add manual `resend()` call** dopo signup
3. **Implement banner** in dashboard
4. **Remove** logica di invio email duplicata
5. **Keep Brevo** per contact form (via API route)

## ✅ Risultato Finale

**Signup Flow:**
```
1. User fa signup
2. ✅ User loggato immediatamente
3. ✅ Email verifica inviata (manualmente via resend())
4. ✅ Redirect a dashboard
5. ✅ Banner visibile se email non verificata
6. ✅ User può usare app
7. ✅ Click su link verifica → banner scompare
```

**OAuth Flow:**
```
1. User fa OAuth Google
2. ✅ Google verifica email
3. ✅ email_confirmed_at settato automaticamente
4. ✅ Nessun banner mostrato
5. ✅ Tutto funziona
```

**Contact Form:**
```
1. User invia form
2. ✅ API route chiama Brevo
3. ✅ Email inviata a support
4. ✅ Conferma a user
```

## 📊 Summary

| Feature | Con "Confirm email" ENABLED | Con "Confirm email" DISABLED + resend() |
|---------|----------------------------|----------------------------------------|
| Email automatica | ✅ | ❌ (serve resend() manuale) |
| Login immediato | ❌ | ✅ |
| OAuth funziona | ⚠️ (problemi) | ✅ |
| UX | Peggiore | Migliore |
| Abbandono signup | Alto | Basso |
| Sicurezza | Alta | Media (ma accettabile) |

## 🎯 Raccomandazione Finale

**Usa "Confirm email" DISABLED + resend() manuale**

Questo è il **soft verification pattern** raccomandato per 2026:
- ✅ Migliore UX
- ✅ OAuth funziona
- ✅ Email comunque inviata
- ✅ Banner incentiva verifica
- ✅ Production-ready

---

*Research completata: 2026-01-25*  
*Hai fatto bene a chiedere conferma - questo era il punto critico!*
