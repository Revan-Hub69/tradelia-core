# 🎓 Tradelia - Educazione Finanziaria Antifuffa

Piattaforma educativa per comprendere indicatori e concetti finanziari senza semplificazioni pericolose.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Clean build cache
npm run clean
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📁 Struttura Progetto

```
tradelia-core/
├── .kiro/specs/            # Specifiche progetto e documentazione
├── app/                    # Next.js 14 App Router
│   ├── (marketing)/       # Homepage e landing pages
│   ├── api/               # API routes
│   │   ├── ai/           # AI endpoints (Tradelia AI)
│   │   └── indicators/   # Indicatori (Fear & Greed, etc.)
│   ├── dashboard/        # Dashboard utente
│   └── library/          # Libreria contenuti educativi
├── components/
│   ├── marketing/        # Componenti homepage
│   ├── indicators/       # Widget indicatori AI-powered
│   ├── ui/              # UI components base
│   │   └── design-system/ # Design system unificato
│   └── layout/          # Layout components
├── lib/
│   ├── ai/              # Tradelia AI logic
│   ├── indicators/      # Logica indicatori
│   ├── supabase/        # Supabase client & types
│   └── validation/      # Zod schemas
├── hooks/               # Custom React hooks
├── public/              # Static assets
├── docs/                # 📚 Documentazione essenziale
│   └── HUGGINGFACE-SETUP.md # AI integration guide
└── supabase/           # Database migrations & schema
```

## 🎨 Design System

Il progetto usa un design system unificato con:
- **3 varianti card**: standard, elevated, hero
- **Palette ristretta**: 6 colori semantici
- **Spacing consistente**: `py-16 lg:py-24`
- **Dark mode**: Supporto completo

Vedi: `docs/design/DESIGN-SYSTEM-RESET-2026.md`

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router, Turbopack)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 (Tradelia AI)
- **Deployment**: Vercel
- **Language**: TypeScript

## 📊 Features

### ✅ Implementato
- Homepage con 9 sezioni educative
- Fear & Greed Index con dati live (Alternative.me)
- Tradelia AI Analysis (interpretazione contestuale)
- Design system unificato
- Dark mode completo
- Database Supabase con cron job
- API endpoints per indicatori e AI

### 🚧 In Sviluppo
- Dashboard utente completa
- Libreria contenuti educativi
- Path di apprendimento personalizzati
- Altri indicatori crypto

## 🗄️ Database

Supabase PostgreSQL con:
- Tabella `indicators` per Fear & Greed Index
- Cron job per aggiornamento automatico (ogni 24h)
- RLS policies per sicurezza

Setup: `docs/setup/SUPABASE-CRON-SETUP.sql`

## 🤖 Tradelia AI

AI specializzata in educazione finanziaria:
- **Zero consigli operativi** - Solo educazione
- **Fonti certificate** - Nessun contenuto da "bingobongo2007"
- **Trasparenza** sui limiti degli indicatori
- **Compliance** MiFID II

## 📚 Documentazione

Tutta la documentazione è in `/docs`:
- **Design**: Design system, UI guidelines
- **Setup**: Configurazione infrastruttura
- **Archive**: Documentazione storica

Vedi: `docs/README.md`

## 🚀 Deploy

### Vercel
```bash
git push origin main
```
Auto-deploy su push a main branch.

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

## 🤝 Contributing

1. Segui il design system (`docs/design/`)
2. Usa componenti unificati (`components/ui/design-system/`)
3. TypeScript strict mode
4. Test prima di push

## 📄 License

Proprietario - Tradelia 2025

---

**Motto:** "Capire prima di credere. Capire prima di agire."
