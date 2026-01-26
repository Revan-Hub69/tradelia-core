import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

import {
  contactConfirmationTemplate,
  contactNotificationTemplate,
  detectLocale,
  type EmailTemplateData,
  generateTicketId,
  type Locale,
} from '@/lib/email-templates';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { db } from '@/libs/DB';
import { supportTicketsSchema } from '@/models/Schema';
import { contactFormSchema } from '@/types/contact';

export async function POST(request: Request) {
  try {
    // Check SMTP credentials
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@tradelia.org';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradelia.org';

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured',
        },
        { status: 500 },
      );
    }

    // Get IP for rate limiting
    const ip = getClientIp(request);

    // Check rate limit (3 requests per hour)
    const rateLimitResult = await rateLimit(ip, {
      limit: 3,
      window: '1 h',
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data = contactFormSchema.parse(body);

    // Check honeypot field
    if (data.website) {
      // Bot detected - return success but don't send email
      return NextResponse.json({ success: true, message: 'Message sent' });
    }

    // Detect user locale
    const acceptLanguage = request.headers.get('accept-language');
    const locale: Locale = detectLocale(acceptLanguage);

    // Generate ticket ID
    const ticketId = generateTicketId();

    // Prepare email template data
    const templateData: EmailTemplateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      ticketId,
      inquiryType: data.inquiryType,
      subject: data.subject,
      message: data.message,
      createdAt: new Date(),
      siteUrl,
      faqUrl: `${siteUrl}/faq`,
      supportEmail,
    };

    // Create Nodemailer transporter with Aruba SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send notification email to support team
    await transporter.sendMail({
      from: `"Tradelia Contact Form" <${smtpUser}>`,
      to: supportEmail,
      replyTo: data.email,
      subject: contactNotificationTemplate.subject(locale, templateData),
      html: contactNotificationTemplate.html(locale, templateData),
      text: contactNotificationTemplate.text(locale, templateData),
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Tradelia Support" <${smtpUser}>`,
      to: data.email,
      replyTo: supportEmail,
      subject: contactConfirmationTemplate.subject(locale, templateData),
      html: contactConfirmationTemplate.html(locale, templateData),
      text: contactConfirmationTemplate.text(locale, templateData),
    });

    // Save ticket to database (only if DATABASE_URL is configured)
    if (process.env.DATABASE_URL) {
      try {
        await db.insert(supportTicketsSchema).values({
          id: ticketId,
          status: 'open',
          priority: 'medium',
          userName: data.name,
          userEmail: data.email,
          userPhone: data.phone,
          userLocale: locale,
          inquiryType: data.inquiryType,
          subject: data.subject,
          message: data.message,
          source: 'contact_form',
          userAgent: request.headers.get('user-agent') || undefined,
          ipAddress: ip,
        });
      } catch (dbError) {
        // Log error but don't fail the request
        // Emails were sent successfully, ticket creation is secondary
        console.error('Failed to save ticket to database:', dbError);
      }
    } else {
      console.log('DATABASE_URL not configured, skipping ticket save');
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      ticketId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 },
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 },
    );
  }
}
