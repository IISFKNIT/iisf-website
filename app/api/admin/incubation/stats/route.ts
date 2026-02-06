import dbConnect from "@/lib/mongodb";
import Incubation from "@/models/Incubation";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";
import { NextRequest } from "next/server";

// GET - Get incubation statistics for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";
    if (!isAuthenticated) {
      return unauthorizedResponse("Unauthorized");
    }

    await dbConnect();

    // Get total counts by status
    const [
      totalApplications,
      pendingCount,
      reviewingCount,
      approvedCount,
      rejectedCount,
    ] = await Promise.all([
      Incubation.countDocuments({}),
      Incubation.countDocuments({ status: "pending" }),
      Incubation.countDocuments({ status: "reviewing" }),
      Incubation.countDocuments({ status: "approved" }),
      Incubation.countDocuments({ status: "rejected" }),
    ]);

    // Get counts by stage
    const [ideaCount, mvpCount, tractionCount] = await Promise.all([
      Incubation.countDocuments({ currentStage: "idea" }),
      Incubation.countDocuments({ currentStage: "mvp" }),
      Incubation.countDocuments({ currentStage: "early-traction" }),
    ]);

    // Get support needed distribution
    const supportStats = await Incubation.aggregate([
      { $unwind: "$supportNeeded" },
      { $group: { _id: "$supportNeeded", count: { $sum: 1 } } },
    ]);

    const supportDistribution = {
      mentorship: 0,
      technical: 0,
      funding: 0,
      coworking: 0,
    };
    supportStats.forEach((s) => {
      if (s._id in supportDistribution) {
        supportDistribution[s._id as keyof typeof supportDistribution] =
          s.count;
      }
    });

    // Get recent applications trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyApplications = await Incubation.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse({
      totalApplications,
      byStatus: {
        pending: pendingCount,
        reviewing: reviewingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      byStage: {
        idea: ideaCount,
        mvp: mvpCount,
        earlyTraction: tractionCount,
      },
      supportDistribution,
      dailyTrend: dailyApplications,
    });
  } catch (error) {
    return handleApiError(error, "fetching incubation stats");
  }
}
