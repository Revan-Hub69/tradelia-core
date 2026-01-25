# V2 Email Templates - Deployment Checklist

Use this checklist to deploy the V2 email templates to Supabase.

## Pre-Deployment

### 1. Review Templates
- [ ] Read `README.md` for complete documentation
- [ ] Review `COMPARISON.md` to understand V1 vs V2 differences
- [ ] Open `example-rendered-en.html` in browser to preview English version
- [ ] Open `example-rendered-it.html` in browser to preview Italian version
- [ ] Verify all 4 HTML templates exist
- [ ] Verify all 4 TXT templates exist

### 2. Backup Current Templates
- [ ] Go to Supabase Dashboard → Authentication → Email Templates
- [ ] Copy current "Confirm signup" template to a backup file
- [ ] Copy current "Magic Link" template to a backup file
- [ ] Copy current "Change Email Address" template to a backup file
- [ ] Copy current "Reset Password" template to a backup file

## Deployment Steps

### Template 1: Confirm Signup

- [ ] Open `confirm-signup.html` in your editor
- [ ] Copy entire content (Ctrl+A, Ctrl+C)
- [ ] Go to Supabase Dashboard → Authentication → Email Templates
- [ ] Click "Confirm signup"
- [ ] **Subject line**: `Verify your email - expires in 24h`
- [ ] Paste HTML content into "Message (HTML)" field
- [ ] Open `confirm-signup.txt` in your editor
- [ ] Copy entire content
- [ ] Click "Plain text" tab
- [ ] Paste TXT content
- [ ] Click "Save"
- [ ] Send test email to verify

### Template 2: Magic Link

- [ ] Open `magic-link.html` in your editor
- [ ] Copy entire content
- [ ] Go to "Magic Link" template in Supabase
- [ ] **Subject line**: `Sign in to Tradelia - expires in 1h`
- [ ] Paste HTML content into "Message (HTML)" field
- [ ] Open `magic-link.txt` in your editor
- [ ] Copy entire content
- [ ] Click "Plain text" tab
- [ ] Paste TXT content
- [ ] Click "Save"
- [ ] Send test email to verify

### Template 3: Change Email

- [ ] Open `change-email.html` in your editor
- [ ] Copy entire content
- [ ] Go to "Change Email Address" template in Supabase
- [ ] **Subject line**: `Confirm new email - expires in 24h`
- [ ] Paste HTML content into "Message (HTML)" field
- [ ] Open `change-email.txt` in your editor
- [ ] Copy entire content
- [ ] Click "Plain text" tab
- [ ] Paste TXT content
- [ ] Click "Save"
- [ ] Send test email to verify

### Template 4: Reset Password

- [ ] Open `reset-password.html` in your editor
- [ ] Copy entire content
- [ ] Go to "Reset Password" template in Supabase
- [ ] **Subject line**: `Reset password - expires in 1h`
- [ ] Paste HTML content into "Message (HTML)" field
- [ ] Open `reset-password.txt` in your editor
- [ ] Copy entire content
- [ ] Click "Plain text" tab
- [ ] Paste TXT content
- [ ] Click "Save"
- [ ] Send test email to verify

## Post-Deployment Testing

### Test User Language Detection

#### Test Italian User
- [ ] Create test user with Italian language:
```typescript
await supabase.auth.signUp({
  email: 'test-it@example.com',
  password: 'testpassword',
  options: {
    data: { language: 'it' }
  }
})
```
- [ ] Check email received
- [ ] Verify email is in Italian only
- [ ] Verify CTA button says "Verifica Email"
- [ ] Verify expiration says "24 ore"
- [ ] Click CTA to verify it works

#### Test English User
- [ ] Create test user with English language:
```typescript
await supabase.auth.signUp({
  email: 'test-en@example.com',
  password: 'testpassword',
  options: {
    data: { language: 'en' }
  }
})
```
- [ ] Check email received
- [ ] Verify email is in English only
- [ ] Verify CTA button says "Verify Email"
- [ ] Verify expiration says "24 hours"
- [ ] Click CTA to verify it works

#### Test Default (No Language Set)
- [ ] Create test user without language:
```typescript
await supabase.auth.signUp({
  email: 'test-default@example.com',
  password: 'testpassword'
})
```
- [ ] Check email received
- [ ] Verify email defaults to English
- [ ] Click CTA to verify it works

### Test All Email Types

#### Confirm Signup
- [ ] Sign up new user
- [ ] Receive confirmation email
- [ ] Verify correct language
- [ ] Click CTA button
- [ ] Verify account activated

#### Magic Link
- [ ] Request magic link sign-in
- [ ] Receive magic link email
- [ ] Verify correct language
- [ ] Click CTA button
- [ ] Verify signed in successfully

#### Change Email
- [ ] Request email change
- [ ] Receive change email confirmation
- [ ] Verify correct language
- [ ] Click CTA button
- [ ] Verify email changed

#### Reset Password
- [ ] Request password reset
- [ ] Receive reset email
- [ ] Verify correct language
- [ ] Click CTA button
- [ ] Verify can reset password

### Test Email Clients

- [ ] Gmail (web)
- [ ] Gmail (iOS app)
- [ ] Gmail (Android app)
- [ ] Outlook (web)
- [ ] Outlook (Windows desktop)
- [ ] Outlook (Mac desktop)
- [ ] Apple Mail (macOS)
- [ ] Apple Mail (iOS)
- [ ] Yahoo Mail
- [ ] ProtonMail

### Test Rendering

- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Mobile (320px - smallest)

### Test Accessibility

- [ ] Images blocked (logo should have alt text)
- [ ] Dark mode (if email client supports)
- [ ] Screen reader (NVDA or VoiceOver)
- [ ] Keyboard navigation
- [ ] High contrast mode

### Test Edge Cases

- [ ] Very long email address
- [ ] Very long confirmation URL
- [ ] Expired link behavior
- [ ] Already verified account
- [ ] Invalid token

## Configuration Verification

### Supabase Settings

- [ ] Go to Settings → Auth
- [ ] Verify **From** email: `Tradelia <noreply@tradelia.org>`
- [ ] Verify **Reply-to** email: `support@tradelia.org`
- [ ] Verify **Site URL**: `https://tradelia.app`
- [ ] Verify **Redirect URLs** include your domains

### User Metadata

- [ ] Verify language is saved in user metadata
- [ ] Check database: `auth.users` table → `raw_user_meta_data` column
- [ ] Should contain: `{"language": "it"}` or `{"language": "en"}`

## Monitoring

### Week 1: Track Metrics

- [ ] Open rate (target: 60-70%)
- [ ] Click-through rate (target: 30-40%)
- [ ] Time to action (target: <15 seconds)
- [ ] Mobile vs desktop engagement
- [ ] Language distribution (IT vs EN)

### Week 2: Gather Feedback

- [ ] User complaints about emails
- [ ] Support tickets related to verification
- [ ] Rendering issues reported
- [ ] Language preference issues

### Week 3: Optimize

- [ ] Adjust subject lines if needed
- [ ] Tweak CTA copy if needed
- [ ] Fix any rendering issues
- [ ] Update documentation

## Rollback Plan

If issues occur:

### Quick Rollback
1. [ ] Go to Supabase Dashboard → Authentication → Email Templates
2. [ ] Restore from backup files created in Pre-Deployment step
3. [ ] Save and test

### Partial Rollback
1. [ ] Keep working templates (e.g., confirm-signup)
2. [ ] Rollback problematic templates only
3. [ ] Fix issues in V2
4. [ ] Re-deploy fixed templates

## Success Criteria

Deployment is successful when:

- [x] All 4 templates deployed to Supabase
- [ ] Italian users receive Italian emails
- [ ] English users receive English emails
- [ ] Default users receive English emails
- [ ] All CTAs work correctly
- [ ] All links expire correctly
- [ ] Emails render correctly in major clients
- [ ] Mobile experience is excellent
- [ ] Accessibility requirements met
- [ ] No increase in support tickets
- [ ] Metrics meet or exceed targets

## Support

If you encounter issues:

1. Check `README.md` for usage instructions
2. Review `COMPARISON.md` for V1 vs V2 differences
3. Read `COMPLETION_SUMMARY.md` for overview
4. Check research: `../../docs/research/TRANSACTIONAL_EMAIL_BEST_PRACTICES_TIER1_2026.md`
5. Test with example files: `example-rendered-en.html` and `example-rendered-it.html`

## Notes

- Keep V1 templates as backup (don't delete)
- Document any customizations made
- Update this checklist if you add new templates
- Share feedback with the team

---

**Version**: 2.0
**Date**: January 2026
**Status**: Ready for Deployment
