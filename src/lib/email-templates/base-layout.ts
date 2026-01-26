/**
 * Base Email Layout
 *
 * Shared HTML structure for all contact form emails.
 * Follows 2025 best practices: minimalist, mobile-first, accessible.
 *
 * Based on tier-1 research from Postmark, MailerSend, Chamaileon.
 */

type BaseLayoutProps = {
  title: string;
  heading: string;
  content: string;
  footer: string;
  locale: 'it' | 'en';
};

/**
 * Generate base HTML layout for emails
 *
 * Features:
 * - Minimalist design with whitespace
 * - Mobile-first responsive
 * - Table-based layout (email client compatibility)
 * - Inline styles only (Gmail compatibility)
 * - WCAG 2.2 AA accessible
 */
export function baseLayout({
  title,
  heading,
  content,
  footer,
  locale,
}: BaseLayoutProps): string {
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  
  <!-- Email Container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Content Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <!-- Logo Header with Gradient -->
          <tr>
            <td align="center" style="padding: 48px 40px 32px 40px;">
              <svg width="40" height="40" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tradelia Logo">
                <defs>
                  <linearGradient id="tradelia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#tradelia-gradient)"/>
                <path d="M8 11h16M16 11v12" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <circle cx="22" cy="11" r="2" fill="#10b981"/>
              </svg>
            </td>
          </tr>
          
          <!-- Heading -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <h1 style="color: #111827; margin: 0; font-size: 28px; font-weight: 600; line-height: 1.2; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                ${heading}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 48px 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              ${footer}
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;
}

/**
 * Generate plain text version of email
 *
 * Required for:
 * - Accessibility (screen readers)
 * - Email clients that don't support HTML
 * - Spam filter compliance
 */
export function plainTextLayout({
  heading,
  content,
  footer,
}: {
  heading: string;
  content: string;
  footer: string;
}): string {
  return `
TRADELIA
========

${heading}

${content}

---

${footer}
`.trim();
}
