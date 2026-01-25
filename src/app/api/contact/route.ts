import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { contactFormSchema } from '@/types/contact';

export async function POST(request: Request) {
  try {
    // Initialize Resend (only if API key is available)
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured',
        },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);

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

    // Send email via Resend
    await resend.emails.send({
      from: 'Tradelia Contact <noreply@tradelia.com>',
      to: process.env.SUPPORT_EMAIL || 'support@tradelia.com',
      replyTo: data.email,
      subject: `[Contact Form] ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
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
