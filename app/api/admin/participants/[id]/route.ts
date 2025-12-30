import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Participant from "@/models/Participant";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
  handleApiError,
  isAuthenticated,
} from "@/lib/api-response";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthenticated())) {
      return unauthorizedResponse("Authentication required");
    }

    await dbConnect();

    const { id } = await params;

    const participant = await Participant.findById(id);
    if (!participant) {
      return notFoundResponse("Participant not found");
    }

    if (participant.isLeader) {
      return badRequestResponse(
        "Cannot delete team leader. Delete the entire registration instead."
      );
    }

    const registration = await Registration.findById(
      participant.registrationId
    );
    if (!registration) {
      return notFoundResponse("Registration not found");
    }

    if (!registration.isTeam) {
      return badRequestResponse(
        "Cannot delete participant from solo registration. Delete the entire registration instead."
      );
    }

    if (registration.totalParticipants <= 2) {
      return badRequestResponse(
        "Team must have at least 2 members. Delete the entire registration instead."
      );
    }

    await Participant.deleteOne({ _id: id });
    await Registration.updateOne(
      { _id: participant.registrationId },
      { $inc: { totalParticipants: -1 } }
    );

    return successResponse(
      { deletedParticipantId: id },
      "Participant removed from team successfully"
    );
  } catch (error) {
    return handleApiError(error, "deleting participant");
  }
}
