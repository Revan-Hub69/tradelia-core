# Hugging Face Setup Guide

## 🎯 Obiettivo
Integrare Hugging Face Inference API per fornire spiegazioni AI educative sui dati crypto.

## 📋 Prerequisiti

1. **Account Hugging Face (Gratuito)**
   - Vai su [huggingface.co](https://huggingface.co)
   - Crea un account gratuito

2. **API Token**
   - Vai su [Settings → Access Tokens](https://huggingface.co/settings/tokens)
   - Clicca "New token"
   - Nome: `tradelia-ai`
   - Tipo: **Read** (sufficiente per inference)
   - Copia il token (inizia con `hf_...`)

## ⚙️ Configurazione

### 1. Aggiungi il token al file `.env.local`

```bash
# Tradelia AI (Hugging Face - FREE)
HUGGINGFACE_API_KEY=hf_tuotoken...
```

### 2. Riavvia il server di sviluppo

```bash
# Ferma il server (Ctrl+C)
# Riavvia
npm run dev
```

### 3. Testa la connessione

Vai su: [http://localhost:3000/test/huggingface](http://localhost:3000/test/huggingface)

Clicca "Test Hugging Face API"

## ✅ Verifica

### Test di connessione
- ✅ API Key presente
- ✅ Connessione riuscita
- ✅ Risposta dal modello

### Test completo AI + Fear & Greed
Vai su: [http://localhost:3000/test/ai-fear-greed](http://localhost:3000/test/ai-fear-greed)

## 🔧 Troubleshooting

### Errore 401 - Unauthorized
- ❌ Token non valido o mancante
- ✅ Verifica che il token inizi con `hf_`
- ✅ Controlla che sia nel file `.env.local`
- ✅ Riavvia il server

### Errore 503 - Service Unavailable
- ⏳ Il modello si sta caricando (prima volta)
- ✅ Aspetta 10-30 secondi e riprova
- ✅ I modelli Hugging Face vanno in "sleep" se non usati

### Errore 429 - Rate Limit
- 🚫 Troppi richieste
- ✅ Account gratuito: ~1000 richieste/giorno
- ✅ Aspetta qualche minuto

### Fallback attivo
- ℹ️ Se l'API non risponde, usa risposte educative pre-scritte
- ✅ L'app funziona comunque
- ✅ Nessun errore per l'utente

## 🤖 Modelli Utilizzati

### Mistral-7B-Instruct-v0.2
- **Tipo**: Large Language Model
- **Lingue**: Multilingue (incluso italiano)
- **Dimensione**: 7B parametri
- **Costo**: Gratuito con account HF
- **Latenza**: 2-5 secondi (prima richiesta più lenta)

### Alternative (se Mistral non funziona)

```typescript
// In lib/ai/tradelia-ai.ts, cambia il modello:

// Opzione 1: Più veloce ma meno accurato
const model = 'google/flan-t5-base'

// Opzione 2: Italiano specifico
const model = 'GroNLP/gpt2-small-italian'

// Opzione 3: Multilingue bilanciato
const model = 'facebook/mbart-large-50'
```

## 📊 Limiti Account Gratuito

| Risorsa | Limite |
|---------|--------|
| Richieste/giorno | ~1000 |
| Richieste/minuto | ~10 |
| Timeout | 60 secondi |
| Max tokens | 1000 per richiesta |

## 🔐 Sicurezza

- ✅ Token solo server-side (non esposto al client)
- ✅ Variabile d'ambiente `.env.local` (non committata)
- ✅ Token con permessi minimi (Read only)
- ✅ Fallback se API non disponibile

## 📝 Note

- Il primo caricamento del modello può richiedere 10-30 secondi
- I modelli vanno in "sleep" dopo 15 minuti di inattività
- Le risposte sono cachate da Hugging Face per 24h
- L'app funziona anche senza API key (usa fallback)

## 🚀 Prossimi Passi

1. ✅ Test connessione base
2. ✅ Test integrazione Fear & Greed
3. ⏳ Ottimizzazione prompt per risposte migliori
4. ⏳ Cache locale per ridurre chiamate API
5. ⏳ A/B test tra diversi modelli
