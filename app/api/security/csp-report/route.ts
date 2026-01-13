import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CSPViolationHandler, AuditLogger } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const violationReport = await request.json();
    
    // Handle CSP violation
    CSPViolationHandler.handleViolation(violationReport);
    
    // Log the violation for monitoring
    AuditLogger.log('csp_violation_reported', {
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString()
    }, undefined, 'warning');
    
    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}