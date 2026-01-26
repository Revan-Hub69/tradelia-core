/**
 * Follow-up Tickets Cron Job
 *
 * Runs daily at 9 AM to send follow-up emails to users
 * who haven't received a response after 24 hours.
 *
 * Vercel Cron: 0 9 * * * (9 AM UTC daily)
 */

import { and, eq, isNull, lt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import {
  contactFollowupTemplate,
  type EmailTemplateData,
  type Locale,
} from '@/lib/email-templates';
import { db } from '@/libs/DB';
import { supportTicketsSchema } from '@/models/Schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Check SMTP credentials
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@tradelia.org';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradelia.org';

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 },
      );
    }

    // Find tickets that need follow-up
    // Criteria:
    // - Status is 'open'
    // - Created more than 24 hours ago
    // - No follow-up sent yet (followUpSentAt is null)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const ticketsNeedingFollowup = await db
      .select()
      .from(supportTicketsSchema)
      .where(
        and(
          eq(supportTicketsSchema.status, 'open'),
          lt(supportTicketsSchema.createdAt, twentyFourHoursAgo),
          isNull(supportTicketsSchema.followUpSentAt),
        ),
      )
      .limit(50); // Process max 50 tickets per run

    if (ticketsNeedingFollowup.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tickets need follow-up',
        processed: 0,
      });
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send follow-up emails
    let successCount = 0;
    let errorCount = 0;

    for (const ticket of ticketsNeedingFollowup) {
      try {
        const locale: Locale = ticket.userLocale as Locale;

        const templateData: EmailTemplateData = {
          name: ticket.userName,
          email: ticket.userEmail,
          phone: ticket.userPhone || undefined,
          ticketId: ticket.id,
          inquiryType: ticket.inquiryType,
          subject: ticket.subject,
          message: ticket.message,
          createdAt: ticket.createdAt,
          siteUrl,
          faqUrl: `${siteUrl}/faq`,
          supportEmail,
        };

        // Send follow-up email
        await transporter.sendMail({
          from: `"Tradelia Support" <${smtpUser}>`,
          to: ticket.userEmail,
          replyTo: supportEmail,
          subject: contactFollowupTemplate.subject(locale, templateData),
          html: contactFollowupTemplate.html(locale, templateData),
          text: contactFollowupTemplate.text(locale, templateData),
        });

        // Update ticket: mark follow-up as sent
        await db
          .update(supportTicketsSchema)
          .set({
            followUpSentAt: new Date(),
            followUpCount: sql`${supportTicketsSchema.followUpCount} + 1`,
          })
          .where(eq(supportTicketsSchema.id, ticket.id));

        successCount++;
      } catch (error) {
        console.error(`Failed to send follow-up for ticket ${ticket.id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Follow-up emails sent`,
      processed: ticketsNeedingFollowup.length,
      sent: successCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error('Follow-up cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
