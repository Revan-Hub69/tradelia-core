import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { contactFormSchema } from '@/types/contact';

export async function POST(request: Request) {
  try {
    // Check Brevo API key
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
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

    // Send email via Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'Tradelia Contact',
          email: 'noreply@tradelia.org',
        },
        to: [
          {
            email: process.env.SUPPORT_EMAIL || 'support@tradelia.org',
            name: 'Tradelia Support',
          },
        ],
        replyTo: {
          email: data.email,
          name: data.name,
        },
        subject: `[Contact Form] ${data.subject}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      throw new Error('Failed to send email via Brevo');
    }

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
