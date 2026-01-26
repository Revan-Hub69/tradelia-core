# 🗄️ Supabase Database Setup for Contact Form

**Date**: January 26, 2026  
**Purpose**: Configure Supabase PostgreSQL for ticket tracking

---

## 🎯 Quick Fix (Contact Form Works Without Database)

**Good News**: Ho modificato il codice per funzionare SENZA database!

Il contact form ora:
- ✅ Invia email (team + user)
- ✅ Genera ticket ID
- ⚠️ NON salva nel database (se DATABASE_URL manca)
- ✅ Funziona comunque!

**Commit**: Pushed - aspetta 1-2 minuti per il deploy

---

## 📊 Opzione 1: Usa Supabase Database (Raccomandato)

Hai già Supabase configurato, quindi è facile!

### Step 1: Ottieni Connection String

1. Vai su Supabase Dashboard: https://supabase.com/dashboard
2. Seleziona il tuo progetto
3. Vai su Settings → Database
4. Copia la "Connection string" in formato URI
5. Seleziona "Transaction" pooler (non "Session")

**Formato**:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### Step 2: Aggiungi a Vercel

1. Vai su Vercel Dashboard → Settings → Environment Variables
2. Aggiungi:
   - Name: `DATABASE_URL`
   - Value: [la connection string copiata]
   - Environment: Production ✅
3. Click "Save"
4. Redeploy (Vercel → Deployments → Redeploy)

### Step 3: Crea la Tabella

Vai su Supabase Dashboard → SQL Editor e esegui:

```sql
-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  user_locale TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'contact_form',
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  follow_up_sent_at TIMESTAMP WITH TIME ZONE,
  follow_up_count INTEGER DEFAULT 0,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Index for follow-up queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_follow_up 
ON support_tickets(status, created_at, follow_up_sent_at)
WHERE status = 'open' AND follow_up_sent_at IS NULL;

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_email 
ON support_tickets(user_email);
```

### Step 4: Verifica

Dopo il deploy, testa il contact form. Poi controlla su Supabase:

```sql
SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 10;
```

Dovresti vedere i ticket salvati!

---

## 📊 Opzione 2: Continua Senza Database (Temporaneo)

Se vuoi testare subito senza configurare il database:

**Cosa funziona**:
- ✅ Email inviate (team + user)
- ✅ Ticket ID generato
- ✅ Contact form completo

**Cosa NON funziona**:
- ❌ Ticket non salvati nel database
- ❌ Follow-up automatico dopo 24h (cron job)
- ❌ Tracking dei ticket

**Quando usare**: Per test rapidi, poi configura il database.

---

## 🔍 Come Verificare Cosa Sta Usando

Apri nel browser:
```
https://tradelia.org/api/debug/env
```

Guarda `"database": { "url": true/false }`

- **true** = Usa PostgreSQL (Supabase)
- **false** = Usa PGlite (in-memory, non persiste)

---

## ⚠️ Importante

### In Produzione (Vercel)
- PGlite NON funziona bene (memoria limitata, non persiste)
- Usa sempre PostgreSQL (Supabase) in produzione

### In Sviluppo (Locale)
- PGlite va bene per test rapidi
- Oppure usa Supabase anche in locale

---

## 🎯 Raccomandazione

**Per ora**: Il contact form funziona senza database (email vengono inviate)

**Prossimo step**: Aggiungi DATABASE_URL per:
1. Salvare i ticket
2. Abilitare follow-up automatico
3. Tracking completo

**Tempo richiesto**: 5 minuti

---

## 📞 Support

Se hai problemi:
1. Controlla `/api/debug/env` per vedere cosa è configurato
2. Verifica la connection string su Supabase
3. Controlla i log di Vercel per errori

---

**Status**: Contact form funziona SENZA database ✅  
**Next**: Aggiungi DATABASE_URL per tracking completo (opzionale)
