import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { validateEvent } from "@/lib/validations";
import {
  successResponse,
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  handleApiError,
  isAuthenticated,
} from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const filter = activeOnly ? { isActive: true } : {};
    const events = await Event.find(filter).sort({ createdAt: -1 }).lean();

    return successResponse(events);
  } catch (error) {
    return handleApiError(error, "fetching events");
  }
}

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
      description,
      date,
      maxTeamSize = 4,
      minTeamSize = 1,
    } = body;

    const validation = validateEvent({
      name,
      slug,
      description,
      date,
      maxTeamSize,
      minTeamSize,
    });
    if (!validation.isValid) {
      return badRequestResponse(validation.error!);
    }

    const event = await Event.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      date: date.trim(),
      maxTeamSize,
      minTeamSize,
      isActive: true,
    });

    return createdResponse(event, "Event created successfully");
  } catch (error) {
    return handleApiError(error, "creating event");
  }
}
