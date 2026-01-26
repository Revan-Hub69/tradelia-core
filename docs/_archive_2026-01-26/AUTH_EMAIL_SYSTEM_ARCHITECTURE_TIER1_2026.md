# Auth & Email System Architecture - Tier 1 Research 2026

## 🎯 Executive Summary

Dopo ricerca approfondita su Supabase Auth, transactional email services e best practices 2026, emerge una **architettura chiara e semplice** che risolve tutti i problemi attuali.

### ✅ Soluzione Raccomandata

**NON usare Brevo per niente. Usare solo Supabase con Custom SMTP.**

## 🔍 Ricerca Findings

### 1. Supabase Built-in Email Service

**Limitazioni Critiche:**
- ⚠️ **2 email/ora** (aggiornato da 4 a 2 nel Oct 2023)
- ⚠️ Solo per testing/development
- ⚠️ Best-effort delivery (non garantito)
- ⚠️ Non adatto per production

**Source:** [Supabase Rate Limits Docs](https://supabase.com/docs/guides/auth/rate-limits)

### 2. Custom SMTP con Supabase

**Vantaggi:**
- ✅ **30 email/ora** di default (15x più del built-in)
- ✅ Rate limit configurabile
- ✅ Deliverability garantita (SPF, DKIM, DMARC)
- ✅ **Gestisce TUTTE le email** (auth + transactional)
- ✅ Un solo servizio da configurare

**Providers Raccomandati (in ordine):**

1. **Resend** (⭐ BEST CHOICE)
   - Developer-friendly
   - Pricing: $0/mese fino a 3,000 email, poi $20/mese
   - Setup: 5 minuti
   - React Email support
   - Ottima deliverability

2. **AWS SES**
   - Più economico ($0.10 per 1,000 email)
   - Scalabile
   - Richiede più setup (SPF, DKIM, domain verification)

3. **Postmark**
   - Specializzato in transactional
   - Ottima deliverability
   - Più costoso ($15/mese per 10,000 email)

**Source:** 
- [Supabase Custom SMTP Guide](https://supabase.com/docs/guides/auth/auth-smtp)
- [Transactional Email Services Comparison 2026](https://bloggingwizard.com/transactional-email-services/)

### 3. Email Verification Best Practices

**Confirm Email Setting:**

**❌ ENABLED (Hard Verification):**
- Blocca utente fino a verifica
- Peggiore UX
- Aumenta abbandono signup
- Problemi con OAuth (email già verificata da provider)

**✅ DISABLED (Soft Verification):**
- Login immediato
- Email inviata comunque
- Banner in dashboard per incentivare verifica
- Migliore UX
- **Raccomandato per 2026**

**Source:** [Supabase Password Auth Docs](https://supabase.com/docs/guides/auth/passwords)

### 4. OAuth + Email Verification

**Problema Identificato:**
- OAuth providers (Google, GitHub) verificano già l'email
- Se "Confirm email" è ENABLED, Supabase può bloccare OAuth users
- **Soluzione:** Disabilitare "Confirm email" e usare soft verification

### 5. Resend API per Email Verification

**Supabase fornisce `auth.resend()` API:**

```typescript
const { error } = await supabase.auth.resend({
  type: 'signup',
  email: user.email,
  options: {
    emailRedirectTo: 'https://example.com/dashboard',
  },
});
```

**Rate Limits:**
- 60 secondi tra richieste dello stesso utente
- Previene spam

**Source:** [Supabase Rate Limits](https://supabase.com/docs/guides/auth/rate-limits)

## 🏗️ Architettura Raccomandata

### Configurazione Semplificata

```
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE AUTH                         │
│                  (con Custom SMTP)                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ✅ Signup Confirmation                                 │
│  ✅ Password Reset                                      │
│  ✅ Email Change                                        │
│  ✅ Magic Link                                          │
│  ✅ Email Verification Resend                           │
│  ✅ Contact Form (via Edge Function)                    │
│  ✅ Support Emails (via Edge Function)                  │
│  ✅ Notifications (via Edge Function)                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   RESEND SMTP         │
              │   (Custom SMTP)       │
              └───────────────────────┘
```

### Perché NON Brevo?

**Problemi con Brevo:**
- ❌ Aggiunge complessità (2 servizi invece di 1)
- ❌ Richiede API key separata
- ❌ Richiede gestione rate limiting separata
- ❌ Richiede template duplicati
- ❌ Più punti di failure
- ❌ Più costoso (Brevo + Supabase SMTP)

**Con Custom SMTP:**
- ✅ Un solo servizio (Resend)
- ✅ Una sola configurazione
- ✅ Template centralizzati in Supabase
- ✅ Rate limiting gestito da Supabase
- ✅ Meno codice da mantenere
- ✅ Più economico

## 📋 Implementation Plan

### Step 1: Setup Resend

1. Crea account su [Resend](https://resend.com)
2. Verifica dominio (tradelia.com)
3. Ottieni SMTP credentials:
   - Host: `smtp.resend.com`
   - Port: `587` (TLS) o `465` (SSL)
   - Username: `resend`
   - Password: `re_xxxxx` (API key)

### Step 2: Configure Supabase Custom SMTP

1. Vai su Supabase Dashboard
2. Settings > Auth > SMTP Settings
3. Enable "Custom SMTP"
4. Inserisci Resend credentials:
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: re_xxxxx
   Sender email: noreply@tradelia.com
   Sender name: Tradelia
   ```
5. Test connection

### Step 3: Configure Auth Settings

1. Authentication > Providers > Email
2. **Disable "Confirm email"** ✅
3. Enable "Allow new users to sign up"
4. Enable "Allow manual linking"

### Step 4: Upload Email Templates

1. Upload bilingual templates a Supabase:
   - `confirm-signup.html` (IT/EN)
   - `reset-password.html` (IT/EN)
   - `change-email.html` (IT/EN)
   - `magic-link.html` (IT/EN)

### Step 5: Implement Soft Verification

1. Rimuovi logica manuale di invio email da auth page
2. Usa `auth.resend()` per resend verification
3. Implementa banner in dashboard
4. Aggiungi rate limiting UI feedback

### Step 6: Contact Form via Edge Function

**Invece di chiamare Brevo direttamente dal client:**

```typescript
// Edge Function: /functions/send-contact-email/index.ts
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  const { name, email, subject, message } = await req.json();

  const { data, error } = await resend.emails.send({
    from: 'noreply@tradelia.com',
    to: 'support@tradelia.com',
    replyTo: email,
    subject: `[Contact Form] ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
```

**Vantaggi:**
- ✅ API key non esposta al client
- ✅ Rate limiting server-side
- ✅ Validazione server-side
- ✅ Stesso provider (Resend) per tutto

## 💰 Cost Analysis

### Scenario: 1,000 utenti/mese

**Opzione 1: Supabase Built-in (❌ NON PRODUCTION)**
- Costo: $0
- Limite: 2 email/ora = ~1,460 email/mese
- ❌ Insufficiente per 1,000 utenti

**Opzione 2: Supabase + Brevo (❌ COMPLESSO)**
- Supabase: $0 (built-in)
- Brevo: $25/mese (20,000 email)
- Totale: $25/mese
- ❌ 2 servizi da gestire

**Opzione 3: Supabase + Resend Custom SMTP (✅ RACCOMANDATO)**
- Resend: $0/mese (fino a 3,000 email)
- Totale: $0/mese
- ✅ 1 solo servizio
- ✅ Scalabile (poi $20/mese per 50,000 email)

**Opzione 4: Supabase + AWS SES (✅ ALTERNATIVA)**
- AWS SES: ~$0.10 per 1,000 email
- Totale: ~$0.10/mese
- ✅ Più economico per volumi alti
- ❌ Setup più complesso

## 🎯 Recommended Solution

### ⭐ FINAL ARCHITECTURE

```typescript
// .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

// NO BREVO_API_KEY needed! ✅
```

### Configuration

**Supabase Dashboard:**
1. Custom SMTP: Resend
2. Confirm email: DISABLED
3. Email templates: Uploaded (bilingual)

**Code:**
```typescript
// ✅ Signup (email sent automatically by Supabase)
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

// ✅ Resend verification (uses Supabase resend API)
const { error } = await supabase.auth.resend({
  type: 'signup',
  email,
});

// ✅ Contact form (via Edge Function with Resend SDK)
const response = await fetch('/functions/v1/send-contact-email', {
  method: 'POST',
  body: JSON.stringify({ name, email, subject, message }),
});
```

## 📊 Benefits Summary

| Feature | Current (Supabase + Brevo) | Recommended (Supabase + Resend SMTP) |
|---------|---------------------------|--------------------------------------|
| Services to manage | 2 | 1 |
| API keys | 2 | 1 (in Supabase) |
| Email templates | Duplicated | Centralized |
| Rate limiting | 2 systems | 1 system |
| Cost (1k users) | $25/mo | $0/mo |
| Setup complexity | High | Low |
| Maintenance | High | Low |
| Deliverability | Good | Excellent |

## 🚀 Migration Steps

### Phase 1: Setup Resend (30 min)
1. Create Resend account
2. Verify domain
3. Get SMTP credentials

### Phase 2: Configure Supabase (15 min)
1. Add Custom SMTP in Supabase
2. Test email sending
3. Disable "Confirm email"

### Phase 3: Update Code (2 hours)
1. Remove Brevo API calls
2. Remove manual email sending logic
3. Use `auth.resend()` for verification
4. Create Edge Function for contact form

### Phase 4: Test (1 hour)
1. Test signup flow
2. Test OAuth flow
3. Test email verification resend
4. Test contact form
5. Test all email templates

### Phase 5: Deploy (30 min)
1. Update environment variables
2. Deploy Edge Functions
3. Monitor email delivery

**Total Time: ~4 hours**

## 📚 References

1. [Supabase Custom SMTP Guide](https://supabase.com/docs/guides/auth/auth-smtp)
2. [Supabase Rate Limits](https://supabase.com/docs/guides/auth/rate-limits)
3. [Supabase Password Auth](https://supabase.com/docs/guides/auth/passwords)
4. [Resend Documentation](https://resend.com/docs)
5. [Transactional Email Services 2026](https://bloggingwizard.com/transactional-email-services/)
6. [Email Verification Best Practices](https://www.restack.io/docs/supabase-knowledge-supabase-email-verification)

## ✅ Conclusion

**La soluzione più semplice, economica e manutenibile è:**

1. **Supabase Auth con Custom SMTP (Resend)**
2. **Confirm email: DISABLED** (soft verification)
3. **Tutti i tipi di email** gestiti da Supabase + Resend
4. **Contact form** via Edge Function (non client-side)

**Elimina completamente Brevo dalla stack.**

---

*Research completed: 2026-01-25*  
*Sources: Supabase Docs, Resend Docs, Industry Best Practices 2026*
