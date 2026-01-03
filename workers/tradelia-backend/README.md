# Tradelia Backend (Cloudflare Workers)

Backend REST separato per:

- `GET /snapshot` → OHLCV → regime deterministico
- `POST /ai` → Groq chat completion con regime come gate

## Requisiti

- Node.js 18+
- Cloudflare account + Wrangler

## Sviluppo locale

```bash
cd workers/tradelia-backend
npm install
npm run dev
```

## Deploy

```bash
cd workers/tradelia-backend
npm run deploy
```

## Secrets / env

Imposta su Cloudflare (consigliato come secrets):

```bash
cd workers/tradelia-backend
npx wrangler secret put GROQ_API_KEY
```

Opzionali:

- `GROQ_MODEL` (default: `llama3-70b-8192`)
- `GROQ_BASE_URL` (default: `https://api.groq.com/openai/v1/`)
- `ALLOWED_ORIGINS` (default: `https://tradelia.org,http://localhost:3000,http://localhost:3001`)

## Frontend

Nel Next.js imposta:

- `NEXT_PUBLIC_API_BASE_URL=https://<your-worker>.workers.dev`

