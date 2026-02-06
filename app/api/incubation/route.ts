import dbConnect from "@/lib/mongodb";
import Incubation from "@/models/Incubation";
import {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  createdResponse,
  handleApiError,
} from "@/lib/api-response";
import { NextRequest } from "next/server";

// GET - Fetch all incubation applications (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";
    if (!isAuthenticated) {
      return unauthorizedResponse("Unauthorized");
    }

    await dbConnect();
    const applications = await Incubation.find({})
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(applications);
  } catch (error) {
    return handleApiError(error, "fetching incubation applications");
  }
}

// POST - Submit new incubation application (public)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "startupName",
      "founderName",
      "founderEmail",
      "founderPhone",
      "founderCollege",
      "founderYear",
      "founderBranch",
      "teamSize",
      "problemStatement",
      "proposedSolution",
      "uniqueSellingPoint",
      "currentStage",
      "supportNeeded",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return badRequestResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.founderEmail)) {
      return badRequestResponse("Invalid email format");
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(body.founderPhone.replace(/\D/g, ""))) {
      return badRequestResponse("Phone number must be 10 digits");
    }

    // Validate current stage
    const validStages = ["idea", "mvp", "early-traction"];
    if (!validStages.includes(body.currentStage)) {
      return badRequestResponse("Invalid current stage");
    }

    // Validate support needed
    const validSupport = ["mentorship", "technical", "funding", "coworking"];
    if (
      !Array.isArray(body.supportNeeded) ||
      body.supportNeeded.length === 0 ||
      !body.supportNeeded.every((s: string) => validSupport.includes(s))
    ) {
      return badRequestResponse("Invalid support options selected");
    }

    // Check for duplicate application
    const existingApplication = await Incubation.findOne({
      founderEmail: body.founderEmail.toLowerCase(),
      status: { $in: ["pending", "reviewing"] },
    });

    if (existingApplication) {
      return badRequestResponse(
        "You already have a pending application. Please wait for our response.",
      );
    }

    // Create new application
    const application = await Incubation.create({
      startupName: body.startupName,
      founderName: body.founderName,
      founderEmail: body.founderEmail.toLowerCase(),
      founderPhone: body.founderPhone,
      founderCollege: body.founderCollege,
      founderYear: body.founderYear,
      founderBranch: body.founderBranch,
      teamSize: body.teamSize,
      problemStatement: body.problemStatement,
      proposedSolution: body.proposedSolution,
      uniqueSellingPoint: body.uniqueSellingPoint,
      currentStage: body.currentStage,
      supportNeeded: body.supportNeeded,
      additionalInfo: body.additionalInfo || "",
      status: "pending",
    });

    return createdResponse(
      {
        id: application._id,
        startupName: application.startupName,
        founderName: application.founderName,
        status: application.status,
      },
      "Application submitted successfully! We'll review and get back to you soon.",
    );
  } catch (error) {
    return handleApiError(error, "submitting incubation application");
  }
}
