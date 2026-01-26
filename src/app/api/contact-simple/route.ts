/**
 * Simplified Contact Form API - For Debugging
 *
 * This version doesn't use:
 * - Database (no ticket saving)
 * - Email templates (uses simple text)
 * - Rate limiting
 *
 * Use this to isolate the problem.
 */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const simpleSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    // Check SMTP credentials
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    console.log('SMTP Check:', {
      host: !!smtpHost,
      user: !!smtpUser,
      pass: !!smtpPass,
    });

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured',
          details: {
            host: !!smtpHost,
            user: !!smtpUser,
            pass: !!smtpPass,
          },
        },
        { status: 500 },
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    const data = simpleSchema.parse(body);
    console.log('Validated data:', data);

    // Create Nodemailer transporter
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send simple email
    console.log('Sending email...');
    await transporter.sendMail({
      from: `"Tradelia Test" <${smtpUser}>`,
      to: smtpUser, // Send to ourselves for testing
      replyTo: data.email,
      subject: `Test: ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    });

    console.log('Email sent successfully!');

    return NextResponse.json({
      success: true,
      message: 'Test email sent',
    });
  } catch (error) {
    console.error('Simple contact error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
