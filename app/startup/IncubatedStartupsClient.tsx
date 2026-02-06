"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Startup {
  _id: string;
  name: string;
  slug: string;
  email: string;
  mobileNumber: string;
  incubatedDate: string;
  incubationDetails?: string;
  status: "incubated" | "non-incubated";
  website?: string;
  image?: string;
}

interface IncubatedStartupsClientProps {
  startups: Startup[];
}

const stats = [
  {
    label: "Startups Incubated",
    value: "50+",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    label: "Total Funding Raised",
    value: "₹10Cr+",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Jobs Created",
    value: "200+",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    label: "Success Rate",
    value: "85%",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
];

export default function IncubatedStartupsClient({
  startups,
}: IncubatedStartupsClientProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.05),transparent_50%)]" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 backdrop-blur-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              IISF Incubation Center
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="text-slate-900">Incubated </span>
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Startups
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Discover the innovative startups nurtured at IISF, KNIT Sultanpur.
            From idea to impact, we support entrepreneurs in building
            world-changing solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#startups">
              <button className="px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                View Startups
              </button>
            </Link>
            <Link href="/events">
              <button className="px-8 py-3 rounded-full font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-orange-500/50 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                Join Events
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-3 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Startups Grid */}
      <section id="startups" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Meet the visionary founders and innovative startups that are
              shaping the future through technology and entrepreneurship.
            </p>
          </div>

          {startups.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Startups Yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We&apos;re currently onboarding exciting startups. Check back
                soon to see our growing portfolio!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <div
                  key={startup._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  {/* Image/Logo */}
                  <div className="relative h-40 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
                    {startup.image ? (
                      <Image
                        src={startup.image}
                        alt={startup.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-black text-orange-500/30">
                          {startup.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          startup.status === "incubated"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {startup.status === "incubated"
                          ? "Incubated"
                          : "Non-Incubated"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {startup.name}
                    </h3>

                    {startup.incubationDetails && (
                      <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                        {startup.incubationDetails}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Since {new Date(startup.incubatedDate).getFullYear()}
                    </div>

                    {startup.website && (
                      <Link href={startup.website} target="_blank">
                        <button className="w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                          Visit Website
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Apply for Incubation CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 backdrop-blur-sm mb-6">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Join Our Incubation Program
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              Have an{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Innovative Idea?
              </span>
            </h2>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Apply for our incubation program and get access to mentorship,
              funding opportunities, workspace, and a thriving community of
              entrepreneurs.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/incubate">
                <button className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                  Apply Now
                  <svg
                    className="w-5 h-5 inline-block ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </Link>
              <Link href="/">
                <button className="px-8 py-4 rounded-full font-bold text-white border-2 border-slate-600 hover:border-orange-500/50 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Incubate With Us?
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide comprehensive support to help your startup succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Expert Mentorship",
                desc: "Get guidance from industry experts and successful entrepreneurs.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Funding Support",
                desc: "Access to angel investors, VCs, and government grants.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
                title: "Co-working Space",
                desc: "Modern workspace with all amenities at KNIT Sultanpur.",
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Network Access",
                desc: "Connect with a thriving community of founders and partners.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
