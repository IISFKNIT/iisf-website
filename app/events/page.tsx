import Link from "next/link";
import Navbar from "@/components/Navbar";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    await dbConnect();
    const events = await Event.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return events.map((event) => ({
      ...event,
      _id: event._id.toString(),
    }));
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Innovation & Incubation Startup Foundation
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Your College Innovation Hub
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            Welcome to IISF
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Join our community of innovators, entrepreneurs, and tech
            enthusiasts. Register for exciting events and competitions!
          </p>
        </div>

        {/* Events Section */}
        <div className="mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Upcoming Events
          </h3>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No events available at the moment.
              </p>
              <p className="text-gray-500 mt-2">
                Check back soon for exciting opportunities!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {events.map((event: any) => (
                <div
                  key={event.slug}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 sm:p-6 border border-gray-200"
                >
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {event.name}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    {event.description}
                  </p>
                  <p className="text-sm text-indigo-600 font-semibold mb-4">
                    📅 {event.date}
                  </p>
                  <Link
                    href={`/register/${event.slug}`}
                    className="inline-block w-full text-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    Register Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16">
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Innovation
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Foster creativity and develop groundbreaking solutions
            </p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💡</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Incubation
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Transform ideas into successful startups with mentorship
            </p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md sm:col-span-2 md:col-span-1">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🤝</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Community
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Connect with like-minded innovators and entrepreneurs
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 sm:mt-16 py-6 sm:py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm sm:text-base">
          <p>
            © 2025 Innovation & Incubation Startup Foundation. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
