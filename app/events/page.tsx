import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import EventsClient from "@/components/EventsClient";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    await dbConnect();
    const events = await Event.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return events.map((event) => ({
      _id: event._id.toString(),
      name: event.name,
      slug: event.slug,
      description: event.description,
      date: event.date,
      isActive: event.isActive,
    }));
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsClient events={events} />;
}
