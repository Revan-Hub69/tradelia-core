# Supabase Setup

## Quick Start

1. **Crea progetto Supabase** su [supabase.com](https://supabase.com)
2. **Esegui schema.sql** nel SQL Editor di Supabase
3. **Copia credenziali** in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

### User Tables
- `user_profiles` - Profili utente estesi
- `user_progress` - Progresso nei moduli di apprendimento
- `user_watchlist` - Indicatori salvati dall'utente

### Market Data
- `indicators` - Indicatori cached (Fear & Greed, BTC Dominance, ecc.)
- `market_prices` - Prezzi crypto time-series
- `indicator_history` - Storico per grafici

### Learning Content
- `learning_modules` - Moduli di microlearning
- `learning_lessons` - Lezioni individuali (5 min)

### AI & Analytics
- `ai_interactions` - Log interazioni AI per miglioramenti

## Row Level Security (RLS)

✅ **Abilitato** su tutte le tabelle  
✅ **User data** - Solo proprietario può accedere  
✅ **Market data** - Lettura pubblica (no auth richiesta)  
✅ **Learning content** - Lettura pubblica per contenuti pubblicati

## Realtime

Abilitato su:
- `indicators` - Push automatico quando Railway aggiorna dati
- `market_prices` - Push automatico per prezzi crypto

## Free Tier Limits

- **Database**: 500MB
- **Auth**: 50,000 MAU
- **Storage**: 1GB
- **Realtime**: 200 concurrent connections
- **API requests**: Unlimited

## Next Steps

1. Installa Supabase client: `npm install @supabase/supabase-js`
2. Crea `lib/supabase.ts` per client initialization
3. Setup Railway fetcher per popolare `indicators` table
