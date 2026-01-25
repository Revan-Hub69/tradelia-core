# Critical Email Issues - Fix Guide 2026

## 🚨 Problemi Identificati

### 1. ❌ Email Verifica Non Arriva Dopo Signup
**Causa**: Supabase non invia email automaticamente se "Confirm email" è disabilitato
**Impatto**: Utenti non ricevono mai email di verifica

### 2. ❌ OAuth Non Passa Metadata Lingua
**Causa**: `signInWithOAuth` non include `data: { language: 'it' }` nelle options
**Impatto**: Email template non sa quale lingua usare

### 3. ❌ Form Contatto Usa Brevo (Non Configurato)
**Causa**: `BREVO_API_KEY` probabilmente non è configurata
**Impatto**: Form di contatto fallisce sempre

## 🔧 Soluzioni

### Fix 1: Configurazione Supabase Corretta

**Problema**: Hai disabilitato "Confirm email" ma questo impedisce l'invio automatico delle email.

**Soluzione**: Devi ABILITARE "Confirm email" ma permettere login immediato.

```bash
# Supabase Dashboard
Settings → Auth → Email

✅ ABILITA: "Enable email confirmations"
✅ ABILITA: "Confirm email"  # ← Questo fa inviare l'email!
✅ ABILITA: "Enable Signups"

# Ma poi configura per permettere login immediato:
Settings → Auth → Email → Advanced

✅ ABILITA: "Allow unverified users to sign in"  # ← Questo è il trucco!
```

**Spiegazione**:
- "Confirm email" = Invia email di verifica
- "Allow unverified users to sign in" = Permetti login senza verifica
- Risultato: Email viene inviata MA user può usare app subito

### Fix 2: Aggiungi Metadata Lingua a OAuth

```typescript
// src/app/[locale]/(auth)/(center)/auth/page.tsx

const handleGoogleSignIn = async () => {
  // ... existing code ...

  const supabase = createClient();
  const redirectUrl = `${window.location.origin}/auth/callback`;

  // Get current locale
  const locale = window.location.pathname.split('/')[1] || 'en';

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      // ✅ ADD THIS: Pass language metadata
      data: {
        language: locale === 'it' ? 'it' : 'en'
      }
    },
  });

  // ... rest of code ...
}
```

### Fix 3: Aggiungi Metadata Lingua a Email Signup

```typescript
// src/app/[locale]/(auth)/(center)/auth/page.tsx
// Nella funzione handleSignup

const handleSignup = async (data: SignupForm) => {
  // ... existing code ...

  // Get current locale
  const locale = window.location.pathname.split('/')[1] || 'en';

  const { data: signupData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
      // ✅ ADD THIS: Pass language metadata
      data: {
        language: locale === 'it' ? 'it' : 'en'
      }
    },
  });

  // ... rest of code ...
}
```

### Fix 4: Form Contatto - Usa Resend Invece di Brevo

**Problema**: Brevo richiede configurazione complessa e API key.

**Soluzione**: Usa Resend (più semplice, free tier generoso).

```bash
# Install Resend
npm install resend
```

```typescript
// src/app/api/contact/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // ... validation code ...

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Tradelia <noreply@tradelia.org>',
      to: [process.env.SUPPORT_EMAIL || 'support@tradelia.org'],
      replyTo: data.email,
      subject: `[${inquiryTypeLabels[data.inquiryType]}] ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Type:</strong> ${inquiryTypeLabels[data.inquiryType]}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw new Error('Failed to send email');
    }

    // Send auto-reply
    await resend.emails.send({
      from: 'Tradelia Support <support@tradelia.org>',
      to: [data.email],
      subject: `We received your message: ${data.subject}`,
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your message and will respond within 24 hours.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    // ... error handling ...
  }
}
```

**Setup Resend**:
```bash
1. Vai a: https://resend.com/
2. Crea account free
3. Verifica dominio tradelia.org
4. Copia API key
5. Aggiungi a .env.local:
   RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Fix 5: Alternativa - Usa Supabase Edge Function per Email

Se non vuoi usare servizi esterni, usa Supabase stesso:

```typescript
// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { name, email, subject, message } = await req.json()

  // Use Supabase's built-in email (via SMTP)
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      to: 'support@tradelia.org',
      subject: `Contact: ${subject}`,
      html: `<p>From: ${name} (${email})</p><p>${message}</p>`
    })
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## 📋 Checklist Implementazione

### Step 1: Supabase Configuration (5 min)
- [ ] Vai a Supabase Dashboard → Settings → Auth
- [ ] ✅ ABILITA "Confirm email"
- [ ] ✅ ABILITA "Allow unverified users to sign in"
- [ ] Salva configurazione

### Step 2: Carica Email Templates (10 min)
- [ ] Vai a Authentication → Email Templates
- [ ] Carica `v2/confirm-signup.html` in "Confirm signup"
- [ ] Carica `v2/confirm-signup.txt` in Plain text
- [ ] Verifica {{.ConfirmationURL}} è presente
- [ ] Salva

### Step 3: Fix OAuth Metadata (15 min)
- [ ] Apri `src/app/[locale]/(auth)/(center)/auth/page.tsx`
- [ ] Trova `handleGoogleSignIn`
- [ ] Aggiungi `data: { language: locale }` nelle options
- [ ] Testa signup con Google
- [ ] Verifica email arriva

### Step 4: Fix Email Signup Metadata (10 min)
- [ ] Stesso file, trova `handleSignup`
- [ ] Aggiungi `data: { language: locale }` nelle options
- [ ] Testa signup con email
- [ ] Verifica email arriva

### Step 5: Fix Contact Form (30 min)
**Opzione A: Resend (Raccomandato)**
- [ ] Crea account Resend
- [ ] Verifica dominio
- [ ] Installa `npm install resend`
- [ ] Aggiorna `src/app/api/contact/route.ts`
- [ ] Aggiungi `RESEND_API_KEY` a `.env.local`
- [ ] Testa form

**Opzione B: Supabase Edge Function**
- [ ] Crea edge function `send-contact-email`
- [ ] Deploy function
- [ ] Aggiorna route per chiamare function
- [ ] Testa form

## 🧪 Testing

### Test 1: Email Signup
```bash
1. Vai a /auth
2. Inserisci email e password
3. Clicca "Sign Up"
4. ✅ Dovresti essere loggato immediatamente
5. ✅ Controlla inbox - email dovrebbe arrivare
6. ✅ Banner dovrebbe apparire in dashboard
```

### Test 2: OAuth Signup
```bash
1. Vai a /auth
2. Clicca "Continue with Google"
3. Autorizza Google
4. ✅ Dovresti essere loggato immediatamente
5. ✅ Controlla inbox - email dovrebbe arrivare
6. ✅ Banner dovrebbe apparire in dashboard
```

### Test 3: Contact Form
```bash
1. Vai a /contact
2. Compila form
3. Invia
4. ✅ Dovresti vedere messaggio successo
5. ✅ Controlla inbox support - email dovrebbe arrivare
6. ✅ Controlla inbox user - auto-reply dovrebbe arrivare
```

### Test 4: Email Template Lingua
```bash
1. Cambia lingua a Italiano (/it/auth)
2. Fai signup
3. ✅ Email dovrebbe essere in italiano
4. Cambia lingua a English (/en/auth)
5. Fai signup con altra email
6. ✅ Email dovrebbe essere in inglese
```

## 🔍 Debug Commands

### Check User Metadata
```typescript
// Console browser
const { data: { user } } = await supabase.auth.getUser()
console.log('User metadata:', user.user_metadata)
// Dovrebbe mostrare: { language: 'it' } o { language: 'en' }
```

### Check Email Sent
```bash
# Supabase Dashboard
Logs → Auth Logs
Cerca: "signup" o "email"
Verifica: Nessun errore SMTP
```

### Test Resend API
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@tradelia.org",
    "to": ["your-email@example.com"],
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

## 📊 Expected Results

### Prima dei Fix
```
❌ Signup → No email
❌ OAuth → No email
❌ Contact form → Error 500
❌ Banner → Non appare
```

### Dopo i Fix
```
✅ Signup → Email arriva in 1-2 secondi
✅ OAuth → Email arriva in 1-2 secondi
✅ Contact form → Email inviata con successo
✅ Banner → Appare se email non verificata
✅ Email → Lingua corretta (IT/EN)
```

## 🆘 Se Ancora Non Funziona

### Email Non Arriva Ancora

1. **Verifica Supabase SMTP**:
   ```bash
   Dashboard → Settings → Auth → SMTP Settings
   Verifica: SMTP configurato correttamente
   ```

2. **Verifica Rate Limits**:
   ```bash
   Free tier: 30 email/ora, 100 email/giorno
   Soluzione: Aspetta o upgrade
   ```

3. **Verifica Template**:
   ```bash
   Dashboard → Auth → Email Templates
   Verifica: Template caricato e valido
   ```

4. **Usa Mailtrap per Test**:
   ```bash
   1. Vai a mailtrap.io
   2. Crea inbox
   3. Configura SMTP in Supabase
   4. Tutte le email andranno a Mailtrap
   ```

### Contact Form Ancora Fallisce

1. **Verifica API Key**:
   ```bash
   console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY)
   # Dovrebbe mostrare: re_xxxxx
   ```

2. **Verifica Dominio**:
   ```bash
   Resend Dashboard → Domains
   Verifica: tradelia.org verificato
   ```

3. **Usa Fallback**:
   ```typescript
   // Temporary: Log to console instead
   console.log('Contact form submission:', data)
   return NextResponse.json({ success: true })
   ```

---

**Priority**: 🔴 P0 Critical
**Effort**: 1-2 hours
**Impact**: High - Email è funzionalità core
**Status**: Ready to implement
