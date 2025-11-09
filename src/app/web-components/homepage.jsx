"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, BarChart, Lock, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Navbar />

      {/* 🌟 Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 py-32 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Track, Analyze, Succeed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-green-900 bg-clip-text text-transparent"
          >
            Track Your <span className="text-green-600">Stats</span>
            <br />
            with Clarity
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg leading-relaxed"
          >
            Manage clients, monitor API usage, and visualize analytics — all in one secure, modern dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <Link href="/login">
              <Button 
                size="lg" 
                className="rounded-full px-8 text-base font-medium shadow-xl hover:shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
              >
                Learn More
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ⚡ Features Section */}
      <section id="features" className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your clients and track their API usage effectively
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:border-green-200 transition-all duration-300 rounded-2xl group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⚙️ How It Works */}
      <section className="relative py-24 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-300 to-emerald-300 z-0"></div>
                )}
                
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl font-bold rounded-2xl mb-4 shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="relative container mx-auto px-6 py-28 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Start Managing Your Clients Today
            </h2>
            <p className="text-green-50 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Simplify tracking, visualize insights, and keep your {`clients'`} API data organized securely.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="rounded-full px-10 py-6 text-lg font-medium bg-white text-green-700 hover:bg-gray-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 🌙 Footer */}
      <footer className="border-t border-gray-200 py-8 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              EchoStats
            </span>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}