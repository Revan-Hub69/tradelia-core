# Email Verification Debug Guide 2026

## 🔍 Problema: Email Non Arriva

### Step-by-Step Debug Process

## 1️⃣ Verifica Configurazione Supabase

### A. Controlla Email Provider Settings

```bash
# Vai su Supabase Dashboard
1. Apri: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Vai a: Settings → Auth → Email
3. Verifica:
   ☐ "Enable email confirmations" è ABILITATO
   ☐ "Confirm email" è DISABILITATO (per optional verification)
   ☐ SMTP settings configurati (se custom)
```

### B. Verifica Email Templates

```bash
# Supabase Dashboard
1. Vai a: Authentication → Email Templates
2. Clicca: "Confirm signup"
3. Verifica:
   ☐ Template HTML esiste
   ☐ Template Plain Text esiste
   ☐ Subject line è impostato
   ☐ {{.ConfirmationURL}} è presente nel template
```

**Se template mancante**: Carica da `tradelia/supabase/email-templates/v2/confirm-signup.html`

## 2️⃣ Test Manuale Invio Email

### Test 1: Console Browser

```typescript
// Apri Console nel browser (F12)
// Copia e incolla questo codice:

const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

const { data, error } = await supabase.auth.resend({
  type: 'signup',
  email: 'tua-email@example.com'
})

console.log('Result:', { data, error })
```

**Risultati Possibili**:

✅ **Success**:
```json
{
  "data": {},
  "error": null
}
```
→ Email inviata! Controlla inbox/spam

❌ **Error: Rate Limit**:
```json
{
  "error": {
    "message": "For security purposes, you can only request this once every 60 seconds"
  }
}
```
→ Aspetta 60 secondi e riprova

❌ **Error: Email Already Confirmed**:
```json
{
  "error": {
    "message": "Email already confirmed"
  }
}
```
→ Email già verificata! Banner non dovrebbe apparire

❌ **Error: User Not Found**:
```json
{
  "error": {
    "message": "User not found"
  }
}
```
→ Email non registrata, fai signup prima

### Test 2: Supabase Dashboard

```bash
1. Vai a: Authentication → Users
2. Trova il tuo utente
3. Clicca sui 3 puntini → "Send verification email"
4. Controlla inbox
```

## 3️⃣ Controlla Logs Supabase

### A. Auth Logs

```bash
# Supabase Dashboard
1. Vai a: Logs → Auth Logs
2. Filtra per: "resend" o "signup"
3. Cerca errori recenti
```

**Errori Comuni**:

```
❌ "SMTP connection failed"
→ SMTP non configurato o credenziali sbagliate

❌ "Rate limit exceeded"
→ Troppi tentativi, aspetta

❌ "Template not found"
→ Template email non caricato

❌ "Invalid email address"
→ Email formato sbagliato
```

### B. Edge Function Logs (se usi custom email)

```bash
# Se hai edge function per email
1. Vai a: Edge Functions → Logs
2. Cerca: "send-email" o "verification"
3. Controlla errori
```

## 4️⃣ Verifica Email Provider

### Gmail

```bash
1. Controlla: Inbox
2. Controlla: Spam/Junk
3. Controlla: Promotions tab
4. Controlla: All Mail
5. Cerca: "from:noreply@" o "Tradelia"
```

### Outlook/Hotmail

```bash
1. Controlla: Inbox
2. Controlla: Junk Email
3. Controlla: Deleted Items (a volte finisce lì)
4. Cerca: "Tradelia" o "verify"
```

### Custom Domain

```bash
# Verifica MX records
1. Vai a: https://mxtoolbox.com/
2. Inserisci: tuo-dominio.com
3. Verifica: MX records esistono e sono validi
```

## 5️⃣ Verifica Rate Limiting

### Supabase Rate Limits (Free Tier)

```
Email per ora: 30
Email per giorno: 100
Resend cooldown: 60 secondi
```

**Test**:
```typescript
// Conta quante email hai inviato oggi
// Supabase Dashboard → Authentication → Users
// Guarda "Last Sign In" timestamps
```

## 6️⃣ Verifica Stato Utente

### Check User Email Confirmation Status

```typescript
// Console browser
const { data: { user } } = await supabase.auth.getUser()

console.log({
  email: user.email,
  email_confirmed_at: user.email_confirmed_at,
  created_at: user.created_at
})
```

**Risultati**:

```javascript
// ✅ Email NON verificata (banner dovrebbe apparire)
{
  email: "user@example.com",
  email_confirmed_at: null,  // ← NULL = non verificata
  created_at: "2026-01-25T..."
}

// ❌ Email GIÀ verificata (banner non appare)
{
  email: "user@example.com",
  email_confirmed_at: "2026-01-25T10:30:00Z",  // ← Ha timestamp
  created_at: "2026-01-25T10:00:00Z"
}
```

## 7️⃣ Test Email Delivery

### Usa Email Test Service

```bash
# Opzione 1: Mailtrap (per development)
1. Vai a: https://mailtrap.io/
2. Crea account free
3. Configura SMTP in Supabase con credenziali Mailtrap
4. Tutte le email andranno a Mailtrap inbox

# Opzione 2: Mail-Tester
1. Vai a: https://www.mail-tester.com/
2. Copia l'email temporanea
3. Usa quella per signup
4. Controlla score e deliverability
```

## 8️⃣ Verifica SMTP Configuration

### Se Usi Custom SMTP

```bash
# Supabase Dashboard → Settings → Auth → SMTP Settings

Verifica:
☐ SMTP Host corretto
☐ SMTP Port corretto (587 per TLS, 465 per SSL)
☐ Username corretto
☐ Password corretta
☐ From email valido
☐ TLS/SSL abilitato
```

**Test SMTP**:
```bash
# Usa telnet per testare connessione
telnet smtp.gmail.com 587

# Oppure usa online tool
https://www.smtper.net/
```

## 9️⃣ Common Issues & Solutions

### Issue 1: "Email sent" ma non arriva

**Possibili Cause**:
1. Email in spam/junk
2. Email provider blocca mittente
3. SMTP rate limit
4. Template malformato

**Soluzioni**:
```bash
1. Aggiungi noreply@supabase.co a contatti
2. Controlla SPF/DKIM records
3. Aspetta e riprova
4. Verifica template HTML è valido
```

### Issue 2: Rate Limit Error

**Soluzione**:
```typescript
// Aggiungi cooldown UI
const [canResend, setCanResend] = useState(true)
const [countdown, setCountdown] = useState(0)

const handleResend = async () => {
  if (!canResend) return
  
  // Send email...
  
  // Start 60s cooldown
  setCanResend(false)
  setCountdown(60)
  
  const interval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(interval)
        setCanResend(true)
        return 0
      }
      return prev - 1
    })
  }, 1000)
}

// In UI:
<Button disabled={!canResend}>
  {canResend ? 'Resend' : `Wait ${countdown}s`}
</Button>
```

### Issue 3: Template Non Caricato

**Soluzione**:
```bash
1. Vai a: tradelia/supabase/email-templates/v2/
2. Apri: confirm-signup.html
3. Copia TUTTO il contenuto
4. Vai a: Supabase Dashboard → Auth → Email Templates
5. Clicca: "Confirm signup"
6. Incolla in: "Message (HTML)"
7. Apri: confirm-signup.txt
8. Copia contenuto
9. Incolla in: "Message (Plain text)"
10. Save
```

### Issue 4: Wrong Redirect URL

**Problema**: Link in email porta a URL sbagliato

**Soluzione**:
```typescript
// Verifica emailRedirectTo
const { error } = await supabase.auth.resend({
  type: 'signup',
  email: email,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`
    // ✅ Corretto: https://tradelia.app/dashboard
    // ❌ Sbagliato: /dashboard (relativo)
    // ❌ Sbagliato: http://localhost:3000/dashboard (in prod)
  }
})
```

## 🔟 Emergency Workaround

### Se Email Proprio Non Arriva

**Opzione 1: Verifica Manuale da Dashboard**
```bash
1. Supabase Dashboard → Authentication → Users
2. Trova utente
3. Clicca 3 puntini → "Confirm email"
4. Email è ora verificata manualmente
```

**Opzione 2: Disabilita Verifica Temporaneamente**
```bash
# Solo per development/testing!
1. Supabase Dashboard → Settings → Auth
2. Providers → Email
3. ☐ Disabilita "Enable email confirmations"
4. Tutti gli utenti sono auto-verificati
```

**Opzione 3: Usa Magic Link Invece**
```typescript
// Alternative: passwordless login
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`
  }
})
// User riceve link per login diretto
```

## 📊 Checklist Completa

### Pre-Flight Checks
- [ ] Supabase email confirmations abilitato
- [ ] Email template caricato
- [ ] SMTP configurato (se custom)
- [ ] User esiste nel database
- [ ] User email NON già verificata

### During Test
- [ ] Console browser aperta (F12)
- [ ] Network tab aperta
- [ ] Supabase logs aperti
- [ ] Email inbox aperta

### Post-Test
- [ ] Controlla console per errori
- [ ] Controlla network per API calls
- [ ] Controlla Supabase logs
- [ ] Controlla spam/junk
- [ ] Aspetta 2-3 minuti (delay possibile)

## 🆘 Still Not Working?

### Contact Support

```bash
# Supabase Support
1. Vai a: https://supabase.com/dashboard/support
2. Crea ticket con:
   - Project ID
   - User email
   - Timestamp del tentativo
   - Screenshot errori
   - Logs da console
```

### Community Help

```bash
# Supabase Discord
https://discord.supabase.com/

# Stack Overflow
Tag: [supabase] [email-verification]
```

---

**Tip**: Il 90% dei problemi è:
1. Template non caricato (30%)
2. Email in spam (25%)
3. Rate limiting (20%)
4. SMTP non configurato (15%)
5. Altro (10%)

Inizia sempre dai primi 3!
