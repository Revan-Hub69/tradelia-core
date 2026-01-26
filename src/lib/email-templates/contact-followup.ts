/**
 * Contact Form - Follow-up Email (to user after 24h)
 *
 * Sent automatically 24 hours after initial contact if no response received.
 * Reminds user about their ticket and offers additional help.
 */

import { baseLayout, plainTextLayout } from './base-layout';
import type { EmailTemplate, EmailTemplateData, Locale } from './types';

const translations = {
  it: {
    subject: (ticketId: string) => `👋 Hai ancora bisogno di aiuto? - Ticket ${ticketId}`,
    heading: 'Ci sei ancora?',
    greeting: (name: string) => `Ciao ${name},`,
    body1: 'Abbiamo notato che non abbiamo ancora ricevuto una risposta al tuo messaggio.',
    body2: 'Il tuo ticket è ancora aperto e siamo qui per aiutarti.',
    ticketLabel: 'Numero Ticket',
    subjectLabel: 'Oggetto Originale',
    stillNeedHelp: 'Hai ancora bisogno di aiuto?',
    option1Title: '📧 Rispondi a questa email',
    option1Text: 'Scrivi direttamente a questa email e ti risponderemo al più presto.',
    option2Title: '❓ Consulta le FAQ',
    option2Text: 'Molte domande comuni hanno già una risposta nella nostra sezione FAQ.',
    option3Title: '💬 Contattaci di nuovo',
    option3Text: 'Se preferisci, puoi inviarci un nuovo messaggio tramite il form di contatto.',
    replyEmail: 'Rispondi',
    visitFaq: 'Visita FAQ',
    contactUs: 'Contattaci',
    resolved: 'Problema risolto?',
    resolvedText: 'Se hai già trovato una soluzione, puoi ignorare questa email. Il ticket verrà chiuso automaticamente dopo 7 giorni di inattività.',
    footerText: 'Questo è un promemoria automatico. Puoi rispondere direttamente a questa email.',
    copyright: '© 2026 Tradelia. Tutti i diritti riservati.',
  },
  en: {
    subject: (ticketId: string) => `👋 Still need help? - Ticket ${ticketId}`,
    heading: 'Are you still there?',
    greeting: (name: string) => `Hi ${name},`,
    body1: 'We noticed we haven\'t received a response to your message yet.',
    body2: 'Your ticket is still open and we\'re here to help.',
    ticketLabel: 'Ticket Number',
    subjectLabel: 'Original Subject',
    stillNeedHelp: 'Still need help?',
    option1Title: '📧 Reply to this email',
    option1Text: 'Write directly to this email and we\'ll respond as soon as possible.',
    option2Title: '❓ Check our FAQ',
    option2Text: 'Many common questions already have answers in our FAQ section.',
    option3Title: '💬 Contact us again',
    option3Text: 'If you prefer, you can send us a new message through the contact form.',
    replyEmail: 'Reply',
    visitFaq: 'Visit FAQ',
    contactUs: 'Contact Us',
    resolved: 'Problem solved?',
    resolvedText: 'If you\'ve already found a solution, you can ignore this email. The ticket will be automatically closed after 7 days of inactivity.',
    footerText: 'This is an automated reminder. You can reply directly to this email.',
    copyright: '© 2026 Tradelia. All rights reserved.',
  },
};

export const contactFollowupTemplate: EmailTemplate = {
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
      
      <p style="color: #4b5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.body1}
      </p>
      
      <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.body2}
      </p>
      
      <!-- Ticket Reference -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-bottom: 12px;">
                  <p style="color: #6b7280; margin: 0; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.ticketLabel}
                  </p>
                  <p style="color: #111827; margin: 4px 0 0 0; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                    ${data.ticketId}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="color: #6b7280; margin: 0; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.subjectLabel}
                  </p>
                  <p style="color: #111827; margin: 4px 0 0 0; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${data.subject}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Help Options -->
      <div style="margin-bottom: 32px;">
        <p style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${t.stillNeedHelp}
        </p>
        
        <!-- Option 1 -->
        <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #111827; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            ${t.option1Title}
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            ${t.option1Text}
          </p>
        </div>
        
        <!-- Option 2 -->
        <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #111827; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            ${t.option2Title}
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            ${t.option2Text}
          </p>
        </div>
        
        <!-- Option 3 -->
        <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
          <p style="color: #111827; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            ${t.option3Title}
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            ${t.option3Text}
          </p>
        </div>
      </div>
      
      <!-- CTA Buttons -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding: 0 6px;">
                  <a href="mailto:${data.supportEmail}?subject=Re: ${encodeURIComponent(data.subject)} [${data.ticketId}]" style="display: inline-block; background-color: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.replyEmail}
                  </a>
                </td>
                <td style="padding: 0 6px;">
                  <a href="${data.faqUrl}" style="display: inline-block; background-color: white; color: #667eea; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; border: 2px solid #667eea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.visitFaq}
                  </a>
                </td>
                <td style="padding: 0 6px;">
                  <a href="${data.siteUrl}/contact" style="display: inline-block; background-color: white; color: #6b7280; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; border: 2px solid #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    ${t.contactUs}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <!-- Resolved Notice -->
      <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 16px; border-radius: 4px; margin-top: 32px;">
        <p style="color: #059669; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${t.resolved}
        </p>
        <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${t.resolvedText}
        </p>
      </div>
    `;

    const footer = `
      <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 14px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        ${t.footerText}
      </p>
      <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <a href="${data.siteUrl}" style="color: #667eea; text-decoration: none; margin: 0 8px;">Tradelia</a>
        <span style="color: #d1d5db;">•</span>
        <a href="${data.faqUrl}" style="color: #667eea; text-decoration: none; margin: 0 8px;">FAQ</a>
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
${t.body2}

${t.ticketLabel}: ${data.ticketId}
${t.subjectLabel}: ${data.subject}

${t.stillNeedHelp}

${t.option1Title}
${t.option1Text}

${t.option2Title}
${t.option2Text}

${t.option3Title}
${t.option3Text}

${t.replyEmail}: ${data.supportEmail}
${t.visitFaq}: ${data.faqUrl}
${t.contactUs}: ${data.siteUrl}/contact

${t.resolved}
${t.resolvedText}
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
