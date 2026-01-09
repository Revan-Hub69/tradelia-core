/**
 * Server API Types - Tradelia 2026
 */

import type { NextRequest, NextResponse } from 'next/server';

export interface ApiHandler {
  GET?: (request: NextRequest) => Promise<NextResponse>;
  POST?: (request: NextRequest) => Promise<NextResponse>;
  PUT?: (request: NextRequest) => Promise<NextResponse>;
  DELETE?: (request: NextRequest) => Promise<NextResponse>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}