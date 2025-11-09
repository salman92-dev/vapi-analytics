"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart2, ArrowRight, Sparkles, LocateFixed, Brain, Compass } from "lucide-react";

export default function DashboardWelcome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/40 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-96 h-96 bg-green-200/30 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-green-300/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center px-6 relative z-10 max-w-4xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-full text-sm font-medium text-green-700 mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Your Command Center</span>
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-green-900 bg-clip-text text-transparent">
            Welcome to Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Manage your conversations, explore insights, and connect smarter — all in one beautifully designed place.
        </p>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { label: "Conversations", value: "Track", icon: LocateFixed   },
            { label: "Analytics", value: "Analyze", icon: Brain },
            { label: "Insights", value: "Discover", icon: Compass },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-2xl mb-1 flex justify-center"><item.icon className="text-green-600" size={20}/></div>
              <div className="text-sm text-gray-500 font-medium">{item.label}</div>
              <div className="text-lg font-bold text-gray-900">{item.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex justify-center flex-wrap gap-4 relative z-10"
      >
        <Link href="/dashboard/analytics">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(16,185,129,0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-3"
          >
            <BarChart2 className="w-5 h-5" />
            <span>View Analytics</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>

        <Link href="/dashboard/conversation">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(16,185,129,0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 text-lg font-semibold rounded-full bg-white text-gray-700 border-2 border-green-200 shadow-lg hover:bg-green-50 hover:border-green-300 transition-all duration-300"
          >
            Browse Conversations
          </motion.button>
        </Link>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-400 z-10"
      >
      </motion.div>
    </div>
  );
}