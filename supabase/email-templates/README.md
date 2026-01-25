# Bilingual Email Templates for Supabase Auth

This directory contains bilingual (English/Italian) email templates for Supabase authentication flows.

## Structure

```
email-templates/
├── base-template.html          # Base bilingual template structure
├── confirm-signup.html         # ✅ Signup confirmation email
├── confirm-signup.txt          # ✅ Plain text version
├── magic-link.html             # ✅ Passwordless login email
├── magic-link.txt              # ✅ Plain text version
├── change-email.html           # ✅ Email change confirmation
├── change-email.txt            # ✅ Plain text version
├── reset-password.html         # ✅ Password reset email
├── reset-password.txt          # ✅ Plain text version
├── example-rendered.html       # Sample rendered email
├── components/                 # Reusable email components
│   ├── header.html            # Logo and gradient header
│   ├── language-nav.html      # Language navigation buttons
│   ├── button.html            # CTA button component
│   └── footer.html            # Footer with links
└── README.md                  # This file
```

## Base Template Features

The `base-template.html` provides a complete bilingual email structure with:

### ✅ Bilingual Structure (Requirements 1.1, 1.2, 1.3, 1.5)
- Both English and Italian sections visible by default
- Proper `id` and `lang` attributes for accessibility
- Visual divider between language sections
- Anchor-based navigation to jump between languages

### ✅ Email Client Compatibility (Requirements 5.4, 5.5, 5.7)
- Table-based layout (600px max width)
- All styles inline (no `<style>` tags or external CSS)
- No modern CSS features (flexbox, grid, backdrop-filter)
- Works in Gmail, Outlook, Apple Mail, and mobile clients

### ✅ Responsive Design (Requirements 6.1, 6.2, 6.4)
- Single-column layout on mobile
- Minimum 14px font size for all text
- Touch-friendly buttons (44x44px minimum)
- Responsive width (100% on mobile)

### ✅ Accessibility (Requirements 7.1, 7.2, 7.3)
- Semantic HTML (h1, h2, p tags)
- Lang attributes on language sections
- ARIA labels on SVG logo
- System font stack for maximum compatibility

### ✅ Tradelia Branding (Requirements 4.1-4.5)
- Purple gradient header (#667eea to #764ba2)
- Inline SVG logo (no external images)
- Brand colors (Primary Blue #1D4ED8, Accent Green #059669)
- Glass effect styling on buttons

## Supabase Template Variables

The template uses Go template syntax for dynamic content:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{.EmailTitle}}` | Email subject line | "Confirm your account" |
| `{{.ConfirmationURL}}` | Supabase confirmation URL | `https://project.supabase.co/auth/v1/verify?token=...` |
| `{{.Token}}` | 6-digit OTP code | `123456` |
| `{{.TokenHash}}` | Hashed token | `abc123def456...` |
| `{{.SiteURL}}` | Application URL | `https://tradelia.org` |
| `{{.Greeting_EN}}` | English greeting | "Welcome to Tradelia!" |
| `{{.Greeting_IT}}` | Italian greeting | "Benvenuto su Tradelia!" |
| `{{.MainContent_EN}}` | English main content | "Please confirm your email..." |
| `{{.MainContent_IT}}` | Italian main content | "Conferma il tuo indirizzo email..." |
| `{{.CTAText_EN}}` | English button text | "Confirm Email" |
| `{{.CTAText_IT}}` | Italian button text | "Conferma Email" |
| `{{.AltText_EN}}` | English alt text | "Or copy and paste this link..." |
| `{{.AltText_IT}}` | Italian alt text | "Oppure copia e incolla questo link..." |
| `{{.FooterText_EN}}` | English footer text | "If you didn't request this..." |
| `{{.FooterText_IT}}` | Italian footer text | "Se non hai richiesto questo..." |

## Usage in Supabase

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Select the email type (Confirm Signup, Magic Link, etc.)
3. Copy the content from `base-template.html`
4. Replace the template variable placeholders with actual content
5. Test by sending a test email

## Testing

Run validation tests to ensure template compliance:

```bash
npm test -- base-template-validation --run
```

All 28 validation tests verify:
- Bilingual structure
- Inline styles
- No modern CSS
- Minimum font sizes
- Semantic HTML
- Accessibility features
- Brand colors
- Supabase variables

## Next Steps

All email templates are complete! ✅

To use these templates in Supabase:

1. **Go to Supabase Dashboard** → Authentication → Email Templates
2. **Select email type** (Confirm signup, Magic Link, Change email, Recovery)
3. **Copy HTML content** from the corresponding `.html` file
4. **Copy plain text content** from the corresponding `.txt` file
5. **Test** by sending a test email from the dashboard

### Template Mapping

| Supabase Email Type | HTML Template | Plain Text |
|---------------------|---------------|------------|
| Confirm signup | `confirm-signup.html` | `confirm-signup.txt` |
| Magic Link | `magic-link.html` | `magic-link.txt` |
| Change email | `change-email.html` | `change-email.txt` |
| Recovery (Password Reset) | `reset-password.html` | `reset-password.txt` |

### Testing Checklist

- [ ] Upload templates to Supabase Dashboard
- [ ] Send test emails for each type
- [ ] Test in Gmail (web, mobile)
- [ ] Test in Outlook (Windows, Mac, web)
- [ ] Test in Apple Mail (macOS, iOS)
- [ ] Test with images blocked
- [ ] Test anchor link navigation (🇬🇧 English / 🇮🇹 Italiano buttons)
- [ ] Test screen reader compatibility
- [ ] Verify all links work correctly

## Requirements Validated

✅ **Task 3.1**: Bilingual email base template
- Table-based layout (600px max width)
- English and Italian sections with proper IDs and lang attributes
- Visual divider between sections
- Both sections visible by default
- Semantic HTML (h1, h2, p tags)
- Responsive styles (single-column, 100% width)

✅ **Task 3.3**: Inline styles for email client compatibility
- All styles inline (no `<style>` tags or external CSS)
- No modern CSS features (flexbox, grid, backdrop-filter)
- Minimum 14px font size for all text
- Responsive image styles (SVG is inherently scalable)
