import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import Startup from "@/models/Startup";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "upcoming-events") {
      const now = new Date().toISOString().split("T")[0];
      const events = await Event.find({
        isActive: true,
        date: { $gte: now },
      })
        .sort({ date: 1 })
        .limit(3)
        .lean();

      return successResponse(events);
    }

    if (type === "startups") {
      const startups = await Startup.find({
        isActive: true,
        status: "incubated",
      })
        .sort({ incubatedDate: -1 })
        .limit(3)
        .lean();

      return successResponse(startups);
    }

    return successResponse({
      message: "Use ?type=upcoming-events or ?type=startups",
    });
  } catch (error) {
    return handleApiError(error, "fetching homepage data");
  }
}
