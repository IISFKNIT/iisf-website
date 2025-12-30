import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Participant from "@/models/Participant";
import { validateRegistration, type RegistrationData } from "@/lib/validations";
import {
  createdResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";

type RouteParams = { params: Promise<{ eventSlug: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { eventSlug } = await params;
    const eventName = decodeURIComponent(eventSlug);

    const body = await request.json();
    const {
      participationType,
      teamName,
      leaderName,
      leaderGender,
      leaderRollNumber,
      leaderContactNumber,
      leaderEmail,
      teamMembers = [],
    } = body;

    const registrationData: RegistrationData = {
      participationType,
      teamName,
      leaderName,
      leaderGender,
      leaderRollNumber,
      leaderContactNumber,
      leaderEmail,
      teamMembers,
    };

    const validation = validateRegistration(registrationData);
    if (!validation.isValid) {
      return badRequestResponse(validation.error!);
    }

    const isTeam = participationType === "team";
    const totalParticipants = isTeam ? teamMembers.length + 1 : 1;

    const registration = await Registration.create({
      eventName,
      isTeam,
      teamName: isTeam ? teamName.trim() : undefined,
      leaderEmail: leaderEmail.trim().toLowerCase(),
      totalParticipants,
    });

    const participantsData = [
      {
        registrationId: registration._id,
        name: leaderName.trim(),
        gender: leaderGender,
        rollNumber: leaderRollNumber.trim().toUpperCase(),
        contactNumber: leaderContactNumber.trim(),
        email: leaderEmail.trim().toLowerCase(),
        isLeader: true,
      },
      ...teamMembers.map((m: any) => ({
        registrationId: registration._id,
        name: m.name.trim(),
        gender: m.gender,
        rollNumber: m.rollNumber.trim().toUpperCase(),
        contactNumber: m.contactNumber.trim(),
        email: m.email.trim().toLowerCase(),
        isLeader: false,
      })),
    ];

    await Participant.insertMany(participantsData);

    return createdResponse(
      {
        registrationId: registration._id,
        eventName,
        isTeam,
        teamName: registration.teamName,
        totalParticipants,
      },
      "Registration successful!"
    );
  } catch (error) {
    return handleApiError(error, "creating registration");
  }
}
