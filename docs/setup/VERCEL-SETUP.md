# Vercel Deployment Setup

## Environment Variables (Already Set in Vercel Dashboard)

Since you mentioned you already have environment variables in Vercel, make sure these are configured:

### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Optional Variables
```
SUPABASE_PROJECT_ID=your_project_id (for type generation)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Deployment Commands

### Build Command (Vercel auto-detects)
```bash
npm run build
```

### Generate Supabase Types (Run locally)
```bash
# Set your project ID first
export SUPABASE_PROJECT_ID=your_project_id
npm run generate-types
```

## Route Changes After Deployment

Your Vercel deployment will now have these routes:

### Main Routes
- `https://your-domain.vercel.app/` → Redirects to `/it`
- `https://your-domain.vercel.app/it` → Italian homepage
- `https://your-domain.vercel.app/en` → English homepage

### All Pages Support Both Locales
- `/it/about` and `/en/about`
- `/it/dashboard` and `/en/dashboard`
- `/it/library` and `/en/library`
- `/it/topics` and `/en/topics`
- `/it/paths/long-term` and `/en/paths/long-term`

## Security Headers

The app now includes production-ready security headers:
- Strict CSP (no unsafe-eval/unsafe-inline in production)
- HSTS, X-Frame-Options, X-Content-Type-Options
- Permissions Policy to limit browser features

## Next Steps

1. **Deploy to Vercel** - Should work with existing environment variables
2. **Test i18n routes** - Verify `/it` and `/en` versions work
3. **Generate types** - Run `npm run generate-types` locally if needed
4. **Clean up old files** - Remove old structure after testing

The migration is complete and ready for production! 🚀