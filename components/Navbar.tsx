"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="text-xl sm:text-2xl font-bold text-blue-600">
              IISF
            </span>
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Innovation & Incubation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition px-3 py-2"
            >
              Home
            </Link>
            <Link
              href="/events"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-sm sm:text-base"
            >
              Explore Events
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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
        {isMenuOpen && (
          <div className="sm:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                className="px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-center"
              >
                Explore Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
