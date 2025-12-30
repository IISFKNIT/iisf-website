import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string;
}

export type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 500;

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NOT_FOUND: "NOT_FOUND",
  EVENT_NOT_FOUND: "EVENT_NOT_FOUND",
  REGISTRATION_NOT_FOUND: "REGISTRATION_NOT_FOUND",
  DUPLICATE: "DUPLICATE",
  ALREADY_REGISTERED: "ALREADY_REGISTERED",
  SERVER_ERROR: "SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
} as const;

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === "true";
}

export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({ success: true, message, data } as ApiResponse<T>, {
    status: 200,
  });
}

export function createdResponse<T>(
  data: T,
  message: string = "Created successfully"
): NextResponse {
  return NextResponse.json({ success: true, message, data } as ApiResponse<T>, {
    status: 201,
  });
}

export function badRequestResponse(
  error: string,
  details?: string
): NextResponse {
  return NextResponse.json({ success: false, error, details } as ApiResponse, {
    status: 400,
  });
}

export function unauthorizedResponse(
  error: string = "Unauthorized"
): NextResponse {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 401,
  });
}

export function forbiddenResponse(
  error: string = "Access denied"
): NextResponse {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 403,
  });
}

export function notFoundResponse(
  error: string = "Resource not found"
): NextResponse {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 404,
  });
}

export function conflictResponse(error: string): NextResponse {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 409,
  });
}

export function serverErrorResponse(
  error: string = "Internal server error"
): NextResponse {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 500,
  });
}

export function handleApiError(error: unknown, context: string): NextResponse {
  if (typeof error === "object" && error !== null && "code" in error) {
    const mongoError = error as {
      code: number;
      keyPattern?: Record<string, unknown>;
    };

    if (mongoError.code === 11000) {
      const keys = mongoError.keyPattern
        ? Object.keys(mongoError.keyPattern).join(", ")
        : "field";
      return conflictResponse(`Duplicate entry: ${keys} already exists`);
    }
  }

  if (typeof error === "object" && error !== null && "name" in error) {
    const namedError = error as { name: string; message: string };

    if (namedError.name === "ValidationError") {
      return badRequestResponse("Validation failed", namedError.message);
    }
  }

  if (error instanceof Error) {
    const message =
      process.env.NODE_ENV === "development"
        ? error.message
        : "An unexpected error occurred";
    return serverErrorResponse(message);
  }

  return serverErrorResponse("An unexpected error occurred");
}
