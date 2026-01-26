/**
 * Contact Form - Team Notification Email (to support@)
 *
 * Sent to support team when user submits contact form.
 * Includes all details and metadata for quick response.
 */

import { baseLayout, plainTextLayout } from './base-layout';
import type { EmailTemplate, EmailTemplateData, Locale } from './types';

const inquiryTypeLabels: Record<string, { it: string; en: string }> = {
  general: { it: 'Richiesta Generale', en: 'General Inquiry' },
  technical: { it: 'Supporto Tecnico', en: 'Technical Support' },
  account: { it: 'Problema Account', en: 'Account Issue' },
  billing: { it: 'Domanda Fatturazione', en: 'Billing Question' },
  feedback: { it: 'Feedback', en: 'Feedback' },
  other: { it: 'Altro', en: 'Other' },
};

const inquiryTypeColors: Record<string, string> = {
  general: '#6b7280',
  technical: '#dc2626',
  account: '#ea580c',
  billing: '#059669',
  feedback: '#1D4ED8',
  other: '#6b7280',
};

export const contactNotificationTemplate: EmailTemplate = {
  subject: (locale: Locale, data: EmailTemplateData) => {
    const typeLabel = inquiryTypeLabels[data.inquiryType]?.[locale] || data.inquiryType;
    return `🎫 New Ticket ${data.ticketId} - ${typeLabel}`;
  },

  html: (locale: Locale, data: EmailTemplateData) => {
    const typeLabel = inquiryTypeLabels[data.inquiryType]?.[locale] || data.inquiryType;
    const typeColor = inquiryTypeColors[data.inquiryType] || '#6b7280';
    const formattedDate = data.createdAt.toLocaleString(locale === 'it' ? 'it-IT' : 'en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const content = `
      <!-- Ticket Header -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
        <tr>
          <td>
            <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              TICKET ID
            </p>
            <p style="color: #111827; margin: 0; font-size: 24px; font-weight: 600; font-family: 'Courier New', monospace;">
              ${data.ticketId}
            </p>
          </td>
          <td align="right">
            <span style="display: inline-block; background-color: ${typeColor}; color: white; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              ${typeLabel}
            </span>
          </td>
        </tr>
      </table>
      
      <!-- Contact Information -->
      <div style="background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 24px;">
        <p style="color: #667eea; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          Contact Information
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding: 8px 0; width: 120px;">
              <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                Name:
              </p>
            </td>
            <td style="padding: 8px 0;">
              <p style="color: #111827; margin: 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                ${data.name}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                Email:
              </p>
            </td>
            <td style="padding: 8px 0;">
              <p style="color: #111827; margin: 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a>
              </p>
            </td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 8px 0;">
              <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                Phone:
              </p>
            </td>
            <td style="padding: 8px 0;">
              <p style="color: #111827; margin: 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a>
              </p>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0;">
              <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                Locale:
              </p>
            </td>
            <td style="padding: 8px 0;">
              <p style="color: #111827; margin: 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                ${locale === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Subject -->
      <div style="margin-bottom: 24px;">
        <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          SUBJECT
        </p>
        <p style="color: #111827; margin: 0; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${data.subject}
        </p>
      </div>
      
      <!-- Message -->
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          MESSAGE
        </p>
        <p style="color: #111827; margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          ${data.message}
        </p>
      </div>
      
      <!-- Reply CTA -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)} [${data.ticketId}]" style="display: inline-block; background-color: #667eea; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              Reply to ${data.name}
            </a>
          </td>
        </tr>
      </table>
      
      <!-- Metadata -->
      <div style="background-color: #f9fafb; border-radius: 4px; padding: 16px; margin-top: 24px;">
        <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          Received: ${formattedDate}
        </p>
      </div>
    `;

    const footer = `
      <p style="color: #6b7280; margin: 0; font-size: 13px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        Tradelia Support System • <a href="${data.siteUrl}" style="color: #667eea; text-decoration: none;">tradelia.org</a>
      </p>
    `;

    return baseLayout({
      title: `New Ticket ${data.ticketId}`,
      heading: `New Support Ticket`,
      content,
      footer,
      locale: 'en', // Team emails always in English
    });
  },

  text: (locale: Locale, data: EmailTemplateData) => {
    const typeLabel = inquiryTypeLabels[data.inquiryType]?.[locale] || data.inquiryType;
    const formattedDate = data.createdAt.toLocaleString(locale === 'it' ? 'it-IT' : 'en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const content = `
TICKET ID: ${data.ticketId}
TYPE: ${typeLabel}

CONTACT INFORMATION
-------------------
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Locale: ${locale === 'it' ? 'Italiano' : 'English'}

SUBJECT
-------
${data.subject}

MESSAGE
-------
${data.message}

REPLY TO
--------
${data.email}

METADATA
--------
Received: ${formattedDate}
    `.trim();

    const footer = `
Tradelia Support System
${data.siteUrl}
    `.trim();

    return plainTextLayout({
      heading: 'New Support Ticket',
      content,
      footer,
    });
  },
};
