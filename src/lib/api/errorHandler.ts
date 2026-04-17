import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof Error) {
    // Known error types
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        {
          error: 'Resource already exists',
          code: 'DUPLICATE_RESOURCE',
          timestamp: new Date().toISOString(),
        },
        { status: 409 },
      );
    }

    if (error.message.includes('foreign key')) {
      return NextResponse.json(
        {
          error: 'Invalid reference',
          code: 'INVALID_REFERENCE',
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Resource not found',
          code: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      );
    }
  }

  // Generic server error
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    },
    { status: 500 },
  );
};

// ✅ CRITICAL FIX: Explicit function signature (TypeScript best practice 2026)
// Research: Feature-Sliced Design 2026 - "Function type is essentially 'any' for functions"
type AsyncHandler = (...args: any[]) => Promise<any>;

export const withErrorHandler = (handler: AsyncHandler) => {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
};