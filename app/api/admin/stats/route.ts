import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find({ isActive: true }).lean();

    const statsPromises = events.map(async (event) => {
      const registrations = await Registration.find({
        eventName: event.name,
      }).lean();

      const individualCount = registrations.filter((r) => !r.isTeam).length;
      const teamCount = registrations.filter((r) => r.isTeam).length;
      const totalParticipants = registrations.reduce(
        (sum, r) => sum + r.totalParticipants,
        0
      );

      return {
        eventName: event.name,
        eventSlug: event.slug,
        totalRegistrations: registrations.length,
        individualCount,
        teamCount,
        totalParticipants,
      };
    });

    const stats = await Promise.all(statsPromises);

    return successResponse(stats);
  } catch (error) {
    return handleApiError(error, "fetching statistics");
  }
}
