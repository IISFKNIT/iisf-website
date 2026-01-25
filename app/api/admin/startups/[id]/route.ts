import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Startup from "@/models/Startup";
import { validateStartup } from "@/lib/validations";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
  handleApiError,
  isAuthenticated,
} from "@/lib/api-response";

interface Params {
  params: Promise<{ id: string }>;
}

// GET - Fetch single startup by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!(await isAuthenticated())) {
      return unauthorizedResponse("Authentication required");
    }

    await dbConnect();

    const startup = await Startup.findById(id).lean();

    if (!startup) {
      return notFoundResponse("Startup not found");
    }

    return successResponse(startup);
  } catch (error) {
    return handleApiError(error, "fetching startup");
  }
}

// PUT - Update startup
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!(await isAuthenticated())) {
      return unauthorizedResponse("Authentication required");
    }

    await dbConnect();

    const body = await request.json();
    const {
      name,
      slug,
      email,
      mobileNumber,
      incubatedDate,
      incubationDetails,
      status,
      website,
      isActive,
    } = body;

    // Only validate if we have the required fields (partial update support)
    if (name && slug && email && mobileNumber && incubatedDate && status) {
      const validation = validateStartup({
        name,
        slug,
        email,
        mobileNumber,
        incubatedDate,
        status,
      });

      if (!validation.isValid) {
        return badRequestResponse(validation.error!);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (mobileNumber !== undefined)
      updateData.mobileNumber = mobileNumber.trim();
    if (incubatedDate !== undefined)
      updateData.incubatedDate = new Date(incubatedDate);
    if (incubationDetails !== undefined)
      updateData.incubationDetails = incubationDetails?.trim() || undefined;
    if (status !== undefined) updateData.status = status;
    if (website !== undefined)
      updateData.website = website?.trim() || undefined;
    if (isActive !== undefined) updateData.isActive = isActive;

    const startup = await Startup.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!startup) {
      return notFoundResponse("Startup not found");
    }

    return successResponse(startup, "Startup updated successfully");
  } catch (error) {
    return handleApiError(error, "updating startup");
  }
}

// DELETE - Delete startup
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!(await isAuthenticated())) {
      return unauthorizedResponse("Authentication required");
    }

    await dbConnect();

    const startup = await Startup.findByIdAndDelete(id).lean();

    if (!startup) {
      return notFoundResponse("Startup not found");
    }

    return successResponse(null, "Startup deleted successfully");
  } catch (error) {
    return handleApiError(error, "deleting startup");
  }
}
