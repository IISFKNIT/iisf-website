import dbConnect from "@/lib/mongodb";
import Startup from "@/models/Startup";
import IncubatedStartupsClient from "./IncubatedStartupsClient";

export const dynamic = "force-dynamic";

async function getStartups() {
  try {
    await dbConnect();
    const startups = await Startup.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return startups.map((startup) => ({
      _id: startup._id.toString(),
      name: startup.name,
      slug: startup.slug,
      email: startup.email,
      mobileNumber: startup.mobileNumber,
      incubatedDate: startup.incubatedDate
        ? startup.incubatedDate.toISOString()
        : "",
      incubationDetails: startup.incubationDetails || "",
      status: startup.status,
      website: startup.website || "",
    }));
  } catch {
    return [];
  }
}

export default async function IncubatedStartupsPage() {
  const startups = await getStartups();

  return <IncubatedStartupsClient startups={startups} />;
}
