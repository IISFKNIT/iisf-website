"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamic imports for 3D components
const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
  ),
});

const Hero3D = dynamic(() => import("@/components/three/Hero3D"), {
  ssr: false,
});
const Stats3D = dynamic(() => import("@/components/three/Stats3D"), {
  ssr: false,
});
const Cards3D = dynamic(() => import("@/components/three/Cards3D"), {
  ssr: false,
});

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

// Stats data
const statsData = [
  { value: "07", label: "Student Startups", icon: "🎓", color: "#3b82f6" },
  { value: "01", label: "Faculty Startups", icon: "👨‍🏫", color: "#8b5cf6" },
  { value: "10", label: "Grants Received", icon: "🏆", color: "#f97316" },
  { value: "48", label: "Total Incubated", icon: "🚀", color: "#10b981" },
];

// Revenue data
const revenueData = [
  {
    name: "BiddrX Tech India Pvt. Ltd.",
    revenue: "10 Cr+",
    icon: "💎",
    color: "#f97316",
  },
  {
    name: "Putato e Solutions Pvt. Ltd.",
    revenue: "8 Cr+",
    icon: "🥔",
    color: "#10b981",
  },
  {
    name: "BroadBuy Technovative",
    revenue: "6 Cr+",
    icon: "🛒",
    color: "#3b82f6",
  },
  {
    name: "Renaissance Global Marketing",
    revenue: "5 Cr+",
    icon: "🌐",
    color: "#8b5cf6",
  },
  {
    name: "Three Point One Four Glasses",
    revenue: "85L+",
    icon: "👓",
    color: "#06b6d4",
  },
];

// Pillars data
const pillarsData = [
  {
    icon: "🚀",
    title: "Innovation",
    description:
      "Hackathons, ideation sprints and project studios where KNIT students explore deep tech innovation.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "💡",
    title: "Incubation",
    description:
      "Dedicated mentoring, market access and grant facilitation for startup-ready ideas.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: "🤝",
    title: "Community",
    description:
      "A strong peer network of builders, alumni founders and mentors scaling together.",
    gradient: "from-purple-500 to-pink-500",
  },
];

// Animated Counter Component
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}

// Section Components
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ opacity, scale }}
    >
      <motion.div
        className="max-w-5xl mx-auto text-center z-10"
        style={{ y }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center mb-4 mt-16 sm:mt-20"
        >
          <motion.div
            className="relative inline-flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-blue-500/30 rounded-full blur-3xl scale-150" />
            <img
              src="/iisf-logo.png"
              alt="IISF Logo"
              className="relative h-32 sm:h-40 md:h-48 w-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* 3D Animated Title - Letter by Letter */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight flex flex-wrap justify-center gap-x-3 sm:gap-x-4 text-slate-900">
            {["Innovation", "Incubation", "&", "Startup", "Foundation"].map(
              (word, wordIndex) => (
                <span key={wordIndex} className="inline-flex">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={letterIndex}
                      className={`inline-block ${
                        word === "&"
                          ? "text-orange-500 mx-1"
                          : wordIndex < 2
                          ? "text-slate-900"
                          : "text-slate-900"
                      }`}
                      initial={{
                        opacity: 0,
                        y: 50,
                        rotateX: -90,
                        scale: 0.5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: wordIndex * 0.3 + letterIndex * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: 1.2,
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      style={{
                        textShadow: "none",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              )
            )}
          </h1>

          {/* Abbreviation below */}
          <motion.div
            className="flex justify-center items-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            {["I", "I", "S", "F"].map((letter, index) => (
              <motion.span
                key={index}
                className="text-4xl sm:text-5xl md:text-6xl font-black"
                initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  delay: 2.2 + index * 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.3,
                  rotateY: 15,
                  transition: { duration: 0.2 },
                }}
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(135deg, #f97316, #fbbf24)"
                      : index === 1
                      ? "linear-gradient(135deg, #fbbf24, #f97316)"
                      : index === 2
                      ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                      : "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 20px rgba(249,115,22,0.5))",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2.5 text-xs sm:text-sm font-medium text-orange-300 backdrop-blur-md mb-6"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          KNIT Sultanpur · Official Startup & Innovation Club
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          Empowering the next generation of entrepreneurs at{" "}
          <span className="text-blue-600 font-semibold">KNIT Sultanpur</span>.
          From ideation to IPO-ready ventures with mentorship, grants &
          community support.
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">
              ₹28.75L+
            </p>
            <p className="text-xs text-slate-600 mt-1">Grants Enabled</p>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-orange-500">
              29+ Cr
            </p>
            <p className="text-xs text-slate-600 mt-1">Revenue Generated</p>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-blue-600">48+</p>
            <p className="text-xs text-slate-600 mt-1">Startups Incubated</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/events">
            <motion.button
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base sm:text-lg font-bold text-white shadow-[0_20px_50px_rgba(249,115,22,0.5)]"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explore Events</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          </Link>
          <Link href="#stats">
            <motion.button
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base sm:text-lg font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              whileHover={{ scale: 1.05, borderColor: "rgba(249,115,22,0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Our Impact</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="stats"
      ref={ref}
      className="relative py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs sm:text-sm font-medium text-blue-300 backdrop-blur-sm mb-6">
            <span className="text-base">📊</span>
            Impact Numbers
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 overflow-hidden"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                borderColor: stat.color,
                boxShadow: `0 30px 60px -15px ${stat.color}40`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}, transparent)`,
                }}
              />

              <div className="text-4xl mb-4">{stat.icon}</div>
              <p
                className="text-6xl sm:text-7xl font-black"
                style={{ color: stat.color }}
              >
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="mt-3 text-slate-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Grant Highlight */}
        <motion.div
          className="mt-16 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-10 shadow-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-700 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Government & Private Grants
              </div>
              <p className="text-5xl sm:text-6xl font-black text-slate-900 mb-2">
                ₹ 28.75 <span className="text-emerald-600">Lakh</span>
              </p>
              <p className="text-slate-600 text-lg">
                Total grants secured by IISF startups
              </p>
            </div>

            <motion.div
              className="h-28 w-28 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-[0_25px_60px_rgba(16,185,129,0.5)]"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-6xl">💰</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RevenueSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs sm:text-sm font-medium text-orange-300 backdrop-blur-sm mb-6">
            <span className="text-base">💎</span>
            Portfolio Performance
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Revenue{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Generated
            </span>
          </h2>
        </motion.div>

        {/* Revenue Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueData.map((item, index) => (
            <motion.div
              key={index}
              className="group relative rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 overflow-hidden"
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -15,
                rotateY: 5,
                boxShadow: `0 40px 80px -20px ${item.color}40`,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${item.color}60, transparent)`,
                }}
              />

              {/* Rank badge */}
              <div
                className="absolute -top-3 -right-3 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white"
                style={{ backgroundColor: item.color, color: "#fff" }}
              >
                #{index + 1}
              </div>

              <div className="relative z-10">
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-5 leading-tight min-h-[3rem]">
                  {item.name}
                </h3>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Revenue
                  </p>
                  <p
                    className="text-4xl font-black"
                    style={{ color: item.color }}
                  >
                    {item.revenue}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Revenue */}
        <motion.div
          className="mt-16 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50 p-12 shadow-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_50%)]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-600 mb-5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                Combined Portfolio Revenue
              </div>
              <motion.p
                className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
              >
                29+ Cr
              </motion.p>
              <p className="mt-4 text-slate-600 text-lg">
                Growing every quarter with new success stories
              </p>
            </div>

            <motion.div
              className="h-32 w-32 rounded-3xl bg-gradient-to-br from-orange-400 via-amber-400 to-emerald-500 flex items-center justify-center shadow-[0_30px_80px_rgba(249,115,22,0.6)]"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-7xl">🚀</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PillarsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs sm:text-sm font-medium text-purple-300 backdrop-blur-sm mb-6">
            <span className="text-base">🏛️</span>
            What We Do
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Three{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Pillars
            </span>
          </h2>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillarsData.map((pillar, index) => (
            <motion.div
              key={index}
              className="group relative rounded-3xl border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50 overflow-hidden"
              initial={{ opacity: 0, y: 80, rotateX: -20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -20, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <motion.div
                className={`inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${pillar.gradient} shadow-lg mb-8 text-white`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-4xl">{pillar.icon}</span>
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                {pillar.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="rounded-[2.5rem] border border-orange-500/20 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-12 sm:p-16 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", delay: 0.3 }}
              className="text-6xl mb-8"
            >
              ✨
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Ready to Build the Next
              <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-blue-500 bg-clip-text text-transparent">
                Big Thing?
              </span>
            </h2>

            <p className="text-slate-600 text-xl mb-12 max-w-2xl mx-auto">
              Join IISF and get access to mentorship, funding, and a thriving
              community.
            </p>

            <Link href="/events">
              <motion.button
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 px-12 py-5 text-xl font-bold text-white shadow-[0_25px_60px_rgba(249,115,22,0.5)]"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                style={{ backgroundSize: "200%" }}
              >
                <span>Explore Events</span>
                <svg
                  className="w-6 h-6 group-hover:translate-x-2 transition-transform"
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
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}



// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 3D Scene Background */}
      <Scene3D>
        <Hero3D />
      </Scene3D>

      {/* Navigation */}
      <Navbar />

      {/* Content Sections */}
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <RevenueSection />
        <PillarsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
