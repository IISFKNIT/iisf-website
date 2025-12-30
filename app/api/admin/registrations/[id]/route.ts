import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Participant from "@/models/Participant";
import {
  successResponse,
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

    const registration = await Registration.findById(id);
    if (!registration) {
      return notFoundResponse("Registration not found");
    }

    await Participant.deleteMany({ registrationId: id });
    await Registration.deleteOne({ _id: id });

    return successResponse(
      { deletedRegistrationId: id },
      "Registration deleted successfully"
    );
  } catch (error) {
    return handleApiError(error, "deleting registration");
  }
}
