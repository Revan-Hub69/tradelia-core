# Guida Semplice - Come Caricare i Template Email su Supabase

## 🎯 Cosa Devi Fare (in 3 passi)

### Passo 1: Apri Supabase Dashboard

1. Vai su https://supabase.com/dashboard
2. Seleziona il tuo progetto Tradelia
3. Clicca su **"Authentication"** nel menu laterale
4. Clicca su **"Email Templates"**

### Passo 2: Copia e Incolla l'HTML

Per ogni tipo di email:

#### A) Confirm Signup (Conferma Registrazione)

1. Nella dashboard, clicca su **"Confirm signup"**
2. Apri il file `confirm-signup.html` nel tuo editor
3. **Seleziona TUTTO** (Ctrl+A o Cmd+A)
4. **Copia** (Ctrl+C o Cmd+C)
5. Torna su Supabase
6. **Incolla** nell'editor HTML (Ctrl+V o Cmd+V)
7. Clicca **"Save"**

#### B) Magic Link (Login Senza Password)

1. Nella dashboard, clicca su **"Magic Link"**
2. Apri il file `magic-link.html`
3. Seleziona tutto e copia
4. Incolla nell'editor HTML di Supabase
5. Clicca **"Save"**

#### C) Change Email (Cambio Email)

1. Nella dashboard, clicca su **"Change Email Address"**
2. Apri il file `change-email.html`
3. Seleziona tutto e copia
4. Incolla nell'editor HTML di Supabase
5. Clicca **"Save"**

#### D) Reset Password (Recupero Password)

1. Nella dashboard, clicca su **"Reset Password"** o **"Recovery"**
2. Apri il file `reset-password.html`
3. Seleziona tutto e copia
4. Incolla nell'editor HTML di Supabase
5. Clicca **"Save"**

### Passo 3: Testa

1. Nella dashboard, clicca su **"Send test email"**
2. Inserisci la tua email
3. Controlla che l'email arrivi correttamente

## ❓ Domande Frequenti

### "Cosa sono quelle cose tipo {{.ConfirmationURL}}?"

Sono **variabili automatiche** di Supabase. NON devi fare nulla con loro!

**Esempio:**
- Tu incolli: `<a href="{{.ConfirmationURL}}">Clicca qui</a>`
- Supabase invia: `<a href="https://tradelia.org/auth/confirm?token=abc123">Clicca qui</a>`

Supabase sostituisce automaticamente le variabili con i valori veri.

### "Devo collegare i file JSON delle traduzioni?"

**NO!** I testi sono già scritti direttamente nell'HTML in inglese e italiano.

Guarda nell'HTML:

```html
<!-- Sezione Inglese -->
<td id="en" lang="en">
  <h2>Welcome to Tradelia!</h2>
  <p>Thank you for signing up...</p>
</td>

<!-- Sezione Italiana -->
<td id="it" lang="it">
  <h2>Benvenuto su Tradelia!</h2>
  <p>Grazie per esserti registrato...</p>
</td>
```

Entrambe le lingue sono già nell'HTML! L'utente vedrà entrambe e potrà cliccare sui pulsanti 🇬🇧 English o 🇮🇹 Italiano per saltare alla sezione che preferisce.

### "Devo modificare qualcosa nell'HTML prima di incollarlo?"

**NO!** Copia e incolla così com'è. Supabase gestisce tutto automaticamente.

### "Come faccio a cambiare i testi?"

Se vuoi modificare i testi:

1. Apri il file `.html` nel tuo editor
2. Cerca il testo che vuoi cambiare
3. Modificalo sia nella sezione inglese (`id="en"`) che italiana (`id="it"`)
4. Salva il file
5. Copia di nuovo tutto e incolla su Supabase

**Esempio:**

```html
<!-- PRIMA -->
<h2>Welcome to Tradelia!</h2>

<!-- DOPO -->
<h2>Welcome to Tradelia - Start Trading!</h2>
```

### "Cosa sono i file .txt?"

Sono le versioni **plain text** (solo testo, senza HTML) delle email. Servono per:
- Screen reader (accessibilità)
- Email client che non supportano HTML
- Backup se l'HTML non si carica

**Come usarli:**
1. Nella dashboard Supabase, sotto l'editor HTML c'è un editor "Plain text"
2. Copia il contenuto dal file `.txt` corrispondente
3. Incolla nell'editor plain text
4. Salva

## 🎨 Cosa Vedranno gli Utenti

L'email avrà:

1. **Header viola** con logo Tradelia
2. **Due pulsanti** in alto: 🇬🇧 English | 🇮🇹 Italiano
3. **Sezione inglese** con tutto il testo in inglese
4. **Linea divisoria**
5. **Sezione italiana** con tutto il testo in italiano
6. **Footer** con link al sito e supporto

Gli utenti possono:
- Leggere nella loro lingua preferita
- Cliccare sui pulsanti 🇬🇧/🇮🇹 per saltare alla sezione
- Cliccare sul pulsante blu per confermare/accedere

## 🔧 Variabili Supabase (Riferimento)

Queste variabili vengono sostituite **automaticamente** da Supabase:

| Variabile | Descrizione | Esempio |
|-----------|-------------|---------|
| `{{.ConfirmationURL}}` | Link di conferma completo | `https://tradelia.org/auth/confirm?token=abc123...` |
| `{{.SiteURL}}` | URL del tuo sito | `https://tradelia.org` |
| `{{.Token}}` | Codice OTP a 6 cifre | `123456` |
| `{{.TokenHash}}` | Token hashato | `abc123def456...` |

**NON modificare queste variabili!** Lasciale così come sono nell'HTML.

## ✅ Checklist Finale

Prima di andare in produzione:

- [ ] Ho caricato tutti e 4 i template HTML su Supabase
- [ ] Ho caricato le versioni plain text
- [ ] Ho inviato email di test a me stesso
- [ ] Ho verificato che i link funzionino
- [ ] Ho controllato l'email su mobile
- [ ] Ho verificato che entrambe le lingue siano visibili
- [ ] I pulsanti 🇬🇧/🇮🇹 funzionano (saltano alla sezione)

## 🆘 Problemi?

### Email non arriva
- Controlla la cartella spam
- Verifica i log in Supabase Dashboard → Logs → Auth Logs
- Controlla che il servizio email sia configurato

### Link non funziona
- Verifica che `{{.ConfirmationURL}}` non sia stato modificato
- Controlla che il `Site URL` sia configurato correttamente in Supabase

### Design non si vede bene
- Prova ad aprire l'email in un altro client (Gmail, Outlook, etc.)
- Verifica che tutto l'HTML sia stato copiato correttamente

## 📞 Supporto

Per problemi tecnici:
- Documentazione Supabase: https://supabase.com/docs/guides/auth/auth-email-templates
- File README.md in questa cartella per dettagli tecnici

---

**Ricorda:** Devi solo copiare e incollare l'HTML. Supabase fa tutto il resto! 🚀
