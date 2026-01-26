# Aruba SMTP Configuration for Nodemailer - Tier 1 Research

**Date**: 26 January 2026  
**Status**: ✅ Research Complete  
**Sources**: Official Aruba documentation, StackOverflow, Nodemailer docs

---

## 🎯 Executive Summary

Aruba SMTP requires **specific host names and port configurations** that differ from standard SMTP servers. The key issue is using the correct host (`smtps.aruba.it` vs `smtp.aruba.it`) and matching port/security settings.

---

## 📊 Official Aruba SMTP Settings

### Source: [BitRecover - Aruba IMAP Settings](https://www.bitrecover.com/imap-settings/aruba-it-mail/)

**Aruba.it SMTP Outgoing Mail Server:**

| Configuration | Value |
|--------------|-------|
| **Host (SSL)** | `smtps.aruba.it` |
| **Port (SSL)** | `465` (requires SSL) |
| **Port (STARTTLS)** | `587` (non-secure, upgrades with STARTTLS) |
| **Username** | Full email address (e.g., `support@tradelia.org`) |
| **Password** | Email account password |
| **Authentication** | Required |

### Source: [Limilabs - Aruba Custom Domain Settings](https://www.limilabs.com/blog/aruba-it-custom-domain-settings)

**For custom domains (@tradelia.org):**

```
Server: smtps.aruba.it
SSL: true (implicit)
Port: 465 (default)
User: email address (e.g., support@tradelia.org)
```

---

## 🔧 Nodemailer Configuration Options

### Source: [Nodemailer SMTP Transport](https://nodemailer.com/smtp)

**Port 465 (SSL/TLS - Implicit):**
- Use `secure: true`
- Connection is encrypted from the start
- Host: `smtps.aruba.it`

**Port 587 (STARTTLS - Explicit):**
- Use `secure: false`
- Connection starts unencrypted, then upgrades with STARTTLS
- Host: `smtp.aruba.it` or `smtps.aruba.it`

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid login: 535 5.7.0 authentication rejected"

**Causes:**
1. Wrong password
2. Wrong username format (must be full email address)
3. Wrong host name (`smtp.aruba.it` instead of `smtps.aruba.it`)
4. 2FA enabled without app password

**Solutions:**
- ✅ Use full email address as username: `support@tradelia.org`
- ✅ Use correct host: `smtps.aruba.it` for port 465
- ✅ Verify password in Aruba webmail first
- ✅ If 2FA enabled, create app password in Aruba panel

### Issue 2: "dh key too small" or "unsupported protocol"

**Source**: [StackOverflow - Nodemailer with Aruba](https://stackoverflow.com/questions/60641391/nodemailer-does-not-work-with-aruba-webmail)

**Cause**: TLS version mismatch or DH key size issues

**Solution**: Add TLS configuration:

```javascript
tls: {
  minVersion: 'TLSv1.2',
  ciphers: 'HIGH:!aNULL:!MD5',
  rejectUnauthorized: false // Only for testing
}
```

### Issue 3: Connection timeout

**Causes:**
1. Firewall blocking port 465/587
2. Wrong host name
3. Vercel/Railway network restrictions

**Solutions:**
- ✅ Try both port 465 and 587
- ✅ Verify host is `smtps.aruba.it`
- ✅ Check Vercel logs for network errors

---

## ✅ Recommended Configurations

### Configuration A: Port 465 with SSL (Recommended)

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtps.aruba.it',  // Note: smtpS not smtp
  port: 465,
  secure: true,  // Use SSL
  auth: {
    user: 'support@tradelia.org',  // Full email address
    pass: process.env.SMTP_PASS
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});
```

**Pros:**
- Encrypted from start
- More secure
- Standard for Aruba

**Cons:**
- Some hosting providers block port 465

### Configuration B: Port 587 with STARTTLS (Alternative)

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtps.aruba.it',  // Can also use smtp.aruba.it
  port: 587,
  secure: false,  // Start unencrypted, upgrade with STARTTLS
  auth: {
    user: 'support@tradelia.org',
    pass: process.env.SMTP_PASS
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  requireTLS: true  // Force STARTTLS upgrade
});
```

**Pros:**
- More compatible with hosting providers
- Explicitly upgrades to TLS

**Cons:**
- Starts unencrypted (but upgrades immediately)

---

## 🧪 Testing Strategy

### Step 1: Verify Credentials

Test login on Aruba webmail:
- URL: `https://webmail.aruba.it`
- Username: `support@tradelia.org`
- Password: Same as `SMTP_PASS`

If login fails → Reset password in Aruba panel

### Step 2: Test with Simple Script

```javascript
// test-smtp.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtps.aruba.it',
  port: 465,
  secure: true,
  auth: {
    user: 'support@tradelia.org',
    pass: process.env.SMTP_PASS
  },
  logger: true,  // Enable logging
  debug: true    // Show SMTP traffic
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('✅ SMTP Ready:', success);
  }
});
```

### Step 3: Test Email Send

```javascript
await transporter.sendMail({
  from: '"Tradelia Test" <support@tradelia.org>',
  to: 'support@tradelia.org',
  subject: 'Test Email',
  text: 'If you receive this, SMTP works!'
});
```

---

## 📋 Environment Variables Checklist

```bash
# Vercel Environment Variables
SMTP_HOST=smtps.aruba.it          # Note: smtpS not smtp
SMTP_USER=support@tradelia.org    # Full email address
SMTP_PASS=your_aruba_password     # Email password (not app password unless 2FA)
SUPPORT_EMAIL=support@tradelia.org
```

**Critical:**
- ✅ Host must be `smtps.aruba.it` (with 's')
- ✅ User must be full email address
- ✅ No spaces in environment variables
- ✅ Password must match Aruba webmail login

---

## 🔍 Debugging Checklist

If SMTP still fails after configuration:

1. **Verify credentials in Aruba webmail** ✅
   - Login at `https://webmail.aruba.it`
   - If fails → Reset password

2. **Check environment variables in Vercel** ✅
   - Go to Settings → Environment Variables
   - Verify `SMTP_HOST=smtps.aruba.it` (with 's')
   - Verify `SMTP_USER=support@tradelia.org` (full email)
   - Verify no extra spaces

3. **Check Vercel logs** ✅
   ```bash
   vercel logs --follow
   ```
   - Look for "Invalid login" → Wrong password
   - Look for "Connection timeout" → Wrong host
   - Look for "dh key too small" → Add TLS config

4. **Try alternative configuration** ✅
   - Switch from port 465 to 587
   - Add `requireTLS: true`
   - Add TLS minVersion

5. **Check 2FA status** ✅
   - Login to Aruba panel
   - Check if 2FA is enabled
   - If yes → Create app password

---

## 📚 References

1. **Aruba SMTP Settings** - [BitRecover](https://www.bitrecover.com/imap-settings/aruba-it-mail/)
   - Official port and host configurations
   - App password instructions

2. **Aruba Custom Domain Settings** - [Limilabs](https://www.limilabs.com/blog/aruba-it-custom-domain-settings)
   - Custom domain (@tradelia.org) specific settings
   - Code examples

3. **Nodemailer SMTP Transport** - [Nodemailer Docs](https://nodemailer.com/smtp)
   - Port 465 vs 587 differences
   - TLS configuration options

4. **Nodemailer with Aruba Issues** - [StackOverflow](https://stackoverflow.com/questions/60641391/nodemailer-does-not-work-with-aruba-webmail)
   - Real-world troubleshooting
   - TLS version issues

---

## ✅ Implementation Checklist

- [ ] Update `SMTP_HOST` to `smtps.aruba.it` in Vercel
- [ ] Verify `SMTP_USER` is full email address
- [ ] Test credentials in Aruba webmail
- [ ] Update code to use `smtps.aruba.it`
- [ ] Add TLS configuration with minVersion
- [ ] Test with `/api/contact-test` endpoint
- [ ] Monitor Vercel logs for errors
- [ ] If fails, try port 587 alternative
- [ ] Document final working configuration

---

**Status**: Ready for implementation  
**Next Step**: Update code and Vercel environment variables  
**Expected Result**: SMTP authentication success

