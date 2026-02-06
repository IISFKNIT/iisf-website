import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Startup from "@/models/Startup";
import { validateStartup } from "@/lib/validations";
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  handleApiError,
  isAuthenticated,
} from "@/lib/api-response";

// GET - Fetch all startups (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (activeOnly) filter.isActive = true;
    if (status) filter.status = status;

    const startups = await Startup.find(filter).sort({ createdAt: -1 }).lean();

    return successResponse(startups);
  } catch (error) {
    return handleApiError(error, "fetching startups");
  }
}

// POST - Create a new startup (admin only)
export async function POST(request: NextRequest) {
  try {
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
      image,
    } = body;

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

    const startup = await Startup.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      mobileNumber: mobileNumber.trim(),
      incubatedDate: new Date(incubatedDate),
      incubationDetails: incubationDetails?.trim() || undefined,
      status,
      website: website?.trim() || undefined,
      image: image?.trim() || undefined,
      isActive: true,
    });

    return createdResponse(startup, "Startup created successfully");
  } catch (error) {
    return handleApiError(error, "creating startup");
  }
}
