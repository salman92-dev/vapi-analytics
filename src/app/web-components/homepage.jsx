"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, BarChart, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "Multi-Client Management",
      desc: "Easily add, view, and manage clients with isolated dashboards and API credentials.",
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Usage Analytics",
      desc: "Track API calls, performance metrics, and client usage in real-time with visual charts.",
      icon: <BarChart className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Role-Based Access",
      desc: "Separate dashboards for admins and clients with strict permission control.",
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Data Security",
      desc: "All API keys and usage data are encrypted and stored with top-tier protection.",
      icon: <Lock className="w-6 h-6 text-green-600" />,
    },
  ];

  const steps = [
    { step: "1", title: "Add Clients", desc: "Register new clients with their API credentials securely." },
    { step: "2", title: "Fetch Usage", desc: "Automatically fetch data from Vapi with your secure backend." },
    { step: "3", title: "View Analytics", desc: "Visualize API activity, performance, and usage trends." },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      {/* 🌟 Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.15),transparent_60%)]"></div>
        <div className="2xl:container mx-auto px-6 py-32 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[4.3rem] md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Track Your <span className="text-green-600">Stats</span> with Clarity
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6 text-lg"
          >
            Manage clients, monitor API usage, and visualize analytics — all in one secure, modern dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-4 mt-10"
          >
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 text-base font-medium shadow-lg hover:shadow-blue-200">
                Get Started
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                Learn More
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ⚡ Features Section */}
      <section id="features" className="container mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Powerful Features for Teams & Clients
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-60 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⚙️ How It Works */}
      <section className="relative py-24 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-16"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="text-5xl font-extrabold text-green-600">{s.step}</div>
                <h3 className="font-semibold text-xl">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="relative container mx-auto px-6 py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6"
        >
          Start Managing Your Clients’ Usage Today
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
          Simplify tracking, visualize insights, and keep your clients’ API data organized securely.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/login">
            <Button
              size="lg"
              className="rounded-full px-8 text-base font-medium shadow-lg hover:shadow-blue-200 transition"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* 🌙 Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} <span className="font-medium text-green-600">EchoStats</span>. All rights reserved.
      </footer>
    </main>
  );
}
