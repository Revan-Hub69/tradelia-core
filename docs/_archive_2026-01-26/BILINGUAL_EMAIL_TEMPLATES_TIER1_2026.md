# Bilingual Email Templates - Tier 1 Research (2026)

**Status**: Research Complete  
**Date**: January 25, 2026  
**Feature**: Supabase Bilingual Email Templates  
**Spec**: `.kiro/specs/supabase-bilingual-email-templates/`

## Executive Summary

This document contains tier-1 research from authoritative sources on implementing bilingual (English/Italian) authentication email templates for Supabase Auth. The research focuses on email client compatibility, bilingual email patterns, Supabase customization capabilities, and accessibility requirements.

## Research Questions

1. What are the technical limitations of email clients regarding CSS, JavaScript, and modern web features?
2. What are the best practices for implementing bilingual emails that work across all email clients?
3. How does Supabase Auth email customization work, and what templating features are available?
4. What accessibility requirements must be met for email templates to be WCAG 2.2 AA compliant?

---

## 1. Email Client Compatibility

### Source: Campaign Monitor CSS Guide
**URL**: https://www.campaignmonitor.com/css/  
**Authority**: Industry-standard email CSS support reference  
**Date Accessed**: January 2026

#### Key Findings

**JavaScript Support**:
- JavaScript is blocked by all major email clients for security reasons
- Event handlers (`onclick`, `onload`, `onmouseover`) are stripped
- No client-side interactivity is possible in emails

**CSS Support Limitations**:
- Gmail (web) strips `<style>` tags entirely
- Outlook uses Microsoft Word rendering engine (limited CSS support)
- Modern CSS features not supported:
  - `display: flex` (partial support in some clients)
  - `display: grid` (no support)
  - `backdrop-filter` (no support)
  - CSS animations (limited support)
  - CSS transforms (limited support)

**Recommended Approach**:
- Use inline styles exclusively (`style` attribute on elements)
- Use table-based layouts for maximum compatibility
- Avoid external stylesheets (`<link>` tags)
- Test across multiple email clients

### Source: Mailmodo Email CSS Support Guide
**URL**: https://mailmodo.com/guides/email-css-support/  
**Authority**: Email development platform documentation  
**Date Accessed**: January 2026

#### Key Findings

**Email Client Rendering Engines**:
- Gmail: Custom rendering engine (strips `<style>` tags)
- Outlook (Windows): Microsoft Word HTML renderer
- Outlook (Mac): WebKit-based renderer
- Apple Mail: WebKit-based renderer (best CSS support)
- Mobile clients: Vary by platform and app

**Best Practices**:
- Use `role="presentation"` on layout tables
- Set `cellpadding="0" cellspacing="0" border="0"` on all tables
- Use `max-width` instead of `width` for responsive design
- Provide fallback colors for gradients
- Use system fonts for maximum compatibility

**Media Query Support**:
- Supported in: Apple Mail, Gmail app (iOS/Android), Outlook app
- Not supported in: Gmail web, Outlook (Windows)
- Use inline styles as primary styling method

---

## 2. Bilingual Email Patterns

### Source: Flodesk Bilingual Email Templates Guide
**URL**: https://flodesk.com/tips/bilingual-email-templates  
**Authority**: Email marketing platform best practices  
**Date Accessed**: January 2026

#### Key Findings

**Recommended Pattern: Visible Dual-Section Layout**:
- Display both languages in a single email
- Add "jump to language" navigation links at the top
- Use anchor links (`<a href="#en">`) to scroll to sections
- Clearly separate language sections with visual dividers

**Advantages**:
- Works without JavaScript or CSS tricks
- Accessible to all users regardless of email client
- No need to detect user language preference
- Users can see both languages if needed

**Implementation**:
```html
<!-- Navigation -->
<a href="#en">English</a> | <a href="#it">Italiano</a>

<!-- English Section -->
<div id="en" lang="en">
  <!-- English content -->
</div>

<!-- Italian Section -->
<div id="it" lang="it">
  <!-- Italian content -->
</div>
```

### Source: UX StackExchange - Bilingual Email Best Practices
**URL**: https://ux.stackexchange.com/questions/90494/best-practices-for-bilingual-email  
**Authority**: UX community consensus  
**Date Accessed**: January 2026

#### Key Findings

**Alternative Patterns Considered**:

1. **CSS-only toggle using `:target`**:
   - Uses `:target` pseudo-class to show/hide sections
   - **Problem**: Poor email client support, doesn't work in Gmail
   - **Verdict**: Not recommended for email

2. **Separate emails per language**:
   - Send different email based on user preference
   - **Problem**: Requires language detection, extra complexity
   - **Verdict**: Overkill for authentication emails

3. **Visible both languages with navigation**:
   - Show both languages, provide jump links
   - **Problem**: None (works everywhere)
   - **Verdict**: Recommended approach

**Accessibility Considerations**:
- Use `lang` attribute on language sections
- Provide clear visual separation between languages
- Use flag emojis or text labels for language indicators
- Ensure navigation links are touch-friendly (44x44px minimum)

---

## 3. Supabase Email Customization

### Source: Supabase Auth Email Templates Documentation
**URL**: https://supabase.com/docs/guides/auth/auth-email-templates  
**Authority**: Official Supabase documentation  
**Date Accessed**: January 2026

#### Key Findings

**Email Template Types**:
Supabase Auth supports four email template types:
1. **Confirm Signup**: Sent when user signs up with email/password
2. **Magic Link**: Sent when user requests passwordless login
3. **Change Email Address**: Sent when user changes their email
4. **Reset Password**: Sent when user requests password reset

**Template Variables**:
Supabase provides Go template variables for dynamic content:
- `{{.ConfirmationURL}}`: Full confirmation URL with token
- `{{.Token}}`: 6-digit OTP code
- `{{.TokenHash}}`: Hashed token for custom URLs
- `{{.SiteURL}}`: Application site URL
- `{{.Data.field_name}}`: User metadata fields

**Customization Location**:
- Dashboard: Authentication > Email Templates
- Each template has HTML and plain text versions
- Templates use Go templating language
- Changes take effect immediately (no deployment needed)

### Source: Supabase - Customizing Emails by Language
**URL**: https://supabase.com/docs/guides/troubleshooting/customizing-emails-by-language-KZ_38Q  
**Authority**: Official Supabase troubleshooting guide  
**Date Accessed**: January 2026

#### Key Findings

**Conditional Logic in Templates**:
Go templates support conditional logic for language-specific content:

```go
{{if .Data.preferred_language}}
  {{if eq .Data.preferred_language "it"}}
    <!-- Italian content -->
  {{else}}
    <!-- English content -->
  {{end}}
{{else}}
  <!-- Default language -->
{{end}}
```

**User Metadata Access**:
- Store user language preference in `user_metadata`
- Access via `{{.Data.preferred_language}}`
- Set during signup or in user profile

**Best Practice for Bilingual**:
- Include both languages in single template
- Use conditional logic to reorder sections based on preference
- Provide navigation links for both languages

---

## 4. Email Accessibility

### Source: Canada.ca - Making Accessible Emails
**URL**: https://a11y.canada.ca/en/making-accessible-emails/  
**Authority**: Government accessibility guidelines  
**Date Accessed**: January 2026

#### Key Findings

**Semantic HTML Requirements**:
- Use proper heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
- Use `<p>` tags for paragraphs (not `<div>` with styling)
- Use `<ul>` and `<ol>` for lists
- Use `<table>` only for data tables (use `role="presentation"` for layout)

**Language Attributes**:
- Set `lang` attribute on `<html>` element
- Use `lang` attribute on sections with different languages
- Example: `<div lang="en">` and `<div lang="it">`
- Helps screen readers pronounce content correctly

**Image Accessibility**:
- Provide descriptive `alt` text for all images
- Use `alt=""` for decorative images
- For logos, use `alt="Company Name"`
- Ensure images are not the only way to convey information

**Link Text**:
- Use descriptive link text (not "click here")
- Link text should make sense out of context
- Example: "Confirm your email address" (not "Click here to confirm")

### Source: Boise State University - Email Accessibility Checklist
**URL**: https://www.boisestate.edu/webguide/email-accessibility-checklist/  
**Authority**: University accessibility standards  
**Date Accessed**: January 2026

#### Key Findings

**Color Contrast Requirements (WCAG 2.2 AA)**:
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px or ≥ 14px bold): 3:1 contrast ratio
- Use tools like WebAIM Contrast Checker to verify

**Plain Text Version**:
- Always provide plain text alternative
- Screen readers may prefer plain text version
- Some email clients only display plain text
- Plain text should convey same information as HTML

**Touch Target Size**:
- Minimum 44x44px for touch targets (buttons, links)
- Especially important for mobile email clients
- Add sufficient padding to clickable elements

**Font Size**:
- Minimum 14px for body text
- Minimum 16px for better readability
- Avoid using font sizes smaller than 12px

---

## 5. Email Performance and Deliverability

### Source: Litmus - Email File Size Best Practices
**URL**: https://www.litmus.com/blog/email-file-size-best-practices  
**Authority**: Email testing platform  
**Date Accessed**: January 2026

#### Key Findings

**HTML Size Limits**:
- Gmail clips emails over 102KB (displays "[Message clipped]")
- Recommended maximum: 100KB for HTML content
- Minimize whitespace and comments in production
- Compress images and optimize SVGs

**Image Optimization**:
- Maximum width: 600px (standard email width)
- Use appropriate image formats (JPEG for photos, PNG for graphics)
- Compress images (aim for < 1MB total)
- Consider using inline SVG for logos (no external request)

**Spam Trigger Words**:
- Avoid: "FREE!!!", "ACT NOW", "LIMITED TIME", "CLICK HERE NOW"
- Avoid excessive punctuation (!!!, ???)
- Avoid all caps in subject lines
- Use proper grammar and spelling

---

## Recommendations

Based on this tier-1 research, the following approach is recommended:

### 1. Email Structure
- ✅ Use visible dual-section layout (both languages always visible)
- ✅ Add anchor-based navigation links at top
- ✅ Use table-based layout for maximum compatibility
- ✅ Apply all styles inline (no `<style>` tags or external CSS)

### 2. Supabase Integration
- ✅ Use Go template variables for dynamic content
- ✅ Implement all four auth email types
- ✅ Add conditional logic for language preference (optional enhancement)
- ✅ Test templates in Supabase Dashboard before deployment

### 3. Accessibility
- ✅ Use semantic HTML with proper heading hierarchy
- ✅ Add `lang` attributes to language sections
- ✅ Provide descriptive alt text for all images
- ✅ Ensure 4.5:1 color contrast for text
- ✅ Include plain text version for each template
- ✅ Use descriptive link text

### 4. Performance
- ✅ Keep HTML under 100KB
- ✅ Optimize images (max 600px width)
- ✅ Use inline SVG for logo (no external image)
- ✅ Avoid spam trigger words

### 5. Testing
- ✅ Test in Gmail (web, iOS, Android)
- ✅ Test in Outlook (Windows, Mac, web)
- ✅ Test in Apple Mail (macOS, iOS)
- ✅ Test with screen readers (NVDA, VoiceOver)
- ✅ Verify spam score with Mail Tester

---

## References

1. Campaign Monitor. (2026). *CSS Support Guide for Email Clients*. https://www.campaignmonitor.com/css/
2. Mailmodo. (2026). *Email CSS Support Guide*. https://mailmodo.com/guides/email-css-support/
3. Flodesk. (2026). *Bilingual Email Templates*. https://flodesk.com/tips/bilingual-email-templates
4. UX StackExchange. (2026). *Best Practices for Bilingual Email*. https://ux.stackexchange.com/questions/90494/
5. Supabase. (2026). *Auth Email Templates Documentation*. https://supabase.com/docs/guides/auth/auth-email-templates
6. Supabase. (2026). *Customizing Emails by Language*. https://supabase.com/docs/guides/troubleshooting/customizing-emails-by-language-KZ_38Q
7. Canada.ca. (2026). *Making Accessible Emails*. https://a11y.canada.ca/en/making-accessible-emails/
8. Boise State University. (2026). *Email Accessibility Checklist*. https://www.boisestate.edu/webguide/email-accessibility-checklist/
9. Litmus. (2026). *Email File Size Best Practices*. https://www.litmus.com/blog/email-file-size-best-practices

---

## Appendix: Email Client CSS Support Matrix

| Feature | Gmail (Web) | Gmail (App) | Outlook (Win) | Outlook (Mac) | Apple Mail |
|---------|-------------|-------------|---------------|---------------|------------|
| `<style>` tags | ❌ | ✅ | ⚠️ Partial | ✅ | ✅ |
| Inline styles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Media queries | ❌ | ✅ | ❌ | ⚠️ Partial | ✅ |
| Flexbox | ❌ | ⚠️ Partial | ❌ | ❌ | ⚠️ Partial |
| Grid | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gradients | ✅ | ✅ | ❌ | ✅ | ✅ |
| Box shadow | ✅ | ✅ | ❌ | ✅ | ✅ |
| Border radius | ✅ | ✅ | ⚠️ Partial | ✅ | ✅ |
| Web fonts | ❌ | ❌ | ❌ | ❌ | ⚠️ Partial |

**Legend**: ✅ Full support | ⚠️ Partial support | ❌ No support

---

**Document Version**: 1.0  
**Last Updated**: January 25, 2026  
**Next Review**: As needed for implementation updates
