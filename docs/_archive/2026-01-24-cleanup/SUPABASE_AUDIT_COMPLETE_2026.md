# Supabase Configuration Audit & Fixes 2026

## 🚨 **Problema Attuale**
Errore persistente: `Error sending confirmation email` anche con Brevo configurato.

## 🔍 **Checklist Completa Supabase**

### **1. Authentication Settings**
```
Dashboard → Authentication → Settings

✅ VERIFICARE:
- Enable email confirmations: ✅ (se vuoi conferma email)
- Confirm email change: ✅ 
- Enable phone confirmations: ❌ (non necessario)
- Secure email change: ✅
- Double confirm email change: ❌ (troppo restrittivo)
```

### **2. URL Configuration**
```
Dashboard → Authentication → URL Configuration

✅ DEVE ESSERE:
Site URL: https://tradelia.org
Redirect URLs:
- https://tradelia.org/auth/callback
- http://localhost:3000/auth/callback
- https://tradelia.org/auth/sync
- http://localhost:3000/auth/sync
```

### **3. Email Templates**
```
Dashboard → Authentication → Email Templates

✅ VERIFICARE TUTTI I TEMPLATE:
- Confirm signup
- Invite user  
- Magic link
- Change email address
- Reset password

PROBLEMA COMUNE: Template corrotti o con variabili mancanti
```

### **4. SMTP Settings (Brevo)**
```
Dashboard → Authentication → Settings → SMTP Settings

✅ CONFIGURAZIONE BREVO:
SMTP Host: smtp-relay.brevo.com
SMTP Port: 587
SMTP User: [il tuo email Brevo]
SMTP Pass: [la tua SMTP key Brevo]
SMTP Admin Email: [email mittente]
```

### **5. Rate Limiting**
```
Dashboard → Authentication → Rate Limits

✅ VERIFICARE:
- Email signup: Non troppo restrittivo
- SMS signup: Disabilitato se non usi SMS
- Email change: Ragionevole
- Password reset: Ragionevole
```

### **6. Providers Configuration**
```
Dashboard → Authentication → Providers

✅ GOOGLE OAUTH:
- Enabled: ✅
- Client ID: [Google Client ID]
- Client Secret: [Google Client Secret]
- Redirect URL: https://higkhlfjfhlecbtfnznx.supabase.co/auth/v1/callback

✅ EMAIL:
- Enabled: ✅
- Confirm email: ✅ (se vuoi conferma)
```

## 🔧 **Possibili Cause dell'Errore**

### **Causa 1: Template Email Corrotti**
```sql
-- Controlla i template nel dashboard
-- Se sono vuoti o hanno errori di sintassi, ricreali
```

### **Causa 2: Brevo Non Collegato Correttamente**
```
Verifica in Brevo Dashboard:
1. SMTP è abilitato?
2. Le credenziali sono corrette?
3. Il dominio è verificato?
4. Ci sono limiti di invio?
```

### **Causa 3: Variabili Ambiente Mancanti**
```bash
# Verifica che Supabase abbia accesso alle variabili Brevo
# Potrebbero essere configurate solo su Vercel ma non su Supabase
```

### **Causa 4: Dominio Non Verificato**
```
In Brevo:
1. Vai a Senders & IP
2. Verifica che tradelia.org sia verificato
3. Aggiungi record DNS se necessario
```

## 🚀 **Soluzioni Immediate**

### **Soluzione 1: Disabilita Temporaneamente Email Confirmation**
```
Dashboard → Authentication → Settings
❌ Disabilita "Enable email confirmations"

Questo permette signup immediato senza email.
OAuth continuerà a funzionare normalmente.
```

### **Soluzione 2: Reset Template Email**
```
Dashboard → Authentication → Email Templates
1. Seleziona "Confirm signup"
2. Clicca "Reset to default"
3. Salva
4. Ripeti per tutti i template
```

### **Soluzione 3: Test con Email Diverso**
```
Prova signup con:
- Gmail
- Outlook  
- Email temporanea

Se funziona con alcuni provider ma non altri,
il problema è nella configurazione Brevo.
```

## 🔧 **Fix nel Codice**

### **1. Migliora Error Handling**
```typescript
// Gestione più specifica degli errori email
if (signUpError.message.includes('Error sending confirmation email')) {
  if (signUpError.message.includes('SMTP')) {
    setError('Problema configurazione email. Usa Google per registrarti.');
  } else if (signUpError.message.includes('template')) {
    setError('Template email non valido. Contatta il supporto.');
  } else {
    setError('Problema invio email. Prova con Google OAuth.');
  }
}
```

### **2. Fallback a OAuth**
```typescript
// Se email signup fallisce, suggerisci OAuth
const handleEmailSignupError = () => {
  setError('Problema con registrazione email. Prova con Google:');
  // Mostra solo il bottone Google
  setShowEmailForm(false);
};
```

### **3. Skip Email Confirmation in Development**
```typescript
const isDevelopment = process.env.NODE_ENV === 'development';

const signUpOptions = {
  emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
  ...(isDevelopment && { 
    // In development, skip email confirmation
    data: { email_confirm: false }
  })
};
```

## 📊 **Test Plan**

### **Test 1: OAuth Google**
```
1. Vai su https://tradelia.org/auth
2. Clicca "Continue with Google"
3. Dovrebbe funzionare senza problemi
```

### **Test 2: Email Signup (dopo fix)**
```
1. Prova con email temporanea
2. Controlla se arriva email di conferma
3. Se non arriva, problema è in Brevo/Supabase
```

### **Test 3: Password Reset**
```
1. Vai su "Forgot password"
2. Inserisci email
3. Controlla se arriva email reset
```

## 🚨 **Azioni Immediate Richieste**

### **PRIORITÀ 1** (5 minuti):
```
Dashboard Supabase → Authentication → Settings
❌ DISABILITA "Enable email confirmations"
✅ Salva

Questo risolve immediatamente il problema.
```

### **PRIORITÀ 2** (15 minuti):
```
1. Verifica configurazione Brevo in Supabase
2. Reset tutti i template email
3. Test invio email manuale
4. Riabilita email confirmations se funziona
```

### **PRIORITÀ 3** (30 minuti):
```
1. Verifica dominio in Brevo
2. Controlla limiti di invio
3. Test con diversi provider email
4. Configura backup SMTP se necessario
```

## 📋 **Checklist Finale**

- [ ] Email confirmations disabilitate (fix temporaneo)
- [ ] OAuth Google funzionante
- [ ] Template email resettati
- [ ] Configurazione Brevo verificata
- [ ] URL di redirect corretti
- [ ] Test signup completato
- [ ] Error handling migliorato nel codice

## 🎯 **Risultato Atteso**

Dopo questi fix:
- ✅ OAuth Google funziona perfettamente
- ✅ Email signup funziona (con o senza conferma)
- ✅ Errori gestiti con messaggi chiari
- ✅ Fallback a OAuth quando email fallisce
- ✅ Sistema robusto e user-friendly

---

**AZIONE IMMEDIATA**: Disabilita email confirmations in Supabase per fix immediato! 🚀