"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart2,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Brain,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Add Client", href: "/admin/add-client", icon: Users },
  { name: "All Clients", href: "/admin/clients", icon: Users },
  { name: "Assign a Bot", href: "/admin/assign-bot", icon: Brain },
  { name: "All  Bots", href: "/admin/bots", icon: Bot },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // ✅ Detect screen width to handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ☰ Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed top-3 left-4 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-black p-2 rounded-md flex items-center gap-2 shadow-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
        <span className={`${isOpen ? "hidden" : "block"}`}>EchoStats</span>
      </button>

      {/* 🧱 Sidebar */}
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "linear" }}
            className={`fixed left-0 top-0 h-[100dvh] w-[70%] md:w-[20%] 
              bg-white dark:bg-gray-900 
              text-gray-900 dark:text-white 
              flex flex-col z-40 shadow-lg 
              lg:translate-x-0 transition-colors duration-300`}
          >
            {/* 🔷 Logo Section */}
            <div className="flex items-center px-16 md:px-8 h-16 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                EchoStats
              </h1>
            </div>

            {/* 🧭 Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)} // close sidebar on mobile click
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ⚙️ Bottom Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full transition-colors">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔲 Overlay for Mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/60 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
