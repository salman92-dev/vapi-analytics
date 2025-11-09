"use client";
import Logout from "./logout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Settings,
  Users,
  Menu,
  X,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import UserBots from "./user-bots";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Conversations", href: "/dashboard/conversation", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [role, setRole] = useState(null);

  // Detect screen width
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load role from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setRole(JSON.parse(user).role);
    }
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-emerald-600 to-green-500 text-white p-2 rounded-md flex items-center gap-2 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
        
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            className={`fixed left-0 top-0 h-[100dvh] w-[75%] md:w-[23%] lg:w-[20%] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200/60 dark:border-gray-700/60 text-gray-900 dark:text-white flex flex-col z-40 shadow-xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-center h-16 bg-gradient-to-r from-emerald-600 to-green-500 shadow-sm text-white font-bold text-xl tracking-wide">
              EchoStats
            </div>

            {/* User Bots Dropdown */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <UserBots />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-emerald-100 dark:bg-emerald-700/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`${
                          active
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Admin Link */}
              {role === "admin" && (
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === "/admin"
                        ? "bg-emerald-100 dark:bg-emerald-700/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Shield
                      size={18}
                      className={`${
                        pathname === "/admin"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Logout />
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
