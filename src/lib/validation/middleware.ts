/**
 * Validation Middleware for API Routes (2026)
 *
 * Provides type-safe validation for Next.js API routes
 * with comprehensive error handling and sanitization
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================================================
// VALIDATION ERROR TYPES
// ============================================================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errors: Array<{ field: string; message: string }> };

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate data against a Zod schema
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        error: 'Validation failed',
        errors,
      };
    }

    return {
      success: false,
      error: 'Unknown validation error',
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
}

/**
 * Validate and throw on error (for use in API routes)
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T {
  const result = validate(schema, data);

  if (!result.success) {
    throw new ValidationError(result.error, result.errors);
  }

  return result.data;
}

// ============================================================================
// REQUEST BODY VALIDATION
// ============================================================================

/**
 * Validate request body (JSON)
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    return validate(schema, body);
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON body',
      errors: [{ field: 'body', message: 'Request body must be valid JSON' }],
    };
  }
}

/**
 * Validate request body and throw on error
 */
export async function validateBodyOrThrow<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const result = await validateBody(request, schema);

  if (!result.success) {
    throw new ValidationError(result.error, result.errors);
  }

  return result.data;
}

// ============================================================================
// QUERY PARAMETERS VALIDATION
// ============================================================================

/**
 * Validate query parameters
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): ValidationResult<T> {
  const { searchParams } = new URL(request.url);
  const query: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return validate(schema, query);
}

/**
 * Validate query parameters and throw on error
 */
export function validateQueryOrThrow<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): T {
  const result = validateQuery(request, schema);

  if (!result.success) {
    throw new ValidationError(result.error, result.errors);
  }

  return result.data;
}

// ============================================================================
// ROUTE PARAMETERS VALIDATION
// ============================================================================

/**
 * Validate route parameters (dynamic segments)
 */
export function validateParams<T>(
  params: Record<string, string | string[]>,
  schema: z.ZodSchema<T>,
): ValidationResult<T> {
  return validate(schema, params);
}

/**
 * Validate route parameters and throw on error
 */
export function validateParamsOrThrow<T>(
  params: Record<string, string | string[]>,
  schema: z.ZodSchema<T>,
): T {
  const result = validateParams(params, schema);

  if (!result.success) {
    throw new ValidationError(result.error, result.errors);
  }

  return result.data;
}

// ============================================================================
// VALIDATION MIDDLEWARE WRAPPER
// ============================================================================

/**
 * Wrap an API route handler with validation
 *
 * @example
 * export const POST = withValidation(
 *   { body: userSchema },
 *   async (request, { body }) => {
 *     // body is typed and validated
 *     return NextResponse.json({ user: body });
 *   }
 * );
 */
export function withValidation<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
>(
  schemas: {
    body?: z.ZodSchema<TBody>;
    query?: z.ZodSchema<TQuery>;
    params?: z.ZodSchema<TParams>;
  },
  handler: (
    request: NextRequest,
    validated: {
      body?: TBody;
      query?: TQuery;
      params?: TParams;
    },
  ) => Promise<NextResponse> | NextResponse,
) {
  return async (
    request: Request,
  ): Promise<Response> => {
    try {
      // Convert Request to NextRequest for validation
      const nextRequest = request as NextRequest;

      const validated: {
        body?: TBody;
        query?: TQuery;
        params?: TParams;
      } = {};

      // Validate body
      if (schemas.body) {
        validated.body = await validateBodyOrThrow(nextRequest, schemas.body);
      }

      // Validate query
      if (schemas.query) {
        validated.query = validateQueryOrThrow(nextRequest, schemas.query);
      }

      // Call handler with validated data
      return await handler(nextRequest, validated);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            error: error.message,
            errors: error.errors,
          },
          { status: error.statusCode },
        );
      }

      // Re-throw other errors to be handled by error handler
      throw error;
    }
  };
}

// ============================================================================
// SANITIZATION HELPERS
// ============================================================================

/**
 * Sanitize HTML from string (remove all tags)
 */
export function sanitizeHTML(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeHTML(item) :
        typeof item === 'object' ? sanitizeObject(item) :
        item,
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// ============================================================================
// ERROR RESPONSE HELPERS
// ============================================================================

/**
 * Create validation error response
 */
export function validationErrorResponse(
  errors: Array<{ field: string; message: string }>,
  message: string = 'Validation failed',
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      errors,
    },
    { status: 400 },
  );
}

/**
 * Create single field error response
 */
export function fieldErrorResponse(
  field: string,
  message: string,
): NextResponse {
  return validationErrorResponse([{ field, message }]);
}
