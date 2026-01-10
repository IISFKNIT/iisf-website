"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";

// Dynamic imports for 3D components
const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
            {["Innovation", "Incubation", "&", "Startup", "Foundation"].map(
              (word, wordIndex) => (
                <span key={wordIndex} className="inline-flex">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={letterIndex}
                      className={`inline-block ${
                        word === "&"
                          ? "text-white mx-1"
                          : wordIndex < 2
                          ? "bg-gradient-to-b from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent"
                          : "bg-gradient-to-b from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
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
                        textShadow: "0 4px 20px rgba(249,115,22,0.3)",
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
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Empowering the next generation of entrepreneurs at{" "}
          <span className="text-blue-400 font-semibold">KNIT Sultanpur</span>.
          From ideation to IPO-ready ventures with mentorship, grants &
          community support.
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              ₹28.75L+
            </p>
            <p className="text-xs text-slate-500 mt-1">Grants Enabled</p>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-orange-400">
              29+ Cr
            </p>
            <p className="text-xs text-slate-500 mt-1">Revenue Generated</p>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-black text-blue-400">48+</p>
            <p className="text-xs text-slate-500 mt-1">Startups Incubated</p>
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-8 py-4 text-base sm:text-lg font-bold text-white backdrop-blur-sm"
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl overflow-hidden"
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
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
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
              <p className="mt-3 text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Grant Highlight */}
        <motion.div
          className="mt-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-cyan-500/10 p-10 backdrop-blur-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Government & Private Grants
              </div>
              <p className="text-5xl sm:text-6xl font-black text-white mb-2">
                ₹ 28.75 <span className="text-emerald-400">Lakh</span>
              </p>
              <p className="text-slate-400 text-lg">
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Revenue{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Generated
            </span>
          </h2>
        </motion.div>

        {/* Revenue Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueData.map((item, index) => (
            <motion.div
              key={index}
              className="group relative rounded-3xl border border-white/10 bg-slate-900/70 p-7 backdrop-blur-xl overflow-hidden"
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
                className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${item.color}60, transparent)`,
                }}
              />

              {/* Rank badge */}
              <div
                className="absolute -top-3 -right-3 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg border-4 border-slate-950"
                style={{ backgroundColor: item.color, color: "#0f172a" }}
              >
                #{index + 1}
              </div>

              <div className="relative z-10">
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-5 leading-tight min-h-[3rem]">
                  {item.name}
                </h3>
                <div className="pt-4 border-t border-white/10">
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
          className="mt-16 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900/95 via-emerald-950/30 to-slate-900/95 p-12 backdrop-blur-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.15),transparent_50%)]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/15 px-5 py-2 text-sm font-semibold text-orange-300 mb-5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400"></span>
                </span>
                Combined Portfolio Revenue
              </div>
              <motion.p
                className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
              >
                29+ Cr
              </motion.p>
              <p className="mt-4 text-slate-400 text-lg">
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Three{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pillars
            </span>
          </h2>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillarsData.map((pillar, index) => (
            <motion.div
              key={index}
              className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-10 backdrop-blur-xl overflow-hidden"
              initial={{ opacity: 0, y: 80, rotateX: -20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -20, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
              />

              <motion.div
                className={`inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${pillar.gradient} shadow-lg mb-8`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-4xl">{pillar.icon}</span>
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {pillar.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
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
        <div className="rounded-[2.5rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-slate-900/50 to-blue-500/10 p-12 sm:p-16 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", delay: 0.3 }}
              className="text-6xl mb-8"
            >
              ✨
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Build the Next
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-blue-400 bg-clip-text text-transparent">
                Big Thing?
              </span>
            </h2>

            <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto">
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

function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Leaderboard", href: "#" },
    { name: "Team", href: "#" },
  ];

  const resourceLinks = [
    { name: "Media Gallery", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/iisf-knit",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/iisf_knit",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/iisf-knit",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Section 1: Logo & Introduction */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/iisf-logo.png"
                alt="IISF Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="text-lg font-bold text-white">IISF</h3>
                <p className="text-xs text-orange-400">KNIT Sultanpur</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Programming and Tech Skills Club at KNIT Sultanpur. Empowering
              students with cutting-edge programming skills and fostering
              innovation.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-500/20 hover:border-orange-500/50 transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-orange-400 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <svg
                  className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  KNIT Sultanpur, Kamla Nehru Institute of Technology,
                  Sultanpur, UP
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <svg
                  className="w-5 h-5 text-orange-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:iisf@knit.ac.in"
                  className="hover:text-orange-400 transition-colors"
                >
                  iisf@knit.ac.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <svg
                  className="w-5 h-5 text-orange-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+917500380171"
                  className="hover:text-orange-400 transition-colors"
                >
                  +91 75003 80171
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()}, Innovation, Incubation and Startup
              Foundation KNIT Sultanpur. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Made with <span className="text-red-500">❤</span> by IISF Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
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
