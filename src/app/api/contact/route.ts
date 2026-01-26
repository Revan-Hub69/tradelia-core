import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { contactFormSchema } from '@/types/contact';

export async function POST(request: Request) {
  try {
    // Check SMTP credentials
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

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

    // Map inquiry type to readable label
    const inquiryTypeLabels = {
      general: 'General Inquiry',
      technical: 'Technical Support',
      account: 'Account Issue',
      billing: 'Billing Question',
      feedback: 'Feedback',
      other: 'Other',
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
      to: process.env.SUPPORT_EMAIL || 'support@tradelia.org',
      replyTo: data.email,
      subject: `[${inquiryTypeLabels[data.inquiryType]}] ${data.subject}`,
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #667eea; margin-top: 0; font-size: 18px;">Contact Information</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #666;">Name:</td>
                      <td style="padding: 8px 0;">${data.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #666;">Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></td>
                    </tr>
                    ${
                      data.phone
                        ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #666;">Phone:</td>
                      <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a></td>
                    </tr>
                    `
                        : ''
                    }
                    <tr>
                      <td style="padding: 8px 0; font-weight: 600; color: #666;">Inquiry Type:</td>
                      <td style="padding: 8px 0;"><span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${inquiryTypeLabels[data.inquiryType]}</span></td>
                    </tr>
                  </table>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #667eea; margin-top: 0; font-size: 18px;">Subject</h2>
                  <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">${data.subject}</p>
                  <h2 style="color: #667eea; margin-top: 0; font-size: 18px;">Message</h2>
                  <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                  Sent from Tradelia Contact Form • ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
            </body>
          </html>
        `,
    });

    // Send auto-reply confirmation to user
    await transporter.sendMail({
      from: `"Tradelia Support" <${smtpUser}>`,
      to: data.email,
      subject: `We received your message: ${data.subject}`,
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="margin: 0 0 15px 0; font-size: 16px;">Hi ${data.name},</p>
                  <p style="margin: 0 0 15px 0;">We've received your message and our support team will review it shortly.</p>
                  <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #667eea;">What happens next?</p>
                    <ul style="margin: 0; padding-left: 20px;">
                      <li style="margin-bottom: 8px;">Our team will review your ${inquiryTypeLabels[data.inquiryType].toLowerCase()}</li>
                      <li style="margin-bottom: 8px;">You'll receive a response within 24 hours</li>
                      <li style="margin-bottom: 8px;">Check your spam folder if you don't see our reply</li>
                    </ul>
                  </div>
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #666;">
                    <strong>Your message:</strong><br>
                    <em>"${data.subject}"</em>
                  </p>
                </div>
                <div style="text-align: center; padding: 20px 0;">
                  <p style="margin: 0 0 15px 0; color: #666;">Need immediate help?</p>
                  <a href="https://tradelia.org/faq" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 0 5px;">Visit FAQ</a>
                  <a href="mailto:support@tradelia.org" style="display: inline-block; background: white; color: #667eea; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; border: 2px solid #667eea; margin: 0 5px;">Email Us</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                  © ${new Date().getFullYear()} Tradelia. All rights reserved.<br>
                  <a href="https://tradelia.org" style="color: #667eea; text-decoration: none;">tradelia.org</a>
                </p>
              </div>
            </body>
          </html>
        `,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
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
