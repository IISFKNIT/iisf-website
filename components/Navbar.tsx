"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-orange-500/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition group"
          >
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/iisf-logo.png"
                alt="IISF Logo"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-lg"
              />
            </motion.div>
            <div className="hidden md:flex flex-col">
              <span className="text-base font-bold text-white tracking-wide">
                IISF
              </span>
              <span className="text-[10px] text-slate-400">KNIT Sultanpur</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="text-slate-300 hover:text-white font-medium transition px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Home
            </Link>
            <Link href="/events">
              <motion.button
                className="px-6 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_8px_30px_rgba(249,115,22,0.4)] text-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Events
              </motion.button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="sm:hidden py-4 border-t border-orange-500/20 bg-slate-950/95 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-200 hover:text-white font-medium transition px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2.5 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg text-center"
                >
                  Explore Events
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
