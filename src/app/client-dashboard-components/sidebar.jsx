"use client";
import Logout from "./logout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
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
        whileHover={{ scale: 1.05 }}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <aside
            className={`fixed left-0 top-0 h-[100dvh] w-[75%] md:w-[23%] lg:w-[20%] bg-white/95 backdrop-blur-xl border-r border-gray-200 flex flex-col z-40 shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-center h-20 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h1 className="text-white font-extrabold text-2xl tracking-tight">
                  Echo<span className="text-green-100">Stats</span>
                </h1>
              </motion.div>
            </div>

            {/* User Bots Dropdown */}
            <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
              <UserBots />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ x: 6 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                        active
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`transition-colors duration-300 ${
                          active
                            ? "text-green-600"
                            : "text-gray-500 group-hover:text-green-600"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Admin Link */}
              {role === "admin" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                  whileHover={{ x: 6 }}
                >
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                      pathname === "/admin"
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    <Shield
                      size={20}
                      className={`transition-colors duration-300 ${
                        pathname === "/admin"
                          ? "text-green-600"
                          : "text-gray-500 group-hover:text-green-600"
                      }`}
                    />
                    <span>Admin</span>
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Logout />
              </motion.div>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}