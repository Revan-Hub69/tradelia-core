# Guida Setup Aruba SMTP per Contact Form

## 🎯 Cosa Abbiamo Fatto

Abbiamo migrato il contact form da Resend a **Nodemailer + Aruba SMTP** perché:
- ✅ Non richiede modifiche DNS (Resend richiedeva verifica dominio)
- ✅ Usa la tua casella email Aruba esistente
- ✅ Nessun servizio esterno da configurare
- ✅ Soluzione "homemade" semplice

## 📋 Cosa Devi Fare Ora

### 1. Ottieni Credenziali SMTP da Aruba

Le credenziali SMTP sono le stesse della tua casella email `support@tradelia.org`:

- **Host SMTP:** `smtps.aruba.it` (nota la 's' finale - importante!)
- **Porta:** `465` (SSL/TLS)
- **Username:** `support@tradelia.org` (la tua email completa)
- **Password:** La password della casella email Aruba

**⚠️ IMPORTANTE:**
- Il host deve essere `smtps.aruba.it` (con la 's') NON `smtp.aruba.it`
- Lo username deve essere l'email completa, non solo il nome utente
- Se hai 2FA attivo, devi creare una "App Password" nel pannello Aruba

**Nota:** Se non ricordi la password, puoi reimpostarla dal pannello Aruba.

### 2. Aggiungi Environment Variables in Vercel

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il progetto `tradelia`
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi queste 4 variabili:

```bash
# Host SMTP Aruba (IMPORTANTE: con la 's' finale!)
SMTP_HOST=smtps.aruba.it

# Email completa Aruba (username deve essere email completa)
SMTP_USER=support@tradelia.org

# Password casella email Aruba (o App Password se 2FA attivo)
SMTP_PASS=la_tua_password_aruba

# Email di supporto (opzionale, default: support@tradelia.org)
SUPPORT_EMAIL=support@tradelia.org
```

5. Seleziona **Production**, **Preview**, e **Development** per tutte le variabili
6. Clicca **Save**

### 3. Redeploy

Dopo aver aggiunto le variabili:

1. Vai su **Deployments**
2. Clicca sui 3 puntini del deployment più recente
3. Clicca **Redeploy**

Oppure fai un nuovo push su GitHub (trigger automatico).

## 🧪 Test

### Test in Production

1. Vai su `https://tradelia.org/contact`
2. Compila il form di contatto
3. Invia
4. Verifica:
   - ✅ Nessun errore 500 in console
   - ✅ Messaggio di successo visibile
   - ✅ Email arriva a `support@tradelia.org`
   - ✅ Auto-reply arriva all'utente

### Se Non Funziona

1. **Verifica credenziali Aruba:**
   - Prova a fare login su webmail Aruba con le stesse credenziali
   - Se non funziona, reimposta password

2. **Verifica environment variables in Vercel:**
   - Controlla che siano tutte presenti
   - Controlla che non ci siano spazi extra
   - Controlla che `SMTP_HOST` sia esattamente `smtp.aruba.it`

3. **Check logs Vercel:**
   ```bash
   vercel logs --follow
   ```
   Cerca errori tipo:
   - `Email service not configured` → Mancano env vars
   - `Authentication failed` → Password sbagliata
   - `Connection timeout` → Host SMTP sbagliato

4. **Verifica porta SMTP:**
   Se porta 465 non funziona, prova porta 587:
   - Cambia `SMTP_HOST` in Vercel
   - Aggiungi porta nel codice (se necessario)

## 📊 Architettura Finale

```
Contact Form
    ↓
/api/contact (Next.js API Route)
    ↓
Nodemailer
    ↓
Aruba SMTP (smtp.aruba.it:465)
    ↓
2 Email inviate:
  - A support@tradelia.org (notifica)
  - All'utente (conferma)
```

## ✅ Vantaggi di Questa Soluzione

- ✅ **Nessuna modifica DNS** - Non tocca configurazione email Aruba
- ✅ **Nessun servizio esterno** - No Resend, no Brevo, no API key
- ✅ **Usa email esistente** - support@tradelia.org già configurata
- ✅ **Semplice da debuggare** - Tutto in un file API route
- ✅ **Nessun limite esterno** - Solo limiti Aruba (generosi)

## 🚨 Troubleshooting Comune

### Errore: "Email service not configured"
**Causa:** Environment variables mancanti in Vercel  
**Fix:** Aggiungi `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`

### Errore: "Authentication failed"
**Causa:** Password Aruba sbagliata o username non corretto  
**Fix:** 
- Verifica che `SMTP_HOST=smtps.aruba.it` (con la 's')
- Verifica che `SMTP_USER` sia l'email completa: `support@tradelia.org`
- Reimposta password su pannello Aruba
- Se hai 2FA attivo, crea App Password nel pannello Aruba

### Errore: "Connection timeout"
**Causa:** Host SMTP sbagliato o porta bloccata  
**Fix:** 
- Verifica `smtps.aruba.it` (con la 's' finale)
- Verifica porta 465
- Se porta 465 bloccata, prova porta 587 con `secure: false` e `requireTLS: true`

### Email non arriva
**Causa:** Finisce in spam o email Aruba piena  
**Fix:** 
- Controlla spam
- Controlla spazio casella Aruba
- Verifica logs Vercel per conferma invio

---

**Data:** 2026-01-26  
**Status:** ✅ Codice pushato, pronto per configurazione Vercel  
**Next:** Aggiungi credenziali Aruba in Vercel e testa
