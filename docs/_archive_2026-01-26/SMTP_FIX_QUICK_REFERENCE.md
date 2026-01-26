# 🚨 ARUBA SMTP FIX - Quick Reference

**Issue**: "Invalid login: 535 5.7.0 authentication rejected"  
**Status**: ✅ Code Fixed, ⏳ Needs Vercel Config Update  
**Time**: 5 minutes

---

## ⚡ Quick Fix (3 Steps)

### 1. Update Vercel Environment Variable

Go to: [Vercel Dashboard](https://vercel.com/dashboard) → tradelia → Settings → Environment Variables

**Find and Edit:**
```
SMTP_HOST
```

**Change from:**
```
smtp.aruba.it
```

**Change to:**
```
smtps.aruba.it
```

**⚠️ CRITICAL:** Add the 's' after 'smtp'!

### 2. Verify Other Variables

Make sure these are correct:
```bash
SMTP_HOST=smtps.aruba.it          # ← Must have 's'
SMTP_USER=support@tradelia.org    # ← Full email
SMTP_PASS=your_aruba_password     # ← Test in webmail first
```

### 3. Redeploy

Click **Save** → Go to **Deployments** → Click **Redeploy**

---

## ✅ Test After Deploy

1. Go to `https://tradelia.org/contact`
2. Fill form and submit
3. Check for success message
4. Check email inbox

---

## 🔍 If Still Fails

### Test Password First
1. Go to `https://webmail.aruba.it`
2. Login with `support@tradelia.org` + password
3. If fails → Reset password in Aruba panel
4. Update `SMTP_PASS` in Vercel

### Check 2FA
1. Login to Aruba panel
2. Check if 2FA is enabled
3. If yes → Create App Password
4. Use App Password as `SMTP_PASS`

---

## 📚 Full Documentation

- **Deployment Guide**: `docs/ARUBA_SMTP_FIX_DEPLOYMENT_2026.md`
- **Research**: `docs/research/ARUBA_SMTP_NODEMAILER_TIER1_2026.md`
- **Setup Guide**: `docs/ARUBA_SMTP_SETUP_GUIDE.md`

---

## 🎯 What Changed in Code

**Before (WRONG):**
```javascript
host: 'smtp.aruba.it',  // Missing 's'
```

**After (CORRECT):**
```javascript
host: 'smtps.aruba.it',  // With 's'
tls: {
  minVersion: 'TLSv1.2',
  ciphers: 'HIGH:!aNULL:!MD5',
}
```

---

**Files Modified:**
- ✅ `src/app/api/contact/route.ts`
- ✅ `src/app/api/contact-test/route.ts`
- ✅ `docs/ARUBA_SMTP_SETUP_GUIDE.md`

**Files Created:**
- ✅ `docs/research/ARUBA_SMTP_NODEMAILER_TIER1_2026.md`
- ✅ `docs/ARUBA_SMTP_FIX_DEPLOYMENT_2026.md`

---

**Ready to deploy!** 🚀

