/**
 * Contact Form - Confirmation Email (to user)
 *
 * Sent immediately after user submits contact form.
 * Confirms receipt and provides ticket ID for tracking.
 */

import { baseLayout, plainTextLayout } from './base-layout';
import type { EmailTemplate, EmailTemplateData, Locale } from './types';

const translations = {
  it: {
    subject: (ticketId: string) => `✅ Messaggio ricevuto - Ticket ${ticketId}`,
    heading: 'Grazie per averci contattato!',
    greeting: (name: string) => `Ciao ${name},`,
    body1: 'Abbiamo ricevuto il tuo messaggio e il nostro team lo esaminerà a breve.',
    ticketLabel: 'Numero Ticket',
    subjectLabel: 'Oggetto',
    responseTime: 'Tempo di risposta atteso',
    responseTimeValue: '24-48 ore',
    whatNext: 'Cosa succede ora?',
    step1: 'Il nostro team esaminerà la tua richiesta',
    step2: 'Riceverai una risposta via email',
    step3: 'Controlla la cartella spam se non vedi la nostra risposta',
    needHelp: 'Hai bisogno di aiuto immediato?',
    visitFaq: 'Visita le FAQ',
    emailUs: 'Scrivici',
    footerText: 'Questo è un messaggio automatico. Per favore non rispondere a questa email.',
    footerLinks: 'Tradelia • Sito Web • Supporto',
    copyright: '© 2026 Tradelia. Tutti i diritti riservati.',
  },
  en: {
    subject: (ticketId: string) => `✅ Message received - Ticket ${ticketId}`,
    heading: 'Thank You for Contacting Us!',
    greeting: (name: string) => `Hi ${name},`,
    body1: 'We\'ve received your message and our support team will review it shortly.',
    ticketLabel: 'Ticket Number',
    subjectLabel: 'Subject',
    responseTime: 'Expected response time',
    responseTimeValue: '24-48 hours',
    whatNext: 'What happens next?',
    step1: 'Our team will review your request',
    step2: 'You\'ll receive a response via email',
    step3: 'Check your spam folder if you don\'t see our reply',
    needHelp: 'Need immediate help?',
    visitFaq: 'Visit FAQ',
    emailUs: 'Email Us',
    footerText: 'This is an automated message. Please do not reply to this email.',
    footerLinks: 'Tradelia • Website • Support',
    copyright: '© 2026 Tradelia. All rights reserved.',
  },
};

export const contactConfirmationTemplate: EmailTemplate = {
  subject: (locale: Locale, data: EmailTemplateData) => {
    const t = translations[locale];
    return t.subject(data.ticketId);
  },

  html: (locale: Locale, data: EmailTemplateData) => {
    const t = translations[locale];

    const content = `
      <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.greeting(data.name)}
      </p>
      
      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.body1}
      </p>
      
      <!-- Ticket Info Box -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-bottom: 12px;">
                  <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.ticketLabel}
                  </p>
                  <p style="color: #111827; margin: 4px 0 0 0; font-size: 18px; font-weight: 600; font-family: 'Courier New', monospace;">
                    ${data.ticketId}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px;">
                  <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.subjectLabel}
                  </p>
                  <p style="color: #111827; margin: 4px 0 0 0; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${data.subject}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.responseTime}
                  </p>
                  <p style="color: #059669; margin: 4px 0 0 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.responseTimeValue}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- What's Next -->
      <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin-bottom: 32px;">
        <p style="color: #667eea; margin: 0 0 12px 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${t.whatNext}
        </p>
        <ul style="color: #4b5563; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <li>${t.step1}</li>
          <li>${t.step2}</li>
          <li>${t.step3}</li>
        </ul>
      </div>
      
      <!-- CTA Buttons -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              ${t.needHelp}
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 0 8px;">
                  <a href="${data.faqUrl}" style="display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.visitFaq}
                  </a>
                </td>
                <td style="padding: 0 8px;">
                  <a href="mailto:${data.supportEmail}" style="display: inline-block; background-color: white; color: #667eea; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; border: 2px solid #667eea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.emailUs}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    const footer = `
      <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.footerText}
      </p>
      <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <a href="${data.siteUrl}" style="color: #667eea; text-decoration: none; margin: 0 8px;">Tradelia</a>
        <span style="color: #d1d5db;">•</span>
        <a href="${data.siteUrl}" style="color: #667eea; text-decoration: none; margin: 0 8px;">${locale === 'it' ? 'Sito Web' : 'Website'}</a>
        <span style="color: #d1d5db;">•</span>
        <a href="${data.siteUrl}/contact" style="color: #667eea; text-decoration: none; margin: 0 8px;">${locale === 'it' ? 'Supporto' : 'Support'}</a>
      </p>
      <p style="color: #9ca3af; margin: 0; font-size: 13px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.copyright}
      </p>
    `;

    return baseLayout({
      title: t.subject(data.ticketId),
      heading: t.heading,
      content,
      footer,
      locale,
    });
  },

  text: (locale: Locale, data: EmailTemplateData) => {
    const t = translations[locale];

    const content = `
${t.greeting(data.name)}

${t.body1}

${t.ticketLabel}: ${data.ticketId}
${t.subjectLabel}: ${data.subject}
${t.responseTime}: ${t.responseTimeValue}

${t.whatNext}
• ${t.step1}
• ${t.step2}
• ${t.step3}

${t.needHelp}
${t.visitFaq}: ${data.faqUrl}
${t.emailUs}: ${data.supportEmail}
    `.trim();

    const footer = `
${t.footerText}

Tradelia
${data.siteUrl}
${t.copyright}
    `.trim();

    return plainTextLayout({
      heading: t.heading,
      content,
      footer,
    });
  },
};
