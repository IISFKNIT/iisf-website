import { NextRequest, NextResponse } from "next/server";
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
  handleApiError,
} from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
      return serverErrorResponse("Admin password not configured");
    }

    if (!password || typeof password !== "string") {
      return unauthorizedResponse("Password is required");
    }

    if (password !== ADMIN_PASSWORD) {
      return unauthorizedResponse("Invalid password");
    }

    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error, "admin login");
  }
}

export async function DELETE() {
  const response = successResponse(null, "Logged out successfully");
  response.cookies.delete("admin-auth");
  return response;
}
