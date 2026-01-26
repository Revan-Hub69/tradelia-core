# Aruba SMTP Fix - Deployment Guide 2026

**Date**: 26 January 2026  
**Issue**: "Invalid login: 535 5.7.0 authentication rejected"  
**Root Cause**: Wrong SMTP host configuration  
**Status**: ✅ Code Fixed, Ready for Deployment

---

## 🎯 What Was Wrong

### Previous Configuration (WRONG ❌)
```javascript
host: 'smtp.aruba.it',  // Missing 's' - WRONG!
port: 465,
secure: true,
// No TLS configuration
```

### New Configuration (CORRECT ✅)
```javascript
host: 'smtps.aruba.it',  // With 's' - CORRECT!
port: 465,
secure: true,
tls: {
  minVersion: 'TLSv1.2',
  ciphers: 'HIGH:!aNULL:!MD5',
}
```

---

## 📋 What Changed

### Files Modified

1. **`src/app/api/contact/route.ts`**
   - Added TLS configuration with minVersion
   - Ready for `smtps.aruba.it` host

2. **`src/app/api/contact-test/route.ts`**
   - Added TLS configuration
   - Added debug logging for troubleshooting

3. **`docs/ARUBA_SMTP_SETUP_GUIDE.md`**
   - Updated to use `smtps.aruba.it`
   - Added 2FA/App Password instructions
   - Enhanced troubleshooting section

4. **`docs/research/ARUBA_SMTP_NODEMAILER_TIER1_2026.md`** (NEW)
   - Complete tier-1 research document
   - Official Aruba SMTP settings
   - Troubleshooting guide
   - Alternative configurations

---

## 🚀 Deployment Steps

### Step 1: Update Vercel Environment Variables

**CRITICAL:** You must update `SMTP_HOST` in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project `tradelia`
3. Go to **Settings** → **Environment Variables**
4. Find `SMTP_HOST` and click **Edit**
5. Change value from `smtp.aruba.it` to `smtps.aruba.it` (add the 's')
6. Click **Save**

**Verify all variables:**
```bash
SMTP_HOST=smtps.aruba.it          # ← Must have 's'
SMTP_USER=support@tradelia.org    # ← Full email address
SMTP_PASS=your_password           # ← Aruba email password
SUPPORT_EMAIL=support@tradelia.org
```

### Step 2: Verify Credentials in Aruba Webmail

Before deploying, test your credentials:

1. Go to `https://webmail.aruba.it`
2. Login with:
   - **Email**: `support@tradelia.org`
   - **Password**: Same as `SMTP_PASS` in Vercel
3. If login fails:
   - Reset password in Aruba panel
   - Update `SMTP_PASS` in Vercel
4. Check if 2FA is enabled:
   - If yes → Create App Password in Aruba panel
   - Use App Password as `SMTP_PASS`

### Step 3: Deploy Code Changes

```bash
# Commit changes
git add .
git commit -m "fix: update Aruba SMTP configuration with correct host and TLS settings"

# Push to trigger deployment
git push origin main
```

Or manually redeploy in Vercel:
1. Go to **Deployments**
2. Click **...** on latest deployment
3. Click **Redeploy**

### Step 4: Test SMTP Connection

After deployment, test the contact form:

1. Go to `https://tradelia.org/contact`
2. Fill out the form
3. Submit
4. Check for errors in browser console
5. Check Vercel logs:
   ```bash
   vercel logs --follow
   ```

**Expected result:**
- ✅ No "authentication rejected" error
- ✅ Email sent successfully
- ✅ Confirmation email received by user
- ✅ Notification email received at support@tradelia.org

---

## 🧪 Testing Checklist

### Test 1: SMTP Connection
```bash
# Check Vercel logs for connection
vercel logs --follow

# Look for:
✅ "Transporter created"
✅ "Emails sent successfully"
❌ "Invalid login" → Check credentials
❌ "Connection timeout" → Check host
```

### Test 2: Contact Form Submission
1. Go to `/contact`
2. Fill form with test data
3. Submit
4. Verify:
   - ✅ Success message shown
   - ✅ No console errors
   - ✅ Ticket ID returned
   - ✅ Email received

### Test 3: Email Delivery
1. Check `support@tradelia.org` inbox
2. Verify notification email received
3. Check test user email
4. Verify confirmation email received

---

## 🔍 Troubleshooting

### Issue: Still getting "authentication rejected"

**Possible causes:**

1. **Environment variable not updated**
   - Check Vercel: Settings → Environment Variables
   - Verify `SMTP_HOST=smtps.aruba.it` (with 's')
   - Redeploy after changing

2. **Wrong password**
   - Test login at `https://webmail.aruba.it`
   - If fails → Reset password in Aruba panel
   - Update `SMTP_PASS` in Vercel

3. **2FA enabled without App Password**
   - Login to Aruba panel
   - Go to Security Settings
   - Create App Password
   - Use App Password as `SMTP_PASS`

4. **Username not full email**
   - Verify `SMTP_USER=support@tradelia.org`
   - Must be full email, not just username

### Issue: Connection timeout

**Possible causes:**

1. **Wrong host**
   - Must be `smtps.aruba.it` (with 's')
   - NOT `smtp.aruba.it`

2. **Port blocked by Vercel**
   - Try alternative configuration with port 587
   - See "Alternative Configuration" below

3. **Network issues**
   - Check Vercel status page
   - Try redeploying

### Alternative Configuration (Port 587)

If port 465 doesn't work, try port 587 with STARTTLS:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtps.aruba.it',
  port: 587,
  secure: false,  // Start unencrypted
  requireTLS: true,  // Force upgrade to TLS
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    minVersion: 'TLSv1.2',
    ciphers: 'HIGH:!aNULL:!MD5',
  },
});
```

Update in Vercel:
```bash
SMTP_HOST=smtps.aruba.it
SMTP_PORT=587  # Add this variable
```

---

## 📊 Verification Checklist

Before marking as complete:

- [ ] `SMTP_HOST=smtps.aruba.it` in Vercel (with 's')
- [ ] `SMTP_USER=support@tradelia.org` (full email)
- [ ] `SMTP_PASS` verified in Aruba webmail
- [ ] Code deployed to production
- [ ] Contact form tested successfully
- [ ] Notification email received at support@tradelia.org
- [ ] Confirmation email received by test user
- [ ] No errors in Vercel logs
- [ ] No errors in browser console

---

## 📚 Related Documentation

- **Tier-1 Research**: `docs/research/ARUBA_SMTP_NODEMAILER_TIER1_2026.md`
- **Setup Guide**: `docs/ARUBA_SMTP_SETUP_GUIDE.md`
- **Email System**: `docs/implementation/P1_EMAIL_SYSTEM_ENTERPRISE_IMPLEMENTATION_2026.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE_EMAIL_SYSTEM_2026.md`

---

## 🎯 Expected Outcome

After following this guide:

1. ✅ SMTP authentication succeeds
2. ✅ Contact form sends emails
3. ✅ Users receive confirmation emails
4. ✅ Support team receives notification emails
5. ✅ No "authentication rejected" errors
6. ✅ Email system fully operational

---

## 📞 Support

If issues persist after following this guide:

1. Check Vercel logs: `vercel logs --follow`
2. Verify credentials in Aruba webmail
3. Review tier-1 research document
4. Check Aruba panel for 2FA/App Password settings

---

**Status**: ✅ Ready for Deployment  
**Next Step**: Update `SMTP_HOST` in Vercel to `smtps.aruba.it`  
**Expected Time**: 5-10 minutes

---

_Last Updated: 26 January 2026_

