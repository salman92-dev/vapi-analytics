"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate authentication logic
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <Navbar />

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex justify-center items-center px-6 py-24 pt-36"
      >
        <Card className="w-full max-w-md border-none shadow-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl font-bold">
              Welcome Back 👋
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Log in to manage your Vapi clients and monitor usage analytics.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="pl-10 py-6 rounded-xl border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 py-6 rounded-xl border-gray-300 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between text-sm mt-2">
                <Link
                  href="/forgot-password"
                  className="text-red-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full mt-6 py-6 text-base font-medium rounded-full shadow-md hover:shadow-blue-200 transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
                Don’t have an account?{" "}
                <Link href="/register" className="text-green-600 hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.section>

      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} <span className="font-medium text-green-600">EchoStats</span>. All rights reserved.

      </footer>
    </main>
  );
}
