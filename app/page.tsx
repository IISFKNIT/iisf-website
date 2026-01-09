import Navbar from "@/components/Navbar";

export default function Home() {
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
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
            Welcome to IISF
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Join our community of innovators, entrepreneurs, and tech
            enthusiasts. Discover exciting events and opportunities!
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-20">
          <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🚀</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Innovation
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Foster creativity and develop groundbreaking solutions
            </p>
          </div>
          <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💡</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Incubation
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Transform ideas into successful startups with mentorship
            </p>
          </div>
          <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition sm:col-span-2 md:col-span-1">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Community
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Connect with like-minded innovators and entrepreneurs
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 sm:mt-20 py-6 sm:py-8 border-t">
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
