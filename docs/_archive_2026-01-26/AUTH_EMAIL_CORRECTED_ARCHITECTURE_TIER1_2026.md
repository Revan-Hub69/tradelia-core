# Auth & Email System - CORRECTED Architecture Tier 1 2026

## ⚠️ CORREZIONE IMPORTANTE

Dopo ulteriori ricerche approfondite, devo **correggere** la mia raccomandazione precedente.

## 🎯 Soluzione Corretta

**Usare ENTRAMBI i servizi, ma con ruoli chiari:**

```
SUPABASE AUTH (con Custom SMTP) → Solo email AUTH
BREVO API (non SMTP) → Email applicative (contact form, notifiche)
```

## 🔍 Perché la Correzione?

### Problema con "Solo Supabase Custom SMTP"

**❌ Limitazione Critica Scoperta:**

Supabase Custom SMTP gestisce **SOLO** le email di autenticazione:
- Signup confirmation
- Password reset  
- Email change
- Magic link

**NON può gestire:**
- ❌ Contact form
- ❌ Support tickets
- ❌ Notifiche custom
- ❌ Email marketing

**Source:** [Supabase Custom SMTP Docs](https://supabase.com/docs/guides/auth/auth-smtp)

### Opzioni per Email Applicative

Per email NON-auth, hai 3 opzioni:

#### Opzione 1: Edge Functions + Resend SDK ⭐
```typescript
// supabase/functions/send-contact-email/index.ts
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  const { name, email, message } = await req.json();
  
  await resend.emails.send({
    from: 'noreply@tradelia.com',
    to: 'support@tradelia.com',
    subject: 'Contact Form',
    html: `<p>${message}</p>`,
  });
});
```

**Pro:**
- ✅ Stesso provider per auth + app emails
- ✅ API key non esposta al client
- ✅ Rate limiting server-side

**Contro:**
- ⚠️ Richiede Edge Functions deployment
- ⚠️ Più codice da scrivere

#### Opzione 2: Brevo API (Attuale) ⭐⭐
```typescript
// Client-side o API route
await fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: {
    'api-key': process.env.BREVO_API_KEY,
  },
  body: JSON.stringify({
    sender: { email: 'noreply@tradelia.com' },
    to: [{ email: 'support@tradelia.com' }],
    subject: 'Contact Form',
    htmlContent: '<p>Message</p>',
  }),
});
```

**Pro:**
- ✅ Già configurato
- ✅ API semplice
- ✅ Free tier generoso (300 email/giorno)
- ✅ Non richiede Edge Functions

**Contro:**
- ⚠️ 2 servizi da gestire (Supabase SMTP + Brevo API)

#### Opzione 3: Database Webhooks + Service
```typescript
// Webhook triggered on INSERT to contact_submissions table
// Calls external service to send email
```

**Pro:**
- ✅ Event-driven
- ✅ Decoupled

**Contro:**
- ⚠️ Più complesso
- ⚠️ Richiede webhook setup

## 🏗️ Architettura Corretta

### Configurazione Raccomandata

```
┌─────────────────────────────────────────────────────────┐
│                    EMAIL ARCHITECTURE                    │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┐  ┌──────────────────────────┐
│   SUPABASE AUTH              │  │   BREVO API              │
│   (Custom SMTP: Resend)      │  │   (Transactional)        │
├──────────────────────────────┤  ├──────────────────────────┤
│ ✅ Signup Confirmation       │  │ ✅ Contact Form          │
│ ✅ Password Reset            │  │ ✅ Support Emails        │
│ ✅ Email Change              │  │ ✅ Notifications         │
│ ✅ Magic Link                │  │ ✅ Custom Emails         │
│ ✅ Email Verification Resend │  │                          │
└──────────────────────────────┘  └──────────────────────────┘
         │                                   │
         ▼                                   ▼
    Resend SMTP                         Brevo API
    (smtp.resend.com)                   (api.brevo.com)
```

### Perché Questa Separazione?

**Supabase Custom SMTP:**
- Gestisce automaticamente le email auth
- Template configurabili in Supabase Dashboard
- Rate limiting gestito da Supabase
- Deliverability migliorata con dominio verificato

**Brevo API:**
- Flessibilità per email custom
- Template management in Brevo Dashboard
- Analytics e tracking
- Free tier: 300 email/giorno

## 📋 Implementation Plan Corretto

### Step 1: Setup Resend per Supabase Auth

1. **Crea account Resend**
   - Vai su [resend.com](https://resend.com)
   - Verifica dominio `tradelia.com`

2. **Ottieni SMTP credentials**
   ```
   Host: smtp.resend.com
   Port: 587 (TLS)
   Username: resend
   Password: re_xxxxx (API key)
   ```

3. **Configure Supabase Custom SMTP**
   - Dashboard > Settings > Auth > SMTP Settings
   - Enable "Custom SMTP"
   - Inserisci credentials Resend
   - Sender: `noreply@tradelia.com`

4. **Upload Email Templates**
   - Upload template bilingue a Supabase
   - Test con preview feature

### Step 2: Mantieni Brevo per Email Applicative

1. **Verifica configurazione Brevo**
   - API key in Vercel: `BREVO_API_KEY`
   - Sender email verificato

2. **Refactor Contact Form**
   - Sposta chiamata Brevo da client a API route
   - Aggiungi rate limiting
   - Aggiungi validazione

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  // Validate input
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Send via Brevo
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: 'Tradelia Contact Form',
        email: 'noreply@tradelia.com',
      },
      to: [{
        email: 'support@tradelia.com',
        name: 'Tradelia Support',
      }],
      replyTo: {
        email: email,
        name: name,
      },
      subject: `[Contact Form] ${subject}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
```

### Step 3: Fix Auth Flow

1. **Disable "Confirm email" in Supabase**
   - Authentication > Providers > Email
   - Toggle OFF "Confirm email"

2. **Remove manual email sending logic**
   - Supabase invia automaticamente con Custom SMTP
   - Rimuovi chiamate manuali a `resend()`

3. **Implement Email Verification Banner**
   - Mostra solo se `user.email_confirmed_at === null`
   - Usa `supabase.auth.resend()` per resend

## 💰 Cost Analysis Corretto

### Scenario: 1,000 utenti/mese + 100 contact form

**Auth Emails (Supabase + Resend SMTP):**
- Signup: 1,000 email
- Password reset: ~50 email
- Email change: ~20 email
- **Totale: ~1,070 email/mese**
- **Costo Resend: $0** (sotto 3,000 email)

**App Emails (Brevo API):**
- Contact form: 100 email
- Support: ~50 email
- **Totale: ~150 email/mese**
- **Costo Brevo: $0** (sotto 300 email/giorno = 9,000/mese)

**Totale Mensile: $0** ✅

### Quando Scalare

**Resend:**
- Free: 3,000 email/mese
- Paid: $20/mese per 50,000 email

**Brevo:**
- Free: 300 email/giorno (9,000/mese)
- Paid: $25/mese per 20,000 email

## 🎯 Vantaggi Architettura Corretta

| Feature | Solo Supabase SMTP | Supabase SMTP + Brevo API |
|---------|-------------------|---------------------------|
| Auth emails | ✅ | ✅ |
| Contact form | ❌ (richiede Edge Functions) | ✅ |
| Custom emails | ❌ (richiede Edge Functions) | ✅ |
| Template management | Supabase Dashboard | Supabase + Brevo |
| Setup complexity | Media | Bassa |
| Cost (1k users) | $0 | $0 |
| Scalability | Buona | Ottima |

## 📝 Configurazione Finale

### Environment Variables

```bash
# Supabase (per auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Brevo (per app emails)
BREVO_API_KEY=xkeysib-xxx
```

### Supabase Dashboard Settings

```
Authentication > Providers > Email:
✅ Allow new users to sign up: ENABLED
✅ Allow manual linking: ENABLED
❌ Confirm email: DISABLED (soft verification)

Settings > Auth > SMTP Settings:
✅ Custom SMTP: ENABLED
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_xxxxx
Sender: noreply@tradelia.com
```

## ✅ Conclusione Corretta

**La soluzione ottimale è:**

1. **Supabase Auth + Resend SMTP** per email auth
2. **Brevo API** per email applicative (contact form, etc.)
3. **Confirm email: DISABLED** (soft verification con banner)

**NON eliminare Brevo**, ma usarlo correttamente:
- ✅ Chiamate da API route (non client)
- ✅ Rate limiting implementato
- ✅ Validazione server-side
- ✅ Error handling robusto

Questa architettura è:
- ✅ Semplice da implementare
- ✅ Economica ($0 per volumi bassi)
- ✅ Scalabile
- ✅ Manutenibile
- ✅ Production-ready

---

*Ricerca corretta: 2026-01-25*  
*Mi scuso per la raccomandazione iniziale errata*
