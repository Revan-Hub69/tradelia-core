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
import { db } from '@/lib/DB';
import { supportTicketsSchema } from '@/models/Schema';
import { contactFormSchema } from '@/types/contact';
import { AppConfig } from '@/utils/AppConfig';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const supportEmail = process.env.SUPPORT_EMAIL || AppConfig.supportEmail;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradelia.org';

    const ip = getClientIp(request);

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

    const body = await request.json();
    const data = contactFormSchema.parse(body);

    if (data.website) {
      return NextResponse.json({ success: true, message: 'Message sent' });
    }

    const acceptLanguage = request.headers.get('accept-language');
    const locale: Locale = detectLocale(acceptLanguage);
    const ticketId = generateTicketId();

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
        console.error('DB error:', dbError);
      }
    }

    if (smtpHost && smtpUser && smtpPass) {
      try {
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

        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            minVersion: 'TLSv1.2',
            ciphers: 'HIGH:!aNULL:!MD5',
          },
        });

        await transporter.sendMail({
          from: `"Tradelia Contact Form" <${smtpUser}>`,
          to: supportEmail,
          replyTo: data.email,
          subject: contactNotificationTemplate.subject(locale, templateData),
          html: contactNotificationTemplate.html(locale, templateData),
          text: contactNotificationTemplate.text(locale, templateData),
        });

        await transporter.sendMail({
          from: `"Tradelia Support" <${smtpUser}>`,
          to: data.email,
          replyTo: supportEmail,
          subject: contactConfirmationTemplate.subject(locale, templateData),
          html: contactConfirmationTemplate.html(locale, templateData),
          text: contactConfirmationTemplate.text(locale, templateData),
        });
      } catch (emailError) {
        console.error('SMTP error:', emailError);
      }
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

    console.error('Contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 },
    );
  }
}
