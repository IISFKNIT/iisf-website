import dbConnect from "@/lib/mongodb";
import Incubation from "@/models/Incubation";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";
import { NextRequest } from "next/server";

// GET - Get single incubation application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";
    if (!isAuthenticated) {
      return unauthorizedResponse("Unauthorized");
    }

    await dbConnect();
    const { id } = await params;
    const application = await Incubation.findById(id).lean();

    if (!application) {
      return notFoundResponse("Application not found");
    }

    return successResponse(application);
  } catch (error) {
    return handleApiError(error, "fetching incubation application");
  }
}

// PUT - Update incubation application status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";
    if (!isAuthenticated) {
      return unauthorizedResponse("Unauthorized");
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Validate status
    const validStatuses = ["pending", "reviewing", "approved", "rejected"];
    if (body.status && !validStatuses.includes(body.status)) {
      return badRequestResponse("Invalid status");
    }

    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;

    const application = await Incubation.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!application) {
      return notFoundResponse("Application not found");
    }

    return successResponse(application, "Application updated successfully");
  } catch (error) {
    return handleApiError(error, "updating incubation application");
  }
}

// DELETE - Delete incubation application (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";
    if (!isAuthenticated) {
      return unauthorizedResponse("Unauthorized");
    }

    await dbConnect();
    const { id } = await params;
    const application = await Incubation.findByIdAndDelete(id);

    if (!application) {
      return notFoundResponse("Application not found");
    }

    return successResponse(null, "Application deleted successfully");
  } catch (error) {
    return handleApiError(error, "deleting incubation application");
  }
}
