# Supabase Email Templates - Deployment Guide

This guide explains how to upload and configure the bilingual email templates in your Supabase project.

## Prerequisites

- Access to Supabase Dashboard
- Project with Authentication enabled
- Admin permissions

## Step-by-Step Deployment

### 1. Access Email Templates Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### 2. Configure Confirm Signup Email

1. Click on **"Confirm signup"** template
2. **Subject line**: `Confirm your Tradelia account`
3. **Message (HTML)**:
   - Copy entire content from `confirm-signup.html`
   - Paste into the HTML editor
4. **Message (Plain text)**:
   - Copy entire content from `confirm-signup.txt`
   - Paste into the plain text editor
5. Click **Save**

### 3. Configure Magic Link Email

1. Click on **"Magic Link"** template
2. **Subject line**: `Your Tradelia magic link`
3. **Message (HTML)**:
   - Copy entire content from `magic-link.html`
   - Paste into the HTML editor
4. **Message (Plain text)**:
   - Copy entire content from `magic-link.txt`
   - Paste into the plain text editor
5. Click **Save**

### 4. Configure Change Email Template

1. Click on **"Change Email Address"** template
2. **Subject line**: `Confirm your new email address`
3. **Message (HTML)**:
   - Copy entire content from `change-email.html`
   - Paste into the HTML editor
4. **Message (Plain text)**:
   - Copy entire content from `change-email.txt`
   - Paste into the plain text editor
5. Click **Save**

### 5. Configure Reset Password Email

1. Click on **"Reset Password"** or **"Recovery"** template
2. **Subject line**: `Reset your Tradelia password`
3. **Message (HTML)**:
   - Copy entire content from `reset-password.html`
   - Paste into the HTML editor
4. **Message (Plain text)**:
   - Copy entire content from `reset-password.txt`
   - Paste into the plain text editor
5. Click **Save**

## Template Variables

Supabase automatically replaces these variables when sending emails:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{.ConfirmationURL}}` | Full confirmation URL with token | `https://project.supabase.co/auth/v1/verify?token=abc123...` |
| `{{.Token}}` | 6-digit OTP code | `123456` |
| `{{.TokenHash}}` | Hashed token for custom URLs | `abc123def456...` |
| `{{.SiteURL}}` | Your application URL | `https://tradelia.org` |
| `{{.Data.field}}` | User metadata fields | `{{.Data.first_name}}` |

**Important**: Do NOT modify these variables in the templates. Supabase will replace them automatically.

## Testing

### Send Test Emails

1. In Supabase Dashboard → Authentication → Email Templates
2. Click **"Send test email"** button for each template
3. Enter your test email address
4. Check your inbox

### Test Checklist

For each email template, verify:

- [ ] Email arrives in inbox (not spam)
- [ ] Subject line is correct
- [ ] Both English and Italian sections are visible
- [ ] Language navigation buttons (🇬🇧 🇮🇹) work
- [ ] CTA button is clickable and styled correctly
- [ ] Confirmation URL works
- [ ] Footer links work
- [ ] Logo displays correctly
- [ ] Gradient header displays correctly
- [ ] Text is readable on mobile
- [ ] Plain text version is readable

### Email Client Testing

Test in multiple email clients:

**Desktop**:
- Gmail (web)
- Outlook (Windows)
- Outlook (Mac)
- Apple Mail (macOS)

**Mobile**:
- Gmail (iOS)
- Gmail (Android)
- Apple Mail (iOS)
- Outlook (iOS/Android)

**With Images Blocked**:
- Test with images disabled in email client
- Verify logo SVG still displays (inline SVG)
- Verify text is still readable

## Troubleshooting

### Email Not Arriving

1. Check Supabase logs: Dashboard → Logs → Auth Logs
2. Verify email service is configured: Dashboard → Settings → Auth
3. Check spam folder
4. Verify sender email is not blacklisted

### Template Variables Not Replaced

- Ensure you're using correct Go template syntax: `{{.VariableName}}`
- Check Supabase documentation for available variables
- Verify template is saved correctly in dashboard

### Styling Issues

- Ensure all styles are inline (no `<style>` tags)
- Test in multiple email clients
- Check for email client-specific CSS limitations
- Use table-based layout (not flexbox/grid)

### Links Not Working

- Verify `{{.ConfirmationURL}}` is not modified
- Check `{{.SiteURL}}` is configured in Supabase project settings
- Test links in different email clients

## Customization

### Changing Colors

To change brand colors, find and replace:

- **Primary Blue**: `#1D4ED8` → Your color
- **Accent Green**: `#059669` → Your color
- **Purple Gradient**: `#667eea` and `#764ba2` → Your colors

### Changing Logo

Replace the SVG code in the header section with your logo:

```html
<svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;" role="img" aria-label="Your Logo">
  <!-- Your SVG paths here -->
</svg>
```

**Important**: Use inline SVG (not `<img>` tag) to avoid external image loading issues.

### Changing Text

Edit the text directly in the HTML and TXT files. Remember to update both:
- English section (`id="en"`)
- Italian section (`id="it"`)

## Maintenance

### Updating Templates

1. Edit the `.html` and `.txt` files locally
2. Test changes locally (open HTML in browser)
3. Copy updated content to Supabase Dashboard
4. Send test emails to verify changes
5. Commit changes to version control

### Version Control

Keep templates in version control:

```bash
git add supabase/email-templates/
git commit -m "Update email templates"
git push
```

## Support

For issues or questions:

- **Supabase Docs**: https://supabase.com/docs/guides/auth/auth-email-templates
- **Email Template Best Practices**: See `README.md` in this directory
- **Tradelia Support**: Contact your team lead

## Compliance

These templates comply with:

- ✅ WCAG 2.2 AA accessibility standards
- ✅ Email client compatibility (Gmail, Outlook, Apple Mail)
- ✅ Mobile responsiveness
- ✅ Screen reader compatibility
- ✅ CAN-SPAM Act requirements (unsubscribe not needed for transactional emails)

---

**Last Updated**: January 2026
**Template Version**: 1.0.0
