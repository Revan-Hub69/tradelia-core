# Environment Variables Configuration Guide

## Overview

Your system uses different environment variables for different purposes. Here's what's needed and what's optional.

## Required Variables (Must be on Vercel)

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://higkhlfjfhlecbtfnznx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_URL=https://higkhlfjfhlecbtfnznx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Why**: Database access for:
- Cookie preferences
- User profiles
- Start flow responses
- Market data storage
- Setup events logging

### Cron Jobs Security
```
CRON_SECRET=tradelia_secure_cron_2024_dev
```

**Why**: Protects scheduled tasks from unauthorized access

### AI Integration
```
HUGGINGFACE_API_KEY=<your-huggingface-api-key>
```

**Why**: Fear & Greed Index analysis and explanations

## Optional Variables (Not Required)

### Binance API Configuration
```
BINANCE_API_URL=https://api.binance.com
BINANCE_TIMEOUT=10000
BINANCE_RATE_LIMIT_REQUESTS=8
BINANCE_RATE_LIMIT_WINDOW=1000
BINANCE_USER_AGENT=Tradelia/1.0
BINANCE_RETRIES=3
```

**Why Optional**: 
- ✅ Binance public API doesn't require authentication
- ✅ Uses default values if not set
- ✅ Only needed if you want to customize behavior
- ✅ All market data endpoints work without keys

**Used For**:
- Market data collection (MCE - Market Context Engine)
- Universe selection (UCM - Universe Context Manager)
- Market structure analysis (MSF - Market Structure Fit)
- Setup detection

### Testnet Configuration
```
BINANCE_USE_TESTNET=false
BINANCE_TESTNET_URL=https://testnet.binance.vision
BINANCE_MOCK_URL=http://localhost:3001/mock-binance
```

**Why Optional**:
- Only needed for development/testing
- Production uses live Binance API

## What Works Without Extra Configuration

✅ **Dashboard** - Fully functional
- Cookie preferences
- User profiles
- Start flow responses
- All UI features

✅ **Market Data** - Fully functional
- Real-time price data from Binance
- Market regime detection (MCE)
- Universe selection (UCM)
- Market structure analysis (MSF)

✅ **Setup Detection** - Fully functional
- Detects trading setups
- Logs setup events
- Displays setup analysis

✅ **AI Features** - Fully functional
- Fear & Greed Index
- AI explanations (with HuggingFace key)

## What Requires Configuration

❌ **Cron Jobs** - Requires `CRON_SECRET`
- MCE pipeline scheduling
- UCM pipeline scheduling
- MSF pipeline scheduling

❌ **Database Operations** - Requires Supabase keys
- Saving preferences
- Storing market data
- Logging events

## Testing Without Extra Variables

You can test most features without Binance variables:

```bash
# This works without BINANCE_* variables
npm run dev

# Market data will use defaults:
# - URL: https://api.binance.com
# - Timeout: 10s
# - Rate limit: 8 requests/second
# - Retries: 3
```

## Vercel Deployment Checklist

✅ Required on Vercel:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `HUGGINGFACE_API_KEY`
- [ ] `CRON_SECRET`

⚠️ Optional on Vercel:
- [ ] `BINANCE_API_URL` (uses default if not set)
- [ ] `BINANCE_TIMEOUT` (uses default if not set)
- [ ] Other Binance variables (all have defaults)

## Local Development (.env.local)

Your `.env.local` already has all required variables. No changes needed.

## Production Deployment

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add the **Required** variables above
4. Binance variables are optional (will use defaults)
5. Redeploy

## Verification

After deployment, verify:

```bash
# Check Supabase connection
curl https://your-domain.vercel.app/api/health

# Check Binance connectivity
curl https://your-domain.vercel.app/api/health/detailed

# Check market data
curl https://your-domain.vercel.app/api/market-data/status
```

## FAQ

**Q: Do I need Binance API keys?**
A: No. Binance public API doesn't require authentication. All market data endpoints work without keys.

**Q: What if I don't set Binance variables?**
A: The system uses sensible defaults:
- URL: https://api.binance.com
- Timeout: 10 seconds
- Rate limit: 8 requests/second
- Retries: 3 attempts

**Q: Can I use Binance Testnet?**
A: Yes, set `BINANCE_USE_TESTNET=true` for development.

**Q: What happens if Supabase keys are missing?**
A: Database operations fail. Dashboard won't load user data.

**Q: What happens if CRON_SECRET is missing?**
A: Scheduled tasks won't run. Manual API calls still work.

**Q: What happens if HuggingFace key is missing?**
A: AI features won't work, but dashboard still functions.

---

**Status**: All required variables configured ✅
**Binance**: Works with defaults ✅
**Ready for Production**: Yes ✅
