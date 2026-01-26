/**
 * Test Contact API - Minimal version for debugging
 */

import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    console.log('=== Contact Test API Started ===');

    // Step 1: Check environment variables
    const envCheck = {
      smtp_host: !!process.env.SMTP_HOST,
      smtp_user: !!process.env.SMTP_USER,
      smtp_pass: !!process.env.SMTP_PASS,
      database_url: !!process.env.DATABASE_URL,
    };

    console.log('Environment check:', envCheck);

    if (!envCheck.smtp_host || !envCheck.smtp_user || !envCheck.smtp_pass) {
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP not configured',
          details: envCheck,
        },
        { status: 500 },
      );
    }

    // Step 2: Parse body
    const body = await request.json();
    console.log('Request body received:', Object.keys(body));

    // Step 3: Try to import nodemailer
    console.log('Importing nodemailer...');
    const nodemailer = await import('nodemailer');
    console.log('Nodemailer imported successfully');

    // Step 4: Create transporter
    console.log('Creating transporter...');
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        minVersion: 'TLSv1.2',
        ciphers: 'HIGH:!aNULL:!MD5',
      },
      logger: true,
      debug: true,
    });
    console.log('Transporter created');

    // Step 5: Send simple test email
    console.log('Sending test email...');
    await transporter.sendMail({
      from: `"Tradelia Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to ourselves
      subject: 'Test Email from Contact Form',
      text: `Test email sent at ${new Date().toISOString()}\n\nBody: ${JSON.stringify(body, null, 2)}`,
    });
    console.log('Email sent successfully!');

    return NextResponse.json({
      success: true,
      message: 'Test email sent',
      env: envCheck,
    });
  } catch (error) {
    console.error('=== Contact Test API Error ===');
    console.error('Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
