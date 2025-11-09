"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardWelcome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 relative overflow-hidden">
      {/* Soft blurred background accents */}
      <div className="absolute w-72 h-72 bg-green-100 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-teal-100 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center px-6 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
          Manage your conversations, explore insights, and connect smarter — all in one place.
        </p>
      </motion.div>

      {/* Beautiful CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 relative z-10"
      >
        <Link href="/dashboard/analytics">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(16,185,129,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition"
          >
            🚀 Go to Analytics
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
