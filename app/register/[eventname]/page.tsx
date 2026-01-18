import RegistrationForm from "@/components/RegistrationForm";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";

interface EventRegistrationProps {
  params: Promise<{
    eventname: string;
  }>;
}

export default async function EventRegistrationPage({
  params,
}: EventRegistrationProps) {
  const { eventname } = await params;
  const slug = decodeURIComponent(eventname);

  await dbConnect();
  const event = await Event.findOne({ slug, isActive: true }).lean();

  if (!event) {
    notFound();
  }

  return <RegistrationForm eventName={event.name} />;
}
