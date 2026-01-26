/**
 * Email Template System Types
 *
 * Modular email template system for contact form and support emails.
 * Separate from Supabase auth templates.
 */

export type Locale = 'it' | 'en';

export type EmailTemplateData = {
  // User info
  name: string;
  email: string;
  phone?: string;

  // Ticket info
  ticketId: string;
  inquiryType: string;
  subject: string;
  message: string;

  // Metadata
  createdAt: Date;

  // Links
  siteUrl: string;
  faqUrl: string;
  supportEmail: string;
};

export type EmailTemplate = {
  /**
   * Generate email subject line
   */
  subject: (locale: Locale, data: EmailTemplateData) => string;

  /**
   * Generate HTML email content
   */
  html: (locale: Locale, data: EmailTemplateData) => string;

  /**
   * Generate plain text email content
   */
  text: (locale: Locale, data: EmailTemplateData) => string;
};

export type EmailOptions = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};
