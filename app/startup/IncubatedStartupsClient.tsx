"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
}

interface IncubatedStartupsClientProps {
  startups: Startup[];
}

const stats = [
  { label: "Startups Incubated", value: "50+", icon: "🚀" },
  { label: "Total Funding Raised", value: "₹10Cr+", icon: "💰" },
  { label: "Jobs Created", value: "200+", icon: "👥" },
  { label: "Success Rate", value: "85%", icon: "📈" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 backdrop-blur-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              IISF Incubation Center
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-slate-900">Incubated </span>
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Startups
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover the innovative startups nurtured at IISF, KNIT Sultanpur.
            From idea to impact, we support entrepreneurs in building
            world-changing solutions.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="#startups">
              <motion.button
                className="px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Startups
              </motion.button>
            </Link>
            <Link href="/events">
              <motion.button
                className="px-8 py-3 rounded-full font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-orange-500/50 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Events
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium text-sm">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Startups Grid */}
      <section id="startups" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
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
          </motion.div>

          {startups.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-5xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Startups Yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We&apos;re currently onboarding exciting startups. Check back
                soon to see our growing portfolio!
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {startups.map((startup) => (
                <motion.div
                  key={startup._id}
                  variants={fadeInUp}
                  className="group relative rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden hover:border-orange-500/50 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
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

                  <div className="relative p-6">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🚀</span>
                    </div>

                    {/* Startup name */}
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">
                      {startup.name}
                    </h3>

                    {/* Email */}
                    <p className="text-sm text-slate-500 mb-2">
                      📧 {startup.email}
                    </p>

                    {/* Mobile */}
                    <p className="text-sm text-slate-500 mb-3">
                      📱 {startup.mobileNumber}
                    </p>

                    {/* Incubation Details */}
                    <div className="mb-4">
                      {startup.incubationDetails ? (
                        <p className="text-slate-600 text-sm line-clamp-2">
                          {startup.incubationDetails}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-sm italic">
                          Add Incubation Details
                        </p>
                      )}
                    </div>

                    {/* Incubated Date */}
                    <div className="flex items-center gap-2 text-sm text-orange-600 font-medium mb-6">
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
                      Incubated on{" "}
                      {startup.incubatedDate
                        ? new Date(startup.incubatedDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : "N/A"}
                    </div>

                    {/* Website button */}
                    <Link
                      href={startup.website || "/not-found"}
                      target={startup.website ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Explore
                        <svg
                          className="w-4 h-4 inline-block ml-2"
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
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Apply for Incubation CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 backdrop-blur-sm mb-6">
              <span>💡</span> Join Our Incubation Program
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
              <motion.button
                className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
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
              </motion.button>
              <Link href="/">
                <motion.button
                  className="px-8 py-4 rounded-full font-bold text-white border-2 border-slate-600 hover:border-orange-500/50 transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Incubate With Us?
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide comprehensive support to help your startup succeed.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: "🎯",
                title: "Expert Mentorship",
                desc: "Get guidance from industry experts and successful entrepreneurs.",
              },
              {
                icon: "💰",
                title: "Funding Support",
                desc: "Access to angel investors, VCs, and government grants.",
              },
              {
                icon: "🏢",
                title: "Co-working Space",
                desc: "Modern workspace with all amenities at KNIT Sultanpur.",
              },
              {
                icon: "🤝",
                title: "Network Access",
                desc: "Connect with a thriving community of founders and partners.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{benefit.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
