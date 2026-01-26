# 🔐 Vercel Environment Variables Checklist

**Date**: January 26, 2026  
**Purpose**: Complete list of environment variables needed for production

---

## 📋 Required Variables

### 1. Supabase (Authentication)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find**:
- Go to Supabase Dashboard → Settings → API
- Copy URL, anon key, and service_role key

---

### 2. Database (PostgreSQL)
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Where to find**:
- Supabase Dashboard → Settings → Database → Connection string
- Select "URI" format
- Use "Transaction" pooler for production

---

### 3. Email Service (Aruba SMTP)
```bash
SMTP_HOST=smtp.aruba.it
SMTP_USER=support@tradelia.org
SMTP_PASS=your_aruba_email_password
SUPPORT_EMAIL=support@tradelia.org
```

**Where to find**:
- SMTP_PASS: Your Aruba email account password
- SMTP_USER: Your Aruba email address (support@tradelia.org)

**Note**: These are already configured if contact form is working.

---

### 4. Site Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://tradelia.org
NEXT_PUBLIC_APP_URL=https://tradelia.org
```

**Purpose**: Used in emails, redirects, and absolute URLs

---

### 5. Cron Security (NEW - Recommended)
```bash
CRON_SECRET=your_random_secret_here
```

**Purpose**: Prevents unauthorized access to cron endpoints

**How to generate**:
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32

# Or use any random string (32+ characters)
```

**Why needed**: Without this, anyone can trigger your cron jobs by calling the URL.

---

## ✅ How to Add Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project (tradelia)
3. Go to Settings → Environment Variables

### Step 2: Add Each Variable
For each variable above:
1. Click "Add New"
2. Enter variable name (e.g., `CRON_SECRET`)
3. Enter value
4. Select environments:
   - ✅ Production
   - ✅ Preview (optional)
   - ✅ Development (optional)
5. Click "Save"

### Step 3: Redeploy (if needed)
If you add variables after deployment:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## 🧪 Verify Variables Are Set

### Method 1: Check in Vercel Dashboard
1. Settings → Environment Variables
2. Verify all variables are listed
3. Check they're enabled for "Production"

### Method 2: Test API Endpoints
```bash
# Test contact form (should work if SMTP vars are set)
curl -X POST https://tradelia.org/api/contact \
  -H "Content-Type: application/json" \
  -H "Accept-Language: it" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test",
    "inquiryType": "general"
  }'

# Expected: { "success": true, "ticketId": "TKT-2026-..." }
```

---

## ⚠️ Security Best Practices

### DO ✅
- Use strong random values for secrets
- Keep CRON_SECRET private
- Use environment variables for all sensitive data
- Enable "Production" environment only for sensitive vars

### DON'T ❌
- Never commit .env files to Git
- Never share SUPABASE_SERVICE_ROLE_KEY publicly
- Never expose SMTP_PASS in client-side code
- Never hardcode secrets in source code

---

## 🔍 Troubleshooting

### "Email service not configured" error
**Problem**: SMTP variables missing or incorrect

**Solution**:
1. Check SMTP_HOST, SMTP_USER, SMTP_PASS are set
2. Verify values are correct (no typos)
3. Test SMTP credentials with email client
4. Redeploy after adding variables

---

### "Database connection failed" error
**Problem**: DATABASE_URL missing or incorrect

**Solution**:
1. Check DATABASE_URL is set
2. Verify connection string format
3. Use "Transaction" pooler (not "Session")
4. Test connection with `psql $DATABASE_URL`

---

### Cron job returns 401 Unauthorized
**Problem**: CRON_SECRET mismatch

**Solution**:
1. Check CRON_SECRET is set in Vercel
2. Use same secret in Authorization header
3. Format: `Authorization: Bearer YOUR_SECRET`

---

### Supabase auth not working
**Problem**: Supabase variables missing or incorrect

**Solution**:
1. Check all 3 Supabase variables are set
2. Verify keys are from correct project
3. Check URL format (https://xxx.supabase.co)
4. Regenerate keys if needed (Supabase Dashboard)

---

## 📊 Priority Order

If you need to add variables gradually:

### Priority 1 (Critical - Site won't work)
1. ✅ NEXT_PUBLIC_SUPABASE_URL
2. ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
3. ✅ SUPABASE_SERVICE_ROLE_KEY
4. ✅ DATABASE_URL
5. ✅ NEXT_PUBLIC_SITE_URL

### Priority 2 (Important - Features won't work)
6. ✅ SMTP_HOST
7. ✅ SMTP_USER
8. ✅ SMTP_PASS
9. ✅ SUPPORT_EMAIL

### Priority 3 (Recommended - Security)
10. ⭐ CRON_SECRET (NEW - add this now)

---

## 📝 Quick Copy-Paste Template

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# Email (Aruba SMTP)
SMTP_HOST=smtp.aruba.it
SMTP_USER=support@tradelia.org
SMTP_PASS=
SUPPORT_EMAIL=support@tradelia.org

# Site
NEXT_PUBLIC_SITE_URL=https://tradelia.org
NEXT_PUBLIC_APP_URL=https://tradelia.org

# Cron Security (NEW)
CRON_SECRET=
```

---

## ✅ Checklist

Before marking as complete:

- [ ] All Priority 1 variables set (Supabase + Database)
- [ ] All Priority 2 variables set (SMTP)
- [ ] CRON_SECRET generated and set
- [ ] Variables enabled for "Production" environment
- [ ] Site redeployed after adding variables
- [ ] Contact form tested (emails received)
- [ ] Cron job visible in Vercel dashboard
- [ ] No errors in Vercel function logs

---

**Status**: Ready to configure  
**Next**: Add CRON_SECRET to Vercel, then test contact form
